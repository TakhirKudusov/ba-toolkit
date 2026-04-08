# Artifact Templates

This directory contains base templates for BA Toolkit artifacts. Templates use `[TOKEN]` placeholders in `UPPER_CASE` brackets.

Skills use these templates as the structural baseline when generating artifacts. They do not load templates directly — the token patterns are embedded in each skill's generation instructions. This directory serves as a **reference** for the expected structure of each artifact.

## Available templates

| Template | Artifact file | Used by |
|----------|--------------|---------|
| `principles-template.md` | `00_principles_{slug}.md` | `/principles` |
| `brief-template.md` | `01_brief_{slug}.md` | `/brief` |
| `srs-template.md` | `02_srs_{slug}.md` | `/srs` |
| `stories-template.md` | `03_stories_{slug}.md` | `/stories` |
| `usecases-template.md` | `04_usecases_{slug}.md` | `/usecases` |
| `ac-template.md` | `05_ac_{slug}.md` | `/ac` |
| `nfr-template.md` | `06_nfr_{slug}.md` | `/nfr` |
| `datadict-template.md` | `07_datadict_{slug}.md` | `/datadict` |
| `research-template.md` | `07a_research_{slug}.md` | `/research` |
| `apicontract-template.md` | `08_apicontract_{slug}.md` | `/apicontract` |
| `wireframes-template.md` | `09_wireframes_{slug}.md` | `/wireframes` |
| `scenarios-template.md` | `10_scenarios_{slug}.md` | `/scenarios` |
| `trace-template.md` | _(inline in chat)_ | `/trace` |
| `analyze-template.md` | `00_analyze_{slug}.md` | `/analyze` |
| `handoff-template.md` | `11_handoff_{slug}.md` | `/handoff` |

All templates use `[TOKEN]` placeholders in `UPPER_CASE` brackets for all variable content.

## Adding a new template

1. Create `{artifact}-template.md` in this directory.
2. Use `[TOKEN_NAME]` placeholders for all variable content.
3. Reference the token list in the skill's `## Generation` section.
