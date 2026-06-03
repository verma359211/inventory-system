import { useMemo, useState, type FormEvent } from "react";
import type { Customer } from "../../types/customer";
import type { Product } from "../../types/product";
import type { OrderCreate, OrderItemCreate } from "../../types/order";
import ErrorMessage from "../common/ErrorMessage";
import FormField from "../common/FormField";
import { formatCurrency } from "../../utils/format";

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
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const estimatedTotal = useMemo(() => {
    let total = 0;
    for (const line of lines) {
      const productId = parseInt(line.product_id, 10);
      const qty = parseInt(line.quantity, 10);
      if (Number.isNaN(productId) || Number.isNaN(qty) || qty <= 0) continue;
      const product = productMap.get(productId);
      if (!product) continue;
      total += parseFloat(product.price) * qty;
    }
    return total;
  }, [lines, productMap]);

  const canSubmit =
    Boolean(customerId) &&
    lines.every((line) => {
      const pid = parseInt(line.product_id, 10);
      const qty = parseInt(line.quantity, 10);
      return !Number.isNaN(pid) && line.product_id && qty > 0;
    });

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.key !== key)));
  }

  function updateLine(key: string, field: keyof OrderLine, value: string) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, [field]: value } : line)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerId) {
      setFormError("Please select a customer");
      return;
    }

    const items: OrderItemCreate[] = [];
    for (const line of lines) {
      const productId = parseInt(line.product_id, 10);
      const quantity = parseInt(line.quantity, 10);
      if (!line.product_id || Number.isNaN(productId)) {
        setFormError("Each line must have a product selected");
        return;
      }
      if (Number.isNaN(quantity) || quantity <= 0) {
        setFormError("Quantity must be greater than zero");
        return;
      }
      items.push({ product_id: productId, quantity });
    }

    setFormError(null);
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
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField id="order-customer" label="Customer" required>
        <select
          id="order-customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name} — {customer.email}
            </option>
          ))}
        </select>
      </FormField>

      <div className="order-lines">
        <div className="order-lines-header">
          <h4>Line items</h4>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
            Add item
          </button>
        </div>

        {lines.map((line, index) => (
          <div key={line.key} className="order-line-card">
            <FormField id={`product-${line.key}`} label={`Product ${index + 1}`} required>
              <select
                id={`product-${line.key}`}
                value={line.product_id}
                onChange={(e) => updateLine(line.key, "product_id", e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {formatCurrency(product.price)} (stock:{" "}
                    {product.quantity_in_stock})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id={`qty-${line.key}`} label="Qty" required>
              <input
                id={`qty-${line.key}`}
                type="number"
                min="1"
                step="1"
                value={line.quantity}
                onChange={(e) => updateLine(line.key, "quantity", e.target.value)}
              />
            </FormField>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => removeLine(line.key)}
              disabled={lines.length === 1}
              aria-label={`Remove line item ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="order-estimate" aria-live="polite">
          <span className="order-estimate-label">Estimated total (before tax)</span>
          <span className="order-estimate-value">{formatCurrency(estimatedTotal)}</span>
        </div>
      </div>

      {(formError || serverError) && (
        <ErrorMessage
          message={formError ?? serverError ?? ""}
          title="Unable to create order"
        />
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !canSubmit}
        >
          {submitting ? "Creating..." : "Create order"}
        </button>
      </div>
    </form>
  );
}
