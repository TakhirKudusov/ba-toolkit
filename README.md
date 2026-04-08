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

## Contents

- [What is this?](#-what-is-this)
  - [Who is this for?](#who-is-this-for)
  - [Why not just prompt directly?](#why-not-just-prompt-chatgpt--claude-directly)
- [Platform Compatibility](#-platform-compatibility)
- [Pipeline](#-pipeline)
- [Domain Support](#-domain-support)
- [How Each Skill Works](#-how-each-skill-works)
- [Installation](#-installation)
  - [Option A: Claude Code](#option-a-claude-code-cli--recommended)
  - [Option B: OpenAI Codex CLI](#option-b-openai-codex-cli)
  - [Option C: Google Gemini CLI](#option-c-google-gemini-cli)
  - [Option D: Cursor, Windsurf, Aider](#option-d-cursor-windsurf-aider)
  - [Starting a new project](#starting-a-new-project)
  - [Updating BA Toolkit](#updating-ba-toolkit)
- [Repository Structure](#-repository-structure)
- [Cross-Reference System](#-cross-reference-system)
- [Minimum Viable Pipeline](#-minimum-viable-pipeline)
- [Quick Start](#-quick-start)
- [What the Output Looks Like](#️-what-the-output-looks-like)
- [Usage Guide](docs/USAGE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [FAQ](docs/FAQ.md)
- [Contributing](CONTRIBUTING.md)
- [Adding a New Domain](docs/DOMAINS.md)
- [Changelog](CHANGELOG.md)
- [License](#-license)

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

## 🤖 Platform Compatibility

BA Toolkit uses the open **Agent Skills specification** (SKILL.md format) published by Anthropic in December 2025 and adopted across multiple platforms.

| Platform | Support | Installation |
|----------|:-------:|-------------|
| **Claude Code** | ✅ Native | `cp -r skills/ .claude/skills/ba-toolkit/` |
| **OpenAI Codex CLI** | ✅ Native | `cp -r skills/ ~/.codex/skills/ba-toolkit/` |
| **Gemini CLI** | ✅ Native | Copy the entire `skills/` tree to `~/.gemini/skills/ba-toolkit/` (user) or `.gemini/skills/ba-toolkit/` (workspace) |
| **Cursor** | 🔄 Convert | SKILL.md → `.mdc` rules in `.cursor/rules/` |
| **Windsurf** | 🔄 Convert | SKILL.md → rules in `.windsurf/rules/` |
| **Aider** | 🔄 Convert | SKILL.md → conventions file |

> 💡 Platforms marked **Native** read SKILL.md as-is. Platforms marked **Convert** require a one-time format conversion — the content is the same, only the file format differs. Tools like [convert.sh](https://github.com/alirezarezvani/claude-skills/blob/main/scripts/convert.sh) can automate this.

### Environment detection

Skills do not hardcode platform-specific paths. Instead, they reference `references/environment.md` which contains the output directory logic for each platform. By default, artifacts are saved to the current working directory.

To customize for your setup, edit `skills/references/environment.md` — all skills will pick up the change automatically.

---

## 🔗 Pipeline

```
📐 /principles (optional)
        │
        ▼
📄 /brief → 📑 /srs → 📝 /stories → 🔄 /usecases → ✅ /ac → ⚡ /nfr → 🗃️ /datadict → 🔬 /research → 🔌 /apicontract → 🖼️ /wireframes → 🧪 /scenarios → 📦 /handoff
                           │
                           └──→ 🔍 /trace    (available after /stories)

🔎 /clarify [focus]  — available at any step, on any artifact
📊 /analyze          — available at any step after /srs
```

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

> ➕ **Adding a new domain** = creating one Markdown file in `skills/references/domains/`. See [docs/DOMAINS.md](docs/DOMAINS.md).

---

## 🔄 How Each Skill Works

Most pipeline skills follow this cycle:

```
┌─────────────┐      ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Command │────▶│  2. Context │────▶│3. Interview │────▶│ 4. Generate │
│   /brief    │      │  Load prior │     │  3-7 Q's per│     │  Markdown   │
│   /srs ...  │      │  artifacts  │     │  round, 2-4 │     │  artifact + │
│             │      │  + domain + │     │  rounds     │     │  summary    │
│             │      │  principles │     │             │     │             │
└─────────────┘      └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    ▼
                                                             ┌─────────────┐
                                                             │ 5. Refine   │
                                                             │             │
                                                             │ /clarify    │
                                                             │ /revise     │
                                                             │ /expand     │
                                                             │ /split      │
                                                             │ /validate   │
                                                             │ /done ──────┼──▶ Next step
                                                             └─────────────┘
```

> `/handoff`, `/trace`, and `/analyze` skip step 3 — they extract all information from existing artifacts automatically, with no interview.

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

## 📦 Installation

### 🚀 Easiest: via npm (no clone required)

```bash
# One-shot project setup — zero install, just run:
npx @kudusov.takhir/ba-toolkit init
npx @kudusov.takhir/ba-toolkit install --for claude-code

# Or install globally and reuse across projects:
npm install -g @kudusov.takhir/ba-toolkit
ba-toolkit install --for claude-code --global
```

Supported agents: `claude-code`, `codex`, `gemini`, `cursor`, `windsurf`. Cursor and Windsurf installs automatically convert `SKILL.md` files into the `.mdc` rule format. Use `--dry-run` to preview without writing.

Run `ba-toolkit --help` for the full CLI reference. The npm package has **zero runtime dependencies** — only Node.js ≥ 18.

---

### Option A: Claude Code CLI ✨ Manual install

```bash
# Clone and copy the skills directory (includes domain references)
git clone https://github.com/TakhirKudusov/ba-toolkit.git
cp -r ba-toolkit/skills/ /path/to/project/.claude/skills/ba-toolkit/
```

Or install globally:

```bash
cp -r ba-toolkit/skills/ ~/.claude/skills/ba-toolkit/
```

Keep the full tree: skill folders (`brief/`, `srs/`, …) must stay together with `references/` in the same parent directory.

### Option B: OpenAI Codex CLI

Skills load from `$CODEX_HOME/skills` (default `~/.codex/skills`). Copy the **whole** `skills/` directory as one folder so shared `references/` stays next to each skill:

```bash
cp -r ba-toolkit/skills/ ~/.codex/skills/ba-toolkit/
```

If you use a custom Codex home, set `CODEX_HOME` and copy under `$CODEX_HOME/skills/ba-toolkit/` instead.

### Option C: Google Gemini CLI

Same layout as Codex: one directory that contains all skill subfolders **and** `references/`:

```bash
# User-wide (all projects)
cp -r ba-toolkit/skills/ ~/.gemini/skills/ba-toolkit/

# Or project-only (under your repo root)
cp -r ba-toolkit/skills/ /path/to/project/.gemini/skills/ba-toolkit/
```

Reload the CLI after copying.

### Option D: Cursor, Windsurf, Aider

These platforms use their own rules format instead of SKILL.md. Convert first, then copy:

```bash
# Option 1: Use the community converter
# https://github.com/alirezarezvani/claude-skills/blob/main/scripts/convert.sh
./convert.sh --tool cursor --target /path/to/project
./convert.sh --tool windsurf --target /path/to/project

# Option 2: Ask your AI agent
# "Convert all SKILL.md files in skills/ to Cursor .mdc rule format"
```

**Cursor (details):** Project rules live in [`.cursor/rules/`](https://cursor.com/docs/rules) as `.mdc` files. Each rule is Markdown with **YAML frontmatter** at the top (for example `description`, optional `globs` for file patterns, and `alwaysApply` when the rule should run in every Agent chat). A plain rename of `SKILL.md` to `.mdc` is not enough—you need that metadata block. [Cursor CLI](https://cursor.com/docs/cli/using) uses the same `.cursor/rules` setup as the editor, and may also read `AGENTS.md` / `CLAUDE.md` at the repo root alongside rules.

### Starting a new project

Run the initialiser script to create the output folder and a starter `AGENTS.md` in one step:

```bash
# macOS / Linux
bash init.sh

# Windows PowerShell
.\init.ps1
```

The script will ask for a project slug, name, and domain, then create `output/{slug}/` and an `AGENTS.md` with the full pipeline status table. After that, open your AI assistant and run `/brief`.

---

### Updating BA Toolkit

When a new version is released, pull the latest changes and re-copy the `skills/` directory to your install location:

```bash
cd ba-toolkit
git pull

# Claude Code — project-level
cp -r skills/ /path/to/project/.claude/skills/ba-toolkit/

# Claude Code — global
cp -r skills/ ~/.claude/skills/ba-toolkit/

# Codex CLI
cp -r skills/ ~/.codex/skills/ba-toolkit/

# Gemini CLI (user-wide)
cp -r skills/ ~/.gemini/skills/ba-toolkit/
```


Your previously generated artifact files (`01_brief_*.md`, `02_srs_*.md`, etc.) are not affected by updates — they stay exactly as you left them.

---

## 📁 Repository Structure

```
ba-toolkit/
│
├── skills/                        # 🧠 Source SKILL.md files (install this directory)
│   ├── ac/SKILL.md                #    Step 5: Acceptance Criteria
│   ├── apicontract/SKILL.md       #    Step 8: API Contract
│   ├── brief/SKILL.md             #    Step 1: Project Brief
│   ├── datadict/SKILL.md          #    Step 7: Data Dictionary
│   ├── nfr/SKILL.md               #    Step 6: Non-functional Requirements
│   ├── srs/SKILL.md               #    Step 2: Requirements (SRS)
│   ├── stories/SKILL.md           #    Step 3: User Stories
│   ├── principles/SKILL.md        #    Step 0 (optional): Project Principles
│   ├── trace/SKILL.md             #    Cross-cutting: Traceability Matrix
│   ├── clarify/SKILL.md           #    Cross-cutting: Targeted Ambiguity Resolution
│   ├── analyze/SKILL.md           #    Cross-cutting: Cross-Artifact Quality Report
│   ├── usecases/SKILL.md          #    Step 4: Use Cases
│   ├── wireframes/SKILL.md        #    Step 9: Wireframe Descriptions
│   ├── research/SKILL.md          #    Step 7a (optional): Technology Research & ADRs
│   ├── scenarios/SKILL.md         #    Step 10 (optional): End-to-end Validation Scenarios
│   ├── handoff/SKILL.md           #    Step 11 (optional): Development Handoff Package
│   ├── estimate/SKILL.md          #    Utility: Effort Estimation (SP / T-shirt / person-days)
│   ├── glossary/SKILL.md          #    Utility: Unified Project Glossary
│   ├── export/SKILL.md            #    Utility: Export to Jira / GitHub Issues / Linear / CSV
│   ├── risk/SKILL.md              #    Utility: Risk Register (probability × impact matrix)
│   ├── sprint/SKILL.md            #    Utility: Sprint Plan (velocity-based story grouping)
│   └── references/
│       ├── environment.md         #    🖥️ Platform-specific output paths
│       ├── closing-message.md     #    📋 Closing message template (used by all skills)
│       ├── prerequisites.md       #    ✅ Per-step prerequisite checklists
│       ├── templates/             #    📄 Base artifact templates with [TOKEN] placeholders
│       │   ├── README.md
│       │   ├── principles-template.md
│       │   ├── brief-template.md
│       │   ├── srs-template.md
│       │   ├── stories-template.md
│       │   ├── usecases-template.md
│       │   ├── ac-template.md
│       │   ├── nfr-template.md
│       │   ├── datadict-template.md
│       │   ├── research-template.md
│       │   ├── apicontract-template.md
│       │   ├── wireframes-template.md
│       │   ├── scenarios-template.md
│       │   ├── trace-template.md
│       │   ├── analyze-template.md
│       │   └── handoff-template.md
│       └── domains/
│           ├── igaming.md         #    🎰 iGaming domain knowledge
│           ├── fintech.md         #    🏦 Fintech domain knowledge
│           ├── saas.md            #    ☁️ SaaS domain knowledge
│           ├── ecommerce.md       #    🛒 E-commerce domain knowledge
│           ├── healthcare.md      #    🏥 Healthcare / MedTech domain knowledge
│           ├── logistics.md       #    🚚 Logistics / Delivery domain knowledge
│           ├── on-demand.md       #    🔧 On-demand / Services domain knowledge
│           ├── social-media.md    #    📱 Social / Media domain knowledge
│           └── real-estate.md     #    🏠 Real Estate domain knowledge
│
├── bin/
│   └── ba-toolkit.js              # 🧰 npm CLI entry point (zero runtime deps)
├── package.json                   # 📦 npm package manifest (for `npx @kudusov.takhir/ba-toolkit`)
├── init.ps1                       # 🚀 Project initialiser (Windows PowerShell)
├── init.sh                        # 🚀 Project initialiser (macOS / Linux bash)
├── CHANGELOG.md                   # 📋 Version history
├── COMMANDS.md                    # 📜 Command cheat sheet
├── CONTRIBUTING.md                # 🤝 Contribution workflow
├── LICENSE                        # MIT license text
├── README.md                      # Project documentation
├── docs/
│   ├── USAGE.md                   # 📖 Detailed usage guide
│   ├── TROUBLESHOOTING.md         # 🔧 Common issues and fixes
│   ├── FAQ.md                     # ❓ Frequently asked questions
│   └── DOMAINS.md                 # 🌍 Adding a new domain reference
├── .gitignore
└── .github/
    ├── workflows/
    │   ├── validate.yml           # ✅ CI: validate artifacts and skill files on PR
    │   └── release.yml            # 🚀 CD: create GitHub Release on version tag push
    └── scripts/
        └── validate_artifacts.py  # Python validator used by CI
```

> 💡 **`skills/`** is the directory you install — copy it as one unit so that `references/` stays alongside all skill folders.

---

## 🔗 Cross-Reference System

Every artifact links back to its predecessors. This chain ensures full traceability from business goals to screen specifications:

```
FR-001 (SRS)
  └── US-001 (Stories)
        └── UC-001 (Use Cases)
              └── AC-001-01 (Acceptance Criteria)
                    │
                  NFR-003 (Non-functional Requirements)
                    │
                  User, Bet (Data Dictionary)
                    │
                  ADR-002 (Research — tech decision driven by this entity)
                    │
                  POST /bets (API Contract)
                    │
                  WF-005 (Wireframes)
                    │
                  SC-003 (Validation Scenario — end-to-end journey)
```

The `/trace` command builds the **complete matrix** of these links and highlights uncovered FRs, stories without AC, orphan entities and endpoints, and coverage percentage per artifact type. The `/analyze` command adds severity-rated findings: duplicates, ambiguous terms, terminology drift, and invalid references.

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

Use `/clarify` at any step to resolve ambiguities before moving on.

**Time estimates** (approximate, depends on project complexity and interview depth):

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

---

## 🚀 Quick Start

```
# Optional: define conventions before starting
You:    /principles
Agent:  What language should artifacts be in? What severity blocks /done?
You:    English, block on CRITICAL only
Agent:  [generates 00_principles_dragon-fortune.md — applied by all subsequent skills]

You:    /brief
Agent:  What domain is your project in? (iGaming, Fintech, SaaS, other?)
You:    iGaming — it's an online slot as a Telegram Mini App
Agent:  [asks 5-6 targeted questions about goals, audience, constraints...]
You:    [answer]
Agent:  [generates 01_brief_dragon-fortune.md]
        Artifact saved: 01_brief_dragon-fortune.md
        Covered: 4 business goals, 3 stakeholders, 6 risks identified.
        Next step: /srs

You:    /done
Agent:  Brief finalized. Next step: /srs

You:    /srs
Agent:  [reads the brief, asks about roles, integrations, business rules...]
...
```

Repeat for each step. At any point after `/srs`, run `/clarify [focus]` to resolve ambiguities in the current artifact or `/analyze` for a full cross-artifact quality report. After `/stories`, run `/trace` to check traceability coverage.

---

## 🗂️ What the Output Looks Like

A complete example project — **Dragon Fortune** (iGaming Telegram Mini App) — is included in [`example/dragon-fortune/`](example/dragon-fortune/). All 15 artifacts are realistic, cross-referenced, and generated by running the full BA Toolkit pipeline.

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
