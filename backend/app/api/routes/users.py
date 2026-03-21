from fastapi import APIRouter, Depends
from app.schemas.users_scheme import UserScheme, UserAddress, WorkerScheme
from app.db.models import User, WorkerProfile
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_current_worker
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
    response_model=WorkerScheme,
    description="Запрос требует JWT-токен в заголовке `Authorization: Bearer <token>`"
)
async def worker_profile_route(
    worker: WorkerProfile = Depends(get_current_worker),
):
    return worker
    

@router.patch(
    "/me/worker-profile", 
    response_model=WorkerScheme,
    description="Запрос требует JWT-токен в заголовке `Authorization: Bearer <token>`"
)
async def edit_worker_profile_route(
    new_worker_profile: WorkerScheme,
    worker: WorkerProfile = Depends(get_current_worker),
    session: AsyncSession = Depends(get_session)
):
    worker.address = new_worker_profile.address
    worker.available_from = new_worker_profile.available_from
    worker.available_to = new_worker_profile.available_to
    worker.is_active = new_worker_profile.is_active
    worker.work_radius = new_worker_profile.work_radius

    session.add(worker)
    await session.commit()
    await session.refresh(worker)

    return worker
