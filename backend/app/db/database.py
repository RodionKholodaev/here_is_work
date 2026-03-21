from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# изменяем DATABASE_URL на SQLite
DATABASE_URL = "sqlite+aiosqlite:///./db.sqlite3"

# создаём async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# создаём async session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# функция для dependency FastAPI
async def get_session():
    async with async_session() as session:
        yield session



