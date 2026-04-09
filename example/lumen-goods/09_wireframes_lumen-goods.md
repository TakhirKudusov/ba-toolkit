# Wireframe Descriptions: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `03_stories_lumen-goods.md`, `08_apicontract_lumen-goods.md`

---

## WF-001: Product Detail Page (PDP)

**Linked US:** US-002, US-003, US-013
**FR Reference:** FR-002, FR-003, FR-010
**Navigation from:** Category page, search results, wishlist
**Navigation to:** WF-002 (Cart), WF-003 (Checkout via cart drawer)

### Layout

```
┌─────────────────────────────────────────────────┐
│ [Lumen Goods]   Shop ▾  Lumen Circle    🛒 (2)  │  ← Header
├─────────────────────────────────────────────────┤
│ Home > Kitchenware > Mugs > Ceramic tea mug     │  ← Breadcrumbs
├──────────────────────┬──────────────────────────┤
│                      │  Ceramic tea mug         │
│   ┌──────────────┐   │  ★★★★★ 4.7 (23 reviews)  │
│   │              │   │                          │
│   │  PRODUCT     │   │  €19.00 incl. VAT        │
│   │  IMAGE       │   │                          │
│   │              │   │  Colour:                 │
│   │              │   │  [●Sand] [○Slate] [○Sea] │
│   └──────────────┘   │                          │
│   ▢ ▢ ▢ ▢ (thumbs)   │  Size: [350 ml ▼]        │
│                      │                          │
│                      │  ✓ In stock — ships in   │
│                      │    1–2 days from NL      │
│                      │                          │
│                      │  [   Add to cart   ]  ♡  │
│                      │                          │
│                      │  🌱 Fair trade · low-fire│
│                      │     clay                 │
├──────────────────────┴──────────────────────────┤
│  Description                                    │
│  Hand-thrown stoneware mug with sand glaze...   │
├─────────────────────────────────────────────────┤
│  Customer reviews (23)        ★★★★★ 4.7         │
│  ─────────────────────────────────────────────  │
│  Anna · ★★★★★  "Beautiful colour, perfect size" │
│  Pieter · ★★★★☆ "Smaller than I expected but..."│
│                                  [Load more]    │
└─────────────────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Variant selectors, in-stock label, primary CTA active |
| Loading | Skeleton placeholders for image, title, price, variants |
| Out of stock | Variant pill greyed out; CTA replaced with "Notify me when back in stock" |
| Just sold out | Visitor clicks Add to cart; toast appears: "This item just sold out" |
| Wishlist saved | Heart icon switches to filled state |
| Error | Friendly error page with retry button (NFR-001 fallback) |

### Notes
- Price always displays incl. VAT, recalculated when the destination country is changed in the header.
- Reviews load lazily after the main page content for performance (NFR-001).
- Sustainability tags link to dedicated explainer pages.

---

## WF-002: Cart Drawer

**Linked US:** US-004
**FR Reference:** FR-004
**Navigation from:** Cart icon in any page header
**Navigation to:** WF-003 (Checkout)

### Layout

```
┌──────────────────────────────────────┐
│  Your cart (2 items)              ✕  │
├──────────────────────────────────────┤
│  ┌────┐ Ceramic tea mug              │
│  │ 🍵 │ Sand · 350 ml                │
│  └────┘ €19.00            ─ 2 ┼      │
│         [Remove]                     │
│  ─────────────────────────────────── │
│  ┌────┐ Linen tea towel              │
│  │ 🧻 │ Sea · 50×70 cm               │
│  └────┘ €14.00            ─ 1 ┼      │
│         [Remove]                     │
├──────────────────────────────────────┤
│  Subtotal           €52.00           │
│  VAT (21%)          €10.92           │
│  Shipping (est.)     €5.95           │
│  ─────────────────────────────────── │
│  Total              €68.87           │
│                                      │
│  [    Continue to checkout    ]      │
│                                      │
│  💡 Free shipping with Lumen Circle  │
└──────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Lines, totals, primary CTA active |
| Loading | Skeleton lines while updating |
| Empty | "Your cart is empty" + "Browse the shop" link |
| Out of stock on a line | Line marked "No longer available — please remove" |

---

## WF-003: Checkout (One-Page)

**Linked US:** US-007, US-008, US-011
**FR Reference:** FR-003, FR-005, FR-006, FR-009
**Navigation from:** Cart drawer → Continue
**Navigation to:** WF-004 (Order confirmation) on success

### Layout

```
┌────────────────────────────────────────────────┐
│  ← Back to cart           Checkout      🔒    │
├──────────────────────────┬─────────────────────┤
│ 1. Contact               │ Order summary       │
│  Email: anna@example.com │ ─────────────────── │
│                          │ Tea mug × 2  €38.00 │
│ 2. Shipping address      │ Tea towel × 1 €14.00│
│  [Use saved ▼] [+ New]   │ ─────────────────── │
│  Anna de Vries           │ Subtotal    €52.00  │
│  Prinsengracht 263       │ VAT (21%)   €10.92  │
│  1016 GV Amsterdam, NL   │ Shipping     €5.95  │
│                          │ ─────────────────── │
│ 3. Shipping method       │ Total       €68.87  │
│  ◉ Standard NL  €5.95    │                     │
│  ○ Express NL  €11.95    │                     │
│                          │                     │
│ 4. Payment               │                     │
│  ◉ Card                  │                     │
│   [Stripe Elements iframe]                     │
│   ┌───────────────────┐  │                     │
│   │ 4242 4242 4242 ...│  │                     │
│   │ MM/YY  CVV        │  │                     │
│   └───────────────────┘  │                     │
│  ○ Apple Pay             │                     │
│  ○ Klarna — Pay later    │                     │
│  ○ SEPA direct debit     │                     │
│                          │                     │
│  [    Place order €68.87 ]                     │
└──────────────────────────┴─────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | All four sections visible; CTA enabled when valid |
| Loading totals | Skeleton totals while VAT recalculates |
| Stock reservation expired | Toast: "Your reservation expired. Please review your cart." Cart drawer reopens |
| SCA challenge | Modal overlay from Stripe Elements; CTA disabled until resolved |
| Payment failed | Inline error under Stripe iframe; CTA re-enabled for retry |
| Empty (no cart) | Redirected back to cart drawer |

### Notes
- The order is created in the database (`POST /orders`) when section 3 is filled and the customer presses "Place order".
- Stock is reserved at the moment the order is created. The customer has 15 minutes to complete payment.
- Klarna and SEPA options appear only when the destination country supports them.

---

## WF-004: Order Confirmation Page

**Linked US:** US-009
**FR Reference:** FR-003, FR-007
**Navigation from:** Successful checkout
**Navigation to:** WF-005 (Account → Orders)

### Layout

```
┌─────────────────────────────────────────────┐
│       ✓ Thank you for your order!           │
│                                             │
│  Order #LG-20260409-0042                    │
│  We've sent a confirmation to               │
│  anna@example.com                           │
├─────────────────────────────────────────────┤
│  What happens next                          │
│  1. We pack your order in 1–2 working days  │
│  2. You'll receive a tracking link by email │
│  3. Standard delivery to NL: 2–4 days       │
├─────────────────────────────────────────────┤
│  Your order                                 │
│  Tea mug — Sand · 350 ml × 2     €38.00     │
│  Tea towel — Sea · 50×70 × 1     €14.00     │
│  Shipping (Standard NL)           €5.95     │
│  VAT (21%)                       €10.92     │
│  ───────────────────────────────────────    │
│  Total                           €68.87     │
├─────────────────────────────────────────────┤
│  [ Track your order ]  [ Continue shopping ]│
└─────────────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Success message + summary + CTAs |
| Awaiting payment confirmation | Yellow banner: "Payment processing — we'll email you when confirmed" (SEPA case) |

---

## WF-005: My Orders

**Linked US:** US-009, US-010
**FR Reference:** FR-007, FR-008
**Navigation from:** Account menu → Orders
**Navigation to:** Order detail (same screen, expandable)

### Layout

```
┌───────────────────────────────────────────────┐
│ ← Back                          My orders     │
├───────────────────────────────────────────────┤
│ Filter: [All ▼]  [Last 90 days ▼]             │
├───────────────────────────────────────────────┤
│ Apr 8, 2026 · #LG-20260408-0042              │
│   Status: Delivered ✓     €68.87 · 3 items   │
│   [ View details ]  [ Request return ]       │
│ ─────────────────────────────────────────────│
│ Mar 15, 2026 · #LG-20260315-0011             │
│   Status: Delivered ✓     €34.00 · 2 items   │
│   [ View details ]                           │
│ ─────────────────────────────────────────────│
│ Feb 2, 2026 · #LG-20260202-0008              │
│   Status: Refunded ⤺      €19.00 · 1 item    │
│   [ View details ]                           │
│                                              │
│           [ Load more ]                      │
└───────────────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Paginated list, newest first |
| Loading | Skeleton order rows |
| Empty | "No orders yet. Browse the shop." |
| Filtered | Filter chips visible at top |

---

## WF-006: Admin — Order Management

**Linked US:** US-017, US-020
**FR Reference:** FR-015
**Navigation from:** Admin panel sidebar → Orders
**Auth:** Admin role required

### Layout

```
┌────────────────────────────────────────────────────┐
│ Lumen Goods Admin       Orders                     │
├────────────────────────────────────────────────────┤
│ Search: [_____________________] [🔍 Search]        │
│ Filter: Status [All ▼]  Date [Last 30 days ▼]      │
├────────────────────────────────────────────────────┤
│ Order ID         Customer      Status     Total    │
│ LG-...0042       anna@...      Paid       €68.87   │
│ LG-...0041       pieter@...    Shipped    €34.00   │
│ LG-...0040       lara@...      Returned   €19.00   │
├────────────────────────────────────────────────────┤
│ Showing 1–20 of 12,450             [← Prev][Next →]│
└────────────────────────────────────────────────────┘
```

### Order detail drawer (on row click)

```
┌─────────────────────────────────────┐
│ Order #LG-20260408-0042             │
│ Customer: anna@example.com          │
│ Status: Paid          [Mark shipped]│
│ Created: 2026-04-08 10:00           │
│ Total: €68.87                       │
│                                     │
│ Lines                               │
│  Tea mug × 2     €38.00             │
│  Tea towel × 1   €14.00             │
│                                     │
│ Shipping address                    │
│  Anna de Vries                      │
│  Prinsengracht 263                  │
│  1016 GV Amsterdam, NL              │
│                                     │
│ [ Refund order ] [ View audit log ] │
└─────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Paginated order list with search and filters |
| Search results | Filtered list; "No orders match" if empty |
| Loading | Skeleton rows |
| Empty | "No orders found." |
