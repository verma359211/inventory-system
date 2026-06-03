from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["customers"])


def _get_customer_or_404(db: Session, customer_id: int) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    return customer


def _ensure_email_unique(db: Session, email: str) -> None:
    if db.scalar(select(Customer).where(Customer.email == email)) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists",
        )


def _handle_integrity_error(exc: IntegrityError) -> None:
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Email already exists",
    ) from exc


@router.get("", response_model=list[CustomerResponse])
def list_customers(db: Session = Depends(get_db)) -> list[Customer]:
    return list(db.scalars(select(Customer).order_by(Customer.id)).all())


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
) -> Customer:
    return _get_customer_or_404(db, customer_id)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
) -> Customer:
    _ensure_email_unique(db, str(customer_in.email))

    customer = Customer(
        full_name=customer_in.full_name,
        email=str(customer_in.email),
        phone_number=customer_in.phone_number,
    )
    db.add(customer)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _handle_integrity_error(exc)

    db.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
) -> None:
    customer = _get_customer_or_404(db, customer_id)
    db.delete(customer)
    db.commit()
