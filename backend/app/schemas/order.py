from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderCreate(BaseModel):

    type: str

    area: float

    latitude: float
    longitude: float

    comment: Optional[str] = None

    urgency: str  # asap / scheduled

    time_start: Optional[datetime] = None
    time_end: Optional[datetime] = None


class WorkerShort(BaseModel):

    id: int
    name: str

class OrderResponse(BaseModel):

    id: int

    status: str

    price: float

    worker: Optional[WorkerShort] = None

    class Config:
        from_attributes = True

class OrderFullResponse(BaseModel):

    id: int

    type: str

    area: float

    latitude: float
    longitude: float

    comment: Optional[str]

    urgency: str

    status: str

    price: float

    worker: Optional[WorkerShort]

    created_at: datetime

    class Config:
        from_attributes = True



# ТЕСТОВЫЕ СХЕМЫ

class MockOrderCreate(BaseModel):

    date: datetime

    start_from: datetime

    end_before: datetime

    area: float

    urgency: str

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