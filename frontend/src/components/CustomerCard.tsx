import type { Customer } from "../types/customer";
import { StatusBadge } from "./StatusBadge";
import { formatTime } from "../utils/time";

interface CustomerCardProps {
  customer: Customer;
  position?: number;
  isPending: boolean;
  onStartServing?: (id: number) => void;
  onComplete?: (id: number) => void;
  onRemove: (id: number) => void;
}

export function CustomerCard({
  customer,
  position,
  isPending,
  onStartServing,
  onComplete,
  onRemove,
}: CustomerCardProps) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {position !== undefined && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {position}
            </span>
          )}
          <div>
            <p className="text-base font-semibold text-slate-900">{customer.name}</p>
            <p className="text-xs text-slate-400">Added at {formatTime(customer.createdAt)}</p>
          </div>
        </div>
        <StatusBadge status={customer.status} />
      </div>

      <div className="mt-4 flex gap-2">
        {onStartServing && (
          <button
            onClick={() => onStartServing(customer.id)}
            disabled={isPending}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            Start Serving
          </button>
        )}
        {onComplete && (
          <button
            onClick={() => onComplete(customer.id)}
            disabled={isPending}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-40"
          >
            Mark Completed
          </button>
        )}
        <button
          onClick={() => onRemove(customer.id)}
          disabled={isPending}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
