

const STATUS = Object.freeze({
  WAITING: "waiting",
  SERVING: "serving",
  COMPLETED: "completed",
});

let customers = [];
let nextId = 1;

function addCustomer(name) {
  const customer = {
    id: nextId++,
    name,
    status: STATUS.WAITING,
    createdAt: new Date().toISOString(),
  };
  customers.push(customer);
  return customer;
}

function getAll() {
  return customers;
}

function getWaiting() {
  return customers.filter((customer) => customer.status === STATUS.WAITING);
}

function getById(id) {
  return customers.find((customer) => customer.id === id);
}

function updateStatus(id, status) {
  const customer = getById(id);
  if (!customer) return null;
  customer.status = status;
  return customer;
}

function removeCustomer(id) {
  const index = customers.findIndex((customer) => customer.id === id);
  if (index === -1) return false;
  customers.splice(index, 1);
  return true;
}

export {
  STATUS,
  addCustomer,
  getAll,
  getWaiting,
  getById,
  updateStatus,
  removeCustomer,
};
