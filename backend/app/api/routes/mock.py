from fastapi import APIRouter
from datetime import datetime, timedelta
from app.schemas.mock_schemas import MockOrderCreate, MockOrderCreatedResponse, MockOrderResultResponse, price_schene, area_scheme
import random

router = APIRouter(
    prefix="/mock",
    tags=["mock"]
)

@router.post(
    "/orders",
    response_model=MockOrderCreatedResponse
)
async def create_mock_order(
    data: MockOrderCreate
):

    print("Получен заказ:")
    print(data)

    order_id = random.randint(
        1000,
        9999
    )

    return {
        "message": "Заказ принят",
        "order_id": order_id
    }


@router.get(
    "/orders/{order_id}/result",
    response_model=MockOrderResultResponse
)
async def get_mock_result(
    order_id: int
):

    now = datetime.utcnow()

    time_start = now + timedelta(
        minutes=30
    )

    time_end = time_start + timedelta(
        hours=2
    )

    price = random.randint(
        500,
        1000
    )

    worker = {
        "id": 1,
        "name": "Иван Петров",
        "rating": 4.8,
        "phone": "+7 999 123 45 67"
    }

    return {
        "price": price,
        "time_start": time_start,
        "time_end": time_end,
        "worker": worker
    }

@router.get("/orders/get-price", response_model=price_schene)
async def get_mock_price(area: float): 
    generated_price = float(random.randint(500, 1000)) + area*10
    print(generated_price)
    return {"price": generated_price} 