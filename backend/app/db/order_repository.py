from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Order
from app.schemas.order import OrderScheme, OrderResponce
from sqlalchemy import select
from fastapi import HTTPException

class OrderRepository:
    @staticmethod
    async def make_order(session: AsyncSession, data1: OrderScheme, data2: OrderResponce):
        
        order = Order(
            client_id = data1.user_id,
            type = data1.type,
            area = data1.area,
            comment = data1.comment,
            time_start = data2.time_start,
            time_end = data2.time_end,
            urgency = data1.urgency,
            status = data1.status,
            price = data2.price
        )

        session.add(order)
        await session.commit()
        await session.refresh(order)

        return order

    @staticmethod
    async def add_worker(session: AsyncSession, worker_id: int, order_id: int):

        result = await session.execute(
            select(Order).where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()

        if order is None:
            raise HTTPException(401, "Invalid worker_id")

        order.worker_id = worker_id

        await session.commit()
        await session.refresh(order)

        return order

    @staticmethod
    async def change_status(session: AsyncSession, order_id: int, status: str):
        result = await session.execute(
            select(Order).where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()

        if order is None:
            raise HTTPException(401, "Invalid worker_id")
        order.status = status

        await session.commit()
        await session.refresh(order)

        return order

