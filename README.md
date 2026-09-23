# CampusConnect

CampusConnect is a full-stack campus event discovery and management platform. The project is being rebuilt as a modular MERN application with tested REST APIs, configuration history, auditability, and automated quality checks.

## Current milestone

The repository currently contains:

- npm workspace-based monorepo
- React and Vite client
- Express server and MongoDB connection lifecycle
- environment validation and API health endpoint
- centralized 404 and error responses
- validated Event model and CRUD API layers
- server-side search, compound filtering, sorting, and pagination
- responsive React discovery interface with loading, error, empty, and pagination states
- client-side event creation and event-detail workflows
- accessible form validation and API error feedback
- JWT authentication with securely hashed passwords
- attendee and administrator role-based authorization
- protected event creation, update, and deletion endpoints
- administrator-managed platform configuration
- immutable configuration version history and restoration
- event-submission enforcement driven by active configuration
- administrator configuration dashboard with version restoration
- downloadable CSV configuration audit report
- immutable audit records for administrator event creation, updates, and deletion
- filtered audit history, operational action totals, and downloadable CSV reporting
- automated Event model, service, and HTTP route tests

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

- configuration version history and restoration
- automated tests and continuous integration

See [docs/architecture.md](docs/architecture.md) for the system structure and [docs/api.md](docs/api.md) for the current API contract.
