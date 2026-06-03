import { useState, type FormEvent } from "react";
import type { Customer } from "../../types/customer";
import type { Product } from "../../types/product";
import type { OrderCreate, OrderItemCreate } from "../../types/order";
import ErrorMessage from "../common/ErrorMessage";

interface OrderLine {
  key: string;
  product_id: string;
  quantity: string;
}

interface OrderFormProps {
  customers: Customer[];
  products: Product[];
  onSubmit: (data: OrderCreate) => Promise<void>;
  onCancel: () => void;
  serverError: string | null;
}

function newLine(): OrderLine {
  return { key: crypto.randomUUID(), product_id: "", quantity: "1" };
}

export default function OrderForm({
  customers,
  products,
  onSubmit,
  onCancel,
  serverError,
}: OrderFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([newLine()]);
  const [clientError, setClientError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((line) => line.key !== key)));
  }

  function updateLine(key: string, field: keyof OrderLine, value: string) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, [field]: value } : line)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerId) {
      setClientError("Please select a customer");
      return;
    }

    const items: OrderItemCreate[] = [];
    for (const line of lines) {
      const productId = parseInt(line.product_id, 10);
      const quantity = parseInt(line.quantity, 10);
      if (!line.product_id || Number.isNaN(productId)) {
        setClientError("Each row must have a product selected");
        return;
      }
      if (Number.isNaN(quantity) || quantity <= 0) {
        setClientError("Quantity must be greater than zero");
        return;
      }
      items.push({ product_id: productId, quantity });
    }

    if (items.length === 0) {
      setClientError("Add at least one order item");
      return;
    }

    setClientError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        customer_id: parseInt(customerId, 10),
        items,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Customer
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name} ({customer.email})
            </option>
          ))}
        </select>
      </label>

      <div className="order-lines">
        <h4>Order items</h4>
        {lines.map((line) => (
          <div key={line.key} className="order-line">
            <label>
              Product
              <select
                value={line.product_id}
                onChange={(e) => updateLine(line.key, "product_id", e.target.value)}
                required
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (stock: {product.quantity_in_stock})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={line.quantity}
                onChange={(e) => updateLine(line.key, "quantity", e.target.value)}
                required
              />
            </label>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => removeLine(line.key)}
              disabled={lines.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={addLine}>
          Add item
        </button>
      </div>

      {(clientError || serverError) && (
        <ErrorMessage message={clientError ?? serverError ?? ""} />
      )}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "Create order"}
        </button>
      </div>
    </form>
  );
}
