# Domain Reference: AI / ML

Domain-specific knowledge for AI / ML products: LLM-powered applications, conversational agents, RAG (retrieval-augmented generation) pipelines, agent frameworks, model-serving and inference platforms, fine-tuning and training pipelines, ML feature stores, model marketplaces, AI dev tools, vector databases, and embedded AI features inside non-AI products.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: end-user LLM app (chat, copilot), RAG over a private corpus, autonomous agent / multi-agent system, model-serving platform, fine-tuning service, AI-feature embedded in an existing SaaS, AI dev tool, vector database, evals platform?
- Build vs. buy on the model: hosted API (OpenAI, Anthropic, Google), open-weights self-hosted (Llama, Mistral, Qwen), fine-tuned open-weights, in-house pre-trained, hybrid?
- User segment: consumer, prosumer, B2B knowledge worker, developer, internal (employee-facing), regulated enterprise?
- Modality: text only, multimodal (image, audio, video, code), voice-first, structured-output / function-calling?
- Monetization: per-message, per-token, subscription, per-seat, per-API-call, freemium with usage caps, marketplace take-rate?
- Latency budget: real-time chat (<2s), interactive completion (<200ms first token), batch processing (minutes), or async background?
- Determinism / reproducibility requirement: high (same input → same output, e.g. legal, healthcare, finance) vs. low (creative)?

### Typical business goals
- Reach quality threshold for production launch (often the gating factor: an evals score, a human-preference win-rate vs. baseline, or an internal acceptance bar).
- Reduce cost-per-query (token costs, retrieval costs, fine-tuning amortisation).
- Reduce hallucination / unsafe-output rate to a specific target (e.g. <1% on the eval set).
- Improve task success rate (the AI version of feature success — does the user actually finish the task with help?).
- Increase active usage (DAU, messages per session, tasks completed).
- Build a moat through proprietary data, fine-tuned models, or workflow integration.
- Hit safety, bias, and compliance thresholds (especially in regulated sectors).

### Typical risks
- Hallucinations and confident-sounding incorrect output.
- Prompt injection and jailbreaking (data exfiltration, role override, tool misuse).
- Cost runaway (one heavy user can burn months of margin).
- Latency unpredictability (P50 vs. P99 differs by an order of magnitude).
- Vendor / model deprecation (the underlying model API changes or sunsets).
- Data privacy: user inputs may contain PII, secrets, or proprietary code that the model provider then stores or trains on.
- Regulatory exposure: EU AI Act, sector-specific (FDA SaMD for medical, NYC bias audit for HR, NIST AI RMF, ISO 42001).
- Eval / quality regression: a model upgrade silently breaks a downstream task.
- Tool-use agents going off-policy (calling the wrong tool, making irreversible writes, looping).

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: end user, prompt / agent author, eval reviewer, ML engineer, MLOps / inference operator, safety / policy reviewer, billing admin?
- Multi-tenancy: shared model with per-tenant retrieval, per-tenant fine-tunes, per-tenant inference cluster?
- Model layer: which models (provider × name × version) are wired? Fallback / failover strategy when the primary model is down or rate-limited?
- Prompting / orchestration framework: in-house, LangChain, LlamaIndex, custom agent loop, OpenAI Agents SDK?
- RAG: which corpus? Which embedding model? Which vector database? Re-indexing schedule?
- Tool use / function calling: which tools are exposed to the model? Which side effects are allowed (read-only, idempotent, irreversible)?
- Evals: which datasets? Which scoring methods (LLM-as-judge, rubric, A/B human pref, reference-based metrics)?
- Safety: input filter, output filter, refusal policy, red-team coverage, prompt-injection defence (delimited / sandwiched / structured prompts, system-prompt leakage prevention)?
- Data handling: are user inputs logged? Used for fine-tuning? Sent to a third-party model provider (and under which DPA terms)?
- Compliance: EU AI Act risk classification, NIST AI RMF profile, ISO 42001 certification target, sector rules (FDA SaMD, HIPAA, GDPR Art. 22 automated-decision rights)?

### Typical functional areas
- Conversation / completion API and UI.
- Prompt / template management with versioning.
- Model routing and fallback (provider × model × version).
- Tool / function-calling registry.
- RAG pipeline (ingest, chunk, embed, store, retrieve, rerank).
- Vector database / index management.
- Fine-tuning / dataset management.
- Inference serving (autoscaling, queueing, batching, GPU / accelerator management).
- Eval pipeline (datasets, scorers, regression detection, dashboards).
- Safety pipeline (input / output filters, red-team queue, refusal policies).
- Observability (token usage, latency, cost, quality, drift).
- Cost / usage metering and quotas.
- Feedback collection (thumbs up/down, structured rating, free-text).
- Admin console (model registry, prompt registry, tool registry, eval runs, safety dashboard).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical end-user flows: ask a question, get a grounded answer with citations, refine the answer, take an action via a tool, share or export the result?
- Critical author / operator flows: write a new prompt, run it against an eval set, compare against a baseline, ship to production, monitor regressions?
- Critical safety flows: red-team a new prompt, review a flagged refusal, export an audit log for a regulator?
- Edge cases: model outage and fallback, rate-limit hit, user input contains PII, tool call fails halfway through a multi-step plan, hallucinated citation, prompt injection in retrieved context?
- Personas: end user, prompt / agent author, eval reviewer, ML engineer, MLOps operator, safety reviewer, regulator / auditor.

### Typical epics
- Conversation and completion.
- Retrieval and citation.
- Tool / function calling.
- Prompt and template authoring.
- Eval running and regression detection.
- Safety review and red-teaming.
- Model routing and fallback.
- Cost metering and quotas.
- Feedback and improvement loop.
- Fine-tuning workflow.
- Observability and incident response.
- Admin (model registry, prompt registry, audit log).

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: model returns an unsafe output → safety filter rewrites or refuses; tool call fails → agent retries, escalates, or rolls back; retrieved context is empty → fall back to general knowledge with a clear disclaimer; quota hit → block with a soft message and upgrade prompt?
- System actors: model provider API, embedding API, vector database, tool / plugin APIs (search, code execution, browser, internal CRMs), safety classifier, eval scorer, observability backend, billing / metering system?

### Typical exceptional flows
- Model API timeout / 5xx → fall back to a secondary model or queue for retry.
- Rate-limit hit (provider-side or per-tenant) → backoff, queue, or reject with a clear message.
- Output filter blocks an answer → safe completion or refusal with a reason code.
- Input filter detects prompt injection → strip / quote the suspicious content and warn.
- Retrieved context is empty → answer with a disclaimer or ask a clarifying question instead of hallucinating.
- Tool call fails after a partial side effect → compensate / roll back and report cleanly to the user.
- Eval regression detected after a prompt or model upgrade → auto-rollback and page on-call.
- User submits PII or a secret → mask in logs, do not forward to third-party providers without DPA coverage.
- Citation cannot be resolved to a real source → suppress the citation and downgrade confidence.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Quality bars: minimum eval score, minimum win-rate vs. baseline, max hallucination rate on the eval set, max unsafe-output rate?
- Latency bars: time to first token (p50, p95), full completion time, agent-step total budget?
- Cost bars: max average tokens per query, max average cost per query, hard per-tenant daily / monthly quota?
- Determinism / reproducibility: is `temperature = 0` required, with the same model version pinned? Is bit-for-bit reproducibility required (often impossible — replace with semantic-equivalence checks)?
- Boundary values: max prompt length, max context window utilisation, max conversation history retained, max retrieved documents per query, max tool-call depth, max agent steps per task?
- Safety AC: explicit list of disallowed outputs (PII leakage, prompt-injection echo, instructions for weapons / self-harm / etc.) with at least one positive and one negative test case each.

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Latency: TTFT (time to first token), full completion p50 / p95, end-to-end agent-task budget?
- Throughput: peak QPS, concurrent active sessions, peak fine-tune jobs, peak batch inference?
- Cost target: average and p95 cost per request, monthly budget per tenant, alerting threshold?
- Quality: target eval score, target win-rate vs. last release, hallucination rate ceiling, refusal rate ceiling?
- Reproducibility: pinned model versions, pinned prompt versions, deterministic decoding settings?
- Safety: red-team coverage frequency, mandatory categories (CSAM, weapons, self-harm, hate, prompt injection, PII leakage)?
- Observability: traces per request (prompt, retrieval, tool calls, scores, cost, latency)?
- Data residency: where do user inputs and embeddings live? Which cloud regions are allowed? Is the model API itself in a permitted region?

### Mandatory NFR categories for AI / ML
- **Performance:** TTFT < 1s (p50) for chat; full completion < 5s (p95) for short-form; batch jobs scheduled to off-peak windows.
- **Scalability:** elastic inference (autoscaling on tokens-per-second, not just requests-per-second); rate limiting per tenant and global; queueing with backpressure.
- **Cost control:** per-request token cap, per-tenant daily and monthly budget, alerting at 50/80/100 % thresholds; cost dashboard mandatory.
- **Quality / evals:** eval set on every prompt or model change; regression detection on every release; rollback playbook documented.
- **Safety:** input + output filters; red-team coverage of mandatory categories; refusal-rate dashboard; incident playbook for jailbreaks; clear escalation path.
- **Security:** secrets never echoed; user inputs scrubbed before logging; mTLS or signed requests to the model provider; tool-call allow-list; sandboxed code execution if applicable; tenant isolation in the vector store.
- **Privacy:** explicit notice on what is logged and what is sent to third-party model providers; DPA in place with each provider; opt-out for training-data use; PII redaction before storage.
- **Compliance:** EU AI Act risk-class assessment on file; NIST AI RMF profile mapped; ISO 42001 controls if pursued; sector controls (HIPAA, FDA SaMD, NYC bias audit) where applicable.
- **Observability:** end-to-end trace per request (prompt rendered, context retrieved, tools called, model used, tokens, latency, cost, evals, safety verdict, user feedback).
- **Reproducibility:** every released prompt and model version is pinned and re-runnable on the eval set.
- **Resilience:** primary-model outage → automatic failover to a secondary; documented degraded-mode behaviour.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Multi-tenancy: tenant_id on every entity, including prompts, evals, conversations, vector index partitions?
- Retention: how long are user conversations, prompts, evals, and traces retained? What is purged on opt-out?
- PII categorisation: which fields might contain user PII or secrets and how are they protected (redaction, encryption, masked in UI)?

### Mandatory entities for AI / ML
- **Prompt** — versioned prompt template: id, version, body, variables, model binding, status (draft/published).
- **Model** — model registry entry: provider, name, version, endpoint, default params, status, deprecation date.
- **Conversation** — chat session: tenant, user, started_at, status, metadata.
- **Message** — single turn: conversation, role (user/assistant/system/tool), content, tokens, cost, latency, model used.
- **Trace** — full execution record per request: prompt id+version, retrieval results, tool calls, model id+version, final output, token counts, cost, latency, eval scores, safety verdict.
- **EvalSet** — labelled dataset: name, items, scoring method, owner.
- **EvalRun** — single run of a prompt or model against an eval set: scores, regression vs. baseline, run timestamp.
- **Tool** — tool / function registry entry: name, schema, side-effect class (read-only / idempotent / irreversible), allowed roles.
- **ToolCall** — log of an executed tool call: trace id, tool, arguments, result, status, latency.
- **Document** — RAG corpus item: source, ingest date, hash, chunk count, embedding model, retention class.
- **Chunk** — embedded chunk: document, position, text, embedding vector, metadata.
- **VectorIndex** — index partition: tenant, embedding model, dimensionality, count, last reindex.
- **Feedback** — user rating: trace id, rating, free-text reason, reviewer id.
- **SafetyEvent** — flagged input or output: trace id, category, action taken, reviewer status.
- **Quota** — per-tenant usage allowance: window, token cap, request cap, current usage.
- **AuditLog** — admin actions on prompts, models, tools, evals, safety policy.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Streaming responses (server-sent events / chunked) vs. unary completions?
- Function-calling / structured-output schemas — JSON Schema published per tool?
- Public API for third-party integrators vs. internal-only?
- Webhooks for "eval regression detected", "safety event flagged", "fine-tune job complete"?
- Idempotency keys on completions (so a retried request does not double-charge)?

### Typical endpoint groups
- Chat / completion (streaming and unary).
- Prompts (CRUD, versions, publish, rollback).
- Models (registry, route, fallback, deprecation).
- Tools (registry, schemas, allow-list per tenant).
- Conversations (list, read, delete, export).
- RAG ingest (upload, status, reindex, delete).
- Vector search (query, similarity, filter).
- Evals (sets, runs, compare, dashboards).
- Safety (flag, review, override, audit).
- Feedback (submit, list, aggregate).
- Quotas and billing (current usage, limits, top-ups).
- Fine-tuning (upload dataset, start job, status, deploy).
- Webhooks (regression, safety, job-complete events).
- Admin (audit log, model registry, tool registry).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: chat / conversation surface, prompt editor with side-by-side diff and eval panel, eval dashboard, safety review queue, model registry, tool registry, cost / usage dashboard, RAG corpus management, fine-tune job page?
- Specific states: streaming response in progress, model fallback in effect, safety filter blocked an output, quota exhausted, rate-limited, regenerating, citation hover, tool call running, partial agent failure, eval regression alert, expensive query warning?

### Typical screens
- Chat surface (streaming response, citations, "regenerate", "stop", thumbs up/down, copy).
- Prompt editor (template body, variables, model binding, side-by-side run, eval panel).
- Eval dashboard (runs over time, regression alerts, drill-down per item).
- Eval set editor (labelled examples, scorers, owner).
- Safety review queue (flagged inputs / outputs, decision form, audit trail).
- Model registry (providers, versions, deprecation calendar, fallback chains).
- Tool registry (schemas, side-effect class, allow-list per tenant).
- Cost / usage dashboard (per tenant, per prompt, per model; alerts at thresholds).
- RAG corpus management (sources, ingest status, reindex button, retention class).
- Fine-tune job page (dataset, base model, hyperparameters, status, evals, deploy).
- Trace viewer (per request: prompt → retrieval → tool calls → model → output → evals → safety → feedback).
- Admin console (audit log, quotas, policy editor, opt-out registry).

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| LLM | Large Language Model |
| RAG | Retrieval-Augmented Generation — retrieve from a corpus, then generate grounded on it |
| Agent | LLM that can call tools and act over multiple steps |
| Tool / function calling | LLM produces a structured request to invoke an external function |
| Embedding | Dense vector representation of text (or other modality) for similarity search |
| Vector database | Storage and ANN search over embeddings |
| Chunk | A unit of text from a source document used for embedding and retrieval |
| Reranker | Second-stage model that reorders retrieved candidates by relevance |
| Hallucination | Confident, plausible-sounding output that is factually wrong |
| Prompt injection | Adversarial input that tries to override the system prompt or extract secrets |
| Jailbreak | Adversarial input that bypasses the safety filter |
| Eval | A measurement of model or prompt quality on a labelled dataset |
| LLM-as-judge | Using one LLM to score the outputs of another |
| TTFT | Time to first token — latency to the start of the streamed response |
| Token | The unit of text the model bills and processes (sub-word) |
| Context window | Maximum tokens the model can attend to per request |
| Fine-tuning | Continued training of a base model on a custom dataset |
| LoRA | Low-Rank Adaptation — a parameter-efficient fine-tuning technique |
| Inference | Running a trained model to produce output (vs. training) |
| MLOps | Operational discipline of running ML models in production |
| Drift | Production data or behaviour drifting away from the eval distribution |
| Refusal rate | % of requests the safety filter declines |
| Red-teaming | Systematic adversarial testing of a model or product for unsafe behaviour |
| Guardrails | Programmatic input / output filters around an LLM |
| Multi-modal | Model that handles more than one modality (text, image, audio, video) |
| EU AI Act | EU regulation classifying AI systems by risk and imposing obligations |
| NIST AI RMF | US NIST AI Risk Management Framework |
| ISO 42001 | International standard for AI management systems |
