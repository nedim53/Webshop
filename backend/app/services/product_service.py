from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate

def get_all_products(db: Session):
    return ProductRepository(db).get_all()

def create_product(db: Session, data: ProductCreate):
    return ProductRepository(db).create(data)

def get_product(db: Session, product_id: int):
    return ProductRepository(db).get_by_id(product_id)

def update_product(db: Session, product_id: int, data: ProductCreate):
    return ProductRepository(db).update(product_id, data)

def update_product_status(db: Session, product_id: int, status: str):
    return ProductRepository(db).update_status(product_id, status)

def delete_product(db: Session, product_id: int):
    return ProductRepository(db).delete(product_id)
