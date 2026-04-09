# Wireframe Descriptions: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `03_stories_[SLUG].md`, `04_usecases_[SLUG].md`, `05_ac_[SLUG].md`, `06_nfr_[SLUG].md`, `08_apicontract_[SLUG].md`
**Accessibility target:** WCAG 2.1 AA

> These are textual wireframe descriptions, not visual diagrams. Each screen is described with sufficient detail for a designer to produce a high-fidelity mockup.

---

## Screen Index

| ID | Screen Name | Platform | Linked Stories |
|----|------------|----------|---------------|
| WF-001 | [Screen name] | Web / iOS / Android / All | US-[NNN] |

---

## WF-001: [Screen Name]

**Source:** US-[NNN]  *(Required — which user story this screen serves)*
**Platform:** Web | iOS | Android | All
**Route / Deep link:** `[/path or app://screen]`
**Entry points:** [Where the user comes from — e.g. Home → tap "Browse"]
**Linked Stories:** US-[NNN], US-[NNN]
**Linked UC:** UC-[NNN]
**Linked AC:** AC-[NNN]-[NN]  *(scenarios this screen verifies)*
**Linked NFR:** NFR-[NNN]  *(performance, accessibility, or other UI-impacting NFRs)*
**Internationalisation:** LTR / RTL / both; long-string accommodation: yes / no

### Layout

**Header / Navigation:**
[Describe top bar — back button, title, right-side actions.]

**Body:**
[Describe the main content area top to bottom. Mention each UI element: headings, lists, cards, images, form fields, buttons, empty states.]

**Footer / Bottom navigation:**
[Describe persistent navigation or action bar if present.]

### States *(canonical 8 — every screen describes all that apply)*

| State | Description |
|-------|-------------|
| Default | [Initial state when the screen first appears, if distinct from "loaded"] |
| Loading | [Skeleton screen / spinner / progress bar — what the user sees while data fetches] |
| Empty | [Empty state message + primary CTA — first-time experience] |
| Loaded | [Data is present and rendered — the canonical "happy" state] |
| Partial | [Some data shown, more loading — pagination / streaming] |
| Success | [After a user action completes — confirmation banner, toast, animation] |
| Error | [Failure state — message + recovery action] |
| Disabled | [Action not available — visible reason for the user, no dead-end] |
| [Feature state] | [Optional feature-specific state, e.g. "trial expired", "offline mode"] |

### Interactions

| Trigger | Action |
|---------|--------|
| Tap [element] | [Navigation or action] |
| Scroll to bottom | [Pagination load / sticky header behaviour] |
| [Other gesture] | [Result] |

### Design Notes

- [Specific UX note, e.g. "Confirmation dialog before destructive action"]
- [Accessibility note, e.g. "Form labels must be visible, not only placeholder text"]

---

## WF-002: [Screen Name]

**Platform:** Web | iOS | Android | All
**Route / Deep link:** `[/path]`
**Entry points:** [Entry points]
**Linked Stories:** US-[NNN]

### Layout

**Header / Navigation:** [Description]

**Body:** [Description]

**Footer:** [Description]

### States

| State | Description |
|-------|-------------|
| Loading | [Description] |
| Empty | [Description] |
| Error | [Description] |

### Interactions

| Trigger | Action |
|---------|--------|
| [Trigger] | [Action] |

### Design Notes

- [Note]

<!-- Repeat WF block for each screen. Numbering: WF-001, WF-002, ... -->

---

## US → WF Coverage Matrix

Forward traceability from each User Story to the screen(s) that implement it. Every Must-priority story should have at least one linked screen; uncovered stories are flagged.

| US ID | US Title | Linked Wireframes | Coverage Status |
|-------|----------|-------------------|-----------------|
| US-001 | [title] | WF-001, WF-002 | ✓ |
| US-002 | [title] | WF-003 | ✓ |
| US-003 | [title] | (uncovered) | ✗ |
