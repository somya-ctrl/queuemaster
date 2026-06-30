import * as customerStore from "../store/customerStore.js";

const { STATUS } = customerStore;

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid customer id" });
    return null;
  }
  return id;
}

function listCustomers(req, res) {
  const { status } = req.query;
  if (status === STATUS.WAITING) {
    return res.json(customerStore.getWaiting());
  }
  res.json(customerStore.getAll());
}

function addCustomer(req, res) {
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Customer name is required" });
  }
  const customer = customerStore.addCustomer(name.trim());
  res.status(201).json(customer);
}

function markServing(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const customer = customerStore.getById(id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  if (customer.status === STATUS.COMPLETED) {
    return res
      .status(400)
      .json({ error: "Completed customers cannot re-enter the queue" });
  }

  res.json(customerStore.updateStatus(id, STATUS.SERVING));
}

function markCompleted(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const updated = customerStore.updateStatus(id, STATUS.COMPLETED);
  if (!updated) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json(updated);
}

function removeCustomer(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const removed = customerStore.removeCustomer(id);
  if (!removed) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.status(204).send();
}

export {
  listCustomers,
  addCustomer,
  markServing,
  markCompleted,
  removeCustomer,
};
