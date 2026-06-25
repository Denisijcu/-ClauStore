from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
import random, string
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.models import Order, OrderItem, Product, OrderStatus
from app.schemas.schemas import OrderCreate, OrderOut
from app.services.cloudinary_service import upload_image
from app.core.config import settings

router = APIRouter()

def generate_order_number():
    return "CS-" + "".join(random.choices(string.digits, k=8))

@router.post("/", response_model=OrderOut)
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    total = 0.0
    items_to_create = []

    for item_data in order_data.items:
        product = db.query(Product).filter(Product.id == item_data.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_data.product_id} not found")
        if product.stock < item_data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        total += product.price * item_data.quantity
        items_to_create.append((product, item_data))

    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        total_amount=total,
        status=OrderStatus.AWAITING_PAYMENT,
        shipping_name=order_data.shipping_name,
        shipping_address=order_data.shipping_address,
        shipping_phone=order_data.shipping_phone,
        notes=order_data.notes
    )
    db.add(order)
    db.flush()

    for product, item_data in items_to_create:
        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_data.quantity,
            unit_price=product.price,
            size=item_data.size,
            color=item_data.color,
            customization_type=item_data.customization_type,
            custom_design_url=item_data.custom_design_url,
            gallery_design_id=item_data.gallery_design_id
        )
        product.stock -= item_data.quantity
        db.add(item)

    db.commit()
    db.refresh(order)
    return order

@router.get("/my-orders", response_model=List[OrderOut])
async def get_my_orders(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return order

@router.post("/{order_id}/upload-payment")
async def upload_payment_proof(
    order_id: int,
    zelle_reference: Optional[str] = Form(None),
    screenshot: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    content = await screenshot.read()
    result = upload_image(content, folder="claustore/payments")

    order.payment_screenshot_url = result["url"]
    order.payment_screenshot_public_id = result["public_id"]
    order.zelle_reference = zelle_reference
    order.status = OrderStatus.PAYMENT_UPLOADED
    db.commit()

    return {
        "message": "Payment proof uploaded successfully. We'll confirm your payment shortly!",
        "screenshot_url": result["url"]
    }

# ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────────
@router.get("/admin/all", response_model=List[OrderOut])
async def admin_get_all_orders(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    query = db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product))
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(Order.created_at.desc()).all()

@router.put("/admin/{order_id}/confirm-payment")
async def confirm_payment(order_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = OrderStatus.PAYMENT_CONFIRMED
    order.payment_confirmed_at = datetime.utcnow()
    db.commit()
    return {"message": "Payment confirmed!", "order_number": order.order_number}

@router.put("/admin/{order_id}/status")
async def update_order_status(
    order_id: int,
    new_status: str = Form(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = new_status
    db.commit()
    return {"message": f"Order status updated to {new_status}"}

@router.get("/admin/zelle-info")
async def get_zelle_info():
    return {
        "name": settings.ZELLE_NAME,
        "email": settings.ZELLE_EMAIL,
        "phone": settings.ZELLE_PHONE
    }
