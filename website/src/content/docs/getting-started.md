---
title: "Getting started"
description: "Install BA Toolkit, scaffold your first project, and run the BA pipeline end to end."
---

BA Toolkit ships as a single npm package with **zero runtime dependencies**. Install once, scaffold a project, then run the pipeline inside any supported AI agent.

## Prerequisites

Before you start, make sure you have the following:

- **Node.js 18 or later.** Node.js is a free runtime that lets you run JavaScript outside a browser. To check if you have it, open a terminal (Terminal on Mac, Command Prompt or PowerShell on Windows) and type `node --version`. If you see `v18.x.x` or higher, you are ready. If not, download the LTS version from [nodejs.org](https://nodejs.org/) and install it — the defaults are fine.
- **An AI coding agent.** BA Toolkit skills run inside an AI agent, not in the terminal. You need one of these installed:
  - [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — Anthropic's CLI agent (free tier available)
  - [Cursor](https://www.cursor.com/) — AI-powered code editor (free tier available)
  - [Codex CLI](https://github.com/openai/codex) — OpenAI's terminal agent
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli) — Google's terminal agent
  - [Windsurf](https://windsurf.com/) — AI-powered code editor

You do **not** need to know how to code. The agent asks you questions and generates all the documents for you.

## 1. Install

```bash
# Full setup in one command — prompts for project name, domain, and AI agent.
npx @kudusov.takhir/ba-toolkit init

# Or install globally and reuse across projects.
npm install -g @kudusov.takhir/ba-toolkit
ba-toolkit init
```

`init` creates `output/<slug>/` with an `AGENTS.md` project context file, then installs the 24 skills into your chosen agent's native skills directory. No conversion step — every supported agent reads `SKILL.md` directly.

## 2. Open your AI agent in the project folder

```bash
cd output/<slug>
claude   # or: codex / gemini / cursor / windsurf
```

Each project lives in its own `output/<slug>/` folder with its own `AGENTS.md`. Two agent windows can work on two different projects in the same repo without colliding.

## 3. Run the pipeline

Here is the full pipeline at a glance. Steps marked "(optional)" can be skipped — the lean path takes ~3–4 hours, the full path ~5–8 hours.

```
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │ /discovery  │────▶│   /brief    │────▶│    /srs     │────▶│  /stories   │
  │  (optional) │     │  Goals &    │     │ Requirements│     │ User Stories│
  └─────────────┘     │ Stakeholders│     │  (IEEE 830) │     │  by Epic    │
                      └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                     │
                 ┌───────────────────────────────────────────────────┘
                 │
                 ▼
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  /usecases  │────▶│    /ac      │────▶│    /nfr     │────▶│  /datadict  │
  │  (optional) │     │ Acceptance  │     │ Performance,│     │  Entities & │
  │             │     │  Criteria   │     │  Security…  │     │   Fields    │
  └─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                     │
                 ┌───────────────────────────────────────────────────┘
                 │
                 ▼
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  /research  │────▶│/apicontract │────▶│ /wireframes │────▶│ /scenarios  │
  │  (optional) │     │  Endpoints  │     │   Screens   │     │  (optional) │
  │  Tech ADRs  │     │ & Schemas   │     │ & Navigation│     │  E2E Flows  │
  └─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                     │
                 ┌───────────────────────────────────────────────────┘
                 │
                 ▼
  ┌─────────────┐     ┌─────────────┐
  │  /handoff   │────▶│/implement-  │     ╔═══════════════════════════════╗
  │  Dev-ready  │     │   plan      │     ║  UTILITY SKILLS (any stage)  ║
  │  Package    │     │ Task DAG    │     ║                               ║
  └─────────────┘     │ for AI Agent│     ║  /trace    — coverage matrix  ║
                      └─────────────┘     ║  /clarify  — fix ambiguities  ║
                                          ║  /analyze  — quality report   ║
                                          ║  /estimate — story points     ║
                                          ║  /glossary — term consistency ║
                                          ║  /risk     — risk register    ║
                                          ║  /sprint   — sprint plan      ║
                                          ║  /export   — Jira/GitHub/CSV  ║
                                          ║  /publish  — Notion/Confluence║
                                          ╚═══════════════════════════════╝
```

Want to see what the output looks like? Browse the [complete example project](/ba-toolkit/example/).

Type `/discovery` in the agent if you have only a vague idea of what to build, or jump straight to `/brief` if the project is clear:

```text
/discovery I think there's a need for a tool that helps freelance designers track invoices and chase late payments
```

The agent walks you through a structured interview (one question at a time, 4 multiple-choice options plus a free-text "Other", one option marked **Recommended** based on your domain), then generates a Markdown artifact in the project folder. Move through the pipeline:

```text
/discovery   →  00_discovery_<slug>.md
/brief       →  01_brief_<slug>.md
/srs         →  02_srs_<slug>.md
/stories     →  03_stories_<slug>.md
/usecases    →  04_usecases_<slug>.md
/ac          →  05_ac_<slug>.md
/nfr         →  06_nfr_<slug>.md
/datadict    →  07_datadict_<slug>.md
/research    →  07a_research_<slug>.md
/apicontract →  08_apicontract_<slug>.md
/wireframes  →  09_wireframes_<slug>.md
/scenarios   →  10_scenarios_<slug>.md
/handoff     →  11_handoff_<slug>.md
/implement-plan →  12_implplan_<slug>.md
```

You don't have to run every step. The lean path (`/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff → /implement-plan`) takes ~3–4 hours and gives you a complete BA package plus an AI-actionable implementation plan.

## 4. Hand off to a coding agent

After `/handoff` and `/implement-plan`, point your AI coding agent at `12_implplan_<slug>.md`. The plan is structured as 9 phases (Foundation → Data → Auth → Core → API → UI → Integrations → Quality → Validation) with atomic tasks. Each task references the requirements and acceptance criteria it implements, and carries its own checklist for completion. The agent can step through it without re-reading the whole pipeline every time.

## 5. Optional — share with stakeholders

```bash
ba-toolkit publish        # bundles for both Notion (Markdown) and Confluence (HTML)
```

Drag-and-drop the generated folders into Notion's **Import → Markdown & CSV** dialog or zip them and upload via Confluence's **Space settings → Content tools → Import → HTML**. No API tokens, no network calls — the conversion happens entirely on disk.

## What's next

- The full [usage guide](/usage/) walks through every skill in detail.
- The [command reference](/commands/) lists every shipped skill and subcommand.
- The [FAQ](/faq/) answers common questions about language support, offline use, and editing past artifacts.
- The [glossary](/glossary/) explains all the acronyms and standards referenced in the artifacts.
- The [roadmap](/roadmap/) covers what is planned next and what is explicitly out of scope.
