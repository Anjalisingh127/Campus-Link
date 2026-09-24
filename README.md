# CampusConnect

A full-stack campus event discovery and administration platform built with the MERN stack.

CampusConnect gives students one place to discover campus events and gives administrators secure tools to manage event data, control platform settings, restore earlier configurations, and review operational activity.

**Live application:** https://campus-connect-platform-sooty.vercel.app  
**API health:** https://campus-connect-api-s7jk.onrender.com/api/health  
**Repository:** https://github.com/Anjalisingh127/Campus-Link

> **Status:** Deployed and production-verified. The React client runs on Vercel, the Express API runs on Render, and production data is stored in MongoDB Atlas.

## What I built

I built CampusConnect to solve a simple campus problem: useful workshops, seminars, technical sessions, and cultural events are often announced through different groups and channels. The application brings those opportunities into one searchable platform while keeping event administration controlled and traceable.

The project goes beyond basic CRUD by including:

- authenticated and role-protected administration;
- searchable event discovery with filtering, sorting, date ranges, and pagination;
- versioned platform configuration with reasons and restoration;
- an operational audit trail with summary metrics and CSV export;
- layered backend architecture and consistent API errors;
- environment-based configuration and production deployment;
- automated linting, API tests, production builds, and GitHub Actions CI.

## Project highlights

- Built a React, Express, and MongoDB application as an npm workspace monorepo.
- Protected event, configuration, and audit workflows with JWT authentication and role-based authorization.
- Implemented configuration version history so administrators can publish, review, export, and restore settings safely.
- Recorded event creation, updates, and deletion in an audit trail linked to the responsible administrator.
- Verified models, services, middleware, and HTTP routes with **40 automated tests**.
- Deployed the complete application using Vercel, Render, and MongoDB Atlas.

## Features

### Event discovery

- Browse published campus events
- Search titles, descriptions, organizers, and tags
- Filter by category, status, and date range
- Sort by event date or title
- Navigate paginated results
- View complete event details and registration links
- Handle loading, empty, validation, and error states

### Authentication and authorization

- Register and sign in through the React interface
- Hash passwords with bcryptjs
- Issue signed JSON Web Tokens
- Protect private API routes
- Separate attendee and administrator permissions
- Restore the authenticated session through the profile endpoint

### Administrator operations

- Create, edit, and delete events
- Use a shared validated event form
- Publish platform configuration changes with a required reason
- Enable or disable event submissions
- Control registration visibility and the default page size
- Review immutable configuration history
- Restore an earlier configuration as a new version
- Export configuration history to CSV

### Operational audit

- Record event create, update, and delete actions
- Attribute each action to the authenticated administrator
- Filter records by action and date
- Review created, updated, deleted, and total counts
- Navigate paginated audit history
- Export audit evidence to CSV

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 7, JavaScript, CSS |
| Backend | Node.js, Express 5, REST APIs |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Security | Helmet, CORS, request validation |
| Logging | Morgan |
| Testing | Vitest, Supertest |
| Code quality | ESLint, npm audit |
| CI/CD | GitHub Actions, Vercel, Render |
| Project structure | npm workspaces, Git, GitHub |

## Architecture

~~~mermaid
flowchart TD
    U[Student or administrator] --> C[React client on Vercel]
    C -->|HTTPS REST requests| A[Express API on Render]
    A --> M[Authentication and validation middleware]
    M --> R[Controllers and routes]
    R --> S[Service layer]
    S --> D[(MongoDB Atlas)]
    A --> L[Central error handling and audit logging]
~~~

The backend follows a layered request flow:

1. **Routes** map HTTP endpoints and attach middleware.
2. **Middleware** authenticates users, checks roles, and validates inputs.
3. **Controllers** translate requests into application operations.
4. **Services** contain business rules and database interactions.
5. **Mongoose models** define persistent data and constraints.
6. **Error middleware** returns a consistent response contract.
7. **Audit services** preserve administrator activity for reporting.

More detail is available in [docs/architecture.md](docs/architecture.md), and the API contract is documented in [docs/api.md](docs/api.md).

## Production design

~~~mermaid
flowchart LR
    B[Browser] --> V[Vercel]
    V --> R[Render API]
    R --> A[(MongoDB Atlas)]
    G[GitHub main branch] --> CI[GitHub Actions]
    CI --> V
    CI --> R
~~~

| Component | Deployment |
| --- | --- |
| React client | Vercel |
| Express API | Render |
| Production database | MongoDB Atlas |
| Continuous integration | GitHub Actions |
| Secret management | Vercel and Render environment variables |

The frontend only contains public Vite configuration. Database credentials, JWT secrets, and administrator bootstrap credentials are never committed to the repository.

## Repository structure

~~~text
Campus-Link/
├── .github/
│   └── workflows/
│       └── ci.yml
├── client/
│   ├── src/
│   │   ├── api/          # Browser API clients
│   │   ├── components/   # Reusable interface components
│   │   ├── config/       # Client environment access
│   │   └── pages/        # Discovery, authentication and admin pages
│   └── .env.example
├── server/
│   ├── src/
│   │   ├── config/       # Environment and database configuration
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── middleware/   # Authentication, validation and errors
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # REST route definitions
│   │   ├── scripts/      # Administrator seeding
│   │   ├── services/     # Business and persistence logic
│   │   └── utils/        # Shared server utilities
│   ├── tests/
│   └── .env.example
├── docs/
│   ├── api.md
│   └── architecture.md
├── package.json
└── package-lock.json
~~~

## Data model

| Model | Purpose |
| --- | --- |
| Event | Stores event content, publishing status, tags, venue, date, and registration details |
| User | Stores identity, hashed password, and application role |
| PlatformConfiguration | Stores the active platform settings |
| ConfigurationVersion | Preserves immutable configuration snapshots and change reasons |
| AuditLog | Records administrative event changes and reporting metadata |

## API overview

Local base URL: http://localhost:5000/api  
Production base URL: https://campus-connect-api-s7jk.onrender.com/api

| Area | Endpoints | Access |
| --- | --- | --- |
| Health | GET /health | Public |
| Authentication | POST /auth/register, POST /auth/login, GET /auth/me | Mixed |
| Event discovery | GET /events, GET /events/:id | Public |
| Event management | POST /events, PUT /events/:id, DELETE /events/:id | Administrator |
| Configuration | GET /config | Public |
| Configuration management | update, history, restore, and CSV routes under /config | Administrator |
| Operational audit | history, summary, and CSV routes under /audit | Administrator |

Example event-discovery request:

~~~http
GET /api/events?search=cloud&category=workshop&status=published&sort=eventDate&order=asc&page=1&limit=10
~~~

See [docs/api.md](docs/api.md) for request bodies, query parameters, response shapes, and error contracts.

## Local development

### Prerequisites

- Node.js 22.12 or newer
- npm 10 or newer
- MongoDB Community Server or MongoDB Atlas

### 1. Clone and install

~~~bash
git clone https://github.com/Anjalisingh127/Campus-Link.git
cd Campus-Link
npm install
~~~

### 2. Create environment files

~~~powershell
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
~~~

On macOS or Linux:

~~~bash
cp client/.env.example client/.env
cp server/.env.example server/.env
~~~

Client variables:

~~~env
VITE_APP_NAME=CampusConnect
VITE_API_BASE_URL=http://localhost:5000/api
~~~

Server variables:

~~~env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_connect
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=admin@example.com
~~~

Use private values only in local or hosting-provider environment settings. Never commit real credentials.

### 3. Seed an administrator

Supply ADMIN_PASSWORD temporarily in your terminal environment, run the seed command, and then remove it from the environment.

~~~bash
npm run seed:admin --workspace server
~~~

The seed is idempotent: it creates the administrator when missing and updates the existing account when it already exists.

### 4. Start the application

~~~bash
npm run dev
~~~

- Client: http://localhost:5173
- API: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Available commands

| Command | Purpose |
| --- | --- |
| npm run dev | Start the client and server together |
| npm run build | Build the production client |
| npm run lint | Lint all workspaces |
| npm run test | Run automated server tests |
| npm run check | Run lint, tests, and production build |
| npm run seed:admin --workspace server | Create or update the administrator |

## Testing and continuous integration

The server test suite contains **40 tests** across seven files. It covers:

- health and unknown-route responses;
- event model validation;
- event service queries;
- search, filtering, sorting, date ranges, and pagination;
- authentication and authorization;
- protected event creation, update, and deletion;
- configuration publishing, history, restoration, and export;
- operational audit history, summaries, and CSV export.

Run the same quality gate used by CI:

~~~bash
npm run check
~~~

The GitHub Actions workflow runs on pushes and pull requests to main. It installs locked dependencies with npm ci and requires linting, tests, and the Vite production build to pass.

## Production verification

The deployed application was verified end to end with the following checks:

- API health returned service status ok and database status connected.
- The React client loaded event data through the production Render API.
- Administrator login and the authenticated profile endpoint succeeded.
- A temporary production event was created, updated, and deleted.
- The audit dashboard recorded all three actions against one resource ID.
- The operational audit report exported three structured CSV records.
- Production configuration version 1 was published with submissions enabled.
- MongoDB Atlas persisted production data.
- GitHub Actions completed the quality workflow successfully.

## Security decisions

- Real environment files are excluded from Git.
- Passwords are hashed before storage.
- JWT secrets and database credentials are supplied through environment variables.
- Protected routes require a valid Bearer token.
- Administrator routes check the authenticated role.
- Helmet sets common security headers.
- CORS accepts the configured frontend origin.
- Request bodies, object IDs, and query parameters are validated.
- Centralized middleware avoids leaking internal error details.

## Operational notes

- The Render free service may sleep during inactivity, so the first request can take about 50 seconds or longer.
- The public application intentionally does not expose administrator credentials.
- Production configuration should keep event submissions enabled unless maintenance requires a temporary pause.
- Configuration restoration creates a new version instead of overwriting history.
- Audit and configuration CSV exports provide portable operational evidence.

## Current limitations and future improvements

This is a portfolio project, and there are still useful improvements I would make in a larger production release:

- add automated browser tests for critical React workflows;
- add refresh-token rotation and account recovery;
- store registration records inside the platform instead of linking externally;
- add image uploads and event ownership;
- improve audit update metadata so it reports only fields whose values changed;
- add monitoring, rate limiting, and structured production logs;
- add a custom domain and accessibility testing.

## What I learned

Building CampusConnect helped me practise more than connecting a React page to an API. I worked through authentication, role boundaries, validation, configuration recovery, audit reporting, automated testing, CI, deployment, and environment management as one complete system.

The most useful lesson was that operational features matter as much as the main user flow. Configuration history, health checks, error handling, audit records, and deployment checks make an application easier to operate and troubleshoot.

## Author

**Anjali Singh**  
B.Tech Computer Science and Engineering, Sharda University  
[GitHub](https://github.com/Anjalisingh127) · [LinkedIn](https://www.linkedin.com/in/anjalisingh-as12)
