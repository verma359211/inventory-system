import { useState, type FormEvent } from "react";
import type { ProductCreate } from "../types/product";

interface ProductFormProps {
  onSubmit: (data: ProductCreate) => Promise<void>;
  error: string | null;
}

export default function ProductForm({ onSubmit, error }: ProductFormProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), sku: sku.trim() });
      setName("");
      setSku("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add product</h2>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label>
        SKU
        <input
          type="text"
          value={sku}
          onChange={(event) => setSku(event.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Create product"}
      </button>
    </form>
  );
}
