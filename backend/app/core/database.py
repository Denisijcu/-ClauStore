from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Si es SQLite (local), mantienes el connect_args.
# Si es PostgreSQL (producción/Docker), elimínalo.
# Como ya estás en Docker con Postgres, esta es la forma correcta:

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()