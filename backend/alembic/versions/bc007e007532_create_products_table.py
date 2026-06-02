"""create products table

Revision ID: bc007e007532
Revises: 
Create Date: 2026-06-02 23:51:16.034661

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'bc007e007532'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("sku", sa.String(length=100), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sku"),
    )


def downgrade() -> None:
    op.drop_table("products")
