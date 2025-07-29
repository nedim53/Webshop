from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.controllers import auth_controller
from app.controllers import product_controller
from app.controllers import cart_controller
from app.controllers import order_controller

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://webshop-neptis.vercel.app",  # automatski Vercel domen
    "https://webshop-neptis-lcbp0sin1-nedim53s-projects.vercel.app"  # fallback deploy link
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_controller.router)
app.include_router(product_controller.router)
app.include_router(cart_controller.router)
app.include_router(order_controller.router)