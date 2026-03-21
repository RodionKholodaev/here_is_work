from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from app.db.auth_repository import AuthRepository
from app.db.database import get_session


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register_route(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    user = await AuthRepository.register(session, data.name, data.password, data.role, data.address, data.email)

    return AuthResponse(
        token="login_required",
        user_id=user.id
    )


@router.post("/login", response_model=AuthResponse)
async def login_route(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    token, user = await AuthRepository.login(session, data.email, data.password)

    return AuthResponse(
        token=token,
        user_id=user.id
    )