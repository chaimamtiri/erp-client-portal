from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import orders

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ERP Client Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "ERP Client Portal API running"}