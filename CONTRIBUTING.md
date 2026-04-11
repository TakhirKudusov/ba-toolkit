# Contributing

Contributions are welcome. The most useful additions are:

**New domains** (highest impact, minimal code):
One Markdown file + one line in `bin/ba-toolkit.js`. Follow the step-by-step checklist in [docs/DOMAINS.md](docs/DOMAINS.md#step-by-step-checklist).

**Skill improvements:**
Edit the relevant `skills/{name}/SKILL.md`. Keep changes backward-compatible — avoid renaming sections or changing output file names, as other skills depend on them.

**Bug reports:**
Open a GitHub issue with: the skill name, the command you ran, the agent/platform you used, and what happened vs. what you expected.

## Guidelines

- One PR per domain or skill.
- Test the skill end-to-end before submitting (run the full command, check the output file).
- Keep the style consistent with existing skills: formal, neutral, no emoji in artifact body, language follows user input.
