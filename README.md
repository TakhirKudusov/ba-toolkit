<p align="center">
  <h1 align="center">📋 BA Toolkit</h1>
  <p align="center">
    <strong>AI-powered Business Analyst pipeline</strong><br>
    From project brief to wireframes in 9 structured steps
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/skills-10-blue" alt="Skills">
    <img src="https://img.shields.io/badge/domains-3-green" alt="Domains">
    <img src="https://img.shields.io/badge/format-Markdown-orange" alt="Format">
    <img src="https://img.shields.io/badge/language-auto--detect-purple" alt="Language">
    <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License">
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Claude_Code-✓-6C5CE7" alt="Claude Code">
    <img src="https://img.shields.io/badge/Claude.ai-✓-6C5CE7" alt="Claude.ai">
    <img src="https://img.shields.io/badge/Codex_CLI-✓-00D26A" alt="Codex CLI">
    <img src="https://img.shields.io/badge/Gemini_CLI-✓-4285F4" alt="Gemini CLI">
    <img src="https://img.shields.io/badge/Cursor-convert-F5A623" alt="Cursor">
    <img src="https://img.shields.io/badge/Windsurf-convert-1ABCFE" alt="Windsurf">
  </p>
</p>

---

## 🎯 What is this?

BA Toolkit is a set of **10 interconnected skills** that turn your AI coding agent into a business analyst. You walk through a structured pipeline — from a high-level project brief to detailed wireframes — and get a complete requirements package ready for development handoff.

Each skill **reads the output of previous steps**, maintains cross-references between artifacts (FR → US → UC → AC → NFR → Entities → API → Screens), and adapts to your project's domain.

**Artifacts are generated in the language you write in.** Ask in English — get English docs. Ask in Russian, Spanish, or any other language — the output follows.

---

## 🤖 Platform Compatibility

BA Toolkit uses the open **Agent Skills specification** (SKILL.md format) published by Anthropic in December 2025 and adopted across multiple platforms.

| Platform | Support | Installation |
|----------|:-------:|-------------|
| **Claude Code** | ✅ Native | `cp -r skills/ .claude/skills/ba-toolkit/` |
| **Claude.ai** (web/desktop) | ✅ Native | Upload `.skill` files via Settings → Skills |
| **OpenAI Codex CLI** | ✅ Native | `cp -r skills/ ~/.codex/skills/ba-toolkit/` |
| **Gemini CLI** | ✅ Native | Copy `skills/` contents to Gemini skills directory |
| **Cursor** | 🔄 Convert | SKILL.md → `.mdc` rules in `.cursor/rules/` |
| **Windsurf** | 🔄 Convert | SKILL.md → rules in `.windsurf/rules/` |
| **Aider** | 🔄 Convert | SKILL.md → conventions file |

> 💡 Platforms marked **Native** read SKILL.md as-is. Platforms marked **Convert** require a one-time format conversion — the content is the same, only the file format differs. Tools like [convert.sh](https://github.com/alirezarezvani/claude-skills/blob/main/scripts/convert.sh) can automate this.

### Environment detection

Skills do not hardcode platform-specific paths. Instead, they reference `references/environment.md` which contains the output directory logic for each platform:

- If `/mnt/user-data/outputs/` exists → Claude.ai → save there.
- Otherwise → save to the current working directory.

To customize for your platform, edit `skills/references/environment.md` — all 10 skills will pick up the change automatically.

---

## 🔗 Pipeline

```
📄 /brief → 📑 /srs → 📝 /stories → 🔄 /usecases → ✅ /ac → ⚡ /nfr → 🗃️ /datadict → 🔌 /apicontract → 🖼️ /wireframes
                           │
                           └──→ 🔍 /trace (available after /stories)
```

| # | Command | What it generates | Output file |
|:---:|---------|-------------------|-------------|
| 1 | `/brief` | 📄 Project Brief — goals, audience, stakeholders, risks | `01_brief_{slug}.md` |
| 2 | `/srs` | 📑 Requirements Specification (IEEE 830) | `02_srs_{slug}.md` |
| 3 | `/stories` | 📝 User Stories grouped by Epics | `03_stories_{slug}.md` |
| 4 | `/usecases` | 🔄 Use Cases with main/alt/exception flows | `04_usecases_{slug}.md` |
| 5 | `/ac` | ✅ Acceptance Criteria (Given/When/Then) | `05_ac_{slug}.md` |
| 6 | `/nfr` | ⚡ Non-functional Requirements with metrics | `06_nfr_{slug}.md` |
| 7 | `/datadict` | 🗃️ Data Dictionary — entities, types, constraints | `07_datadict_{slug}.md` |
| 8 | `/apicontract` | 🔌 API Contract — endpoints, schemas, errors | `08_apicontract_{slug}.md` |
| 9 | `/wireframes` | 🖼️ Textual Wireframe Descriptions | `09_wireframes_{slug}.md` |
| — | `/trace` | 🔍 Traceability Matrix + coverage gaps | `00_trace_{slug}.md` |

> 💡 The project **slug** (e.g., `dragon-fortune`) is set at `/brief` and reused across all files automatically.

---

## 🌍 Domain Support

The pipeline is **domain-agnostic** by default. At the `/brief` stage, you pick a domain — and every subsequent skill loads domain-specific interview questions, mandatory entities, NFR categories, and glossary terms.

| Domain | Industries covered |
|--------|-------------------|
| 🎰 **iGaming** | Online slots, sports betting, casino lobbies, Telegram Mini Apps, promo mechanics |
| 🏦 **Fintech** | Neobanks, payment systems, crypto exchanges, investment platforms, P2P lending |
| ☁️ **SaaS** | B2B platforms, CRM, analytics, marketplaces, EdTech, HRTech |
| 🔧 **Custom** | Any other domain — works with general interview questions |

> ➕ **Adding a new domain** = creating one Markdown file in `skills/references/domains/`. See [Adding a New Domain](#-adding-a-new-domain) below.

---

## 🔄 How Each Skill Works

Every skill follows the same cycle:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Command │────▶│  2. Context│────▶│ 3. Interview│───▶│ 4. Generate │
│   /brief    │     │  Load prior │     │  3-7 Q's per│     │  Markdown   │
│   /srs ...  │     │  artifacts  │     │  round, 2-4 │     │  artifact   │
│             │     │  + domain   │     │  rounds     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │ 5. Refine   │
                                                            │             │
                                                            │ /revise     │
                                                            │ /expand     │
                                                            │ /split      │
                                                            │ /validate   │
                                                            │ /done ──────┼──▶ Next step
                                                            └─────────────┘
```

### Subcommands

| Command | What it does |
|---------|-------------|
| `/revise [section]` | Rewrite a specific section with your feedback |
| `/expand [section]` | Add more detail to a section |
| `/split [element]` | Break a large element into smaller ones (e.g., a big user story) |
| `/validate` | Check completeness, consistency, and alignment with prior artifacts |
| `/done` | Finalize the current artifact and move to the next pipeline step |

---

## 📦 Installation

### Option A: Claude.ai (web / desktop)

Upload individual `.skill` files from the repo root via **Settings → Skills → Add Skill**:

```
brief.skill    srs.skill      stories.skill   usecases.skill   ac.skill
nfr.skill      datadict.skill apicontract.skill wireframes.skill trace.skill
```

> ⚠️ **Limitation:** `.skill` files include only the core SKILL.md. Domain references are not bundled. Skills will use general interview questions.

### Option B: Claude Code CLI ✨ Recommended

```bash
# Clone and copy the skills directory (includes domain references)
git clone https://github.com/TakhirKudusov/ba-toolkit.git
cp -r ba-toolkit/skills/ /path/to/project/.claude/skills/ba-toolkit/
```

Or install globally:

```bash
cp -r ba-toolkit/skills/ ~/.claude/skills/ba-toolkit/
```

### Option C: OpenAI Codex CLI

```bash
cp -r ba-toolkit/skills/ ~/.codex/skills/ba-toolkit/
```

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
│   ├── trace/SKILL.md             #    Cross-cutting: Traceability Matrix
│   ├── usecases/SKILL.md          #    Step 4: Use Cases
│   ├── wireframes/SKILL.md        #    Step 9: Wireframe Descriptions
│   └── references/
│       ├── environment.md         #    🖥️ Platform-specific output paths
│       └── domains/
│           ├── igaming.md         #    🎰 iGaming domain knowledge
│           ├── fintech.md         #    🏦 Fintech domain knowledge
│           └── saas.md            #    ☁️ SaaS domain knowledge
│
├── ac.skill                       # 📦 Packaged skills for Claude.ai upload
├── apicontract.skill              #
├── brief.skill                    #
├── datadict.skill                 #
├── nfr.skill                      #
├── srs.skill                      #
├── stories.skill                  #
├── trace.skill                    #
├── usecases.skill                 #
├── wireframes.skill               #
│
├── README.md
└── .gitignore
```

> 💡 **`skills/`** is the directory you install. The `.skill` files in the repo root are pre-packaged archives for Claude.ai — upload them directly without unpacking.

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
                  POST /bets (API Contract)
                    │
                  WF-005 (Wireframes)
```

The `/trace` command builds the **complete matrix** of these links and highlights:
- ❌ Uncovered functional requirements
- ❌ Stories without acceptance criteria
- ❌ Orphan entities or endpoints
- 📊 Coverage percentage per artifact type

---

## 🚀 Quick Start

```
You:    /brief
Agent:  What domain is your project in? (iGaming, Fintech, SaaS, other?)
You:    iGaming — it's an online slot as a Telegram Mini App
Agent:  [asks 5-6 targeted questions about goals, audience, constraints...]
You:    [answer]
Agent:  [generates 01_brief_dragon-fortune.md]

You:    /done
Agent:  Brief finalized. Next step: /srs

You:    /srs
Agent:  [reads the brief, asks about roles, integrations, business rules...]
...
```

Repeat for each step. At any point after `/stories`, run `/trace` to check coverage.

---

## ➕ Adding a New Domain

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

MIT — use freely, modify, distribute.
