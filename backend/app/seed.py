from datetime import date, time

from app.db.database import SessionLocal
from app.models.trainer import Trainer
from app.models.availability import Availability


TRAINERS = [
    {
        "name": "Alex Morgan",
        "image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
        "specialty": "Strength & Conditioning",
        "bio": (
            "I help people build strength, improve their conditioning, "
            "and develop sustainable training habits."
        ),
        "price": 25,
        "rating": 4.9,
        "experience_years": 6,
        "sessions_count": 320,
    },
    {
        "name": "Emma Wilson",
        "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
        "specialty": "Weight Loss & Fitness",
        "bio": (
            "I create practical training plans focused on improving fitness, "
            "building confidence, and creating sustainable habits."
        ),
        "price": 22,
        "rating": 4.8,
        "experience_years": 5,
        "sessions_count": 280,
    },
    {
        "name": "Daniel Brooks",
        "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
        "specialty": "Functional Training",
        "bio": (
            "My sessions combine strength, mobility, and functional movement "
            "to help you perform better in everyday life."
        ),
        "price": 28,
        "rating": 5.0,
        "experience_years": 8,
        "sessions_count": 410,
    },
    {
        "name": "Sophia Carter",
        "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
        "specialty": "Mobility & Yoga",
        "bio": (
            "I focus on mobility, flexibility, and mindful movement "
            "to help clients move better and feel stronger."
        ),
        "price": 20,
        "rating": 4.9,
        "experience_years": 7,
        "sessions_count": 350,
    },
    {
        "name": "James Miller",
        "image_url": "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80",
        "specialty": "Muscle Building",
        "bio": (
            "I help clients build muscle with structured strength training, "
            "progressive overload, and consistent programming."
        ),
        "price": 30,
        "rating": 4.9,
        "experience_years": 9,
        "sessions_count": 460,
    },
]


AVAILABILITY = [
    "09:00",
    "10:30",
    "12:00",
    "14:00",
    "16:30",
    "18:00",
    "19:30",
]


def seed():
    db = SessionLocal()

    try:
        existing_trainers = db.query(Trainer).count()

        if existing_trainers > 0:
            print("Trainers already exist.")
            return

        for trainer_data in TRAINERS:
            trainer = Trainer(**trainer_data)
            db.add(trainer)
            db.flush()

            for day_offset in range(5):
                slot_date = date.today()

                from datetime import timedelta

                slot_date += timedelta(days=day_offset)

                for slot_time in AVAILABILITY:
                    availability = Availability(
                        trainer_id=trainer.id,
                        date=slot_date,
                        start_time=time.fromisoformat(slot_time),
                    )

                    db.add(availability)

        db.commit()

        print(
            f"Created {len(TRAINERS)} trainers "
            "with availability."
        )

    finally:
        db.close()


if __name__ == "__main__":
    seed()