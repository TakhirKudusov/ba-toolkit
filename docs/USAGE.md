# Usage guide

Detailed walkthrough of the BA Toolkit pipeline in day-to-day use. For a high-level overview, see the main [README](../README.md). For problems, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 1. Starting a project

Run the first command and the agent takes it from there — it loads domain references, asks questions, and generates the artifact. You never edit SKILL.md files directly.

```
You:    /brief
Agent:  What domain is your project in? (iGaming, Fintech, SaaS, other?)
You:    Fintech — a neobank mobile app
Agent:  Great. Let me ask a few questions.
        1. What is the primary business goal — acquiring new users, increasing card usage, or something else?
        2. What geography and currency does the app target?
        3. Are there existing banking partners or will the app be a standalone product?
You:    [answer all three]
Agent:  Two more questions...
        [1-2 more rounds]
Agent:  [generates 01_brief_neobank-app.md]

        Artifact saved: 01_brief_neobank-app.md
        Covered: 3 business goals, 5 stakeholders, 4 risks.
        Slug fixed for this pipeline: neobank-app

        Available: /clarify · /revise · /expand · /validate · /done
        Next step: /srs
```

The **slug** (`neobank-app`) is derived from the project name at `/brief` and used as a suffix for every subsequent file: `02_srs_neobank-app.md`, `03_stories_neobank-app.md`, and so on.

---

## 2. Moving through the pipeline

After reviewing the generated artifact, either refine it or finalize it:

```
# Not happy with a section — rewrite it
You:    /revise section 3
Agent:  [asks what to change, rewrites section 3, saves the file]

# Want more detail
You:    /expand section 7
Agent:  [adds detail to section 7]

# Happy with the result — move to the next step
You:    /done
Agent:  Brief finalized. Artifact saved.
        Next step: /srs
```

Each step reads the output of all previous steps automatically. You do not need to paste or reference prior files — the agent finds them by slug in the output directory.

---

## 3. Using /clarify

Run `/clarify` after generating any artifact to surface ambiguities before moving on. It is faster than realising a problem three steps later.

```
You:    /clarify
Agent:  Found 4 ambiguities in 02_srs_neobank-app.md:

        1. [FR-003] "The system must respond quickly" — what is the target response time in ms?
        2. [FR-011] "Admin" role is used but not defined in section 2.2 — same as "Compliance Officer"?
        3. [NFR-001] "High availability" — what is the numeric SLA target (%)?
        4. [FR-019 vs FR-024] Both describe currency conversion — are these the same feature?

You:    1. Under 200ms at p95. 2. No, Admin is a separate internal role. 3. 99.9%. 4. Yes, merge them.
Agent:  [updates FR-003, adds Admin to roles, adds 99.9% to NFR-001, merges FR-019 and FR-024]
        Updated: 02_srs_neobank-app.md — 4 ambiguities resolved.
```

You can also focus on a specific area:

```
You:    /clarify security
You:    /clarify FR-015
```

---

## 4. Using /analyze

Run `/analyze` at any point after `/srs` to get a cross-artifact quality report. Unlike `/trace` (which checks links), `/analyze` also catches duplicates, ambiguous language, and terminology drift.

```
You:    /analyze
Agent:  [reads all existing artifacts]

        Artifact saved: 00_analyze_neobank-app.md

        Finding Report:
        | ID | Category      | Severity | Location          | Summary                          | Recommendation        |
        |----|---------------|----------|-------------------|----------------------------------|-----------------------|
        | A1 | Coverage Gap  | CRITICAL | srs:FR-008        | No linked user story             | Create US or remove   |
        | A2 | Ambiguity     | HIGH     | nfr:NFR-004       | "Scalable" without metric        | Add target RPS        |
        | A3 | Terminology   | HIGH     | srs + stories     | "Wallet" vs "Balance" drift      | Standardize in glossary |
        | A4 | Duplication   | MEDIUM   | srs:FR-012,FR-017 | Near-duplicate login requirements| Merge                 |

        Overall coverage: FR→US 87% · US→AC 94%
        CRITICAL: 1 · HIGH: 2 · MEDIUM: 1

        Top actions: fix A1 with /stories, fix A2 with /clarify NFR-004, fix A3 with /revise glossary
```

**Severity guide:**

| Severity | Meaning | Action |
|----------|---------|--------|
| CRITICAL | Blocks pipeline integrity — missing mandatory link, non-existent ID | Fix before `/done` |
| HIGH | Significant quality risk — missing metric, key term drift | Fix before handoff |
| MEDIUM | Quality concern, does not block | Document or defer |
| LOW | Style suggestion | Optional |

Re-run `/analyze` after fixes to track progress.

---

## 5. Using /trace

Run `/trace` after `/stories` to check traceability coverage. It builds the full FR → US → UC → AC → ... matrix.

```
You:    /trace
Agent:  [generates 00_trace_neobank-app.md]

        Coverage Summary:
        FR → US:       24/27 (89%) — FR-008, FR-019, FR-022 uncovered
        US → AC:       41/41 (100%) ✓
        Entity → FR:   18/20 (90%) — Transaction, AuditLog not linked

        Recommendations:
        — Create user stories for FR-008, FR-019, FR-022 or remove them from SRS
        — Link Transaction and AuditLog to relevant FR in /datadict
```

Run `/trace` again after fixing gaps — it re-reads all artifacts and recomputes the matrix.

---

## 6. Splitting large elements

If a user story or requirement is too broad, split it:

```
You:    /split US-014
Agent:  US-014 covers 4 distinct actions. Suggested split:
        — US-014a: Player views transaction history (read-only)
        — US-014b: Player filters transactions by date and type
        — US-014c: Player exports transactions as PDF
        — US-014d: Player disputes a transaction

        Shall I apply this split?
You:    Yes, but combine 014a and 014b
Agent:  [rewrites US-014 as two stories: US-014 and US-014b]
```

---

## 7. Working with multiple projects

Each project gets its own slug and its own set of files. If you work on multiple projects in the same directory, run `/principles` first for each and set `output mode: subfolder` — files will be organised under `{slug}/` subfolders automatically.

If you start a new project without changing the output directory, the agent detects existing `01_brief_*.md` files and warns you before overwriting anything.

---

## 8. AGENTS.md — persistent project context

After `/brief` completes, the agent creates or updates `AGENTS.md` in your project root. This file stores the project slug, domain, key constraints, artifact paths, and the current pipeline stage.

```markdown
# BA Toolkit — Project Context

**Project:** Dragon Fortune
**Slug:** dragon-fortune
**Domain:** iGaming
**Language:** English
**Pipeline stage:** Brief complete

## Artifacts
- `/outputs/01_brief_dragon-fortune.md` — Project Brief

## Key context
- **Business goal:** Telegram Mini App slot for CIS markets, 50k MAU in 6 months
- **Key constraints:** Telegram API limits, AML/KYC compliance, certified RTP

## Next step
Run /srs to generate the Requirements Specification.
```

`AGENTS.md` is updated again after `/srs` with roles, integrations, and FR count. Any AI agent (Claude Code, Codex, Gemini CLI) that reads this file will understand the project context without re-reading all artifacts — useful when resuming work in a new session.

---

## Appendix: time estimates

Approximate, depends on project complexity and interview depth.

| Step | Lean pipeline | Full pipeline |
|------|:---:|:---:|
| `/principles` | — | 5–10 min |
| `/brief` | 15–25 min | 20–35 min |
| `/srs` | 25–40 min | 30–50 min |
| `/stories` | 20–30 min | 25–40 min |
| `/usecases` | — | 20–35 min |
| `/ac` | 20–35 min | 25–40 min |
| `/nfr` | 15–20 min | 15–25 min |
| `/datadict` | 15–25 min | 20–30 min |
| `/research` | — | 15–25 min |
| `/apicontract` | 20–35 min | 25–40 min |
| `/wireframes` | 25–40 min | 30–50 min |
| `/scenarios` | — | 15–25 min |
| `/trace` + `/analyze` | — | 10–15 min |
| `/handoff` | 5–10 min | 5–10 min |
| **Total** | **~3–4 hours** | **~5–8 hours** |
