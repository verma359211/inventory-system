import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingState from "../components/common/LoadingState";
import { useOrder } from "../hooks/useOrders";
import { formatCurrency, formatDateTime, getErrorMessage } from "../utils/format";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (!id || Number.isNaN(orderId)) {
    return <ErrorMessage message="Invalid order ID." />;
  }

  if (isLoading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (isError) {
    return <ErrorMessage message={getErrorMessage(error)} />;
  }

  if (!order) {
    return <ErrorMessage message="Order not found." />;
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Order #{order.id}</h2>
        <Link to="/orders" className="btn-secondary">
          Back to orders
        </Link>
      </div>

      <div className="section-card">
        <h3>Customer</h3>
        <dl className="detail-list">
          <div>
            <dt>Full Name</dt>
            <dd>{order.customer.full_name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{order.customer.email}</dd>
          </div>
          <div>
            <dt>Phone Number</dt>
            <dd>{order.customer.phone_number}</dd>
          </div>
        </dl>
      </div>

      <div className="section-card">
        <h3>Order items</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_id}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <dl className="detail-list">
          <div>
            <dt>Total Amount</dt>
            <dd>{formatCurrency(order.total_amount)}</dd>
          </div>
          <div>
            <dt>Created At</dt>
            <dd>{formatDateTime(order.created_at)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
