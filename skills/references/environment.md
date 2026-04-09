# Environment Detection

This file defines how skills determine the output directory. Each platform has its own conventions. Skills read this file at startup and apply the matching rule.

## Platforms

### Claude.ai (web / desktop)
- **Output directory:** `/mnt/user-data/outputs/`
- **File access:** uploads available at `/mnt/user-data/uploads/`

### Claude Code CLI
- **Output directory:** current working directory or user-specified path.
- **File access:** full filesystem access.

### OpenAI Codex CLI
- **Output directory:** current working directory.
- **File access:** project directory scope.

### Gemini CLI
- **Output directory:** current working directory.
- **File access:** project directory scope.

### Cursor / Windsurf / Aider / Other agents
- **Output directory:** current working directory or project root.
- **File access:** varies by platform; typically project-scoped.

## Detection logic

1. If `/mnt/user-data/outputs/` exists and is writable → Claude.ai environment. Save there.
2. Otherwise → CLI or agent environment. Save to the current working directory or the path specified by the user.

Skills should not hardcode paths. They reference this file and apply the detection logic above.

## Output folder structure

**v3.1+ default — per-project subfolder.** `ba-toolkit init` creates `output/<slug>/` and writes the project's `AGENTS.md` inside it. All artifacts for that project also live there:

```
repo/
  output/
    my-app/                        ← project A
      AGENTS.md
      00_principles_my-app.md
      01_brief_my-app.md
      02_srs_my-app.md
      ...
    other-project/                 ← project B
      AGENTS.md
      01_brief_other-project.md
      ...
```

The user opens their AI agent inside one of those subfolders (`cd output/my-app && claude` or equivalent for the agent of choice). With cwd set to the project subfolder, every skill — including those that look for prior artifacts via `01_brief_*.md` glob — sees only that project's files. Two agent windows in the same repo, each `cd`-ed into a different `output/<slug>/`, work on two completely independent projects with zero cross-talk.

**Legacy v3.0 single-project layout — still supported.** Projects scaffolded before v3.1 have a single `AGENTS.md` at the repo root and artifacts saved flat under `output/`:

```
repo/
  AGENTS.md                        ← legacy single-project
  output/
    01_brief_my-app.md
    02_srs_my-app.md
    ...
```

When a skill is run with cwd set to the repo root and finds no `AGENTS.md` next to the artifacts, it walks up the directory tree to find the legacy root `AGENTS.md`. New projects scaffolded with v3.1+ should always use the per-project subfolder layout.

## Detection rule for skills

When a skill needs to find the project's `AGENTS.md` (for example, to update its `## Pipeline Status` table after generating an artifact):

1. Check `cwd/AGENTS.md` first. If present, that's the project's file.
2. Otherwise walk up the directory tree until you find an `AGENTS.md` (legacy v3.0 fallback).
3. If neither exists, warn the user that the project was likely not scaffolded with `ba-toolkit init` and tell them to run it.

Never create `AGENTS.md` at the repo root from inside a skill — that file is owned by `ba-toolkit init`.
