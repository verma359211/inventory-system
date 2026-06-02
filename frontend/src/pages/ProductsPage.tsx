import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  createProduct,
  getProducts,
} from "../api/productApi";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import type { Product, ProductCreate } from "../types/product";

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return "SKU already exists";
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setLoadError(formatError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function handleCreate(data: ProductCreate) {
    setFormError(null);
    try {
      await createProduct(data);
      await loadProducts();
    } catch (error) {
      setFormError(formatError(error));
    }
  }

  return (
    <section>
      <h2>Products</h2>
      {loading && <p>Loading products...</p>}
      {loadError && <p className="error">{loadError}</p>}
      {!loading && !loadError && <ProductList products={products} />}
      <ProductForm onSubmit={handleCreate} error={formError} />
    </section>
  );
}
