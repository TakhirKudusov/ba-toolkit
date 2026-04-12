# BA Toolkit — Command Reference

Quick reference for all 29 skills. For term and acronym definitions (FR, US, AC, IEEE 830, etc.), see the [glossary](docs/GLOSSARY.md).

---

## Pipeline skills

Run these in order. Each skill reads the output of all previous steps.

| # | Command | Output file | What it generates |
|:---:|---------|-------------|-------------------|
| 0 | `/discovery` | `00_discovery_{slug}.md` | Concept Discovery: problem space, audience hypotheses, candidate domains, MVP feature ideas, validation questions. Use when you don't yet know what to build — feeds the chosen domain, name, and scope hint into `/brief` |
| 0a | `/principles` | `00_principles_{slug}.md` | Project constitution: language, ID conventions, DoR, traceability rules, NFR baseline |
| 1 | `/brief` | `01_brief_{slug}.md` | Project Brief: goals, audience, stakeholders, constraints, risks. Updates the `AGENTS.md` Pipeline Status table (which `ba-toolkit init` already created) |
| 2 | `/srs` | `02_srs_{slug}.md` | Requirements Specification (IEEE 830): scope, FRs, constraints, assumptions |
| 3 | `/stories` | `03_stories_{slug}.md` | User Stories grouped by Epics, with priority and FR references |
| 4 | `/usecases` | `04_usecases_{slug}.md` | Use Cases with main, alternative, and exception flows |
| 5 | `/ac` | `05_ac_{slug}.md` | Acceptance Criteria (Given / When / Then) linked to User Stories |
| 6 | `/nfr` | `06_nfr_{slug}.md` | Non-functional Requirements with measurable metrics |
| 7 | `/datadict` | `07_datadict_{slug}.md` | Data Dictionary: entities, fields, types, constraints, relationships |
| 7a | `/research` | `07a_research_{slug}.md` | Technology Research: ADRs, integration map, data storage decisions |
| 8 | `/apicontract` | `08_apicontract_{slug}.md` | API Contract: endpoints, request/response schemas, error codes |
| 9 | `/wireframes` | `09_wireframes_{slug}.md` | Textual Wireframe Descriptions: screens, components, navigation flows |
| 10 | `/scenarios` | `10_scenarios_{slug}.md` | End-to-end Validation Scenarios linking US → AC → WF → API |
| 11 | `/handoff` | `11_handoff_{slug}.md` | Development Handoff Package: artifact inventory, MVP scope, open items |
| 12 | `/implement-plan` | `12_implplan_{slug}.md` | Implementation Plan for AI coding agents: phase ladder + Task DAG appendix; every task references the FR/US/AC it implements and carries its own Definition of Done |

---

## Utility skills

Available at any pipeline stage.

| Command | Output file | What it generates |
|---------|-------------|-------------------|
| `/trace` | `00_trace_{slug}.md` | Traceability matrix + coverage gap report (FR → US → UC → AC → NFR → API) |
| `/analyze` | `00_analyze_{slug}.md` | Cross-artifact quality report: duplicates, coverage gaps, terminology drift, invalid references |
| `/clarify [focus]` | _(updates existing artifact)_ | Targeted ambiguity resolution: surfaces vague terms, missing metrics, conflicting rules |
| `/estimate` | `00_estimate_{slug}.md` | Effort estimation for User Stories: Fibonacci SP, T-shirt sizes, or person-days |
| `/glossary` | `00_glossary_{slug}.md` | Unified project glossary: scans all artifacts, detects terminology drift, undefined terms |
| `/export [format]` | `export_{slug}_{format}.json` / `.csv` | Export User Stories to Jira, GitHub Issues, Linear, or CSV |
| `/publish [format]` | `publish/notion/`, `publish/confluence/` | Bundle artifacts for Notion (Markdown bundle) and Confluence (HTML bundle) — drag-and-drop import, no API tokens. Wraps the `ba-toolkit publish` CLI subcommand |
| `/risk` | `00_risks_{slug}.md` | Risk register: probability × impact matrix, mitigation and contingency per risk |
| `/sprint` | `00_sprint_{slug}.md` | Sprint plan: stories grouped into sprints by velocity, capacity, and risk priority |

---

## Refinement skills

Available at any pipeline stage after the first artifact exists. These skills refine and validate artifacts without advancing the pipeline (except `/done`, which finalizes and moves on).

| Command | Output file | What it generates |
|---------|-------------|-------------------|
| `/validate` | _(reports in chat)_ | Completeness and consistency check for a single artifact: mandatory fields, ID format, cross-references, MoSCoW counts, Definition of Ready |
| `/revise [section]` | _(updates existing artifact)_ | Section rewrite: applies user feedback or resolves an `/analyze` finding, with ripple-effect check across downstream artifacts |
| `/expand [section]` | _(updates existing artifact)_ | Section expansion: adds depth, detail, and missing elements to an under-developed section |
| `/split [element]` | _(updates existing artifact)_ | Element decomposition: breaks an oversized FR, User Story, or Use Case into smaller pieces using INVEST criteria and Cohn's splitting patterns |
| `/done` | _(updates AGENTS.md)_ | Finalize: quality gate check, artifact metadata update (Version 1.0, Status: Approved), AGENTS.md pipeline advancement |

---

## Export formats

| Format | Command | Output file |
|--------|---------|-------------|
| Jira JSON | `/export jira` | `export_{slug}_jira.json` |
| GitHub Issues JSON | `/export github` | `export_{slug}_github.json` |
| Linear JSON | `/export linear` | `export_{slug}_linear.json` |
| CSV (universal) | `/export csv` | `export_{slug}_stories.csv` |

Scope modifiers: `/export jira E-01` (one epic) · `/export github US-007,US-008` (specific stories)
