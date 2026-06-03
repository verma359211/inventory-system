from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.customers import router as customers_router
from app.api.dashboard import router as dashboard_router
from app.api.orders import router as orders_router
from app.api.products import router as products_router
from app.core.config import settings
from app.db.session import get_db

api_router = APIRouter()

api_router.include_router(products_router)
api_router.include_router(customers_router)
api_router.include_router(orders_router)
api_router.include_router(dashboard_router)


@api_router.get("/")
def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "status": "running",
        "message": "Inventory & Order Management API",
        "documentation": "/docs",
        "health": "/health",
    }


@api_router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


@api_router.get("/health/db")
def health_db_check(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed",
        ) from exc
