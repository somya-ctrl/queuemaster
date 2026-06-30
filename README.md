# QueueMaster

A simple web app for managing a customer waiting queue — add customers,
move them through "Waiting → Being Served → Completed", or remove them.


## Tech Stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS
- **Backend:** Node.js (Express)
- **Storage:** In-memory (a plain JS array inside the backend process —
  no database). Data resets whenever the backend container restarts.
- **Containerization:** Docker, two separate containers (frontend served
  via nginx, backend running Node directly)

## API

| Method | Endpoint                       | Description                          |
|--------|---------------------------------|---------------------------------------|
| GET    | `/api/customers`                | List all customers                    |
| GET    | `/api/customers?status=waiting` | List only customers currently waiting |
| POST   | `/api/customers`                | Add a customer `{ "name": "..." }`    |
| PATCH  | `/api/customers/:id/serve`      | Mark a customer as "Being Served"     |
| PATCH  | `/api/customers/:id/complete`   | Mark a customer as "Completed"        |
| DELETE | `/api/customers/:id`            | Remove a customer from the queue      |

## Assumptions

- **Duplicate names are allowed.** Customers are identified by an
  auto-incrementing numeric `id`, not by name, so two "John"s can be in
  the queue at once.
- **A completed customer cannot return to the queue.** Once a customer
  is marked "Completed" they can only be removed, not moved back to
  "Waiting" or "Serving" — modeled as a terminal state.
- **The queue is FIFO.** Customers waiting are shown in the order they
  were added; the "Start Serving" action doesn't reorder anyone.
- **Multiple customers can be "Being Served" at once.** Small
  businesses (e.g. a barber shop with two chairs) often serve more than
  one customer at a time, so "Being Served" isn't capped at one.
- **An empty queue is a normal, expected state** — the UI shows a
  friendly "No customers waiting" message rather than an error.
- **No authentication.** The business owner is the only user, so there's
  no login flow — out of scope for a 1-hour build.

## Running the Application

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (Docker Desktop
  on Windows/Mac includes both)

### Option A — Docker Compose (recommended)

From the repository root:

```bash
docker compose up --build
```

This builds and starts both containers:

- Backend on **http://localhost:3001**
- Frontend on **http://localhost:5173**

Open **http://localhost:5173** in your browser to use the app.

Stop everything with `docker compose down` (run from the same directory).

### Option B — Build and run each container manually

**Backend:**

```bash
cd backend
docker build -t queuemaster-backend .
docker run -p 3001:3001 queuemaster-backend
```

**Frontend:**

```bash
cd frontend
docker build -t queuemaster-frontend --build-arg VITE_API_URL=http://localhost:3001/api .
docker run -p 5173:80 queuemaster-frontend
```

Then open **http://localhost:5173**.

### Environment Variables

| Variable        | Where         | Default                       | Purpose                                                                 |
|------------------|---------------|--------------------------------|--------------------------------------------------------------------------|
| `PORT`           | backend       | `3001`                        | Port the Express server listens on                                      |
| `VITE_API_URL`   | frontend (build arg) | `http://localhost:3001/api` | Base URL the frontend uses to call the backend API. Must be set at **build time** since Vite inlines env vars into the static bundle. |

## If I Had Another 3 Hours

**Improvements I'd make:**

- Persist the queue (SQLite or a JSON file) so data survives a restart,
  instead of an in-memory array.
- Add basic tests (API integration tests for the backend, component
  tests for the frontend).
- Add estimated wait time per customer, based on average service time.
- Add Nginx as a reverse proxy in front of the backend so the frontend
  and API share a single origin/port in production.
- Polish the UI further: toast notifications instead of a dismissible
  error banner, drag-to-reorder within the waiting list, loading
  skeletons instead of plain "Loading…" text.
- Add a small backend test for concurrent updates (e.g. two clients
  marking the same customer "Served" at once).

**Compromises made because of the 1-hour limit:**

- No persistence — purely in-memory storage, as scoped by the
  assignment.
- No automated tests; verified behavior manually via curl and in the
  browser.
- No polling/websockets for live updates across multiple open
  tabs/devices — the UI only refreshes after an action it triggered
  itself.
- Nginx is used only to serve the built frontend, not as a reverse
  proxy for the backend (explicitly marked optional in the assignment).
