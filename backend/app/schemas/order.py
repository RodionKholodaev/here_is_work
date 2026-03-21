from pydantic import BaseModel
from datetime import datetime

class OrderScheme(BaseModel):
    adress: str
    service: str
    area: float
    comment: str  
    user_id: int
    token: str
    type: str
    urgency: str
    status: str


class OrderResponce(BaseModel):
    price: float
    time_start: datetime
    time_end: datetime
    user_id: int
    order_id: int | None = None
    