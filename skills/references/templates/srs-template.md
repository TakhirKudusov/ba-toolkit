# Software Requirements Specification (SRS): [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Reference:** [01_brief_SLUG.md]

## 1. Introduction

### 1.1 Purpose

[What this document describes and who it is for.]

### 1.2 Scope

[System boundaries — what is in scope and what is explicitly out of scope.]

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|-----------|
| [term] | [definition] |

### 1.4 Document References

- Project Brief: `01_brief_[SLUG].md`

## 2. General Description

### 2.1 Product Context

[How the system fits into the broader ecosystem — users, external systems, platform.]

### 2.2 User Roles

| Role | Description | Permissions |
|------|-------------|------------|
| [role] | [description] | [what they can do] |

### 2.3 Constraints

[Technical, legal, regulatory, and business constraints.]

### 2.4 Assumptions and Dependencies

[What is assumed to be true; what external systems or services are depended upon.]

## 3. Functional Requirements

### FR-001: [Title]

- **Description:** [What the system must do.]
- **Actor:** [Role that triggers or benefits from this requirement.]
- **Input:** [What data or event initiates this.]
- **Output / Result:** [What the system produces or changes.]
- **Business Rules:** [Formulas, limits, conditions.]
- **Priority:** Must | Should | Could | Won't

<!-- Repeat for each FR. Numbering: FR-001, FR-002, ... -->

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
|----------|---------|--------|
| Must | [n] | FR-001, FR-002, … |
| Should | [n] | … |
| Could | [n] | … |
| Won't | [n] | … |
