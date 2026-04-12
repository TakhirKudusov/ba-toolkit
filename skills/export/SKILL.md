---
name: export
description: >
  Export BA Toolkit artifacts to external formats for import into issue trackers and project management tools. Use on /export command, or when the user asks to "export to Jira", "create GitHub issues", "export stories", "generate Linear tickets", "export to CSV", "import into tracker". Run after /stories and /ac for full export with acceptance criteria.
---

# /export — Artifact Export

Utility skill. Converts User Stories (and optionally Acceptance Criteria) into structured output files ready for import into issue trackers and project management tools.

## Syntax

```
/export [format] [optional: scope]
```

Examples:
- `/export` — interactive: ask which format
- `/export jira` — export all stories as Jira-compatible JSON
- `/export github` — export all stories as GitHub Issues JSON (via `gh` CLI or API)
- `/export linear` — export all stories as Linear GraphQL mutation payload
- `/export csv` — export all stories as CSV (universal fallback)
- `/export jira E-01` — export only Epic E-01 stories
- `/export github US-007,US-008` — export specific stories

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply ID conventions and language settings.
1. Load `03_stories_{slug}.md` — required. If it does not exist, stop and ask the user to run `/stories` first.
2. Load `05_ac_{slug}.md` if it exists — AC scenarios will be embedded in issue descriptions.
3. Load `00_estimate_*.md` or read `**Estimate:**` fields from stories — include story points in the export if available.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Format interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended), render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/export` (e.g., `/export jira PROJ`, `/export github owner/repo`), parse it as a format + target hint and skip the matching questions.

If the format is not specified, ask the following (skip any question already answered by inline context):

1. **Target tool:** Jira / GitHub Issues / Linear / CSV / Other? **Recommended:** Jira (most enterprise teams).
2. **Scope:** All stories / a specific epic / specific story IDs?
3. **Include AC?** Embed acceptance criteria in the issue body? **Recommended:** yes — without AC, the imported issue is just a story title.
4. **Jira-specific:** Project key (e.g., `PROJ`)? Epic link field name (default: `customfield_10014`)? Story Points field name (default: `customfield_10016`)?
5. **GitHub-specific:** Repository (e.g., `owner/repo`)? Label prefix for epics (e.g., `epic:`)? Milestone name (optional)?

The exported issue body now includes **all v3.5.0+ stories template fields**: Persona (named, with context), Business Value Score, Size, Linked FR, Depends on (rendered as a "Blocked by" link in trackers that support it), Definition of Ready, INVEST self-check. Trackers that support custom fields (Jira, Linear) get them as separate fields; CSV gets extra columns; GitHub Issues embeds them in the issue body.

## Export formats

---

### Format: Jira (JSON)

Output file: `export_{slug}_jira.json`

```json
{
  "projects": [
    {
      "key": "{JIRA_PROJECT_KEY}",
      "issues": [
        {
          "summary": "US-001: {Story title}",
          "description": {
            "type": "doc",
            "version": 1,
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "As a {role}, I want to {action}, so that {benefit}." }]
              },
              {
                "type": "heading",
                "attrs": { "level": 3 },
                "content": [{ "type": "text", "text": "Acceptance Criteria" }]
              },
              {
                "type": "bulletList",
                "content": [
                  { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Given ... When ... Then ..." }] }] }
                ]
              }
            ]
          },
          "issuetype": { "name": "Story" },
          "priority": { "name": "{Must→High | Should→Medium | Could→Low | Won't→Lowest}" },
          "labels": ["{slug}", "{epic-id}"],
          "customfield_10016": {story_points_or_null},
          "customfield_10014": "{epic_link_or_null}"
        }
      ]
    }
  ]
}
```

**Priority mapping:**
- Must → `High`
- Should → `Medium`
- Could → `Low`
- Won't → `Lowest`

**Instructions to include after the file:**
```
Import via: Jira → Project Settings → Issue Import → JSON Import
Or via CLI: jira import --file export_{slug}_jira.json
```

---

### Format: GitHub Issues (JSON)

Output file: `export_{slug}_github.json`

Array of issue objects, one per story. Compatible with `gh` CLI batch import. The body embeds all v3.5.0+ stories template fields since GitHub Issues has no custom field support.

```json
[
  {
    "title": "US-001: {Story title}",
    "body": "## User Story\n\nAs **{persona — named persona with role and context}**, I want to **{action}**, so that **{benefit}**.\n\n---\n\n## Acceptance Criteria\n\n**Scenario 1 — {name}** *(AC-001-01)*\n- Given {precondition}\n- When {action}\n- Then {result}\n\n---\n\n## Traceability\n\n- **Linked FR:** FR-{NNN}\n- **Linked Use Case:** UC-{NNN}\n- **Linked Acceptance Criteria:** AC-001-01, AC-001-02, AC-001-03\n- **Linked NFR:** NFR-{NNN} (if applicable)\n- **Linked Wireframe:** WF-{NNN} (if applicable)\n\n---\n\n## Metadata\n\n- **Priority:** {Must | Should | Could | Won't}\n- **Business Value Score:** {1–5}\n- **Size:** {XS | S | M | L | XL}\n- **Estimate:** {N SP | —}\n- **Depends on:** US-{NNN}, US-{NNN}\n- **INVEST self-check:** Independent ✓ · Negotiable ✓ · Valuable ✓ · Estimable ✓ · Small ✓ · Testable ✓",
    "labels": ["{epic-label}", "user-story", "{priority-label}", "value:{1-5}", "size:{xs-xl}"],
    "milestone": "{milestone-name-or-null}"
  }
]
```

**Label strategy:**
- Epic label: `epic:{epic-id}` (e.g., `epic:E-01`)
- Priority label: `priority:must` / `priority:should` / `priority:could`
- Type label: `user-story`

**Instructions to include after the file:**
```bash
# Create issues via GitHub CLI (requires: gh auth login)
cat export_{slug}_github.json | jq -c '.[]' | while read issue; do
  title=$(echo "$issue" | jq -r '.title')
  body=$(echo "$issue" | jq -r '.body')
  labels=$(echo "$issue" | jq -r '.labels | join(",")')
  gh issue create --repo {owner/repo} --title "$title" --body "$body" --label "$labels"
done
```

---

### Format: Linear (JSON)

Output file: `export_{slug}_linear.json`

```json
{
  "issues": [
    {
      "title": "US-001: {Story title}",
      "description": "**As a** {role}, **I want to** {action}, **so that** {benefit}.\n\n### Acceptance Criteria\n\n{AC scenarios in markdown}",
      "priority": "{0=No priority | 1=Urgent | 2=High | 3=Medium | 4=Low}",
      "estimate": {story_points_or_null},
      "labelNames": ["{epic-id}", "user-story"],
      "stateName": "Backlog"
    }
  ]
}
```

**Priority mapping:**
- Must → `2` (High)
- Should → `3` (Medium)
- Could → `4` (Low)
- Won't → `0` (No priority)

**Instructions to include after the file:**
```
Import via Linear's CSV import or use the Linear API:
POST https://api.linear.app/graphql with the issueCreate mutation per issue.
Linear does not have a native bulk JSON import — use the Linear SDK or Zapier.
```

---

### Format: CSV

Output file: `export_{slug}_stories.csv`

```
ID,Title,Epic,Persona,Action,Benefit,Priority,Value,Size,Estimate,FR,UC,AC,NFR,WF,Depends on,AC Summary
US-001,"{Story title}",E-01,"{persona name + role + context}","{action}","{benefit}",Must,5,M,3 SP,FR-001,UC-001,"AC-001-01;AC-001-02;AC-001-03",NFR-002,WF-005,—,"{first AC scenario summary}"
```

Compatible with Jira CSV import, Trello, Asana, Monday.com, and Google Sheets. Includes all v3.5.0+ stories template fields plus full cross-artifact traceability columns (FR / UC / AC / NFR / WF / Depends on) so a downstream tool can re-establish links without re-reading the source artifacts.

---

## Output

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

Save the export file to the output directory alongside the artifacts:

```
output/export_{slug}_{format}.json
output/export_{slug}_stories.csv   (CSV format)
```

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Format exported.
- Number of stories exported (and any skipped — e.g., "Won't" priority excluded by default).
- Whether AC was included.
- Copy-paste import instructions specific to the chosen format.

Available commands: `/export [format]` (export in another format) · `/estimate` · `/handoff`

## Style

Generate only valid JSON or CSV. Do not include comments inside JSON files. Use double quotes for all JSON strings. Escape newlines in description fields as `\n`. Generate output in English regardless of the artifact language (issue trackers expect English field values unless explicitly told otherwise). Chat messages (interview questions, closing summary) follow `references/language-rule.md` — use the user's language.
