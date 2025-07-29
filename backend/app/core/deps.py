from app.core.database import SessionLocal
from app.services import auth_service
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = auth_service.decode_token(token)
        user_id: int = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except:
        raise credentials_exception
    
    user = auth_service.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    return user
