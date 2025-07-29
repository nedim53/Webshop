from sqlalchemy.orm import Session
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.order import OrderCreate
from app.repositories.cart_repository import CartRepository
from app.models.order import Order

def reorder(db: Session, order_id: int, user_id: int):
    cart_repo = CartRepository(db)
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order or not order.items:
        raise ValueError("Narudžba ne postoji ili nema artikala.")

    for item in order.items:
        cart_repo.add_item(user_id=user_id, product_id=item.product_id, quantity=item.quantity)

    return {"message": f"Svi artikli iz narudžbe {order_id} dodani su u korpu."}


def get_all_orders(db: Session, status: str | None = None):
    return OrderRepository(db).get_all(status=status)

def get_orders_by_email(db: Session, email: str, status: str | None = None):
    return OrderRepository(db).get_by_email(email, status=status)

def get_orders_by_admin(db: Session, admin_id: int, status: str | None = None):
    return OrderRepository(db).get_by_admin(admin_id, status=status)

def update_order_status(db: Session, order_id: int, status: str):
    return OrderRepository(db).update_status(order_id, status)

def create_order_from_cart(db: Session, user_id: int, order_data: OrderCreate):
    cart_repo = CartRepository(db)
    order_repo = OrderRepository(db)
    product_repo = ProductRepository(db)

    cart = cart_repo.get_cart(user_id)
    if not cart or not cart.items:
        raise ValueError("Korpa je prazna")

    order_items_data = []
    for item in cart.items:
        # Proveri da li ima dovoljno količine
        product = product_repo.get_by_id(item.product_id)
        if not product:
            raise ValueError(f"Proizvod {item.product_id} ne postoji")
        
        if product.quantity < item.quantity:
            raise ValueError(f"Nema dovoljno količine za proizvod {product.name}. Dostupno: {product.quantity}, traženo: {item.quantity}")
        
        order_items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": item.product.price
        })

    # Kreiraj narudžbu
    order = order_repo.create_order(order_data, order_items_data)
    
    # Smanji količinu proizvoda
    for item in cart.items:
        product = product_repo.get_by_id(item.product_id)
        product.quantity -= item.quantity
        db.commit()
    
    # Očisti korpu
    cart_repo.clear_cart(cart.id)
    return order

def delete_order(db: Session, order_id: int):
    return OrderRepository(db).delete(order_id)

def get_stats(db: Session):
    return OrderRepository(db).get_stats()
