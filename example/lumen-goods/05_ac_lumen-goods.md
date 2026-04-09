# Acceptance Criteria: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `03_stories_lumen-goods.md`, `02_srs_lumen-goods.md`

---

## US-001: Register and log in to a customer account

### AC-001-01 — New customer registration
**Type:** Positive
**Given** a visitor opens the Sign up form for the first time,
**When** they submit a valid email and a password meeting the policy,
**Then** the system creates a Customer record with `status = pending_verification`, sends a verification email, and shows a "Check your inbox" message.

### AC-001-02 — Returning customer login
**Type:** Positive
**Given** a customer has previously verified their email,
**When** they enter the correct credentials at the Login form,
**Then** the system creates a session and redirects them to the home page logged in.

### AC-001-03 — Weak password rejected
**Type:** Negative
**Given** a visitor is filling out the Sign up form,
**When** they submit a password shorter than 12 characters or missing a number/symbol,
**Then** the system returns HTTP 422 and the form highlights the password field with the specific failed rule.

---

## US-002: Browse the catalog by category and filters

### AC-002-01 — Category page renders with filters
**Type:** Positive
**Given** a visitor navigates to a category,
**When** the category page renders,
**Then** the active products are displayed paginated with the available filters (price, colour, material) shown in a sidebar.

### AC-002-02 — Filter narrows the results
**Type:** Boundary
**Given** a visitor is on a category page,
**When** they apply a filter (e.g. colour = sand),
**Then** the listing reloads to show only products matching the filter and the URL reflects the filter state for sharing.

---

## US-003: View product detail and add to cart

### AC-003-01 — Successful add to cart
**Type:** Positive
**Given** a visitor is on a product detail page and an in-stock variant is selected,
**When** they click "Add to cart",
**Then** the system creates the cart line, returns the updated cart in ≤ 300 ms p95, and the cart icon updates to show the new item count.

### AC-003-02 — Out-of-stock variant cannot be added
**Type:** Negative
**Given** the selected variant has stock = 0,
**When** the visitor clicks "Add to cart",
**Then** the button is disabled, the variant card shows "Out of stock", and no cart line is created.

### AC-003-03 — Stock unavailable returns explicit error
**Type:** Negative
**Given** the variant became out of stock between page load and the add-to-cart click,
**When** the visitor clicks "Add to cart",
**Then** the system returns HTTP 422 with code `OUT_OF_STOCK`. The visitor sees "This item just sold out" and the line is not added.

### AC-003-04 — Maximum quantity per line enforced
**Type:** Boundary
**Given** the visitor sets quantity = 100 (above the per-line cap of 20),
**When** they click "Add to cart",
**Then** the system clamps the quantity to 20 and shows "Maximum 20 per order" inline.

### AC-003-05 — Catalog service unavailable — graceful failure
**Type:** Negative
**Given** the catalog service is unavailable,
**When** the visitor opens a product detail page,
**Then** the system returns a friendly error page with a retry button and an HTTP 503 status code.

---

## US-004: View the cart

### AC-004-01 — Cart updates after adding a line
**Type:** Positive
**Given** a visitor adds a line to the cart,
**When** the cart icon is clicked,
**Then** the cart drawer shows the updated lines, subtotal, VAT, and total without a full page reload.

### AC-004-02 — Cart persists across sessions for logged-in customers
**Type:** Positive
**Given** a logged-in customer adds items to the cart and closes the browser,
**When** they return and log in again,
**Then** the cart contents are restored from the database within 5 seconds.

---

## US-005: Manage cookie and tracking consent

### AC-005-01 — First-visit banner appears
**Type:** Positive
**Given** a visitor opens the storefront for the first time,
**When** the page loads,
**Then** a cookie consent banner appears within 1 second with category toggles (necessary, analytics, marketing) and Save / Accept all buttons.

### AC-005-02 — Marketing scripts blocked until consent
**Type:** Negative
**Given** the visitor has not yet given consent,
**When** the page loads,
**Then** no analytics or marketing tag fires. Only the necessary cookies are set.

### AC-005-03 — Preferences accessible from the footer
**Type:** Positive
**Given** the visitor has previously dismissed the banner,
**When** they click "Cookie preferences" in the footer,
**Then** the same toggles are shown with their current values and can be updated.

---

## US-007: Pay with card via Stripe

### AC-007-01 — Card payment via Stripe Elements
**Type:** Positive
**Given** a customer is at the payment step with a draft order,
**When** they enter a valid test card and submit,
**Then** Stripe returns a `paymentIntentId`, the system stores it on the order, and the order moves to `paid` after the `payment_intent.succeeded` webhook arrives.

### AC-007-02 — Apple Pay button visible on supported devices
**Type:** Positive
**Given** a visitor is using a Safari browser with Apple Pay configured,
**When** they reach the payment step,
**Then** the Apple Pay button is rendered and tapping it opens the Apple Pay sheet.

### AC-007-03 — Duplicate webhook ignored (idempotency)
**Type:** Negative
**Given** the system has already marked an order as paid for a given `paymentIntentId`,
**When** the same webhook is received again,
**Then** the system discards it (idempotency check on `paymentIntentId`). The order is not modified.

---

## US-008: Pay with Klarna or SEPA

### AC-008-01 — Klarna eligibility checked at payment step
**Type:** Positive
**Given** a customer with a supported destination country is at the payment step,
**When** they select Klarna,
**Then** the customer is redirected to the Klarna hosted flow and, on confirmation, returned to the success URL.

### AC-008-02 — SEPA order awaits funds confirmation
**Type:** Negative
**Given** a customer pays with SEPA direct debit,
**When** the initial mandate is captured,
**Then** the order is set to `awaiting_payment_confirmation`. It moves to `paid` only after the funds-cleared webhook arrives. Stock is held for 5 days.

---

## US-009: Track an order and request a return

### AC-009-01 — Successful return request within window
**Type:** Positive
**Given** a logged-in customer with a delivered order ≤ 30 days old,
**When** they submit a return request for at least one line,
**Then** the system creates a Return record with `status = awaiting_drop_off`, generates a return label, and emails it to the customer.

### AC-009-02 — Return blocked outside the window
**Type:** Negative
**Given** an order was delivered 35 days ago,
**When** the customer attempts to request a return,
**Then** the system rejects with HTTP 422 and code `RETURN_WINDOW_EXPIRED`. The UI shows "This order is no longer eligible for return."

### AC-009-03 — Refund issued after operations approval
**Type:** Positive
**Given** a return has been received and quality-checked,
**When** the operations team approves it,
**Then** Stripe processes a refund for the returned lines and the customer is notified by email within 60 seconds.

---

## US-011: Manage addresses and marketing consent

### AC-011-01 — Save default shipping address
**Type:** Positive
**Given** a logged-in customer is on the Address book screen,
**When** they save a new address and mark it as default for shipping,
**Then** the system stores the address and unflags any previous default. The address pre-fills at the next checkout.

### AC-011-02 — Marketing consent is opt-in
**Type:** Positive
**Given** a customer is in the registration flow,
**When** they complete signup,
**Then** marketing email and SMS toggles default to OFF. The consent state is recorded with timestamp and source = `signup`.

### AC-011-03 — Consent change is timestamped
**Type:** Positive
**Given** a customer toggles a consent option in account settings,
**When** they save,
**Then** a new ConsentLog entry is created with the new value, timestamp, and source = `account_settings`.

---

## US-012: Submit a product review

### AC-012-01 — Review accepted only from verified buyers
**Type:** Positive
**Given** a customer has a delivered order containing the product,
**When** they submit a review,
**Then** the review is created with `status = pending_moderation` and queued for admin approval.

### AC-012-02 — Review rejected from non-buyer
**Type:** Negative
**Given** a customer has never purchased the product,
**When** they attempt to submit a review,
**Then** the system returns HTTP 403 with code `NOT_A_BUYER`. The submit button is disabled in the UI in this case.

---

## US-013: Save a product to my wishlist

### AC-013-01 — Add to wishlist
**Type:** Positive
**Given** a logged-in customer is on a product detail page,
**When** they click the wishlist heart icon,
**Then** the product is added to their wishlist and the icon switches to the filled state.

### AC-013-02 — Wishlist limited to 200 items
**Type:** Boundary
**Given** a customer's wishlist already contains 200 items,
**When** they try to add another,
**Then** the system rejects with HTTP 422 and the UI shows "Wishlist limit reached — remove an item to add a new one."

---

## US-017: Search and view customer orders

### AC-017-01 — Order found by customer email
**Type:** Positive
**Given** an admin is on the Orders screen,
**When** they search for a customer by email,
**Then** the system returns a list of matching orders with ID, status, total, and order date.

### AC-017-02 — No results for unknown email
**Type:** Negative
**Given** an admin searches for an email that does not exist,
**When** the search completes,
**Then** the system returns an empty list with the message "No orders found."

---

## US-018: Manage products and stock

### AC-018-01 — Product update saved with audit entry
**Type:** Positive
**Given** an admin edits a product price and clicks Save,
**When** the request succeeds,
**Then** the price is updated, an audit log entry is written with the before/after values, and the storefront page reflects the change within 60 seconds.

### AC-018-02 — Negative stock rejected
**Type:** Boundary
**Given** an admin enters a stock adjustment that would result in negative stock,
**When** they attempt to save,
**Then** the system rejects with HTTP 422 and the message "Stock cannot go below zero." No change is saved.

### AC-018-03 — Bulk CSV adjustment is atomic
**Type:** Positive
**Given** an admin uploads a CSV with 50 stock adjustments,
**When** the upload is processed,
**Then** all 50 rows are applied in a single database transaction. If any row fails validation, the whole upload is rejected with a per-row error report.

---

## Coverage Summary

| Story | AC Count | Covered types |
|-------|---------|---------------|
| US-001 | 3 | Positive, Negative |
| US-002 | 2 | Positive, Boundary |
| US-003 | 5 | Positive, Negative, Boundary |
| US-004 | 2 | Positive |
| US-005 | 3 | Positive, Negative |
| US-007 | 3 | Positive, Negative |
| US-008 | 2 | Positive, Negative |
| US-009 | 3 | Positive, Negative |
| US-011 | 3 | Positive |
| US-012 | 2 | Positive, Negative |
| US-013 | 2 | Positive, Boundary |
| US-017 | 2 | Positive, Negative |
| US-018 | 3 | Positive, Boundary |

**Total AC:** 35 across 13 Must-priority stories.
