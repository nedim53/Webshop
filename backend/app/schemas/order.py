from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from app.schemas.product import ProductRead

class OrderStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price_at_order_time: float

class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_order_time: float
    product: ProductRead

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    address: str
    phone: str
    email: EmailStr

class OrderRead(BaseModel):
    id: int
    customer_name: str
    address: str
    phone: str
    email: str
    status: OrderStatus
    date_created: datetime
    items: list[OrderItemRead] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
