# API Contract: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `02_srs_lumen-goods.md`, `07_datadict_lumen-goods.md`, `07a_research_lumen-goods.md`

**Base URL:** `https://api.lumengoods.eu/api/v1`
**Authentication:** Session cookie (customer endpoints) or staff JWT (admin endpoints). Public endpoints noted.
**Content-Type:** `application/json`

---

## Endpoint Index

| # | Method | Path | FR | US |
|---|--------|------|----|----|
| 1 | POST | `/auth/register` | FR-001 | US-001 |
| 2 | POST | `/auth/login` | FR-001 | US-001 |
| 3 | GET | `/customers/me` | FR-001 | US-001 |
| 4 | GET | `/catalog/products` | FR-002 | US-002 |
| 5 | GET | `/catalog/products/:slug` | FR-002 | US-003 |
| 6 | GET | `/cart` | FR-004 | US-004 |
| 7 | POST | `/cart/items` | FR-003 | US-003 |
| 8 | POST | `/orders` | FR-003 | US-007 |
| 9 | POST | `/orders/:id/confirm` | FR-005, FR-006 | US-007, US-008 |
| 10 | GET | `/orders` | FR-008 | US-010 |
| 11 | GET | `/orders/:id` | FR-007 | US-009 |
| 12 | POST | `/orders/:id/returns` | FR-007 | US-009 |
| 13 | GET | `/customers/me/addresses` | FR-009 | US-011 |
| 14 | POST | `/customers/me/addresses` | FR-009 | US-011 |
| 15 | GET | `/customers/me/wishlist` | FR-010 | US-013 |
| 16 | POST | `/customers/me/wishlist` | FR-010 | US-013 |
| 17 | POST | `/products/:id/reviews` | FR-010 | US-012 |
| 18 | POST | `/lumen-circle/subscribe` | FR-011 | US-014 |
| 19 | POST | `/customers/me/consent` | FR-009, FR-012 | US-005, US-011 |
| 20 | POST | `/customers/me/dsar` | FR-013 | US-015, US-016 |
| 21 | GET | `/admin/orders` | FR-015 | US-017 |
| 22 | PATCH | `/admin/orders/:id` | FR-015 | US-020 |
| 23 | GET | `/admin/products` | FR-015 | US-018 |
| 24 | PUT | `/admin/products/:id` | FR-015 | US-018 |
| 25 | GET | `/admin/reports/revenue` | FR-015 | US-019 |
| 26 | POST | `/webhooks/stripe` | FR-005, FR-006, FR-011 | — |

---

## 1. POST /auth/register

**Description:** Register a new customer account.
**Auth:** None

**Request:**
```json
{
  "email": "anna@example.com",
  "password": "Sun5hine!Forest"
}
```

**Response 201:**
```json
{
  "customer": {
    "id": "c1c2c3-...",
    "email": "anna@example.com",
    "status": "pending_verification"
  },
  "verificationEmailSent": true
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `EMAIL_ALREADY_REGISTERED` | 409 | An account with this email exists |
| `WEAK_PASSWORD` | 422 | Password did not meet the policy |

---

## 2. POST /auth/login

**Description:** Log in with email and password.
**Auth:** None

**Request:**
```json
{ "email": "anna@example.com", "password": "Sun5hine!Forest" }
```

**Response 200:**
```json
{
  "customer": {
    "id": "c1c2c3-...",
    "email": "anna@example.com",
    "status": "active"
  }
}
```

The session cookie (`HttpOnly`, `Secure`, `SameSite=Strict`) is set in the response.

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email or password is incorrect |
| `EMAIL_NOT_VERIFIED` | 403 | Customer has not verified their email |
| `RATE_LIMITED` | 429 | More than 10 attempts per minute from this IP |

---

## 3. GET /customers/me

**Description:** Retrieve the authenticated customer's profile.

**Response 200:**
```json
{
  "id": "c1c2c3-...",
  "email": "anna@example.com",
  "firstName": "Anna",
  "lastName": "de Vries",
  "status": "active",
  "marketingEmailOptIn": true,
  "marketingSmsOptIn": false,
  "createdAt": "2026-03-01T10:00:00Z"
}
```

---

## 4. GET /catalog/products

**Description:** List published products with filters and pagination.
**Auth:** None

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Category slug filter |
| `q` | string | — | Search keyword |
| `colour` | string | — | Variant attribute filter |
| `priceMin` | int | — | Minimum price in cents |
| `priceMax` | int | — | Maximum price in cents |
| `page` | int | 1 | Page number |
| `pageSize` | int | 24 | Cards per page (max 60) |

**Response 200:**
```json
{
  "total": 142,
  "page": 1,
  "pageSize": 24,
  "products": [
    {
      "id": "p1p2-...",
      "slug": "ceramic-tea-mug",
      "title": "Ceramic tea mug",
      "priceFromCents": 1900,
      "imageUrl": "https://cdn.lumengoods.eu/p/ceramic-tea-mug.jpg",
      "inStock": true
    }
  ]
}
```

---

## 5. GET /catalog/products/:slug

**Description:** Get the product detail page payload.
**Auth:** None

**Response 200:**
```json
{
  "id": "p1p2-...",
  "slug": "ceramic-tea-mug",
  "title": "Ceramic tea mug",
  "description": "Hand-thrown stoneware mug...",
  "category": "kitchenware",
  "sustainabilityTags": ["fair-trade", "low-fire-clay"],
  "variants": [
    {
      "id": "v1v2-...",
      "sku": "MUG-TEA-SAND-350",
      "title": "Sand · 350 ml",
      "priceCents": 1900,
      "inStock": true,
      "imageUrls": ["https://cdn.lumengoods.eu/v/MUG-TEA-SAND-350.jpg"]
    }
  ],
  "reviews": {
    "averageRating": 4.7,
    "count": 23
  }
}
```

---

## 6. GET /cart

**Description:** Get the current cart for the session (logged-in or guest).

**Response 200:**
```json
{
  "cartId": "cart-...",
  "lines": [
    {
      "lineId": "line-...",
      "variantId": "v1v2-...",
      "sku": "MUG-TEA-SAND-350",
      "title": "Ceramic tea mug — Sand · 350 ml",
      "quantity": 2,
      "unitPriceCents": 1900,
      "subtotalCents": 3800
    }
  ],
  "subtotalCents": 3800,
  "estimatedVatCents": 798,
  "estimatedShippingCents": 595,
  "estimatedTotalCents": 5193,
  "currency": "EUR"
}
```

---

## 7. POST /cart/items

**Description:** Add a variant to the cart.

**Request:**
```json
{ "variantId": "v1v2-...", "quantity": 2 }
```

**Response 200:** Updated cart payload (same shape as GET /cart).

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `OUT_OF_STOCK` | 422 | Requested quantity exceeds available stock |
| `MAX_QUANTITY_EXCEEDED` | 422 | Per-line cap of 20 reached |
| `VARIANT_NOT_FOUND` | 404 | Variant ID does not exist or is archived |

---

## 8. POST /orders

**Description:** Create a draft order from the current cart at the start of checkout. Reserves stock atomically.

**Request:**
```json
{
  "shippingAddressId": "a1a2-...",
  "billingAddressId": "a1a2-...",
  "shippingMethodId": "ship-standard"
}
```

**Response 201:**
```json
{
  "orderId": "o1o2-...",
  "status": "pending_payment",
  "totals": {
    "subtotalCents": 3800,
    "vatCents": 798,
    "shippingCents": 595,
    "totalCents": 5193,
    "currency": "EUR"
  },
  "stockReservedUntil": "2026-04-09T12:15:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `OUT_OF_STOCK` | 422 | One or more lines no longer have sufficient stock |
| `EMPTY_CART` | 422 | The cart contains no lines |

---

## 9. POST /orders/:id/confirm

**Description:** Confirm an order with a payment intent. The order moves to `paid` once Stripe sends the webhook.

**Request:**
```json
{
  "paymentMethod": "card",
  "stripePaymentIntentId": "pi_3OoX..."
}
```

**Response 202:**
```json
{
  "orderId": "o1o2-...",
  "status": "pending_payment",
  "message": "Awaiting payment confirmation from Stripe"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `RESERVATION_EXPIRED` | 409 | Stock reservation TTL has passed; cart must be revalidated |
| `INVALID_PAYMENT_INTENT` | 422 | The Stripe payment intent does not match this order |

---

## 10. GET /orders

**Description:** List the customer's orders, paginated.

**Query Parameters:** `page`, `pageSize`, `status`, `from`, `to`

**Response 200:**
```json
{
  "total": 12,
  "page": 1,
  "pageSize": 20,
  "orders": [
    {
      "id": "o1o2-...",
      "status": "delivered",
      "totalCents": 5193,
      "currency": "EUR",
      "createdAt": "2026-03-15T14:00:00Z"
    }
  ]
}
```

---

## 11. GET /orders/:id

**Description:** Get an order detail, including line items and tracking.

**Response 200:**
```json
{
  "id": "o1o2-...",
  "status": "shipped",
  "lines": [
    {
      "sku": "MUG-TEA-SAND-350",
      "title": "Ceramic tea mug — Sand · 350 ml",
      "quantity": 2,
      "unitPriceCents": 1900,
      "vatRatePercent": 21.00,
      "vatCents": 798
    }
  ],
  "shippingAddress": { "...": "..." },
  "tracking": {
    "carrier": "DPD",
    "number": "DPDNL12345678",
    "url": "https://tracking.dpd.com/..."
  },
  "createdAt": "2026-03-15T14:00:00Z",
  "shippedAt": "2026-03-16T09:00:00Z"
}
```

---

## 12. POST /orders/:id/returns

**Description:** Request a return for one or more order lines.

**Request:**
```json
{
  "lines": [
    { "orderLineId": "line-...", "quantity": 1, "reason": "Wrong colour" }
  ]
}
```

**Response 201:**
```json
{
  "returnId": "ret-...",
  "status": "awaiting_drop_off",
  "labelUrl": "https://files.lumengoods.eu/labels/ret-...pdf",
  "expiresAt": "2026-04-16T00:00:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `RETURN_WINDOW_EXPIRED` | 422 | Order delivered more than 30 days ago |
| `ITEM_NOT_RETURNABLE` | 422 | One or more lines are flagged as final-sale |
| `ORDER_NOT_DELIVERED` | 422 | Order is not in `delivered` status |

---

## 13. GET /customers/me/addresses

**Description:** List saved addresses for the customer.

**Response 200:**
```json
{
  "addresses": [
    {
      "id": "a1a2-...",
      "type": "both",
      "isDefault": true,
      "recipientName": "Anna de Vries",
      "line1": "Prinsengracht 263",
      "city": "Amsterdam",
      "postcode": "1016 GV",
      "countryCode": "NL"
    }
  ]
}
```

---

## 14. POST /customers/me/addresses

**Description:** Save a new address.

**Request:** Address payload with `type`, `recipientName`, `line1`, `city`, `postcode`, `countryCode`, optional `line2`, `phone`, `isDefault`.

**Response 201:** Saved address with assigned `id`.

---

## 15. GET /customers/me/wishlist

**Description:** Get the customer's wishlist.

**Response 200:**
```json
{
  "items": [
    {
      "productId": "p1p2-...",
      "title": "Ceramic tea mug",
      "priceFromCents": 1900,
      "addedAt": "2026-03-10T10:00:00Z"
    }
  ]
}
```

---

## 16. POST /customers/me/wishlist

**Description:** Add or remove a product from the wishlist.

**Request:**
```json
{ "productId": "p1p2-...", "action": "add" }
```

**Response 200:** Updated wishlist payload.

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `WISHLIST_LIMIT_REACHED` | 422 | Wishlist already contains 200 items |

---

## 17. POST /products/:id/reviews

**Description:** Submit a product review. Requires a delivered order containing the product.

**Request:**
```json
{
  "rating": 5,
  "title": "Beautiful colour, perfect size",
  "body": "Arrived well packed. The sand colour is exactly as in the photos."
}
```

**Response 201:**
```json
{
  "reviewId": "rev-...",
  "status": "pending_moderation"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `NOT_A_BUYER` | 403 | Customer has no delivered order containing the product |
| `INVALID_RATING` | 422 | Rating must be 1–5 |

---

## 18. POST /lumen-circle/subscribe

**Description:** Subscribe the customer to Lumen Circle.

**Request:**
```json
{ "stripePaymentMethodId": "pm_..." }
```

**Response 201:**
```json
{
  "membershipId": "lc-...",
  "status": "pending",
  "message": "Awaiting Stripe subscription confirmation"
}
```

---

## 19. POST /customers/me/consent

**Description:** Update marketing or cookie consent.

**Request:**
```json
{
  "consents": [
    { "type": "marketing_email", "value": true },
    { "type": "cookie_analytics", "value": true }
  ],
  "source": "account_settings"
}
```

**Response 200:**
```json
{ "updated": 2 }
```

---

## 20. POST /customers/me/dsar

**Description:** Trigger a data export or deletion request.

**Request:**
```json
{ "kind": "export" }
```

**Response 202:**
```json
{
  "requestId": "dsar-...",
  "kind": "export",
  "estimatedReadyAt": "2026-04-10T12:00:00Z"
}
```

For `kind = delete`, the response is the same shape and the deletion completes within 30 days.

---

## 21. GET /admin/orders

**Description:** Search and list orders (Admin only).
**Auth:** Admin JWT

**Query Parameters:** `search` (string), `status` (enum), `from`, `to`, `page`, `pageSize`

**Response 200:**
```json
{
  "total": 12450,
  "orders": [
    {
      "id": "o1o2-...",
      "customerEmail": "anna@example.com",
      "status": "paid",
      "totalCents": 5193,
      "currency": "EUR",
      "createdAt": "2026-04-08T10:00:00Z"
    }
  ]
}
```

---

## 22. PATCH /admin/orders/:id

**Description:** Update an order's status (e.g. mark shipped, cancel, refund).

**Request:**
```json
{ "status": "shipped", "trackingNumber": "DPDNL12345678" }
```

**Response 200:**
```json
{
  "id": "o1o2-...",
  "status": "shipped",
  "updatedAt": "2026-04-09T10:00:00Z"
}
```

---

## 23. GET /admin/products

**Description:** Search and list products (Admin only).

**Query Parameters:** `search`, `category`, `status`, `page`, `pageSize`

**Response 200:**
```json
{
  "total": 812,
  "products": [
    {
      "id": "p1p2-...",
      "title": "Ceramic tea mug",
      "status": "published",
      "variantCount": 6,
      "totalStock": 142
    }
  ]
}
```

---

## 24. PUT /admin/products/:id

**Description:** Update a product (Admin only). Operations Manager role can only update `stock` fields.

**Request:**
```json
{
  "title": "Ceramic tea mug",
  "description": "Hand-thrown stoneware mug with sand glaze...",
  "categoryId": "cat-kitchenware",
  "status": "published",
  "sustainabilityTags": ["fair-trade", "low-fire-clay"]
}
```

**Response 200:** Updated product payload with new `updatedAt`.

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 422 | Field-level validation failed |
| `OPTIMISTIC_LOCK_CONFLICT` | 409 | Another admin saved a newer version |
| `FORBIDDEN_FIELD` | 403 | Operations Manager attempted to edit a price field |

---

## 25. GET /admin/reports/revenue

**Description:** Revenue summary report (Admin only).

**Query Parameters:** `from` (date), `to` (date), `granularity` (day/week/month)

**Response 200:**
```json
{
  "totalGmvCents": 15243000,
  "orderCount": 2870,
  "averageOrderValueCents": 5310,
  "returnRatePercent": 4.2,
  "breakdown": [
    { "date": "2026-04-07", "gmvCents": 214500, "orderCount": 41 }
  ]
}
```

---

## 26. POST /webhooks/stripe

**Description:** Receive payment, refund, and subscription events from Stripe. Internal endpoint — not accessible from the customer storefront.
**Auth:** Stripe webhook signature (HMAC-SHA256 in `Stripe-Signature` header)

**Request (payment confirmation):**
```json
{
  "id": "evt_...",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_3OoX...",
      "amount": 5193,
      "currency": "eur",
      "metadata": { "orderId": "o1o2-..." }
    }
  }
}
```

**Response 200:** `{ "received": true }`

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_SIGNATURE` | 401 | Webhook signature verification failed |
| `ALREADY_PROCESSED` | 200 | Idempotency: event already processed (returns 200, not error) |
