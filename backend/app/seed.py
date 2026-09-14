from datetime import date, time

from app.db.database import SessionLocal
from app.models.trainer import Trainer
from app.models.availability import Availability


def seed():
    db = SessionLocal()

    try:
        trainer = db.query(Trainer).first()

        if not trainer:
            trainer = Trainer(
                name="Alex Morgan",
                specialty="Strength & Conditioning Coach",
                bio=(
                    "I help people build strength, improve their conditioning, "
                    "and develop sustainable training habits."
                ),
                price=25,
                rating=4.9,
                experience_years=6,
                sessions_count=320,
            )

            db.add(trainer)
            db.commit()
            db.refresh(trainer)

        existing_slots = (
            db.query(Availability)
            .filter(Availability.trainer_id == trainer.id)
            .count()
        )

        if existing_slots > 0:
            print("Availability already exists.")
            return

        slots = [
            ("2026-09-15", "09:00"),
            ("2026-09-15", "10:30"),
            ("2026-09-15", "14:00"),
            ("2026-09-15", "18:00"),

            ("2026-09-16", "09:00"),
            ("2026-09-16", "12:00"),
            ("2026-09-16", "16:30"),
            ("2026-09-16", "19:30"),

            ("2026-09-17", "10:30"),
            ("2026-09-17", "14:00"),
            ("2026-09-17", "18:00"),
            ("2026-09-17", "21:00"),

            ("2026-09-18", "09:00"),
            ("2026-09-18", "12:00"),
            ("2026-09-18", "16:30"),
            ("2026-09-18", "19:30"),

            ("2026-09-19", "10:30"),
            ("2026-09-19", "14:00"),
            ("2026-09-19", "18:00"),
        ]

        for slot_date, slot_time in slots:
            availability = Availability(
                trainer_id=trainer.id,
                date=date.fromisoformat(slot_date),
                start_time=time.fromisoformat(slot_time),
            )

            db.add(availability)

        db.commit()

        print(f"Created {len(slots)} availability slots.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()