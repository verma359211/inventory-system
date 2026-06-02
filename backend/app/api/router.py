from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.products import router as products_router
from app.db.session import get_db

api_router = APIRouter()

api_router.include_router(products_router)


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
