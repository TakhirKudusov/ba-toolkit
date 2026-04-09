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

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of 3–5 domain-appropriate options, always include a free-text "Other" row as the last option, and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/apicontract` (e.g., `/apicontract REST with JWT auth, OpenAPI 3.1`), use it as a style and protocol hint for the API design.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Protocol — REST, WebSocket, GraphQL, combination?
2. API versioning — URI-based, header-based?
3. Authentication — JWT, API Key, OAuth2?
4. Webhook contracts — needed for incoming events from external systems?
5. Error format — standard (RFC 7807) or custom?
6. Pagination — cursor-based, offset-based? Limits?
7. Rate limiting — any restrictions? For which endpoints?

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
- Attributes consistent with Data Dictionary.

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

Available commands: `/clarify [focus]` · `/revise [endpoint]` · `/expand [endpoint]` · `/validate` · `/done`

Next step: `/wireframes`

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request. Endpoint names, field names, and error codes remain in English.
