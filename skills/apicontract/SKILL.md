---
name: apicontract
description: >
  Generate API contracts: endpoints, methods, parameters, request/response schemas, error codes. Markdown format approximating OpenAPI. Use on /apicontract command, or when the user asks for "API contract", "describe API", "endpoints", "REST API", "WebSocket API", "describe API", "integration contract", "swagger", "describe requests and responses", "webhook contract", "API specification". Eighth step of the BA Toolkit pipeline.
---

# /apicontract — API Contract

Eighth step of the BA Toolkit pipeline. Generates API contracts in Markdown format approximating OpenAPI.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `02_srs_*.md`, `03_stories_*.md`, `07_datadict_*.md`. SRS and Data Dictionary are the minimum.
2. Extract: slug, domain, FR list, entities and attributes, integrations, roles.
3. If domain supported, load `references/domains/{domain}.md`, section `8. /apicontract`. Use typical endpoint groups.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/apicontract` (e.g., `/apicontract REST with JWT auth, OpenAPI 3.1`), use it as a style and protocol hint for the API design.

3–7 topics per round, 2–4 rounds.

**Standard alignment:** API Contract approximates the **OpenAPI 3.x** structure (servers, paths, parameters with `in` location, request body, responses keyed by HTTP status, components/schemas, security schemes). Markdown is the format, OpenAPI is the shape.

**Required topics:**
1. Protocol — REST, WebSocket, GraphQL, gRPC, or combination?
2. API versioning — URI-based (`/v1/`), header-based (`Accept-Version`), or media-type versioning?
3. Authentication and authorisation — JWT / OAuth2 / API Key / mTLS? Required scopes per endpoint group?
4. Webhook contracts — incoming events from external systems? Outgoing events to subscribers?
5. Error format — RFC 7807 Problem Details, or custom? Localised error messages?
6. Pagination — cursor-based, offset-based, or key-set? Default and max page size?
7. Rate limiting — global vs per-endpoint vs per-tenant? Headers (RateLimit-*)? 429 response shape?
8. **Idempotency** — how does the API support safe retries on POST? `Idempotency-Key` header? Server-side dedupe window?
9. **Content negotiation** — JSON only, or also CSV / XML / Protobuf? Accept header semantics?
10. **CORS policy** — which origins are allowed for browser callers? Which headers exposed?
11. **API deprecation policy** — how is breaking change communicated? `Sunset` header? Deprecation grace period?
12. **Per-endpoint SLO** — latency target per endpoint group, links to NFRs?

Supplement with domain-specific questions from the reference.

## Generation

**File:** `08_apicontract_{slug}.md`

```markdown
# API Contract: {Name}

## General Information
- **Base URL:** {url}
- **Authentication:** {method}
- **Versioning:** {strategy}
- **Data Format:** JSON, UTF-8

## Error Format
{JSON example}

## Common Error Codes
| HTTP Code | Error Code | Description |

## Endpoints

### {GROUP}: {Group Name}

#### {METHOD} {/path}
- **Description:** ...
- **Linked FR/US:** ...
- **Authentication:** {required | not required}
- **Roles:** ...

**Parameters:**
| Parameter | Type | Required | Description |

**Request Body:** {JSON}
**Response (200):** {JSON}
**Error Codes:**
| Code | Error Code | Condition |

## WebSocket Events (if applicable)
### Event: {name}
- **Direction:** {client → server | server → client}
- **Payload:** {JSON}

## Webhook Contracts (if applicable)
### Webhook: {name}
- **Source:** {external system}
- **Payload:** {JSON}
```

**Rules:**
- Endpoints grouped by domain (Auth, Users, Core, Admin, etc.).
- JSON schemas are representative examples with types in comments.
- Attributes consistent with Data Dictionary entity field types.
- Every endpoint has a **Source** field (FR-NNN) — no endpoint without provenance.
- Every endpoint has an **Idempotency** marker (idempotent / not idempotent / idempotent via Idempotency-Key header).
- Every endpoint has a **Required scope** (or "public" for unauthenticated paths) when OAuth2 / JWT scopes are in use.
- Every endpoint has a **Verification** method (contract test / consumer-driven contract test / integration test).
- Every endpoint has an **SLO** field linking to an NFR (latency target, error budget).
- The artifact carries an FR → Endpoint coverage matrix at the bottom.

## Iterative refinement

- `/revise [endpoint or group]` — rewrite.
- `/expand [endpoint]` — add parameters, errors, examples.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all FR with interface requirements covered; types match Data Dictionary; HTTP methods correct.
- `/done` — finalize. Next step: `/wireframes`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of endpoints grouped by HTTP method and domain group.
- Protocol and authentication method confirmed.
- WebSocket events and Webhook contracts included (if applicable).

Available commands for this artifact: `/clarify [focus]` · `/revise [endpoint]` · `/expand [endpoint]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /apicontract`). Do not hardcode `/wireframes` here.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request. Endpoint names, field names, and error codes remain in English.
