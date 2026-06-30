import { useCallback, useEffect, useState } from "react";
import type { Customer } from "../types/customer";
import * as api from "../api/customers";

function toMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(toMessage(err, "Failed to load the queue"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runAction = useCallback(
    async (id: number, action: (id: number) => Promise<unknown>, fallback: string) => {
      setPendingId(id);
      try {
        await action(id);
        await refresh();
      } catch (err) {
        setError(toMessage(err, fallback));
      } finally {
        setPendingId(null);
      }
    },
    [refresh],
  );

  const add = useCallback(
    async (name: string) => {
      try {
        await api.addCustomer(name);
        await refresh();
      } catch (err) {
        setError(toMessage(err, "Could not add customer"));
        throw err;
      }
    },
    [refresh],
  );

  const startServing = useCallback(
    (id: number) => runAction(id, api.markServing, "Could not update customer"),
    [runAction],
  );
  const complete = useCallback(
    (id: number) => runAction(id, api.markCompleted, "Could not update customer"),
    [runAction],
  );
  const remove = useCallback(
    (id: number) => runAction(id, api.removeCustomer, "Could not remove customer"),
    [runAction],
  );

  return {
    customers,
    isLoading,
    error,
    pendingId,
    add,
    startServing,
    complete,
    remove,
    dismissError: () => setError(null),
  };
}
