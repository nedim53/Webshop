from pydantic import BaseModel
from app.schemas.product import ProductRead

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItemRead(BaseModel):
    id: int
    product: ProductRead
    quantity: int

    class Config:
        from_attributes = True

class CartRead(BaseModel):
    id: int
    items: list[CartItemRead]

    class Config:
        from_attributes = True
