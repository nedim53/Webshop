from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.product import ProductCreate, ProductRead
from app.services import product_service
from app.core.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[ProductRead])
def list_products(db: Session = Depends(get_db)):
    return product_service.get_all_products(db)

@router.post("/", response_model=ProductRead)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    # Ne zahtevamo autentifikaciju - bilo ko može dodati proizvod
    return product_service.create_product(db, data)

@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return product_service.get_product(db, product_id)

@router.put("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, data: ProductCreate, db: Session = Depends(get_db)):
    return product_service.update_product(db, product_id, data)

@router.put("/{product_id}/status", response_model=ProductRead)
def update_product_status(product_id: int, status_update: dict, db: Session = Depends(get_db)):
    return product_service.update_product_status(db, product_id, status_update["status"])

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    deleted = product_service.delete_product(db, product_id)
    return {"deleted": bool(deleted)}
