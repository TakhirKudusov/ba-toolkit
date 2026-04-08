---
name: risk
description: >
  Dedicated risk register for BA Toolkit projects. Use on /risk command, or when the user asks to "identify risks", "create a risk register", "assess project risks", "list risks", "risk matrix". Cross-cutting command — can run at any pipeline stage once Brief or SRS exists. Re-run after Research to capture technical risks.
---

# /risk — Risk Register

Cross-cutting command. Extracts risks from existing artifacts, classifies them by category, scores them by probability × impact, and produces or updates `00_risks_{slug}.md` with a full risk register.

## Syntax

```
/risk [optional: action]
```

Examples:
- `/risk` — build or refresh the full risk register
- `/risk add [description]` — manually add a risk and score it interactively
- `/risk update RISK-03` — update status or mitigation for a specific risk

## Context loading

0. If `00_principles_*.md` exists, load it — apply language convention (section 1) and ID naming convention (section 2).
1. Load artifacts in order, extracting risk signals from each:
   - `01_brief_{slug}.md` — Risks and Constraints sections (primary source)
   - `02_srs_{slug}.md` — Assumptions, Constraints, out-of-scope items
   - `06_nfr_{slug}.md` — NFR targets that are aggressive or uncertain (performance, security, availability)
   - `07a_research_{slug}.md` — ADR alternatives rejected, integration unknowns, technology risks
   - `08_apicontract_{slug}.md` — third-party API dependencies, rate limits, SLA gaps
2. Load `skills/references/domains/{domain}.md` — note any domain-specific compliance or regulatory risk categories.
3. If `00_risks_{slug}.md` already exists, load it to merge rather than replace.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Analysis pass

### Step 1 — Risk extraction

For each artifact, extract explicit and implicit risks:

- **Explicit:** statements containing "risk", "concern", "unknown", "assumption", "dependency", "TBD", "to be confirmed", "may", "might", "could fail".
- **Implicit:**
  - NFR targets with no stated baseline → measurement risk.
  - Third-party integrations with no documented SLA → dependency risk.
  - Features marked out of scope that may be expected by stakeholders → scope creep risk.
  - ADR alternatives rejected due to uncertainty → technical risk.

### Step 2 — Classification

Assign each risk to one category:

| Category | Examples |
|----------|---------|
| **Technical** | Architecture unknowns, integration failures, performance uncertainty, security gaps |
| **Business** | Market assumptions, stakeholder misalignment, budget or timeline pressure |
| **Compliance** | Regulatory requirements, data privacy (GDPR, HIPAA), licensing constraints |
| **External** | Third-party API availability, vendor lock-in, geopolitical or infrastructure factors |

### Step 3 — Scoring

Score each risk on two axes (1–5):

| Score | Probability | Impact |
|-------|------------|--------|
| 1 | Very unlikely | Negligible — no effect on delivery |
| 2 | Unlikely | Minor — small rework or delay |
| 3 | Possible | Moderate — scope or timeline affected |
| 4 | Likely | Major — milestone at risk |
| 5 | Very likely | Critical — project viability threatened |

**Risk Score = Probability × Impact** (range 1–25).

Priority thresholds:
- 🔴 **Critical:** score ≥ 15
- 🟡 **High:** score 8–14
- 🟢 **Medium:** score 4–7
- ⚪ **Low:** score 1–3

## Generation

Save `00_risks_{slug}.md` to the output directory.

```markdown
# Risk Register: {PROJECT_NAME}

**Domain:** {DOMAIN}
**Date:** {DATE}
**Slug:** {SLUG}
**Sources:** {list of artifacts scanned}

---

## Summary

| Priority | Count |
|---------|-------|
| 🔴 Critical | N |
| 🟡 High | N |
| 🟢 Medium | N |
| ⚪ Low | N |
| **Total** | **N** |

---

## Risk Register

| ID | Title | Category | Probability | Impact | Score | Priority | Status |
|----|-------|----------|:-----------:|:------:|:-----:|---------|--------|
| RISK-01 | [Short title] | Technical | 4 | 5 | 20 | 🔴 Critical | Open |
| RISK-02 | [Short title] | Business | 3 | 3 | 9 | 🟡 High | Open |

---

## Risk Details

### RISK-01 — [Short title]

**Category:** Technical
**Probability:** 4 / 5 — Likely
**Impact:** 5 / 5 — Critical
**Score:** 20 🔴 Critical
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
[Full description of the risk and the conditions under which it materialises.]

**Mitigation:**
[Steps to reduce the probability or impact before the risk occurs.]

**Contingency:**
[Steps to take if the risk materialises despite mitigation.]

**Owner:** [Role responsible — e.g., Tech Lead, Product Manager]
```

Risks are sorted by Score descending within each section. IDs are sequential (RISK-01, RISK-02, …) assigned in order of discovery, not severity.

### Merge behaviour

If `00_risks_{slug}.md` already exists:
- Preserve existing risks, their IDs, and manually set statuses.
- Add new risks found since last run with new sequential IDs.
- Re-score existing risks only if new information changes the assessment; note the change.
- Update the Sources and Date fields.

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file: `00_risks_{slug}.md`
- Total risks identified: N (N critical, N high, N medium, N low).
- Top 2–3 critical or high risks by name.
- If any risks have no mitigation defined: flag them for `/risk update`.

Available commands: `/risk add [description]` · `/risk update RISK-NN` · `/clarify [artifact]` · `/analyze`

## Style

Concise, factual. Risk descriptions state the condition and consequence ("If X happens, then Y will occur"). Do not inflate severity — score based on evidence from artifacts, not speculation. Use the artifact language set in `00_principles_{slug}.md`.
