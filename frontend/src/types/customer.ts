export type CustomerStatus = "waiting" | "serving" | "completed";

export interface Customer {
  id: number;
  name: string;
  status: CustomerStatus;
  createdAt: string;
}
