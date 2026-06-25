import os
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    APP_NAME: str = "ClauStore"
    DEBUG: bool = False

    # Database - Railway inyecta DATABASE_URL automáticamente
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/claustore"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",
        "https://claustore.netlify.app"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        if isinstance(v, list): return v
        if isinstance(v, str):
            if v.startswith("["):
                try: return json.loads(v)
                except: pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return ["https://claustore.netlify.app"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()