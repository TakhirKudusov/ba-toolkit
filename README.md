<div align="center">

# 📋 BA Toolkit

<strong>AI-powered Business Analyst pipeline</strong><br>
From project brief to development handoff — 19 skills, fully structured pipeline

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
- [Usage Guide](#-usage-guide)
  - [1. Starting a project](#1-starting-a-project)
  - [2. Moving through the pipeline](#2-moving-through-the-pipeline)
  - [3. Using /clarify](#3-using-clarify)
  - [4. Using /analyze](#4-using-analyze)
  - [5. Using /trace](#5-using-trace)
  - [6. Splitting large elements](#6-splitting-large-elements)
  - [7. Working with multiple projects](#7-working-with-multiple-projects)
  - [8. Troubleshooting](#8-troubleshooting)
  - [9. AGENTS.md — persistent project context](#9-agentsmd--persistent-project-context)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [Adding a New Domain](#adding-a-new-domain)
- [Changelog](CHANGELOG.md)
- [License](#-license)

---

## 🎯 What is this?

BA Toolkit is a set of **21 interconnected skills** that turn your AI coding agent into a business analyst. You walk through a structured pipeline — from a high-level project brief to a development handoff package — and get a complete requirements artifact set ready for engineering.

Each skill **reads the output of previous steps**, maintains cross-references between artifacts (FR → US → UC → AC → NFR → Entities → ADR → API → Screens → Scenarios), and adapts to your project's domain.

**Artifacts are generated in the language you write in.** Ask in English — get English docs. Ask in Russian, Spanish, or any other language — the output follows.

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

> ➕ **Adding a new domain** = creating one Markdown file in `skills/references/domains/`. See [Adding a New Domain](#adding-a-new-domain) below.

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

### Option A: Claude Code CLI ✨ Recommended

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
├── init.ps1                       # 🚀 Project initialiser (Windows PowerShell)
├── init.sh                        # 🚀 Project initialiser (macOS / Linux bash)
├── CHANGELOG.md                   # 📋 Version history
├── LICENSE                        # MIT license text
├── README.md
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
You:    Russian, block on CRITICAL only
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

<details>
<summary>Example: <code>01_brief_dragon-fortune.md</code> (click to expand)</summary>

```markdown
# Project Brief: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-07
**Slug:** dragon-fortune

## 1. Project Summary

Dragon Fortune is an online slot game delivered as a Telegram Mini App targeting
CIS markets. The product aims to capture casual players through social sharing
mechanics and a low deposit threshold, with revenue driven by in-game purchases
and a referral programme.

## 2. Business Goals and Success Metrics

| # | Goal | Success Metric |
|---|------|----------------|
| 1 | Acquire 50 000 active players in 6 months | MAU ≥ 50 000 |
| 2 | Achieve positive unit economics per player | LTV/CAC ≥ 1.5 |
| 3 | Maintain regulatory compliance in all target markets | 0 regulatory incidents |

## 3. Target Audience

| Segment | Description | Geography |
|---------|-------------|-----------|
| Casual players | Ages 21–40, mobile-first, low stakes | Russia, Kazakhstan, Belarus |
| High-rollers | Ages 30–50, desktop and mobile | Russia, Ukraine |

## 4. High-Level Functionality Overview

- Slot gameplay with configurable paylines and volatility settings.
- Telegram-native onboarding: no external registration, Telegram account is identity.
- Wallet: deposit via cryptocurrency and local payment systems; withdrawal in 24 h.
- Referral programme with tiered bonuses.
- Responsible gambling controls: session limits, self-exclusion.

## 5. Stakeholders and Roles

| Role | Responsibility |
|------|---------------|
| Product Owner | Roadmap and feature prioritisation |
| Compliance Officer | Regulatory requirements and AML policy |
| Payment Provider | Payment gateway integration and KYC |

## 6. Constraints and Assumptions

**Constraints:**
- Must operate within Telegram Mini App API limitations.
- Payment processing must comply with local AML/KYC requirements.
- RTP must be certified by an accredited testing lab before launch.

**Assumptions:**
- Telegram Bot API will remain stable during development.
- A licensed payment aggregator will handle fiat-to-crypto conversion.

## 7. Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| 1 | Regulatory changes in target markets | Medium | High | Monitor legislation; build jurisdiction toggle |
| 2 | Telegram API breaking changes | Low | High | Pin API version; maintain fallback web view |
| 3 | Player fraud via referral programme | Medium | Medium | Implement fraud scoring on referral payouts |

## 8. Glossary

| Term | Definition |
|------|-----------|
| RTP | Return to Player — percentage of wagered money returned to players over time |
| Mini App | Telegram-native web application launched inside the Telegram chat interface |
| Payline | A line across the slot reels on which a winning combination is evaluated |
```

</details>

<details>
<summary>Example: FR excerpt from <code>02_srs_dragon-fortune.md</code> (click to expand)</summary>

```markdown
## 3. Functional Requirements

### FR-001: Player Onboarding via Telegram

- **Description:** The system must authenticate the player using their Telegram identity
  without requiring a separate registration form.
- **Actor:** Player
- **Input:** Telegram user object (id, first_name, username, language_code)
- **Output / Result:** Player account created or retrieved; session token issued.
- **Business Rules:** If the Telegram user ID already exists, return the existing account.
  New accounts receive a welcome bonus as defined in the Promotions configuration.
- **Priority:** Must

### FR-002: Slot Spin Execution

- **Description:** The system must execute a slot spin, deduct the bet from the player wallet,
  calculate the result using a certified RNG, and credit any winnings.
- **Actor:** Player
- **Input:** Bet amount, selected paylines count.
- **Output / Result:** Spin result (symbol matrix, winning lines, payout amount); updated wallet balance.
- **Business Rules:** Bet must not exceed wallet balance. RTP must fall within the certified
  range (94–97%). Maximum win per spin: 5 000× bet.
- **Priority:** Must
```

</details>

---

## 📖 Usage Guide

### 1. Starting a project

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

### 2. Moving through the pipeline

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

### 3. Using /clarify

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

### 4. Using /analyze

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

### 5. Using /trace

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

### 6. Splitting large elements

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

### 7. Working with multiple projects

Each project gets its own slug and its own set of files. If you work on multiple projects in the same directory, run `/principles` first for each and set `output mode: subfolder` — files will be organised under `{slug}/` subfolders automatically.

If you start a new project without changing the output directory, the agent detects existing `01_brief_*.md` files and warns you before overwriting anything.

---

### 8. Troubleshooting

**Agent says it can't find the brief / SRS / previous artifact:**
The skill looks for files matching `01_brief_*.md` in the output directory. If the file was saved elsewhere, either move it or tell the agent the full path.

**Artifact was generated in the wrong language:**
Run `/principles` and set the artifact language explicitly. Then re-run the current step — all subsequent skills will use the language from `00_principles_{slug}.md`.

**Want to redo a step from scratch:**
Run the command again (e.g., `/srs`). The agent will warn that `02_srs_{slug}.md` already exists and offer to overwrite or create a new version.

**A domain reference is not loading:**
Check that `skills/references/domains/{domain}.md` exists and that the domain name in the brief matches exactly (`igaming`, `fintech`, `saas`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, or `real-estate` — lowercase with hyphens).

**`/analyze` reports findings after you already fixed them:**
Run `/analyze` again — it always re-reads all artifacts fresh. Cached results are never used.

---

### 9. AGENTS.md — persistent project context

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

## ❓ FAQ

**Do I need all 21 skills?**
No. The lean pipeline (`/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff`) covers the essentials in ~3–4 hours. Add `/usecases`, `/research`, `/scenarios`, `/trace`, and `/analyze` when you need deeper coverage.

**Can I use it in any language?**
Yes. The agent detects the language of your first message and generates all artifacts in that language. Set it explicitly with `/principles` if you want to lock it regardless of the conversation language.

**Does it work offline / without internet?**
Yes. All skills are local Markdown files. The only network dependency is your AI agent itself (Claude Code, Codex CLI, etc.). No BA Toolkit component calls any external API.

**My domain isn't iGaming, Fintech, or SaaS — can I still use it?**
Yes. Select "Custom" at `/brief` and the skills use general interview questions. You can add your own domain in 30 minutes by creating one Markdown file — see [Adding a New Domain](#adding-a-new-domain).

**Can I go back and edit a previous artifact?**
Yes. Run `/revise [section]` at any step, or re-invoke the skill command (e.g., `/srs`) to regenerate from scratch. The agent warns before overwriting. Subsequent skills will read the updated version automatically.

**Does it work with smaller / faster models?**
The structured Markdown format and explicit cross-references help smaller models stay on track. For best results, use a model with a context window of at least 32k tokens — the later pipeline steps load multiple large artifacts simultaneously.

**How do I update BA Toolkit after a new version is released?**
See the update instructions in the [Installation](#-installation) section below.

---

## 🤝 Contributing

Contributions are welcome. The most useful additions are:

**New domains** (highest impact, no code required):
Create `skills/references/domains/{domain}.md` following the template in [Adding a New Domain](#adding-a-new-domain). Open a PR with the file and a brief description of the domain.

**Skill improvements:**
Edit the relevant `skills/{name}/SKILL.md`. Keep changes backward-compatible — avoid renaming sections or changing output file names, as other skills depend on them.

**Bug reports:**
Open a GitHub issue with: the skill name, the command you ran, the agent/platform you used, and what happened vs. what you expected.

**Guidelines:**
- One PR per domain or skill.
- Test the skill end-to-end before submitting (run the full command, check the output file).
- Keep the style consistent with existing skills: formal, neutral, no emoji in artifact body, language follows user input.

---

<h2 id="adding-a-new-domain">➕ Adding a New Domain</h2>

Create `skills/references/domains/{domain}.md` following this structure:

```markdown
# Domain Reference: {Name}

## 1. /brief — Project Brief
### Domain-specific interview questions
### Typical business goals
### Typical risks

## 2. /srs — Requirements Specification
### Domain-specific interview questions
### Typical functional areas

## 3. /stories — User Stories
### Domain-specific interview questions
### Typical epics

## 4. /usecases — Use Cases
## 5. /ac — Acceptance Criteria
## 6. /nfr — Non-functional Requirements
## 7. /datadict — Data Dictionary
## 8. /apicontract — API Contract
## 9. /wireframes — Wireframe Descriptions

## Domain Glossary
| Term | Definition |
|------|-----------|
```

Each skill loads **only its own section** from the reference file — keeping context usage efficient.

---

## 📄 License

MIT — use freely, modify, distribute. See [LICENSE](LICENSE) for the full text.
