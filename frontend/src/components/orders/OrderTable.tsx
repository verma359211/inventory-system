import { Link } from "react-router-dom";
import type { Order } from "../../types/order";
import { formatCurrency, formatDateTime } from "../../utils/format";

interface OrderTableProps {
  orders: Order[];
  onDelete: (order: Order) => void;
}

export default function OrderTable({ orders, onDelete }: OrderTableProps) {
  return (
    <div className="card table-card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>#{order.id}</strong>
                </td>
                <td>{order.customer.full_name}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td>{formatDateTime(order.created_at)}</td>
                <td className="actions-cell">
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    className="btn-link danger"
                    onClick={() => onDelete(order)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
