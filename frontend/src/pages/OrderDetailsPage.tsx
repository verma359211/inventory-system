import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/common/PageHeader";
import { TableSkeleton } from "../components/common/Skeleton";
import { useOrder } from "../hooks/useOrders";
import { formatCurrency, formatDateTime, getErrorMessage } from "../utils/format";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (!id || Number.isNaN(orderId)) {
    return <ErrorMessage message="Invalid order ID." title="Order not found" />;
  }

  if (isLoading) {
    return (
      <section className="page">
        <PageHeader title="Order details" description="Loading order information..." />
        <TableSkeleton rows={3} />
      </section>
    );
  }

  if (isError) {
    return <ErrorMessage message={getErrorMessage(error)} title="Unable to load order" />;
  }

  if (!order) {
    return <ErrorMessage message="Order not found." title="Order not found" />;
  }

  return (
    <section className="page">
      <PageHeader
        title={`Order #${order.id}`}
        description={`Placed on ${formatDateTime(order.created_at)}`}
        actions={
          <Link to="/orders" className="btn btn-secondary">
            Back to orders
          </Link>
        }
      />

      <div className="detail-grid">
        <section className="section-card">
          <h3>Customer</h3>
          <dl className="detail-list">
            <div>
              <dt>Full name</dt>
              <dd>{order.customer.full_name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{order.customer.phone_number}</dd>
            </div>
          </dl>
        </section>

        <section className="section-card">
          <h3>Summary</h3>
          <dl className="detail-list">
            <div>
              <dt>Order ID</dt>
              <dd>#{order.id}</dd>
            </div>
            <div>
              <dt>Created at</dt>
              <dd>{formatDateTime(order.created_at)}</dd>
            </div>
          </dl>
          <div className="order-summary-total">
            <dt>Total amount</dt>
            <dd>{formatCurrency(order.total_amount)}</dd>
          </div>
        </section>
      </div>

      <section className="section-card">
        <h3>Order items</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>#{item.product_id}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>
                    <strong>{formatCurrency(item.subtotal)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
