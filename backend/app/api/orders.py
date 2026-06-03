from collections import defaultdict
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


def _orders_query():
    return select(Order).options(
        selectinload(Order.customer),
        selectinload(Order.items),
    )


def _get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.scalar(_orders_query().where(Order.id == order_id))
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


@router.get("", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)) -> list[Order]:
    return list(db.scalars(_orders_query().order_by(Order.id)).all())


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
) -> Order:
    return _get_order_or_404(db, order_id)


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
) -> Order:
    try:
        customer = db.get(Customer, order_in.customer_id)
        if customer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )

        quantity_by_product: dict[int, int] = defaultdict(int)
        for item in order_in.items:
            quantity_by_product[item.product_id] += item.quantity

        products: dict[int, Product] = {}
        for product_id in quantity_by_product:
            product = db.get(Product, product_id)
            if product is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Product not found",
                )
            if product.quantity_in_stock < quantity_by_product[product_id]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name}",
                )
            products[product_id] = product

        order = Order(customer_id=order_in.customer_id, total_amount=Decimal("0.00"))
        db.add(order)
        db.flush()

        total_amount = Decimal("0.00")
        for item in order_in.items:
            product = products[item.product_id]
            unit_price = product.price
            subtotal = unit_price * item.quantity
            total_amount += subtotal

            product.quantity_in_stock -= item.quantity

            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=unit_price,
                    subtotal=subtotal,
                )
            )

        order.total_amount = total_amount
        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create order",
        ) from exc

    return _get_order_or_404(db, order.id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
) -> None:
    order = _get_order_or_404(db, order_id)
    db.delete(order)
    db.commit()
