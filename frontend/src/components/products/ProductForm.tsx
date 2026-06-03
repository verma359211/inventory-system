import { useState, type FormEvent } from "react";
import type { Product, ProductCreate, ProductUpdate } from "../../types/product";
import ErrorMessage from "../common/ErrorMessage";

interface ProductFormProps {
  initial?: Product;
  submitLabel: string;
  onSubmit: (data: ProductCreate | ProductUpdate) => Promise<void>;
  onCancel: () => void;
  serverError: string | null;
}

interface FormState {
  name: string;
  sku: string;
  price: string;
  quantity_in_stock: string;
}

function toFormState(product?: Product): FormState {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    price: product?.price ?? "",
    quantity_in_stock: product?.quantity_in_stock?.toString() ?? "0",
  };
}

function validateForm(form: FormState): string | null {
  if (!form.name.trim()) return "Name is required";
  if (!form.sku.trim()) return "SKU is required";
  const price = parseFloat(form.price);
  if (Number.isNaN(price) || price <= 0) return "Price must be greater than zero";
  const quantity = parseInt(form.quantity_in_stock, 10);
  if (Number.isNaN(quantity) || quantity < 0) {
    return "Quantity in stock cannot be negative";
  }
  return null;
}

export default function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  serverError,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [clientError, setClientError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setClientError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: parseFloat(form.price),
        quantity_in_stock: parseInt(form.quantity_in_stock, 10),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </label>
      <label>
        SKU
        <input
          type="text"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          required
        />
      </label>
      <label>
        Price
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
      </label>
      <label>
        Quantity In Stock
        <input
          type="number"
          min="0"
          step="1"
          value={form.quantity_in_stock}
          onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })}
          required
        />
      </label>
      {(clientError || serverError) && (
        <ErrorMessage message={clientError ?? serverError ?? ""} />
      )}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
