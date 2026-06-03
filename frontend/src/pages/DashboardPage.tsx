import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/common/PageHeader";
import { StatCardsSkeleton } from "../components/common/Skeleton";
import StatCard from "../components/common/StatCard";
import { useDashboardSummary } from "../hooks/useDashboard";
import { getErrorMessage } from "../utils/format";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummary();

  return (
    <section className="page">
      <PageHeader
        title="Dashboard"
        description="Overview of inventory, customers, orders, and stock alerts."
      />

      {isLoading && <StatCardsSkeleton />}

      {isError && <ErrorMessage message={getErrorMessage(error)} />}

      {data && !isLoading && (
        <>
          <div className="stat-grid">
            <StatCard label="Total products" value={data.total_products} />
            <StatCard label="Total customers" value={data.total_customers} />
            <StatCard label="Total orders" value={data.total_orders} />
            <StatCard
              label="Low stock count"
              value={data.low_stock_products.length}
              variant={data.low_stock_products.length > 0 ? "warning" : "default"}
            />
          </div>

          <section className="section-card">
            <div className="section-card-header">
              <h3>Low stock products</h3>
              <span className="stock-badge stock-badge-low">≤ 5 units</span>
            </div>

            {data.low_stock_products.length === 0 ? (
              <EmptyState
                title="No low stock products"
                description="All products are above the low stock threshold. Check back after sales activity."
              />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product name</th>
                      <th>SKU</th>
                      <th>Quantity in stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.low_stock_products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                        </td>
                        <td>
                          <code className="sku-code">{product.sku}</code>
                        </td>
                        <td>
                          <span className="stock-badge stock-badge-low">
                            {product.quantity_in_stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
