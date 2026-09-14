from datetime import date, time

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from app.db.database import engine, SessionLocal
from app.models.booking import Booking
from app.telegram_auth import validate_telegram_init_data


app = FastAPI(title="FitBook API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://6cb3-178-212-106-203.ngrok-free.app",
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


@app.get("/trainers")
def get_trainers():
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    id,
                    name,
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
    telegram_user = validate_telegram_init_data(init_data)

    telegram_user_id = telegram_user["id"]

    db = SessionLocal()

    try:
        bookings = (
            db.query(Booking)
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
                "telegram_user_id": booking.telegram_user_id,
                "customer_name": booking.customer_name,
                "date": booking.date,
                "start_time": booking.start_time,
                "status": booking.status,
            }
            for booking in bookings
        ]

    finally:
        db.close()


@app.delete("/bookings/{booking_id}")
def cancel_booking(
    booking_id: int,
    init_data: str,
):
    telegram_user = validate_telegram_init_data(init_data)

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