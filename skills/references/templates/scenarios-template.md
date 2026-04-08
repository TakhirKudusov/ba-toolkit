# Validation Scenarios: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `03_stories_[SLUG].md`, `05_ac_[SLUG].md`, `09_wireframes_[SLUG].md`, `08_apicontract_[SLUG].md`

---

## Scenario Index

| ID | Title | Persona | Priority | Type |
|----|-------|---------|---------|------|
| SC-001 | [Title] | [Persona] | P1 | Happy path |
| SC-002 | [Title] | [Persona] | P2 | Negative |
| SC-003 | [Title] | [Persona] | P1 | Edge case |

---

## SC-001: [Scenario Title]

**Persona:** [Name and role — e.g. "Alex, a returning customer"]
**Type:** Happy path | Negative | Edge case | Performance | Security
**Priority:** P1 (critical) | P2 (important) | P3 (nice to have)
**Entry point:** [Where the scenario starts — e.g. "Home screen, not logged in"]
**Platform:** Web | iOS | Android | API
**Linked Stories:** US-[NNN], US-[NNN]
**Linked AC:** US-[NNN] Scenario [N]

### Steps

| # | Actor | Action | Expected Result | Ref |
|---|-------|--------|----------------|-----|
| 1 | [Persona] | [Does something] | [What happens] | WF-[NNN] |
| 2 | System | [Responds] | [State changes] | API: `POST /[endpoint]` |
| 3 | [Persona] | [Continues] | [UI updates] | AC: US-[NNN] S[N] |

### Expected Outcome

[What the final state is when the scenario completes successfully.]

### Failure Conditions

| Condition | Expected Behaviour |
|-----------|-------------------|
| [What could go wrong] | [How the system should handle it] |

---

## SC-002: [Scenario Title]

**Persona:** [Persona]
**Type:** Negative | Happy path | Edge case
**Priority:** P1 | P2 | P3
**Entry point:** [Start state]
**Platform:** [Platform]
**Linked Stories:** US-[NNN]
**Linked AC:** US-[NNN] Scenario [N]

### Steps

| # | Actor | Action | Expected Result | Ref |
|---|-------|--------|----------------|-----|
| 1 | [Persona] | [Action] | [Result] | WF-[NNN] |
| 2 | System | [Response] | [State] | |

### Expected Outcome

[Final state after scenario.]

### Failure Conditions

| Condition | Expected Behaviour |
|-----------|-------------------|
| [Condition] | [Behaviour] |

<!-- Repeat SC block for each scenario. Numbering: SC-001, SC-002, ... -->

---

## Coverage Summary

| Artifact | Covered | Not Covered |
|---------|---------|------------|
| User Stories | [N] / [Total] | US-[NNN], … |
| Acceptance Criteria Scenarios | [N] / [Total] | |
| API Endpoints | [N] / [Total] | `[endpoint]`, … |
| Wireframe screens | [N] / [Total] | WF-[NNN], … |

**Happy path scenarios:** [N]
**Negative scenarios:** [N]
**Edge case scenarios:** [N]
**Total scenarios:** [N]
