# Project Brief: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods

## 1. Project Summary

Lumen Goods is a direct-to-consumer (D2C) online store selling sustainably sourced home goods — lighting, kitchenware, and textiles — to eco-conscious buyers in the EU and the UK. The product is delivered as a responsive web storefront that doubles as an installable PWA, with no native mobile app at launch. Revenue comes from product margin and a paid loyalty tier ("Lumen Circle") that adds free shipping and member-only product drops.

## 2. Business Goals and Success Metrics

| # | Goal | Success Metric |
|---|------|----------------|
| 1 | Reach €1.5M GMV in the first 12 months after launch | Annualised GMV ≥ €1.5M by month 12 |
| 2 | Build a loyal repeat-buyer base | Repeat-purchase rate ≥ 30% by month 9 |
| 3 | Keep checkout friction below industry average | Cart abandonment ≤ 55% (industry benchmark ~70%) |

## 3. Target Audience

| Segment | Description | Geography |
|---------|-------------|-----------|
| Eco-conscious household buyers | Ages 28–45, urban, mid-to-high income, motivated by product story and sustainability credentials | Netherlands, Germany, France, UK |
| Gift buyers | Ages 30–55, occasional purchasers seeking high-quality presents with a story | EU + UK |
| Lumen Circle members | Repeat buyers willing to pay €4.99/month for free shipping and early access to drops | EU + UK |

## 4. High-Level Functionality Overview

- **Catalog browsing:** ~800 SKUs across 12 categories at launch (room to grow to 5,000); search, filtering, and category navigation.
- **Product detail page:** images, variant selection (colour / size), stock status, sustainability metadata, customer reviews.
- **Cart and checkout:** guest checkout supported; address book and saved payment methods for registered customers; one-page checkout with order summary.
- **Payments:** Stripe (cards, Apple Pay, Google Pay), Klarna BNPL, SEPA direct debit.
- **Order management:** tracking, history, returns and refunds within 30 days.
- **Lumen Circle loyalty:** paid monthly tier with free shipping, early access to new drops, and member-only pricing.
- **Admin panel:** catalog management, order processing, returns handling, customer management, promotions, basic reports.

## 5. Stakeholders and Roles

| Role | Responsibility |
|------|---------------|
| Founder / CEO | Roadmap, brand voice, final acceptance of each artifact |
| Head of Operations | Warehouse, 3PL coordination, returns policy, inventory accuracy |
| Marketing Lead | Catalog merchandising, promotions, loyalty programme |
| Tech Lead | Architecture decisions, integration design, sprint planning |
| Fulfilment Partner | UK-side 3PL: pick, pack, ship, returns intake |
| Payment Provider | Stripe and Klarna integration, dispute handling |
| Business Analyst | Requirements elicitation, artifact maintenance, traceability |

## 6. Constraints and Assumptions

**Constraints:**
- Must comply with EU and UK consumer protection regulations: 14-day right of return, transparent pricing including VAT, accessible terms.
- GDPR and UK GDPR compliance is mandatory: lawful basis for marketing, cookie consent, data subject access requests, right to erasure.
- Payment processing must be PCI DSS-compliant; the platform must never store raw card data.
- Inventory must remain in sync between the Netherlands warehouse and the UK 3PL — overselling is unacceptable.
- VAT must be calculated correctly per destination country and per product category.

**Assumptions:**
- Stripe and Klarna sandbox environments are available for integration testing.
- The UK 3PL provides a REST/SFTP API for stock and order events.
- The product team will deliver finalised category structure and product imagery before sprint 2.
- The engineering team consists of 4 full-stack developers and 1 QA engineer.
- A managed PIM is not required at launch — product data lives in the application database.

## 7. Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| 1 | Inventory drift between warehouse and 3PL causes overselling | Likely | High | Real-time stock reservation; reconciliation job every 5 minutes; oversell guard rail |
| 2 | Cart abandonment at checkout exceeds target | Medium | High | One-page checkout, guest checkout, multiple payment methods, address auto-complete |
| 3 | Payment provider downtime during peak sale events | Medium | High | Circuit breaker; fallback to a second Stripe account; order capture queue |
| 4 | GDPR compliance gaps surface late | Medium | Medium | Privacy review in sprint 0; cookie banner and DSAR flow built before launch |
| 5 | VAT calculation errors cause customer disputes and legal exposure | Medium | Medium | Use a managed tax service for destination-based VAT; validated against accountant test cases |
| 6 | Scope creep from new category requests mid-sprint | Medium | Medium | Formal change-request process; sprint scope frozen at planning |
| 7 | Engineering team unfamiliar with e-commerce edge cases (partial shipment, refund accounting) | Unlikely | Low | Domain onboarding session in sprint 0; reference glossary in handoff |

## 8. Glossary

| Term | Definition |
|------|-----------|
| GMV | Gross Merchandise Value — total value of orders placed, before refunds and chargebacks |
| SKU | Stock Keeping Unit — a uniquely identifiable product variant (e.g. "Ceramic mug — sand — 350 ml") |
| 3PL | Third-Party Logistics — external warehouse and fulfilment provider |
| PWA | Progressive Web App — installable web application with offline support |
| Cart abandonment | Sessions where a cart was created but no order was placed, divided by sessions where a cart was created |
| Repeat-purchase rate | Share of customers who placed at least one additional order within a defined window |
| BNPL | Buy Now, Pay Later — deferred payment option (Klarna in this project) |
| DSAR | Data Subject Access Request — GDPR-mandated process for a customer to obtain their personal data |
| Lumen Circle | The paid monthly loyalty tier offered by Lumen Goods |
| PIM | Product Information Management — system that centralises product data (deferred post-MVP) |
