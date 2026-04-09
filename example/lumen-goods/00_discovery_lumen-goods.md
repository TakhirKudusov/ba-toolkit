# Discovery: Lumen Goods

**Slug:** lumen-goods
**Date:** 2026-04-09
**Status:** Concept (pre-brief)

## 1. Problem Space

Eco-conscious household buyers in Western Europe want to furnish their homes with lighting, kitchenware, and textiles that are demonstrably sustainable, but the existing options force them into a frustrating trade-off. Mass-market marketplaces (Amazon, IKEA) carry a few "eco" lines buried inside catalogues that are otherwise full of fast-furniture; the sustainability claims are vague, badge-driven, and rarely traceable to materials, factories, or supply chain. Boutique sustainable shops solve the credibility problem but operate at one-product-at-a-time scale, ship slowly, charge a heavy premium, and rarely cover more than one room of the house.

The pain bites every time a buyer wants to refurnish a room: they spend hours cross-referencing brand claims, give up, and either over-pay at a boutique or default to a non-sustainable alternative. The opportunity is a curated multi-category store with auditable sustainability metadata at the SKU level, priced for the mid-to-high consumer segment, that ships across the EU and the UK reliably.

## 2. Target Audience Hypotheses

- **Primary:** Urban household buyers, ages 28–45, mid-to-high income, in NL / DE / FR / UK who already pay a premium for sustainable food and clothing and now want the same standard for their home goods. They buy 2–4 home items per quarter and value the product story as much as the product itself.
- **Secondary:** Gift buyers, ages 30–55, who occasionally need a high-quality, "story-rich" present for a wedding, housewarming, or milestone birthday and are willing to pay €40–€150 per item for something that feels considered.

## 3. Candidate Domains

| Domain | Rationale | Fit |
|--------|-----------|-----|
| ecommerce | D2C web storefront, catalog, cart, checkout, fulfilment, returns, loyalty — every core requirement maps directly to the ecommerce reference | High |
| social-media | Brand storytelling and a community angle could be a marketing channel, but the product itself is a store, not a social network | Low |
| saas | Loyalty subscriptions hint at SaaS mechanics, but billing is a tiny piece of the surface area; the rest is retail | Low |

**Recommended domain:** `ecommerce` — the entire surface area (catalog, checkout, payments, stock, returns, multi-region tax, loyalty) sits inside the ecommerce domain reference. SaaS-style subscription billing for the loyalty tier is a sub-feature, not a domain shift.

## 4. Reference Products and Analogues

| Product | What it does well | What it does badly / misses |
|---------|-------------------|------------------------------|
| Made.com (pre-collapse) | Curated multi-category catalog with strong product photography and a clear brand voice | Sustainability story was thin, supply chain was opaque, eventually went bankrupt — gap in the market |
| Avocadostore (DE) | Strict sustainability vetting per supplier, multi-category | Clunky UX, limited stock visibility, slow checkout, mostly DE-only logistics |
| Earthhero (US) | Per-product sustainability metadata badges and clear filters | US-only fulfilment; product range narrow; no loyalty mechanic |
| Patagonia | Auditable supply chain, strong customer trust, lifetime warranty | Apparel-only — no home goods; limited gifting affordances |

## 5. MVP Feature Hypotheses

Candidate features for the first launch. Not committed scope — `/brief` and `/srs` will refine.

- Product catalog with ~800 SKUs across 12 categories at launch (room to grow to 5,000)
- Product detail page with sustainability metadata at the SKU level (materials, factory, certifications, end-of-life guidance)
- Variant selection (colour, size) with real-time stock indicator
- Guest checkout + saved-customer checkout
- Stripe payments: cards, Apple Pay, Google Pay, Klarna BNPL, SEPA direct debit
- Destination-based VAT for EU + UK via a managed tax service
- Hybrid stock sync between an NL warehouse and a UK 3PL with atomic stock reservation at checkout
- Order tracking, returns, and refunds within 30 days
- Lumen Circle paid loyalty tier (free shipping, early access to drops, member-only pricing)
- GDPR / UK GDPR compliance: cookie consent, DSAR portal, data retention policy
- Admin panel for catalog management, order processing, returns, customer management, and basic reporting
- Customer reviews on the product detail page

## 6. Differentiation Angle

Lumen Goods makes sustainability claims falsifiable at the SKU level — every product page exposes the materials, the factory, the certifications, and the end-of-life guidance, and the customer can audit any claim before checkout. Combined with a reliable EU + UK fulfilment network and a paid loyalty tier that turns the brand into a habit rather than a one-off purchase, the store closes the credibility-vs-convenience gap that killed Made.com and that boutique-only competitors cannot bridge alone.

## 7. Open Validation Questions

Things to learn before committing real resources.

- Will the primary segment in NL / DE / FR / UK actually pay €4.99/month for a loyalty tier whose main draw is free shipping, or do they expect free shipping by default at this price tier?
- Is per-SKU sustainability metadata maintainable at 800 → 5,000 SKUs without a dedicated supply-chain analyst, or will the data quality decay over time?
- How sensitive is the eco segment to checkout speed vs. checkout assurance (carbon-neutral shipping copy, factory provenance shown at checkout)? Worth A/B testing on the cart page.
- What is the realistic Klarna / SEPA mix vs. card payments for this audience and price band? Drives the payment-method ordering on the checkout page.
- Are returns on heavy / fragile categories (lighting, ceramics) viable economically, or does the return policy need a category-specific carve-out?
- Does the NL warehouse + UK 3PL split give acceptable post-Brexit delivery times to UK buyers, or do we need a second UK fulfilment partner before launch?

## 8. Recommended Next Step

- **Project name:** Lumen Goods
- **Slug:** lumen-goods
- **Domain:** ecommerce
- **Scope hint for `/brief`:** A direct-to-consumer sustainable home-goods online store for eco-conscious buyers in the EU and UK, with a paid loyalty tier and per-SKU sustainability metadata.
- **Suggested first interview focus in `/brief`:** business goals and success metrics (the GMV, repeat-rate, and cart-abandonment numbers are the levers the team will commit to); stakeholders and roles (founders, head of sustainability, ops lead, fulfilment partners).
