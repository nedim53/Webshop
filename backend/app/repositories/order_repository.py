from sqlalchemy.orm import Session, joinedload
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderCreate
from sqlalchemy import func
from app.models.product import Product


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_order(self, data: OrderCreate, items: list[dict]):
        order = Order(
            customer_name=data.customer_name,
            address=data.address,
            phone=data.phone,
            email=data.email,
        )
        self.db.add(order)
        self.db.flush() 

        order_items = [
            OrderItem(
                order_id=order.id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                price_at_order_time=item["price"]
            )
            for item in items
        ]

        self.db.add_all(order_items)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_all(self, status: str | None = None):
        query = self.db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product))
        if status:
            query = query.filter(Order.status == status)
        return query.order_by(Order.date_created.desc()).all()

    def get_by_email(self, email: str, status: str | None = None):
        query = self.db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).filter(Order.email == email)
        if status:
            query = query.filter(Order.status == status)
        return query.order_by(Order.date_created.desc()).all()

    def get_by_admin(self, admin_id: int, status: str | None = None):
        # Dohvati sve proizvode koje je admin kreirao
        admin_products = self.db.query(Product.id).filter(Product.seller_id == admin_id).subquery()
        
        # Dohvati sve narudžbe koje sadrže admin-ove proizvode
        query = self.db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product))
        query = query.join(OrderItem, Order.id == OrderItem.order_id)
        query = query.filter(OrderItem.product_id.in_(admin_products))
        
        if status:
            query = query.filter(Order.status == status)
        
        return query.order_by(Order.date_created.desc()).all()

    def update_status(self, order_id: int, new_status: OrderStatus):
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
        order.status = new_status
        if new_status in ["accepted", "rejected", "completed"]:
            from datetime import datetime
            order.date_decided = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order)
        return order

    def delete(self, order_id: int):
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
        self.db.delete(order)
        self.db.commit()
        return order
    
    def get_stats(self):
        total_orders = self.db.query(func.count(Order.id)).scalar()
        total_revenue = self.db.query(func.sum(OrderItem.price_at_order_time * OrderItem.quantity)).scalar()
        total_items_sold = self.db.query(func.sum(OrderItem.quantity)).scalar()

        best_seller = self.db.query(
            Product.name,
            func.sum(OrderItem.quantity).label("total_sold")
        ).join(OrderItem.product).group_by(Product.id).order_by(func.sum(OrderItem.quantity).desc()).first()

        return {
            "total_orders": total_orders or 0,
            "total_revenue": float(total_revenue or 0),
            "total_items_sold": total_items_sold or 0,
            "best_seller": best_seller[0] if best_seller else None,
            "best_seller_quantity": int(best_seller[1]) if best_seller else 0
        }
