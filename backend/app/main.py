from fastapi import FastAPI
from app.api.routes import auth, order, users, reviews, workers, mock
from app.db.models import Base
from app.db.database import engine

app = FastAPI(title="Dvornic Go")

app.include_router(auth.router)
# app.include_router(order.router)
app.include_router(users.router)
# app.include_router(workers.router)
app.include_router(reviews.router)
app.include_router(mock.router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)