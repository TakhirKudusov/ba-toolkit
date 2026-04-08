<div align="center">

# 📋 BA Toolkit

<strong>AI-powered Business Analyst pipeline</strong><br>
From project brief to development handoff — 21 skills, fully structured pipeline

<img src="https://img.shields.io/badge/skills-21-blue" alt="Skills">
<img src="https://img.shields.io/badge/domains-9-green" alt="Domains">
<img src="https://img.shields.io/badge/format-Markdown-orange" alt="Format">
<img src="https://img.shields.io/badge/language-auto--detect-purple" alt="Language">
<img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License">

<img src="https://img.shields.io/badge/Claude_Code-✓-6C5CE7" alt="Claude Code">
<img src="https://img.shields.io/badge/Codex_CLI-✓-00D26A" alt="Codex CLI">
<img src="https://img.shields.io/badge/Gemini_CLI-✓-4285F4" alt="Gemini CLI">
<img src="https://img.shields.io/badge/Cursor-convert-F5A623" alt="Cursor">
<img src="https://img.shields.io/badge/Windsurf-convert-1ABCFE" alt="Windsurf">

</div>

---

## 🎯 What is this?

BA Toolkit is a set of **21 interconnected skills** that turn your AI coding agent into a business analyst. You walk through a structured pipeline — from a high-level project brief to a development handoff package — and get a complete requirements artifact set ready for engineering.

Each skill **reads the output of previous steps**, maintains cross-references between artifacts (FR → US → UC → AC → NFR → Entities → ADR → API → Screens → Scenarios), and adapts to your project's domain.

**Artifacts are generated in the language you write in.** Ask in English — get English docs. Ask in any other language — the output follows.

### Who is this for?

- **Developers** building a product without a dedicated BA — get structured requirements before writing code.
- **Product managers** who need formal documentation (SRS, AC, NFR) but want to produce it faster.
- **Business analysts** using AI to accelerate artifact creation and reduce manual cross-referencing.
- **Startup founders** turning an idea into a spec ready for a development team or investor presentation.

### Why not just prompt ChatGPT / Claude directly?

| | Ad-hoc prompting | BA Toolkit |
|--|-----------------|-----------|
| Structure | One-shot; no memory across messages | 11 interconnected artifacts, each reads all previous ones |
| Coverage | Easy to miss NFR, edge cases, data model | Structured interview + checklists prevent gaps |
| Traceability | None | FR → US → AC → API → WF chain with `/trace` |
| Quality checks | Ad-hoc | `/clarify` and `/analyze` with CRITICAL/HIGH severity ratings |
| Domain knowledge | Generic | Built-in references for 9 domains (iGaming, Fintech, SaaS, E-commerce, Healthcare, Logistics, On-demand, Social/Media, Real Estate) |
| Handoff | Chat text | Up to 11 Markdown files ready for Jira, Spec Kit, or dev team |

---

## 📦 Install

```bash
# One-shot project setup — zero install, just run:
npx @kudusov.takhir/ba-toolkit init
npx @kudusov.takhir/ba-toolkit install --for claude-code

# Or install globally and reuse across projects:
npm install -g @kudusov.takhir/ba-toolkit
ba-toolkit install --for claude-code --global
```

Supported agents: `claude-code`, `codex`, `gemini`, `cursor`, `windsurf`. Cursor and Windsurf installs auto-convert `SKILL.md` into the `.mdc` rule format. Use `--dry-run` to preview without writing.

`ba-toolkit --help` shows the full CLI reference. Zero runtime dependencies — only Node.js ≥ 18.

<details>
<summary><strong>Manual install (clone + copy)</strong></summary>

Use these if you can't use npm or want to track a specific git commit.

### Claude Code CLI

```bash
git clone https://github.com/TakhirKudusov/ba-toolkit.git
cp -r ba-toolkit/skills/ /path/to/project/.claude/skills/ba-toolkit/

# Or install globally:
cp -r ba-toolkit/skills/ ~/.claude/skills/ba-toolkit/
```

Keep the full tree: skill folders (`brief/`, `srs/`, …) must stay together with `references/` in the same parent directory.

### OpenAI Codex CLI

Skills load from `$CODEX_HOME/skills` (default `~/.codex/skills`):

```bash
cp -r ba-toolkit/skills/ ~/.codex/skills/ba-toolkit/
```

If you use a custom Codex home, set `CODEX_HOME` and copy under `$CODEX_HOME/skills/ba-toolkit/`.

### Google Gemini CLI

```bash
# User-wide (all projects)
cp -r ba-toolkit/skills/ ~/.gemini/skills/ba-toolkit/

# Or project-only
cp -r ba-toolkit/skills/ /path/to/project/.gemini/skills/ba-toolkit/
```

Reload the CLI after copying.

### Cursor, Windsurf, Aider

These use their own rules format instead of `SKILL.md`. Convert first, then copy:

```bash
# Option 1: community converter
# https://github.com/alirezarezvani/claude-skills/blob/main/scripts/convert.sh
./convert.sh --tool cursor --target /path/to/project
./convert.sh --tool windsurf --target /path/to/project

# Option 2: ask your AI agent
# "Convert all SKILL.md files in skills/ to Cursor .mdc rule format"
```

**Cursor rules live in [`.cursor/rules/`](https://cursor.com/docs/rules)** as `.mdc` files with YAML frontmatter (`description`, optional `globs`, `alwaysApply`). A plain rename of `SKILL.md` to `.mdc` is not enough — the metadata block is required. [Cursor CLI](https://cursor.com/docs/cli/using) reads the same `.cursor/rules` setup and may also pick up `AGENTS.md` / `CLAUDE.md` at repo root.

### Starting a new project (shell scripts)

```bash
# macOS / Linux
bash init.sh

# Windows PowerShell
.\init.ps1
```

The script asks for a project slug, name, and domain, then creates `output/{slug}/` and an `AGENTS.md` with the pipeline status table. Equivalent to `npx @kudusov.takhir/ba-toolkit init`.

### Updating a manual install

```bash
cd ba-toolkit
git pull
cp -r skills/ /path/to/install/location/
```

Your generated artifacts (`01_brief_*.md`, `02_srs_*.md`, …) are untouched by updates.

</details>

---

## 🗂️ What the output looks like

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

> The example demonstrates full traceability: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario, plus risk register and sprint plan.

---

## 🔗 Pipeline

| # | Command | What it generates | Output file |
|:---:|---------|-------------------|-------------|
| 0 | `/principles` | 📐 Project Principles — language, ID conventions, DoR, traceability rules, NFR baseline | `00_principles_{slug}.md` |
| 1 | `/brief` | 📄 Project Brief — goals, audience, stakeholders, risks | `01_brief_{slug}.md` |
| 2 | `/srs` | 📑 Requirements Specification (IEEE 830) | `02_srs_{slug}.md` |
| 3 | `/stories` | 📝 User Stories grouped by Epics | `03_stories_{slug}.md` |
| 4 | `/usecases` | 🔄 Use Cases with main/alt/exception flows | `04_usecases_{slug}.md` |
| 5 | `/ac` | ✅ Acceptance Criteria (Given/When/Then) | `05_ac_{slug}.md` |
| 6 | `/nfr` | ⚡ Non-functional Requirements with metrics | `06_nfr_{slug}.md` |
| 7 | `/datadict` | 🗃️ Data Dictionary — entities, types, constraints | `07_datadict_{slug}.md` |
| 7a | `/research` | 🔬 Technology Research — ADRs, integration map, data storage decisions | `07a_research_{slug}.md` |
| 8 | `/apicontract` | 🔌 API Contract — endpoints, schemas, errors | `08_apicontract_{slug}.md` |
| 9 | `/wireframes` | 🖼️ Textual Wireframe Descriptions | `09_wireframes_{slug}.md` |
| 10 | `/scenarios` | 🧪 End-to-end Validation Scenarios — user journeys linking US, AC, WF, API | `10_scenarios_{slug}.md` |
| 11 | `/handoff` | 📦 Development Handoff Package — artifact inventory, MVP scope, open items | `11_handoff_{slug}.md` |
| — | `/trace` | 🔍 Traceability Matrix + coverage gaps | `00_trace_{slug}.md` |
| — | `/clarify [focus]` | 🔎 Targeted ambiguity resolution for any artifact | _(updates existing artifact)_ |
| — | `/analyze` | 📊 Cross-artifact quality report with severity table | `00_analyze_{slug}.md` |
| — | `/estimate` | 📏 Effort estimation — Fibonacci SP, T-shirt sizes, or person-days | `00_estimate_{slug}.md` |
| — | `/glossary` | 📖 Unified project glossary with terminology drift detection | `00_glossary_{slug}.md` |
| — | `/export [format]` | 📤 Export User Stories to Jira / GitHub Issues / Linear / CSV | `export_{slug}_{format}.json` / `.csv` |
| — | `/risk` | ⚠️ Risk register — probability × impact matrix, mitigation per risk | `00_risks_{slug}.md` |
| — | `/sprint` | 🗓️ Sprint plan — stories grouped by velocity and capacity with sprint goals | `00_sprint_{slug}.md` |

> 💡 The project **slug** (e.g., `dragon-fortune`) is set at `/brief` and reused across all files automatically.

---

## 🤖 Platform Compatibility

BA Toolkit uses the open **Agent Skills specification** (SKILL.md format) published by Anthropic in December 2025 and adopted across multiple platforms.

| Platform | Support | Installation |
|----------|:-------:|-------------|
| **Claude Code** | ✅ Native | `cp -r skills/ .claude/skills/ba-toolkit/` |
| **OpenAI Codex CLI** | ✅ Native | `cp -r skills/ ~/.codex/skills/ba-toolkit/` |
| **Gemini CLI** | ✅ Native | Copy the `skills/` tree to `~/.gemini/skills/ba-toolkit/` (user) or `.gemini/skills/ba-toolkit/` (workspace) |
| **Cursor** | 🔄 Convert | `SKILL.md` → `.mdc` rules in `.cursor/rules/` |
| **Windsurf** | 🔄 Convert | `SKILL.md` → rules in `.windsurf/rules/` |
| **Aider** | 🔄 Convert | `SKILL.md` → conventions file |

> 💡 Platforms marked **Native** read `SKILL.md` as-is. Platforms marked **Convert** require a one-time format conversion — the content is the same, only the file format differs. The `ba-toolkit install --for cursor|windsurf` CLI does this automatically.

### Environment detection

Skills do not hardcode platform-specific paths. Instead, they reference `skills/references/environment.md` which contains the output directory logic for each platform. By default, artifacts are saved to the current working directory. Edit that file to customize — all skills pick up the change automatically.

---

## 🌍 Domain Support

The pipeline is **domain-agnostic** by default. At the `/brief` stage, you pick a domain — and every subsequent skill loads domain-specific interview questions, mandatory entities, NFR categories, and glossary terms.

| Domain | Industries covered |
|--------|-------------------|
| 🎰 **iGaming** | Online slots, sports betting, casino lobbies, Telegram Mini Apps, promo mechanics |
| 🏦 **Fintech** | Neobanks, payment systems, crypto exchanges, investment platforms, P2P lending |
| ☁️ **SaaS** | B2B platforms, CRM, analytics, marketplaces, EdTech, HRTech |
| 🛒 **E-commerce** | B2C stores, B2B catalogs, multi-vendor marketplaces, D2C brands, digital goods |
| 🏥 **Healthcare** | Telemedicine, patient portals, EHR/EMR, clinic management, mental health apps |
| 🚚 **Logistics** | Last-mile delivery, courier management, freight tracking, WMS, fleet management |
| 🔧 **On-demand** | Ride-hailing, home services, task marketplaces, beauty, tutoring, pet care |
| 📱 **Social / Media** | Social networks, creator platforms, community forums, newsletters, short-video |
| 🏠 **Real Estate** | Property portals, agency CRM, rental management, property management, mortgage tools |
| ✏️ **Custom** | Any other domain — works with general interview questions |

> ➕ Adding a new domain = creating one Markdown file in `skills/references/domains/`. See [docs/DOMAINS.md](docs/DOMAINS.md).

---

## 🔄 How it works

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

## ⚡ Minimum Viable Pipeline

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

## 📖 Usage Guide

Full walkthrough of the pipeline in day-to-day use — starting a project, moving between steps, `/clarify`, `/analyze`, `/trace`, `/split`, working with multiple projects, and `AGENTS.md` — lives in [docs/USAGE.md](docs/USAGE.md).

For common issues and fixes, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## ❓ FAQ

Answers to common questions — language support, offline use, custom domains, editing past artifacts, model size, updates — are in [docs/FAQ.md](docs/FAQ.md).

---

## 🤝 Contributing

New domains and skill improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the PR workflow, and [docs/DOMAINS.md](docs/DOMAINS.md) for the domain file template.

---

## 📄 License

MIT — use freely, modify, distribute. See [LICENSE](LICENSE) for the full text.
