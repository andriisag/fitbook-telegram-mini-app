from datetime import date, time

from sqlalchemy import Date, ForeignKey, Integer, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.trainer import Trainer


class Availability(Base):
    __tablename__ = "availabilities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("trainers.id"),
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

    trainer = relationship("Trainer")