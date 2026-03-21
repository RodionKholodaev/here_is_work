from pydantic import BaseModel
from datetime import datetime

class OrderScheme(BaseModel):
    area: float
    comment: str  
    user_id: int
    type: str
    urgency: str
    status: str

class OrderResponce(BaseModel):
    price: float
    time_start: datetime
    time_end: datetime
    user_id: int
    order_id: int | None = None

class AdressScheme(BaseModel):
    adress: str

class CoordinatesSchema(BaseModel):
    latitude: float
    longitude: float
