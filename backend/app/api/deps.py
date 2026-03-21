from fastapi import Depends, Header, HTTPException
from app.db.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import User

# 🔹 dependency для получения пользователя по токену
async def get_current_user(
    authorization: str = Header(...),
    session: AsyncSession = Depends(get_session)
) -> User:
    token = authorization
    result = await session.execute(select(User).where(User.token == token))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user