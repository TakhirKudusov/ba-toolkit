# Domain Reference: SaaS

Domain-specific knowledge for SaaS projects: B2B platforms, CRM, project management tools, analytics dashboards, service marketplaces, no-code/low-code platforms, EdTech, HRTech.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: B2B platform, CRM, project management tool, analytics platform, marketplace, EdTech/LMS, HRTech, no-code builder?
- Monetization model: subscription (monthly/annual), freemium, per-seat, usage-based, enterprise licensing?
- Target segment: SMB (Small-Medium Business), mid-market, enterprise?

### Typical business goals
- Grow MRR/ARR (Monthly/Annual Recurring Revenue).
- Reduce churn rate.
- Increase NRR (Net Revenue Retention) through upsell.
- Enter the enterprise segment.
- Product-led growth through freemium.
- Reduce CAC (Customer Acquisition Cost).

### Typical risks
- High churn in the first 90 days.
- Competition from enterprise solutions (Salesforce, SAP, Oracle).
- Insufficient scalability of multi-tenant architecture.
- Data residency — data localization requirements.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: end user, team admin, workspace owner, billing admin, superadmin, guest/viewer?
- Multi-tenancy: shared database, schema-per-tenant, database-per-tenant?
- Integrations: SSO (SAML, OIDC), Zapier/Make, Slack, calendar (Google/Outlook), CRM, billing (Stripe, Chargebee)?
- RBAC (Role-Based Access Control): preset roles or custom?
- Compliance: SOC 2, GDPR, HIPAA (if healthcare), ISO 27001?

### Typical functional areas
- Onboarding (workspace creation, member invitation, guided setup).
- Workspace/organization management (settings, billing, members).
- Core product functionality (depends on product type).
- Collaboration (comments, mentions, real-time editing, activity feed).
- Integrations and API.
- Settings and customization.
- Billing and subscriptions.
- Analytics and reporting.

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical user flows: first launch (FTUE — First Time User Experience), team invitation, core product action, plan upgrade, integration setup?
- Edge cases: plan limit exceeded, downgrade with data loss, concurrent editing, workspace deletion with active subscription?
- Personas: solo founder, team lead, enterprise IT admin, invited member?

### Typical epics
- Onboarding and FTUE.
- Workspace management.
- Core functionality (core feature set).
- Collaboration.
- Integrations.
- Billing and plans.
- Settings and customization.
- Administration (superadmin).

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: plan limit exceeded, subscription expired, access revoked, merge conflict during concurrent editing?
- System actors: Stripe/billing provider, SSO provider (Okta, Azure AD), email service, Zapier webhook?

### Typical exceptional flows
- Subscription payment failure (card declined).
- SSO provider unavailable.
- API rate limit exceeded.
- Data conflict during concurrent editing.
- Cannot downgrade due to new plan limits exceeded.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Business rules: plan limits (member count, storage, API calls), trial period, grace period for overdue payment?
- Boundary values: max file size, max record count, API timeout, trial length?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Multi-tenancy: data isolation between tenants, noisy neighbor protection?
- Target metrics: TTFB (Time to First Byte), API latency (p95), uptime?
- Scaling: expected tenant count, users per tenant, concurrent editors?

### Mandatory NFR categories for SaaS
- **Performance:** API latency < 200ms (p95), TTFB < 500ms, page load < 3s.
- **Scalability:** horizontal scaling, tenant isolation, noisy neighbor prevention.
- **Security:** SOC 2 Type II compliance, data encryption at-rest (AES-256) and in-transit (TLS 1.2+), SSO/SAML support.
- **Availability:** SLA 99.9% (standard), 99.95% (enterprise), status page.
- **Data residency:** storage region selection (EU, US, APAC).
- **Backup:** RPO < 1 hour, RTO < 4 hours, point-in-time recovery.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Multi-tenancy: tenant_id as a mandatory field in all entities?
- Soft delete: which entities support recovery (trash/archive)?

### Mandatory entities for SaaS
- **Organization / Workspace** — tenant: name, plan, settings, limits.
- **User** — user: email, role, status, organization membership.
- **Membership** — user ↔ organization link: role, permissions, invitation date.
- **Subscription** — subscription: plan, status, period, billing provider ID.
- **Plan** — pricing plan: name, limits, price, features.
- **Invoice** — invoice: amount, status, period, PDF.
- **AuditLog** — action log: event, actor, timestamp, tenant_id.
- **Integration** — connected integrations: type, credentials (encrypted), status.
- **ApiKey** — API keys: hash, scopes, last used, expiry.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Public API: needed for third-party integrations? Rate limiting policy?
- Webhook contracts: events for API subscribers (resource created/updated/deleted)?
- Authentication: API Key for machine-to-machine, OAuth2 for users, SAML/OIDC for SSO?

### Typical endpoint groups
- Auth (registration, login, SSO, API keys).
- Organizations (CRUD, members, settings).
- Core resources (depends on product).
- Billing (plans, subscriptions, invoices).
- Integrations (connection, configuration, webhooks).
- Admin (superadmin: tenants, metrics, feature flags).
- Webhooks (outgoing events for subscribers).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: dashboard, main workspace screen, workspace settings, billing, member invitation?
- Specific states: trial expired, plan limit reached, account suspended, empty workspace?

### Typical screens
- Onboarding (workspace creation, guided setup, team invitation).
- Dashboard (activity overview, key metrics, quick actions).
- Main workspace screen (depends on product).
- Workspace settings (general, members, roles, integrations).
- Billing (current plan, usage, invoices, upgrade/downgrade).
- User profile (data, security, notifications).
- Superadmin (tenants, metrics, feature flags).

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| MRR | Monthly Recurring Revenue |
| ARR | Annual Recurring Revenue |
| NRR | Net Revenue Retention — including upsell and churn |
| CAC | Customer Acquisition Cost |
| LTV | Lifetime Value — total revenue from a customer |
| Churn rate | Customer attrition rate |
| FTUE | First Time User Experience |
| Multi-tenancy | Architecture with data isolation between customers |
| SSO | Single Sign-On |
| SAML | Security Assertion Markup Language — SSO protocol |
| OIDC | OpenID Connect — authentication protocol over OAuth2 |
| RBAC | Role-Based Access Control |
| SOC 2 | Service Organization Control 2 — security audit standard for SaaS |
| TTFB | Time to First Byte |
| Noisy neighbor | One tenant affecting another's performance |
| Feature flag | Mechanism to enable/disable functionality without deployment |
| Freemium | Monetization model: free base plan + paid upgrades |
| Per-seat pricing | Pricing model: payment per user |
