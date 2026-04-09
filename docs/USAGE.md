# Usage guide

Detailed walkthrough of the BA Toolkit pipeline in day-to-day use. For a high-level overview, see the main [README](../README.md). For problems, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 1. Starting a project

Setup is two phases: first `ba-toolkit init` scaffolds the project (slug, domain, agent install, `output/<slug>/AGENTS.md`); then you `cd` into the project folder and start the pipeline inside your AI agent with `/brief`.

```bash
# Step 1 — in your terminal, anywhere in your repo. Real terminals get
# an arrow-key menu for the domain and agent prompts (↑/↓ + j/k, a-z
# jump, Enter to select, Esc to cancel). CI / piped input falls back
# to a numbered prompt automatically.
npx @kudusov.takhir/ba-toolkit init

# Or non-interactive:
npx @kudusov.takhir/ba-toolkit init --name "Neobank App" --domain fintech --for claude-code

# Step 2 — open your AI agent inside the project folder. v3.1+ stores
# each project's AGENTS.md and artifacts under output/<slug>/, so two
# agent windows in the same repo can work on two completely
# independent projects with zero collision.
cd output/neobank-app
claude         # or `cursor .`, `windsurf .`, `gemini`, `codex`, etc.
```

After `init`, the slug, domain, and agent are fixed for the rest of the pipeline. Slug is derived from the project name and used as a suffix for every artifact: `01_brief_neobank-app.md`, `02_srs_neobank-app.md`, `03_stories_neobank-app.md`, …

### Multi-project in one repo

Each `ba-toolkit init` run creates a new `output/<slug>/` folder with its own `AGENTS.md`. To work on a different project later (or in a second agent window in parallel), `cd` into that project's folder:

```bash
# Window 1 — alpha project
cd output/alpha-shop && claude

# Window 2 — beta project, completely independent
cd output/beta-portal && claude
```

Skills look for `AGENTS.md` in `cwd` first, so each window operates on its own project state. There is no shared "active project" pointer to get out of sync.

Now start the pipeline inside the AI agent (cwd is `output/<slug>/`). There are two ways to call any interview-phase skill:

**(a) Plain slash command** — the agent asks an open-ended lead-in question first, then drills down with structured-option tables:

```
You:    /brief
Agent:  Reading AGENTS.md — project is Neobank App, domain fintech.
        Loading skills/references/domains/fintech.md.

        Tell me about the project in your own words: one or two
        sentences are enough. What are you building, who is it for,
        and what problem does it solve?

You:    A neobank with current accounts and cards for mass-market
        consumers in two LATAM countries.

Agent:  Got it — neobank with current accounts and cards, mass-market
        B2C, two-country LATAM launch. Next: what's the primary
        business goal for the first 12 months?

        | ID | Variant                                                |
        |----|--------------------------------------------------------|
        | a  | Acquire 100k users, prove product–market fit           |
        | b  | Reach $5M revenue from interchange + subscriptions     |
        | c  | Get a Tier-2 banking licence in country B              |
        | d  | Other — type your own answer                           |

You:    a
Agent:  Got it — 100k users, PMF focus. Next: what's the regulatory
        situation right now?

          [more questions, one at a time, ~6–8 total] ...

Agent:  [generates 01_brief_neobank-app.md]

        Artifact saved: output/neobank-app/01_brief_neobank-app.md
        Covered: 3 business goals, 5 stakeholders, 4 risks.

        Available: /clarify · /revise · /expand · /validate · /done
        Next step: /srs
```

**(b) Inline context after the slash command** — the agent skips the open-ended lead-in and uses your text to pre-fill what it can:

```
You:    /brief I want to build a neobank with current accounts and
        cards for mass-market consumers in two LATAM countries.

Agent:  Got it — neobank with current accounts and cards, mass-market
        B2C, two-country LATAM launch. Jumping straight to the next
        topic: what's the primary business goal for the first 12 months?

        | ID | Variant                                                |
        |----|--------------------------------------------------------|
        | a  | Acquire 100k users, prove product–market fit           |
        | b  | Reach $5M revenue from interchange + subscriptions     |
        | c  | Get a Tier-2 banking licence in country B              |
        | d  | Other — type your own answer                           |

You:    a
        ... (interview continues normally) ...
```

Both styles are supported by **every** interview-phase skill (`/discovery`, `/brief`, `/srs`, `/stories`, `/usecases`, `/ac`, `/nfr`, `/datadict`, `/research`, `/apicontract`, `/wireframes`, `/scenarios`, `/principles`, `/publish`). Inline context works for any of them — `/discovery I have a vague idea about a tool for freelance designers chasing late invoices`, `/srs focus on the payments module first`, `/stories I want to plan the onboarding epic`, `/nfr emphasise security and compliance`, `/publish notion`, etc. The agent uses it as a scope or focus hint, then runs the rest of the interview normally.

Every interview follows the same protocol — one question at a time, 3–5 domain-appropriate variants in a 2-column markdown table with letter IDs (`a`, `b`, `c`, …), plus a free-text "Other" row you can always type into. See [`skills/references/interview-protocol.md`](../skills/references/interview-protocol.md) for the full rule. You never have to remember the format — every shipped skill enforces it.

The **slug** (`neobank-app`) is set at `ba-toolkit init`, not at `/brief`. `/brief` reads it from `AGENTS.md` and reuses it across the pipeline.

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

Each project lives in its own `output/<slug>/` folder, which contains the project's `AGENTS.md` plus all of its artifacts (`01_brief_<slug>.md`, `02_srs_<slug>.md`, …). To work on a project, `cd` into its folder before opening your AI agent — that puts cwd at the project root, so every skill that looks for `AGENTS.md` or for prior artifacts via `01_brief_*.md` glob sees only this project's files.

```bash
# Two parallel projects in the same repo, two agent windows:
# Window 1
cd output/alpha-shop && claude       # works on alpha-shop only

# Window 2
cd output/beta-portal && claude      # works on beta-portal only
```

The two windows are completely isolated. Switching between projects later is just `cd output/<other-slug>`.

If you re-run `ba-toolkit init --slug <existing-slug>` for an existing project, the per-project `AGENTS.md` is **merged** (managed-block anchors), not overwritten — see §8 for the merge mechanism.

---

## 8. AGENTS.md — persistent project context

`ba-toolkit init` creates `AGENTS.md` inside `output/<slug>/`, alongside the project's artifacts. The file holds the project name, slug, domain, output folder, and a Pipeline Status table that the AI agent updates as you progress through the pipeline. Any AI agent (Claude Code, Codex, Gemini CLI, Cursor, Windsurf) opened in that folder reads this file to understand the context without rescanning every artifact — useful when resuming work in a new session.

```markdown
# BA Toolkit — Project Context

<!-- ba-toolkit:begin managed -->
> Auto-generated by `ba-toolkit init` on 2026-04-09. The Active Project block below is refreshed on every re-init. Everything outside this managed block is preserved — add your own notes, update the Pipeline Status, and edit the Key Constraints / Open Questions sections freely; `ba-toolkit init` will not touch them.

## Active Project

**Project:** My App
**Slug:** my-app
**Domain:** saas
**Language:** English
**Output folder:** output/my-app/
<!-- ba-toolkit:end managed -->

## Pipeline Status

| Stage | Skill | Status | File |
|-------|-------|--------|------|
| 0 | /discovery | ⬜ Not started | — |
| 0a | /principles | ⬜ Not started | — |
| 1 | /brief | ⬜ Not started | — |
| 2 | /srs | ⬜ Not started | — |
| ... | ... | ... | ... |

## Cross-cutting Tools
| Tool | Purpose |
|------|---------|
| /trace | Traceability Matrix + coverage gaps |
| /clarify [focus] | Targeted ambiguity resolution for any artifact |
| ... | ... |

## Key Constraints
- Domain: saas
- (Add constraints after /brief completes)

## Open Questions
- (None yet)
```

### Merge-on-reinit, not overwrite

Re-running `ba-toolkit init` in a project that already has `AGENTS.md` does **not** overwrite the file. The Active Project block is wrapped in `<!-- ba-toolkit:begin managed -->` / `<!-- ba-toolkit:end managed -->` anchors. On re-init, only that block is refreshed (name, slug, domain, init date) — everything outside the anchors is preserved byte-for-byte. So you can:

- Mark stages in `## Pipeline Status` as `✅ Done` as `/brief`, `/srs`, … finish — they survive future re-inits.
- Add notes to `## Key Constraints` and `## Open Questions` as you learn the project — they survive.
- Add entire new sections at the bottom (`## Stakeholder contacts`, `## Decisions log`, …) — they survive.
- Re-run `ba-toolkit init --name "Renamed App" --domain fintech` to fix a typo or change domain — only the Active Project block updates.

If `AGENTS.md` exists but has no managed-block anchors (legacy file from before v3.0, or fully hand-written), `init` leaves it untouched and prints `preserved AGENTS.md (no ba-toolkit managed block — left untouched)` instead of merging. Delete the file manually if you want a fresh template.

### How `/brief` and `/srs` interact with AGENTS.md

`/brief` and `/srs` both read `AGENTS.md` for the slug, domain, and language at the start, and update the `## Pipeline Status` table when they finish — toggling their row to `✅ Done` and filling in the artifact filename. They never touch the managed block. `/discovery`, `/principles`, and the other skills follow the same rule.

---

## Sharing artifacts with stakeholders

Once the pipeline is far enough along to be useful (typically after `/brief` or `/srs`, definitely by `/handoff`), you can hand the artifacts to non-developer stakeholders who live in Notion or Confluence rather than in your repo.

Use `ba-toolkit publish` (or `/publish` inside your AI agent) to bundle the markdown artifacts into import-ready folders:

```bash
cd output/<slug>
ba-toolkit publish                       # both formats, default ./publish/
ba-toolkit publish --format notion       # Notion only
ba-toolkit publish --format confluence   # Confluence only
ba-toolkit publish --format both --out ../share
ba-toolkit publish --dry-run             # preview the file list, write nothing
```

The command produces two folders under `./publish/`:

- **`publish/notion/`** — clean Markdown files. Drag-and-drop the folder into Notion's **Import → Markdown & CSV** dialog. Notion creates one page per file, the filename becomes the page title, and intra-project cross-references like `[FR-001](02_srs_<slug>.md#fr-001)` are preserved as page-to-page links.
- **`publish/confluence/`** — Self-contained HTML files plus `index.html` as the entry point. Zip the folder using your OS, then upload via **Space settings → Content tools → Import → HTML** in Confluence Cloud or Data Center. Tables, code blocks, headings, and cross-references all convert.

No API tokens, no OAuth, no network calls — the conversion happens entirely on your machine and the upload is a manual drag-and-drop. Re-running `ba-toolkit publish` overwrites the previous bundle, so it is safe to publish again after `/clarify`, `/revise`, or any later pipeline step.

---

## Appendix: time estimates

Approximate, depends on project complexity and interview depth.

| Step | Lean pipeline | Full pipeline |
|------|:---:|:---:|
| `/discovery` | — | 10–15 min |
| `/principles` | — | 5–10 min |
| `/brief` | 15–25 min | 20–35 min |
| `/publish` *(post-handoff, optional)* | 1–2 min | 1–2 min |
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
