export interface Product {
  id: number;
  name: string;
  sku: string;
  created_at: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
}
