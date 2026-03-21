from datetime import datetime, time
from typing import Optional
from sqlalchemy import JSON
from sqlalchemy import ForeignKey, String, Text, Integer, Boolean, TIMESTAMP, Numeric, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


# Base
class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    password_hash: Mapped[str] = mapped_column(String(255))
    token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # Токен для передачи в запросах, чтобы понимать что за пользователь
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(20))  # client / worker
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=False)

    # координаты (долгота и широта)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.utcnow
    )

    # relationships
    # worker_profile: Mapped[Optional["WorkerProfile"]] = relationship(
    #     back_populates="user", uselist=False
    # )

    # client_orders: Mapped[list["Order"]] = relationship(
    #     back_populates="client",
    #     foreign_keys="Order.client_id"
    # )

    # worker_orders: Mapped[list["Order"]] = relationship(
    #     back_populates="worker",
    #     foreign_keys="Order.worker_id"
    # )


# профиль рабочего

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    address: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    # координаты (долгота и широта)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    work_radius: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    available_from: Mapped[Optional[time]] = mapped_column(nullable=True)
    available_to: Mapped[Optional[time]] = mapped_column(nullable=True)

    is_active: Mapped[bool] = mapped_column(default=True)
    location: Mapped[str] = mapped_column()

    # # relationships
    # user: Mapped["User"] = relationship(back_populates="worker_profile")


# заказы

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    worker_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )

    type: Mapped[str] = mapped_column(String(50))

    area: Mapped[float] = mapped_column(Numeric(10, 2))

    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    scheduled_time: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    urgency: Mapped[str] = mapped_column(String(20))  # asap / scheduled

    status: Mapped[str] = mapped_column(String(20))

    price: Mapped[float] = mapped_column(Numeric(10, 2))

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.utcnow
    )

    # relationships
    client: Mapped["User"] = relationship(
        back_populates="client_orders",
        foreign_keys=[client_id]
    )

    worker: Mapped[Optional["User"]] = relationship(
        back_populates="worker_orders",
        foreign_keys=[worker_id]
    )

    payment: Mapped[Optional["Payment"]] = relationship(
        back_populates="order",
        uselist=False
    )

    review: Mapped[Optional["Review"]] = relationship(
        back_populates="order",
        uselist=False
    )


# платежи

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))

    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    status: Mapped[str] = mapped_column(String(20))  # pending / paid / failed
    payment_method: Mapped[str] = mapped_column(String(20))

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.utcnow
    )

    # relationships
    order: Mapped["Order"] = relationship(back_populates="payment")


# отзывы

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    worker_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.utcnow
    )

    # relationships
    order: Mapped["Order"] = relationship(back_populates="review")