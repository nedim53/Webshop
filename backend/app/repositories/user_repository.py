from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def create(self, user: UserCreate, password_hash: str):
        db_user = User(
            username=user.username,
            password_hash=password_hash,
            is_admin=user.is_admin,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            city=user.city,
            country=user.country,
            phone=user.phone,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def update(self, user_id: int, user_update: UserUpdate):
        user = self.get_by_id(user_id)
        if not user:
            return None
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user
