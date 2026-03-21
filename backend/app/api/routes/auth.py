from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from app.services.auth_service import register, login
from app.db.database import get_session


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register_route(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    user = await register(session, data.name, data.password, data.role, data.adress)

    return AuthResponse(
        token="login_required",
        user_id=user.id
    )


@router.post("/login", response_model=AuthResponse)
async def login_route(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    token, user = await login(session, data.name, data.password)

    return AuthResponse(
        token=token,
        user_id=user.id
    )