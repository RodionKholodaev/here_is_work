# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select

# from app.db.database import get_session
# from app.db.models import Order, User
# from app.api.deps import get_current_user
# from app.schemas.order import OrderScheme

# router = APIRouter(prefix="/workers/orders", tags=["worker-orders"])


# @router.post(
#     "/{order_id}/accept", 
#     response_model=OrderScheme,
#     description="Принять заказ в работу. Статус меняется на 'assigned'."
# )
# async def accept_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     current_user: User = Depends(get_current_user)
# ):
#     result = await session.execute(select(Order).where(Order.id == order_id))
#     order = result.scalar_one_or_none()

#     if not order:
#         raise HTTPException(status_code=404, detail="Заказ не найден")

#     # Бизнес-логика: взять можно только заказ в статусе поиска исполнителя
#     if order.status != "searching":
#         raise HTTPException(
#             status_code=400, 
#             detail=f"Нельзя взять заказ в статусе '{order.status}'. Нужен статус 'searching'."
#         )

#     order.worker_id = current_user.id
#     order.status = "assigned"
    
#     session.add(order)
#     await session.commit()
#     await session.refresh(order)
#     return order


# @router.post(
#     "/{order_id}/start", 
#     response_model=OrderScheme,
#     description="Начать выполнение заказа. Статус меняется на 'in_progress'."
# )
# async def start_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     current_user: User = Depends(get_current_user)
# ):
#     result = await session.execute(select(Order).where(Order.id == order_id))
#     order = result.scalar_one_or_none()

#     if not order:
#         raise HTTPException(status_code=404, detail="Заказ не найден")

#     # Проверяем, что этот заказ закреплен именно за текущим воркером
#     if order.worker_id != current_user.id:
#         raise HTTPException(status_code=403, detail="Это не ваш заказ")

#     # Начать можно только принятый заказ
#     if order.status != "assigned":
#         raise HTTPException(
#             status_code=400, 
#             detail=f"Нельзя начать работу. Текущий статус: '{order.status}'. Нужен 'assigned'."
#         )

#     order.status = "in_progress"
    
#     session.add(order)
#     await session.commit()
#     await session.refresh(order)
#     return order


# @router.post(
#     "/{order_id}/complete", 
#     response_model=OrderScheme,
#     description="Завершить выполнение заказа. Статус меняется на 'done'."
# )
# async def complete_order(
#     order_id: int,
#     session: AsyncSession = Depends(get_session),
#     current_user: User = Depends(get_current_user)
# ):
#     result = await session.execute(select(Order).where(Order.id == order_id))
#     order = result.scalar_one_or_none()

#     if not order:
#         raise HTTPException(status_code=404, detail="Заказ не найден")

#     if order.worker_id != current_user.id:
#         raise HTTPException(status_code=403, detail="Это не ваш заказ")

#     # Завершить можно только тот заказ, который сейчас в процессе выполнения
#     if order.status != "in_progress":
#         raise HTTPException(
#             status_code=400, 
#             detail=f"Нельзя завершить работу. Текущий статус: '{order.status}'. Нужен 'in_progress'."
#         )

#     order.status = "done"
    
#     session.add(order)
#     await session.commit()
#     await session.refresh(order)
#     return order