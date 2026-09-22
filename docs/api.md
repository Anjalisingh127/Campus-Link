# API Reference

Base URL: `http://localhost:5000/api`

## Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Return service and database connection status |

## Events

| Method | Endpoint | Success status | Description |
| --- | --- | --- | --- |
| `GET` | `/events` | `200` | Return all events ordered by date |
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
