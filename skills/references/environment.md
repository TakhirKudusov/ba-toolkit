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

`ba-toolkit init` creates `AGENTS.md` at the project root and `output/` for artifacts. One directory = one project.

```
repo/
  AGENTS.md
  output/
    01_brief_my-app.md
    02_srs_my-app.md
    03_stories_my-app.md
    ...
```

The user opens their AI agent at the project root. Skills find `AGENTS.md` in the current working directory and save artifacts to `output/`.

## Detection rule for skills

When a skill needs to find the project's `AGENTS.md` (for example, to update its `## Pipeline Status` table after generating an artifact):

1. Check `cwd/AGENTS.md` first. If present, that's the project's file.
2. If cwd is `output/`, check `../AGENTS.md` (the project root).
3. If neither exists, warn the user that the project was likely not scaffolded with `ba-toolkit init` and tell them to run it.

Never create `AGENTS.md` from inside a skill — that file is owned by `ba-toolkit init`.
