from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_session
from app.db.models import Review, Order, User
from app.api.deps import get_current_user
from app.schemas.reviews_scheme import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post(
    "/", 
    response_model=ReviewOut,
    description="Оставить отзыв к завершенному заказу"
)
async def create_review(
    review_data: ReviewCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Проверяем, существует ли заказ
    result = await session.execute(select(Order).where(Order.id == review_data.order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # 2. Проверяем права: только клиент этого заказа может оставить отзыв
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Вы не можете оставить отзыв к чужому заказу")

    # 3. Проверяем статус: отзыв можно оставить только к выполненному заказу
    if order.status != "done":
        raise HTTPException(status_code=400, detail="Отзыв можно оставить только к завершенному заказу")

    # 4. Проверяем, может отзыв уже оставлен (чтобы не дублировать)
    existing_review = await session.execute(select(Review).where(Review.order_id == order.id))
    if existing_review.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Отзыв для этого заказа уже существует")

    if not order.worker_id:
        raise HTTPException(status_code=400, detail="К заказу не привязан исполнитель")

    # 5. Создаем отзыв (автоматически подставляем worker_id и client_id из заказа)
    new_review = Review(
        order_id=order.id,
        client_id=current_user.id,
        worker_id=order.worker_id, # Берём воркера прямо из заказа!
        rating=review_data.rating,
        comment=review_data.comment
    )

    session.add(new_review)
    await session.commit()
    await session.refresh(new_review)

    return new_review


@router.get(
    "/worker/{worker_id}", 
    response_model=List[ReviewOut],
    description="Получить все отзывы конкретного воркера"
)
async def get_worker_reviews(
    worker_id: int,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Достаем все отзывы, где worker_id совпадает с запрошенным
    query = (
        select(Review)
        .where(Review.worker_id == worker_id)
        .order_by(Review.created_at.desc()) # Свежие отзывы сверху
        .limit(limit)
        .offset(offset)
    )
    
    result = await session.execute(query)
    reviews = result.scalars().all()

    return reviews