# BA Toolkit — Future Improvements

Backlog of planned improvements, ordered by priority within each category.
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

### 1. Example project (`example/`)

**What:** A complete, realistic sample project with all 11 pipeline artifacts generated for one fictional product (e.g. "Dragon Fortune" — an iGaming Telegram Mini App). Stored in `example/dragon-fortune/`.

**Why:** Best onboarding tool in the repo. Answers "what does the output actually look like?" better than any documentation.

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

**Effort:** High (each artifact needs to be realistic and cross-referenced).
**Linked README section:** `## 🗂️ What the Output Looks Like` — replace collapsed stubs with links to real files.

---

### 2. `README.ru.md` — Russian translation

**What:** Full Russian translation of `README.md`. Maintained in parallel.

**Why:** Project was built in a Russian-speaking context. Lowers the barrier for Russian-speaking BA/PM audience.

**Approach:**
- Direct translation of all sections.
- Keep code blocks, command names, and file paths in English.
- Add a language switcher badge at the top of both READMEs: `🇺🇸 English | 🇷🇺 Русский`.

**Effort:** Medium (~900 lines).

---

## Medium priority

### 3. npm package — `npx ba-toolkit`

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

**Versioning:** npm version mirrors the toolkit's SemVer tag (e.g. `v1.1.0` → `npm publish` with version `1.1.0`). GitHub release workflow (todo item 4) should trigger `npm publish` automatically on new tags.

**Effort:** Medium (CLI logic is ~150 lines of Node.js; main work is testing cross-platform path handling and the Cursor `.mdc` conversion).

**Dependencies:** zero runtime dependencies — only Node.js built-ins (`fs`, `path`, `readline`, `child_process`).

### 3. More domain references

**Candidates (in order of demand):**
- `edtech.md` — online courses, LMS, adaptive learning, assessment tools.
- `hrtech.md` — ATS, HRIS, performance management, employee portals.
- `govtech.md` — citizen portals, e-government services, public procurement.
- `gaming.md` — video games (not iGaming): game backend, leaderboards, matchmaking, in-game economy.
- `proptech.md` — property valuation tools, construction project management (distinct from real-estate portal).
- `cybersecurity.md` — security products: SIEM, vulnerability management, identity platforms.

**Effort per domain:** Low (~180 lines each, following existing template).

---

### 4. GitHub release workflow

**What:** `.github/workflows/release.yml` that triggers on version tags (`v*.*.*`) and creates a GitHub Release with release notes auto-generated from `CHANGELOG.md`.

**Why:** Gives users a clear versioned release to reference when they install or update the toolkit.

**Effort:** Low.

---

### 5. `/export` template

**What:** `skills/references/templates/export-template.md` — template for the export output files, showing structure of Jira / GitHub / Linear / CSV formats.

**Why:** Completes the template coverage for all skills including `/export`.

**Effort:** Low.

---

### 6. Subcommand reference card

**What:** A single `COMMANDS.md` (or `REFERENCE.md`) quick-reference card listing all 19 skills and all subcommands (`/revise`, `/expand`, `/split`, `/clarify`, `/validate`, `/done`, `/analyze`, `/trace`, `/estimate`, `/glossary`, `/export`) with one-line descriptions and syntax.

**Why:** Users currently have to scan README to find the right command. A single-page cheat sheet is faster.

**Effort:** Low.

---

## Low priority / Deferred

### 7. MCP server

**What:** A Model Context Protocol server that exposes BA Toolkit skills as native MCP tools, allowing Claude Desktop (without an IDE) to use the toolkit via `mcp_ba_brief`, `mcp_ba_srs`, etc.

**Why deferred:** MCP adds a separate Node.js/Python project (~500 lines of code) that needs installation, running, and maintenance. Current users (Claude Code, Cursor, Windsurf) already have native file access — MCP would only add value for Claude Desktop users and CI/automation scenarios.

**Revisit when:** The Claude Desktop user base grows significantly, or when a CI/automation use case becomes concrete.

**Effort:** High.

---

### 8. Notion / Confluence export format

**What:** Add `notion` and `confluence` as export targets in `/export`. Notion uses a block-based JSON API; Confluence uses Atlassian's storage format (XHTML-based).

**Why deferred:** Both require platform-specific API knowledge and auth setup. Lower demand than Jira/GitHub/Linear.

**Effort:** Medium.

---

### 9. Video walkthrough / GIF demo

**What:** A short screen recording (2–3 min) showing the full pipeline from `/brief` to `/handoff` for the Dragon Fortune example project. Linked from the README hero section.

**Why deferred:** Requires a finished example project (item 1) first.

**Effort:** Medium (after item 1 is done).

---

---

## Ideas parking lot

Items noted for future consideration but not yet assessed:

- **`/sprint`** — generate a sprint plan from estimated stories: group by priority and team capacity, output sprint goal and story list.
- **`/risk`** — dedicated risk register artifact: extract risks from Brief, SRS, Research, and generate `00_risks_{slug}.md` with probability × impact matrix.
- **`/changelog`** — track changes between artifact versions: diff `v1` vs `v2` of an artifact and generate a human-readable delta.
- **OpenAI Assistants API config** — `assistant.json` config files for each skill, enabling use via the Assistants API without file installation.
- **Linter config** — `ba-toolkit.config.json` to customise validation rules (e.g. required NFR categories per domain, minimum AC scenarios per story).
