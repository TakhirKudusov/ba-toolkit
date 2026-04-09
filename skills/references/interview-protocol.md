# Interview Protocol

Every BA Toolkit skill that gathers information from the user MUST follow this protocol during its Interview phase. The goal is a conversation, not a questionnaire dump — users answer better when each question has focus and concrete options to react to.

## Rules

1. **One question at a time.** Never send a numbered list of 5+ questions in a single message. Ask one question, wait for the answer, acknowledge it in one line, then ask the next.

2. **Offer 3–5 answer options per question.** For every question, present a short numbered list of the most likely answers based on:
   - The project domain (load `references/domains/{domain}.md` and reuse its vocabulary, typical entities, and business goals verbatim when they fit — do not invent domain-specific options when the reference file already lists them).
   - What the user has already said earlier in the interview.
   - Industry conventions for the artifact being built.

   Options should be **concrete**, not abstract — e.g. for "Who is your primary user?" in a SaaS project, offer "Product Manager at a 50–500-person SaaS startup", "Engineering Lead", "Ops/Support team", not "End user", "Customer", "User".

3. **Always include a free-text option.** The last numbered option must always be something like `5. Other — type your own answer`. If the user picks it, accept arbitrary text. Never force the user into one of the predefined options.

4. **Wait for the answer.** Do not generate the next question or any part of the artifact until the user has replied. A non-answer (e.g. "I don't know", "skip") is a valid answer — record it as "unknown" and move on.

5. **Acknowledge, then proceed.** After each answer, reflect it back in one line (e.g. "Got it — primary user is the Ops team at mid-size logistics companies.") before asking the next question. This catches misunderstandings early.

6. **Batch only when the user asks.** If the user explicitly says "just give me all the questions at once" or "I'll answer in one go", switch to a single numbered list. Otherwise stay one-at-a-time.

7. **Stop when you have enough.** Each skill specifies a required set of topics. Once every required topic has a recorded answer, stop asking and move to the Generation phase. Do not pad the interview with "nice-to-have" questions.

## Example

Bad (old style):

> Please answer the following questions:
> 1. What is the product?
> 2. Who is the target user?
> 3. What problem does it solve?
> 4. What are the success metrics?
> 5. What are the key constraints?

Good (protocol style):

> Let's start with the product itself. What are you building?
>
> 1. A B2B SaaS tool for internal teams (dashboards, automation, reporting)
> 2. A customer-facing web application (marketplace, portal, community)
> 3. A mobile app (consumer or B2B)
> 4. An API / developer platform
> 5. Other — type your own answer

*User picks 1 or types custom.*

> Got it — internal B2B SaaS tool. Who is the primary user? [next question with 3–5 options tailored to B2B SaaS internal tooling]

## When this protocol applies

This protocol applies to every skill that has an `### Interview` (or `## Interview`) section in its SKILL.md — currently: `brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `apicontract`, `wireframes`, `scenarios`, `research`, `principles`. Each of those skills MUST link to this file from its Interview section and follow the rules above.
