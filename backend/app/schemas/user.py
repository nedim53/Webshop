from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    city: str
    country: str
    phone: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    city: str | None = None
    country: str | None = None
    phone: str | None = None
