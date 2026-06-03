import ErrorMessage from "../components/common/ErrorMessage";
import LoadingState from "../components/common/LoadingState";
import { useDashboardSummary } from "../hooks/useDashboard";
import { getErrorMessage } from "../utils/format";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummary();

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (isError) {
    return <ErrorMessage message={getErrorMessage(error)} />;
  }

  if (!data) {
    return <ErrorMessage message="Dashboard data is unavailable." />;
  }

  return (
    <section className="page">
      <h2>Dashboard</h2>

      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-label">Total Products</p>
          <p className="stat-value">{data.total_products}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Total Customers</p>
          <p className="stat-value">{data.total_customers}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{data.total_orders}</p>
        </article>
      </div>

      <section className="section-card">
        <h3>Low Stock Products</h3>
        {data.low_stock_products.length === 0 ? (
          <p className="empty">No low stock products</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity In Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.quantity_in_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
