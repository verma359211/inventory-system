import { useMemo, useState, type FormEvent } from "react";
import type { Product, ProductCreate, ProductUpdate } from "../../types/product";
import ErrorMessage from "../common/ErrorMessage";
import FormField from "../common/FormField";

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

interface FieldErrors {
  name?: string;
  sku?: string;
  price?: string;
  quantity_in_stock?: string;
}

function toFormState(product?: Product): FormState {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    price: product?.price ?? "",
    quantity_in_stock: product?.quantity_in_stock?.toString() ?? "0",
  };
}

function validateFields(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.sku.trim()) errors.sku = "SKU is required";
  const price = parseFloat(form.price);
  if (!form.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than zero";
  }
  const quantity = parseInt(form.quantity_in_stock, 10);
  if (
    !form.quantity_in_stock.trim() ||
    Number.isNaN(quantity) ||
    quantity < 0
  ) {
    errors.quantity_in_stock = "Quantity cannot be negative";
  }
  return errors;
}

export default function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  serverError,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(
    () => Object.keys(validateFields(form)).length === 0,
    [form],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField id="product-name" label="Name" required error={fieldErrors.name}>
        <input
          id="product-name"
          type="text"
          className={fieldErrors.name ? "input-invalid" : ""}
          value={form.name}
          placeholder="e.g. Wireless Mouse"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={Boolean(fieldErrors.name)}
        />
      </FormField>

      <FormField id="product-sku" label="SKU" required error={fieldErrors.sku} hint="Must be unique">
        <input
          id="product-sku"
          type="text"
          className={fieldErrors.sku ? "input-invalid" : ""}
          value={form.sku}
          placeholder="e.g. WM-100"
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          aria-invalid={Boolean(fieldErrors.sku)}
        />
      </FormField>

      <FormField id="product-price" label="Price" required error={fieldErrors.price}>
        <input
          id="product-price"
          type="number"
          min="0.01"
          step="0.01"
          className={fieldErrors.price ? "input-invalid" : ""}
          value={form.price}
          placeholder="0.00"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          aria-invalid={Boolean(fieldErrors.price)}
        />
      </FormField>

      <FormField
        id="product-qty"
        label="Quantity in stock"
        required
        error={fieldErrors.quantity_in_stock}
      >
        <input
          id="product-qty"
          type="number"
          min="0"
          step="1"
          className={fieldErrors.quantity_in_stock ? "input-invalid" : ""}
          value={form.quantity_in_stock}
          placeholder="0"
          onChange={(e) =>
            setForm({ ...form, quantity_in_stock: e.target.value })
          }
          aria-invalid={Boolean(fieldErrors.quantity_in_stock)}
        />
      </FormField>

      {serverError && (
        <div className="form-server-error">
          <ErrorMessage message={serverError} title="Unable to save product" />
        </div>
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
          disabled={submitting || !isValid}
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
