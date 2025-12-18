# Smart Tailoring Node.js Backend

This repository now ships a full Express + Sequelize backend that replaces the legacy PHP implementation while keeping the same MySQL schema.

## What was added
- Express server with JWT authentication for admins, customers, and tailors.
- Sequelize models that match the existing MySQL tables (orders, customers, tailors, admins, measurements, notifications, etc.).
- Routes for authentication, orders, measurements, customers, and tailors with validation and role-based access.
- Migration runner that reuses the existing SQL migration files to build the schema in MySQL.

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment
   ```bash
   cp .env.example .env
   # Update DB_* values, JWT_SECRET, and PORT as needed
   ```

3. Provision the database (uses the existing SQL migrations)
   ```bash
   npm run migrate
   ```

4. Start the API server
   ```bash
   npm run start
   ```

The API will be available at `http://localhost:4000/api` by default.

## Local development flow (watch mode)
1. **Start MySQL for local dev (Docker optional)**
   ```bash
   npm run dev:db
   # or: docker compose -f docker-compose.dev.yml up -d db
   ```
   Uses root/`secret` on port 3306 with a `smart_tailoring` database. Update `.env` if you change these defaults.

2. **Run migrations and start the watcher**
   ```bash
   npm run dev
   ```
   The dev script waits for the database to be reachable, applies SQL migrations, and then starts the server with `node --watch`.

3. **Stop the local DB container when done**
   ```bash
   npm run dev:db-down
   ```

## Available routes (summary)
- `POST /api/auth/register/customer` – Customer registration
- `POST /api/auth/register/tailor` – Tailor registration
- `POST /api/auth/register/admin` – Admin creation (requires admin token)
- `POST /api/auth/login` – Login for all roles (`role` body field required)
- `GET /api/orders` – List orders for the authenticated user
- `POST /api/orders` – Create a new order (customer only)
- `PATCH /api/orders/:orderId/status` – Update order status (tailor/admin)
- `GET /api/measurements/fields` – Public measurement field metadata
- `POST /api/measurements` – Save measurements (customer only)
- `GET /api/tailors` – Browse tailors
- `PATCH /api/tailors/me` – Update tailor profile
- `PATCH /api/tailors/:tailorId/verify` – Admin verification toggle

Use the `Authorization: Bearer <token>` header for all authenticated endpoints.
