from sqlalchemy import Column, Integer, String, Float, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum

class ProductStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Product(Base):
    __tablename__ = "products_webshop"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    image_url = Column(String)
    quantity = Column(Integer, nullable=False)
    date_posted = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(ProductStatus, name='product_status_webshop'), default=ProductStatus.pending)

    seller_id = Column(Integer, ForeignKey("users_webshop.id"), nullable=False)
    seller = relationship("User", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")

