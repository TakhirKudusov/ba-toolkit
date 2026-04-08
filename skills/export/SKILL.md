---
name: export
description: >
  Export BA Toolkit artifacts to external formats for import into issue trackers and project management tools. Use on /export command, or when the user asks to "export to Jira", "create GitHub issues", "export stories", "generate Linear tickets", "export to CSV", "import into tracker". Run after /stories and /ac for full export with acceptance criteria.
---

# /export — Artifact Export

Converts User Stories (and optionally Acceptance Criteria) into structured output files ready for import into issue trackers and project management tools.

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

If the format is not specified, ask:

1. **Target tool:** Jira, GitHub Issues, Linear, CSV, or other?
2. **Scope:** All stories, a specific epic, or specific story IDs?
3. **Include AC?** Embed acceptance criteria in the issue body? (default: yes)
4. **Jira-specific:** Project key (e.g., `PROJ`)? Epic link field name (default: `customfield_10014`)? Story Points field name (default: `story_points`)?
5. **GitHub-specific:** Repository (e.g., `owner/repo`)? Label prefix for epics (e.g., `epic:`)? Milestone name (optional)?

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

Array of issue objects, one per story. Compatible with `gh` CLI batch import.

```json
[
  {
    "title": "US-001: {Story title}",
    "body": "## User Story\n\nAs a **{role}**, I want to **{action}**, so that **{benefit}**.\n\n---\n\n## Acceptance Criteria\n\n**Scenario 1 — {name}**\n- Given {precondition}\n- When {action}\n- Then {result}\n\n---\n\n**FR Reference:** FR-{NNN}\n**Priority:** {Must | Should | Could | Won't}\n**Estimate:** {N SP | —}",
    "labels": ["{epic-label}", "user-story", "{priority-label}"],
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
ID,Title,Epic,Role,Action,Benefit,Priority,Estimate,FR Reference,AC Summary
US-001,"{Story title}",E-01,"{role}","{action}","{benefit}",Must,3 SP,FR-001,"{first AC scenario summary}"
```

Compatible with Jira CSV import, Trello, Asana, Monday.com, and Google Sheets.

---

## Output

Save the export file to the output directory alongside the artifacts:

```
output/{slug}/export_{slug}_{format}.json
output/{slug}/export_{slug}_stories.csv   (CSV format)
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

Generate only valid JSON or CSV. Do not include comments inside JSON files. Use double quotes for all JSON strings. Escape newlines in description fields as `\n`. Generate output in English regardless of the artifact language (issue trackers expect English field values unless explicitly told otherwise).
