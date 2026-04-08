# Data Dictionary: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `02_srs_[SLUG].md`, `03_stories_[SLUG].md`

---

## Entity: [EntityName]

**Description:** [What this entity represents in the domain.]
**Table / Collection:** `[table_name]`
**Linked FR:** FR-[NNN]

| Field | Type | Required | Default | Description | Constraints |
|-------|------|----------|---------|-------------|------------|
| id | UUID | Yes | auto | Primary key | Unique |
| [field] | [String \| Int \| Boolean \| Timestamp \| Decimal \| Enum \| FK] | Yes/No | [value or —] | [description] | [constraints, e.g. max 255, ≥ 0] |
| created_at | Timestamp | Yes | now() | Record creation time | |
| updated_at | Timestamp | Yes | now() | Last update time | |

**Relationships:**
- `[EntityName]` belongs to `[OtherEntity]` via `[field]` (many-to-one)
- `[EntityName]` has many `[OtherEntity]` (one-to-many)

**Indexes:**
- `[field]` — for [reason, e.g. lookup by email]

**Soft delete:** Yes — `deleted_at` field / No — hard delete
**Notes:** [Business rules, state machine, or special handling.]

---

## Entity: [EntityName2]

**Description:** [What this entity represents in the domain.]
**Table / Collection:** `[table_name]`
**Linked FR:** FR-[NNN]

| Field | Type | Required | Default | Description | Constraints |
|-------|------|----------|---------|-------------|------------|
| id | UUID | Yes | auto | Primary key | Unique |
| [field] | [type] | Yes/No | [value] | [description] | [constraints] |
| created_at | Timestamp | Yes | now() | Record creation time | |
| updated_at | Timestamp | Yes | now() | Last update time | |

**Relationships:**
- [relationship description]

**Soft delete:** Yes / No
**Notes:** [Special handling.]

<!-- Repeat Entity block for each domain entity. -->

---

## Enum Definitions

### [EnumName]

| Value | Label | Description |
|-------|-------|-------------|
| [VALUE] | [Display label] | [When this value applies] |

---

## Entity Relationship Overview

```
[EntityName] ──< [EntityName2]
[EntityName2] >── [EntityName3]
```

_Full ERD: generated separately by the development team._
