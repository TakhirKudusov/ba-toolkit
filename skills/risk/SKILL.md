---
name: risk
description: >
  Dedicated risk register for BA Toolkit projects. Use on /risk command, or when the user asks to "identify risks", "create a risk register", "assess project risks", "list risks", "risk matrix". Utility skill — can run at any pipeline stage once Brief or SRS exists. Re-run after Research to capture technical risks.
---

# /risk — Risk Register

Utility skill. Extracts risks from existing artifacts, classifies them by category, scores them by probability × impact, and produces or updates `00_risks_{slug}.md` with a full risk register.

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
2. Load `references/domains/{domain}.md` — note any domain-specific compliance or regulatory risk categories.
3. If `00_risks_{slug}.md` already exists, load it to merge rather than replace.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Calibration interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended), render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/risk` (e.g., `/risk medium tolerance, focus on compliance`), parse it and skip the matching questions.

If the user invokes `/risk` with no inline hint, ask the following short calibration interview (skip any question already answered by `00_principles_*.md` or by the project Brief):

1. **Risk tolerance** — what is the project's appetite for risk? Drives which risks get accepted vs avoided. **Recommended:** Medium for a typical commercial project; Low for regulated / public-sector / safety-critical; High for early-stage prototypes.
2. **Domain-specific frameworks** — beyond the canonical 4 risk categories (Technical / Business / Compliance / External), do any industry frameworks apply? E.g. **FAIR** (Factor Analysis of Information Risk) for cyber, **ISO 14971** for medical devices, **COSO ERM** for financial controls, **NIST RMF** for US federal systems.
3. **Review cadence** — how often will the risk register be re-assessed in production? **Recommended:** monthly for High and above, quarterly for Medium, ad-hoc for Low.
4. **Treatment strategy preference** — does the project prefer Avoid (eliminate), Reduce (mitigate), Transfer (insurance / vendor), or Accept (budget for)? Determines the default treatment recommendation per risk.

## Standards alignment

The skill follows **ISO 31000** (Risk Management — Guidelines) and **PMI PMBOK 7** risk-management practices. Each risk carries the canonical risk-management fields:

- **Probability × Impact = Score** (5×5 matrix, range 1–25).
- **Velocity** — how fast the risk materialises once triggered (Days / Weeks / Months / Years). Determines reaction time and whether mitigation has to be in place before the trigger or whether reactive response is enough.
- **Treatment strategy** — Avoid / Reduce / Transfer / Accept (PMBOK 7 + ISO 31000 vocabulary).
- **Mitigation** (Reduce: lower probability or impact before the risk occurs).
- **Contingency** (post-event response if mitigation fails).
- **Owner** (single accountable role).
- **Review cadence** (when this risk will be re-assessed — drives the "set and forget" failure mode).

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

Score each risk on three axes:

| Score | Probability | Impact | Velocity |
|-------|-------------|--------|----------|
| 1 | Very unlikely | Negligible — no effect on delivery | Years — long warning |
| 2 | Unlikely | Minor — small rework or delay | Months — moderate warning |
| 3 | Possible | Moderate — scope or timeline affected | Weeks — short warning |
| 4 | Likely | Major — milestone at risk | Days — minimal warning |
| 5 | Very likely | Critical — project viability threatened | Immediate — no warning |

**Risk Score = Probability × Impact** (range 1–25). Velocity is recorded separately and influences treatment strategy: a high-Velocity risk with Days-level warning *cannot* be treated reactively — mitigation must be in place before the trigger fires.

Priority thresholds:
- 🔴 **Critical:** score ≥ 15
- 🟡 **High:** score 8–14
- 🟢 **Medium:** score 4–7
- ⚪ **Low:** score 1–3

### Step 4 — Treatment strategy

Assign each risk one of the four canonical treatment strategies (PMBOK 7 / ISO 31000 vocabulary). The strategy determines what "mitigation" and "contingency" actually mean for that risk:

- **Avoid** — eliminate the cause entirely. Drop the feature, change the architecture, switch the vendor. Used when the risk is unacceptable and cheap to eliminate.
- **Reduce / Mitigate** — lower the probability or the impact via active steps before the trigger. The default for most technical and process risks.
- **Transfer** — move the risk to a third party via insurance, contract terms, vendor SLA, or escrow. Used for risks the project cannot directly control.
- **Accept** — acknowledge the risk and budget for it. Used when the cost of the other three strategies exceeds the expected impact, or when no realistic treatment exists.

## Generation

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

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

Concise, factual. Risk descriptions state the condition and consequence ("If X happens, then Y will occur"). Do not inflate severity — score based on evidence from artifacts, not speculation. Generate output in the language of the artifact — see `references/language-rule.md` for what to translate and what stays in English.
