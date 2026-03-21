from fastapi import APIRouter, Depends
from app.schemas.users_scheme import UserScheme, UserAddress
from app.db.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.database import get_session
router = APIRouter(prefix="/users", tags=["users"])

@router.get(
    "/me", 
    response_model=UserScheme,
    description="Запрос требует JWT-токен в заголовке `Authorization: Bearer <token>`"
)
async def me_route(
    user: User = Depends(get_current_user),
):
    return UserScheme(
        email=user.email,
        name=user.name,
        role=user.role,
        address=user.address
    )
    
    
@router.patch(
    "/me/address", 
    response_model=UserScheme,
    description="Запрос требует JWT-токен в заголовке `Authorization: Bearer <token>`"
)
async def me_addres_route(
    addres_data: UserAddress,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    user.address = addres_data.address
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user

    
@router.get(
    "/me/worker-profile", 
    response_model=UserScheme,
    description="Запрос требует JWT-токен в заголовке `Authorization: Bearer <token>`"
)
async def me_route(
    user: User = Depends(get_current_user),
):
    ...