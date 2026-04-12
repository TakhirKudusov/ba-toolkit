# Language Rule

Template files, reference documents, and closing-message templates in BA Toolkit are written in English per the project's English-only file convention. When generating artifacts, chat summaries (closing messages), and interview questions, translate **all** of the following to the user's language:

## Translate to the user's language

- Section headings (`##` and `###`)
- Table headers (`| Column | ... |`)
- Field labels (`**Priority:**`, `**Description:**`, `**Type:**`, `**Source:**`, `**Linked FR:**`, `**Depends on:**`, `**Notes:**`, etc.)
- User story labels (`**As**` / `**I want to**` / `**so that**`)
- Acceptance criteria labels (`**Given**` / `**When**` / `**Then**`)
- Closing message labels ("Artifact saved:", "Available commands:", "Next step:", "What it produces:", "Quality check before moving on:", table headers in the commands table)
- Interview acknowledgments ("Got it — ...")
- Interview question text and option variants (per interview-protocol rule 11)

## Keep in English/ASCII regardless of artifact language

- Element IDs: FR-001, US-001, AC-001-01, NFR-001, UC-001, E-01, etc.
- File paths and filenames: `output/01_brief_my-app.md`
- Slash commands: `/brief`, `/srs`, `/clarify`, `/revise`, `/validate`, `/done`, etc.
- The `(recommended)` marker in interview option tables
- Letter IDs in option tables: `a`, `b`, `c`, `d`, `e`
- MoSCoW priority values: Must, Should, Could, Won't
- INVEST criteria names: Independent, Negotiable, Valuable, Estimable, Small, Testable
- Code identifiers, API endpoint paths, HTTP methods, status codes
- Technical terms that are industry-standard English (REST, JWT, OAuth, CRUD, etc.)
- ISO/IEEE standard references (IEEE 830, ISO 25010, ISO 31000, etc.)

## Why this rule exists

Without this rule, the AI copies English labels from templates verbatim and only translates body text, producing mixed-language artifacts — e.g., Russian content under English headings, or an English closing summary after a Russian-language interview. The rule ensures that every user-facing text element matches the artifact's language while technical identifiers stay stable for cross-referencing.
