# BA Toolkit — Future Improvements

Backlog of planned improvements, ordered by execution sequence.
Items marked ✅ are complete and kept here for reference.

---

## Recently completed

| # | Item | Version |
|---|------|---------|
| ✅ | Templates for all 16 artifacts (`skills/references/templates/`) | v1.1.0 |
| ✅ | 6 new domain references (ecommerce, healthcare, logistics, on-demand, social-media, real-estate) | v1.1.0 |
| ✅ | `/estimate` skill — Story Points / T-shirt sizing with split recommendations | v1.1.0 |
| ✅ | `/glossary` skill — unified project glossary with terminology drift detection | v1.1.0 |
| ✅ | `/export` skill — Jira / GitHub Issues / Linear / CSV export | v1.1.0 |
| ✅ | `init.ps1` / `init.sh` — project initialiser scripts | v1.1.0 |
| ✅ | GitHub Actions CI workflow — artifact and skill validation on PR | v1.1.0 |
| ✅ | `CHANGELOG.md` — Keep a Changelog + SemVer format | v1.1.0 |

---

## High priority

Items are sequential — each unblocks the next.

### ✅ 1. Quick fixes

| # | Item | Effort |
|---|------|--------|
| ✅ | Fix README intro: says "16 interconnected skills" — should be 19 | 5 min |
| ✅ | `skills/references/templates/export-template.md` — missing template for `/export` output | ~1 h |
| ✅ | `COMMANDS.md` — one-page cheat sheet: all 19 skills + subcommands with syntax and one-liners | ~1 h |

---

### ✅ 2. GitHub release workflow

**What:** `.github/workflows/release.yml` that triggers on version tags (`v*.*.*`) and creates a GitHub Release with release notes auto-generated from `CHANGELOG.md`.

**Why:** Gives users a clear versioned release to reference when they install or update the toolkit. Also required to trigger `npm publish` automatically (item 5). v1.1.0 exists in CHANGELOG but has no GitHub Release yet.

**Effort:** Low.

---

### ✅ 3. `/risk` skill

**What:** Dedicated risk register artifact: extract risks from Brief, SRS, and Research, generate `00_risks_{slug}.md` with a probability × impact matrix, risk owner, and mitigation strategy per item.

**Why:** Risk management is a core BA deliverable. Currently risks are buried inside Brief and SRS with no dedicated tracking or prioritisation. A standalone artifact makes them reviewable and actionable.

**Structure:**
- Risk ID (RISK-01, RISK-02, …)
- Category (technical / business / compliance / external)
- Probability (1–5) × Impact (1–5) = Score
- Status (open / mitigated / accepted / closed)
- Mitigation and contingency

**Effort:** Low–Medium (~1 day, follows the same skill pattern as `/glossary`).

---

### ✅ 4. `/sprint` skill

**What:** Generate a sprint plan from estimated User Stories: group by priority and team capacity, output sprint goal, velocity, and story list per sprint. Generates `00_sprint_{slug}.md`.

**Why:** Natural continuation after `/estimate` — closes the loop from "idea → spec → estimate → sprint". Without this step the user has to manually organise stories into sprints.

**Dependencies:** Requires `/estimate` output. Works best after `/risk` is done (risk-weighted prioritisation).

**Effort:** Low–Medium (~1 day, same pattern as `/glossary` and `/risk`).

---

### 5. Example project (`example/`)

**What:** A complete, realistic sample project with all pipeline artifacts generated for one fictional product (e.g. "Dragon Fortune" — an iGaming Telegram Mini App). Stored in `example/dragon-fortune/`.

**Why:** Best onboarding tool in the repo. Answers "what does the output actually look like?" better than any documentation.

**Blocked by:** Items 3 and 4 — the example must include `/risk` and `/sprint` artifacts to be complete. Doing it earlier means rewriting it later.

**Artifacts to include:**
- `00_principles_dragon-fortune.md`
- `01_brief_dragon-fortune.md`
- `02_srs_dragon-fortune.md`
- `03_stories_dragon-fortune.md`
- `04_usecases_dragon-fortune.md`
- `05_ac_dragon-fortune.md`
- `06_nfr_dragon-fortune.md`
- `07_datadict_dragon-fortune.md`
- `07a_research_dragon-fortune.md`
- `08_apicontract_dragon-fortune.md`
- `09_wireframes_dragon-fortune.md`
- `10_scenarios_dragon-fortune.md`
- `11_handoff_dragon-fortune.md`
- `00_risks_dragon-fortune.md`
- `00_sprint_dragon-fortune.md`

**Effort:** High (each artifact needs to be realistic and cross-referenced).
**Linked README section:** `## 🗂️ What the Output Looks Like` — replace collapsed stubs with links to real files.

---

### 6. `README.ru.md` — Russian translation

**What:** Full Russian translation of `README.md`. Maintained in parallel.

**Why:** Project was built in a Russian-speaking context. Lowers the barrier for Russian-speaking BA/PM audience.

**Blocked by:** Item 5 — wait for the example project and new skills to stabilise the EN README before translating.

**Approach:**
- Direct translation of all sections.
- Keep code blocks, command names, and file paths in English.
- Add a language switcher badge at the top of both READMEs: `🇺🇸 English | 🇷🇺 Russian`.
- **Sync rule:** EN is the source of truth — update `README.md` first, then `README.ru.md`. Never update only the Russian version.

**Effort:** Medium (~900 lines).

---

## Medium priority

Independent of High priority items — can be done in parallel or between tasks.

### 7. npm package — `npx ba-toolkit`

**What:** Publish BA Toolkit as an npm package so users can install and initialise it without cloning the repository.

**Target commands:**

```bash
# One-time project setup (no install required)
npx ba-toolkit init

# Copy skills into the correct directory for a specific agent
npx ba-toolkit install --for claude-code
npx ba-toolkit install --for claude-code --global
npx ba-toolkit install --for codex
npx ba-toolkit install --for gemini
npx ba-toolkit install --for cursor   # converts to .mdc format

# Global install for repeated use
npm install -g ba-toolkit
ba-toolkit init
ba-toolkit install --for claude-code
```

**Why:** Current installation requires `git clone` + manual directory copy — two friction points before the user can run `/brief`. `npx ba-toolkit init` reduces that to one command with zero prerequisites beyond Node.js, which most developers already have.

**Package structure:**
- `bin/ba-toolkit.js` — CLI entry point (Node.js, no framework needed)
- `skills/` — bundled as-is inside the package
- `init.ps1` / `init.sh` — kept for users who prefer shell scripts
- `package.json` — `bin` field pointing to CLI, `files` field including only `bin/` and `skills/`

**CLI behaviour:**
- `init` — interactive: asks for slug, name, domain; creates `output/{slug}/` and `AGENTS.md`
- `install --for <agent>` — copies `skills/` to the correct path for the chosen agent; `--global` flag for user-wide install; `--project` (default) for project-level
- `install --for cursor` — additionally converts each `SKILL.md` to `.mdc` format with required YAML frontmatter
- `--dry-run` flag — shows what would be copied without writing files
- `--version` — prints current toolkit version from `package.json`

**Versioning:** npm version mirrors the toolkit's SemVer tag (e.g. `v1.1.0` → `npm publish` with version `1.1.0`). GitHub release workflow (item 2) should trigger `npm publish` automatically on new tags.

**Effort:** Medium (CLI logic is ~150 lines of Node.js; main work is testing cross-platform path handling and the Cursor `.mdc` conversion).

**Dependencies:** zero runtime dependencies — only Node.js built-ins (`fs`, `path`, `readline`, `child_process`).

---

### 8. More domain references

**Candidates (in order of demand):**
- `edtech.md` — online courses, LMS, adaptive learning, assessment tools.
- `hrtech.md` — ATS, HRIS, performance management, employee portals.
- `govtech.md` — citizen portals, e-government services, public procurement.
- `gaming.md` — video games (not iGaming): game backend, leaderboards, matchmaking, in-game economy.
- `proptech.md` — property valuation tools, construction project management (distinct from real-estate portal).
- `cybersecurity.md` — security products: SIEM, vulnerability management, identity platforms.

**Effort per domain:** Low (~180 lines each, following existing template). Can be done incrementally — one domain between larger tasks.

---

## Low priority / Deferred

### 9. MCP server

**What:** A Model Context Protocol server that exposes BA Toolkit skills as native MCP tools, allowing Claude Desktop (without an IDE) to use the toolkit via `mcp_ba_brief`, `mcp_ba_srs`, etc.

**Why deferred:** MCP adds a separate Node.js/Python project (~500 lines of code) that needs installation, running, and maintenance. Current users (Claude Code, Cursor, Windsurf) already have native file access — MCP would only add value for Claude Desktop users and CI/automation scenarios.

**Revisit when:** The Claude Desktop user base grows significantly, or when a CI/automation use case becomes concrete.

**Effort:** High.

---

### 10. Notion / Confluence export format

**What:** Add `notion` and `confluence` as export targets in `/export`. Notion uses a block-based JSON API; Confluence uses Atlassian's storage format (XHTML-based).

**Why deferred:** Both require platform-specific API knowledge and auth setup. Lower demand than Jira/GitHub/Linear.

**Effort:** Medium.

---

### 11. Video walkthrough / GIF demo

**What:** A short screen recording (2–3 min) showing the full pipeline from `/brief` to `/handoff` for the Dragon Fortune example project. Linked from the README hero section.

**Why deferred:** Requires a finished example project (item 5) first.

**Effort:** Medium (after item 5 is done).

---

## Ideas parking lot

Items noted for future consideration but not yet assessed:

- **`/changelog`** — track changes between artifact versions: diff `v1` vs `v2` of an artifact and generate a human-readable delta.
- **OpenAI Assistants API config** — `assistant.json` config files for each skill, enabling use via the Assistants API without file installation.
- **Linter config** — `ba-toolkit.config.json` to customise validation rules (e.g. required NFR categories per domain, minimum AC scenarios per story). Becomes meaningful once the user base is large enough to have divergent conventions.
