from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum

class OrderStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class Order(Base):
    __tablename__ = "orders_webshop"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String)
    status = Column(Enum(OrderStatus, name='order_status_webshop'), default=OrderStatus.pending)
    date_created = Column(DateTime, default=datetime.utcnow)
    date_decided = Column(DateTime, nullable=True)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items_webshop"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders_webshop.id"))
    product_id = Column(Integer, ForeignKey("products_webshop.id", ondelete="CASCADE"))
    quantity = Column(Integer, nullable=False)
    price_at_order_time = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

