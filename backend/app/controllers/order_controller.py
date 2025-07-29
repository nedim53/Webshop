from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.order import OrderCreate, OrderRead
from app.services import order_service
from app.core.deps import get_db
from app.schemas.order import OrderStatusUpdate
from fastapi import Query

router = APIRouter(prefix="/orders", tags=["Orders"])



@router.get("/", response_model=list[OrderRead])
def all_orders(status: str | None = Query(default=None), db: Session = Depends(get_db)):
    return order_service.get_all_orders(db, status=status)

@router.get("/user/{email}", response_model=list[OrderRead])
def user_orders(email: str, status: str | None = Query(default=None), db: Session = Depends(get_db)):
    return order_service.get_orders_by_email(db, email, status=status)

@router.get("/admin/{admin_id}", response_model=list[OrderRead])
def admin_orders(admin_id: int, status: str | None = Query(default=None), db: Session = Depends(get_db)):
    return order_service.get_orders_by_admin(db, admin_id, status=status)

@router.put("/{order_id}/status", response_model=OrderRead)
def change_status(order_id: int, update: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = order_service.update_order_status(db, order_id, update.status)
    if not order:
        raise HTTPException(status_code=404, detail="Narudžba nije pronađena.")
    return order


@router.post("/{user_id}", response_model=OrderRead)
def create_order(user_id: int, order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        return order_service.create_order_from_cart(db, user_id, order_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    deleted = order_service.delete_order(db, order_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Narudžba nije pronađena.")
    return {"message": f"Narudžba {order_id} obrisana."}


@router.post("/{order_id}/reorder/{user_id}")
def reorder(order_id: int, user_id: int, db: Session = Depends(get_db)):
    try:
        return order_service.reorder(db, order_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/stats")
def get_order_stats(db: Session = Depends(get_db)):
    return order_service.get_stats(db)
