from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class ProductStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    quantity: int

class ProductCreate(ProductBase):
    seller_id: int

class ProductRead(ProductBase):
    id: int
    status: ProductStatus
    date_posted: datetime
    seller_id: int

    class Config:
        from_attributes = True
