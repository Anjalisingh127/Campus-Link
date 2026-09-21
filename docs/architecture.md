# Architecture

CampusConnect uses a workspace-based monorepo containing an independently structured client and API.

## Request flow

1. The React client sends an HTTP request to `/api`.
2. Express applies security, CORS, and JSON parsing middleware.
3. A route delegates domain work to its controller and service layers.
4. The service accesses MongoDB through a Mongoose model.
5. Errors flow through centralized response middleware.
6. The API returns a consistent JSON response to the client.

## Design constraints

- Route handlers must not contain database implementation details.
- Secrets and environment-specific values must not be committed.
- All API errors must use the shared error response shape.
- New endpoints require successful and failure-path tests.
- Resume claims must be based on implemented and reproducible behavior.

Additional event, authentication, configuration, audit, and reporting modules will be introduced in separate verified commits.
