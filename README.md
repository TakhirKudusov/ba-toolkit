<div align="center">

# 📋 BA Toolkit

Structured BA pipeline for AI coding agents — concept to handoff, 23 skills, 12 domains, one-command Notion + Confluence publish.

<img src="https://img.shields.io/badge/skills-23-blue" alt="Skills">
<img src="https://img.shields.io/badge/domains-12-green" alt="Domains">
<img src="https://img.shields.io/badge/format-Markdown-orange" alt="Format">
<img src="https://img.shields.io/badge/language-auto--detect-purple" alt="Language">
<img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License">

<img src="https://img.shields.io/badge/Claude_Code-✓-6C5CE7" alt="Claude Code">
<img src="https://img.shields.io/badge/Codex_CLI-✓-00D26A" alt="Codex CLI">
<img src="https://img.shields.io/badge/Gemini_CLI-✓-4285F4" alt="Gemini CLI">
<img src="https://img.shields.io/badge/Cursor-✓-F5A623" alt="Cursor">
<img src="https://img.shields.io/badge/Windsurf-✓-1ABCFE" alt="Windsurf">

</div>

---

## What is this

BA Toolkit is a set of 23 interconnected skills that run a full business-analysis pipeline inside your AI coding agent. You can start as early as `/discovery` (a brain-storm step for users who don't yet know what to build) or jump straight to `/brief` if you already have a project in mind, then work all the way through to a development handoff package. Each skill reads the output of the previous ones — maintaining cross-references between artifacts along the chain `FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario`. When you're ready to share with non-developer stakeholders, `/publish` (or `ba-toolkit publish`) bundles every artifact into import-ready folders for Notion and Confluence — drag-and-drop, no API tokens.

Unlike one-shot prompting, every artifact is written to disk as Markdown, every ID links back to its source, and `/trace` verifies coverage across the whole pipeline. `/clarify` and `/analyze` catch ambiguities and quality gaps with CRITICAL/HIGH severity ratings. Domain references for 12 industries (SaaS, Fintech, E-commerce, Healthcare, Logistics, On-demand, Social/Media, Real Estate, iGaming, EdTech, GovTech, AI/ML) plug in automatically at `/brief`.

Artifacts are generated in whatever language you write in — ask in English, get English docs; ask in any other language, the output follows.

---

## Install

```bash
# Full setup in one command — prompts for project name, domain, and
# AI agent, then creates output/{slug}/, AGENTS.md, and installs the
# skills into the chosen agent's directory.
npx @kudusov.takhir/ba-toolkit init

# Non-interactive (e.g. for CI): pass every choice on the command line.
npx @kudusov.takhir/ba-toolkit init --name "My App" --domain saas --for claude-code

# Or install globally and reuse across projects:
npm install -g @kudusov.takhir/ba-toolkit
ba-toolkit init
```

Supported agents: `claude-code`, `codex`, `gemini`, `cursor`, `windsurf`. All five use the native Agent Skills format (folder-per-skill with `SKILL.md`) — Claude Code at `.claude/skills/`, Codex at `~/.codex/skills/`, Gemini at `.gemini/skills/`, Cursor at `.cursor/skills/`, Windsurf at `.windsurf/skills/`. Pass `--dry-run` to preview the install step without writing files, or `--no-install` to create only the project structure and install skills later with `ba-toolkit install --for <agent>`.

**New in v3.1** — multi-project + interview UX:

- **Multi-project: each `ba-toolkit init` creates `output/<slug>/AGENTS.md`**, scoped to that project. Two agent windows in the same repo can `cd output/alpha && claude` and `cd output/beta && claude` independently — no AGENTS.md collision, no shared state.
- **Interview options as a 2-column table with letter IDs** (`a`, `b`, `c`, …) instead of a numbered list. Renders cleanly across all 5 supported agents, easier to scan, last row is always free-text "Other".
- **Inline context after slash commands**: `/brief I want to build an online store for construction materials...` is parsed as a lead-in answer; the skill skips redundant questions and jumps straight to what's missing. Works for all 12 interview-phase skills.
- **Open-ended lead-in question** for `/brief` and `/principles` when there's no inline context — `Tell me about the project in your own words` — instead of dumping a structured table on the first turn.

**New in v3.0** — `ba-toolkit init` UX improvements:

- **Arrow-key menu navigation** for the domain and agent prompts in real terminals (`↑/↓` or `j/k` to move, `a-z` to jump, `Enter` to select, `Esc`/`Ctrl+C` to cancel). CI / piped input automatically falls back to a numbered prompt.
- **Re-prompt on invalid input** instead of crashing on the first typo. Three attempts before aborting, so a piped input can't infinite-loop.
- **`AGENTS.md` is merged on re-init**, not overwritten. Pipeline Status edits, Key Constraints, Open Questions, and any user notes outside the managed block are preserved byte-for-byte. See [docs/USAGE.md §8](docs/USAGE.md#8-agentsmd--persistent-project-context).
- **Native Cursor and Windsurf skills** at `.cursor/skills/` and `.windsurf/skills/` — finally registered as actual Agent Skills instead of `.mdc` rules. v2.x users: see the v3.0 migration recipe in [CHANGELOG.md](CHANGELOG.md).

`ba-toolkit --help` shows the full CLI reference. Zero runtime dependencies — only Node.js ≥ 18.

<details>
<summary><strong>Manual install (clone + copy)</strong></summary>

Use these if you can't use npm or want to track a specific git commit.

**Current install layout (v3.0+):** all five supported agents use the native Agent Skills format — the BA Toolkit skills go directly under each agent's skills root (`.claude/skills/`, `~/.codex/skills/`, `.gemini/skills/`, `.cursor/skills/`, `.windsurf/skills/`), one folder per skill, each containing its own `SKILL.md`. No `.mdc` conversion, no `ba-toolkit/` wrapper. Versions before v2.0 nested everything under a `ba-toolkit/` wrapper folder which made the skills invisible to the agent — remove that wrapper if you're upgrading from v1.x. Versions v2.0–v2.x installed Cursor and Windsurf as `.mdc` rules under `.cursor/rules/` and `.windsurf/rules/`, which were the wrong feature entirely (Cursor and Windsurf loaded them as Rules, never as Skills) — see the v3.0 entry in [CHANGELOG.md](CHANGELOG.md) for the migration steps if you're upgrading from v2.x.

### Claude Code CLI

```bash
git clone https://github.com/TakhirKudusov/ba-toolkit.git

# Project-level: copy the contents of skills/ into .claude/skills/
mkdir -p /path/to/project/.claude/skills
cp -R ba-toolkit/skills/. /path/to/project/.claude/skills/

# Or globally:
mkdir -p ~/.claude/skills
cp -R ba-toolkit/skills/. ~/.claude/skills/
```

Each skill folder (`brief/`, `srs/`, …) lands as a direct child of `.claude/skills/`, and the `references/` folder sits next to them. If you have other skills installed in the same directory, they're left alone.

### OpenAI Codex CLI

Skills load from `$CODEX_HOME/skills` (default `~/.codex/skills`):

```bash
mkdir -p ~/.codex/skills
cp -R ba-toolkit/skills/. ~/.codex/skills/
```

If you use a custom Codex home, set `CODEX_HOME` and copy under `$CODEX_HOME/skills/`.

### Google Gemini CLI

```bash
# User-wide (all projects)
mkdir -p ~/.gemini/skills
cp -R ba-toolkit/skills/. ~/.gemini/skills/

# Or project-only
mkdir -p /path/to/project/.gemini/skills
cp -R ba-toolkit/skills/. /path/to/project/.gemini/skills/
```

Reload the CLI after copying.

### Cursor

Cursor has two separate features — Rules (`.cursor/rules/*.mdc`) and [Agent Skills](https://cursor.com/docs/skills) (`.cursor/skills/<skill>/SKILL.md`). BA Toolkit is a set of skills, not rules, so `ba-toolkit install --for cursor` drops the 23 skills directly into `.cursor/skills/` using the native folder-per-skill `SKILL.md` format — no conversion needed. Reload the Cursor window to pick them up.

### Windsurf

Windsurf's [Agent Skills](https://docs.windsurf.com/windsurf/cascade/skills) feature loads skills from `.windsurf/skills/<skill>/SKILL.md`, the same folder-per-skill layout as Claude Code and Cursor. `ba-toolkit install --for windsurf` writes the 23 skills there natively. Reload the Windsurf window to pick them up.

### Aider

Aider has no native skills feature. Convert manually with the community script at <https://github.com/alirezarezvani/claude-skills/blob/main/scripts/convert.sh> or ask your AI agent to convert `SKILL.md` files to the target format.

### Starting a new project (shell scripts)

```bash
# macOS / Linux
bash init.sh

# Windows PowerShell
.\init.ps1
```

Equivalent to `npx @kudusov.takhir/ba-toolkit init` — asks for a slug, name, and domain, then creates `output/{slug}/` and an `AGENTS.md` with the pipeline status table.

### Updating a manual install

```bash
cd ba-toolkit
git pull
cp -r skills/ /path/to/install/location/
```

Your generated artifacts (`01_brief_*.md`, `02_srs_*.md`, …) are untouched by updates.

</details>

---

## Example output

A complete example project — **Lumen Goods** (sustainable home-goods D2C online store) — lives in [`example/lumen-goods/`](example/lumen-goods/). All 16 artifacts are realistic, cross-referenced, and generated by running the full BA Toolkit pipeline.

| Artifact | File |
|---------|------|
| Concept Discovery | [`00_discovery_lumen-goods.md`](example/lumen-goods/00_discovery_lumen-goods.md) |
| Project Principles | [`00_principles_lumen-goods.md`](example/lumen-goods/00_principles_lumen-goods.md) |
| Project Brief | [`01_brief_lumen-goods.md`](example/lumen-goods/01_brief_lumen-goods.md) |
| Requirements (SRS) | [`02_srs_lumen-goods.md`](example/lumen-goods/02_srs_lumen-goods.md) |
| User Stories | [`03_stories_lumen-goods.md`](example/lumen-goods/03_stories_lumen-goods.md) |
| Use Cases | [`04_usecases_lumen-goods.md`](example/lumen-goods/04_usecases_lumen-goods.md) |
| Acceptance Criteria | [`05_ac_lumen-goods.md`](example/lumen-goods/05_ac_lumen-goods.md) |
| Non-functional Requirements | [`06_nfr_lumen-goods.md`](example/lumen-goods/06_nfr_lumen-goods.md) |
| Data Dictionary | [`07_datadict_lumen-goods.md`](example/lumen-goods/07_datadict_lumen-goods.md) |
| Technology Research | [`07a_research_lumen-goods.md`](example/lumen-goods/07a_research_lumen-goods.md) |
| API Contract | [`08_apicontract_lumen-goods.md`](example/lumen-goods/08_apicontract_lumen-goods.md) |
| Wireframes | [`09_wireframes_lumen-goods.md`](example/lumen-goods/09_wireframes_lumen-goods.md) |
| Validation Scenarios | [`10_scenarios_lumen-goods.md`](example/lumen-goods/10_scenarios_lumen-goods.md) |
| Development Handoff | [`11_handoff_lumen-goods.md`](example/lumen-goods/11_handoff_lumen-goods.md) |
| Risk Register | [`00_risks_lumen-goods.md`](example/lumen-goods/00_risks_lumen-goods.md) |
| Sprint Plan | [`00_sprint_lumen-goods.md`](example/lumen-goods/00_sprint_lumen-goods.md) |

Full traceability: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario, plus risk register and sprint plan.

---

## Pipeline

| # | Command | What it generates | Output file |
|:---:|---------|-------------------|-------------|
| 0 | `/discovery` | Concept Discovery — problem space, audience hypotheses, candidate domains, MVP feature ideas, validation questions | `00_discovery_{slug}.md` |
| 0a | `/principles` | Project Principles — language, ID conventions, DoR, traceability rules, NFR baseline | `00_principles_{slug}.md` |
| 1 | `/brief` | Project Brief — goals, audience, stakeholders, risks | `01_brief_{slug}.md` |
| 2 | `/srs` | Requirements Specification (IEEE 830) | `02_srs_{slug}.md` |
| 3 | `/stories` | User Stories grouped by Epics | `03_stories_{slug}.md` |
| 4 | `/usecases` | Use Cases with main/alt/exception flows | `04_usecases_{slug}.md` |
| 5 | `/ac` | Acceptance Criteria (Given/When/Then) | `05_ac_{slug}.md` |
| 6 | `/nfr` | Non-functional Requirements with metrics | `06_nfr_{slug}.md` |
| 7 | `/datadict` | Data Dictionary — entities, types, constraints | `07_datadict_{slug}.md` |
| 7a | `/research` | Technology Research — ADRs, integration map, storage decisions | `07a_research_{slug}.md` |
| 8 | `/apicontract` | API Contract — endpoints, schemas, errors | `08_apicontract_{slug}.md` |
| 9 | `/wireframes` | Textual Wireframe Descriptions | `09_wireframes_{slug}.md` |
| 10 | `/scenarios` | End-to-end Validation Scenarios — user journeys linking US, AC, WF, API | `10_scenarios_{slug}.md` |
| 11 | `/handoff` | Development Handoff Package — artifact inventory, MVP scope, open items | `11_handoff_{slug}.md` |
| — | `/trace` | Traceability Matrix + coverage gaps | `00_trace_{slug}.md` |
| — | `/clarify [focus]` | Targeted ambiguity resolution for any artifact | _(updates existing artifact)_ |
| — | `/analyze` | Cross-artifact quality report with severity table | `00_analyze_{slug}.md` |
| — | `/estimate` | Effort estimation — Fibonacci SP, T-shirt sizes, or person-days | `00_estimate_{slug}.md` |
| — | `/glossary` | Unified project glossary with terminology drift detection | `00_glossary_{slug}.md` |
| — | `/export [format]` | Export User Stories to Jira / GitHub Issues / Linear / CSV | `export_{slug}_{format}.json` / `.csv` |
| — | `/publish [format]` | Bundle artifacts for Notion (Markdown) and Confluence (HTML) — drag-and-drop import, no API tokens | `publish/notion/`, `publish/confluence/` |
| — | `/risk` | Risk register — probability × impact matrix, mitigation per risk | `00_risks_{slug}.md` |
| — | `/sprint` | Sprint plan — stories grouped by velocity and capacity with sprint goals | `00_sprint_{slug}.md` |

The project **slug** (e.g., `nova-analytics`) is set at `ba-toolkit init` (derived from the project name) and reused across all files automatically — every skill reads it from `AGENTS.md`.

---

## Platform compatibility

BA Toolkit uses the open Agent Skills specification (`SKILL.md` format) published by Anthropic in December 2025 and adopted across multiple platforms.

| Platform | Support | Installation |
|----------|:-------:|-------------|
| **Claude Code** | Native | `cp -R skills/. .claude/skills/` |
| **OpenAI Codex CLI** | Native | `cp -R skills/. ~/.codex/skills/` |
| **Gemini CLI** | Native | Copy `skills/.` contents to `~/.gemini/skills/` (user) or `.gemini/skills/` (workspace) |
| **Cursor** | Native | Copy `skills/.` contents to `.cursor/skills/` |
| **Windsurf** | Native | Copy `skills/.` contents to `.windsurf/skills/` |
| **Aider** | Convert | `SKILL.md` → conventions file |

All five officially supported platforms read `SKILL.md` as-is — no conversion. `ba-toolkit install --for <agent>` lands skills directly in the agent's native skills root.

Skills do not hardcode platform paths — they reference `skills/references/environment.md`, which contains the output directory logic for each platform. Edit that file to customize; all skills pick up the change automatically.

---

## Domain support

The pipeline is domain-agnostic by default. At `ba-toolkit init` you pick a domain, and every subsequent skill loads domain-specific interview questions, mandatory entities, NFR categories, and glossary terms from `skills/references/domains/{domain}.md`.

| Domain | Industries covered |
|--------|-------------------|
| **SaaS** | B2B platforms, CRM, analytics, marketplaces, EdTech, HRTech |
| **Fintech** | Neobanks, payment systems, crypto exchanges, investment platforms, P2P lending |
| **E-commerce** | B2C stores, B2B catalogs, multi-vendor marketplaces, D2C brands, digital goods |
| **Healthcare** | Telemedicine, patient portals, EHR/EMR, clinic management, mental health apps |
| **Logistics** | Last-mile delivery, courier management, freight tracking, WMS, fleet management |
| **On-demand** | Ride-hailing, home services, task marketplaces, beauty, tutoring, pet care |
| **Social / Media** | Social networks, creator platforms, community forums, newsletters, short-video |
| **Real Estate** | Property portals, agency CRM, rental management, property management, mortgage tools |
| **iGaming** | Online slots, sports betting, casino lobbies, Telegram Mini Apps, promo mechanics |
| **EdTech** | LMS, K-12, higher ed, MOOC, corporate L&D, language learning, exam prep |
| **GovTech** | Citizen e-services, permits, tax filing, benefits, public records, court e-filing |
| **AI / ML** | LLM apps, RAG pipelines, agents, model serving, fine-tuning, MLOps platforms |
| **Custom** | Any other domain — works with general interview questions |

Adding a new domain = creating one Markdown file in `skills/references/domains/`. See [docs/DOMAINS.md](docs/DOMAINS.md).

---

## How it works

Most pipeline skills follow the same cycle: **Command → Context → Interview → Generate → Refine**. Each skill loads all previous artifacts plus the domain reference and project principles, asks a few rounds of targeted questions, writes a Markdown artifact, and offers refinement subcommands before moving on. `/handoff`, `/trace`, and `/analyze` skip the interview — they extract everything from existing artifacts automatically.

Every artifact links back to its predecessors, forming the chain `FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario`. Run `/trace` to verify coverage and `/analyze` for severity-rated findings (duplicates, ambiguous terms, terminology drift, invalid references).

### Subcommands

| Command | What it does |
|---------|-------------|
| `/clarify [focus]` | Targeted ambiguity pass — surfaces vague terms, missing metrics, conflicting rules |
| `/revise [section]` | Rewrite a specific section with your feedback |
| `/expand [section]` | Add more detail to a section |
| `/split [element]` | Break a large element into smaller ones (e.g., a big user story) |
| `/validate` | Check completeness, consistency, and alignment with prior artifacts |
| `/analyze` | Cross-artifact quality report: duplicates, coverage gaps, terminology drift, invalid references |
| `/done` | Finalize the current artifact and move to the next pipeline step |

---

## Minimum viable pipeline

Not every project needs all 23 skills. Three common paths:

**Concept-first** (when you don't yet know what to build):
```
/discovery → /brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff
```

**Lean** (fastest path to handoff when you already have a project in mind — 9 steps):
```
/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff
```

**Full** (complete traceability and quality gates — 16 steps):
```
/discovery → /principles → /brief → /srs → /stories → /usecases → /ac → /nfr → /datadict
          → /research → /apicontract → /wireframes → /scenarios
          → /trace → /analyze → /handoff
```

Use `/clarify` at any step to resolve ambiguities before moving on. Approximate time per step is in [docs/USAGE.md#appendix-time-estimates](docs/USAGE.md#appendix-time-estimates).

---

## Usage guide

Full walkthrough of the pipeline in day-to-day use — starting a project, moving between steps, `/clarify`, `/analyze`, `/trace`, `/split`, working with multiple projects, and `AGENTS.md` — lives in [docs/USAGE.md](docs/USAGE.md).

For common issues and fixes, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## FAQ

Answers to common questions — language support, offline use, custom domains, editing past artifacts, model size, updates — are in [docs/FAQ.md](docs/FAQ.md).

---

## Contributing

New domains and skill improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the PR workflow, and [docs/DOMAINS.md](docs/DOMAINS.md) for the domain file template.

---

## License

MIT — use freely, modify, distribute. See [LICENSE](LICENSE) for the full text.
