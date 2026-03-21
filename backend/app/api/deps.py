from fastapi import Depends, HTTPException
from app.db.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import User, WorkerProfile
from app.utils.security import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/user/worker")

async def get_current_user(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)):
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub") #type: ignore
        if user_id is None:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    
    # Ищем пользователя в БД по ID из токена
    result = await session.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    return user

async def get_current_worker(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)):
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub") #type: ignore
        if user_id is None:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    
    # Ищем пользователя в БД по ID из токена
    result = await session.execute(select(WorkerProfile).where(User.id == int(user_id)))
    worker = result.scalar_one_or_none()
    return worker
