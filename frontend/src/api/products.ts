import { apiRequest } from "./client";
import type { Product, ProductCreate, ProductUpdate } from "../types/product";

export function fetchProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/products");
}

export function fetchProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export function createProduct(data: ProductCreate): Promise<Product> {
  return apiRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(
  id: number,
  data: ProductUpdate,
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number): Promise<void> {
  return apiRequest<void>(`/products/${id}`, { method: "DELETE" });
}
