from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.order import OrderScheme, OrderResponce, CoordinatesSchema, AdressScheme
from app.db.database import get_session
from app.api.deps import get_current_user
from app.db.models import Order, User
from app.db.order_repository import OrderRepository
from app.services.time_service import TimeService
from app.services.price_service import PriceService
from sqlalchemy import select

from typing import List

router = APIRouter(prefix="/order", tags=["order"])


# @router.post("/get-coordinates", response_model=CoordinatesSchema)
# async def coordinates_route(
#     data: AdressScheme,
#     session: AsyncSession = Depends(get_session),
# ):
#     res= await get_coordinates(data.adress)
#     print(data.adress)
#     if res is None: raise ValueError("Не получилось определить координаты")
    
#     latitude, longitude = res

#     return CoordinatesSchema(
#         latitude=latitude,
#         longitude=longitude
#     )


@router.post("/get-order-info", response_model=OrderResponce)
async def order_route(
    data: OrderScheme,
    session: AsyncSession = Depends(get_session),
):
    time_start, time_end = TimeService.get_start_end_time(data.area)
    price = PriceService.get_price()
    user_id = data.user_id
    
    data2 = OrderResponce(
        price=price,
        time_start=time_start,
        time_end=time_end,
        user_id=user_id,
    )

    order = await OrderRepository.make_order(session, data, data2)

    data2.order_id = order.id
    
    return data2


@router.get(
    "/{order_id}", 
    response_model=OrderScheme,
    description="Получение заказа по его ID. Требуется авторизация."
)
async def get_order_by_client_id(
    order_id: int, # 👈 FastAPI поймет, что это параметр из URL и сразу приведет к int!
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user) # защищаем роут авторизацией
):
    # ищем заказ в базе данных
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    # если заказа нет — отдаем 404 Not Found
    if order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
        
    is_client = order.client_id == current_user.id
    is_worker = order.worker_id != current_user.id

    if is_client or is_worker:
        return order
    else:
        raise HTTPException(
            status_code=403, 
            detail="У вас нет доступа к чужому заказу"
        )



@router.get(
    "/my", 
    response_model=List[OrderScheme],
    description="Получить список заказов текущего пользователя (как клиента)"
)
async def get_my_client_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Фильтруем по client_id
    query = (
        select(Order)
        .where(Order.client_id == current_user.id)
    )
    
    result = await session.execute(query)
    orders = result.scalars().all() # список объектов
    return orders


@router.get(
    "/worker", 
    response_model=List[OrderScheme],
    description="Получить список заказов текущего пользователя (как исполнителя/воркера)"
)
async def get_my_worker_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Фильтруем по worker_id
    query = (
        select(Order)
        .where(Order.worker_id == current_user.id)
    )
    
    result = await session.execute(query)
    orders = result.scalars().all()
    return orders


@router.post(
    "/{order_id}/cancel", 
    response_model=OrderScheme,
    description="Отменить заказ. Доступно автору заказа (клиенту) или администратору."
)
async def cancel_order(
    order_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Ищем заказ в базе
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # 2. Проверяем права: отменить может только создатель заказа (клиент) или админ
    if order.client_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="У вас нет прав для отмены этого заказа"
        )

    # 3. Проверяем текущий статус: нельзя отменить то, что уже отменено или успешно завершено
    if order.status == "cancelled":
        raise HTTPException(status_code=400, detail="Заказ уже отменен")
    if order.status == "done":
        raise HTTPException(status_code=400, detail="Нельзя отменить завершенный заказ")

    # 4. Меняем статус и сохраняем
    order.status = "cancelled"
    session.add(order)
    
    await session.commit()
    await session.refresh(order)
    
    return order


@router.get(
    "/available", 
    response_model=List[OrderScheme],
    description="Получить список доступных заказов (статус 'searching')."
)
async def get_available_orders(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user) # Защищаем авторизацией
):
    # Вытаскиваем только те заказы, у которых статус "searching"
    query = (
        select(Order)
        .where(Order.status == "searching")
        .order_by(Order.created_at.desc()) # Сначала показываем самые свежие
    )
    
    result = await session.execute(query)
    orders = result.scalars().all()
    
    return orders