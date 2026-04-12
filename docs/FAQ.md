# FAQ

**Do I need all 29 skills?**
No. The lean pipeline (`/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff → /implement-plan`) covers the essentials and ends with an AI-actionable plan in ~3–4 hours. Add `/usecases`, `/research`, `/scenarios`, `/trace`, and `/analyze` when you need deeper coverage.

**How do I hand the BA pipeline to an AI coding agent so it can actually build the project?**
Run `/implement-plan` after `/handoff`. It reads every BA Toolkit artifact in your project folder and produces `12_implplan_{slug}.md` — a phase-and-DAG implementation plan with a tech-stack header, ordered phases (Foundation → Data → Auth → Core → API → UI → Integrations → Quality → Validation), and atomic tasks where each task references the FR / US / AC it implements and carries its own Definition of Done. Hand the file to Claude Code, Cursor, or Codex and they can step through it task by task. Tech-stack choices are pulled from `07a_research_{slug}.md` if `/research` was run; otherwise the skill asks a short calibration interview. This is *not* the same as `/sprint`, which groups stories into time-based sprints for a scrum master — `/implement-plan` sequences work for a coding agent, by dependency.

**What if I don't know what to build yet?**
Start with `/discovery` instead of `/brief`. It runs a structured brain-storm interview — problem space, target audience hypotheses, candidate domains, reference products, MVP feature ideas, open validation questions — and produces `00_discovery_{slug}.md` plus a concrete recommendation (domain, project name, slug, scope hint) you carry into `/brief`. Use it whenever you arrive with only a vague hunch and no fixed domain or feature list. `/brief` will auto-load `00_discovery_{slug}.md` if it exists and skip questions the discovery already answered.

**How do I share the artifacts with non-developer stakeholders?**
Run `ba-toolkit publish` (or `/publish` inside your AI agent) from your project's `output/` folder. It produces two import-ready bundles: `publish/notion/` (clean Markdown for Notion's bulk Markdown import) and `publish/confluence/` (HTML pages plus an `index.html` entry point for Confluence's HTML import). Drag-and-drop or zip-and-upload via each tool's native importer — no API tokens, no OAuth, no network. Cross-references between artifacts are rewritten per target so links survive the import. Use `--format notion` or `--format confluence` if you only need one. See [USAGE.md](USAGE.md#sharing-artifacts-with-stakeholders) for the full walkthrough.

**Can I use it in any language?**
Yes. The agent detects the language of your first message and generates all artifacts in that language. Set it explicitly with `/principles` if you want to lock it regardless of the conversation language.

**Does it work offline / without internet?**
Yes. All skills are local Markdown files. The only network dependency is your AI agent itself (Claude Code, Codex CLI, etc.). No BA Toolkit component calls any external API.

**My domain isn't SaaS, Fintech, or E-commerce — can I still use it?**
Yes. Select "Custom" at `ba-toolkit init` (or pass `--domain custom`) and the skills use general interview questions. You can add your own domain in 30 minutes by creating one Markdown file — see [DOMAINS.md](DOMAINS.md).

**Can I go back and edit a previous artifact?**
Yes. Run `/revise [section]` at any step, or re-invoke the skill command (e.g., `/srs`) to regenerate from scratch. The agent warns before overwriting. Subsequent skills will read the updated version automatically.

**What is the difference between pipeline skills and utility skills?**
Pipeline skills (15) advance your project sequentially — each one reads the output of the previous step and produces the next artifact. Utility skills (9) are available at any stage and do not advance the pipeline — they verify, estimate, publish, or export existing artifacts. You can run a utility skill whenever its prerequisites are met, and re-run it as many times as you like. See [USAGE.md § 9](USAGE.md#9-utility-skills) for the full list and a decision tree.

**When should I use /analyze vs /clarify vs /trace vs /glossary?**
`/analyze` is the broadest diagnostic — it checks 8 quality categories across all artifacts (duplicates, ambiguity, coverage gaps, terminology drift, invalid references, inconsistencies, underspecified sources, validation gaps). If `/analyze` flags ambiguity issues, use `/clarify` on the specific artifact for a deep-dive with interactive resolution. If it flags coverage gaps, use `/trace` to see the full traceability matrix. If it flags terminology drift, use `/glossary` to build or refresh the project glossary. Start with `/analyze` for the big picture, then use the specialized tool to fix what it found.

**Can I use BA Toolkit without technical skills?**
Yes. You do not need to know how to code. The agent asks you questions about your project in plain language, and you answer them — the structured documents are generated automatically. The only technical step is the initial setup: installing Node.js and running `ba-toolkit init` in a terminal. After that, everything happens inside the AI agent's chat window. See the [getting started guide](https://takhirkudusov.github.io/ba-toolkit/getting-started/) for step-by-step instructions.

**What happens if I skip a pipeline step?**
Most steps are optional. The lean path (`/brief → /srs → /stories → /ac → /handoff → /implement-plan`) skips use cases, research, wireframes, and scenarios. If a later step needs information from a skipped step, the agent will either ask you the relevant questions directly or note that the information is unavailable. You can always go back and run a skipped step later — subsequent skills will pick up the new artifact automatically.

**What if the AI generates something wrong or inaccurate?**
Use `/revise [section]` to correct a specific section, or `/clarify` to surface and resolve ambiguities. The agent does not guess silently — it asks questions first and generates based on your answers. If you spot an error, tell the agent what is wrong and it will update the artifact. You can also re-run any skill from scratch to regenerate completely.

**How long does the full pipeline take?**
The lean path takes approximately 3–4 hours. The full path (all 15 pipeline steps plus utility skills) takes 5–8 hours. Most of the time is spent answering the agent's interview questions — generation itself is fast. You do not have to finish in one sitting; the agent reads existing artifacts when you resume.

**Does it work with smaller / faster models?**
The structured Markdown format and explicit cross-references help smaller models stay on track. For best results, use a model with a context window of at least 32k tokens — the later pipeline steps load multiple large artifacts simultaneously.

**How do I update BA Toolkit after a new version is released?**
See the update instructions in the [Install](../README.md#install) section of the main README.
