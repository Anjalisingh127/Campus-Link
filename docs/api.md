# API Reference

Base URL: `http://localhost:5000/api`

## Authentication

| Method | Endpoint | Success status | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `201` | Create an attendee account and return a JWT |
| `POST` | `/auth/login` | `200` | Authenticate an account and return a JWT |
| `GET` | `/auth/me` | `200` | Return the authenticated user profile |

`GET /auth/me` requires `Authorization: Bearer <token>`. Event discovery remains public; creating, updating, or deleting an event requires an authenticated user with the `admin` role.

## Platform configuration

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/config` | Public | Return active platform configuration |
| `PUT` | `/config` | Admin | Validate and publish a new configuration version |
| `GET` | `/config/history` | Admin | Return paginated immutable version history |
| `GET` | `/config/history.csv` | Admin | Download configuration history as a CSV audit report |
| `POST` | `/config/restore/:version` | Admin | Restore a snapshot as a new version |

Every update and restore requires a `changeReason`. Archived versions record the resulting settings, action, administrator identity, and timestamp. Disabling `eventSubmissionEnabled` blocks event creation with `503 EVENT_SUBMISSIONS_DISABLED`.

## Operational audit reporting

All audit endpoints require an authenticated administrator.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/audit` | Return paginated event-change history with optional action and date filters |
| `GET` | `/audit/summary` | Return totals for created, updated, and deleted event actions |
| `GET` | `/audit/export.csv` | Download the complete event audit trail as CSV |

Event creation, update, and deletion automatically record the action, event identity, administrator snapshot, timestamp, and relevant metadata. Supported `action` filters are `event.created`, `event.updated`, and `event.deleted`. The `from` and `to` filters accept valid dates; `page` defaults to `1` and `limit` defaults to `20` with a maximum of `100`.

## Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Return service and database connection status |

## Events

| Method | Endpoint | Success status | Description |
| --- | --- | --- | --- |
| `GET` | `/events` | `200` | Search, filter, sort, and paginate events |
| `GET` | `/events/:id` | `200` | Return one event |
| `POST` | `/events` | `201` | Create an event |
| `PUT` | `/events/:id` | `200` | Replace an event |
| `DELETE` | `/events/:id` | `204` | Delete an event |

## Event request

```json
{
  "title": "Cloud Computing Workshop",
  "description": "A practical workshop covering cloud computing fundamentals.",
  "category": "workshop",
  "organizer": "Cloud Computing Club",
  "venue": "Engineering Block A",
  "eventDate": "2026-11-20T10:00:00.000Z",
  "registrationUrl": "https://example.com/register",
  "tags": ["cloud", "workshop"],
  "status": "published"
}
```

Supported categories are `technical`, `cultural`, `sports`, `workshop`, `seminar`, and `other`. Supported statuses are `draft`, `published`, and `cancelled`.

## Event discovery queries

| Parameter | Accepted value | Default |
| --- | --- | --- |
| `search` | Up to 100 characters; searches title, description, organizer, and tags | Empty |
| `category` | Any supported event category | All |
| `status` | `draft`, `published`, or `cancelled` | All |
| `from` | Valid ISO-compatible date | Unbounded |
| `to` | Valid ISO-compatible date | Unbounded |
| `sort` | `eventDate`, `createdAt`, or `title` | `eventDate` |
| `order` | `asc` or `desc` | `asc` |
| `page` | Positive integer | `1` |
| `limit` | Integer from 1 to 50 | `10` |

Example:

```text
GET /api/events?search=cloud&category=workshop&status=published&sort=eventDate&order=asc&page=1&limit=10
```

## Error response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "title",
        "message": "title is required"
      }
    ]
  }
}
```
