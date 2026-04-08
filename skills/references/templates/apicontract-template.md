# API Contract: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**API Style:** REST | GraphQL | gRPC
**Base URL:** `https://api.[domain].com/v1`
**Auth:** Bearer JWT | API Key | OAuth 2.0
**References:** `02_srs_[SLUG].md`, `07_datadict_[SLUG].md`

---

## Authentication

```
Authorization: Bearer <token>
```

Token obtained via `POST /auth/token`. Expires in [N] minutes. Refresh via `POST /auth/refresh`.

---

## Conventions

- Dates: ISO 8601 (`2026-04-07T10:00:00Z`)
- IDs: UUID v4
- Pagination: cursor-based — `?cursor=[cursor]&limit=[N]`
- Errors: `{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }`
- Amounts: stored and returned in minor units (e.g. cents)

---

## Endpoints

### POST /[resource]

**Description:** [What this endpoint does.]
**Auth required:** Yes | No
**Linked FR:** FR-[NNN] | **Linked Story:** US-[NNN]

**Request body:**

```json
{
  "[field]": "[type — description]",
  "[field]": "[type — description]"
}
```

**Response `201 Created`:**

```json
{
  "id": "uuid",
  "[field]": "[value]"
}
```

**Error responses:**

| Code | Error Code | Description |
|------|-----------|-------------|
| 400 | VALIDATION_ERROR | [Which fields, which rule] |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 409 | [CONFLICT_CODE] | [Conflict condition] |

---

### GET /[resource]

**Description:** [What this endpoint returns.]
**Auth required:** Yes | No
**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | String | No | Pagination cursor |
| limit | Int | No | Max items (default 20, max 100) |
| [filter] | [type] | No | [Description] |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "[field]": "[value]"
    }
  ],
  "pagination": {
    "next_cursor": "[cursor or null]",
    "has_more": true
  }
}
```

---

### GET /[resource]/:id

**Description:** [What this endpoint returns.]
**Auth required:** Yes | No

**Response `200 OK`:**

```json
{
  "id": "uuid",
  "[field]": "[value]"
}
```

**Error responses:**

| Code | Error Code | Description |
|------|-----------|-------------|
| 404 | NOT_FOUND | Resource does not exist |

---

### PATCH /[resource]/:id

**Description:** [What this endpoint updates.]
**Auth required:** Yes
**Linked FR:** FR-[NNN]

**Request body** (all fields optional):

```json
{
  "[field]": "[new value]"
}
```

**Response `200 OK`:** Updated resource object.

---

### DELETE /[resource]/:id

**Description:** [Soft or hard delete — specify.]
**Auth required:** Yes

**Response `204 No Content`**

<!-- Repeat endpoint blocks as needed. Group by resource. -->

---

## Webhooks

### [event.name]

**Trigger:** [When this event fires]
**Payload:**

```json
{
  "event": "[event.name]",
  "timestamp": "2026-04-07T10:00:00Z",
  "data": {
    "[field]": "[value]"
  }
}
```

**Retry policy:** [N] retries with exponential backoff. Delivery considered failed after [N] hours.

---

## Error Code Reference

| HTTP Code | Error Code | Meaning |
|-----------|-----------|---------|
| 400 | VALIDATION_ERROR | Request body or params fail validation |
| 401 | UNAUTHORIZED | Missing, expired, or invalid token |
| 403 | FORBIDDEN | Authenticated but insufficient permissions |
| 404 | NOT_FOUND | Resource does not exist |
| 409 | CONFLICT | State conflict (duplicate, wrong status) |
| 422 | BUSINESS_RULE_ERROR | Request is valid but violates a business rule |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |
