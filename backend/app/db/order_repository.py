from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Order
from app.schemas.order import OrderScheme, OrderResponce

class OrderRepository:
    @staticmethod
    async def make_order(session: AsyncSession, data1: OrderScheme, data2: OrderResponce):
        
        order = Order(
            client_id = data1.user_id,
            type = data1.type,
            area = data1.area
            comment = data1.comment,
            time_start = data2.time_start,
            time_end = data2.time_end,
            urgency = data1.urgency,
            status = data1.status,
            price = data2.price
        )

        session.add(order)
        await session.commit()
        await session.refresh(order)

        return order

    @staticmethod
    async def add_worker(session: AsyncSession, worker_id: int):
        

# имею вот это

# class OrderScheme(BaseModel):
#     adress: str
#     service: str
#     area: float
#     comment: str  
#     user_id: int
#     token: str
#     type: str
#     urgency: str
#     status: str


# class OrderResponce(BaseModel):
#     price: float
#     time_start: datetime
#     time_end: datetime
#     user_id: int
    
# надо
# class Order(Base):
#     __tablename__ = "orders"



# async def register(session: AsyncSession, name: str, password: str, role: str, adress: str):
#     # проверка, есть ли пользователь
#     result = await session.execute(
#         select(User).where(User.name == name)
#     )
#     existing = result.scalar_one_or_none()

#     if existing:
#         raise HTTPException(400, "User already exists")

    
#     result = await get_coordinates(adress)
#     if result is None: raise ValueError("Не получилось узнать координаты")
#     latitude, longitude = result

#     user = User(
#         name=name,
#         password_hash=hash_password(password),
#         role=role,
#         latitude = latitude,
#         longitude = longitude
#     )

#     session.add(user)
#     await session.commit()
#     await session.refresh(user)

#     return user


# async def login(session: AsyncSession, name: str, password: str):
#     result = await session.execute(
#         select(User).where(User.name == name)
#     )
#     user = result.scalar_one_or_none()

#     if not user or not verify_password(password, user.password_hash):
#         raise HTTPException(401, "Invalid credentials")

#     token = generate_token()
#     user.token = token

#     await session.commit()

#     return token, user