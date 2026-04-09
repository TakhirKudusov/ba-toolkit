# Domain Reference: EdTech

Domain-specific knowledge for EdTech projects: K-12 platforms, higher-education tools, corporate learning (LXP/LMS), MOOC marketplaces, language learning, tutoring marketplaces, exam-prep apps, micro-credential and certification platforms.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Learner segment: K-12 students, university students, adult professionals, corporate employees, parents-of-learners?
- Product type: full LMS, lightweight LXP, MOOC marketplace, 1:1 tutoring marketplace, self-paced micro-courses, exam prep, language learning, simulation/lab environment?
- Buyer vs. user split: who pays (parent, school district, university, HR/L&D, employer, learner) vs. who uses?
- Monetization: per-seat institutional licensing, B2C subscription, freemium, certificate fees, marketplace take-rate, sponsored/free?
- Accreditation and certification: are completions recognised by an external body (universities, certifying organisations, ministries of education)?
- Geography and language coverage: single market or multi-region; what languages and reading directions are required at launch?

### Typical business goals
- Improve learning outcomes (course completion, mastery scores, time-to-proficiency).
- Increase course completion rate (the perennial EdTech problem; benchmark <15% for free MOOCs).
- Grow institutional contracts (school districts, universities, corporate L&D).
- Reduce learner-acquisition cost; raise repeat enrolment.
- Build a credentialing economy (certificates that employers actually trust).
- Move learners up a value ladder: free → paid → certificate → cohort → degree.

### Typical risks
- Low completion and engagement — the dominant EdTech failure mode.
- Child-safety / minor-data compliance: COPPA (US, under-13), GDPR-K (EU), age verification, parental consent.
- Procurement cycles for K-12 and higher-ed are long (6–18 months) and seasonal.
- Accessibility lawsuits (Section 508 / WCAG 2.1 AA / ADA) — high prevalence in US K-12.
- Cheating, plagiarism, and AI-generated submissions undermine assessment integrity.
- Content licensing — third-party textbook, video, and assessment item rights.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: learner, instructor / teacher, teaching assistant, course author, parent / guardian, school admin, district admin, content reviewer, support agent?
- Multi-tenancy: per-district, per-school, per-cohort isolation?
- LTI / SCORM / xAPI integration: must the platform plug into existing LMS (Canvas, Moodle, Blackboard, D2L)?
- SIS (Student Information System) integration: rostering via OneRoster / Clever / ClassLink?
- Assessment types: multiple-choice, free-text, code submissions, file upload, peer review, oral exam, proctored exam?
- Live vs. self-paced: real-time classroom (video, whiteboard) or fully asynchronous?
- Compliance: FERPA (US), COPPA, GDPR-K, state student-data privacy laws (CSPC), accessibility (WCAG 2.1 AA, Section 508).

### Typical functional areas
- Course catalog and enrolment.
- Course authoring (lesson editor, video upload, quiz builder, branching scenarios).
- Lesson player (video, reading, interactive widgets, transcript, captions).
- Assessment engine (item bank, randomisation, time limits, retakes, grading rubric).
- Gradebook and progress tracking.
- Discussion forums, peer review, group projects.
- Live classroom (video, whiteboard, breakout rooms, polls) — if synchronous.
- Certificates, badges, transcripts, micro-credentials.
- Reporting for instructors and admins (cohort progress, at-risk learners).
- Parent/guardian portal (K-12).
- Admin console (rostering, license management, content moderation).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical learner flows: discovery, enrolment, first lesson, returning to where I left off, taking an assessment, getting feedback, earning a certificate?
- Critical instructor flows: creating a course, importing existing content, monitoring cohort progress, grading, intervening with at-risk learners?
- Edge cases: assessment timeout, network drop mid-exam, plagiarism detection, content review queue, refund / unenrol?
- Personas: motivated self-learner, struggling K-12 student, corporate compliance learner, university lecturer, district curriculum lead.

### Typical epics
- Learner onboarding and FTUE.
- Course discovery and enrolment.
- Lesson playback and progress tracking.
- Assessment and grading.
- Instructor authoring and analytics.
- Cohort / classroom management.
- Certificates and credentials.
- Parent / guardian visibility (K-12).
- Admin console and rostering.
- Live classroom (if synchronous).

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: assessment timeout, lost connection during a proctored exam, peer reviewer drops out, plagiarism flag, accessibility-driven extended time?
- System actors: SIS provider, LTI consumer LMS, video CDN, proctoring service, payment provider, certificate-issuance service, content-moderation pipeline?

### Typical exceptional flows
- Assessment timer expires while learner is still answering.
- Network drop during a high-stakes exam (recovery, replay, instructor escalation).
- Plagiarism / AI-generated content detected after submission.
- Learner under 13 with no parental consent on file.
- Instructor revokes a published course; enrolled learners affected.
- SIS roster sync fails mid-term; new students cannot log in.
- LTI launch from external LMS arrives with invalid signature.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Business rules: pass mark, max retakes, minimum time on task, prerequisite courses, certificate validity period, late-submission policy?
- Boundary values: max video length, max assessment duration, max file upload size (essays, code), max concurrent live-classroom participants, gradebook precision (0.01 vs. integer)?
- Accessibility AC: WCAG 2.1 AA conformance per screen, captions on every video, transcript on every audio, keyboard-only navigation, screen-reader announcements for timer changes?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Concurrency: peak concurrent learners (start of term, exam day, MOOC launch); peak concurrent live-classroom participants?
- Video delivery: target start time (<2s), buffering ratio, supported bitrates, offline download for low-bandwidth?
- Data residency: per-country / per-district storage requirements (e.g. EU student data must stay in EU; some US states require in-state hosting)?
- Accessibility target: WCAG 2.1 AA mandatory; AAA aspirational?

### Mandatory NFR categories for EdTech
- **Performance:** lesson load < 2s, video start < 2s, gradebook query < 500ms (p95), assessment submission ack < 1s.
- **Scalability:** handle the start-of-term spike (10–50× steady-state for 24–72h); support cohort sizes up to N learners simultaneously in live classroom.
- **Availability:** 99.9% during academic hours; planned maintenance windows must avoid exam periods. Status page mandatory for institutional buyers.
- **Security:** SSO via SAML / OIDC with rostering provider; RBAC by role and cohort; FERPA / COPPA / GDPR-K compliance; encryption at rest and in transit; audit log of grade changes.
- **Privacy:** explicit consent flows for under-13 learners; parental access portal; right to delete student data; minimal data collection from minors.
- **Accessibility:** WCAG 2.1 AA on all learner-facing surfaces; Section 508 conformance for US public-sector contracts; captions and transcripts on every multimedia asset.
- **Content delivery:** global CDN for video; adaptive bitrate; offline download for mobile.
- **Backup:** RPO < 1 hour, RTO < 4 hours; gradebook is critical — point-in-time recovery required.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Multi-tenancy: tenant_id (school, district, organisation) on every entity?
- Soft delete: which entities (Course, Assessment, Submission) keep history for audit and grade-dispute resolution?
- PII categorisation: what fields are FERPA / COPPA / GDPR-K protected?

### Mandatory entities for EdTech
- **Learner** — student account: profile, age, guardian link, accessibility prefs, locale.
- **Instructor** — teacher / course author: profile, qualifications, hosted courses.
- **Course** — course / module: title, description, prerequisites, learning objectives, status (draft/published).
- **Lesson** — lesson / unit: order, type (video, reading, quiz), content payload.
- **Enrolment** — learner ↔ course link: status (active, completed, dropped), start, end, progress %.
- **Assessment** — quiz / exam: item bank reference, time limit, attempts allowed, passing score.
- **Submission** — learner answer: content, score, attempt number, submitted_at, graded_by.
- **GradebookEntry** — gradebook row: learner, course, assessment, score, weight, late?
- **Certificate** — issued credential: learner, course, issue date, verification URL.
- **Cohort** — class / group: school, term, instructor, learners.
- **Guardian** — parent / guardian (K-12): link to learner, contact, consent status.
- **AuditLog** — grade change, content publish, roster sync events.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- LTI 1.3 / Deep Linking / Names and Roles support required?
- OneRoster / Clever / ClassLink rostering API as a sync source?
- xAPI / Caliper Analytics learning-record output for institutional analytics warehouses?
- Public API for third-party integrations (textbook publishers, exam proctoring, plagiarism detection)?
- Webhooks for "enrolment created", "assessment submitted", "certificate issued"?

### Typical endpoint groups
- Auth (SSO via SAML/OIDC, LTI launch, API keys).
- Courses (CRUD, publish, version, prerequisites).
- Lessons (CRUD, ordering, media upload).
- Enrolments (enrol, unenrol, list, progress).
- Assessments (item bank, start attempt, submit, grade).
- Gradebook (read, override, audit).
- Rostering (sync, learner / cohort import).
- Certificates (issue, verify, list).
- Analytics (cohort progress, at-risk learners).
- Admin (tenants, license management, content moderation).
- Webhooks (outgoing learning events).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: course catalog, course landing page, lesson player, assessment player, learner dashboard, instructor dashboard, gradebook, certificate page?
- Specific states: assessment in progress with countdown timer, network-drop recovery, content locked behind prerequisite, completion confetti, accessibility-large-text mode?

### Typical screens
- Learner dashboard (continue learning, due assignments, recent grades).
- Course catalog and search.
- Course landing page (overview, syllabus, instructor, reviews, enrol button).
- Lesson player (video / reading / interactive, transcript, notes, navigation).
- Assessment player (timer, navigation, save-and-resume, submit confirmation).
- Gradebook (learner view: my grades; instructor view: cohort grades).
- Instructor course authoring (lesson editor, quiz builder, preview).
- Instructor cohort dashboard (progress, at-risk, intervention queue).
- Certificate page (verifiable URL, share to LinkedIn).
- Parent / guardian portal (K-12): child progress, upcoming work, communications.
- Admin console (rostering, licenses, content moderation).
- Live classroom (video grid, whiteboard, chat, polls, breakout rooms) — if synchronous.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| LMS | Learning Management System — institutional platform for course delivery and gradebook |
| LXP | Learning Experience Platform — learner-centric, recommendation-driven evolution of the LMS |
| MOOC | Massive Open Online Course |
| LTI | Learning Tools Interoperability — IMS Global standard for embedding tools in an LMS |
| SCORM | Sharable Content Object Reference Model — legacy standard for packaged learning content |
| xAPI | Experience API (Tin Can) — modern learning-record format successor to SCORM |
| Caliper Analytics | IMS Global learning-analytics standard |
| SIS | Student Information System — system of record for enrolment, schedule, and grades |
| OneRoster | IMS Global standard for SIS-to-application rostering |
| Clever / ClassLink | US K-12 rostering and SSO providers |
| FERPA | Family Educational Rights and Privacy Act (US) — student-record privacy law |
| COPPA | Children's Online Privacy Protection Act (US) — parental consent for under-13 |
| GDPR-K | GDPR provisions specific to children's data (EU) |
| Section 508 | US federal accessibility law for ICT |
| WCAG 2.1 AA | Web Content Accessibility Guidelines, level AA |
| Item bank | Pool of assessment questions, randomised per attempt |
| Cohort | A group of learners progressing through a course together |
| Proctoring | Identity verification and behaviour monitoring during high-stakes exams |
| Adaptive learning | Personalisation engine that adjusts difficulty / pace per learner |
| Micro-credential | Small, verifiable digital certificate (vs. full degree) |
| Completion rate | % of enrolled learners who finish a course — the canonical EdTech metric |
| Time on task | Total active time a learner spends on a unit of content |
