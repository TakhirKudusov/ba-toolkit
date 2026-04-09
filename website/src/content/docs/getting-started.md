---
title: "Getting started"
description: "Install BA Toolkit, scaffold your first project, and run the BA pipeline end to end."
---

BA Toolkit ships as a single npm package with **zero runtime dependencies**. The CLI is one Node.js file; the skills are 24 folder-per-skill `SKILL.md` files. Install once, scaffold a project, then run the pipeline inside any supported AI agent (Claude Code, Codex CLI, Gemini CLI, Cursor, or Windsurf).

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

After `/handoff` and `/implement-plan`, point your AI coding agent at `12_implplan_<slug>.md`. The plan is structured as 9 phases (Foundation → Data → Auth → Core → API → UI → Integrations → Quality → Validation) with atomic tasks that reference the FRs / US / AC they implement and carry their own Definition of Done. The agent can step through it without re-reading the whole pipeline every time.

## 5. Optional — share with stakeholders

```bash
ba-toolkit publish        # bundles for both Notion (Markdown) and Confluence (HTML)
```

Drag-and-drop the generated folders into Notion's **Import → Markdown & CSV** dialog or zip them and upload via Confluence's **Space settings → Content tools → Import → HTML**. No API tokens, no network calls — the conversion happens entirely on disk.

## What's next

- The full [usage guide](/usage/) walks through every skill in detail.
- The [command reference](/commands/) lists every shipped skill and subcommand.
- The [FAQ](/faq/) answers common questions about language support, offline use, and editing past artifacts.
- The [roadmap](/roadmap/) covers what is planned next and what is explicitly out of scope.
