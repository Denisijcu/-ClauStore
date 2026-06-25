from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, products, categories, orders, gallery, ai_prompt

app = FastAPI(
    title="ClauStore API",
    description="Backend API for ClauStore - Custom Sublimation Shop",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Versión más robusta y explícita
allowed_origins = [
    "https://claustore.netlify.app",
    "http://localhost:4200",
    "http://localhost:3000",
    "http://127.0.0.1:4200",
]

# Si ALLOWED_ORIGINS viene bien desde settings, lo usamos
if hasattr(settings, 'ALLOWED_ORIGINS') and settings.ALLOWED_ORIGINS:
    allowed_origins.extend([o for o in settings.ALLOWED_ORIGINS if o not in allowed_origins])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(ai_prompt.router, prefix="/api/ai", tags=["AI Prompt Generator"])

@app.get("/")
async def root():
    return {"message": "ClauStore API is running 🔥", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

import os
import uvicorn

if __name__ == "__main__":
    # Railway asigna el puerto en la variable de entorno 'PORT'
    port = int(os.environ.get("PORT", 8080))
    # 0.0.0.0 es obligatorio para que Railway pueda entrar al contenedor
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)