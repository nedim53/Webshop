from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Product).all()

    def get_by_id(self, product_id: int):
        return self.db.query(Product).filter(Product.id == product_id).first()

    def create(self, product_data: ProductCreate):
        product = Product(**product_data.dict())
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product_id: int, product_data: ProductCreate):
        product = self.get_by_id(product_id)
        if not product:
            return None
        
        for key, value in product_data.dict().items():
            setattr(product, key, value)
        
        self.db.commit()
        self.db.refresh(product)
        return product

    def update_status(self, product_id: int, status: str):
        product = self.get_by_id(product_id)
        if not product:
            return None
        
        product.status = status
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product_id: int):
        product = self.get_by_id(product_id)
        if product:
            self.db.delete(product)
            self.db.commit()
        return product
