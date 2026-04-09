# Data Dictionary: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `02_srs_lumen-goods.md`, `03_stories_lumen-goods.md`

---

## Entity Index

| Entity | Description | FR References |
|--------|-------------|---------------|
| Customer | Registered shopper | FR-001, FR-009, FR-013 |
| Address | Saved shipping or billing address | FR-009 |
| Product | Top-level catalog item | FR-002, FR-015 |
| Variant | Purchasable SKU under a product | FR-002, FR-003, FR-015 |
| Cart | Pre-order container of variants | FR-003, FR-004 |
| Order | Confirmed purchase | FR-003, FR-005, FR-006, FR-008 |
| OrderLine | One product variant within an order | FR-003, FR-007 |
| Return | Customer-initiated return request | FR-007 |
| Review | Customer review of a purchased product | FR-010 |
| LumenCircleMembership | Loyalty subscription | FR-011 |
| ConsentLog | Marketing and cookie consent history | FR-009, FR-012 |
| AdminUser | Internal staff account | FR-015 |

---

## Customer

Represents a registered shopper.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Internal unique identifier |
| email | VARCHAR(256) | UNIQUE, NOT NULL | Login credential, normalised lowercase |
| passwordHash | VARCHAR(256) | NOT NULL | bcrypt hash (cost 12) |
| firstName | VARCHAR(128) | NULLABLE | Optional given name |
| lastName | VARCHAR(128) | NULLABLE | Optional family name |
| status | ENUM | NOT NULL, DEFAULT 'pending_verification' | `pending_verification`, `active`, `suspended`, `deleted` |
| emailVerifiedAt | TIMESTAMP | NULLABLE | Set when the verification link is opened |
| marketingEmailOptIn | BOOLEAN | NOT NULL, DEFAULT false | GDPR opt-in for email marketing |
| marketingSmsOptIn | BOOLEAN | NOT NULL, DEFAULT false | GDPR opt-in for SMS marketing |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- `status = deleted` blocks login and anonymises PII fields (set to hash placeholders).
- `email` is immutable after the first verification.
- All consent toggles default to `false` (opt-in only).

---

## Address

Saved shipping or billing address belonging to a Customer.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| customerId | UUID | FK → Customer.id, NOT NULL | Owner |
| type | ENUM | NOT NULL | `shipping`, `billing`, `both` |
| isDefault | BOOLEAN | NOT NULL, DEFAULT false | Default for the given type |
| recipientName | VARCHAR(256) | NOT NULL | |
| line1 | VARCHAR(256) | NOT NULL | Street address line 1 |
| line2 | VARCHAR(256) | NULLABLE | Optional second line |
| city | VARCHAR(128) | NOT NULL | |
| postcode | VARCHAR(32) | NOT NULL | |
| countryCode | CHAR(2) | NOT NULL | ISO 3166-1 alpha-2 |
| phone | VARCHAR(32) | NULLABLE | |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Only one default address per `(customerId, type)` is allowed at any time.
- Address fields are encrypted at rest.

---

## Product

Top-level catalog item shown on the storefront. One product can have many variants.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| slug | VARCHAR(256) | UNIQUE, NOT NULL | URL-safe handle |
| title | VARCHAR(256) | NOT NULL | Display title |
| description | TEXT | NOT NULL | Long-form description (markdown) |
| categoryId | UUID | FK → Category.id, NOT NULL | Primary category |
| status | ENUM | NOT NULL, DEFAULT 'draft' | `draft`, `published`, `archived` |
| sustainabilityTags | JSONB | NOT NULL, DEFAULT '[]' | Free-form tags (e.g. `["fsc", "fair-trade"]`) |
| createdBy | UUID | FK → AdminUser.id, NOT NULL | |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Only `published` products are visible on the storefront.
- A product cannot be deleted — use `archived` to hide.

---

## Variant

A purchasable SKU under a Product. Stock and price live here.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| productId | UUID | FK → Product.id, NOT NULL | Parent product |
| sku | VARCHAR(64) | UNIQUE, NOT NULL | Human-readable SKU code |
| title | VARCHAR(256) | NOT NULL | e.g. "Sand · 350 ml" |
| priceCents | BIGINT | NOT NULL, CHECK ≥ 0 | Price in EUR cents (excluding VAT) |
| stock | INT | NOT NULL, CHECK ≥ 0 | On-hand count across both warehouses |
| reservedStock | INT | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Currently reserved by active checkouts |
| weightGrams | INT | NULLABLE | For shipping rate calculation |
| imageUrls | JSONB | NOT NULL, DEFAULT '[]' | Array of CDN URLs |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Available stock = `stock - reservedStock`. The cart-to-checkout transition decrements `stock` and `reservedStock` by the same amount only when the order is `paid`.
- `priceCents` always excludes VAT — VAT is calculated per order line at checkout based on the destination country.
- A variant cannot have negative effective stock at any time.

---

## Cart

A pre-order container of variants belonging to a Customer or to a guest session.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| customerId | UUID | FK → Customer.id, NULLABLE | NULL for guest carts |
| sessionToken | VARCHAR(128) | NULLABLE | Used to identify a guest cart |
| status | ENUM | NOT NULL, DEFAULT 'open' | `open`, `checked_out`, `abandoned` |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- A guest cart is merged into a Customer cart upon login: lines are summed.
- A cart with no activity for 30 days transitions to `abandoned`.

---

## Order

A confirmed purchase. Created when the customer reaches the payment step.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| customerId | UUID | FK → Customer.id, NULLABLE | NULL for guest orders |
| email | VARCHAR(256) | NOT NULL | Snapshot for guest orders |
| status | ENUM | NOT NULL, DEFAULT 'pending_payment' | `pending_payment`, `awaiting_payment_confirmation`, `paid`, `shipped`, `delivered`, `cancelled`, `refunded` |
| subtotalCents | BIGINT | NOT NULL | Sum of line subtotals (excl. VAT) |
| vatCents | BIGINT | NOT NULL | Total VAT amount |
| shippingCents | BIGINT | NOT NULL | Shipping cost |
| totalCents | BIGINT | NOT NULL | Grand total (subtotal + VAT + shipping) |
| currency | CHAR(3) | NOT NULL, DEFAULT 'EUR' | ISO 4217 |
| shippingAddressId | UUID | FK → Address.id, NOT NULL | Snapshot at order time |
| billingAddressId | UUID | FK → Address.id, NOT NULL | Snapshot at order time |
| stripePaymentIntentId | VARCHAR(256) | UNIQUE, NULLABLE | Stripe identifier |
| paidAt | TIMESTAMP | NULLABLE | Set when the payment-confirmed webhook arrives |
| shippedAt | TIMESTAMP | NULLABLE | |
| deliveredAt | TIMESTAMP | NULLABLE | |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Records are immutable after `delivered`. Refunds create a separate Refund row referenced by ID.
- Retained for at least 7 years per accounting requirements.
- `stripePaymentIntentId` must be unique to prevent double-processing of duplicate webhooks.

---

## OrderLine

One product variant within an Order. Immutable after creation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| orderId | UUID | FK → Order.id, NOT NULL | |
| variantId | UUID | FK → Variant.id, NOT NULL | |
| sku | VARCHAR(64) | NOT NULL | Snapshot at order time |
| title | VARCHAR(256) | NOT NULL | Snapshot |
| quantity | INT | NOT NULL, CHECK > 0 | |
| unitPriceCents | BIGINT | NOT NULL | Snapshot, excl. VAT |
| vatRatePercent | DECIMAL(5,2) | NOT NULL | Destination-based VAT rate at checkout |
| vatCents | BIGINT | NOT NULL | Calculated VAT for this line |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- All snapshot fields preserve the value at order time so future product changes never alter past orders.
- `vatRatePercent` is supplied by the managed tax service and stored for audit.

---

## Return

Customer-initiated return request linked to one or more OrderLines.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| orderId | UUID | FK → Order.id, NOT NULL | |
| customerId | UUID | FK → Customer.id, NOT NULL | |
| status | ENUM | NOT NULL, DEFAULT 'awaiting_drop_off' | `awaiting_drop_off`, `in_transit`, `received`, `approved`, `rejected`, `refunded` |
| reason | VARCHAR(256) | NOT NULL | Free-text reason from the customer |
| labelUrl | VARCHAR(512) | NULLABLE | One-time URL to the printable return label |
| refundCents | BIGINT | NULLABLE | Refunded amount once approved |
| stripeRefundId | VARCHAR(256) | NULLABLE | Stripe refund reference |
| createdAt | TIMESTAMP | NOT NULL | |
| receivedAt | TIMESTAMP | NULLABLE | |
| refundedAt | TIMESTAMP | NULLABLE | |

**Business Rules:**
- Return is created only for `delivered` orders within 30 days of `deliveredAt`.
- A `rejected` return triggers an outbound shipment back to the customer; no refund is issued.

---

## Review

Customer review of a purchased product. Pending moderation by default.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| productId | UUID | FK → Product.id, NOT NULL | |
| customerId | UUID | FK → Customer.id, NOT NULL | |
| orderId | UUID | FK → Order.id, NOT NULL | Proof of purchase |
| rating | INT | NOT NULL, CHECK 1–5 | |
| title | VARCHAR(256) | NULLABLE | |
| body | TEXT | NOT NULL | |
| photoUrl | VARCHAR(512) | NULLABLE | Optional customer photo |
| status | ENUM | NOT NULL, DEFAULT 'pending_moderation' | `pending_moderation`, `published`, `rejected` |
| createdAt | TIMESTAMP | NOT NULL | |
| moderatedAt | TIMESTAMP | NULLABLE | |

**Business Rules:**
- A customer can only submit a review if they have a `delivered` order containing the product (verified at submission).
- Only `published` reviews appear on the product page.

---

## LumenCircleMembership

Loyalty subscription state for a customer.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| customerId | UUID | FK → Customer.id, UNIQUE, NOT NULL | One membership per customer |
| stripeSubscriptionId | VARCHAR(256) | UNIQUE, NULLABLE | Stripe reference |
| status | ENUM | NOT NULL, DEFAULT 'pending' | `pending`, `active`, `past_due`, `cancelled` |
| currentPeriodStart | TIMESTAMP | NULLABLE | |
| currentPeriodEnd | TIMESTAMP | NULLABLE | |
| cancelAtPeriodEnd | BOOLEAN | NOT NULL, DEFAULT false | Set when the customer cancels |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Member benefits (free shipping, member pricing) apply only when `status = active` and `currentPeriodEnd > now()`.
- A `past_due` membership has a 7-day grace period before transitioning to `cancelled`.

---

## ConsentLog

Append-only log of every consent change for marketing and cookies.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| customerId | UUID | FK → Customer.id, NULLABLE | NULL for anonymous cookie consent |
| sessionToken | VARCHAR(128) | NULLABLE | Used for guest cookie consent |
| consentType | ENUM | NOT NULL | `marketing_email`, `marketing_sms`, `cookie_analytics`, `cookie_marketing` |
| value | BOOLEAN | NOT NULL | New value (true = opted in, false = opted out) |
| source | ENUM | NOT NULL | `signup`, `account_settings`, `cookie_banner`, `dsar_request` |
| createdAt | TIMESTAMP | NOT NULL | Timestamp of the consent change |

**Business Rules:**
- The log is append-only — entries are never updated or deleted.
- The latest entry per `(customerId, consentType)` represents the current consent state.

---

## AdminUser

Internal staff account for the admin panel.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| email | VARCHAR(256) | UNIQUE, NOT NULL | Login credential |
| passwordHash | VARCHAR(256) | NOT NULL | bcrypt hash |
| role | ENUM | NOT NULL | `admin`, `operations_manager`, `super_admin` |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | |
| createdAt | TIMESTAMP | NOT NULL | |
| lastLoginAt | TIMESTAMP | NULLABLE | |

**Business Rules:**
- `operations_manager` is read-only on price and product fields; can edit stock and process orders/returns.
- `super_admin` is required for destructive operations (anonymise customer, refund > €1,000).
- All admin actions are logged in an immutable audit log (not modelled here; handled at the application layer).

---

## Entity Relationship Summary

```
Customer ──< Address
Customer ──< Cart ──< CartLine >── Variant
Customer ──< Order ──< OrderLine >── Variant
Order ──< Return
Customer ──< Review >── Product
Product ──< Variant
Customer ──< LumenCircleMembership
Customer ──< ConsentLog
AdminUser ──< Product (as creator)
```
