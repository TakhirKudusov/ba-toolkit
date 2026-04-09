# Domain Reference: GovTech

Domain-specific knowledge for GovTech projects: citizen-facing e-services, permits and licensing, public records and FOIA, tax and benefits, identity and digital wallet, public-procurement (eProcurement), municipal 311 and case management, court and justice systems, voter and elections services.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Service type: citizen-facing portal, permit / licence application, tax filing, benefits eligibility, public records request, 311 / non-emergency service request, court e-filing, vendor / procurement portal, internal case-management for caseworkers?
- Level of government: national / federal, state / regional, municipal / city, agency-internal?
- Buyer vs. user: who funds the project (agency, ministry, council) vs. who uses it (citizen, caseworker, vendor)?
- Identity scheme: national digital ID (e.g. Login.gov, BankID, ItsMe, Aadhaar, eIDAS-recognised national eID), agency-issued credential, or self-asserted account?
- Languages: which official languages must be supported at launch (often legally mandated)?
- Procurement vehicle: internal build, prime contractor, framework agreement, GovTech sandbox?

### Typical business goals
- Reduce time-to-service for citizens (cut processing time from weeks to days/minutes).
- Reduce cost-per-transaction vs. paper / counter / phone channels.
- Increase digital channel adoption (move citizens off paper and counters).
- Reduce caseworker manual effort and processing backlog.
- Improve service satisfaction (customer-effort score, citizen NPS).
- Meet legislated digital-service targets (e.g. EU SDG single digital gateway, US 21st Century IDEA Act, UK GDS service standard).

### Typical risks
- Legacy mainframe / system-of-record integration (COBOL, AS/400, custom XML over SOAP) — slow, expensive, fragile.
- Procurement and approval cycles measured in years, not months.
- Heightened press / political scrutiny on launch failures.
- Accessibility lawsuits (Section 508, WCAG 2.1 AA, EN 301 549) — strict and frequent in the public sector.
- Data residency and sovereignty: many jurisdictions ban sending citizen data abroad.
- Equity of access — must work on old phones, low bandwidth, with limited literacy, and on assistive tech.
- Audit, FOIA, and records-retention obligations apply to every transaction.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: citizen, authenticated resident, business representative, caseworker, supervisor, agency administrator, auditor, FOIA officer, third-party API consumer?
- Identity proofing level: NIST IAL1 (self-asserted), IAL2 (remote identity-proofed), IAL3 (in-person verified)? Authentication assurance level (AAL1/2/3)?
- Multi-tenancy across agencies: shared platform, agency-isolated, cross-agency single sign-on?
- Legacy integration: which systems of record (tax, benefits, vital records, land registry, criminal-justice information system) must be read or written, and via which protocols (SOAP, REST, fixed-width batch, EDI)?
- Compliance: WCAG 2.1 AA / EN 301 549, FedRAMP, FISMA, StateRAMP, ISO 27001, SOC 2, NIST 800-53, sector-specific (CJIS for justice, IRS Pub 1075 for tax, HIPAA for health-related benefits)?
- Records retention: how long must form submissions, attachments, and audit trails be retained (often 7+ years, sometimes permanently)?

### Typical functional areas
- Identity proofing and authentication (national digital ID broker).
- Citizen account / dashboard ("my services", "my correspondence", "my documents").
- Service catalog and eligibility check.
- Form intake (multi-step, save-and-resume, prefill from system of record).
- Document upload and verification.
- Payment of fees (card, ACH/SEPA, cash voucher at counter or post office).
- Caseworker queue and case management.
- Decision letters and outbound correspondence (digital + postal).
- Public records / FOIA request handling.
- Audit log and records retention.
- Reporting for agency leadership and oversight bodies.
- Notifications (email, SMS, postal letter for unbanked / unconnected citizens).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical citizen flows: discover service, check eligibility, sign in, fill multi-step form, upload documents, pay fee, receive decision, appeal a decision?
- Critical caseworker flows: pick up case from queue, request more information, approve / deny, escalate to supervisor, archive?
- Edge cases: incomplete application after 30 days, expired identity proof, payment refund, lost decision letter, FOIA disclosure with redaction, citizen requests records about themselves?
- Personas: tech-confident citizen, citizen with low digital literacy, citizen using assistive tech, business representative filing on behalf of a company, caseworker, FOIA officer, auditor.

### Typical epics
- Sign-in via national digital ID.
- Citizen dashboard ("my services").
- Service discovery and eligibility check.
- Application intake (multi-step form with save-and-resume).
- Document verification.
- Fee payment.
- Caseworker queue and decision-making.
- Outbound correspondence (digital + postal hybrid).
- Public records / FOIA.
- Appeals and grievances.
- Audit log and records retention.
- Reporting and oversight.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: identity proof fails, payment declines, citizen abandons mid-form, caseworker requests extra documents, supervisor overrides denial, system-of-record write fails after fee was charged?
- System actors: national digital ID broker, payment processor, system of record (tax, benefits, vital records), postal hybrid mail provider, geocoder / address validator, document verification service, FOIA workflow system?

### Typical exceptional flows
- Identity proofing fails (KBA / liveness / document check) — fallback to in-person counter.
- Citizen has no digital identity — alternative paper or phone channel must remain available.
- Payment declined — resume application in "fee due" status, do not lose form data.
- Save-and-resume token expires — citizen must re-authenticate but data is preserved.
- System of record returns an error after the fee is charged — automatic refund and incident ticket.
- Caseworker decision is appealed — case re-opens with new SLA clock.
- Records-retention period elapses — automated archival or destruction per schedule.
- FOIA disclosure with PII redaction — redaction queue + reviewer sign-off.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Business rules: eligibility criteria per service, document validity periods, fee schedules, statutory processing time limits, appeal windows?
- Boundary values: max attachment size, max number of attachments, session timeout (often regulated, e.g. 15-min idle for IRS Pub 1075), form completion deadline?
- Accessibility AC: WCAG 2.1 AA conformance per page, EN 301 549 conformance for EU public sector, screen-reader announcements for form errors, keyboard-only navigation, plain-language reading level (often grade 6–8 mandated)?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Concurrency: peak load on tax-filing day, benefits-application opening day, election registration deadline (10–100× steady state)?
- Channel parity: any service offered online must remain available via paper / phone — what is the legal requirement?
- Data residency / sovereignty: must all citizen data stay within national borders? Cloud region restrictions?
- Disaster recovery: RTO/RPO targets dictated by statute or oversight body?
- Plain language: maximum reading-grade level (often 6–8) enforced by guideline?

### Mandatory NFR categories for GovTech
- **Performance:** form pages < 2s on a 3G connection; system-of-record write < 5s (p95); search < 1s.
- **Scalability:** handle the deadline-day spike (e.g. tax day, FAFSA opening, election registration cutoff) without queueing citizens out.
- **Availability:** 99.9% during published service hours; planned maintenance restricted to off-hours; status page mandatory for citizen services; outage alerts via the agency comms channel.
- **Security:** FedRAMP Moderate (US federal) / StateRAMP / ISO 27001 / NIST 800-53 controls; encryption at rest and in transit; audit log of every form submission, decision, and access to PII; multi-factor authentication for caseworkers; sector controls (CJIS, IRS Pub 1075, HIPAA) where applicable.
- **Privacy:** Privacy Impact Assessment on file; minimal data collection; right of access and right of correction; explicit consent for any secondary use; PII is encrypted and logged on access.
- **Accessibility:** WCAG 2.1 AA mandatory; EN 301 549 for EU public sector; Section 508 conformance for US federal; tested with assistive tech (NVDA, JAWS, VoiceOver, Dragon).
- **Plain language:** target reading grade 6–8; multi-language coverage of all official languages; avoidance of jargon and acronyms.
- **Records retention:** retention schedule per record type (often 7+ years; permanent for some categories); legal hold flag freezes deletion; FOIA-ready export.
- **Data residency:** all citizen data stored in the relevant jurisdiction; cloud region locked.
- **Backup:** RPO < 15 min for transactional state, RTO < 4 hours; offsite backup; tested DR runbook.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Multi-tenancy by agency: agency_id on every entity?
- PII categorisation: which fields are SSN / national ID / DOB / address — and how are they protected (encryption, tokenisation, masked in UI)?
- Records-retention metadata: every record has a retention class, retention start, scheduled disposal date?
- Audit trail: every read of PII is logged with actor, reason, timestamp?

### Mandatory entities for GovTech
- **Citizen** — identity-proofed natural person: name, date of birth, national ID (encrypted), verified address.
- **Account** — login account: link to Citizen, identity assurance level, MFA enrolment, last sign-in.
- **Service** — service catalog entry: title, agency, eligibility criteria, fee schedule.
- **Application** — submitted form instance: service, citizen, status, submission timestamp, fee paid.
- **FormPage** — multi-step form state: application, page, answers (versioned for save-and-resume).
- **Document** — uploaded attachment: application, type, file hash, virus-scan status, retention class.
- **Payment** — fee transaction: application, amount, channel (card, ACH/SEPA, voucher), provider reference.
- **Case** — caseworker workflow item: application, assigned caseworker, status, SLA clock.
- **Decision** — outcome: case, decision (approve / deny / request more info), reason, decision date, appealable until.
- **Correspondence** — outbound message: case, channel (digital, postal, both), template, sent_at, delivery status.
- **Caseworker** — internal staff: agency, role, MFA status, security clearance level if applicable.
- **AuditLog** — append-only record: actor, action, target, timestamp, IP, reason (mandatory for PII reads).
- **RecordsHold** — legal hold marker: entity, hold reason, hold date, lifted_at.
- **FoiaRequest** — public records request: requester, scope, status, redacted disclosure document, decision date.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Identity broker integration: SAML 2.0 / OIDC against the national digital ID provider — which assurance levels and claims?
- System-of-record APIs: SOAP / REST / batch — what authentication (mTLS, signed JWT, IP allow-list)?
- Public APIs for civic-tech developers: open by default vs. registered keys?
- Webhook outputs for status changes ("application submitted", "decision issued") to other agency systems?
- Open-data exports (CSV / JSON / GeoJSON) for transparency and oversight?

### Typical endpoint groups
- Auth (national digital ID broker callback, MFA enrolment, session refresh).
- Citizen profile (read, update verified attributes, consent management).
- Services (catalog, eligibility check).
- Applications (start, save, submit, list mine, list mine in progress).
- Documents (upload, virus-scan status, redact, download).
- Payments (initiate, callback, refund, receipt).
- Cases (caseworker queue, assign, decide, escalate).
- Correspondence (templates, send, status).
- Audit (read by auditor / oversight role only).
- FOIA (intake, status, disclosure download).
- Open data (anonymised statistics, machine-readable).
- Webhooks (outgoing events to other agency systems).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: service discovery, eligibility check, sign-in via national ID, multi-step form with save-and-resume, document upload, fee payment, application status, decision letter view, appeal form, caseworker queue, caseworker decision form?
- Specific states: identity proofing failed, save-and-resume token expired, payment failed, application incomplete after N days, decision pending appeal, redacted FOIA disclosure?
- Plain-language and accessibility states: large-text mode, high-contrast mode, screen-reader announcements for form errors, language switcher prominently placed?

### Typical screens
- Service catalog (browse and search by life event: "having a baby", "moving house", "starting a business").
- Eligibility check (short pre-form to filter ineligible applicants out before identity proofing).
- Sign-in / identity proofing flow (national ID broker handoff, fallback to in-person).
- Citizen dashboard (in-progress applications, recent decisions, correspondence inbox).
- Multi-step form (progress indicator, save-and-resume, plain-language help, inline error messages).
- Document upload (drag-and-drop, list of accepted types, virus-scan progress).
- Fee payment (channel choice, receipt).
- Application status (timeline with statutory SLA clock).
- Decision letter (digital copy, postal copy mailed, appeal button if applicable).
- Appeal form (separate flow with its own SLA).
- Caseworker queue (filter by status, SLA, priority; bulk-assign).
- Caseworker decision form (read-only application, decision options, reason text, supervisor escalation).
- Audit screen (read-only, restricted to auditor role).
- FOIA intake (public form, no sign-in required).
- Public service status page.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| FedRAMP | US federal cloud-security authorisation programme |
| StateRAMP | US state-level analogue of FedRAMP |
| FISMA | Federal Information Security Modernization Act (US) |
| NIST 800-53 | US federal security and privacy controls catalog |
| CJIS | Criminal Justice Information Services security policy (FBI) |
| IRS Pub 1075 | US IRS rules for handling federal tax information |
| eIDAS | EU regulation on electronic identification and trust services |
| SDG | Single Digital Gateway (EU) — single point of access for cross-border services |
| GDS | UK Government Digital Service — sets the UK service standard |
| 21st Century IDEA Act | US law mandating digital service modernisation |
| EN 301 549 | EU public-sector accessibility standard |
| WCAG 2.1 AA | Web Content Accessibility Guidelines, level AA |
| Section 508 | US federal accessibility law for ICT |
| Login.gov | US federal shared sign-in service |
| BankID | Nordic national digital ID scheme |
| ItsMe | Belgian national digital ID |
| Aadhaar | Indian national digital ID |
| IAL / AAL | NIST identity-assurance and authentication-assurance levels |
| KBA | Knowledge-Based Authentication |
| FOIA | Freedom of Information Act — public records request regime |
| Privacy Impact Assessment (PIA) | Mandatory privacy review of any system that processes PII |
| Records retention schedule | Legally mandated table of how long each record class must be kept |
| Legal hold | Marker that freezes deletion of records subject to litigation or audit |
| Plain language | Mandated writing standard targeting reading grade 6–8 |
| Hybrid mail | Postal letter generated digitally and printed by a contracted provider |
| 311 | Non-emergency municipal service request channel (US) |
| eFiling | Electronic submission of court documents |
| eProcurement | Public-sector vendor and bid management |
