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

## Output folder structure (optional)

By default, all artifacts are saved flat in the output directory:

```
output_dir/
  00_principles_dragon-fortune.md
  01_brief_dragon-fortune.md
  02_srs_dragon-fortune.md
  ...
```

If the user prefers a project-scoped subfolder (useful when managing multiple projects in the same directory), set `output_mode: subfolder` in `00_principles_{slug}.md` section 7. In this mode, all artifacts are saved under `output_dir/{slug}/`:

```
output_dir/
  dragon-fortune/
    00_principles_dragon-fortune.md
    01_brief_dragon-fortune.md
    02_srs_dragon-fortune.md
    ...
```

Skills check `00_principles_{slug}.md` for this setting. If principles do not exist or the setting is absent, the default (flat) layout is used.
