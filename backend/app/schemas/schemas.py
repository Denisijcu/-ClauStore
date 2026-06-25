from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.models import OrderStatus, CustomizationType

# ─── AUTH ─────────────────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ─── CATEGORY ─────────────────────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: int = 0

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    image_url: Optional[str]
    is_active: bool
    sort_order: int
    class Config:
        from_attributes = True

# ─── PRODUCT ──────────────────────────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    category_id: int
    allows_customization: bool = True
    is_featured: bool = False
    sizes: str = "XS,S,M,L,XL,XXL"
    colors: str = "Blanco,Negro,Gris"

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    allows_customization: Optional[bool] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    sizes: Optional[str] = None
    colors: Optional[str] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    category_id: int
    category: Optional[CategoryOut]
    image_url: Optional[str]
    allows_customization: bool
    is_active: bool
    is_featured: bool
    sizes: str
    colors: str
    created_at: datetime
    class Config:
        from_attributes = True

# ─── GALLERY ──────────────────────────────────────────────────────────────────
class GalleryDesignCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    sort_order: int = 0

class GalleryDesignOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_url: str
    category_id: Optional[int]
    is_active: bool
    sort_order: int
    class Config:
        from_attributes = True

# ─── ORDER ────────────────────────────────────────────────────────────────────
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None
    customization_type: Optional[CustomizationType] = None
    custom_design_url: Optional[str] = None
    gallery_design_id: Optional[int] = None

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_name: str
    shipping_address: str
    shipping_phone: str
    notes: Optional[str] = None

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product: Optional[ProductOut]
    quantity: int
    unit_price: float
    size: Optional[str]
    color: Optional[str]
    customization_type: Optional[CustomizationType]
    custom_design_url: Optional[str]
    gallery_design_id: Optional[int]
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    total_amount: float
    items: List[OrderItemOut]
    shipping_name: str
    shipping_address: str
    shipping_phone: str
    notes: Optional[str]
    zelle_reference: Optional[str]
    payment_screenshot_url: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class PaymentUpload(BaseModel):
    zelle_reference: Optional[str] = None

# ─── AI PROMPT ────────────────────────────────────────────────────────────────
class PromptRequest(BaseModel):
    idea: str
    style: Optional[str] = "moderno"
    product_type: Optional[str] = "camiseta"

class PromptResponse(BaseModel):
    prompt_en: str
    prompt_es: str
    suggestion: str
