from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.db.models import User
from app.utils.security import hash_password, verify_password, create_access_token

class AuthRepository:
    @staticmethod
    async def register(session: AsyncSession, name: str, password: str, role: str, address: str, email: str):
        # проверка, есть ли пользователь
        result = await session.execute(
            select(User).where(User.name == name)
        )
        existing = result.scalar_one_or_none()

        if existing:
            raise HTTPException(400, "User already exists")

        
        # coordinates = await get_coordinates(adress)
        # if coordinates is None: raise ValueError("Не получилось узнать координаты")
        # latitude, longitude = coordinates

        user = User(
            name=name,
            password_hash=hash_password(password),
            role=role,
            address = address,
            email = email
        )

        session.add(user)
        await session.commit()
        await session.refresh(user)

        return user

    @staticmethod
    async def login(session: AsyncSession, email: str, password: str):
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")

        token = create_access_token({"sub": str(user.id)})

        return token, user