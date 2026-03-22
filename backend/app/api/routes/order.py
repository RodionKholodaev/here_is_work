# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession

# from app.schemas.order import OrderCreate, OrderResponse, OrderFullResponse
# from app.db.database import get_session
# from app.api.deps import get_current_user
# from app.db.models import Order, User, OrderStatus
# from app.services.price_service import PriceService
# from sqlalchemy import select

# from typing import List

# router = APIRouter(prefix="/order", tags=["order"])




# @router.post(
#     "",
#     response_model=OrderResponse
# )
# async def create_order(
#     data: OrderCreate,
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     if user.role != "client":
#         raise HTTPException(
#             status_code=403,
#             detail="Only client can create order"
#         )

#     price = PriceService.calculate_price()

#     order = Order(

#         client_id=user.id,

#         type=data.type,
#         area=data.area,

#         latitude=data.latitude,
#         longitude=data.longitude,

#         comment=data.comment,

#         urgency=data.urgency,

#         time_start=data.time_start,
#         time_end=data.time_end,

#         status=OrderStatus.SEARCHING,

#         price=price
#     )

#     session.add(order)

#     await session.commit()

#     await session.refresh(order)

#     return order


# @router.get(
#     "/{order_id}",
#     response_model=OrderResponse
# )
# async def get_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     order = await session.get(
#         Order,
#         order_id
#     )

#     if not order:
#         raise HTTPException(
#             status_code=404,
#             detail="Order not found"
#         )

#     worker = None

#     if order.worker_id:

#         worker_obj = await session.get(
#             User,
#             order.worker_id
#         )

#         worker = {
#             "id": worker_obj.id, #type: ignore
#             "name": worker_obj.name #type: ignore
#         }

#     return {
#         "id": order.id,
#         "status": order.status,
#         "price": float(order.price),
#         "worker": worker
#     }


# from typing import List

# @router.get(
#     "/my",
#     response_model=List[OrderFullResponse]
# )
# async def my_orders(
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     result = await session.execute(
#         select(Order)
#         .where(Order.client_id == user.id)
#         .order_by(Order.created_at.desc())
#     )

#     orders = result.scalars().all()

#     return orders


# @router.post(
#     "/{order_id}/cancel"
# )
# async def cancel_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     order = await session.get(
#         Order,
#         order_id
#     )

#     if not order:
#         raise HTTPException(
#             status_code=404
#         )

#     if order.client_id != user.id:
#         raise HTTPException(
#             status_code=403
#         )

#     order.status = OrderStatus.CANCELLED

#     await session.commit()

#     return {
#         "status": "cancelled"
#     }

# @router.get(
#     "/available",
#     response_model=List[OrderFullResponse]
# )
# async def available_orders(
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     if user.role != "worker":
#         raise HTTPException(403)

#     result = await session.execute(
#         select(Order).where(
#             Order.status == OrderStatus.SEARCHING
#         )
#     )

#     orders = result.scalars().all()

#     return orders


# @router.post("/orders/{order_id}/accept")
# async def accept_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     user: User = Depends(get_current_user)
# ):

#     if user.role != "worker":
#         raise HTTPException(403)

#     order = await session.get(Order, order_id)

#     if not order:
#         raise HTTPException(404)

#     if order.status != "searching":
#         raise HTTPException(
#             400,
#             "Order already taken"
#         )

#     # назначаем исполнителя

#     order.worker_id = user.id

#     # считаем время прибытия

#     travel_minutes = estimate_travel_time(
#         worker_lat=user.latitude,
#         worker_lon=user.longitude,
#         order_lat=order.latitude,
#         order_lon=order.longitude
#     )

#     # время начала

#     time_start = datetime.utcnow() + timedelta(
#         minutes=travel_minutes
#     )

#     # длительность работы

#     duration_minutes = estimate_duration(
#         area=order.area,
#         type=order.type
#     )

#     # время окончания

#     time_end = time_start + timedelta(
#         minutes=duration_minutes
#     )

#     # цена

#     price = calculate_price(
#         area=order.area,
#         duration=duration_minutes,
#         travel_time=travel_minutes,
#         urgency=order.urgency
#     )

#     order.time_start = time_start
#     order.time_end = time_end
#     order.price = price

#     order.status = "assigned"

#     await session.commit()

#     return {
#         "status": "assigned"
#     }