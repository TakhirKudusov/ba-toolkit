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

This section is for contributors who want to add a new industry reference to BA Toolkit. New domains are the **highest-impact contribution** — one Markdown file, one line of code, one PR.

### Step-by-step checklist

#### 1. Pick a slug

Use lowercase with hyphens: `proptech`, `travel`, `food-delivery`. The slug must be unique across the existing domains. Check the current list:

```
saas · fintech · ecommerce · healthcare · logistics · on-demand
social-media · real-estate · igaming · edtech · govtech · ai-ml · custom
```

#### 2. Create the reference file

Create `skills/references/domains/{slug}.md`. The file has **10 sections** — one per interview-phase skill, plus a domain glossary. Use an existing reference as a model (e.g., [`edtech.md`](../skills/references/domains/edtech.md) at ~220 lines, or [`saas.md`](../skills/references/domains/saas.md) at ~185 lines).

Required structure:

```markdown
# Domain Reference: {Name}

{One-paragraph description of what this domain covers.}

---

## 1. /brief — Project Brief
### Domain-specific interview questions
{5–8 bullet points: business model, buyer vs. user, monetization, geography, regulations.}
### Typical business goals
{4–6 bullet points with concrete metrics where possible.}
### Typical risks
{4–6 bullet points: compliance, market, technical, operational.}

---

## 2. /srs — Requirements Specification
### Domain-specific interview questions
{5–8 bullet points: roles, integrations, compliance, data flows.}
### Typical functional areas
{8–12 bullet points: the major feature groups for this industry.}

---

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
{10–20 industry-specific terms the agent should use consistently.}
```

**Quality bar:**
- Every section should have real, specific content — not generic filler. The agent uses these bullet points as interview prompts; vague bullets produce vague artifacts.
- Sections 1–3 should be the most detailed (these drive the early pipeline). Sections 4–9 can be shorter but must not be empty.
- The glossary should include terms a developer outside your industry would not know (e.g., "KYC" for Fintech, "FERPA" for EdTech, "GGR" for iGaming).

#### 3. Register the domain in the CLI

Open `bin/ba-toolkit.js` and add one line to the `DOMAINS` array (around line 73). Insert your domain **before** the `custom` entry — that slot is always last.

```javascript
{ id: '{slug}', name: '{Display Name}', desc: '{Short description for the init menu}' },
```

#### 4. Test locally

```bash
# Verify the init menu shows your domain
node bin/ba-toolkit.js init --name "Test" --domain {slug} --for claude-code --dry-run

# Run the full test suite
npm test
```

Both commands should pass without errors. The dry-run confirms the slug is recognized; the test suite confirms no regressions.

#### 5. Open a PR

- **Title:** `feat(domains): add {Name} domain reference`
- **Body:** one paragraph explaining what industries/products the domain covers and why it is distinct from existing domains.
- **Files changed:** `skills/references/domains/{slug}.md` (new) + `bin/ba-toolkit.js` (one line in `DOMAINS` array).

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the general PR workflow.

### Naming rules

- Filename must match the `id` in the `DOMAINS` array exactly — mismatches cause the reference to silently not load.
- Use lowercase with hyphens: `food-delivery`, not `FoodDelivery` or `food_delivery`.
- Keep it short (1–2 words) — the slug appears in CLI prompts, menu navigation, and `AGENTS.md`.
