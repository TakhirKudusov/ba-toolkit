# Export Template

Template showing the structure of `/export` output files for each supported format.
Actual values are filled in by the skill based on the project's artifacts.

---

## Jira JSON — `export_{slug}_jira.json`

```json
{
  "projects": [
    {
      "key": "PROJ",
      "issues": [
        {
          "summary": "US-001: User can register with email and password",
          "description": {
            "type": "doc",
            "version": 1,
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "As a visitor, I want to register with my email and password, so that I can access my personal account." }]
              },
              {
                "type": "heading",
                "attrs": { "level": 3 },
                "content": [{ "type": "text", "text": "Acceptance Criteria" }]
              },
              {
                "type": "bulletList",
                "content": [
                  { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Given I am on the registration page, When I submit a valid email and password, Then my account is created and I am redirected to the dashboard." }] }] },
                  { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Given I submit an email that already exists, When the form is submitted, Then I see an error message 'Email already in use'." }] }] }
                ]
              }
            ]
          },
          "issuetype": { "name": "Story" },
          "priority": { "name": "High" },
          "labels": ["nova-analytics", "E-01"],
          "customfield_10016": 3,
          "customfield_10014": null
        }
      ]
    }
  ]
}
```

**Import:** Jira → Project Settings → Issue Import → JSON Import, or `jira import --file export_{slug}_jira.json`

---

## GitHub Issues JSON — `export_{slug}_github.json`

```json
[
  {
    "title": "US-001: User can register with email and password",
    "body": "## User Story\n\nAs a **visitor**, I want to **register with my email and password**, so that **I can access my personal account**.\n\n---\n\n## Acceptance Criteria\n\n**Scenario 1 — Successful registration**\n- Given I am on the registration page\n- When I submit a valid email and password\n- Then my account is created and I am redirected to the dashboard\n\n**Scenario 2 — Duplicate email**\n- Given I submit an email that already exists\n- When the form is submitted\n- Then I see an error message 'Email already in use'\n\n---\n\n**FR Reference:** FR-001\n**Priority:** Must\n**Estimate:** 3 SP",
    "labels": ["epic:E-01", "user-story", "priority:must"],
    "milestone": "MVP"
  }
]
```

**Import via `gh` CLI:**
```bash
cat export_{slug}_github.json | jq -c '.[]' | while read issue; do
  title=$(echo "$issue" | jq -r '.title')
  body=$(echo "$issue" | jq -r '.body')
  labels=$(echo "$issue" | jq -r '.labels | join(",")')
  gh issue create --repo owner/repo --title "$title" --body "$body" --label "$labels"
done
```

---

## Linear JSON — `export_{slug}_linear.json`

```json
{
  "issues": [
    {
      "title": "US-001: User can register with email and password",
      "description": "**As a** visitor, **I want to** register with my email and password, **so that** I can access my personal account.\n\n### Acceptance Criteria\n\n**Scenario 1 — Successful registration**\nGiven I am on the registration page, When I submit a valid email and password, Then my account is created and I am redirected to the dashboard.\n\n**Scenario 2 — Duplicate email**\nGiven I submit an email that already exists, When the form is submitted, Then I see an error message 'Email already in use'.",
      "priority": 2,
      "estimate": 3,
      "labelNames": ["E-01", "user-story"],
      "stateName": "Backlog"
    }
  ]
}
```

**Priority values:** `1` = Urgent · `2` = High · `3` = Medium · `4` = Low · `0` = No priority

**Import:** Use the Linear API (`POST https://api.linear.app/graphql` with `issueCreate` mutation per issue) or the Linear SDK.

---

## CSV — `export_{slug}_stories.csv`

```
ID,Title,Epic,Role,Action,Benefit,Priority,Estimate,FR Reference,AC Summary
US-001,"User can register with email and password",E-01,"visitor","register with my email and password","access my personal account",Must,3 SP,FR-001,"Given valid email+password → account created; Given duplicate email → error shown"
US-002,"User can log in with existing credentials",E-01,"registered user","log in with email and password","access my account without re-registering",Must,2 SP,FR-002,"Given valid credentials → redirected to dashboard; Given wrong password → error shown"
```

Compatible with: Jira CSV Import · Trello · Asana · Monday.com · Google Sheets
