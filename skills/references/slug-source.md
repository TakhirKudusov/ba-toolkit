# Slug source — single rule

`ba-toolkit init` is the **single source of truth** for the project slug. It writes the slug into the managed block of `AGENTS.md` at the project root:

```
<!-- ba-toolkit:begin managed -->
...
**Slug:** new-test-app
...
<!-- ba-toolkit:end managed -->
```

Every skill that emits a file whose name contains `{slug}` (e.g. `01_brief_{slug}.md`, `02_srs_{slug}.md`, `00_analyze_{slug}.md`) **must read the slug from this line and use it verbatim**. Do not invent a slug, do not re-derive it from the project name, do not pick one based on conversation context.

## How to read the slug

1. Locate `AGENTS.md`. Look in `cwd` first; if `cwd` is `output/`, check `../AGENTS.md`.
2. Find the managed block delimited by `<!-- ba-toolkit:begin managed -->` and `<!-- ba-toolkit:end managed -->`.
3. Inside the block, parse the line that starts with `**Slug:**`. Strip whitespace. The remainder is the slug.
4. Use that exact string as `{slug}` in every output filename for this run.

## Fallbacks

- **No `AGENTS.md` at the project root.** The project was not scaffolded with `ba-toolkit init`. Stop and tell the user to run `ba-toolkit init` first. Do not invent a slug to keep going.
- **`AGENTS.md` exists but has no managed block** (legacy file the user authored manually). Look for `01_brief_*.md` in `output/`; the part between `01_brief_` and `.md` is the slug. If no brief file exists either, ask the user for the slug explicitly — do not invent one.
- **`AGENTS.md` managed block is present but the `**Slug:**` line is missing or empty.** Treat as a corrupted scaffold. Tell the user to re-run `ba-toolkit init` to repair `AGENTS.md`. Do not invent a slug.

## Why

Before v4.0, `/brief` was the entry point and decided the slug. In v4.0, `ba-toolkit init` runs first and fixes the slug at scaffold time, so that `AGENTS.md` and the file names in `output/` are guaranteed to agree from the very first artifact. Skills that still derive a slug locally (from the project name or from conversation context) silently desynchronise the project: `AGENTS.md` says one thing, the artifact filenames say another, downstream skills pick up the wrong slug, and the user sees `01_brief_knitted-socks.md` next to `**Slug:** new-test-app`.
