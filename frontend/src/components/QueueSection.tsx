import type { Customer } from "../types/customer";
import { CustomerCard } from "./CustomerCard";

interface QueueSectionProps {
  title: string;
  customers: Customer[];
  emptyMessage: string;
  pendingId: number | null;
  showPosition?: boolean;
  onStartServing?: (id: number) => void;
  onComplete?: (id: number) => void;
  onRemove: (id: number) => void;
}

export function QueueSection({
  title,
  customers,
  emptyMessage,
  pendingId,
  showPosition,
  onStartServing,
  onComplete,
  onRemove,
}: QueueSectionProps) {
  return (
    <section className="min-w-[300px] flex-1">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {customers.length}
        </span>
      </h2>
      {customers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {customers.map((customer, index) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              position={showPosition ? index + 1 : undefined}
              isPending={pendingId === customer.id}
              onStartServing={onStartServing}
              onComplete={onComplete}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
