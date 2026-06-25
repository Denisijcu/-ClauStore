from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import List, Union
import json


class Settings(BaseSettings):
    # App
    APP_NAME: str = "ClauStore"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/claustore"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Zelle
    ZELLE_EMAIL: str = ""
    ZELLE_PHONE: str = ""
    ZELLE_NAME: str = "ClauStore"

    # CORS - Versión ultra robusta
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",
        "http://localhost:3000",
        "https://claustore.netlify.app"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return cls.model_fields["ALLOWED_ORIGINS"].default  # fallback a default
            if v.startswith("["):
                try:
                    return json.loads(v)
                except:
                    pass
            # Separado por comas (formato recomendado para Railway)
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return cls.model_fields["ALLOWED_ORIGINS"].default

    # AI (Groq)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-8b-8192"

    class Config:
        env_file = ".env"
        extra = "ignore"   # importante


settings = Settings()