# CampusConnect

CampusConnect is a full-stack campus event discovery and management platform. The project is being rebuilt as a modular MERN application with tested REST APIs, configuration history, auditability, and automated quality checks.

## Current milestone

The repository currently contains the project foundation and Event API:

- npm workspace-based monorepo
- React and Vite client
- Express server
- environment validation
- MongoDB connection lifecycle
- API health endpoint
- centralized 404 and error responses
- initial API integration test
- validated Event data model
- event CRUD service, controller, and route layers
- consistent API validation and database error responses
- automated Event model and HTTP route tests
- server-side search, compound filtering, sorting, and pagination
- responsive React event discovery interface with loading, error, empty, and pagination states

Features are documented as completed only after implementation and verification.

## Prerequisites

- Node.js 22.12 or newer
- npm 10 or newer
- MongoDB Community Server or a MongoDB Atlas connection

## Setup

```bash
npm install
copy client\.env.example client\.env
copy server\.env.example server\.env
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Environment configuration

Runtime-specific settings are configured through `client/.env` and `server/.env`. The committed `.env.example` files document every supported variable, while actual `.env` files remain ignored by Git.

Only public browser configuration may use the `VITE_` prefix. Database URLs, credentials, tokens, and other secrets must remain in `server/.env` and must never be placed in the client environment.

## Quality checks

```bash
npm run check
```

## Planned modules

- authentication and role-based authorization
- administrator-managed platform configuration
- configuration version history and restoration
- change audit logs and CSV reporting
- automated tests and continuous integration

See [docs/architecture.md](docs/architecture.md) for the system structure and [docs/api.md](docs/api.md) for the current API contract.
