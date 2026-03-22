from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# ТЕСТОВЫЕ СХЕМЫ

class MockOrderCreate(BaseModel):

    date: datetime

    start_from: datetime

    end_before: datetime

    area: float

    urgency: bool

class MockOrderCreatedResponse(BaseModel):

    message: str

    order_id: int

class MockWorker(BaseModel):

    id: int

    name: str

    rating: float

    phone: str

class MockOrderResultResponse(BaseModel):

    price: float

    time_start: datetime

    time_end: datetime

    worker: MockWorker