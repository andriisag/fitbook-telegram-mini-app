from sqlalchemy import String, Text, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Trainer(Base):
    __tablename__ = "trainers"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(
    String(500),
    nullable=False,
)

    specialty: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    bio: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    rating: Mapped[float] = mapped_column(
        Numeric(2, 1),
        nullable=False,
        default=0,
    )

    experience_years: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    sessions_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )