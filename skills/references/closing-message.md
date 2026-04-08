# Closing Message Template

After saving an artifact, every BA Toolkit skill presents a short summary block to the user in the chat (not inside the saved file). This ensures a consistent pipeline experience across all steps.

## Format

Present the block in the same language as the artifact.

```
Artifact saved: `{file_path}`

{Brief summary — 2–4 sentences or bullets covering:
 total count of key elements generated (e.g., "18 FRs across 3 roles"),
 main decisions captured during the interview,
 any back-references updated in prior artifacts.}

Available commands:
  /clarify [focus]    — targeted ambiguity pass: vague terms, missing metrics, conflicting rules
  /revise [section]   — rewrite a section with your feedback
  /expand [section]   — add more detail to a section
  /validate           — check completeness and cross-artifact consistency
  /done               — finalize this artifact

Next step: /{next_command}
```

## Rules

- `{file_path}` is the full path where the artifact was saved.
- The summary is generated dynamically — do not repeat boilerplate; mention actual numbers and decisions.
- The "Next step" line is omitted for cross-cutting commands (/trace, /clarify, /analyze) that do not advance the pipeline.
- For `/wireframes` (last pipeline step), replace "Next step" with: `Pipeline complete. Run /trace to check full coverage.`
- The block is a chat message, not part of the saved Markdown file.
