from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import GalleryDesign
from app.schemas.schemas import GalleryDesignOut
from app.services.cloudinary_service import upload_image, delete_image

router = APIRouter()

@router.get("/", response_model=List[GalleryDesignOut])
async def get_gallery(
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(GalleryDesign).filter(GalleryDesign.is_active == True)
    if category_id:
        query = query.filter(GalleryDesign.category_id == category_id)
    return query.order_by(GalleryDesign.sort_order).all()

@router.post("/", response_model=GalleryDesignOut)
async def create_gallery_design(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    sort_order: int = Form(0),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    content = await image.read()
    result = upload_image(content, folder="claustore/gallery")

    design = GalleryDesign(
        name=name, description=description,
        category_id=category_id, sort_order=sort_order,
        image_url=result["url"],
        image_public_id=result["public_id"]
    )
    db.add(design)
    db.commit()
    db.refresh(design)
    return design

@router.delete("/{design_id}")
async def delete_design(design_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    design = db.query(GalleryDesign).filter(GalleryDesign.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    if design.image_public_id:
        delete_image(design.image_public_id)
    design.is_active = False
    db.commit()
    return {"message": "Design deleted"}
