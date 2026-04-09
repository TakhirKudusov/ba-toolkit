# Software Requirements Specification (SRS): [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Reference:** `01_brief_[SLUG].md`

## 1. Introduction

### 1.1 Purpose

[What this document describes and who it is for.]

### 1.2 Scope

[System boundaries — what is in scope and what is explicitly out of scope.]

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|------------|
| [term] | [definition] |

### 1.4 Document References

- Project Brief: `01_brief_[SLUG].md`

## 2. General Description

### 2.1 Product Context

[How the system fits into the broader ecosystem — users, external systems, platform.]

### 2.2 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| [role] | [description] | [what they can do] |

### 2.3 Constraints

[Technical, legal, regulatory, and business constraints.]

### 2.4 Assumptions and Dependencies

[What is assumed to be true; what external systems or services are depended upon.]

## 3. Functional Requirements

> **Grouping rule:** FRs are grouped by feature area as `### 3.N [Area name]` subsections. Each area gets a reserved numeric range (FR-001..099 for area 1, FR-100..199 for area 2, …). New FRs inserted later go into their area's free numbers, not the global tail — IDs stay stable.

### 3.1 [Feature Area Name]

#### FR-001: [Title]

- **Description:** [What the system must do.]
- **Actor:** [Role that triggers or benefits from this requirement.]
- **Input:** [What data or event initiates this.]
- **Output / Result:** [What the system produces or changes.]
- **Business Rules:** [Formulas, limits, conditions.]
- **Source:** [Stakeholder name, Brief goal G-N, regulatory requirement, or parent FR-NNN. Required for traceability.]
- **Verification:** Test | Demo | Inspection | Analysis
- **Rationale:** [Why this requirement exists. Not what — why. Helps future maintainers know what is safe to push back on.]
- **Priority:** Must | Should | Could | Won't

<!-- Repeat #### FR block for each requirement in this area. Numbering: FR-001, FR-002, ... within the area's reserved range. -->

### 3.2 [Next Feature Area Name]

#### FR-100: [Title]

- **Description:** ...
- **Actor:** ...
- **Input:** ...
- **Output / Result:** ...
- **Business Rules:** ...
- **Source:** ...
- **Verification:** Test | Demo | Inspection | Analysis
- **Rationale:** ...
- **Priority:** Must | Should | Could | Won't

## 4. Interface Requirements

### 4.1 User Interfaces

[Description of UI requirements at a system level — not screen layouts.]

### 4.2 Software Interfaces (API)

[External APIs the system must call or expose.]

### 4.3 External System Interfaces

[Integrations with third-party systems.]

## 5. Non-functional Requirements

_(Detailed in `/nfr` artifact — `06_nfr_[SLUG].md`)_

| Category | Summary | NFR Reference |
|----------|---------|---------------|
| [category] | [brief description] | NFR-[NNN] |

## 6. Priority Matrix (MoSCoW)

| Priority | FR Count | FR IDs |
|----------|----------|--------|
| Must     | [n]      | FR-001, FR-002, … |
| Should   | [n]      | … |
| Could    | [n]      | … |
| Won't    | [n]      | … |

## 7. Traceability — Brief Goal → FR

Forward traceability from the Project Brief's business goals to the FRs that satisfy them. Every Brief goal listed in `01_brief_[SLUG].md` §2 must have at least one linked FR; uncovered goals are flagged here as `(uncovered)` so they cannot silently disappear from the project.

| Goal ID | Goal Description (from `01_brief_[SLUG].md` §2) | Linked FRs |
|---------|--------------------------------------------------|------------|
| G1      | [goal text] | FR-001, FR-007, FR-014 |
| G2      | [goal text] | FR-003 |
| G3      | [goal text] | (uncovered) |
