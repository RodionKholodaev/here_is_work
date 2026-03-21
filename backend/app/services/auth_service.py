from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.services.geo_service import get_coordinates
from app.db.models import User
from app.utils.security import hash_password, verify_password, generate_token


async def register(session: AsyncSession, name: str, password: str, role: str, adress: str):
    # проверка, есть ли пользователь
    result = await session.execute(
        select(User).where(User.name == name)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(400, "User already exists")

    
    result = await get_coordinates(adress)
    if result is None: raise ValueError("Не получилось узнать координаты")
    latitude, longitude = result

    user = User(
        name=name,
        password_hash=hash_password(password),
        role=role,
        latitude = latitude,
        longitude = longitude
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


async def login(session: AsyncSession, name: str, password: str):
    result = await session.execute(
        select(User).where(User.name == name)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    token = generate_token()
    user.token = token

    await session.commit()

    return token, user