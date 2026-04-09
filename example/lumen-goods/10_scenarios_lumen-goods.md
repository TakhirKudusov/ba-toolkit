# Validation Scenarios: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `03_stories_lumen-goods.md`, `05_ac_lumen-goods.md`, `09_wireframes_lumen-goods.md`, `08_apicontract_lumen-goods.md`

---

## Scenario Index

| ID | Title | Persona | Key artifacts covered |
|----|-------|---------|----------------------|
| SC-001 | First-time guest checkout journey | Anna (new visitor) | US-002, US-003, US-004, US-007 |
| SC-002 | Customer returns an item and gets refunded | Pieter (registered customer) | US-009, US-020 |
| SC-003 | Customer joins Lumen Circle and uses benefits | Lara (repeat buyer) | US-014 |
| SC-004 | Admin updates a product and adjusts stock | Admin Sander | US-018 |

---

## SC-001: First-Time Guest Checkout Journey

**Persona:** Anna, 32, Amsterdam. Found Lumen Goods via Instagram. Wants to buy two ceramic mugs as a gift without creating an account.
**Goal:** Complete checkout as a guest, pay by card, receive an order confirmation.
**Entry point:** Direct link to a product detail page.

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Anna lands on the PDP for "Ceramic tea mug" (WF-001) | Page renders in ≤ 500 ms TTFB; price shows €19.00 incl. VAT | AC-002-01 | GET /catalog/products/:slug |
| 2 | Anna selects colour Sand · 350 ml and clicks "Add to cart" | Cart drawer opens with the line; cart icon shows (1) | AC-003-01 | POST /cart/items |
| 3 | Anna goes back, opens "Linen tea towel" PDP, adds 1 unit | Cart drawer shows 2 lines totalling €52.00 + VAT | AC-003-01 | POST /cart/items |
| 4 | Anna clicks "Continue to checkout" | Checkout page (WF-003) loads; system reserves stock for both lines | AC-003-01 | POST /orders |
| 5 | Anna fills in email and shipping address (NL) | Tax service returns VAT 21% for NL; totals recalculate to €68.87 | — | (internal: tax service) |
| 6 | Anna selects "Standard NL shipping" and "Card" | Stripe Elements iframe mounts in the payment section | — | — |
| 7 | Anna enters card 4242 4242 4242 4242 and clicks "Place order" | Stripe returns paymentIntentId; system stores it on the draft order | AC-007-01 | POST /orders/:id/confirm |
| 8 | Stripe sends `payment_intent.succeeded` webhook | System verifies signature, marks Order as `paid`, decrements stock, sends confirmation email | AC-007-01 | POST /webhooks/stripe |
| 9 | Anna sees the confirmation page (WF-004) | Order ID, summary, "what happens next" timeline visible | — | — |

**Expected final state:**
- Order saved with `status = paid`, `stripePaymentIntentId` set, totals recorded.
- Stock for both variants decremented permanently.
- Order confirmation email queued.
- Anna's email captured on the order, no Customer record created (guest).

**Failure conditions:**
- FC-1: Card declined → Stripe sends `payment_intent.payment_failed`. Order remains `pending_payment`. Stock reservation released after 15-minute TTL (AC-007-01 negative branch).
- FC-2: Stock sold out between PDP load and cart add → POST /cart/items returns OUT_OF_STOCK; toast shown (AC-003-03).

---

## SC-002: Customer Returns an Item and Gets Refunded

**Persona:** Pieter, 41, Utrecht. Logged-in customer. Received an order 5 days ago and wants to return one item that didn't fit.
**Goal:** Request a return, ship it back, receive a refund.
**Entry point:** Account menu → My orders (WF-005)

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Pieter opens My orders | Order LG-...0042 listed with status Delivered | — | GET /orders |
| 2 | Pieter clicks "Request return" on the order | Return form shows the order lines with quantity selectors | — | GET /orders/:id |
| 3 | Pieter selects 1× "Linen tea towel" and reason "Wrong size" | Return form validates input | — | — |
| 4 | Pieter submits the return | System validates the order is delivered ≤ 30 days; creates a Return with status `awaiting_drop_off`; generates a return label via the 3PL | AC-009-01 | POST /orders/:id/returns |
| 5 | Pieter receives the return label by email | Email contains a one-time URL to the PDF label, valid 7 days | AC-009-01 | (internal: email service) |
| 6 | Pieter drops the parcel at a DPD point | — | — | — (external) |
| 7 | 3PL receives the parcel and sends a webhook | System updates the Return to `received` and notifies operations | — | (internal: 3PL webhook) |
| 8 | Operations approves the return after quality check | System calls Stripe to refund €14.00; Return moves to `refunded` | AC-009-03 | (internal: Stripe refunds API) |
| 9 | Pieter receives a refund confirmation email | Email confirms the amount and the original payment method | AC-009-03 | (internal: email service) |

**Expected final state:**
- Return record saved with `status = refunded`, `refundCents = 1400`, `stripeRefundId` set.
- Stripe refund completed against the original payment intent.
- Order's overall status is partially refunded (Lumen Goods tracks this on the Order via a `refundedCents` field).

**Failure conditions:**
- FC-1: Outside 30-day window → POST /orders/:id/returns returns RETURN_WINDOW_EXPIRED (AC-009-02).
- FC-2: Quality check fails → Operations marks Return as `rejected`; item is shipped back to the customer; no refund issued.

---

## SC-003: Customer Joins Lumen Circle and Uses Benefits

**Persona:** Lara, 36, Berlin. Has placed 4 orders with Lumen Goods over the past 6 months. Wants the free shipping perk.
**Goal:** Subscribe to Lumen Circle and complete a new order with member benefits applied.
**Entry point:** Account menu → Lumen Circle landing page

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Lara opens the Lumen Circle landing page | Page explains benefits (free shipping ≥ €30, member pricing) and shows €4.99/month CTA | — | — |
| 2 | Lara clicks "Join for €4.99/month" | System creates a draft LumenCircleMembership with `status = pending`; Stripe Elements mounts | — | POST /lumen-circle/subscribe |
| 3 | Lara enters her saved card and confirms | Stripe creates the Subscription | — | (internal: Stripe API) |
| 4 | Stripe sends `customer.subscription.created` webhook | System updates membership to `status = active`, sets `currentPeriodEnd` to +1 month | — | POST /webhooks/stripe |
| 5 | Lara navigates to a product, adds 2 mugs (€38), proceeds to checkout | Cart shows €38.00 subtotal + VAT; shipping line shows €0.00 with "Free with Lumen Circle" | — | POST /orders |
| 6 | Lara completes payment by card | Order paid as in SC-001; member benefits applied | AC-007-01 | POST /orders/:id/confirm + POST /webhooks/stripe |
| 7 | One month later, Stripe sends `invoice.paid` for the renewal | System updates `currentPeriodEnd` to +1 month | — | POST /webhooks/stripe |
| 8 | Two months later, the renewal payment fails | Stripe sends `invoice.payment_failed`; system sets membership to `past_due` and starts the 7-day grace period | — | POST /webhooks/stripe |

**Expected final state (after step 6):**
- LumenCircleMembership active with `currentPeriodEnd` set.
- Lara's most recent order has `shippingCents = 0` and a flag indicating member-shipping was applied.

**Failure conditions:**
- FC-1: Initial card declined at step 3 → Stripe returns an error; membership stays `pending`; Lara prompted to retry.
- FC-2: Grace period expires at day 8 → Membership transitions to `cancelled`; benefits no longer applied at checkout.

---

## SC-004: Admin Updates a Product and Adjusts Stock

**Persona:** Sander (Admin), responsible for catalog hygiene. Needs to bump the price of the tea mug by €1 and reduce stock after a partial warehouse damage.
**Goal:** Update the product price and stock; verify the storefront reflects the change.
**Entry point:** Admin panel → Products

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Sander opens the Products screen | List of products with stock and status | — | GET /admin/products |
| 2 | Sander searches "ceramic tea mug" and opens the detail page | Product detail form rendered; current price €19.00 | — | GET /admin/products/:id |
| 3 | Sander updates priceCents from 1900 to 2000 | Form accepts the change; preview shows €20.00 | — | — |
| 4 | Sander clicks Save | System persists, writes audit log entry, invalidates cache | AC-018-01 | PUT /admin/products/:id |
| 5 | Sander tries to set stock to -5 | System rejects with HTTP 422 and "Stock cannot go below zero" | AC-018-02 | PUT /admin/products/:id → 422 |
| 6 | Sander corrects the value to 0 and saves | System accepts; audit log entry written | AC-018-01 | PUT /admin/products/:id |
| 7 | Sander uploads a CSV with 50 stock adjustments for other variants | System validates each row in a single transaction | AC-018-03 | POST /admin/products/bulk-stock |
| 8 | Sander opens the storefront product page in a new tab | Page reflects the new price (€20.00) within 60 seconds | AC-018-01 | GET /catalog/products/:slug |

**Expected final state:**
- Product record updated with `priceCents = 2000`, new `updatedAt` timestamp.
- Audit log entries: one for price change, one for stock adjustment, one for the bulk CSV.
- Storefront cache invalidated; the public product page shows the new price.

**Failure conditions:**
- FC-1: CSV row 12 has an invalid SKU → Whole upload rejected with row-by-row error report (AC-018-03).
- FC-2: Operations Manager (not Admin) attempts the price change → API returns 403 FORBIDDEN_FIELD.

---

## Coverage Summary

| Scenario | US covered | AC covered | WF covered | API endpoints |
|----------|-----------|-----------|-----------|--------------|
| SC-001 | US-002, US-003, US-004, US-007 | AC-002-01, AC-003-01/03, AC-007-01 | WF-001, WF-002, WF-003, WF-004 | 5 |
| SC-002 | US-009, US-020 | AC-009-01/02/03 | WF-005 | 4 |
| SC-003 | US-014 | AC-007-01 | — | 4 |
| SC-004 | US-018 | AC-018-01/02/03 | WF-006 | 4 |

**FR coverage:** FR-002, FR-003, FR-004, FR-005, FR-007, FR-011, FR-015 (7/15 FRs validated end-to-end). Remaining FRs (FR-001 auth, FR-006 Klarna/SEPA, FR-008 history, FR-009 addresses, FR-010 reviews, FR-012 cookies, FR-013 DSAR, FR-014 export) are covered by AC and unit tests only.
