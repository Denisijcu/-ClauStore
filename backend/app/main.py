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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
