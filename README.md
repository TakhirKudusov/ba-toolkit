<div align="center">

# 📋 BA Toolkit

Structured BA pipeline for AI coding agents — brief to handoff, 21 skills, 9 domains.

<img src="https://img.shields.io/badge/skills-21-blue" alt="Skills">
<img src="https://img.shields.io/badge/domains-9-green" alt="Domains">
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

BA Toolkit is a set of 21 interconnected skills that run a full business-analysis pipeline inside your AI coding agent. You go from a rough project brief to a development handoff package, and each skill reads the output of the previous ones — maintaining cross-references between artifacts along the chain `FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario`.

Unlike one-shot prompting, every artifact is written to disk as Markdown, every ID links back to its source, and `/trace` verifies coverage across the whole pipeline. `/clarify` and `/analyze` catch ambiguities and quality gaps with CRITICAL/HIGH severity ratings. Domain references for 9 industries (SaaS, Fintech, E-commerce, Healthcare, Logistics, On-demand, Social/Media, Real Estate, iGaming) plug in automatically at `/brief`.

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

`ba-toolkit --help` shows the full CLI reference. Zero runtime dependencies — only Node.js ≥ 18.

<details>
<summary><strong>Manual install (clone + copy)</strong></summary>

Use these if you can't use npm or want to track a specific git commit.

**Important — v2.0 layout:** the skills go directly under the agent's skills root, not nested under a `ba-toolkit/` wrapper folder. Versions before v2.0 used a wrapper, which made every skill invisible to the agent. If you're upgrading from v1.x, remove the legacy wrapper folder first.

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

Cursor has two separate features — Rules (`.cursor/rules/*.mdc`) and [Agent Skills](https://cursor.com/docs/skills) (`.cursor/skills/<skill>/SKILL.md`). BA Toolkit is a set of skills, not rules, so `ba-toolkit install --for cursor` drops the 21 skills directly into `.cursor/skills/` using the native folder-per-skill `SKILL.md` format — no conversion needed. Reload the Cursor window to pick them up.

### Windsurf

Windsurf's [Agent Skills](https://docs.windsurf.com/windsurf/cascade/skills) feature loads skills from `.windsurf/skills/<skill>/SKILL.md`, the same folder-per-skill layout as Claude Code and Cursor. `ba-toolkit install --for windsurf` writes the 21 skills there natively. Reload the Windsurf window to pick them up.

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

A complete example project — **Dragon Fortune** (iGaming Telegram Mini App) — lives in [`example/dragon-fortune/`](example/dragon-fortune/). All 15 artifacts are realistic, cross-referenced, and generated by running the full BA Toolkit pipeline.

| Artifact | File |
|---------|------|
| Project Principles | [`00_principles_dragon-fortune.md`](example/dragon-fortune/00_principles_dragon-fortune.md) |
| Project Brief | [`01_brief_dragon-fortune.md`](example/dragon-fortune/01_brief_dragon-fortune.md) |
| Requirements (SRS) | [`02_srs_dragon-fortune.md`](example/dragon-fortune/02_srs_dragon-fortune.md) |
| User Stories | [`03_stories_dragon-fortune.md`](example/dragon-fortune/03_stories_dragon-fortune.md) |
| Use Cases | [`04_usecases_dragon-fortune.md`](example/dragon-fortune/04_usecases_dragon-fortune.md) |
| Acceptance Criteria | [`05_ac_dragon-fortune.md`](example/dragon-fortune/05_ac_dragon-fortune.md) |
| Non-functional Requirements | [`06_nfr_dragon-fortune.md`](example/dragon-fortune/06_nfr_dragon-fortune.md) |
| Data Dictionary | [`07_datadict_dragon-fortune.md`](example/dragon-fortune/07_datadict_dragon-fortune.md) |
| Technology Research | [`07a_research_dragon-fortune.md`](example/dragon-fortune/07a_research_dragon-fortune.md) |
| API Contract | [`08_apicontract_dragon-fortune.md`](example/dragon-fortune/08_apicontract_dragon-fortune.md) |
| Wireframes | [`09_wireframes_dragon-fortune.md`](example/dragon-fortune/09_wireframes_dragon-fortune.md) |
| Validation Scenarios | [`10_scenarios_dragon-fortune.md`](example/dragon-fortune/10_scenarios_dragon-fortune.md) |
| Development Handoff | [`11_handoff_dragon-fortune.md`](example/dragon-fortune/11_handoff_dragon-fortune.md) |
| Risk Register | [`00_risks_dragon-fortune.md`](example/dragon-fortune/00_risks_dragon-fortune.md) |
| Sprint Plan | [`00_sprint_dragon-fortune.md`](example/dragon-fortune/00_sprint_dragon-fortune.md) |

Full traceability: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario, plus risk register and sprint plan.

---

## Pipeline

| # | Command | What it generates | Output file |
|:---:|---------|-------------------|-------------|
| 0 | `/principles` | Project Principles — language, ID conventions, DoR, traceability rules, NFR baseline | `00_principles_{slug}.md` |
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
| — | `/risk` | Risk register — probability × impact matrix, mitigation per risk | `00_risks_{slug}.md` |
| — | `/sprint` | Sprint plan — stories grouped by velocity and capacity with sprint goals | `00_sprint_{slug}.md` |

The project **slug** (e.g., `nova-analytics`) is set at `/brief` and reused across all files automatically.

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

The pipeline is domain-agnostic by default. At `/brief`, you pick a domain, and every subsequent skill loads domain-specific interview questions, mandatory entities, NFR categories, and glossary terms.

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

Not every project needs all 21 skills. Two common paths:

**Lean** (fastest path to handoff — 9 steps):
```
/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff
```

**Full** (complete traceability and quality gates — 15 steps):
```
/principles → /brief → /srs → /stories → /usecases → /ac → /nfr → /datadict
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
