from fastapi import FastAPI
from app.api.routes import auth #, orders, users
from app.db.models import Base
from app.db.database import engine

app = FastAPI(title="Yard Cleanup MVP")

app.include_router(auth.router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)