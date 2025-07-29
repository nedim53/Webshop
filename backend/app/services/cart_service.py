from sqlalchemy.orm import Session
from app.repositories.cart_repository import CartRepository

def get_cart(db: Session, user_id: int):
    return CartRepository(db).get_cart(user_id)

def add_item_to_cart(db: Session, user_id: int, product_id: int, quantity: int):
    return CartRepository(db).add_item(user_id, product_id, quantity)

def update_cart_item(db: Session, user_id: int, product_id: int, quantity: int):
    return CartRepository(db).update_item(user_id, product_id, quantity)

def remove_cart_item(db: Session, user_id: int, product_id: int):
    return CartRepository(db).remove_item(user_id, product_id)

def clear_cart(db: Session, user_id: int):
    cart = CartRepository(db).get_cart(user_id)
    if cart:
        CartRepository(db).clear_cart(cart.id)
