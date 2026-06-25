from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Category
from app.schemas.schemas import CategoryCreate, CategoryOut
from app.services.cloudinary_service import upload_image, delete_image
import re

router = APIRouter()

def slugify(text: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
    return slug

@router.get("/", response_model=List[CategoryOut])
async def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()

@router.get("/{category_id}", response_model=CategoryOut)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.post("/", response_model=CategoryOut)
async def create_category(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    sort_order: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    slug = slugify(name)
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        slug = f"{slug}-{db.query(Category).count()}"

    cat = Category(name=name, slug=slug, description=description, sort_order=sort_order)

    if image:
        content = await image.read()
        result = upload_image(content, folder="claustore/categories")
        cat.image_url = result["url"]
        cat.image_public_id = result["public_id"]

    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    sort_order: Optional[int] = Form(None),
    is_active: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if name: cat.name = name
    if description is not None: cat.description = description
    if sort_order is not None: cat.sort_order = sort_order
    if is_active is not None: cat.is_active = is_active

    if image:
        if cat.image_public_id:
            delete_image(cat.image_public_id)
        content = await image.read()
        result = upload_image(content, folder="claustore/categories")
        cat.image_url = result["url"]
        cat.image_public_id = result["public_id"]

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.is_active = False
    db.commit()
    return {"message": "Category deleted"}
