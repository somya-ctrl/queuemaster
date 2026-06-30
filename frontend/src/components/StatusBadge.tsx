import type { CustomerStatus } from "../types/customer";

const STYLES: Record<CustomerStatus, string> = {
  waiting: "bg-slate-100 text-slate-600",
  serving: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
};

const LABELS: Record<CustomerStatus, string> = {
  waiting: "Waiting",
  serving: "Being Served",
  completed: "Completed",
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
