import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/format";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="card table-card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <code className="sku-code">{product.sku}</code>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  {product.quantity_in_stock <= 5 ? (
                    <span className="stock-badge stock-badge-low">
                      {product.quantity_in_stock}
                    </span>
                  ) : (
                    product.quantity_in_stock
                  )}
                </td>
                <td className="actions-cell">
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-link danger"
                    onClick={() => onDelete(product)}
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
