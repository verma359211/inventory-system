import type { Customer } from "./customer";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: string;
  created_at: string;
  customer: Customer;
  items: OrderItem[];
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
}

export interface OrderCreate {
  customer_id: number;
  items: OrderItemCreate[];
}
