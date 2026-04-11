# Interview Protocol

Every BA Toolkit skill that gathers information from the user MUST follow this protocol during its Interview phase. The goal is a conversation, not a questionnaire dump — users answer better when each question has focus and concrete options to react to.

## Rules

1. **One question at a time, numbered.** Never send a numbered list of 5+ questions in a single message. Ask one question, wait for the answer, acknowledge it in one line, then ask the next. Prefix each question with its number and total in the format `(N/M)` — e.g., `(1/7)`, `(3/7)`. Estimate M before the interview starts based on the skill's required topics minus any already answered via inline context (rule 9). If the total changes mid-interview (e.g., a user answer opens a follow-up topic), update the denominator silently.

2. **Present options as a 2-column markdown table.** Every question carries a short table with columns `| ID | Variant |`. The IDs are lowercase letters starting at `a` (`a`, `b`, `c`, `d`, `e`, …). Tables render cleanly in every supported AI agent (Claude Code, Codex CLI, Gemini CLI, Cursor, Windsurf) and scan faster than a numbered list. Pull the variants from:
   - The project domain (load `references/domains/{domain}.md` and reuse its vocabulary, typical entities, and business goals verbatim when they fit — do not invent domain-specific options when the reference file already lists them).
   - What the user has already said earlier in the interview.
   - Industry conventions for the artifact being built.

   Variants should be **concrete**, not abstract — e.g. for "Who is your primary user?" in a SaaS project, offer "Product Manager at a 50–500-person SaaS startup", "Engineering Lead", "Ops/Support team", not "End user", "Customer", "User".

3. **At most 5 rows per question, last row is always free-text.** Hard cap: **5 rows total = up to 4 predefined variants + exactly 1 free-text "Other" row**. Never render a 6th row. The last row is always something like `e | Other — type your own answer` (or whatever letter follows the last predefined variant). If the user picks the free-text row, accept arbitrary text. Never force the user into one of the predefined variants. Fewer than 4 predefined rows is fine when the topic genuinely has only 2–3 sensible options — pad with "Other" rather than inventing filler.

4. **Wait for the answer.** Do not generate the next question or any part of the artifact until the user has replied. A non-answer (e.g. "I don't know", "skip") is a valid answer — record it as "unknown" and move on. The user can respond with the letter ID (`a`, `b`, …), the verbatim variant text, or — for the free-text row — any text of their own.

5. **Acknowledge, then proceed.** After each answer, reflect it back in one line (e.g. "Got it — primary user is the Ops team at mid-size logistics companies.") before asking the next question. This catches misunderstandings early.

6. **Batch only when the user asks.** If the user explicitly says "just give me all the questions at once" or "I'll answer in one go", switch to a single numbered list. Otherwise stay one-at-a-time.

7. **Stop when you have enough.** Each skill specifies a required set of topics. Once every required topic has a recorded answer, stop asking and move to the Generation phase. Do not pad the interview with "nice-to-have" questions.

8. **Lead-in question for entry-point skills.** For the first skill in a fresh project (typically `/brief`), the very first interview question is **open-ended free-text**, not a structured options table — `Tell me about the project in your own words: one or two sentences are enough. What are you building, who is it for, and what problem does it solve?`. The user replies in free form. From that reply, extract whatever you can (product type, target audience, business goal, domain hints) and use it to pre-fill the structured questions that follow rule 2. Only ask the structured questions for topics the lead-in answer didn't cover. Non-entry-point skills (`/srs`, `/stories`, …) skip the lead-in and go straight to structured questions, because the prior artifacts already supply the project context.

9. **Inline command context.** If the user invokes the skill with text after the slash command — for example `/brief I want to build an online store for construction materials targeting B2B buyers in LATAM` or `/srs the SRS should focus on the payments module first` — parse that text as if it were the answer to the lead-in question (rule 8). Skip the open-ended lead-in and use the inline text to pre-fill any structured questions you can. Only ask the user for what's still missing. Acknowledge the inline context once at the start (`Got it — online store for construction materials, B2B buyers, LATAM market.`) so the user knows their context was understood, then jump straight into the first structured question that the inline text didn't already answer. This rule applies to **every** skill that has an Interview phase, not just entry-point skills.

10. **Mark exactly one row as recommended.** In every options table, append `(recommended)` to the end of the `Variant` cell of the single row that best fits the project context. Always use the English word `(recommended)` regardless of the user's language — do not translate, bold, or add emoji to the marker. Pick the row using, in order: (a) the loaded `references/domains/{domain}.md` for the current skill — what the reference treats as the typical default; (b) what the user has already said earlier in this interview; (c) the inline context from rule 9; (d) widely-accepted industry default. Never recommend the free-text "Other" row. Never recommend more than one row. If none of (a)–(d) gives you a defensible choice, omit the marker entirely for that question rather than guessing — a missing recommendation is better than a misleading one.

11. **Variant text in the user's language.** The `Variant` column header and every variant string must be written in the same language as the user's first message in this conversation — the same rule the generated artifact already follows. The `ID` column header, the letter IDs (`a`, `b`, …), and the `(recommended)` marker stay in English, unchanged. Domain reference files in `references/domains/` are English-only by design; when the interview language is not English, translate the variants on the fly as you render the table — do not paste the English source verbatim and do not ask the user which language to use.

## Example

Bad (old style — questionnaire dump):

> Please answer the following questions:
> 1. What is the product?
> 2. Who is the target user?
> 3. What problem does it solve?
> 4. What are the success metrics?
> 5. What are the key constraints?

Good (protocol style — one question at a time, numbered, table of variants, 5 rows max, one recommended):

> (1/7) Let's start with the product itself. What are you building?
>
> | ID | Variant                                                                       |
> |----|-------------------------------------------------------------------------------|
> | a  | A B2B SaaS tool for internal teams (dashboards, automation) (recommended)     |
> | b  | A customer-facing web application (marketplace, portal)                       |
> | c  | A mobile app (consumer or B2B)                                                |
> | d  | An API / developer platform                                                   |
> | e  | Other — type your own answer                                                  |

*User replies with `a`, types the verbatim variant text, or picks `e` and types their own description. The `(recommended)` marker on row `a` reflects the loaded SaaS domain reference + the inline context the user gave with `/brief`.*

> Got it — internal B2B SaaS tool.
>
> (2/7) Who is the primary user?
>
> | ID | Variant                                                                  |
> |----|--------------------------------------------------------------------------|
> | a  | Product Manager at a 50–500-person SaaS startup (recommended)            |
> | b  | Engineering Lead at a B2B company                                        |
> | c  | Operations / Support team at a mid-size SaaS                             |
> | d  | Other — type your own answer                                             |

*…and so on, one question at a time, until every required topic for the current skill has an answer. Tables stay at 5 rows or fewer; exactly one predefined row is marked (recommended), never the "Other" row.*

### Variant translation example (rule 11)

If the user's first message was in Russian, the same question is rendered with Russian variants and a translated `Variant` header — `ID` column, letter IDs, and `(recommended)` marker stay in English:

> (1/7) Давайте начнём с самого продукта. Что вы создаёте?
>
> | ID | Вариант                                                                          |
> |----|----------------------------------------------------------------------------------|
> | a  | B2B SaaS-инструмент для внутренних команд (дашборды, автоматизация) (recommended) |
> | b  | Клиентское веб-приложение (маркетплейс, портал)                                  |
> | c  | Мобильное приложение (для потребителей или B2B)                                  |
> | d  | API / платформа для разработчиков                                                |
> | e  | Другое — введите свой вариант                                                    |

## When this protocol applies

This protocol applies to every skill that has an `### Interview` (or `## Interview`) section in its SKILL.md — currently: `discovery`, `principles`, `brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `research`, `apicontract`, `wireframes`, `scenarios`. Each of those skills MUST link to this file from its Interview section and follow rules 1–7 + rules 9–11. Rule 8 (open-ended lead-in question) applies only to entry-point skills — currently `/discovery`, `/brief`, and `/principles` when no `00_discovery_*.md`, `01_brief_*.md`, or `00_principles_*.md` is present in the output directory yet.

Two additional skills follow rules 1–11 via differently-named sections rather than a literal `Interview` heading: `/publish` uses a `### Format selection` section to ask which target (Notion / Confluence / both), and `/implement-plan` uses an embedded calibration interview inside its `### Tech stack resolution` step to gather frontend / backend / database / hosting / auth choices when `07a_research_*.md` is absent or incomplete. Both carry the same one-line protocol summary block as the canonical interview-phase skills and must be kept in sync with rules 1–11 even though the existing `interview-protocol-link` regression test in `test/cli.test.js` only matches skills with a literal `Interview` heading and therefore does not enforce them automatically.
