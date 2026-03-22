from fastapi import FastAPI
from app.api.routes import auth, order, users, reviews, workers, mock
from app.db.models import Base
from app.db.database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Dvornic Go")

app.include_router(auth.router)
# app.include_router(order.router)
app.include_router(users.router)
# app.include_router(workers.router)
app.include_router(reviews.router)
app.include_router(mock.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Адрес вашего React (Vite)
    allow_credentials=True,
    allow_methods=["*"], # Разрешить все методы (GET, POST и т.д.)
    allow_headers=["*"], # Разрешить любые заголовки
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)