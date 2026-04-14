# Troubleshooting

Common issues and fixes. For usage walkthroughs, see [USAGE.md](USAGE.md). For conceptual questions, see [FAQ.md](FAQ.md).

**Agent says it can't find the brief / SRS / previous artifact:**
The skill looks for files matching `01_brief_*.md` in the output directory. If the file was saved elsewhere, either move it or tell the agent the full path.

**Artifact was generated in the wrong language:**
Run `/principles` and set the artifact language explicitly. Then re-run the current step — all subsequent skills will use the language from `00_principles_{slug}.md`.

**Want to redo a step from scratch:**
Run the command again (e.g., `/srs`). The agent will warn that `02_srs_{slug}.md` already exists and offer to overwrite or create a new version.

**A domain reference is not loading:**
Check that `skills/references/domains/{domain}.md` exists and that the domain name in the brief matches exactly (`saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`, `edtech`, `govtech`, or `ai-ml` — lowercase with hyphens). The `custom` domain uses general interview questions and has no reference file.

**`/analyze` reports findings after you already fixed them:**
Run `/analyze` again — it always re-reads all artifacts fresh. Cached results are never used.

---

## First-time setup issues

**I typed `/brief` but nothing happened:**
1. Make sure you are typing in the AI agent's chat window (Claude Code, Cursor, etc.), not in a regular terminal.
2. Wait 10–15 seconds — the first response can take longer while the agent loads the skill files.
3. If nothing appears after 30 seconds, check that BA Toolkit skills are installed. Run `ba-toolkit status` in your terminal to verify.
4. Try reloading the agent window (Cmd+Shift+P → "Reload" in Cursor, or restart `claude` in terminal).

**Agent says "skill not found" or "command not recognized":**
The skills may not be installed in the agent's skills directory. Run:
```bash
ba-toolkit install --for claude-code   # or: cursor, codex, gemini, windsurf
```
Then reload the agent window. If the problem persists, run `ba-toolkit status` to check whether the skills directory is correct.

**`npx` or `ba-toolkit` command not found:**
You need Node.js 18 or later installed. Open a terminal and type `node --version`. If you get an error, download Node.js from [nodejs.org](https://nodejs.org/) (LTS version, accept all defaults). After installing, close and reopen your terminal, then try again.

**Init command fails on Windows:**
If `npx '@kudusov.takhir/ba-toolkit' init` fails with a permission or path error, try running the terminal as Administrator, or use the PowerShell fallback script:
```powershell
irm https://raw.githubusercontent.com/TakhirKudusov/ba-toolkit/main/init.ps1 | iex
```

**Agent takes too long to respond (over 60 seconds):**
Large artifacts (especially after `/apicontract` or `/wireframes`) require significant context. Make sure your AI agent has at least 32k tokens of context window available. If the agent times out, try running the skill again — it will pick up where it left off by reading existing artifacts.

**AGENTS.md not found error:**
The agent expects to find `AGENTS.md` in the current working directory (the project root). Make sure you opened the agent at the project root where `ba-toolkit init` was run, not inside `output/`. If you are inside `output/`, the agent will check `../AGENTS.md` automatically.

**Artifacts are empty or contain only headers:**
This usually means the agent's context window was exhausted mid-generation. Try:
1. Run the skill again — it will detect the incomplete file and offer to regenerate.
2. If the problem recurs, use `/split` to break large sections into smaller parts, or skip optional pipeline steps to reduce context usage.
