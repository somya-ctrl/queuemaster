import { useState } from "react";
import type { SubmitEvent } from "react";

interface AddCustomerFormProps {
  onAdd: (name: string) => Promise<void>;
}

export function AddCustomerForm({ onAdd }: AddCustomerFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setName("");
    } catch {
      // surfaced via the shared error banner in App
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Customer name"
        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-40"
      >
        Add to Queue
      </button>
    </form>
  );
}
