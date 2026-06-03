from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


def _get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


def _ensure_sku_unique(
    db: Session,
    sku: str,
    *,
    exclude_product_id: int | None = None,
) -> None:
    query = select(Product).where(Product.sku == sku)
    if exclude_product_id is not None:
        query = query.where(Product.id != exclude_product_id)
    if db.scalar(query) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="SKU already exists",
        )


def _handle_integrity_error(exc: IntegrityError) -> None:
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="SKU already exists",
    ) from exc


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)) -> list[Product]:
    return list(db.scalars(select(Product).order_by(Product.id)).all())


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
) -> Product:
    return _get_product_or_404(db, product_id)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
) -> Product:
    _ensure_sku_unique(db, product_in.sku)

    product = Product(
        name=product_in.name,
        sku=product_in.sku,
        price=product_in.price,
        quantity_in_stock=product_in.quantity_in_stock,
    )
    db.add(product)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _handle_integrity_error(exc)

    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
) -> Product:
    product = _get_product_or_404(db, product_id)
    _ensure_sku_unique(db, product_in.sku, exclude_product_id=product_id)

    product.name = product_in.name
    product.sku = product_in.sku
    product.price = product_in.price
    product.quantity_in_stock = product_in.quantity_in_stock

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _handle_integrity_error(exc)

    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
) -> None:
    product = _get_product_or_404(db, product_id)
    db.delete(product)
    db.commit()
