from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Product
from app.schemas.schemas import ProductOut, ProductUpdate
from app.services.cloudinary_service import upload_image, delete_image

router = APIRouter()

@router.get("/", response_model=List[ProductOut])
async def get_products(
    category_id: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if featured:
        query = query.filter(Product.is_featured == True)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductOut)
async def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    stock: int = Form(0),
    category_id: int = Form(...),
    allows_customization: bool = Form(True),
    is_featured: bool = Form(False),
    sizes: str = Form("XS,S,M,L,XL,XXL"),
    colors: str = Form("Blanco,Negro,Gris"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = Product(
        name=name, description=description, price=price,
        stock=stock, category_id=category_id,
        allows_customization=allows_customization,
        is_featured=is_featured, sizes=sizes, colors=colors
    )
    if image:
        content = await image.read()
        result = upload_image(content, folder="claustore/products")
        product.image_url = result["url"]
        product.image_public_id = result["public_id"]

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    allows_customization: Optional[bool] = Form(None),
    is_active: Optional[bool] = Form(None),
    is_featured: Optional[bool] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if name is not None: product.name = name
    if description is not None: product.description = description
    if price is not None: product.price = price
    if stock is not None: product.stock = stock
    if allows_customization is not None: product.allows_customization = allows_customization
    if is_active is not None: product.is_active = is_active
    if is_featured is not None: product.is_featured = is_featured
    if sizes is not None: product.sizes = sizes
    if colors is not None: product.colors = colors

    if image:
        if product.image_public_id:
            delete_image(product.image_public_id)
        content = await image.read()
        result = upload_image(content, folder="claustore/products")
        product.image_url = result["url"]
        product.image_public_id = result["public_id"]

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
    return {"message": "Product deleted"}
