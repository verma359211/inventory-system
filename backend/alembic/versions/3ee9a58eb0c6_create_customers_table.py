"""create customers table

Revision ID: 3ee9a58eb0c6
Revises: 49112ac02fc9
Create Date: 2026-06-03 15:28:32.050298

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '3ee9a58eb0c6'
down_revision: Union[str, None] = '49112ac02fc9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone_number", sa.String(length=50), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )


def downgrade() -> None:
    op.drop_table("customers")
