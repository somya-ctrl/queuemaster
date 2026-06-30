import type { Customer } from "../types/customer";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getCustomers(): Promise<Customer[]> {
  return request<Customer[]>("/customers");
}

export function addCustomer(name: string): Promise<Customer> {
  return request<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function markServing(id: number): Promise<Customer> {
  return request<Customer>(`/customers/${id}/serve`, { method: "PATCH" });
}

export function markCompleted(id: number): Promise<Customer> {
  return request<Customer>(`/customers/${id}/complete`, { method: "PATCH" });
}

export function removeCustomer(id: number): Promise<void> {
  return request<void>(`/customers/${id}`, { method: "DELETE" });
}
