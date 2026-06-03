import { apiRequest } from "./client";
import type { Order, OrderCreate } from "../types/order";

export function fetchOrders(): Promise<Order[]> {
  return apiRequest<Order[]>("/orders");
}

export function fetchOrder(id: number): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}`);
}

export function createOrder(data: OrderCreate): Promise<Order> {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteOrder(id: number): Promise<void> {
  return apiRequest<void>(`/orders/${id}`, { method: "DELETE" });
}
