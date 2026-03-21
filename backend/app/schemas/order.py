from pydantic import BaseModel
from datetime import datetime

class Order(BaseModel):
    adress: str
    service: str
    area: float
    comment: str  
    user_id: int
    token: str


class OrderResponce(BaseModel):
    price: float
    time_start: datetime
    time_end: datetime
    user_id: int
    