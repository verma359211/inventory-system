export interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  quantity_in_stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
  price: number;
  quantity_in_stock: number;
}

export interface ProductUpdate {
  name: string;
  sku: string;
  price: number;
  quantity_in_stock: number;
}
