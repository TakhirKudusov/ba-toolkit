# Project Brief: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune

## 1. Project Summary

Dragon Fortune is an online slot game delivered as a Telegram Mini App targeting CIS markets. The product aims to capture casual players through social sharing mechanics and a low deposit threshold, with revenue driven by in-game purchases and a referral programme. The game runs entirely inside Telegram — no external app installation is required.

## 2. Business Goals and Success Metrics

| # | Goal | Success Metric |
|---|------|----------------|
| 1 | Acquire 50,000 active players within 6 months of launch | MAU ≥ 50,000 by month 6 |
| 2 | Achieve positive unit economics per player | LTV / CAC ≥ 1.5 |
| 3 | Maintain full regulatory compliance in all target markets | 0 regulatory incidents; RTP certified before launch |

## 3. Target Audience

| Segment | Description | Geography |
|---------|-------------|-----------|
| Casual players | Ages 21–40, mobile-first, low-stakes, motivated by social sharing and bonuses | Russia, Kazakhstan, Belarus |
| High-rollers | Ages 30–50, desktop and mobile, motivated by high-volatility gameplay and large payouts | Russia, Ukraine |

## 4. High-Level Functionality Overview

- **Slot gameplay:** configurable paylines and volatility settings; certified RNG; RTP 94–97%.
- **Telegram-native onboarding:** authentication via Telegram account — no separate registration form.
- **Wallet:** deposit via cryptocurrency (BTC, USDT) and local payment systems (Qiwi, YooMoney, SBP); withdrawal processed within 24 hours.
- **Referral programme:** tiered referral bonuses; players earn a percentage of their referees' first deposit.
- **Responsible gambling controls:** session time warnings, self-exclusion, configurable deposit limits.
- **Admin panel:** player management, real-time RTP and payline configuration, revenue reporting.

## 5. Stakeholders and Roles

| Role | Responsibility |
|------|---------------|
| Product Owner | Roadmap, feature prioritisation, final acceptance of each artifact |
| Compliance Officer | Regulatory requirements, AML/KYC policy, responsible gambling controls |
| Payment Provider | Payment gateway integration, KYC identity verification services |
| Tech Lead | Architecture decisions, integration design, sprint planning |
| Business Analyst | Requirements elicitation, artifact maintenance, traceability |

## 6. Constraints and Assumptions

**Constraints:**
- Must operate within Telegram Mini App API limitations (no persistent background processes, limited local storage).
- Payment processing must comply with local AML/KYC requirements in each target jurisdiction.
- RTP must be certified by an accredited testing laboratory before the production launch.
- The product must implement responsible gambling controls mandated by the iGaming licence.

**Assumptions:**
- Telegram Bot API and Mini App platform will remain stable during the development period.
- A licensed payment aggregator will handle fiat-to-cryptocurrency conversion and KYC identity verification.
- The iGaming licence application is in progress; legal approval is expected within 3 months.
- The engineering team consists of 4 full-stack developers and 1 QA engineer.

## 7. Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| 1 | Regulatory approval timeline delays launch | Medium | High | Engage legal counsel early; decouple dev milestones from licensing timeline |
| 2 | Telegram API breaking changes mid-development | Low | High | Pin SDK version; abstract calls behind adapter layer |
| 3 | Real-time leaderboard / spin throughput unproven at scale | Medium | Medium | Load-test in sprint 1; prepare polling fallback |
| 4 | Scope creep from stakeholder wish list | Medium | Medium | Formal change request process; freeze scope per sprint |
| 5 | Payment provider SLA not guaranteed | Likely | High | Negotiate SLA; implement fallback payment provider |
| 6 | Data model instability after /datadict | Unlikely | Medium | Run /trace after /apicontract; patch cascade via /revise |
| 7 | Development team unfamiliar with iGaming domain | Unlikely | Low | Domain onboarding session in sprint 0; reference domain glossary |

## 8. Glossary

| Term | Definition |
|------|-----------|
| RTP | Return to Player — percentage of wagered money returned to players over time; must be 94–97% |
| Mini App | Telegram-native web application launched inside the Telegram chat interface |
| Payline | A line across the slot reels on which a winning combination is evaluated |
| Volatility | Frequency and size of payouts — low volatility = frequent small wins; high = rare large wins |
| Wagering requirement | Number of times a bonus amount must be bet before it can be withdrawn |
| KYC | Know Your Customer — identity verification process required by AML regulations |
| AML | Anti-Money Laundering — regulatory framework to prevent financial crime |
| Session | A continuous period of gameplay from first spin to player exit or time limit expiry |
| Referral | A mechanism by which an existing player invites a new player and earns a bonus |
