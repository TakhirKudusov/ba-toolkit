# Domain Reference: Healthcare / MedTech

Domain-specific knowledge for healthcare and medical technology projects: telemedicine platforms, patient portals, EHR/EMR systems, clinic management systems, mental health apps, medical device integrations, pharmacy platforms.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: telemedicine (video consultations), patient portal, EHR/EMR, clinic management, mental health app, pharmacy, medical IoT, health insurance tool?
- Primary beneficiary: patients, clinicians, clinic administrators, insurance providers?
- Geographic scope and primary jurisdiction (impacts regulatory requirements: HIPAA / GDPR / FHIR)?
- Funding model: SaaS subscription (clinic/hospital), direct-to-consumer (D2C), insurance-funded, employer-funded?
- Integration with existing clinical systems: EHR, LIS (lab), RIS (radiology), billing?

### Typical business goals
- Reduce patient wait times and administrative overhead.
- Increase patient retention and adherence to treatment plans.
- Enable remote care delivery and reduce in-person visit load.
- Ensure regulatory compliance and pass clinical audits.
- Provide clinicians with accurate, timely patient data at point of care.

### Typical risks
- Regulatory non-compliance (HIPAA, GDPR, MDR for medical devices) — fines and loss of licence.
- Data breach exposing Protected Health Information (PHI) — reputational and legal damage.
- Clinical error due to incorrect or outdated patient data — patient safety risk.
- Integration complexity with legacy EHR systems (HL7 v2, FHIR R4).
- Low clinician adoption due to poor UX or disruption to existing workflows.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles and actors: patient, doctor/physician, nurse, specialist, pharmacist, lab technician, billing/revenue cycle, admin, insurance coordinator?
- Appointment types: in-person, video, phone, async messaging?
- Prescription handling: electronic prescriptions (e-Rx) sent to pharmacy, or printed?
- Lab results: manual upload, HL7/FHIR integration with LIS, patient-facing results?
- Billing: self-pay, insurance claims (CMS-1500, UB-04), co-pay collection at visit?
- Consent management: digital consent forms, consent audit trail, HIPAA authorizations?
- Multi-clinic or multi-provider support?

### Typical functional areas
- Patient registration and identity verification.
- Appointment scheduling (booking, rescheduling, cancellation, reminders).
- Video / async consultation module.
- Medical records — SOAP notes, diagnosis codes (ICD-10), problem list, allergies.
- Prescription management (e-Rx, medication history, refill requests).
- Lab results — ordering, result delivery to patient and clinician.
- Billing and insurance claims management.
- Consent and legal document management.
- Notifications — appointment reminders, result alerts, prescription ready.
- Admin dashboard — scheduling, capacity, staff management, reporting.
- Patient portal — appointments, records, messages, prescriptions.
- Audit log — all PHI access events logged per HIPAA requirements.

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical patient flows: appointment booking, video consultation, receiving lab results, requesting prescription refill?
- Critical clinician flows: reviewing patient history before consultation, documenting a visit, ordering labs?
- Sensitive flows requiring special handling: mental health disclosures, minor patients, proxy (guardian) access?

### Typical epics
- Patient Registration and Identity (onboarding, identity verification, consent).
- Appointment Management (booking, reminders, rescheduling).
- Consultation (video, async, in-person notes).
- Medical Records (view, update, share).
- Prescriptions (issue, refill, send to pharmacy).
- Lab & Diagnostics (order, result notification, patient view).
- Billing & Payments (insurance claim, co-pay, invoices).
- Notifications & Alerts (appointment, results, messages).
- Clinician Workflow (schedule, patient list, documentation).
- Admin & Reporting (capacity, revenue, compliance reports).
- Audit & Compliance (access log, consent records).

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Exceptional flows: no-show patient, clinician technical issue during video call, lab result outside critical range (STAT alert)?
- Emergency flows: how does the system handle a patient reporting a medical emergency during a telemedicine session?
- Proxy access: can a parent book and view a minor's records? Guardian access for elderly patients?

### Typical exceptional flows
- Video call technical failure — fallback to phone consultation or reschedule offer.
- Critical lab value detected — automated STAT alert to clinician, acknowledgement required.
- Prescription cannot be sent electronically — fallback to printed/faxed prescription.
- Patient no-show — automatic status update, slot released for rebooking.
- Insurance claim rejected — notification to billing coordinator with rejection code and resubmission guidance.
- Clinician cancels same-day — patient notification and priority rebooking offer.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- PHI access controls: role-based access, break-glass emergency access, access logging for HIPAA?
- Consent requirements: what must be consented before each consultation type? Is re-consent required on policy changes?
- STAT alerts: what defines a critical lab value? Who must be notified, in what timeframe, with what acknowledgement?
- Audit trail: what events are logged (who accessed what and when)? How long are logs retained?
- Prescription validation: formulary check, drug-drug interaction check — automatic or manual?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Regulatory jurisdiction: HIPAA (US), GDPR (EU), both, other national regulation?
- Data residency: must PHI remain in-country (specific cloud region)?
- Medical device classification (if applicable): FDA Class I / II, CE marking, MDR?
- Availability expectations: 24/7 for patient-facing portal; business hours only for admin?

### Mandatory NFR categories for Healthcare
- **Security & Compliance:** HIPAA Business Associate Agreement (BAA) with all vendors storing PHI. End-to-end encryption of PHI in transit (TLS 1.2+) and at rest (AES-256). RBAC with least-privilege. MFA for clinician accounts.
- **Audit:** All PHI access events logged immutably with user ID, timestamp, record accessed. Minimum retention 6 years (HIPAA). Logs must be tamper-evident.
- **Availability:** Patient portal and consultation module SLA 99.9%. Admin-only functions may be 99.5%. Planned maintenance during low-usage windows only.
- **Performance:** Appointment booking page < 1.5s. Video call connection < 5s from acceptance. Lab result page load < 2s.
- **Data Integrity:** Clinical data must be immutable after clinician sign-off. Corrections tracked as addenda, not overwrites.
- **Interoperability:** HL7 FHIR R4 APIs for EHR integration where applicable. ICD-10 and CPT codes must be validated against official code sets.
- **Backup & Recovery:** PHI backups daily, retained 30 days. RTO < 4 hours, RPO < 1 hour for clinical data.
- **Consent:** Digital consent with timestamp, version, and patient signature must be stored for the lifetime of the patient record.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Patient identity: how is identity verified at registration (government ID, insurance card, email only)?
- Medical record model: SOAP notes (Subjective, Objective, Assessment, Plan)? Problem-oriented? Free text?
- Diagnosis coding: ICD-10-CM (clinical), ICD-10-PCS (procedures), or both?
- Multi-provider: does a patient record belong to one clinic or is it portable across providers on the platform?
- Soft delete: are patient records soft-deleted (retention required by law)?

### Mandatory entities for Healthcare
- **Patient** — demographic: name, DOB, gender, contact, insurance, emergency contact. PHI-flagged.
- **Clinician** — physician, nurse, specialist: NPI number, credentials, specialties, licence state.
- **Appointment** — type, status (scheduled → confirmed → completed / cancelled / no-show), provider, patient, slot.
- **ConsultationNote** — SOAP or structured note: subjective, objective, assessment, plan, author, signed timestamp.
- **Diagnosis** — ICD-10 code, description, onset date, status (active, resolved), linked to note.
- **Prescription** — medication name, dosage, frequency, quantity, refills, prescriber, date, e-Rx status.
- **LabOrder** — test panel ordered, ordering clinician, date, priority (routine / STAT).
- **LabResult** — test name, value, unit, reference range, abnormal flag, received date, reviewed flag.
- **MedicationHistory** — current and past medications, source (self-reported, EHR, pharmacy).
- **Allergy** — substance, reaction type, severity, reported date.
- **InsurancePlan** — payer, plan name, member ID, group number, copay, deductible.
- **Claim** — billing claim: CPT codes, ICD-10 codes, amount, payer, status, rejection code.
- **Consent** — type, version, patient signature, timestamp, expiry.
- **AuditLog** — user ID, action, resource type, resource ID, timestamp, IP address.
- **Document** — referral, imaging report, external record: type, upload date, access permissions.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- FHIR: are public FHIR R4 endpoints required (for patient data portability / CMS Interoperability Rule)?
- Webhooks: real-time lab result delivery to clinician, appointment reminders trigger, claim status update?
- Third-party: integration with telemedicine video provider (Daily.co, Twilio, Zoom Health), e-Rx network (Surescripts), pharmacy?

### Typical endpoint groups
- **Patients** — create, search, get profile, update demographics, get insurance.
- **Appointments** — list availability, book, confirm, cancel, reschedule, get details.
- **Consultations** — start session (video URL), create note, sign note, get notes.
- **Prescriptions** — create, send to pharmacy, refill request, history.
- **Lab Orders & Results** — create order, receive result (webhook), get results, acknowledge critical.
- **Billing** — create claim, get claim status, process co-pay.
- **Audit** — query audit log (admin only).
- **Consent** — get latest consent version, record patient consent, get consent history.
- **FHIR Resources** _(if applicable)_ — Patient, Appointment, Observation, MedicationRequest, DiagnosticReport (R4-compliant).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key clinician screens: schedule view, patient chart, note editor, lab order and result view?
- Key patient screens: appointment booking, health summary, prescription refill, lab result view?
- Separate apps or unified platform for patient vs. clinician?
- Video consultation embedded in platform or external link?

### Typical screens
- **Patient Portal — Home** — upcoming appointments, recent results, messages, quick book.
- **Appointment Booking** — clinician search, availability calendar, type selection, confirmation.
- **Consultation Screen** — video panel, patient summary sidebar, note editor, prescription action.
- **Patient Health Summary** — problem list, medications, allergies, recent visits, lab results.
- **Lab Result View** — result list, trend chart, reference range, abnormal highlight, clinician comment.
- **Prescription Refill** — current medications, refill request button, pharmacy selection.
- **Clinician Schedule** — day/week calendar, patient queue, appointment status management.
- **Clinical Note Editor** — SOAP sections, ICD-10 lookup, CPT code entry, sign button.
- **Lab Order Form** — panel selection, priority, ordering notes, STAT flag.
- **Billing Dashboard** _(admin)_ — claims by status, revenue summary, rejection queue, reports.
- **Audit Log View** _(admin)_ — searchable log table, export for compliance review.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| PHI | Protected Health Information — any individually identifiable health data |
| HIPAA | Health Insurance Portability and Accountability Act (US) |
| EHR | Electronic Health Record — longitudinal patient record across providers |
| EMR | Electronic Medical Record — record within a single practice |
| FHIR | Fast Healthcare Interoperability Resources — HL7 standard for health data exchange |
| HL7 | Health Level Seven — standard for clinical data messaging |
| ICD-10 | International Classification of Diseases, 10th Revision — diagnosis codes |
| CPT | Current Procedural Terminology — procedure and service codes |
| NPI | National Provider Identifier — unique ID for US healthcare providers |
| e-Rx | Electronic Prescription — digitally transmitted to pharmacy |
| PCP | Primary Care Provider |
| SOAP note | Structured clinical note: Subjective, Objective, Assessment, Plan |
| STAT | Immediately urgent (from Latin statim) — highest clinical priority |
| BAA | Business Associate Agreement — HIPAA-required contract with vendors handling PHI |
| LIS | Laboratory Information System |
| RIS | Radiology Information System |
| Telemedicine | Remote delivery of clinical care via video, phone, or messaging |
| Formulary | List of medications approved by an insurance plan |
| Co-pay | Fixed patient payment per visit/prescription under insurance plan |
| Deductible | Amount patient must pay out-of-pocket before insurance covers costs |
