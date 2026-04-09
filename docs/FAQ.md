# FAQ

**Do I need all 23 skills?**
No. The lean pipeline (`/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff`) covers the essentials in ~3–4 hours. Add `/usecases`, `/research`, `/scenarios`, `/trace`, and `/analyze` when you need deeper coverage.

**What if I don't know what to build yet?**
Start with `/discovery` instead of `/brief`. It runs a structured brain-storm interview — problem space, target audience hypotheses, candidate domains, reference products, MVP feature ideas, open validation questions — and produces `00_discovery_{slug}.md` plus a concrete recommendation (domain, project name, slug, scope hint) you carry into `/brief`. Use it whenever you arrive with only a vague hunch and no fixed domain or feature list. `/brief` will auto-load `00_discovery_{slug}.md` if it exists and skip questions the discovery already answered.

**How do I share the artifacts with non-developer stakeholders?**
Run `ba-toolkit publish` (or `/publish` inside your AI agent) from your project's `output/<slug>/` folder. It produces two import-ready bundles: `publish/notion/` (clean Markdown for Notion's bulk Markdown import) and `publish/confluence/` (HTML pages plus an `index.html` entry point for Confluence's HTML import). Drag-and-drop or zip-and-upload via each tool's native importer — no API tokens, no OAuth, no network. Cross-references between artifacts are rewritten per target so links survive the import. Use `--format notion` or `--format confluence` if you only need one. See [USAGE.md](USAGE.md#sharing-artifacts-with-stakeholders) for the full walkthrough.

**Can I use it in any language?**
Yes. The agent detects the language of your first message and generates all artifacts in that language. Set it explicitly with `/principles` if you want to lock it regardless of the conversation language.

**Does it work offline / without internet?**
Yes. All skills are local Markdown files. The only network dependency is your AI agent itself (Claude Code, Codex CLI, etc.). No BA Toolkit component calls any external API.

**My domain isn't SaaS, Fintech, or E-commerce — can I still use it?**
Yes. Select "Custom" at `ba-toolkit init` (or pass `--domain custom`) and the skills use general interview questions. You can add your own domain in 30 minutes by creating one Markdown file — see [DOMAINS.md](DOMAINS.md).

**Can I go back and edit a previous artifact?**
Yes. Run `/revise [section]` at any step, or re-invoke the skill command (e.g., `/srs`) to regenerate from scratch. The agent warns before overwriting. Subsequent skills will read the updated version automatically.

**Does it work with smaller / faster models?**
The structured Markdown format and explicit cross-references help smaller models stay on track. For best results, use a model with a context window of at least 32k tokens — the later pipeline steps load multiple large artifacts simultaneously.

**How do I update BA Toolkit after a new version is released?**
See the update instructions in the [Install](../README.md#install) section of the main README.
