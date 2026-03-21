from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.order import OrderScheme, OrderResponce
from app.db.database import get_session
from app.db.order_repository import OrderRepository
from app.services.time_service import TimeService
from app.services.price_service import PriceService
router = APIRouter(prefix="/order", tags=["order"])


@router.get("/get-order-info", response_model=OrderResponce)
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
        user_id=user_id
    )

    order = await OrderRepository.make_order(session, data, data2)

    data2.order_id = order.id
    
    return data2


