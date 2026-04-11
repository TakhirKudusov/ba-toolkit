---
name: publish
description: >
  Bundle BA Toolkit artifacts into import-ready files for documentation tools — Notion (markdown bundle) and Confluence (HTML bundle). Use on /publish command, or when the user asks to "export to Notion", "export to Confluence", "publish artifacts", "share with stakeholders", "import into Notion", "import into Confluence", "send the docs to product team". Utility skill — does not advance the pipeline.
---

# /publish — Notion / Confluence Publish

Utility skill. Wraps the `ba-toolkit publish` CLI subcommand, which converts the markdown artifacts in the current `output/` folder into folders ready to be dragged into Notion's **Import → Markdown & CSV** dialog or zipped and uploaded via Confluence's **Space settings → Content tools → Import → HTML** tool.

The conversion happens entirely on disk — **no API calls, no tokens, no network**. The user does the actual upload manually using each tool's native importer.

## When to use

After generating at least one pipeline artifact (`01_brief_*.md` or later), when the user wants to share the artifacts with non-developer stakeholders who live in Notion or Confluence rather than in the codebase.

This is **not** the same as `/export`. `/export` produces JSON/CSV for issue trackers (Jira, GitHub Issues, Linear). `/publish` produces markdown/HTML page bundles for documentation tools (Notion, Confluence).

## Workflow

### 1. Environment detection

The `ba-toolkit publish` subcommand uses the current working directory as the source — no `references/environment.md` lookup needed. Confirm with the user that they are inside their project's `output/` folder before running it. If they are not, ask them to `cd output` first.

### 2. Pipeline check

Verify at least one BA Toolkit artifact exists in cwd by listing files matching `[0-9][0-9]*_*.md` (e.g. `01_brief_<slug>.md`). If no artifacts are present, stop and tell the user to run `/brief` (or any later pipeline step) first — there is nothing to publish.

### 3. Format selection

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/publish` (e.g., `/publish notion`, `/publish to confluence`, `/publish both`), parse it as the format choice and skip the question entirely.

If no format is given, ask:

> Which target do you want?
>
> | ID | Variant                                              |
> |----|------------------------------------------------------|
> | a  | Both Notion and Confluence (recommended)           |
> | b  | Notion only                                          |
> | c  | Confluence only                                      |
> | d  | Other — type your own answer                         |

Map the answer to a `--format` value: `a` → `both`, `b` → `notion`, `c` → `confluence`. For free-text answers, accept the verbatim string only if it is one of `notion`, `confluence`, or `both`; otherwise re-ask.

### 4. Execution

Invoke the CLI subcommand via the agent's Bash tool from the project's `output/` directory:

```bash
ba-toolkit publish --format <choice>
```

Optional flags the user might ask for:

- `--out <path>` — write the bundles somewhere other than `./publish/`.
- `--dry-run` — preview the file list without writing anything.

Capture stdout from the command and report it back to the user. The CLI prints a summary of bundle paths, file counts, and the next manual import steps.

### 5. Closing message

Utility skill closing block (no `Next step:` line — see `references/closing-message.md` "Utility skills" section). Show:

- Saved bundle paths and counts per format (taken verbatim from the CLI's stdout summary).
- The two static "Next steps" lines:
  - **Notion:** drag-and-drop `publish/notion/` into "Import → Markdown & CSV" in your Notion workspace.
  - **Confluence:** zip `publish/confluence/` and upload via "Space settings → Content tools → Import → HTML".
- Optional one-line "Re-run after pipeline updates" hint: re-running `ba-toolkit publish` overwrites the previous bundle, so users can publish again after `/clarify`, `/revise`, or any later pipeline step.

Available commands for this skill: `/publish [format]`

Do not build a `Next step:` block — `/publish` is cross-cutting and does not advance the pipeline.

## Style

Formal, neutral. No emoji. Generate the chat reply in the language of the user's first message. Keep the report under 10 lines: paths, counts, two next-step lines, optional re-run hint.
