# BA Toolkit — Future Improvements

Backlog of planned improvements, ordered by execution sequence.
Items marked ✅ are complete and kept here for reference.

---

## Recently completed

| # | Item | Version |
|---|------|---------|
| ✅ | Integration test suite for CLI subcommands + test gate in release/validate workflows (blocks npm publish on test failure) | Unreleased |
| ✅ | Templates for all 16 artifacts (`skills/references/templates/`) | v1.1.0 |
| ✅ | 6 new domain references (ecommerce, healthcare, logistics, on-demand, social-media, real-estate) | v1.1.0 |
| ✅ | `/estimate` skill — Story Points / T-shirt sizing with split recommendations | v1.1.0 |
| ✅ | `/glossary` skill — unified project glossary with terminology drift detection | v1.1.0 |
| ✅ | `/export` skill — Jira / GitHub Issues / Linear / CSV export | v1.1.0 |
| ✅ | `init.ps1` / `init.sh` — project initialiser scripts | v1.1.0 |
| ✅ | GitHub Actions CI workflow — artifact and skill validation on PR | v1.1.0 |
| ✅ | `CHANGELOG.md` — Keep a Changelog + SemVer format | v1.1.0 |

---

## High priority

Items are sequential — each unblocks the next.

### ✅ 1. Quick fixes

| # | Item | Effort |
|---|------|--------|
| ✅ | Fix README intro: says "16 interconnected skills" — should be 19 | 5 min |
| ✅ | `skills/references/templates/export-template.md` — missing template for `/export` output | ~1 h |
| ✅ | `COMMANDS.md` — one-page cheat sheet: all 19 skills + subcommands with syntax and one-liners | ~1 h |

---

### ✅ 2. GitHub release workflow

**What:** `.github/workflows/release.yml` that triggers on version tags (`v*.*.*`) and creates a GitHub Release with release notes auto-generated from `CHANGELOG.md`.

**Why:** Gives users a clear versioned release to reference when they install or update the toolkit. Also required to trigger `npm publish` automatically (item 5). v1.1.0 exists in CHANGELOG but has no GitHub Release yet.

**Effort:** Low.

---

### ✅ 3. `/risk` skill

**What:** Dedicated risk register artifact: extract risks from Brief, SRS, and Research, generate `00_risks_{slug}.md` with a probability × impact matrix, risk owner, and mitigation strategy per item.

**Why:** Risk management is a core BA deliverable. Currently risks are buried inside Brief and SRS with no dedicated tracking or prioritisation. A standalone artifact makes them reviewable and actionable.

**Structure:**
- Risk ID (RISK-01, RISK-02, …)
- Category (technical / business / compliance / external)
- Probability (1–5) × Impact (1–5) = Score
- Status (open / mitigated / accepted / closed)
- Mitigation and contingency

**Effort:** Low–Medium (~1 day, follows the same skill pattern as `/glossary`).

---

### ✅ 4. `/sprint` skill

**What:** Generate a sprint plan from estimated User Stories: group by priority and team capacity, output sprint goal, velocity, and story list per sprint. Generates `00_sprint_{slug}.md`.

**Why:** Natural continuation after `/estimate` — closes the loop from "idea → spec → estimate → sprint". Without this step the user has to manually organise stories into sprints.

**Dependencies:** Requires `/estimate` output. Works best after `/risk` is done (risk-weighted prioritisation).

**Effort:** Low–Medium (~1 day, same pattern as `/glossary` and `/risk`).

---

## Medium priority

### 8. More domain references

**Candidates (in order of demand):**
- `edtech.md` — online courses, LMS, adaptive learning, assessment tools.
- `hrtech.md` — ATS, HRIS, performance management, employee portals.
- `govtech.md` — citizen portals, e-government services, public procurement.
- `gaming.md` — video games (not iGaming): game backend, leaderboards, matchmaking, in-game economy.
- `proptech.md` — property valuation tools, construction project management (distinct from real-estate portal).
- `cybersecurity.md` — security products: SIEM, vulnerability management, identity platforms.

**Effort per domain:** Low (~180 lines each, following existing template). Can be done incrementally — one domain between larger tasks.

---

## Low priority / Deferred

### 9. MCP server

**What:** A Model Context Protocol server that exposes BA Toolkit skills as native MCP tools, allowing Claude Desktop (without an IDE) to use the toolkit via `mcp_ba_brief`, `mcp_ba_srs`, etc.

**Why deferred:** MCP adds a separate Node.js/Python project (~500 lines of code) that needs installation, running, and maintenance. Current users (Claude Code, Cursor, Windsurf) already have native file access — MCP would only add value for Claude Desktop users and CI/automation scenarios.

**Revisit when:** The Claude Desktop user base grows significantly, or when a CI/automation use case becomes concrete.

**Effort:** High.

---

### 10. Notion / Confluence export format

**What:** Add `notion` and `confluence` as export targets in `/export`. Notion uses a block-based JSON API; Confluence uses Atlassian's storage format (XHTML-based).

**Why deferred:** Both require platform-specific API knowledge and auth setup. Lower demand than Jira/GitHub/Linear.

**Effort:** Medium.

---

### 11. Video walkthrough / GIF demo

**What:** A short screen recording (2–3 min) showing the full pipeline from `/brief` to `/handoff` for the Dragon Fortune example project. Linked from the README hero section.

**Why deferred:** Requires a finished example project (item 5) first.

**Effort:** Medium (after item 5 is done).

---

## Ideas parking lot

Items noted for future consideration but not yet assessed:

- **`/changelog`** — track changes between artifact versions: diff `v1` vs `v2` of an artifact and generate a human-readable delta.
- **OpenAI Assistants API config** — `assistant.json` config files for each skill, enabling use via the Assistants API without file installation.
- **Linter config** — `ba-toolkit.config.json` to customise validation rules (e.g. required NFR categories per domain, minimum AC scenarios per story). Becomes meaningful once the user base is large enough to have divergent conventions.

Bugs and improvements:
1. ✅ `init` now merges `AGENTS.md` via `mergeAgentsMd` + managed-block anchors. Legacy files without anchors are preserved untouched. Done in Unreleased.
2. Invalid input during interactive init crashes the script. Split into:
   - **2a.** ✅ Non-flag interactive path re-prompts on invalid input via `promptUntilValid(question, resolver, { maxAttempts = 3 })`. Applied to domain menu, agent menu, and manual slug entry. Done in Unreleased. Also uncovered and fixed a piped-input race in `prompt()` (readline `'line'` events were being dropped between consecutive `rl.question()` calls) — prompt now owns the `'line'` event and buffers lines in an internal queue.
   - **2b.** ✅ Arrow-key menu navigation for domain/agent selection. `↑/↓` + `j/k`, `1-9` jump, `Enter`, `Esc`/`Ctrl+C`. TTY-only, automatic numbered fallback under non-TTY/`TERM=dumb`. Three-layer design: `menuStep` (pure state machine), `renderMenu` (pure renderer), `runMenuTty` (I/O glue). 18 new unit tests cover the pure layers; the I/O glue is manually smoke-tested. Done in Unreleased.
3. ✅ Print the ASCII `ba-toolkit` banner at the start of `init`. Done in Unreleased: `printBanner()` gated on `process.stdout.isTTY`, not shown in CI/piped output.
4. ✅ AI interview skills follow the new `skills/references/interview-protocol.md`: one question at a time, 3–5 domain-appropriate options, free-text "Other" option, wait for answer. Applied to all 12 interview-phase skills. Guarded by unit test (`test/cli.test.js`) and CI validation step (`.github/workflows/validate.yml`). Done in Unreleased.
5. ✅ Cursor install now targets `.cursor/skills/` with native folder-per-skill `SKILL.md` layout (`format: 'skill'`). Was writing to `.cursor/rules/` as flat `.mdc` files — wrong Cursor feature. Done in Unreleased.
6. ✅ Windsurf install now targets `.windsurf/skills/` natively. Mirror of the Cursor fix in pt.5. Done in Unreleased — also removed all dead `.mdc` conversion code (`skillToMdcContent`, `mdc` branch of `copySkills`, `format` field across the AGENTS map and the manifest payload). All 5 supported agents now use a single uniform install path.

Улучшения 2:
1. ✅ Вопросы и ответы к ним сделать в виде таблицы. Done in Unreleased — interview-protocol rule 2 теперь требует `| ID | Variant |` markdown-таблицу под каждым вопросом.
2. Улучшить пользовательский опыт при работе с командами:
- Сделать более user-friendly
- ✅ Вместо чисел - буквы вариантов. Done in Unreleased — буквенные ID `a-z` в interview-protocol и в CLI menu (TTY arrow-key и non-TTY fallback). Цифры остаются как backward-compat fallback.
- Сделать инструмент приспособленным к работе одновременно над артефактами для нескольких проектов. Например, когда открыты 2 окна агентов. Сейчас попытка начать новый проект просто перезаписывает AGENTS.md.
- Сделать более подробное описание того, как продолжить работу после завершения работы с очередной командой.
- Добавить возможность того, чтобы можно было вводить текст, если такой возможности нет, для каждой команды из основных, например, "/brief я хочу создать онлай-магазин строй-материалов..."
- Сделай так, чтобы /brief уточнял в первую очередь, что именно за проект будет и его необходимые подробности, если текст для /brief не введен, а только потом начинал работу.

Улучшения 3:
1. Выделять один из вариантов как recommended
2. Вариантов всегда не более 5, включая кастомный ответ (например, 4 предложенных готовых вариант + 1 кастомный)
3. Варианты всегда на языке запроса для /brief
4. Заменить существующие примеры артефактов в example на артефакты для более универсального проекта, а не из сферы IGaming.
