import { apiRequest } from "./client";
import type { Customer, CustomerCreate } from "../types/customer";

export function fetchCustomers(): Promise<Customer[]> {
  return apiRequest<Customer[]>("/customers");
}

export function fetchCustomer(id: number): Promise<Customer> {
  return apiRequest<Customer>(`/customers/${id}`);
}

export function createCustomer(data: CustomerCreate): Promise<Customer> {
  return apiRequest<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: number): Promise<void> {
  return apiRequest<void>(`/customers/${id}`, { method: "DELETE" });
}
