# API Contract: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**API Style:** REST | GraphQL | gRPC
**Base URL:** `https://api.[domain].com/v1`
**Auth:** Bearer JWT | API Key | OAuth 2.0
**Versioning:** URI (`/v1/`) | Header (`Accept-Version`) | Media-type
**Standard:** Approximates OpenAPI 3.x structure
**References:** `02_srs_[SLUG].md`, `07_datadict_[SLUG].md`, `06_nfr_[SLUG].md`

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

| Field | Value |
|-------|-------|
| **Description** | [What this endpoint does] |
| **Source** | FR-[NNN], US-[NNN]  *(Required — what drove this endpoint)* |
| **Auth required** | Yes / No |
| **Required scope** | `resource:write` / public |
| **Idempotency** | Idempotent / Not idempotent / Idempotent via `Idempotency-Key` header |
| **Rate limit** | [N requests / minute / IP] or "global default" |
| **SLO** | p95 < 300ms (NFR-[NNN]) |
| **Verification** | Contract test / consumer-driven contract test / integration test |

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
| 403 | FORBIDDEN | Authenticated but insufficient permissions / scope |
| 404 | NOT_FOUND | Resource does not exist |
| 409 | CONFLICT | State conflict (duplicate, wrong status) |
| 422 | BUSINESS_RULE_ERROR | Request is valid but violates a business rule |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## Idempotency, CORS, and Deprecation

**Idempotency:** POST endpoints marked "Idempotent via header" accept an `Idempotency-Key` header (UUID v4 recommended). The server stores the request fingerprint + response for [N] hours. A retried request with the same key returns the cached response without re-executing the side effect.

**CORS policy:** Allowed origins listed in `[config file]`. Browsers from allowed origins may use the API directly with JWT in `Authorization` header. `OPTIONS` preflight responses cache for [N] seconds (`Access-Control-Max-Age`).

**API deprecation policy:** Breaking changes are announced via the `Sunset` HTTP response header (RFC 8594) at least [N] months in advance. The `Deprecation` header is set on every response from a deprecated endpoint. A deprecated endpoint continues to function for the entire grace period; only after the sunset date does it return `410 Gone`.

---

## FR → Endpoint Coverage Matrix

Forward traceability from each Functional Requirement in `02_srs_[SLUG].md` §3 to the API endpoints that implement it. An FR with no linked endpoint is flagged — every customer- or system-facing FR should have at least one linked endpoint.

| FR ID | FR Title | Linked Endpoints | Coverage Status |
|-------|----------|------------------|-----------------|
| FR-001 | [title] | `POST /auth/login`, `POST /auth/refresh` | ✓ |
| FR-002 | [title] | `GET /catalog`, `GET /catalog/:id` | ✓ |
| FR-003 | [title] | (uncovered) | ✗ |
