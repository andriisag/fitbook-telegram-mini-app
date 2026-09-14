from datetime import date, time

from sqlalchemy import Date, ForeignKey, Integer, String, Time, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.trainer import Trainer


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("trainers.id"),
        nullable=False,
    )

    telegram_user_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True,
    )

    customer_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="confirmed",
    )

    trainer = relationship("Trainer")