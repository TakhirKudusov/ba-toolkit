# Use Cases: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `01_brief_lumen-goods.md`, `02_srs_lumen-goods.md`, `03_stories_lumen-goods.md`

---

## UC-001: Customer Registration

**Actor:** Guest
**Linked US:** US-001
**FR Reference:** FR-001

**Preconditions:**
- Visitor is on the Lumen Goods storefront.
- Visitor does not have an existing account with the entered email.

**Main Success Scenario:**
1. Visitor clicks "Sign up" in the header.
2. Visitor enters email and a password meeting the policy (min 12 chars, 1 number, 1 symbol).
3. Frontend sends `POST /api/v1/auth/register` with the credentials.
4. System validates the email format and password strength.
5. System creates a Customer record with `status = pending_verification` and a hashed password.
6. System sends a verification email with a one-time token.
7. Visitor opens the verification link.
8. System validates the token, sets `status = active`, and creates a session.
9. Visitor is redirected to the home page logged in.

**Alternative Flows:**
- **A1 — Visitor logs in instead (step 1):** Existing customer enters credentials at the Login screen. System verifies password hash and issues a session.

**Exception Flows:**
- **E1 — Email already registered (step 5):** System returns `409 Conflict`. Frontend prompts the visitor to log in or reset the password.
- **E2 — Password too weak (step 4):** System returns `422 Unprocessable Entity` with the failed policy rules. Frontend highlights the password field.
- **E3 — Verification token expired (step 8):** System returns `410 Gone`. Frontend offers to resend the verification email.

**Postconditions:**
- Customer record exists with `status = active` and a verified email.
- A session cookie is set in the browser.

---

## UC-002: Add to Cart and Checkout

**Actor:** Guest, Customer
**Linked US:** US-003, US-004, US-007
**FR Reference:** FR-002, FR-003, FR-004, FR-005

**Preconditions:**
- Visitor is on the storefront.
- The chosen variant is in stock.

**Main Success Scenario:**
1. Visitor opens a product detail page.
2. Visitor selects a variant (e.g. colour: sand, size: 350 ml) and clicks "Add to cart".
3. Frontend sends `POST /api/v1/cart/items` with `{ variantId, quantity }`.
4. System validates: variant exists, stock available ≥ quantity, price unchanged since page load.
5. System adds the line to the cart, recalculates totals (incl. VAT for the destination country).
6. System returns the updated cart.
7. Visitor opens the cart and clicks "Checkout".
8. System reserves stock for all cart lines for 15 minutes (atomic update).
9. Visitor enters shipping address; system fetches shipping methods and applies destination-based VAT via the managed tax service.
10. Visitor selects shipping method and clicks "Continue to payment".
11. System creates a draft Order in the database with `status = pending_payment`.
12. Frontend mounts Stripe Elements and the visitor enters card details.
13. Stripe returns a `paymentIntentId`.
14. Frontend sends `POST /api/v1/orders/:id/confirm` with the `paymentIntentId`.
15. Stripe sends a `payment_intent.succeeded` webhook to the backend.
16. System verifies the webhook signature, marks the Order as `paid`, releases the stock reservation as a permanent stock decrement, and queues an order confirmation email.
17. Visitor sees the order confirmation page.

**Alternative Flows:**
- **A1 — Apple Pay / Google Pay (step 12):** Visitor taps the wallet button. Stripe handles the wallet flow and returns a `paymentIntentId`. Skip steps 13–14 (still wait for webhook in step 15).
- **A2 — Logged-in customer (step 9):** System pre-fills the address from the customer's default address.

**Exception Flows:**
- **E1 — Stock unavailable (step 4):** System returns `422 Unprocessable Entity` with code `OUT_OF_STOCK`. Frontend shows "This item just sold out" and removes the line from the cart.
- **E2 — Reservation expired (step 12 onwards):** Stock reservation TTL passed. System rejects the confirm call with `409 Conflict` and asks the visitor to re-validate the cart. Cart is reloaded with current stock.
- **E3 — Payment failed (step 15):** Stripe sends `payment_intent.payment_failed`. System keeps Order at `pending_payment` and shows a retry prompt. Stock reservation is held until the original 15-minute TTL expires.
- **E4 — SCA required and abandoned (step 12):** Visitor closes the SCA modal. Frontend allows retry. Order remains `pending_payment`.

**Postconditions:**
- Order saved with line items, addresses, totals, VAT breakdown, and Stripe `paymentIntentId`.
- Stock decremented permanently for paid orders.
- Order confirmation email sent.

---

## UC-003: Klarna BNPL Checkout

**Actor:** Customer, Payment Provider
**Linked US:** US-008
**FR Reference:** FR-006

**Preconditions:**
- Customer is at the payment step of checkout (UC-002, steps 1–11 completed).
- Customer's destination country is supported by Klarna.

**Main Success Scenario:**
1. Customer selects "Klarna — Pay later" at the payment step.
2. Frontend creates a Klarna payment intent via Stripe.
3. Customer is redirected to the Klarna hosted flow.
4. Customer completes the Klarna eligibility check and confirms.
5. Klarna redirects the customer back to the success URL.
6. Stripe sends `payment_intent.succeeded` webhook to the backend.
7. System marks the Order as `paid` and decrements stock.

**Alternative Flow — SEPA direct debit:**
1. Customer selects "SEPA direct debit".
2. Customer enters IBAN and accepts the SEPA mandate.
3. Stripe creates a payment with `processing` status.
4. System marks the Order as `awaiting_payment_confirmation` and reserves stock for 5 days.
5. When the funds-cleared webhook arrives (typically 1–3 days), system marks the Order as `paid`.

**Exception Flows:**
- **E1 — Klarna eligibility rejected (step 4):** Klarna returns the customer to the payment step with an error. Frontend shows "Klarna is not available for this order. Please try a card." Order stays `pending_payment`.
- **E2 — SEPA mandate failed (alt step 2):** Stripe rejects the IBAN. Frontend shows the IBAN field with an inline error.
- **E3 — SEPA payment failed after authorisation (alt step 5):** Funds did not clear. System marks the Order as `payment_failed`, releases the stock reservation, and emails the customer.

**Postconditions:**
- For Klarna: Order is `paid` and stock decremented.
- For SEPA: Order is `awaiting_payment_confirmation` until funds clear, then `paid`.

---

## UC-004: Order Tracking and Return Request

**Actor:** Customer
**Linked US:** US-009
**FR Reference:** FR-007

**Preconditions:**
- Customer is logged in.
- Customer has at least one order.

**Main Success Scenario:**
1. Customer opens "My orders" and selects an order.
2. Frontend fetches `GET /api/v1/orders/:id`.
3. System returns the order with status timeline and tracking link (if shipped).
4. For a delivered order within 30 days, the customer clicks "Request a return".
5. Customer selects the items and quantities to return and a reason.
6. Frontend sends `POST /api/v1/orders/:id/returns`.
7. System validates: order is `delivered`, within return window, items are returnable.
8. System creates a Return record with `status = awaiting_drop_off` and generates a return label via the 3PL API.
9. System emails the return label to the customer.
10. Customer drops the parcel at a carrier point. The 3PL sends a "received" webhook within 1–7 days.
11. System updates the Return to `received` and notifies the operations team.
12. Operations approves the return after a quality check; system issues a refund through Stripe.
13. Customer is notified by email of the refund completion.

**Exception Flows:**
- **E1 — Outside return window (step 7):** System returns `422 Unprocessable Entity` with code `RETURN_WINDOW_EXPIRED`. Frontend shows "This order is no longer eligible for return."
- **E2 — Item not returnable (step 7):** Some items (e.g. final-sale promotions) cannot be returned. System rejects the line with `422` and lists the non-returnable items.
- **E3 — Return rejected at quality check (step 12):** Operations marks the return as `rejected`. System emails the customer with the reason and arranges to send the item back.

**Postconditions:**
- Return record saved with status, reason, items, label, and refund reference.
- For a successful return: Stripe refund processed and order partially or fully refunded.

---

## UC-005: Lumen Circle Subscription Activation

**Actor:** Customer, Payment Provider
**Linked US:** US-014
**FR Reference:** FR-011

**Preconditions:**
- Customer is logged in.
- Customer is not already a Lumen Circle member.

**Main Success Scenario:**
1. Customer opens the "Lumen Circle" landing page.
2. Customer clicks "Join for €4.99/month".
3. System creates a draft LumenCircleMembership record with `status = pending`.
4. Frontend mounts Stripe Elements for the subscription payment.
5. Customer enters card details and confirms.
6. System creates a Stripe Subscription via the API.
7. Stripe sends `customer.subscription.created` webhook.
8. System updates the membership to `status = active` with `currentPeriodEnd` set.
9. Customer sees the "Welcome to Lumen Circle" page with member benefits enabled.
10. On every subsequent checkout, the system applies free shipping and member pricing.

**Alternative Flows:**
- **A1 — Cancellation:** Customer opens "Manage membership" and clicks "Cancel". System calls Stripe to cancel at period end. Membership stays `active` until `currentPeriodEnd`, then transitions to `cancelled`.

**Exception Flows:**
- **E1 — Initial payment fails (step 6):** Stripe returns a card error. System keeps the membership at `pending` and shows the error to the customer for retry.
- **E2 — Renewal payment fails:** Stripe sends `invoice.payment_failed`. System sets the membership to `past_due` and starts a 7-day grace period. If still unpaid after 7 days, transition to `cancelled`.

**Postconditions:**
- LumenCircleMembership saved with Stripe subscription reference and current period.
- Customer sees member benefits applied across the storefront.

---

## UC-006: Admin Catalog Update

**Actor:** Admin
**Linked US:** US-018
**FR Reference:** FR-015

**Preconditions:**
- Admin is logged in to the admin panel with the Admin role.

**Main Success Scenario:**
1. Admin opens the Products screen.
2. Admin searches for a product by SKU or name and opens the detail view.
3. Admin updates one or more fields: title, description, category, price, stock, sustainability metadata, images.
4. System validates: price ≥ 0, SKU unique, category exists, stock ≥ 0.
5. Admin clicks Save.
6. System persists the changes, writes an audit log entry (admin id, before/after diff, timestamp), and invalidates the product cache.
7. The product page on the storefront reflects the change within 60 seconds.

**Alternative Flows:**
- **A1 — Bulk stock adjustment (step 2):** Admin uploads a CSV with SKU and stock delta. System validates each row and applies in a single transaction. A summary report is shown.

**Exception Flows:**
- **E1 — Validation error (step 4):** System rejects the save with field-level errors highlighted in the form.
- **E2 — Conflict on optimistic locking (step 6):** Another admin saved the product first. System returns `409 Conflict` and shows a "reload to see latest" prompt.

**Postconditions:**
- Product record updated and versioned.
- Audit log entry created.
- Storefront cache invalidated.
