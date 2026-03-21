from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.order import Order, OrderResponce
from app.db.database import get_session

from app.services.time_service import TimeService
from app.services.price_service import PriceService
router = APIRouter(prefix="/order", tags=["order"])


@router.post("/get-order-info", response_model=OrderResponce)
async def order_route(
    data: Order,
    session: AsyncSession = Depends(get_session),
):
    time_start, time_end = TimeService.get_start_end_time(data.area)
    price = PriceService.get_price()
    user_id = data.user_id
    
    return OrderResponce(
        price=price,
        time_start=time_start,
        time_end=time_end,
        user_id=user_id
    )


