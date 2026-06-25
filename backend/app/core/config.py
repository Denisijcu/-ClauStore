from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "ClauStore"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/claustore"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Zelle
    ZELLE_EMAIL: str = ""
    ZELLE_PHONE: str = ""
    ZELLE_NAME: str = "ClauStore"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",
        "https://claustore.netlify.app"
    ]

    # AI (Groq)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-8b-8192"

    class Config:
        env_file = ".env"

settings = Settings()
