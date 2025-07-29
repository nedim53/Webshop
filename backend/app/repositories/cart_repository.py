from sqlalchemy.orm import Session
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product import Product

class CartRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_cart(self, user_id: int) -> Cart:
        cart = self.db.query(Cart).filter(Cart.user_id == user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
        return cart

    def add_item(self, user_id: int, product_id: int, quantity: int):
        cart = self.get_or_create_cart(user_id)
        item = next((i for i in cart.items if i.product_id == product_id), None)

        if item:
            item.quantity += quantity
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            self.db.add(item)

        self.db.commit()
        self.db.refresh(item)
        return item

    def update_item(self, user_id: int, product_id: int, quantity: int):
        cart = self.get_or_create_cart(user_id)
        item = next((i for i in cart.items if i.product_id == product_id), None)

        if item:
            item.quantity = quantity
            self.db.commit()
            self.db.refresh(item)
            return item
        else:
            # Ako stavka ne postoji, dodaj je
            return self.add_item(user_id, product_id, quantity)

    def remove_item(self, user_id: int, product_id: int):
        cart = self.get_or_create_cart(user_id)
        item = next((i for i in cart.items if i.product_id == product_id), None)

        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False

    def get_cart(self, user_id: int) -> Cart:
        return self.db.query(Cart).filter(Cart.user_id == user_id).first()

    def clear_cart(self, cart_id: int):
        self.db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
        self.db.commit()
