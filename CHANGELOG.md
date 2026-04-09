# Changelog

All notable changes to BA Toolkit are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [3.8.0] — 2026-04-10

### Highlights

- **Group C skill audit pass on `/discovery`, `/principles`, `/research`, `/handoff`, `/implement-plan`, `/export`** — the bookend skills (entry, conventions, technology research, exit) brought to senior-BA rigour. ~26 Critical + High findings applied. Highlights: full Michael Nygard ADR format with Drivers / Alternatives / Decision Date for `/research`, expanded `/handoff` artifact inventory covering all 15 pipeline stages plus cross-cutting tools, formal Sign-off section for `/handoff`, principles Definition of Ready section synchronised with the v3.5.0+ template fields across every artifact type, new ISO/IEC 25010 alignment in the principles NFR baseline, new Testing Strategy section in `/principles` (the principled approach to TDD that resolves the batch 6 item 2 question), new Hypotheses → Brief Goals retrospective traceability in `/discovery`, observability + CI/CD + secret management slots in `/implement-plan`, and full v3.5.0+ stories template field support in `/export` (Persona / Business Value Score / Depends on / INVEST embedded in exported issues with full FR/UC/AC/NFR/WF traceability columns). After this pass, **22 of 24 shipped skills** carry the senior-BA improvements.

### Changed

- **`skills/principles/SKILL.md` and `skills/references/templates/principles-template.md`** — biggest debt of the audit because `/principles` is the source of truth that downstream skills read for Definition of Ready, ID conventions, and quality gates. The DoR section had drifted out of sync with the v3.5.0+ template fields across every artifact type:
  - **Definition of Ready (§4) rewritten** to mirror the v3.7.0+ baseline per artifact type. Every DoR checklist now requires the same fields the artifact templates carry: FR adds Source / Verification / Rationale / area-grouping; US adds Persona / Business Value Score / Size / Depends on / INVEST self-check; UC adds Goal in Context / Scope / Stakeholders & Interests / Source / Success vs Minimal Guarantees split; AC adds Source / Verification / Linked NFR; NFR adds ISO 25010 characteristic / Acceptance threshold / Source / Rationale; Entity adds Source / Owner / Sensitivity / state machine for stateful entities; Endpoint adds Source / Idempotency / Required scope / SLO / Verification; Wireframe adds Source / Linked AC / Linked NFR / canonical 8-state list (was 4 states). New artifact types added: Risk DoR (Probability / Impact / Velocity / Treatment Strategy / Owner / Review cadence per ISO 31000) and Implementation Task DoR (references / dependsOn validity / definitionOfDone with linked AC).
  - **ID Conventions table (§2) extended** with the post-v3.5.0 entity types that were previously missing: Risks (`RISK-NN`), Sprints (`SP-NN`), Implementation Tasks (`T-NN-NNN`), Analyse findings (`A-NN`), and Brief Goals (`G-N`).
  - **NFR Baseline (§5) aligned with ISO/IEC 25010**. The three previously-listed categories (Security, Availability, Compliance) were ad-hoc; the new section explicitly maps every category to the parent ISO 25010 characteristic and lists the other 5 characteristics as candidate additions with one-line guidance on when each becomes mandatory.
  - **New §8 Testing Strategy section** with five canonical strategies (TDD / Tests-after / Integration-only / Manual-only / None) and explicit guidance on which one drives `/implement-plan` to embed "Tests to write first" blocks per task. **This is the principled resolution of the batch 6 item 2 question** — TDD support lives in `/principles`, not as a separate `/tdd-tests` skill, exactly as the rationale recorded in `todo.md` "Removed from the backlog" predicted.
  - **New §9 Code Review and Branching** section (trunk-based / GitHub flow / GitFlow / required reviewers / merge gate) and **new §10 Stakeholder Decision Authority** table (per-section decision authority by name and role).
  - **3 new required-topics** in the SKILL.md interview: testing strategy, stakeholder decision authority, code review and branching policy.
  - **Document-control metadata added**: `Status` field plus `Approvals` table at the bottom.
- **`skills/discovery/SKILL.md` and `skills/references/templates/discovery-template.md`** — retrospective traceability and decision provenance:
  - **New §9 Hypotheses → Brief Goals mapping table** filled in by `/brief` when it consumes the discovery artifact. Forward traceability from each discovery hypothesis to the Brief goal it became, with a Status column (Validated / Refined / Disproved / Pending) so a 3-month-post-launch retrospective can answer "did the chosen audience hypothesis hold?" and "did the predicted MVP features actually drive adoption?".
  - **`Decision date`** and **`Decision owner`** fields in the header so the recommendation moment is timestamped and attributable.
  - **`Status` field** (Concept (pre-brief) / In Review / Locked) and **`Approvals` table** for the cases where the discovery artifact is signed off as a decision document.
- **`skills/research/SKILL.md` and `skills/references/templates/research-template.md`** — full Michael Nygard ADR format + downstream-consumer awareness:
  - **Standard alignment with the Michael Nygard ADR format** (the de facto industry standard since 2011), extended with explicit **Drivers** field (what forced the decision — FRs, NFRs, regulatory, cost, time-to-market) and **Alternatives Considered** table with a `Disqualifying factor` column. Every ADR carries Status, Proposal date, Decision date, Decision owner, Drivers, Context, Alternatives Considered, Decision, Consequences (positive / negative / neutral) — the field set a senior architect would expect on a serious project.
  - **`/implement-plan` integration** documented explicitly. The output of `/research` is the primary tech-stack source for `/implement-plan` (added in v3.4.0); the new Tech Stack Summary table at the bottom of the research artifact is read directly by `/implement-plan` to populate its header without re-asking the calibration interview.
  - **Required-topics list extended from 6 to 14**. Added the explicit tech-stack slots `/implement-plan` consumes: Frontend stack, Backend stack, Database, Hosting / deployment target, Auth / identity, Observability platform. Added Build vs Buy and Open-source vs Proprietary tolerance as common BA inquiries.
  - **New NFR → ADR traceability matrix** at the bottom flags Must NFRs without an architectural decision.
  - **Document-control metadata added** (Version / Status).
- **`skills/handoff/SKILL.md` and `skills/references/templates/handoff-template.md`** — full pipeline coverage and formal sign-off:
  - **Artifact Inventory expanded from 11 rows to 21 rows** (15 pipeline-stage rows + 6 cross-cutting tool rows). Was missing /discovery (stage 0), /principles (stage 0a), /implement-plan (stage 12), and every cross-cutting artifact (sprint, risk, glossary, trace, analyze, estimate). The inventory is now the canonical "what's in the package" reference for the dev team.
  - **Traceability Coverage expanded from 7 chains to 11 chains** to reflect the new traceability matrices added in pilot / Group A / Group B: Brief Goal → FR (added in v3.5.0 SRS template), US → AC broken down by Positive / Negative / Boundary type, FR → NFR, FR → Entity, FR → Endpoint, US → WF, US → Scenario, FR → Implementation Task, NFR → ADR.
  - **New §7 Architecture Decision Summary** lists the top ADRs from `/research` with their drivers and which `/implement-plan` phase they affect — so the dev team learns the architectural decisions without having to read `/research` separately.
  - **New §9 Sign-off section** with a formal acceptance table (Business Analyst / Product Manager / Tech Lead / QA Lead / Stakeholder). Senior BA expectation: handoff is the formal acceptance step and needs an explicit sign-off flow with named approvers.
  - **Document-control metadata added** (Version / Status). Same P1 pattern as the rest of the audit.
- **`skills/implement-plan/SKILL.md`** — extended Tech Stack with operational slots, risk-aware sequencing within phases:
  - **Tech Stack table extended from 6 rows to 9 rows.** Added: **Observability** (logging / metrics / tracing platform — Datadog / New Relic / Grafana / OTel), **CI / CD** (GitHub Actions / GitLab CI / CircleCI / Jenkins), **Secret management** (env vars / Vault / Secrets Manager / Doppler / 1Password CLI). Without these slots, the AI coding agent has to invent operational choices on the fly.
  - **Calibration interview extended from 6 to 9 questions** to cover the same three new slots when `/research` is missing.
  - **Risk-aware sequencing within phases** is now explicit. Tasks whose `references` link to FRs / US / NFRs tied to a 🔴 Critical or 🟡 High risk in `00_risks_*.md` are pulled to the front of their phase, ahead of equally-prioritised tasks. Tagged with `**Risk:** RISK-NN ↑` next to the task title. Rationale: validate risky bets early when there's still time to pivot. Was generic "ordered by dependencies, then priority"; now also "then by risk elevation".
- **`skills/export/SKILL.md`** — interview-protocol compliance, v3.5.0+ stories template field support, full traceability in exports:
  - **Format interview now follows the standard interview protocol** — table-based options, Recommended marker, inline-context support per protocol rule 9. Was a flat numbered question list that bypassed the protocol.
  - **Exported issues now carry every v3.5.0+ stories template field**: Persona (named persona with role + context, not bare job title), Business Value Score, Size, Depends on (rendered as "Blocked by" link in trackers that support it), INVEST self-check. Trackers with custom field support (Jira, Linear) get them as separate fields; CSV gets extra columns; GitHub Issues embeds them in the issue body since GitHub has no custom-field surface.
  - **Full cross-artifact traceability in exported issues**: Linked FR, Linked UC, Linked AC (per scenario, with their `AC-NNN-NN` IDs), Linked NFR (for performance- and security-relevant stories), Linked Wireframe. Was previously only `FR Reference`. Modern issue trackers can re-establish the traceability graph without re-reading the source artifacts.
  - **CSV format expanded from 10 columns to 17** to carry the new fields (Persona, Value, Size, FR, UC, AC list, NFR, WF, Depends on, AC Summary).

### Cross-pattern impact

After the pilot, Group A, Group B, and Group C audits, **22 of 24 shipped skills** carry the senior-BA improvements: standards conformance to canonical frameworks (BABOK v3, IEEE 830, ISO 25010, ISO 31000, ISO 1087-1, OpenAPI 3.x, Cockburn use cases, INVEST, MoSCoW, PMBOK 7, Cone of Uncertainty, Michael Nygard ADRs), explicit "why" / provenance / ownership fields on every artifact element, cross-artifact bidirectional traceability with severity-aware coverage gaps, document control with versions and approvers, single-source-of-truth templates with no inline drift, and BA-grade required-topics coverage. The two skills not yet audited are `/publish` (a thin CLI wrapper with nothing structural to audit) and `/clarify` (already audited in Group B). The skill audit rollout is functionally complete.

---

## [3.7.0] — 2026-04-10

### Highlights

- **Group B skill audit pass on `/trace`, `/analyze`, `/clarify`, `/estimate`, `/glossary`, `/risk`, `/sprint`** — 7 cross-cutting utilities brought to senior-BA rigour. ~33 Critical + High findings applied. Highlights: full ISO 31000 + PMBOK 7 alignment for `/risk` (Velocity axis, treatment-strategy classification), Cone of Uncertainty + confidence bands for `/estimate`, IEEE 830 §4.3 quality attributes mapped to `/analyze` finding categories, definition-quality discipline (Aristotelian form) for `/glossary`, structured table output for `/clarify`, bidirectional traceability + `/implement-plan` integration for `/trace`, focus-factor + ceremonies-aware net velocity for `/sprint`. Two utility templates (`risk-template.md`, `sprint-template.md`) rewritten from concrete Nova Analytics worked examples back to placeholder convention to match the other 19 templates.

### Changed

- **`skills/trace/SKILL.md` and `skills/references/templates/trace-template.md`** — bidirectional traceability + `/implement-plan` integration:
  - Inline template removed; standalone is the single source of truth (drift fix — inline had 8 columns, standalone had 11; mismatched column sets).
  - **Bidirectional traceability is now the default.** Forward (FR → downstream) catches "what does this requirement become?"; reverse (US/UC/AC/NFR/Entity/API/WF/SC/Task → FR) catches "why does this artifact exist?". Senior BA needs both directions to validate provenance.
  - **`/implement-plan` integration.** The matrix now includes a `Task` column populated from `12_implplan_*.md` (introduced in v3.4.0). The chain is now `FR → US → UC → AC → NFR → Entity → ADR → API → WF → SC → Task`.
  - **Calibration interview added** (was generation-only): direction (forward / reverse / bidirectional, default bidirectional), scope, severity-thresholds source.
  - **Coverage Gaps now grouped by severity** (🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low) read from `00_principles_*.md` §3 instead of just listing orphans flat.
- **`skills/analyze/SKILL.md` and `skills/references/templates/analyze-template.md`** — IEEE 830 alignment + Owner column + delta mode:
  - **Finding categories expanded from 5 to 8** and explicitly mapped to **IEEE 830 §4.3 SRS quality attributes**: Duplication (consistency), Ambiguity (unambiguous, including modal-verb confusion), Coverage Gap (complete + traceable), Terminology Drift (consistent), Invalid Reference (traceable), **Inconsistency** (same fact stated differently across artifacts), **Underspecified Source** (post-v3.5.0 provenance discipline — FR/UC/AC/Entity/Endpoint missing the `Source` field), **Stakeholder Validation Gap** (post-v3.5.0 assumption discipline — assumptions without Owner or past Validate by date).
  - **Owner column added** to every finding. Senior BAs always assign accountability — a finding with no owner doesn't get fixed.
  - **Calibration interview added**: severity threshold source, categories to include, delta mode (only new findings since the last `/analyze` run).
- **`skills/clarify/SKILL.md`** — extended ambiguity catalogue + structured table output + ripple-effect handling:
  - **Ambiguity categories expanded from 6 to 11.** Added: Quantification gaps (numbers without units, frequencies without windows), Time-zone gaps (timestamps without TZ), Currency gaps (amounts without currency), Scale gaps ("users" without specifying CCU/registered/MAU/DAU), Modal verb confusion (must / shall / should / may inconsistency per IEEE 830).
  - **Output format changed from numbered list to structured table** with columns `# | Location | Category | Question | Answer`. The user can answer in-place by filling the rightmost column or defer with `(deferred)`.
  - **Ripple-effect check added.** Before saving, the skill identifies any answer that affects other artifacts (e.g., a new role propagates from `/srs` to `/stories` personas, `/usecases` actors, `/scenarios` personas) and offers to update each affected file via `/revise`. Was previously a single sentence buried in step 2.
- **`skills/estimate/SKILL.md`** — Cone of Uncertainty + confidence bands + planning poker honesty:
  - **Cone of Uncertainty discipline.** Calibration question 5 asks the estimation phase (Discovery / Brief / SRS / AC / Wireframes / Implementation Plan) and emits the confidence band that matches the standard variance for that phase: ±400% / ±100% / ±50% / ±25% / ±10%. Every estimate now carries a confidence label (Order of magnitude / ROM / Budget / Definitive / Control). Single-point estimates without a confidence band are misread as commitments — the Cone discipline prevents this.
  - **Risk multiplier and tech-debt allocation added** as calibration questions. Stories linked to 🔴 Critical risks default to +20%; tech-debt reservation defaults to 20% of velocity.
  - **Planning poker honesty.** New section "Estimation discipline — what this skill is and is not" makes explicit that this is an analytical single-estimator pass, not a team commitment, and recommends running planning poker with the dev team using these numbers as the starting anchor. Senior BAs never confuse an analytical estimate with a team commit.
  - **Estimation Summary table** now carries the confidence band per story, the risk-adjusted total, the tech-debt reservation, and the net feature capacity — not just a flat SP total that hides the assumptions.
- **`skills/glossary/SKILL.md`** — Aristotelian definition discipline + ISO 1087-1 alignment + extended sources:
  - **Standard alignment with ISO 1087-1** (Terminology Work — Vocabulary). Definitions follow the **Aristotelian form**: genus + differentia + purpose. The skill rejects circular definitions ("a User is a user of the system"), self-referential definitions, definitions that name features without identifying the genus, and definitions that name the genus without distinguishing from siblings.
  - **New Step 2b — Definition quality check.** Walks every term in the glossary, classifies definitions as Circular / Self-referential / Missing genus / Missing differentia, and lists weak definitions in a sub-section of the drift report with a recommended rewrite. Senior BAs catch this on every glossary review.
  - **Sources expanded** to include `00_discovery_*.md` (concept terms), `00_principles_*.md` (convention names), and `12_implplan_*.md` (phase names, technology choices). 12 source files → 14.
  - **Drift report now requires a justification** for the canonical name choice — not just "Customer" but "Customer because it appears earliest, most frequently, and matches the domain reference". Without justification, drift recommendations are arbitrary.
- **`skills/risk/SKILL.md` and `skills/references/templates/risk-template.md`** — full ISO 31000 + PMBOK 7 alignment, Velocity axis, Treatment Strategy classification, calibration interview, document control, placeholder template:
  - **Standard alignment with ISO 31000** (Risk Management — Guidelines) and **PMI PMBOK 7**. Each risk now carries the canonical risk-management fields, not just probability × impact.
  - **Velocity axis added** (Years / Months / Weeks / Days / Immediate). Velocity records how fast the risk materialises once triggered — determines reaction time and whether mitigation has to be in place before the trigger or whether reactive response is enough. P × I alone is insufficient for a senior risk register.
  - **Treatment strategy field added** with the four canonical strategies from PMBOK 7 / ISO 31000: **Avoid** (eliminate the cause), **Reduce / Mitigate** (lower probability or impact), **Transfer** (insurance / vendor / contract), **Accept** (acknowledge and budget). Previous version only documented mitigation + contingency without classifying the strategy.
  - **Review cadence per risk** (Monthly / Quarterly / Ad hoc). Without a cadence, risks become "set and forget" — the canonical failure mode.
  - **Calibration interview added** (was generation-only): risk tolerance (Low / Medium / High), domain-specific frameworks (FAIR for cyber, ISO 14971 for medical, COSO ERM for financial, NIST RMF for US federal), review cadence, treatment-strategy preference.
  - **`risk-template.md` rewritten from a concrete Nova Analytics worked example to placeholder convention** with `[PROJECT_NAME]`, `[Owner]`, `[Velocity]`, etc. Aligns with the other 19 templates that use placeholder syntax. The Nova Analytics example was misread as the canonical content by agents that didn't realise it was a sample.
  - Document-control metadata (`Version`, `Status`) added to the template.
- **`skills/sprint/SKILL.md` and `skills/references/templates/sprint-template.md`** — focus factor + ceremonies-aware net velocity, persona column, dependency awareness, placeholder template:
  - **Net velocity replaces theoretical velocity as the assignment basis.** The skill now distinguishes theoretical velocity (100% capacity) from net velocity, applying focus factor (default 65%), buffer / slack (default 15%), and ceremonies cost (default 1 day per developer per 2-week sprint). Formula: `Net = Theoretical × Focus × (1 − Buffer) − Ceremonies`. Senior scrum masters never schedule against the theoretical number — that's how teams overcommit and miss sprints. Was assigning against raw theoretical velocity.
  - **Calibration interview extended from 6 to 10 questions**: focus factor, buffer / slack, ceremonies overhead, holidays / PTO added.
  - **Persona column added** to every sprint detail table (per the v3.5.0+ stories template). Sprint plans now reflect which personas each sprint serves so the team builds empathy.
  - **Business Value Score and Depends on fields read from the v3.5.0+ stories template** explicitly in the priority-ordering algorithm. Was relying on implicit prerequisites only.
  - **Context loading extended** to read `00_principles_*.md` for team capacity defaults and `00_discovery_*.md` for early MVP signals.
  - **`sprint-template.md` rewritten from a concrete Nova Analytics worked example to placeholder convention** with `[PROJECT_NAME]`, `[Persona]`, etc. The new template carries the net-velocity header, the persona column, the explicit capacity model section, and explicit assumption documentation. Aligns with the other 19 templates.
  - Document-control metadata (`Version`, `Status`) added to the template.

### Cross-pattern impact

After the pilot, Group A, and Group B, **15 of the 24 shipped skills** carry the senior-BA improvements: standards conformance to canonical frameworks (BABOK v3, IEEE 830, ISO 25010, ISO 31000, ISO 1087-1, OpenAPI 3.x, Cockburn use cases, INVEST, MoSCoW, PMBOK 7, Cone of Uncertainty, IEEE 830 §4.3 quality attributes), explicit "why" / provenance fields, cross-artifact forward and reverse traceability, document control, single-source-of-truth templates without inline drift, and BA-grade required-topics coverage. Group C (bookend skills: `/discovery`, `/principles`, `/research`, `/handoff`, `/implement-plan`, `/export`, `/publish`) remains at current rigour and may receive a lighter sweep in a future session.

---

## [3.6.0] — 2026-04-10

### Highlights

- **Group A skill audit pass on `/usecases`, `/ac`, `/nfr`, `/datadict`, `/apicontract`, `/wireframes`, `/scenarios`** — 7 pipeline-core skills brought to the same senior-BA rigour as the v3.5.0 pilot. ~32 Critical + High findings applied. The same six systemic patterns surfaced in the pilot are now fixed across the entire pipeline core: full standards conformance (Cockburn for use cases, ISO 25010 for NFRs, OpenAPI shape for the API contract), explicit "why" fields (Source / Owner / Sensitivity / Verification) on every artifact element, cross-artifact forward-traceability matrices on every shipped artifact, document-control metadata, single-source-of-truth templates with no inline drift, and required-topics lists extended with universal BA inquiries.

### Changed

- **`skills/usecases/SKILL.md` and `skills/references/templates/usecases-template.md`** — full Cockburn alignment:
  - Inline template removed from SKILL.md; the standalone `usecases-template.md` is now the single source of truth (mirror of the same drift fix applied to `/stories` in v3.5.0).
  - Cockburn-mandated fields added to every UC: **Goal in Context** (which Brief goal G-N this UC serves), **Stakeholders and Interests** table (Cockburn discipline — surfaces non-obvious requirements that the primary actor alone misses), **Scope** (system / subsystem / component, distinct from Level), **Source** (which US/FR drove this UC into existence), **Success Guarantees** vs **Minimal Guarantees** (post-conditions split per Cockburn — what's true after success vs what's true after *any* termination including failure).
  - Required-topics list extended from 5 to 8: Goal in Context, Stakeholders and Interests, Scope level added.
  - New US → UC coverage matrix at the bottom of the artifact for forward traceability with `(uncovered)` flagging.
- **`skills/ac/SKILL.md` and `skills/references/templates/ac-template.md`** — explicit AC-NNN-NN ID scheme (drift fix), provenance fields, US → AC coverage matrix:
  - Inline template removed; standalone is the single source of truth. Inline used `### AC-NNN-NN` IDs while standalone used `### Scenario N` without numeric IDs — different ID schemes between the two templates.
  - Every AC carries **Type** (Positive / Negative / Boundary / Performance / Security), **Source** (which business rule from `02_srs_*.md` drove the AC — required, no AC without provenance), **Verification** (Automated test / Manual test / Observed in production), **Linked FR**, and **Linked NFR** (for performance and security ACs).
  - Required-topics list extended from 5 to 9: performance bounds per scenario, idempotency, observability (audit log requirements), state transitions linking AC to entity state machines.
  - New US → AC coverage matrix at the bottom — forward traceability with column per AC type so `Must` stories with no negative or no boundary AC are flagged at glance.
- **`skills/nfr/SKILL.md` and `skills/references/templates/nfr-template.md`** — full ISO/IEC 25010 alignment, FR → NFR matrix:
  - **Standard alignment with ISO/IEC 25010:2011** Software Quality Model — every NFR maps to one of the 8 ISO 25010 characteristics: Functional Suitability, Performance Efficiency, Compatibility, Usability, Reliability, Security, Maintainability, Portability. Project-specific extensions (Compliance, Localisation, Observability) explicitly note their parent ISO characteristic so the audit trail is consistent. Previous version named ad-hoc categories without standard backing.
  - Each NFR template gains an **Acceptance threshold** field separate from the metric — "metric: p95 latency in ms" + "acceptance threshold: < 300ms" — so verification is unambiguous.
  - Required-topics list extended from 6 to 13: ISO 25010 characteristic-by-characteristic walk plus SLO/SLI commitment, observability, disaster recovery runbook, data sovereignty, deprecation policy.
  - New FR → NFR coverage matrix flags Must FRs with no linked Performance / Reliability / Security NFR.
  - New per-characteristic priority summary table at the bottom.
- **`skills/datadict/SKILL.md` and `skills/references/templates/datadict-template.md`** — logical model only, provenance, state machines, FR → Entity matrix:
  - **Scope boundary made explicit:** `/datadict` is the **logical** data model (entities, attributes, conceptual types, relationships, state transitions). Physical schema (specific DBMS, indexes, sharding, partitioning) belongs in `/research` (step 7a) as ADRs. Previous version mixed the two by asking "DBMS choice" as a required topic.
  - Each entity carries **Source** (which FR/US introduced it — required, no entity without provenance), **Owner** (which team curates it), **Sensitivity** (Public / Internal / Confidential / PII / PCI / PHI / Financial — feeds /nfr Security NFRs and GDPR compliance), and a **State Machine** section listing states + legal transitions for any entity with more than two distinct lifecycle states.
  - Required-topics list extended from 6 to 10: PII inventory and retention policy, audit/history requirements, state machines, referential integrity cascade rules, time-zone handling, data ownership.
  - Logical types replace DBMS-specific types (`String / Integer / Decimal / Boolean / Timestamp / UUID / Enum / FK / JSON / Binary` instead of `ObjectId / VARCHAR / NUMERIC`). Physical type mapping happens in `/research`.
  - New FR → Entity coverage matrix at the bottom flags data-touching FRs with no linked entity.
- **`skills/apicontract/SKILL.md` and `skills/references/templates/apicontract-template.md`** — OpenAPI 3.x shape, idempotency, FR → Endpoint matrix:
  - **Standard alignment with OpenAPI 3.x** structure (servers, paths, parameters with `in` location, request body, responses keyed by HTTP status, components/schemas, security schemes). Markdown is the format, OpenAPI is the shape.
  - Per-endpoint metadata table now carries **Source** (FR/US — required), **Required scope** (OAuth2 / JWT scope), **Idempotency** (Idempotent / Not idempotent / Idempotent via `Idempotency-Key` header), per-endpoint **Rate limit**, per-endpoint **SLO** (latency target linked to NFR), and **Verification** method (contract test / consumer-driven contract test / integration test).
  - Required-topics list extended from 7 to 12: idempotency keys, content negotiation, CORS policy, API deprecation policy with `Sunset` header (RFC 8594), per-endpoint SLO.
  - New "Idempotency, CORS, and Deprecation" section in the template documents the cross-cutting policies.
  - New FR → Endpoint coverage matrix flags FRs with no linked endpoint.
- **`skills/wireframes/SKILL.md` and `skills/references/templates/wireframes-template.md`** — canonical 8-state list, accessibility-first, US → WF matrix:
  - **Mandatory state list expanded from 4 to 8** canonical states: Default, Loading, Empty, Loaded, Partial, Success, Error, Disabled. The previous 4-state minimum (default / loading / empty / error) missed half of the states a senior UX BA would catch in review.
  - Each screen carries **Source** (US — required), **Linked AC** (scenarios this screen verifies), **Linked NFR** (performance and accessibility NFRs that apply to UI), and an **Internationalisation** flag (LTR / RTL / both, long-string accommodation).
  - Required-topics list extended from 6 to 8: explicit accessibility level (WCAG 2.1 A / AA / AAA — affects design decisions at wireframe stage, not just NFR time), internationalisation (RTL, long-string accommodation, locale-aware formatting).
  - New US → WF coverage matrix flags Must stories with no linked screen.
- **`skills/scenarios/SKILL.md` and `skills/references/templates/scenarios-template.md`** — drift fix, FR/NFR linking, expanded coverage matrix:
  - Inline template fields and table columns no longer drift from the standalone template. Both now carry the same per-scenario field set.
  - Each scenario carries **Source — Linked FR**, **Source — Linked NFR**, **Frequency** (how often the scenario runs in production — drives test investment), and **Stakes** (cost of failure — data loss, lost revenue, regulatory breach, reputation).
  - Required-topics list extended from 5 to 8: frequency, stakes / blast radius, recovery scenarios.
  - Coverage Summary expanded from 4 columns to 6: User Stories, FRs, NFRs, ACs, API Endpoints, Wireframes — with `(uncovered)` flagging on each axis.
- **Document-control metadata (`Version`, `Status`) added to all 7 templates** — same `Draft / In Review / Approved / Superseded` lifecycle introduced for `/brief` and `/srs` in v3.5.0. Pipeline-core artifacts are controlled documents and need to answer "which version did we agree to?" three months in.

### Cross-pattern impact

After Group A and the pilot, **all 9 currently-shipped pipeline-stage skills** (`/discovery`, `/principles`, `/brief`, `/srs`, `/stories`, `/usecases`, `/ac`, `/nfr`, `/datadict`, `/apicontract`, `/wireframes`, `/scenarios`) carry the six systemic improvements: standards conformance, "why" fields, cross-artifact forward traceability, document control, single-source-of-truth templates, and BA-grade required-topics coverage. Group B (cross-cutting utilities: `/trace`, `/analyze`, `/clarify`, `/estimate`, `/glossary`, `/risk`, `/sprint`) and Group C (bookend skills: `/handoff`, `/implement-plan`, `/export`, `/publish`) remain at their current rigour and may receive a lighter sweep in a future session if patterns repeat.

---

## [3.5.0] — 2026-04-09

### Highlights

- **Pilot skill audit pass on `/brief`, `/srs`, `/stories`** — 14 senior-BA findings (6 Critical + 8 High) applied. Three skills now match the rigour a 25-year BA from a top-tier consultancy would expect: `/brief` separates Constraints from Assumptions and forces an explicit Out of Scope section, `/srs` adds Source / Verification / Rationale per FR plus a Brief-Goal → FR traceability matrix, `/stories` makes INVEST a quality gate and adds Persona / Business Value / Dependencies fields.

### Changed

- **`skills/brief/SKILL.md` and `skills/references/templates/brief-template.md`** — six findings applied:
  - **Section numbering bug fixed** — workflow steps no longer jump from §6 to §8 (renumbered §8 → §7, §9 → §8). Was a sloppiness flag for any reviewer opening the file.
  - **Out of Scope section is now mandatory** — added §4.2 to the artifact template. A brief is a contract; what is excluded matters as much as what is included. Without this, scope creep starts on the first standup.
  - **Constraints and Assumptions split into two sections** (§6 and §7 in the new template). They have different change-management implications and BABOK v3 separates them. Constraints carry `Type / Source / Implication`; Assumptions carry `Statement / Owner / Validate by / Risk if false`.
  - **Required-topics list extended from 7 to 11.** Added the four canonical brief inquiries every senior BA asks: buyer-vs-user separation, decision-making authority (who can sign off, by name and role), regulatory pre-screening (yes/no per regime: GDPR, HIPAA, FDA SaMD, SOC 2, PCI DSS, SOX, KYC/AML, FERPA, COPPA, EU AI Act, accessibility), and explicit failure criteria (asymmetric to success criteria — flushes out red lines).
  - **Document control metadata added to the template** — `Version`, `Status` (Draft / In Review / Approved / Superseded), and an `Approvals` table at the bottom. A brief is a controlled document and needs to answer "which version did we agree to?" three months in.
  - **Stakeholder table gains a "Sign-off authority" column** so the brief records not just who is interested but who has veto power.
- **`skills/srs/SKILL.md` and `skills/references/templates/srs-template.md`** — four findings applied:
  - **FR template gains three IEEE 830-mandated fields:** `Source` (which stakeholder, brief goal, regulatory requirement, or parent FR drove this requirement — required for traceability), `Verification` (Test / Demo / Inspection / Analysis — without it an FR is a wish, not a contract), `Rationale` (*why* this requirement exists, not just *what* — helps future maintainers know what is safe to push back on).
  - **New §7 "Traceability — Brief Goal → FR" table.** Forward traceability from `01_brief_<slug>.md` §2 business goals to the FRs that satisfy them. Every Brief goal must have at least one linked FR; uncovered goals are flagged so they cannot silently disappear from the project.
  - **§3 Functional Requirements is now grouped by feature area** as `### 3.N [Area name]` subsections, each with a reserved FR-ID range (FR-001..099 for area 1, FR-100..199 for area 2, …). New FRs inserted later go into their area's free numbers, not the global tail — IDs stay stable. Was a flat list, which became unreadable for any non-trivial system.
  - **Required-topics list extended from 6 to 11.** Added the five universal SRS inquiries that downstream skills (`/datadict`, `/nfr`, `/apicontract`) inherit gaps from when they're missing: authentication and authorisation model (SSO / SAML / OIDC / RBAC / ABAC / MFA), data ownership and stewardship, audit and logging requirements, data retention and deletion (GDPR right-to-erasure), reporting needs.
- **`skills/stories/SKILL.md` and `skills/references/templates/stories-template.md`** — five findings applied:
  - **SKILL.md inline template removed in favour of a single source of truth at `references/templates/stories-template.md`.** Previously the inline template and the standalone file had drifted apart (the inline version had no `Size:` field and an inline AC reference; the standalone had `Size:` and a file-path AC reference). Two agents reading different parts produced different outputs. The SKILL.md now lists the field set and points at the standalone template; the standalone template is the only place that carries the per-story block layout.
  - **INVEST is now an explicit quality gate.** The template has an `INVEST self-check:` line per story (Independent · Negotiable · Valuable · Estimable · Small · Testable). The `/validate` command description now requires every story to pass INVEST. The `/split` guidance references INVEST's "Small" / "Independent" criteria and Mike Cohn's nine story-splitting patterns instead of the previous arbitrary "more than 3 scenarios" rule.
  - **Persona field replaces bare role.** Stories now use `**As** [Maria, ops supervisor at a 50-warehouse 3PL handling 200 returns/week]` instead of `**As an** admin`. Personas carry goals, frustrations, and context that drive UX decisions; bare job titles do not.
  - **Business Value Score field added** (1–5 or High / Med / Low). Captures relative ranking *within* the same MoSCoW priority tier so a PM can sequence among 30 Must stories instead of treating them as interchangeable.
  - **Depends on field added** so story-to-story dependencies are visible to `/sprint` and `/implement-plan`. A story that can't start until US-007 is done now says so in the template and won't get planned in the wrong sprint.
  - **New "FR → Story coverage matrix" sub-table in the Coverage Summary.** Forward traceability from FR to US, with `(uncovered)` flag for any FR missing a linked story. Was previously a manual cross-reference task.

---

## [3.4.1] — 2026-04-09

### Fixed

- **Content-hygiene audit pass after the v3.4.0 ship.** Five drift / staleness fixes flagged by a cross-file consistency check, all behaviour-neutral:
  - **`skills/references/interview-protocol.md` "When this protocol applies"** — the enumerated list of interview-phase skills had drifted out of sync. `/discovery` (added in v3.2.0 with a literal `### 4. Interview` heading) was missing from the canonical list. Reordered the list to match the actual pipeline order (`discovery → principles → brief → srs → …`) and added `/discovery` to rule 8's "entry-point skills" sub-list alongside `/brief` and `/principles`. Added a follow-up paragraph documenting that `/publish` and `/implement-plan` also follow the protocol via differently-named sections (`### Format selection` and embedded calibration interview inside `### Tech stack resolution` respectively) — the existing `interview-protocol-link` regression test only matches a literal `Interview` heading, so these two skills are not auto-enforced and have to be kept in sync by hand.
  - **`skills/discovery/SKILL.md` domain count** — two locations (the "Domain catalog" paragraph and required-topic 3) said "9 supported domain references" with the pre-v3.3.0 enumeration. Bumped to 12 and added the `edtech`, `govtech`, `ai-ml` references that shipped in v3.3.0.
  - **`skills/wireframes/SKILL.md` closing message** — two places hardcoded "Pipeline complete" against the v3.1.0 single-source-of-truth rule (the `/done` description and the trailing line under "Available commands"). Wireframes is stage 9, not the terminal stage. Replaced with the standard "Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md`" instruction every other pipeline-stage skill uses.
  - **`skills/scenarios/SKILL.md` closing message** — same pattern: hardcoded "Pipeline complete. Proceed to `/handoff`" line that bypassed the lookup table and was logically self-contradictory ("complete" + "proceed"). Replaced with the standard delegation. Existing `closing-message.md` lookup table already had the correct row, so the user-facing behaviour was already right when an AI agent followed the rules — the fix is purely about bringing the SKILL.md text into the same single-source-of-truth pattern.
- **Existing regression tests still pass without modification** — the new `interview-protocol-link`, `closing-message-link`, `Recommended marker`, `5-rows-cap`, frontmatter parser, and skill-folder-count tests all auto-cover the edits since none of them changed the public surface area or the literal patterns the tests look for. 188/188 still green.

---

## [3.4.0] — 2026-04-09

### Added

- **New `/implement-plan` skill — sequenced implementation plan for AI coding agents.** New stage 12 of the BA Toolkit pipeline, runs after `/handoff` and produces `12_implplan_{slug}.md`. Reads every prior pipeline artifact and emits a phase-by-phase plus DAG-by-task plan an AI coding agent (Claude Code, Cursor, Codex) can execute step by step. **Phase ladder** is the canonical 9 phases — Foundation → Data Layer → Auth & Identity → Core Domain → API Surface → UI / Wireframes → Integrations → Quality & NFRs → Validation & Launch Prep — with phases that have no tasks for the current project automatically dropped (e.g. UI for a CLI tool). **Each task** is atomic (30–120 min), has an id `T-<phase>-<seq>`, an imperative title, an explicit `dependsOn` list, at least one `references` id back to the BA artifacts (`FR-NNN`, `US-NNN`, `AC-NNN-NN`, `Entity:Name`, `Endpoint: METHOD /path`, `WF-NNN`, `SC-NNN`), an optional `files` list of paths to create or modify, and a `definitionOfDone` checklist pulled from the linked AC where possible. **Tech stack** is resolved with priority order: (1) parsed from `07a_research_{slug}.md` if `/research` was run; (2) short calibration interview (frontend / backend / database / hosting / auth / mandatory integrations) following the standard interview-protocol rules; (3) `[TBD: <slot>]` placeholder if neither yields a value, with a matching row in the new "Open Assumptions" section telling the AI agent to stop and ask before touching that slot. **Output** carries a Tech Stack header, "How to use this plan (for AI coding agents)" instructions, the per-phase task list, an "Open Assumptions" section, and a Task DAG appendix as a markdown table that a topo-sort can traverse. Per-phase merge on rerun via `/revise [phase]` (mirror of `/sprint`'s per-sprint merge). Includes the standard `/clarify`, `/expand`, `/validate`, `/done` subcommands. AGENTS.md migration: if an existing project predates v3.4 and has no row 12, the skill appends one and reports the migration in its reply.
- **`/handoff` now points at `/implement-plan` as the canonical follow-up.** The handoff template's "Recommended Next Steps" section gains a sixth bullet (run `/implement-plan` to produce a phase-and-DAG plan). The handoff SKILL.md closing-message instruction stops hardcoding "pipeline complete" and instead reads the new row from the lookup table — same single-source-of-truth pattern every other pipeline skill has used since v3.1.0.

### Changed

- **Pipeline lookup table in `skills/references/closing-message.md` extended.** The `/scenarios → /handoff` row now lists `/implement-plan` in its "After that" cell. The previously terminal `/handoff → (none) Pipeline complete` row is replaced with `/handoff → /implement-plan`, and a new terminal `/implement-plan → (none) Pipeline complete` row is added. Pipeline reads top-to-bottom in the table; no other rows changed.
- **`agents-template.md` Pipeline Status table gains row 12 (`/implement-plan`)**. Existing rows 0–11 are untouched, so AGENTS.md files for projects scaffolded under v3.3 and earlier keep working unchanged.
- **Skill count bumped from 23 to 24** in every place that enumerated skills: `package.json` description, `README.md` (badge, intro, install/cursor/windsurf, Pipeline table row 12, Minimum-viable-pipeline section now includes `/implement-plan` in all three paths and bumps the Lean / Full step counts from 9 / 16 to 10 / 17), `COMMANDS.md`, `CLAUDE.md` §1 + §4, `docs/USAGE.md` (interview-phase skill list, time-estimate appendix), `docs/FAQ.md` (new Q/A: "How do I hand the BA pipeline to an AI coding agent so it can actually build the project?"), `bin/ba-toolkit.js` stale comment, and the `test/cli.test.js` skill-folder-count assertion (raised from `>= 23` to `>= 24`).

---

## [3.3.0] — 2026-04-09

### Added

- **Three new domain references — EdTech, GovTech, AI / ML.** The shipped domain catalog grows from 9 to 12 first-class industries, in addition to the `custom` fallback. Each new file (`skills/references/domains/edtech.md`, `govtech.md`, `ai-ml.md`) follows the established 9-section structure (one section per pipeline interview-phase skill: `/brief`, `/srs`, `/stories`, `/usecases`, `/ac`, `/nfr`, `/datadict`, `/apicontract`, `/wireframes`) plus a domain-specific glossary, and matches the depth of the existing references (~250 lines each). New entries appear in the `DOMAINS` array in `bin/ba-toolkit.js`, the `currently:` enumeration in `skills/brief/SKILL.md` and `skills/srs/SKILL.md`, the brief artifact-template `Domain:` line, the README intro / domain-table / badge, and the canonical domain-order rule in `CLAUDE.md` §5. **EdTech** covers K-12 platforms, higher-ed tools, MOOC marketplaces, corporate L&D, language learning, exam prep, and micro-credential platforms — with FERPA / COPPA / GDPR-K / Section 508 / WCAG, LTI / SCORM / xAPI / OneRoster / Clever rostering, and cohort-management mechanics baked in. **GovTech** covers citizen-facing e-services, permits and licensing, tax filing, benefits, public records / FOIA, court e-filing, and 311 — with national-digital-ID brokering (Login.gov / BankID / ItsMe / eIDAS), FedRAMP / StateRAMP / FISMA / CJIS / IRS Pub 1075 / Section 508 / EN 301 549 / plain-language and records-retention obligations. **AI / ML** covers LLM-powered apps, RAG pipelines, agent frameworks, model-serving and inference, fine-tuning, evals, and embedded AI features — with prompt-injection defence, hallucination metrics, eval regressions, model fallback, EU AI Act / NIST AI RMF / ISO 42001 risk classification, cost / token quotas, and RAG / vector-store data modelling. Skills are auto-discovered, so no CLI registration changes are needed beyond the `DOMAINS` array entry.

---

## [3.2.0] — 2026-04-09

### Highlights

- **New `/discovery` skill — concept brain-storm before `/brief`** for users who don't yet know what to build.
- **`ba-toolkit publish` CLI subcommand + `/publish` skill** — one-command Notion (Markdown) and Confluence (HTML) import-ready bundles, zero deps, zero tokens, zero network.

### Added

- **New `ba-toolkit publish` CLI subcommand + `/publish` skill — Notion / Confluence bundle export.** Bundles every BA Toolkit artifact in the current `output/<slug>/` folder into import-ready files for two destinations: a clean Markdown bundle (`publish/notion/`) for Notion's bulk **Import → Markdown & CSV** dialog, and an HTML bundle with an `index.html` entry point (`publish/confluence/`) for Confluence's **Space settings → Content tools → Import → HTML** tool. **Zero API calls, zero tokens, zero network** — the conversion happens entirely on disk and the user does the upload manually using each tool's native importer. Cross-references between artifacts (`[FR-001](02_srs_<slug>.md#fr-001)`) are rewritten per target: Notion gets `./02_srs_<slug>.md#fr-001`, Confluence gets `02_srs_<slug>.html#fr-001`, and external HTTP/HTTPS links pass through unchanged. `AGENTS.md` (if present) is included as the first page in both bundles, with the `<!-- ba-toolkit:begin managed -->` block stripped so the management markers don't render as visible text. Surface: `ba-toolkit publish [--format notion|confluence|both] [--out PATH] [--dry-run]`. Default format is `both`, default output is `./publish/`. Comes with a thin `skills/publish/SKILL.md` discoverability layer that the AI agent invokes via the Bash tool when the user types `/publish` in any supported agent (Claude Code, Codex, Gemini, Cursor, Windsurf).
- **In-tree `markdownToHtml` helper in `bin/ba-toolkit.js`.** Pure function, ~190 lines, handles the bounded Markdown surface used by every shipped artifact template: ATX headings (with auto-generated GitHub-style anchor IDs), paragraphs, bold / italic / inline code with placeholder-based stashing so emphasis inside link labels and code spans round-trips correctly, links, single-level unordered and ordered lists, GFM tables with thead/tbody, fenced code blocks (language hint preserved), blockquotes, horizontal rules, and HTML special-character escaping. Out of scope by design: nested lists, images, footnotes, math, raw HTML pass-through. Exported alongside `htmlEscape`, `slugifyHeading`, `rewriteLinks`, `stripManagedBlock`, `compareArtifactFilenames`, and `ARTIFACT_FILE_RE` so the test suite can cover each piece in isolation.
- **23 new tests covering the publish flow.** 14 unit tests in `test/cli.test.js` for the converter and supporting helpers (one per supported Markdown element class plus link rewriting, managed-block stripping, the `7 < 7a < 8` filename sort, and the artifact-filename regex). 7 integration tests in `test/cli.integration.test.js` that spawn the real CLI against fixture markdown files inside a temp dir and assert the bundle layout, link rewriting in both modes, the Confluence `index.html` ordering, the AGENTS.md-as-first-page rule, the empty-directory error path, the invalid-format error path, and the `--dry-run` no-write contract. The skill-folder-count assertion bumps from `>= 22` to `>= 23` and the existing protocol-link / closing-message / Recommended-marker / 5-rows-cap regression tests auto-cover `skills/publish/SKILL.md`.

- **New `/discovery` skill — concept brain-storm before `/brief`.** For users who arrive with only a vague hunch and no fixed domain or feature list, `/discovery` runs a structured concept-discovery interview (problem space, target audience hypotheses, candidate domains, reference products, MVP feature ideas, differentiation angle, open validation questions) and writes a hypothesis document to `00_discovery_{slug}.md`. The artifact ends with a concrete recommendation (chosen domain, project name, slug, scope hint) that flows directly into `/brief` as inline context. Modeled on `/principles` (the only other optional pre-brief skill) — same workflow phases, same closing-message contract, same interview-protocol rules (5-row cap, Recommended marker, user-language variants). Lives at `skills/discovery/SKILL.md` with a matching artifact template at `skills/references/templates/discovery-template.md`. Pipeline lookup table in `closing-message.md` gains a new row `/discovery → /brief`. The `agents-template.md` Pipeline Status table inserts `/discovery` at stage `0` and demotes `/principles` to stage `0a` (mirror of how `/research` sits at stage `7a`) — `/brief` stays at stage `1`, no downstream renumbering, no risk of breaking existing AGENTS.md files for projects that already started. Skill is auto-discovered by the CLI from the `skills/` directory — no `bin/ba-toolkit.js` registration needed.
- **`/brief` consumes `00_discovery_*.md` if present.** `skills/brief/SKILL.md` Pipeline check phase now loads any existing discovery artifact, extracts the problem space, audience hypotheses, recommended domain, MVP feature hypotheses, and scope hint, and uses them to pre-fill the structured interview per protocol rule 9 — skipping any required topic the discovery already answered. The handoff is real, not a hint to copy-paste context manually.
- **`example/lumen-goods/00_discovery_lumen-goods.md`** — full concept-discovery walkthrough for the Lumen Goods example project. 8 sections matching the new template, length comparable to `00_principles_lumen-goods.md`. Keeps the lumen-goods example end-to-end consistent with the new pipeline entry point.

### Changed

- **Skill count bumped from 22 to 23** in every place that enumerated skills: `package.json` description, `README.md` (badge, intro, install sections, utility table, minimum-viable-pipeline section), `COMMANDS.md` Utility skills table, `CLAUDE.md` §1 and §4, `docs/USAGE.md` (interview-phase skill list, time-estimate appendix, new "Sharing artifacts with stakeholders" section), `docs/FAQ.md` (new Q/A: "How do I share the artifacts with non-developer stakeholders?"), `bin/ba-toolkit.js` stale comment, `skills/references/templates/agents-template.md` Cross-cutting Tools table (new `/publish [format]` row), `skills/references/closing-message.md` Cross-cutting commands list, and the `test/cli.test.js` skill-folder-count assertion (raised from `>= 22` to `>= 23`).
- **Skill count bumped from 21 to 22** in every place that enumerated skills: `package.json` description, `README.md` (badge, intro, install sections, example table, pipeline table, minimum-viable-pipeline section now lists three paths instead of two), `COMMANDS.md`, `CLAUDE.md` §1 and §4, `docs/USAGE.md` (interview-phase skill list, AGENTS.md sample, time-estimate appendix), `docs/FAQ.md` (new Q/A: "What if I don't know what to build yet?"), `bin/ba-toolkit.js` two stale comments, and the `test/cli.test.js` skill-folder-count assertion (raised from `>= 20` with stale "~21" comment to `>= 22`).

---

## [3.1.1] — 2026-04-09

### Changed

- **Interview options table is now capped at 5 rows total** (`skills/references/interview-protocol.md` rule 3). Previously rule 3 allowed "3–5 variants per question" with the free-text "Other" row on top, so a single question could surface up to 6 options and overwhelm the user. The new cap is **up to 4 predefined variants + exactly 1 free-text "Other" row = 5 rows max**, no exceptions. Fewer than 4 predefined rows is still fine when the topic only has 2–3 sensible options. The one-line protocol summary in all 12 interview-phase skills (`brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `apicontract`, `wireframes`, `scenarios`, `research`, `principles`) was updated to match. New regression test in `test/cli.test.js` walks every shipped SKILL.md with an Interview heading and fails if any of them carry the legacy `3–5 domain-appropriate options` wording or omit the new `5 rows max` reminder.
- **Exactly one variant per question is now marked `**Recommended**`** (`skills/references/interview-protocol.md` new rule 10). The AI picks the row using, in priority order, (a) the loaded `references/domains/{domain}.md` for the current skill, (b) the user's prior interview answers, (c) the inline context from rule 9, (d) widely-accepted industry default. The free-text "Other" row is never recommended. If none of (a)–(d) gives a defensible choice the AI omits the marker entirely rather than guessing — a missing recommendation is better than a misleading one. Rendered as `**Recommended**` appended to the end of the `Variant` cell so it stays visible even when the table wraps. Translated together with the variant text per rule 11 (e.g. `**Рекомендуется**`, `**Recomendado**`). All 12 interview-phase SKILL.md summaries point at rule 10. New regression test in `test/cli.test.js` enforces that every Interview-section SKILL.md mentions the marker.
- **Variant text and the `Variant` column header are now rendered in the user's language** (`skills/references/interview-protocol.md` new rule 11), matching the rule the generated artifacts already follow (`skills/brief/SKILL.md:107`). The `ID` column header and the letter IDs (`a`, `b`, …) stay ASCII. Domain reference files in `skills/references/domains/` remain English-only by design (per the project's English-only convention) — the AI translates the variants on the fly when rendering the table for a non-English-speaking user, instead of pasting the English source verbatim or asking the user which language to use. Updated example block in the protocol now shows both an English question with `**Recommended**` and a Russian rendering of the same question to make the rule concrete.
- **Replaced `example/dragon-fortune/` with `example/lumen-goods/`**, a sustainable home-goods D2C e-commerce walkthrough. The new example is more universally relatable than the iGaming-themed predecessor: 15 cross-referenced artifacts (Brief, Principles, SRS, Stories, Use Cases, AC, NFRs, Data Dictionary, Tech Research, API Contract, Wireframes, Scenarios, Risk Register, Sprint Plan, Handoff) for a fictional D2C online store selling lighting, kitchenware, and textiles to eco-conscious EU/UK buyers. Stack covers Next.js storefront, Stripe (cards / Apple Pay / Klarna / SEPA), Stripe Tax for destination-based VAT, hybrid stock sync between an NL warehouse and a UK 3PL, GDPR/DSAR/cookie consent flows, and a paid Lumen Circle loyalty tier. CLAUDE.md "Do NOT touch" entry, the placeholder warning, the repo-layout block, and the README example table all updated to reference `lumen-goods`. The old `example/dragon-fortune/` folder has been removed.

---

## [3.1.0] — 2026-04-09

### Highlights

- **Multi-project in one repo.** `ba-toolkit init` now writes `AGENTS.md` inside `output/<slug>/`, scoped to that project. Two agent windows in the same repo can `cd output/alpha && claude` and `cd output/beta && claude` independently — no AGENTS.md collision, no shared state.
- **Interview options as a 2-column markdown table with letter IDs** (`a`, `b`, `c`, …) instead of a numbered list. Same change cascades through every interview-phase skill via the protocol link.
- **Inline context after slash commands**: `/brief I want to build an online store for construction materials...` is parsed as a lead-in answer; the skill skips redundant questions and jumps straight to what's missing. Works for all 12 interview-phase skills.
- **Open-ended lead-in question** for `/brief` and `/principles` when there's no inline context — `Tell me about the project in your own words` — instead of dumping a structured table on the first turn.
- **Detailed next-step closing block** driven by a 13-row pipeline lookup table in `closing-message.md`, replacing per-skill hardcoded `Next step: /xxx` lines. Locked in by two regression tests.

### Changed

- **Closing message of every skill is now driven by a single source of truth** — `skills/references/closing-message.md` got a full rewrite that includes (a) a richer closing-block format with an `Available commands` table explaining when to use each subcommand, (b) a 4-line `Next step:` block detailing what the next skill produces, the output filename, the time estimate, and what comes after that, and (c) a 13-row pipeline next-step lookup table that every skill reads from instead of hardcoding `Next step: /xxx` in its own SKILL.md. 10 pipeline-phase SKILL.md files (`brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `research`, `apicontract`, `principles`) had their hardcoded `Next step:` lines removed and replaced with an instruction to copy the row from the lookup table. Cross-cutting skills (`/clarify`, `/analyze`, `/trace`, `/estimate`, `/glossary`, `/export`, `/risk`, `/sprint`) keep their per-skill `Available commands` lines but skip the next-step block entirely (as documented in the template). New "If you're stuck" nudge in the closing format suggests `/clarify` and `/validate` for users who don't know what to do next.
- **Two new regression tests in `test/cli.test.js`**: `closing message: every SKILL.md references the closing-message.md template` (mirror of the existing interview-protocol test, walks every shipped SKILL.md and asserts it points at the template) and `closing message: no SKILL.md hardcodes a next-step line` (greps every shipped SKILL.md for a `Next step: /xxx` pattern and fails if any skill ships its own roll-your-own next-step block, which would silently bypass the lookup table). Locks in the rule for future contributors and future skills.

### Added

- **Multi-project support: each `ba-toolkit init` writes `AGENTS.md` inside `output/<slug>/`**, scoped to that project, instead of a single repo-root `AGENTS.md` shared by all projects in the repo. The user opens their AI agent inside the project folder (`cd output/alpha-shop && claude`) — cwd becomes the project root, every skill that looks for `AGENTS.md` or for prior artifacts via `01_brief_*.md` glob sees only that project's files. Two agent windows in the same repo, each `cd`-ed into a different `output/<slug>/`, work on two completely independent projects with zero cross-talk and no shared "active project" pointer to get out of sync. The merge-on-reinit behaviour from v3.0 (managed-block anchors) still applies, just at per-project scope. Closing message of `ba-toolkit init` now points the user at the new `cd output/<slug>` step. Pre-existing repo-root `AGENTS.md` files are never touched by v3.1+ init — covered by an integration regression test. The `skills/references/environment.md` reference file documents both the v3.1+ per-project layout (default) and the legacy v3.0 single-project fallback for backward compat.
- **`bin/ba-toolkit.js` `cmdInit`** now writes `AGENTS.md` to `output/<slug>/AGENTS.md` and updates the closing "Next steps" message to instruct the user to `cd` into the project folder before opening their AI agent. The `mergeAgentsMd` helper is unchanged — the path move alone gives per-project isolation.
- **`skills/brief/SKILL.md` and `skills/srs/SKILL.md`** updated their AGENTS.md handling instructions: skills now find AGENTS.md by checking cwd first, falling back to walking up the tree for legacy v3.0 single-project layouts, and only update the `## Pipeline Status` row for their stage — never recreate the file or add legacy `## Artifacts` / `## Key context` sections that aren't part of the v3.1+ template.
- **Two new integration tests** in `test/cli.integration.test.js`: a `multi-project` test that runs two consecutive `ba-toolkit init` runs with different slugs in the same cwd and asserts that both `output/<slug>/AGENTS.md` files exist independently with the correct project metadata, plus an `init does not touch a pre-existing repo-root AGENTS.md` test that asserts legacy v3.0 root files are preserved byte-for-byte.
- **Interview skills now accept inline context after the slash command** (interview-protocol rule 9). `/brief I want to build an online store for construction materials targeting B2B buyers in LATAM` is parsed as the lead-in answer; the skill acknowledges it once, skips the open-ended lead-in question, and jumps straight to the first structured-table question that the inline text didn't already cover. Works for every interview-phase skill, not just `/brief` — `/srs focus on the payments module first`, `/stories plan the onboarding epic`, `/nfr emphasise security and compliance`, etc. Each scope hint narrows what the skill asks about. All 12 interview SKILL.md files updated with a one-line pointer to rule 9 in their Interview section; the regression test that walks every shipped SKILL.md still passes (it just checks the protocol link, which all 12 already had).
- **Open-ended lead-in question for entry-point skills** (interview-protocol rule 8). When `/brief` (or `/principles` for principles-first projects) is invoked with no inline context and no prior brief artifact exists, the very first interview question is now an open-ended free-text prompt: `Tell me about the project in your own words: one or two sentences are enough. What are you building, who is it for, and what problem does it solve?`. The agent extracts whatever it can from the user's reply (product type, target audience, business goal, domain hints) and uses it to pre-fill subsequent structured questions. Subsequent questions follow the regular options-table protocol from rule 2. Non-entry-point skills (`/srs`, `/stories`, …) skip the lead-in entirely because prior artifacts already supply the project context.
- **Two new walkthrough examples in `docs/USAGE.md` §1** — one showing the plain `/brief` flow with the open-ended lead-in, one showing the `/brief <text>` inline-context flow. Both examples use the new option-table format with letter IDs.

### Changed

- **Interview options are now presented as a 2-column markdown table with letter IDs** instead of a numbered list. Every interview-phase skill (12 SKILL.md files) inherits this automatically through the protocol — the change lives in `skills/references/interview-protocol.md` rule 2, no SKILL.md was touched. Each question now carries `| ID | Variant |` columns where ID is `a`, `b`, `c`, … (lowercase letters); the last row is always the free-text "Other" option. Tables render cleanly in Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf, scan faster than a numbered list, and let users reply with the letter ID, the verbatim variant text, or — for the free-text row — any text of their own.
- **CLI domain/agent menus now use letter IDs** to match the interview-protocol convention. Arrow-key navigation, vim-bindings (`j/k`), Enter, and Esc/Ctrl+C are unchanged; the jump key is now `a-z` instead of `1-9`. The non-TTY numbered fallback (CI, piped input) accepts a letter ID as the primary input, with digit and verbatim id-string kept as backward-compat fallbacks so existing scripts and muscle memory still work. New regression test asserts both letter and digit input paths through the fallback. `menuStep`, `renderMenu`, and `runMenuTty` were updated; the keypress handler accepts `[a-z]` as primary and `[0-9]` as fallback.

---

## [3.0.0] — 2026-04-09

### ⚠️ BREAKING — Cursor and Windsurf install paths moved to native Agent Skills

Cursor and Windsurf both have **two separate features**: Rules (`.cursor/rules/*.mdc`, `.windsurf/rules/*.mdc`) and Agent Skills (`.cursor/skills/<skill>/SKILL.md`, `.windsurf/skills/<skill>/SKILL.md`). BA Toolkit is a pipeline of skills, not rules, but every previous version installed it as `.mdc` rules under `.cursor/rules/` and `.windsurf/rules/`. Both editors loaded those files as **rules**, never as skills, so `/brief`, `/srs`, … slash commands were never registered with the agent. Users reported that the skills did not show up. v3.0 fixes this by switching to the native Agent Skills paths and the native folder-per-skill `SKILL.md` layout (the same one Claude Code, Codex CLI, and Gemini CLI use). Confirmed against the official Cursor and Windsurf documentation via ctx7 MCP:

| Agent | v2.0 path (broken) | v3.0 path (correct) | Format |
|---|---|---|---|
| Cursor | `.cursor/rules/<skill>.mdc` (flat) | `.cursor/skills/<skill>/SKILL.md` (folder-per-skill) | Native |
| Windsurf | `.windsurf/rules/<skill>.mdc` (flat) | `.windsurf/skills/<skill>/SKILL.md` (folder-per-skill) | Native |

**Migration for v2.0 Cursor/Windsurf users:**

```bash
# 1. Upgrade the package
npm install -g @kudusov.takhir/ba-toolkit@latest

# 2. Reinstall — the old install was at the wrong path; upgrade can't find
#    its manifest there, so just run install fresh against the correct path.
ba-toolkit install --for cursor      # writes to .cursor/skills/
ba-toolkit install --for windsurf    # writes to .windsurf/skills/

# 3. Manually clean up the orphaned old install (it never actually worked
#    as skills anyway — Cursor/Windsurf were loading it as rules):
rm -rf .cursor/rules/*.mdc           # if those .mdc files came from BA Toolkit
rm -rf .windsurf/rules/*.mdc
```

After this you'll see the BA Toolkit skills register as actual Agent Skills in Cursor and Windsurf for the first time — `/brief`, `/srs`, `/ac`, `/nfr`, … become real slash commands. Reload the editor window after install. Claude Code, Codex CLI, and Gemini CLI users are unaffected — their paths and behavior are unchanged.

### Added

- **Integration test suite for every CLI subcommand** (`test/cli.integration.test.js`, 33 tests). Spawns the real CLI as a child process against temporary directories and asserts exit codes, stdout/stderr content, and filesystem state. Covers `--version`/`--help`/no-args, typo detection for unknown flags, `init` with flag combinations and validation failures, `install`/`upgrade`/`uninstall` dry-runs for every supported agent, end-to-end install → manifest → status → upgrade → uninstall round-trips for both Claude Code and Cursor (native skill format), and a regression guard proving that `uninstall` leaves the user's own unrelated skills in the shared destination untouched (manifest-driven removal guarantee).
- **Test gate in `.github/workflows/release.yml`**. A new `Run tests` step runs `npm test` between the smoke test and the npm publish step — if any unit or integration test fails, the `publish-npm` job exits before the classic-auth strip + publish steps, and no broken release reaches npm. The GitHub Release created by the preceding job still happens; npm and GitHub are intentionally independent.
- **Test job in `.github/workflows/validate.yml`**. A new `run-tests` job mirrors the release gate at PR time, so regressions are caught on the PR instead of at tag push. Triggered for changes under `bin/**`, `test/**`, `skills/**`, `output/**`, or `package.json`.
- **ASCII banner at the top of `ba-toolkit init`**. Decorative `ba-toolkit` wordmark printed before the "New Project Setup" heading. Suppressed on non-TTY stdout (CI logs, piped output, captured test stdout) via an `isTTY` guard in `printBanner()`, so the banner never pollutes automation. Covered by a regression test that asserts the banner glyphs don't appear in non-TTY runs.
- **Arrow-key menu navigation in `ba-toolkit init`** for the domain and agent selection prompts. Real terminals now get an interactive menu — `↑/↓` (also `j/k`) to move, `1-9` to jump by index, `Enter` to confirm, `Esc` or `Ctrl+C` to cancel cleanly with exit code 130. The previous numbered prompt is the automatic fallback when stdin/stdout is not a TTY (CI, piped input, `TERM=dumb`, IDE shells), so all CI/integration tests and the `printf | ba-toolkit init` use case keep working unchanged. Cross-platform via Node's `readline.emitKeypressEvents` + `setRawMode` — works the same on bash, zsh, fish, Windows Terminal (PowerShell, cmd, WSL), Git Bash, and VSCode integrated terminal. Three-layer design for testability: `menuStep(state, key)` — pure state machine, 11 unit tests; `renderMenu(state, opts)` — pure renderer, 7 unit tests; `runMenuTty` — the I/O glue, manually smoke-tested.
- **Interview Protocol for every interview-phase skill** (`skills/references/interview-protocol.md`). Codifies the rule that AI skills must ask ONE question at a time, offer 3–5 domain-appropriate options per question sourced from `references/domains/{domain}.md`, always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question. Replaces the previous "dump a numbered questionnaire of 5+ questions at once" style that made users abandon long interviews. Every shipped SKILL.md with an `Interview` heading — 12 files: `brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `apicontract`, `wireframes`, `scenarios`, `research`, `principles` — now opens its Interview section with a blockquote pointing to this protocol. A Node-level regression test in `test/cli.test.js` walks every shipped SKILL.md and fails if any interview skill ever ships without the protocol link; a mirror validation step in `.github/workflows/validate.yml` catches the same at PR time.

### Changed

- **`ba-toolkit init` now merges `AGENTS.md` instead of overwriting it.** The `agents-template.md` wraps the Active Project block (name/slug/domain/date) in `<!-- ba-toolkit:begin managed -->` / `<!-- ba-toolkit:end managed -->` anchors. On re-init, only the managed block is refreshed — Pipeline Status edits, Key Constraints, Open Questions, user notes, and anything else outside the anchors is preserved byte-for-byte. If an existing `AGENTS.md` has no anchors (legacy file or fully user-authored), it's left untouched and a `preserved` note is printed instead of overwriting. The old interactive "AGENTS.md already exists. Overwrite? (y/N)" prompt is removed — the merge is always safe. New pure helper `mergeAgentsMd(existing, ctx)` exported from `bin/ba-toolkit.js` with unit tests covering all three branches (`created`, `merged`, `preserved`) plus malformed-anchor edge cases; integration tests verify the double-init scenario and the unmanaged-file preservation.
- `npm test` now runs both the pre-existing unit suite (`test/cli.test.js`) and the new integration suite — 154 tests total, ~2 seconds, still zero dependencies (only Node built-ins: `node:test`, `node:assert`, `node:child_process`).
- `.gitignore` now excludes `.claude/settings.local.json` and `.claude/skills/` — local Claude Code state, never part of the package. `settings.local.json` was previously tracked and required a stash dance around `npm version`; that workaround is no longer needed.

### Fixed

- **Cursor install now targets `.cursor/skills/` with native SKILL.md format, not `.cursor/rules/` with `.mdc` conversion.** See the BREAKING section above for the full story and migration steps.
- **Windsurf install now targets `.windsurf/skills/` with native SKILL.md format, not `.windsurf/rules/` with `.mdc` conversion.** Mirror of the Cursor fix. Confirmed against the [Windsurf Agent Skills documentation](https://docs.windsurf.com/windsurf/cascade/skills) via ctx7 MCP: Windsurf loads skills from `.windsurf/skills/<skill-name>/SKILL.md` as folder-per-skill with the same YAML frontmatter (`name`, `description`) as Claude Code and Cursor.
- **`ba-toolkit init` no longer crashes on a single typo during interactive input.** The domain menu, agent menu, and manual slug entry now re-prompt on invalid input via a new `promptUntilValid(question, resolver, { maxAttempts, invalidMessage })` helper. After three consecutive invalid answers the command aborts with a clear "Too many invalid attempts — aborting." message so piped input can't infinite-loop. The flag-path (`--domain=banana`, `--for=vim`) still hard-fails immediately — that's the correct behavior for CI and scripting, and its tests are untouched.
- **`prompt()` race condition that silently dropped piped input lines.** The previous implementation used `rl.question()` on a shared `readline.Interface`; when stdin was piped with multiple answers at once (e.g. `printf "banana\nsaas\n" | ba-toolkit init`, or any test feeding a full input buffer via `spawnSync`), readline emitted `'line'` events before the next `question()` handler had been attached, and those answers were silently lost. The second prompt then saw EOF and aborted with `INPUT_CLOSED` despite the answer being in the buffer. The new `prompt()` owns the `'line'` event directly, buffers arriving lines into an internal `lineQueue`, and parks `waiters` when the queue is empty — no more lost input. Uncovered while wiring up the `promptUntilValid` retry path.

### Removed

- **`.mdc` rule format conversion path is gone** — every shipped agent now uses native Agent Skills, so the conversion was dead code. Deleted: `skillToMdcContent()` (and its 2 unit tests), the `mdc` branch of `copySkills()`, the `format` field on every entry in `AGENTS`, the `format` parameter passed to `copySkills` and `writeManifest`, the runtime "format: .mdc (converted from SKILL.md)" log line. The `format` field is also gone from new manifests, but `readManifest` still parses legacy manifests that have it (covered by a forward-compat unit test). Net removal: ~80 lines of code + 2 unit tests; CLI surface unchanged.

---

## [2.0.0] — 2026-04-09

### ⚠️ BREAKING — install layout dropped the `ba-toolkit/` wrapper

**Every previous version of this package was broken.** The CLI installed skills under a `ba-toolkit/` wrapper folder (e.g. `.claude/skills/ba-toolkit/brief/SKILL.md`), but Claude Code, Codex CLI, Gemini CLI, Cursor and Windsurf all expect skills as **direct children** of their skills/rules root (`.claude/skills/<skill-name>/SKILL.md`). The wrapper made every shipped skill invisible to the agent — `/brief`, `/srs`, etc. silently did nothing because the agent didn't know they existed. The README, examples and all documentation referenced `/brief`, but the install path made it impossible for that command to ever resolve. Confirmed against the [official Claude Code skills documentation](https://code.claude.com/docs/en/skills.md): *"Each skill is a directory with `SKILL.md` as the entrypoint"* under `.claude/skills/<skill-name>/`, with no nested-namespace support.

v2.0 fixes this for real:

- **All 5 agent install paths drop the `ba-toolkit/` wrapper.** New paths:
  - Claude Code: `.claude/skills/` (project) and `~/.claude/skills/` (global)
  - OpenAI Codex CLI: `~/.codex/skills/` (global only)
  - Gemini CLI: `.gemini/skills/` and `~/.gemini/skills/`
  - Cursor: `.cursor/rules/` (project only, flat .mdc files)
  - Windsurf: `.windsurf/rules/` (project only, flat .mdc files)
- **Cursor and Windsurf layouts are now flat.** Previously each skill was nested under `.cursor/rules/ba-toolkit/<skill>/<skill>.mdc` (3 levels). Now each becomes a single `.mdc` file at the rules root: `.cursor/rules/<skill>.mdc`. Cursor's rule loader expects flat `.mdc` files, never recurses.
- **SKILL.md `name:` field renamed.** The 21 SKILL.md files used `name: ba-brief`, `name: ba-srs`, etc. But Claude Code derives the slash command from the `name` field — so the actual command was `/ba-brief`, not `/brief` as the README promised. All 21 files now use bare names (`name: brief`, `name: srs`, ...), and the slash commands `/brief`, `/srs`, `/ac`, … finally match the documentation.
- **Manifest replaces sentinel.** `runInstall` now writes `.ba-toolkit-manifest.json` listing every item it owns at the destination root. `cmdUninstall` and `cmdUpgrade` read the manifest and remove **only** those items — the destination directory is now shared with the user's other skills, so we can never `rm -rf` the whole root. Without a manifest, uninstall and upgrade refuse to do anything destructive. Manifest format:
  ```json
  {
    "version": "2.0.0",
    "installedAt": "2026-04-09T...",
    "format": "skill",
    "items": ["brief", "srs", "ac", ..., "references"]
  }
  ```
- **Legacy v1.x detection.** `runInstall`, `cmdUpgrade`, `cmdUninstall`, and `cmdStatus` now detect the old `ba-toolkit/` wrapper folder if it's still on disk and print a yellow warning with the exact `rm -rf` command to clean it up. The legacy folder is never auto-deleted — it might contain user state.

### Migration from v1.x

If you have a v1.x install on disk, the legacy `ba-toolkit/` wrapper will be sitting in the same parent directory as the new layout — it doesn't conflict with v2.0 file-wise, but it never worked, so you should remove it:

```bash
# Manual cleanup (one-time, per agent that had a v1.x install):
rm -rf .claude/skills/ba-toolkit          # claude-code project-level
rm -rf ~/.claude/skills/ba-toolkit         # claude-code global
rm -rf ~/.codex/skills/ba-toolkit          # codex
rm -rf .gemini/skills/ba-toolkit           # gemini project-level
rm -rf ~/.gemini/skills/ba-toolkit         # gemini global
rm -rf .cursor/rules/ba-toolkit            # cursor
rm -rf .windsurf/rules/ba-toolkit          # windsurf

# Then reinstall with v2.0:
ba-toolkit install --for claude-code
```

`ba-toolkit status` lists any legacy wrappers it finds on the system as a warning row, so you can audit before cleaning up.

### Internal

- **`copySkills(srcRoot, destRoot, { format })` replaces the previous `copyDir` + `skillToMdc`** combo. The new copy logic understands the per-format layout (folder-per-skill for `skill` format, flat `.mdc` files for `mdc` format) and reads the SKILL.md frontmatter to derive the canonical skill name from the `name:` field. References go to `<destRoot>/references/` regardless of format — non-`.mdc` files there are ignored by Cursor's rule loader.
- **Manifest helpers** (`readManifest`, `writeManifest`, `removeManifestItems`) replace the previous `readSentinel` / `writeSentinel`. The sentinel was a 2-field marker; the manifest is also the source of truth for what to remove on uninstall.
- **`detectLegacyInstall(agent)`** helper, used by every command that touches the install layout.
- **Test count 91 → 95.** Sentinel tests replaced with manifest tests; new tests for `detectLegacyInstall` (positive and negative cases) and `skillToMdcContent` (frontmatter + body extraction). All 95 tests pass.

---

## [1.5.0] — 2026-04-08

### Added

- **Typo detection on unknown CLI flags**, with a Levenshtein-based "Did you mean ...?" hint. Previously the parser silently accepted any `--flag` and stored it in `args.flags`, where most code paths then ignored it — users would hit `ba-toolkit init --drry-run`, get no error, and watch the script start an interactive session wondering why their flag did nothing. Now `validateFlags` runs immediately after parsing and rejects anything not in `KNOWN_FLAGS`:
  ```
  $ ba-toolkit init --drry-run
  error: Unknown option: --drry-run
    Did you mean --dry-run?
  Run ba-toolkit --help for the full list of options.
  ```
  The Levenshtein threshold is calibrated (`max(1, floor(input.length / 3))`) so common typos like `--domian`, `--gloabl`, `--no-installl`, `--foo`/`--for` get matched, but unrelated inputs like `--foobar` (distance 3 from "global") get no suggestion at all — better to say nothing than suggest something wildly off.

### Changed

- **Help output is ~20 lines shorter.** Four nearly-duplicate options sections (`INIT OPTIONS`, `INSTALL OPTIONS`, `UNINSTALL OPTIONS`, `UPGRADE OPTIONS`) collapsed into a single `OPTIONS` section. Each flag is listed exactly once with a per-command scope annotation (`init only — ...`, `install/uninstall/upgrade — ...`). Three sections after v1.4.0 added `uninstall`/`upgrade` repeated the same four flags with only wording differences; the dedup removes the noise without losing any information.
- **Domain and agent menu column widths are now computed dynamically** from the longest entry instead of being hardcoded to magic constants (`padEnd(13)` and `padEnd(20)`). If a future commit adds a domain or agent with a longer display name, the em-dash column on the right stays aligned automatically. No visible change for the current set.

### Internal

- **`AGENTS.md` template extracted** to `skills/references/templates/agents-template.md`. Previously it lived as a 44-line embedded string in `bin/ba-toolkit.js`, which was the only artifact template not in `skills/references/templates/`. Now follows the same `[NAME]` / `[SLUG]` / `[DOMAIN]` / `[DATE]` placeholder convention as `brief-template.md`, `srs-template.md`, etc. `renderAgentsMd` shrinks from a 60-line string template to a 12-line file read + four `String.replace` calls. Adding a field to the auto-generated AGENTS.md is now a Markdown edit, not a JS edit.
- **`stringFlag(args, key)` helper extracted** to centralise the `flag && flag !== true` (and inverse `!flag || flag === true`) pattern that was repeated across `cmdInit` (4 sites), `cmdInstall`, `cmdUninstall`, `cmdUpgrade` (3 sites). Returns the string value or `null` for absent / boolean / empty-string flags. The seven call sites collapse to single-line `stringFlag(args, 'name')` reads.
- **`parseSkillFrontmatter(content)` mini-parser** replaces the three regexes that `skillToMdc` used to extract `name` and `description` from SKILL.md frontmatter. The previous folded-scalar regex (`description:\s*>\s*\r?\n([\s\S]*?)(?:\r?\n\w|$)`) used a fragile `\r?\n\w` lookahead that would have over-captured on multi-paragraph descriptions and silently misparsed the `|` literal block scalar form (no shipped SKILL.md uses it yet, but the trap was there). The new walker handles inline / folded / literal forms uniformly, recognises chomping indicators (`>+`/`>-`/`|+`/`|-`), and correctly collapses multi-paragraph blocks with blank lines. Backward-compat verified by running `ba-toolkit install --for cursor` and confirming all 21 generated `.mdc` files have the same descriptions as before.
- **Unit-test infrastructure (78 → 91 tests).** Pure helper functions (`sanitiseSlug`, `parseArgs`, `resolveDomain`, `resolveAgent`, `stringFlag`, `parseSkillFrontmatter`, `readSentinel`, `renderAgentsMd`, `levenshtein`, `closestMatch`) are now exported from `bin/ba-toolkit.js` (guarded by `require.main === module` so the CLI still runs directly), and covered by `test/cli.test.js` using Node's built-in `node:test` runner — zero added dependencies. The test file does not ship to npm consumers (`test/` is not in `package.json`'s `files` whitelist). Includes one integration test that loads every shipped `SKILL.md` and asserts the parser produces a non-empty single-line description for each — catches regressions where a future skill is added with a frontmatter form the parser doesn't understand.

---

## [1.4.0] — 2026-04-08

### Added

- **`ba-toolkit uninstall --for <agent>`** — remove BA Toolkit skills from an agent's directory. Symmetric to `install`: same `--for`, `--global`, `--project`, `--dry-run` flag set, same project-vs-global default. Counts files in the destination, asks `Remove {dest}? (y/N)` (defaults to N), and prints `Removed N files` after the rm completes. The pre-removal safety guard refuses to proceed unless `path.basename(destDir) === 'ba-toolkit'` — this is the only place in the CLI that calls `fs.rmSync({recursive: true})`, so it gets the strictest validation against future bugs that could turn it into `rm -rf $HOME`.
- **`ba-toolkit upgrade --for <agent>`** (aliased as `update`) — refresh skills after a toolkit version bump. Reads the new version sentinel (see below), compares to `PKG.version`, and either prints `Already up to date` or wipes the destination wholesale and re-runs install with `force: true` (skipping the overwrite prompt). The wipe-and-reinstall approach guarantees that files removed from the toolkit between versions don't linger as ghost files in the destination — fixes the same class of bug that motivated `cmdUninstall`'s safety check. Pre-1.4 installs with no sentinel are treated as out-of-date and get a clean reinstall on first upgrade.
- **`ba-toolkit status`** — pure read-only inspection: scans every (agent × scope) combination — 5 agents × project/global where supported, 8 real locations in total — and reports which versions of BA Toolkit are installed where. Output is grouped per installation, multi-line for readability, with colored version labels (`green: current` / `yellow: outdated` / `gray: pre-1.4 install with no sentinel`) and a summary footer pointing at `upgrade` for stale installs. Drives the natural follow-up to the version sentinel: now there's something to read it back with.
- **Version sentinel `.ba-toolkit-version`** — `runInstall` now writes a hidden JSON marker file (`{"version": "1.4.0", "installedAt": "..."}`) into the install destination after a successful copy. The file has no `.md`/`.mdc` extension, so all five supported agents' skill loaders ignore it. Lets `upgrade` and `status` tell which package version is currently installed without diffing every file.
- **`runInstall({..., force: true})` option** — skips the existing-destination overwrite prompt. Used by `cmdUpgrade` because it has already wiped the destination (or is in dry-run) and the prompt would just be noise. Not exposed as a CLI flag — `force` is an internal API surface only.

### Fixed

- **Five Tier 1 CLI fixes were already shipped in 1.3.2**, but they're worth restating in context here because 1.4.0 builds directly on the same `bin/ba-toolkit.js` improvements: `cmdInit` now honours `runInstall`'s return value (no false success message after a declined overwrite), `parseArgs` accepts `--key=value` form, the readline lifecycle and SIGINT handling are unified through a single shared interface with `INPUT_CLOSED` rejection, the slug-derivation path prints a clear error when the input has no ASCII letters, and `AGENTS.md` now lists all 21 skills (the previous template was missing the 8 cross-cutting utilities added in v1.1 and v1.2). See the 1.3.2 entry below for the per-fix detail.

### Internal

- **`resolveAgentDestination(...)` helper** — extracted scope-resolution logic from `runInstall`'s inline checks. `cmdUninstall` and `cmdUpgrade` reuse it. `runInstall` itself could be refactored to call the helper too in a follow-up — kept inline for now to keep this release's diff focused on the user-facing features.
- **Documentation:** `CLAUDE.md` added at the repo root, with project conventions, the release flow (including the `.claude/settings.local.json` stash dance), the npm publish CI gotchas (curl tarball bypass for the broken bundled npm, `_authToken` strip for OIDC), and the do-not-touch list. Future Claude Code sessions get the institutional context without reading the full git log.

---

## [1.3.2] — 2026-04-08

### Fixed

- **`bin/ba-toolkit.js` `cmdInit` ignored `runInstall` return value.** When the user declined the "Overwrite? (y/N)" prompt for an existing skill destination, `runInstall` returned `false`, but `cmdInit` ignored it and printed the success path ("Project is ready. Next steps: Restart Claude Code to load the new skills") even though no skills were installed. The next-steps block now branches on the install result and tells the user how to retry: `ba-toolkit install --for {agentId}`.
- **`parseArgs` did not accept `--key=value` form.** The hand-rolled parser only understood `--key value` (space-separated). Users typing the GNU long-option style accepted by git/npm/gh (`--name=MyApp`, `--domain=saas`) silently lost the value — the flag was stored as `name=MyApp` set to `true` and the script then prompted for the project name interactively. Both forms now work and can be mixed in a single invocation. Splits on the first `=` only, so values containing further `=` characters are preserved (e.g. `--name="Foo=Bar"`).
- **No SIGINT handler / readline lifecycle issues.** Each `prompt()` call previously created a fresh `readline.Interface` and closed it after the answer. Hitting Ctrl+C mid-prompt killed Node abruptly and left some terminals in raw mode. Piped stdin that closed mid-flow caused the next prompt's promise to hang forever and the process to exit silently with no error message. Fixed by switching to a single shared `readline.Interface` per CLI invocation, adding a `process.on('SIGINT')` handler that prints a clean `Cancelled.` message and exits with code 130, and rejecting in-flight prompt promises with `err.code = 'INPUT_CLOSED'` when the input stream closes prematurely. The outer `main().catch(...)` filters this code to print a friendly two-line message instead of a Node stack trace.
- **Silent failure when slug could not be derived from a non-ASCII name.** `sanitiseSlug` strips everything outside `[a-z0-9-]`, so `--name "Проект Космос"` or `--name "🚀"` produced an empty derived slug. In the non-interactive path the script then exited with a generic `Invalid or empty slug` error with no clue about why. Now in the non-interactive path it prints `Cannot derive a slug from "{name}" — it contains no ASCII letters or digits` plus a one-line workaround (`Pass an explicit slug with --slug, e.g. --slug my-project`). In the interactive path it prints a gray hint above the manual slug prompt explaining we couldn't auto-derive.
- **`AGENTS.md` template was missing 8 of the 21 skills.** `renderAgentsMd` emitted a "Pipeline Status" table with 13 rows — the 12 numbered stages + the `7a` sub-step. The 8 cross-cutting utilities added in v1.1 and v1.2 (`/trace`, `/clarify`, `/analyze`, `/estimate`, `/glossary`, `/export`, `/risk`, `/sprint`) were missing entirely. Since `AGENTS.md` is the project context every AI agent reads on entry to a new session, those 8 skills were effectively invisible — agents didn't know they existed without re-reading README. Added a second "Cross-cutting Tools" section below the pipeline table listing all 8, with descriptions copied from the canonical README pipeline table. A `MAINTENANCE` comment above the function reminds future-me to update both tables when adding a new skill.

---

## [1.3.1] — 2026-04-08

### Fixed

- **`/brief` and `/srs` now load all 9 domain references, not just 3.** Both `skills/brief/SKILL.md` and `skills/srs/SKILL.md` hardcoded a check for `igaming`, `fintech`, `saas` only — a stale list from v1.0 that was never updated when v1.1.0 added six new domain references (`ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`). As a result, users on any of those six domains silently got no domain-specific interview questions, mandatory entities, or glossary. The check now covers all nine shipped domain files, matching the supported list advertised in the CLI and README. No other skill files had the same stale list — only `brief` and `srs` did hardcoded domain matching.

### Changed

- **`sprint-template.md` rewritten end-to-end as Nova Analytics (SaaS).** The sprint-plan reference template loaded by `/sprint` was previously a Dragon Fortune iGaming example (slot games, RTP, responsible gambling, bonus wagering, Telegram Mini App). It's now a B2B SaaS product analytics plan — workspace sign-up, data source integration, dashboards with funnel/cohort widgets, metric alerts, SSO, and admin workspace management. Structure (sprint goals, DoD, capacity math, epic labels) is unchanged.
- **`risk-template.md` rewritten end-to-end as Nova Analytics.** The risk-register reference template loaded by `/risk` had iGaming-specific risks (regulated iGaming jurisdiction, Telegram Mini App API breakage, RTP / bonus wagering knowledge gap). It's now a SaaS analytics risk register: third-party data source rate limits, GDPR DPA, columnar query performance at scale, OIDC/SSO library breaking changes, and columnar analytics storage knowledge gap. Structure (probability × impact scoring, priority tiers, mitigation/contingency sections) is unchanged.
- **`export-template.md`** — one-line fix: the example Jira label changed from `dragon-fortune` to `nova-analytics`.
- **iGaming-first ordering removed from user-facing documentation.** README intro, README Domain support table, `docs/FAQ.md`, `docs/USAGE.md`, and `docs/TROUBLESHOOTING.md` all listed iGaming first when enumerating the 9 supported domains. They now follow the SaaS-first order the CLI has used since v1.3.0: `saas → fintech → ecommerce → healthcare → logistics → on-demand → social-media → real-estate → igaming`. The iGaming row in the Domain support table stays — it just moved from position 1 to position 9.
- **`dragon-fortune` slug example in README.md:186 replaced with `nova-analytics`.** This was the last stray placeholder outside the real `example/dragon-fortune/` project.

### Not changed (deliberately)

- `skills/references/domains/igaming.md` — the domain reference itself. iGaming remains a first-class supported domain.
- `example/dragon-fortune/` — the real end-to-end example project referenced from README.
- `bin/ba-toolkit.js` / `init.sh` / `init.ps1` `DOMAINS` array iGaming entry — iGaming remains a menu choice in the CLI and shell initialisers.

---

## [1.3.0] — 2026-04-08

### Changed

- **`ba-toolkit init` is now a one-command setup.** It prompts for project name, slug (auto-derived from the name), domain, and AI agent, then creates `output/{slug}/`, writes `AGENTS.md`, and installs the skills into the chosen agent's directory — in a single interactive flow. Previously this required two commands: `ba-toolkit init` followed by `ba-toolkit install --for <agent>`. The old two-step flow is still available via `ba-toolkit init --no-install` + `ba-toolkit install --for <agent>`.
- **Domain and agent selection now use numbered menus** instead of free-text input. Domains are listed 1–10 with name and short description; agents are listed 1–5 with their registered id. Users can type either the menu number (`1`, `2`, …) or the id (`saas`, `claude-code`, …).
- **`DOMAINS` reordered** so general-purpose industries (SaaS, Fintech, E-commerce, Healthcare) appear first; iGaming moved to position 9. The toolkit is no longer iGaming-first in its defaults.
- **Setup placeholders no longer use "Dragon Fortune"** (the iGaming example project). The CLI, `init.sh`, `init.ps1`, `docs/USAGE.md` AGENTS.md example, and `skills/references/environment.md` file listings now use neutral placeholders (`My App` / `my-app` / `saas`). The actual example project in `example/dragon-fortune/` and the skill templates that reference it are unchanged — they remain a real iGaming walkthrough.

### Added

- `ba-toolkit init --for <agent>` flag — skip the agent menu (e.g. `--for claude-code`). Accepts the same set as `ba-toolkit install --for`.
- `ba-toolkit init --no-install` flag — create the project structure only; don't install skills. Restores the pre-1.3.0 behavior for CI pipelines that run `init` and `install` as separate steps.
- `ba-toolkit init --global` / `--project` / `--dry-run` flags — forwarded to the embedded install step.
- `init.sh` and `init.ps1` shell fallbacks now use the same numbered domain menu and auto-derived slug UX as the CLI, with pointers to `npx @kudusov.takhir/ba-toolkit install --for <agent>` for the skill install step (they remain zero-dependency scripts and don't install skills themselves).

### Migration note

CI scripts that relied on the old behaviour (`init` creates files only, `install` is a separate step) need one of:

- Pass all the new flags to get fully non-interactive behaviour:
  ```bash
  npx @kudusov.takhir/ba-toolkit init --name "My App" --domain saas --for claude-code
  ```
- Or add `--no-install` to keep the two-step flow:
  ```bash
  npx @kudusov.takhir/ba-toolkit init --name "My App" --domain saas --no-install
  npx @kudusov.takhir/ba-toolkit install --for claude-code
  ```

---

## [1.2.5] — 2026-04-08

### Changed

- **README refactor (3-step):** cut README from 843 to 288 lines (−66%) without losing any factual content.
  - PR 1 — extracted Usage Guide, Troubleshooting, FAQ, Contributing, and "Adding a new domain" into `docs/USAGE.md`, `docs/TROUBLESHOOTING.md`, `docs/FAQ.md`, `CONTRIBUTING.md`, and `docs/DOMAINS.md`. README now links to each instead of duplicating the content.
  - PR 2 — reordered sections to follow the reader funnel (what → install → see result → details → advanced). Collapsed manual install variants (Claude Code, Codex, Gemini, Cursor/Windsurf, init scripts, manual updates) under a single `<details>` block. Removed the `## Contents` TOC (GitHub auto-generates one), the ASCII Pipeline diagram (duplicated the table below it), the ASCII "How each skill works" block, the ~80-line `## Repository Structure` tree, and the `## Quick Start` section (duplicated `docs/USAGE.md` section 1). Moved `What the output looks like` up to sit right after Install. Moved the time-estimates table to `docs/USAGE.md` as an appendix.
  - PR 3 — style pass: one-line hero, emoji removed from every H2 heading and from Pipeline/Platform/Domain table contents, "Who is this for?" bullets removed, the "Why not just prompt ChatGPT / Claude directly?" comparison table replaced with a single paragraph in the intro, callout blockquotes inlined, all headings switched to sentence case.
- `docs/*` follow-up style pass: sentence-case H1s in `docs/USAGE.md` and `docs/DOMAINS.md`. Fixed a stale anchor in `docs/FAQ.md` (pointed to `../README.md#-installation` from before the emoji-stripped H2 rename; now points to `#install`).

### Removed

- `README.ru.md` and every remaining Russian-language reference across the repo (`README.md` language switcher, `package.json` files whitelist, the 1.2.0 CHANGELOG note about the Russian translation, and the planning item in `todo.md`). The toolkit is now single-language (English); localisation can be re-added later as a separate effort if needed.

---

## [1.2.4] — 2026-04-08

### Fixed

- `.github/workflows/release.yml` — added a "Strip classic auth from .npmrc" step before `npm publish`. `actions/setup-node` with `registry-url` writes `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}` into `.npmrc`; with our empty `NODE_AUTH_TOKEN` this registered as a configured-but-empty classic token, so npm refused to start the OIDC flow and failed with `ENEEDAUTH`. Stripping both `:_authToken=` and `always-auth=` lines lets npm 11.5.1+ detect GitHub Actions OIDC and use Trusted Publishing.
- Also removed the now-unused `NODE_AUTH_TOKEN: ''` override on the publish step — with the `.npmrc` cleaned up, it's redundant.

### Changed

- Supersedes the unpublished `1.2.3` (which reached the publish step but died on auth) — carries forward all prior changes.

---

## [1.2.3] — 2026-04-08 _(GitHub Release only — npm publish failed on auth, superseded by 1.2.4)_

### Fixed

- `.github/workflows/release.yml` — replaced the `npm install -g npm@latest` step with a direct tarball download via `curl`, bypassing the broken bundled npm in Node 22.22.2 (whose `@npmcli/arborist` is missing its transitive `promise-retry` dep, causing any `npm install` — including self-upgrade, with or without `--force` — to die with `MODULE_NOT_FOUND`). The workaround pulls `npm-11.5.1.tgz` directly from the registry and drops it into the toolcache's `node_modules` without invoking npm at all. Both `1.2.1` and `1.2.2` failed the `publish-npm` job for this reason and were never published to npm; `1.2.3` supersedes both.

### Changed

- Supersedes the unpublished `1.2.1` and `1.2.2` — carries forward all of their documentation, rename, and CI changes.

---

## [1.2.2] — 2026-04-08 _(GitHub Release only — npm publish failed, superseded by 1.2.3)_

### Fixed

- `.github/workflows/release.yml` — added `--force` to the `npm install -g npm@latest` step to work around a known self-upgrade bug where arborist unlinks its own transitive `promise-retry` mid-upgrade and fails with `MODULE_NOT_FOUND`. _(This workaround was insufficient — the bundled npm is broken at rest, not just during self-upgrade. Fixed properly in 1.2.3.)_

### Changed

- Supersedes the unpublished `1.2.1` — carries forward all of its documentation and rename changes.

---

## [1.2.1] — 2026-04-08 _(GitHub Release only — npm publish failed, superseded by 1.2.2)_

### Changed

- npm package renamed from `ba-toolkit` to scoped `@kudusov.takhir/ba-toolkit` to avoid name collisions in the public registry. The CLI binary name (`ba-toolkit`) is unchanged. Install commands are now `npx @kudusov.takhir/ba-toolkit <command>` or `npm install -g @kudusov.takhir/ba-toolkit`.
- `README.md` updated to use the scoped package name in all `npx` and `npm install -g` examples.

---

## [1.2.0] — 2026-04-08

### Added

- `/sprint` skill — sprint planning from estimated User Stories: groups stories into sprints by velocity and capacity, applies risk-weighted prioritisation, outputs sprint goals and Definition of Done per sprint (`00_sprint_{slug}.md`).
- `skills/references/templates/sprint-template.md` — full example sprint plan for the Dragon Fortune project.
- `example/dragon-fortune/` — complete example project with all 15 pipeline artifacts for an iGaming Telegram Mini App. Fully cross-referenced: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario + Risk Register + Sprint Plan.
- **npm package** — BA Toolkit is now publishable to npm as `ba-toolkit`. Two commands supported:
  - `npx ba-toolkit init` — interactive project initialiser (creates `output/{slug}/` and `AGENTS.md`).
  - `npx ba-toolkit install --for <agent>` — copies skills to the correct path for Claude Code, Codex CLI, Gemini CLI, Cursor, or Windsurf. Supports `--global`, `--project`, and `--dry-run` flags.
  - Cursor and Windsurf installs auto-convert `SKILL.md` → `.mdc` rule format.
  - Zero runtime dependencies; Node.js ≥ 18.
- `bin/ba-toolkit.js` — CLI entry point (~450 lines, single file, no framework).
- `package.json` — npm manifest with `bin`, `files` whitelist, and repository metadata.
- `.github/workflows/release.yml` extended with a `publish-npm` job that runs on version tag push after the GitHub Release step. Uses **npm Trusted Publishing via OIDC** — no `NPM_TOKEN` secret required, publishes provenance attestations automatically. Verifies tag matches `package.json` version and runs a CLI smoke test before publishing.

### Fixed

- README.md tagline: outdated "19 skills" → "21 skills" (matches badge and body counters).
- `release.yml` — fixed broken `awk` regex that interpreted `[` and `]` in version headings as character class metacharacters; now uses literal `index()` matching, so release notes are correctly extracted from `## [X.Y.Z]` sections.
- `CHANGELOG.md` compare links — replaced `your-username` placeholder with actual GitHub user `TakhirKudusov`.

---

## [1.1.0] — 2026-04-07

### Added

**New skills**
- `/estimate` — effort estimation for User Stories: Fibonacci Story Points, T-shirt sizes, or person-days. Includes splitting recommendations for oversized stories.
- `/glossary` — unified project glossary extraction. Scans all artifacts, detects terminology drift, finds undefined terms, generates `00_glossary_{slug}.md`.
- `/export` — artifact export to external issue trackers: Jira (JSON), GitHub Issues (JSON + `gh` CLI script), Linear (JSON), and universal CSV.

**Templates**
- Added 12 new artifact templates to `skills/references/templates/`, covering all pipeline stages: `stories`, `usecases`, `ac`, `nfr`, `datadict`, `research`, `apicontract`, `wireframes`, `scenarios`, `trace`, `analyze`, `handoff`.

**Domains**
- Added 6 new domain reference files: `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`.
- Domain count increased from 3 to 9.

**Tooling**
- `init.ps1` — PowerShell project initialiser for Windows. Creates `output/{slug}/` and `AGENTS.md` with full pipeline status table.
- `init.sh` — Bash project initialiser for macOS / Linux. Same behaviour.
- `.github/workflows/validate.yml` — GitHub Actions CI workflow. Validates artifact structure on PRs to `output/`. Checks SKILL.md frontmatter and domain reference sections.
- `.github/scripts/validate_artifacts.py` — Python validator used by the CI workflow.

### Changed
- `skills badge` updated from 16 to 18 (estimate, glossary, export pending `.skill` packaging).
- `domains badge` updated from 3 to 9.
- `README.md`: added "Starting a new project" section to Installation, updated Repository Structure, added `estimate.skill` and `glossary.skill` to Claude.ai install list.
- `skills/references/templates/README.md`: updated template table to list all 15 templates.

---

## [1.0.0] — 2026-03-15

### Added

**Core pipeline (16 skills)**
- `/principles` — project constitution: language, ID format, traceability rules, Definition of Ready, NFR baseline, quality gates, output folder structure.
- `/brief` — project brief: goals, audience, stakeholders, constraints, risks, glossary. Creates `AGENTS.md`.
- `/srs` — software requirements specification: functional requirements (FR), roles, interfaces, MoSCoW matrix. Updates `AGENTS.md`.
- `/stories` — user stories with epics, FR links, priority, and size.
- `/usecases` — use cases with main success scenario, alternative flows, exception flows.
- `/ac` — acceptance criteria in Given / When / Then format, Definition of Done checklists.
- `/nfr` — non-functional requirements: performance, scalability, availability, security, maintainability, usability.
- `/datadict` — data dictionary: entities, fields, types, constraints, relationships, enums.
- `/research` — technology research and architecture decision records (ADRs), integration map, storage decisions, compliance notes.
- `/apicontract` — API contract: endpoints (REST/GraphQL), request/response schemas, webhooks, error codes.
- `/wireframes` — textual wireframe descriptions: layout, states, interactions, design notes per screen.
- `/scenarios` — end-to-end validation scenarios with persona, steps, expected outcome, failure conditions, coverage summary.
- `/handoff` — development handoff package: artifact inventory, MVP scope, traceability coverage, risks, recommended dev sequence.
- `/trace` — cross-artifact traceability matrix: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario. Coverage gaps and statistics.
- `/clarify` — targeted ambiguity resolution: metrics-free adjectives, undefined terms, conflicting rules, missing fields, ambiguous actors, duplicates.
- `/analyze` — cross-artifact quality report: duplication, ambiguity, coverage gaps, terminology drift, invalid references. Severity-rated findings.

**Iterative refinement subcommands**
- `/revise [section]` — rewrite a specific section.
- `/expand [section]` — add more detail.
- `/split [element]` — split a large User Story or FR into smaller elements.
- `/validate` — completeness and consistency check.
- `/done` — finalise artifact and advance to the next pipeline step.

**Domain references (3 initial)**
- `igaming.md` — iGaming: slots, sports betting, casino lobbies, Telegram Mini Apps, promo mechanics.
- `fintech.md` — Fintech: neobanks, payment systems, crypto exchanges, investment platforms.
- `saas.md` — SaaS: B2B platforms, CRM, analytics, marketplaces, EdTech, HRTech.

**Reference files**
- `skills/references/environment.md` — platform-specific output paths and flat/subfolder modes.
- `skills/references/closing-message.md` — standardised closing message template used by all skills.
- `skills/references/prerequisites.md` — per-step prerequisite checklists for all 16 skills.
- `skills/references/templates/` — base artifact templates: `principles`, `brief`, `srs`.

**Packaged skills**
- 16 `.skill` files in the repo root for direct upload to Claude.ai.

**AGENTS.md synchronisation**
- `/brief` creates `AGENTS.md` with project context (slug, domain, constraints, pipeline stage).
- `/srs` updates `AGENTS.md` with roles and integrations.

**Project files**
- `README.md` — full documentation: pipeline diagram, platform compatibility, usage guide, FAQ, contributing guide, domain table, example artifacts, MVP paths.
- `LICENSE` — MIT license.

---

[Unreleased]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.8.0...HEAD
[3.8.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.7.0...v3.8.0
[3.7.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.4.1...v3.5.0
[3.4.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.4.0...v3.4.1
[3.4.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.1.1...v3.2.0
[3.1.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.2...v1.4.0
[1.3.2]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.5...v1.3.0
[1.2.5]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TakhirKudusov/ba-toolkit/releases/tag/v1.0.0
