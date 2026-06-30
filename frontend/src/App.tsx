import { useCustomers } from "./hooks/useCustomers";
import { AddCustomerForm } from "./components/AddCustomerForm";
import { QueueSection } from "./components/QueueSection";

function App() {
  const { customers, isLoading, error, pendingId, add, startServing, complete, remove, dismissError } =
    useCustomers();

  const waiting = customers.filter((customer) => customer.status === "waiting");
  const serving = customers.filter((customer) => customer.status === "serving");
  const completed = customers.filter((customer) => customer.status === "completed");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">QueueMaster</h1>
        <p className="text-sm text-slate-500">Manage your walk-in customer queue</p>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
          <AddCustomerForm onAdd={add} />
        </div>

        {error && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={dismissError} className="font-medium underline">
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading queue…</p>
        ) : (
          <div className="flex flex-col gap-10 md:flex-row">
            <QueueSection
              title="Waiting"
              customers={waiting}
              emptyMessage="No customers waiting"
              pendingId={pendingId}
              showPosition
              onStartServing={startServing}
              onRemove={remove}
            />
            <QueueSection
              title="Being Served"
              customers={serving}
              emptyMessage="No one is being served"
              pendingId={pendingId}
              onComplete={complete}
              onRemove={remove}
            />
            <QueueSection
              title="Completed"
              customers={completed}
              emptyMessage="No completed customers yet"
              pendingId={pendingId}
              onRemove={remove}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
