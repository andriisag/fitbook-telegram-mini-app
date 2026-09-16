from datetime import date, time, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from app.db.database import engine, SessionLocal
from app.models.booking import Booking
from app.models.trainer import Trainer
from app.models.availability import Availability
from app.telegram_auth import validate_telegram_init_data
from app.config import settings

app = FastAPI(title="FitBook API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "FitBook API is running"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected",
        }

    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "details": str(e),
        }


class TrainerCreate(BaseModel):
    name: str
    image_url: str
    specialty: str
    bio: str
    price: float
    rating: float
    experience_years: int
    sessions_count: int


@app.post("/trainers")
def create_trainer(trainer_data: TrainerCreate):
    db = SessionLocal()

    try:
        trainer = Trainer(
            name=trainer_data.name,
            image_url=trainer_data.image_url,
            specialty=trainer_data.specialty,
            bio=trainer_data.bio,
            price=trainer_data.price,
            rating=trainer_data.rating,
            experience_years=trainer_data.experience_years,
            sessions_count=trainer_data.sessions_count,
        )

        db.add(trainer)
        db.commit()
        db.refresh(trainer)

        return {
            "id": trainer.id,
            "name": trainer.name,
            "image_url": trainer.image_url,
            "specialty": trainer.specialty,
            "bio": trainer.bio,
            "price": float(trainer.price),
            "rating": float(trainer.rating),
            "experience_years": trainer.experience_years,
            "sessions_count": trainer.sessions_count,
        }

    finally:
        db.close()


@app.get("/trainers")
def get_trainers():
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    id,
                    name,
                    image_url,
                    specialty,
                    bio,
                    price,
                    rating,
                    experience_years,
                    sessions_count
                FROM trainers
            """)
        )

        trainers = [
            {
                "id": row.id,
                "name": row.name,
                "image_url": row.image_url,
                "specialty": row.specialty,
                "bio": row.bio,
                "price": float(row.price),
                "rating": float(row.rating),
                "experience_years": row.experience_years,
                "sessions_count": row.sessions_count,
            }
            for row in result
        ]

    return trainers


@app.get("/trainers/{trainer_id}/availability")
def get_availability(trainer_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    a.id,
                    a.date,
                    a.start_time
                FROM availabilities a
                WHERE a.trainer_id = :trainer_id
                  AND NOT EXISTS (
                      SELECT 1
                      FROM bookings b
                      WHERE b.trainer_id = a.trainer_id
                        AND b.date = a.date
                        AND b.start_time = a.start_time
                        AND b.status = 'confirmed'
                  )
                ORDER BY a.date, a.start_time
            """),
            {"trainer_id": trainer_id},
        )

        return [
            {
                "id": row.id,
                "date": row.date,
                "time": row.start_time,
            }
            for row in result
        ]


class AvailabilityCreate(BaseModel):
    date: date
    start_time: time


@app.post("/trainers/{trainer_id}/availability")
def create_availability(
    trainer_id: int,
    availability_data: AvailabilityCreate,
):
    db = SessionLocal()

    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.id == trainer_id)
            .first()
        )

        if not trainer:
            raise HTTPException(
                status_code=404,
                detail="Trainer not found.",
            )

        existing_slot = (
            db.query(Availability)
            .filter(
                Availability.trainer_id == trainer_id,
                Availability.date == availability_data.date,
                Availability.start_time == availability_data.start_time,
            )
            .first()
        )

        if existing_slot:
            raise HTTPException(
                status_code=409,
                detail="This availability slot already exists.",
            )

        availability = Availability(
            trainer_id=trainer_id,
            date=availability_data.date,
            start_time=availability_data.start_time,
        )

        db.add(availability)
        db.commit()
        db.refresh(availability)

        return {
            "id": availability.id,
            "trainer_id": availability.trainer_id,
            "date": availability.date,
            "start_time": availability.start_time,
        }

    finally:
        db.close()


class BookingCreate(BaseModel):
    init_data: str
    trainer_id: int
    date: date
    start_time: time


@app.post("/bookings")
def create_booking(booking_data: BookingCreate):
    telegram_user = validate_telegram_init_data(
        booking_data.init_data
    )

    telegram_user_id = telegram_user["id"]

    first_name = telegram_user.get("first_name", "")
    last_name = telegram_user.get("last_name", "")

    customer_name = " ".join(
        part for part in [first_name, last_name]
        if part
    )

    if not customer_name:
        customer_name = "Telegram User"

    db = SessionLocal()

    try:
        existing_booking = (
            db.query(Booking)
            .filter(
                Booking.trainer_id == booking_data.trainer_id,
                Booking.date == booking_data.date,
                Booking.start_time == booking_data.start_time,
                Booking.status == "confirmed",
            )
            .first()
        )

        if existing_booking:
            raise HTTPException(
                status_code=409,
                detail="This time slot is already booked.",
            )

        booking = Booking(
            trainer_id=booking_data.trainer_id,
            telegram_user_id=telegram_user_id,
            customer_name=customer_name,
            date=booking_data.date,
            start_time=booking_data.start_time,
            status="confirmed",
        )

        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {
            "id": booking.id,
            "trainer_id": booking.trainer_id,
            "telegram_user_id": booking.telegram_user_id,
            "customer_name": booking.customer_name,
            "date": booking.date,
            "start_time": booking.start_time,
            "status": booking.status,
        }

    finally:
        db.close()


@app.get("/bookings")
def get_bookings(init_data: str):
    telegram_user = validate_telegram_init_data(
        init_data
    )

    telegram_user_id = telegram_user["id"]

    db = SessionLocal()

    try:
        bookings = (
            db.query(Booking, Trainer)
            .join(
                Trainer,
                Booking.trainer_id == Trainer.id,
            )
            .filter(
                Booking.telegram_user_id == telegram_user_id,
                Booking.status == "confirmed",
            )
            .order_by(
                Booking.date,
                Booking.start_time,
            )
            .all()
        )

        return [
            {
                "id": booking.id,
                "trainer_id": booking.trainer_id,
                "trainer_name": trainer.name,
                "telegram_user_id": booking.telegram_user_id,
                "customer_name": booking.customer_name,
                "date": booking.date,
                "start_time": booking.start_time,
                "status": booking.status,
            }
            for booking, trainer in bookings
        ]

    finally:
        db.close()


@app.delete("/bookings/{booking_id}")
def cancel_booking(
    booking_id: int,
    init_data: str,
):
    telegram_user = validate_telegram_init_data(
        init_data
    )

    telegram_user_id = telegram_user["id"]

    db = SessionLocal()

    try:
        booking = (
            db.query(Booking)
            .filter(
                Booking.id == booking_id,
                Booking.telegram_user_id == telegram_user_id,
                Booking.status == "confirmed",
            )
            .first()
        )

        if not booking:
            raise HTTPException(
                status_code=404,
                detail="Booking not found.",
            )

        booking.status = "cancelled"
        db.commit()

        return {
            "message": "Booking cancelled successfully.",
            "id": booking.id,
            "status": booking.status,
        }

    finally:
        db.close()


class TelegramAuthRequest(BaseModel):
    init_data: str


@app.post("/auth/telegram")
def telegram_auth(auth_data: TelegramAuthRequest):
    user = validate_telegram_init_data(
        auth_data.init_data
    )

    return {
        "message": "Telegram authentication successful.",
        "user": user,
    }

class AvailabilityBulkCreate(BaseModel):
    days: int = 5


@app.post("/trainers/{trainer_id}/availability/bulk")
def create_bulk_availability(
    trainer_id: int,
    availability_data: AvailabilityBulkCreate,
):
    db = SessionLocal()

    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.id == trainer_id)
            .first()
        )

        if not trainer:
            raise HTTPException(
                status_code=404,
                detail="Trainer not found.",
            )

        times = [
            time.fromisoformat("09:00"),
            time.fromisoformat("10:30"),
            time.fromisoformat("12:00"),
            time.fromisoformat("14:00"),
            time.fromisoformat("16:30"),
            time.fromisoformat("18:00"),
            time.fromisoformat("19:30"),
        ]

        created = 0

        for day_offset in range(availability_data.days):
            slot_date = date.today() + timedelta(
                days=day_offset
            )

            for slot_time in times:
                existing_slot = (
                    db.query(Availability)
                    .filter(
                        Availability.trainer_id == trainer_id,
                        Availability.date == slot_date,
                        Availability.start_time == slot_time,
                    )
                    .first()
                )

                if existing_slot:
                    continue

                availability = Availability(
                    trainer_id=trainer_id,
                    date=slot_date,
                    start_time=slot_time,
                )

                db.add(availability)
                created += 1

        db.commit()

        return {
            "message": "Availability created successfully.",
            "trainer_id": trainer_id,
            "days": availability_data.days,
            "created_slots": created,
        }

    finally:
        db.close()