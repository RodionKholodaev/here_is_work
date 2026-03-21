from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Схема для создания отзыва (то, что отправляет фронтенд в Body)
class ReviewCreate(BaseModel):
    order_id: int
    rating: int = Field(..., ge=1, le=5, description="Оценка от 1 до 5")
    comment: Optional[str] = None


# Схема для возврата отзыва клиенту (с авто-чтением ORM)
class ReviewOut(BaseModel):
    id: int
    order_id: int
    client_id: int
    worker_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

