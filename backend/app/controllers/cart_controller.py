from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.cart import CartItemCreate, CartRead, CartItemRead
from app.services import cart_service
from app.core.deps import get_db

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/{user_id}", response_model=CartRead)
def get_cart(user_id: int, db: Session = Depends(get_db)):
    cart = cart_service.get_cart(db, user_id)
    if not cart:
        from app.repositories.cart_repository import CartRepository
        cart = CartRepository(db).get_or_create_cart(user_id)
    return cart


@router.post("/{user_id}/add", response_model=CartItemRead)
def add_item(user_id: int, item: CartItemCreate, db: Session = Depends(get_db)):
    return cart_service.add_item_to_cart(db, user_id, item.product_id, item.quantity)

@router.put("/{user_id}/update", response_model=CartItemRead)
def update_item(user_id: int, item: CartItemCreate, db: Session = Depends(get_db)):
    return cart_service.update_cart_item(db, user_id, item.product_id, item.quantity)

@router.delete("/{user_id}/remove")
def remove_item(user_id: int, item: CartItemCreate, db: Session = Depends(get_db)):
    cart_service.remove_cart_item(db, user_id, item.product_id)
    return {"message": "Item removed from cart"}

@router.delete("/{user_id}/clear")
def clear(user_id: int, db: Session = Depends(get_db)):
    cart_service.clear_cart(db, user_id)
    return {"message": "Cart cleared"}
