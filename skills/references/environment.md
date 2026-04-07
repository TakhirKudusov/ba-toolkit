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
