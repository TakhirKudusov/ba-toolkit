# Troubleshooting

Common issues and fixes. For usage walkthroughs, see [USAGE.md](USAGE.md). For conceptual questions, see [FAQ.md](FAQ.md).

**Agent says it can't find the brief / SRS / previous artifact:**
The skill looks for files matching `01_brief_*.md` in the output directory. If the file was saved elsewhere, either move it or tell the agent the full path.

**Artifact was generated in the wrong language:**
Run `/principles` and set the artifact language explicitly. Then re-run the current step — all subsequent skills will use the language from `00_principles_{slug}.md`.

**Want to redo a step from scratch:**
Run the command again (e.g., `/srs`). The agent will warn that `02_srs_{slug}.md` already exists and offer to overwrite or create a new version.

**A domain reference is not loading:**
Check that `skills/references/domains/{domain}.md` exists and that the domain name in the brief matches exactly (`igaming`, `fintech`, `saas`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, or `real-estate` — lowercase with hyphens).

**`/analyze` reports findings after you already fixed them:**
Run `/analyze` again — it always re-reads all artifacts fresh. Cached results are never used.
