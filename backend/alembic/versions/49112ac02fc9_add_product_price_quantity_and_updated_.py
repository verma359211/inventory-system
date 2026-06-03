"""add product price quantity and updated_at

Revision ID: 49112ac02fc9
Revises: bc007e007532
Create Date: 2026-06-03 14:52:11.371884

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '49112ac02fc9'
down_revision: Union[str, None] = 'bc007e007532'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column(
            "price",
            sa.Numeric(precision=10, scale=2),
            server_default="1.00",
            nullable=False,
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "quantity_in_stock",
            sa.Integer(),
            server_default="0",
            nullable=False,
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.alter_column("products", "price", server_default=None)


def downgrade() -> None:
    op.drop_column("products", "updated_at")
    op.drop_column("products", "quantity_in_stock")
    op.drop_column("products", "price")
