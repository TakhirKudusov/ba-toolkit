# Domains

## How to choose your domain

When you run `ba-toolkit init`, you pick a domain — the industry your project belongs to. The domain affects which questions the agent asks, which entities and glossary terms it suggests, and which compliance or regulatory concerns it flags. Pick the closest match; if none fits, choose **Custom** (the pipeline still works, just with general-purpose questions).

| Domain | Pick this if your project is about... |
|--------|---------------------------------------|
| **SaaS** | B2B platforms, CRM, analytics dashboards, internal tools, HRTech |
| **Fintech** | Banking, payments, crypto, investment, P2P lending, insurance |
| **E-commerce** | Online stores, marketplaces, D2C brands, digital goods, subscriptions |
| **Healthcare** | Telemedicine, patient portals, EHR/EMR, clinic management, mental health |
| **Logistics** | Delivery, courier management, freight tracking, warehousing, fleet management |
| **On-demand** | Ride-hailing, home services, task marketplaces, beauty, tutoring, pet care |
| **Social / Media** | Social networks, creator platforms, community forums, newsletters |
| **Real Estate** | Property portals, rental management, agency CRM, mortgage tools |
| **iGaming** | Online slots, sports betting, casino lobbies, promo mechanics |
| **EdTech** | LMS, K-12, MOOC, corporate training, language learning, exam prep |
| **GovTech** | Citizen e-services, permits, tax filing, benefits, public records |
| **AI / ML** | LLM apps, RAG pipelines, agents, model serving, fine-tuning, MLOps |
| **Custom** | Anything else — general interview questions, no industry-specific prompts |

You can always change your domain later by re-running `ba-toolkit init` with a different `--domain` flag.

---

## Adding a new domain

This section is for contributors who want to add a new industry reference to BA Toolkit.

Domain references live in `skills/references/domains/` — one Markdown file per domain, loaded automatically by interview-phase skills based on the domain you picked at `ba-toolkit init` (which writes it into `AGENTS.md`). Each skill reads **only its own section** from the reference file, keeping context usage efficient.

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

Use a single lowercase slug with hyphens — `igaming`, `fintech`, `on-demand`, `real-estate`. The filename must match the domain id passed to `ba-toolkit init` (or selected from the domain menu) exactly; mismatches cause the reference to silently not load. To register a new domain in the `init` menu, also add it to the `DOMAINS` array in `bin/ba-toolkit.js`.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the PR workflow. New domains are the highest-impact contribution and do not require any code changes — one file, one PR.
