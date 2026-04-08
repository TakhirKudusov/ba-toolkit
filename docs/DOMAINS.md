# Adding a New Domain

Domain references live in `skills/references/domains/` — one Markdown file per domain, loaded automatically when `/brief` detects a matching domain name. Each skill reads **only its own section** from the reference file, keeping context usage efficient.

## File structure

Create `skills/references/domains/{domain}.md` following this layout:

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

## Naming

Use a single lowercase slug with hyphens — `igaming`, `fintech`, `on-demand`, `real-estate`. The filename must match the slug used at `/brief` exactly; mismatches cause the reference to silently not load.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the PR workflow. New domains are the highest-impact contribution and do not require any code changes — one file, one PR.
