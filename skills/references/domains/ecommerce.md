# Domain Reference: E-commerce

Domain-specific knowledge for e-commerce projects: B2C online stores, B2B catalogs, multi-vendor marketplaces, D2C brands, subscription box services, digital goods platforms.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: B2C store, B2B catalog, multi-vendor marketplace, D2C brand, subscription service, digital goods?
- Catalog scale: number of SKUs, product variants, categories?
- Fulfillment model: own warehouse, dropshipping, third-party fulfillment (3PL), seller-ships?
- Monetization: product sales margin, seller commission (marketplace), subscription fee, advertising?
- Existing systems to integrate or replace: ERP, PIM, WMS, accounting?

### Typical business goals
- Increase online revenue and GMV (Gross Merchandise Value).
- Reduce cart abandonment rate.
- Grow repeat purchase rate and customer LTV.
- Expand to new markets or channels (mobile app, social commerce).
- Automate order processing and reduce operational costs.

### Typical risks
- High cart abandonment at checkout.
- Inventory sync failures across channels.
- Payment processing downtime during peak sales events.
- Seller fraud or counterfeit products (marketplace).
- Regulatory requirements: consumer protection laws, VAT/tax compliance by geography.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: guest shopper, registered customer, seller/vendor (if marketplace), warehouse operator, admin, support agent, marketing manager?
- Payment methods: card (Stripe, Braintree), PayPal, BNPL (Klarna, Afterpay), crypto, local methods?
- Shipping: own couriers, third-party carriers (FedEx, UPS, DHL), real-time shipping rates?
- Inventory management: single warehouse, multi-warehouse, real-time stock reservation?
- Promotions: discount codes, bundle pricing, flash sales, loyalty points, gift cards?
- Multi-currency and multi-language support?
- Tax calculation: VAT by country, US sales tax, tax-exempt B2B customers?

### Typical functional areas
- Product catalog (browsing, search, filtering, sorting).
- Product detail page (images, variants, stock status, reviews).
- Cart and wishlist.
- Checkout (address, shipping method, payment, order summary).
- Order management (tracking, history, cancellation, returns/refunds).
- Seller portal (marketplace): product listing, order management, payouts.
- Admin panel: catalog management, order processing, customer management, promotions, reports.
- Customer account: profile, address book, order history, loyalty points.

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical flows: product search, add to cart, guest checkout vs. registered checkout?
- Edge cases: out-of-stock during checkout, payment failure, partial shipment, return request?
- Personas: one-time buyer, returning customer, B2B bulk buyer, marketplace seller?

### Typical epics
- Product Discovery (search, browse, filter, recommendations).
- Cart and Wishlist.
- Checkout and Payment.
- Order Management and Tracking.
- Returns and Refunds.
- Customer Account.
- Seller Portal (marketplace).
- Promotions and Loyalty.
- Admin and Reporting.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: item goes out of stock during checkout, payment declined, address validation fails, coupon code invalid?
- External system actors: payment gateway, shipping carrier API, tax calculation service, fraud detection service?

### Typical exceptional flows
- Payment gateway timeout — retry or alternative payment method offered.
- Item out of stock after cart reservation — notification and substitution or removal.
- Shipping carrier API unavailable — fallback to flat-rate shipping estimate.
- Fraud detection flag — order held for manual review.
- Return request after return window closed — escalate to support.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Inventory reservation: when is stock reserved — on add to cart, on checkout start, or on payment confirmation?
- Return policy: return window (days), restocking fee, refund method (original payment, store credit)?
- Partial fulfillment: can an order ship in multiple parcels? Is partial refund supported?
- Price rules: are prices inclusive or exclusive of tax? Flash sale price — when does it expire?
- Cart behaviour: does the cart persist across sessions? Across devices?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Peak load: expected traffic during flash sales, Black Friday, seasonal peaks (CCU, RPS)?
- Page performance: target Core Web Vitals — LCP, FID, CLS?
- PCI DSS compliance level required (depends on payment handling model)?
- Search: full-text search with typo tolerance, faceted filtering — Elasticsearch, Algolia, or native DB?

### Mandatory NFR categories for E-commerce
- **Performance:** Product listing page load < 2s (LCP). Search results < 500ms. Checkout page < 1.5s. Cart update < 300ms.
- **Scalability:** System must handle 10× normal traffic during peak sales events without degradation.
- **Security:** PCI DSS compliance for cardholder data. HTTPS everywhere. CSRF protection on checkout. Fraud scoring on orders.
- **Availability:** SLA 99.9% uptime. Checkout flow prioritised for zero-downtime deployments.
- **SEO:** Server-side rendering or static generation for product and category pages. Canonical URLs. Structured data (Schema.org Product).
- **Accessibility:** WCAG 2.1 AA for checkout and product pages.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Product variants: how are they modelled — attribute matrix (size × colour) or flat SKU list?
- Prices: stored with or without tax? Multiple price tiers (retail, wholesale, member)?
- Order states: what is the full lifecycle (pending → confirmed → processing → shipped → delivered → returned)?
- Soft delete: are products and orders soft-deleted or hard-deleted?
- Amounts: stored in minor currency units (cents)?

### Mandatory entities for E-commerce
- **Product** — master product record: name, description, brand, category, status.
- **ProductVariant** — SKU-level record: size, colour, price, stock quantity, barcode.
- **Category** — hierarchical product taxonomy.
- **Cart** — session or user cart: items, applied coupons, shipping estimate.
- **CartItem** — line item in cart: variant, quantity, price snapshot.
- **Order** — placed order: status lifecycle, totals, shipping and billing addresses.
- **OrderItem** — line item in order: variant, quantity, unit price, discount.
- **Customer** — registered user: profile, address book, loyalty balance.
- **Address** — shipping or billing address linked to customer or order.
- **Payment** — payment attempt: method, status, gateway transaction ID, amount.
- **Shipment** — shipment: carrier, tracking number, status, items shipped.
- **Return** — return request: items, reason, status, refund amount.
- **Coupon** — discount code: type (percentage, fixed, free shipping), usage limits, validity.
- **Review** — product review: rating, text, verified purchase flag.
- **Seller** _(marketplace)_ — vendor account: profile, commission rate, payout details.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Webhook needs: order status updates to seller, payment gateway callbacks, inventory webhooks from ERP?
- Real-time: stock level updates on product page, order status notifications — WebSocket or polling?
- Pagination: cursor-based or offset for product listing and order history?

### Typical endpoint groups
- **Catalog** — products list, product detail, search, categories, reviews.
- **Cart** — get cart, add item, update quantity, remove item, apply coupon.
- **Checkout** — calculate shipping, validate address, place order, payment initiation.
- **Orders** — order history, order detail, cancel order, track shipment.
- **Returns** — create return request, return status, refund status.
- **Account** — register, login, profile, address book, loyalty balance.
- **Seller** _(marketplace)_ — product management, order management, payout history.
- **Admin** — catalog management, order management, customer management, promotions, reports.
- **Webhooks** — payment gateway callback, carrier tracking update, inventory sync.

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: homepage, category page, product detail, cart, checkout (single-page or multi-step), order confirmation?
- Mobile-first or responsive desktop design?
- Guest checkout allowed, or registration required?
- Specific states: out of stock, pre-order, flash sale countdown, product with multiple variants?

### Typical screens
- **Homepage** — hero banner, featured categories, promotional items, recently viewed.
- **Category / PLP (Product Listing Page)** — product grid/list, filter panel, sort, pagination, active filters.
- **Product Detail / PDP** — images gallery, variant selector, price, stock status, add to cart, reviews.
- **Cart** — line items, quantity controls, coupon input, order summary, proceed to checkout.
- **Checkout** — address step, shipping method step, payment step, order review.
- **Order Confirmation** — order number, summary, estimated delivery, next steps.
- **Order History** — list of orders with status, link to tracking.
- **Order Detail** — items, tracking, return option, invoice download.
- **Customer Account** — profile, addresses, orders, wishlist, loyalty points.
- **Seller Dashboard** _(marketplace)_ — orders pending, revenue, listings, payouts.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| SKU | Stock Keeping Unit — unique identifier for a product variant |
| GMV | Gross Merchandise Value — total sales volume before deductions |
| AOV | Average Order Value |
| PDP | Product Detail Page |
| PLP | Product Listing Page |
| PIM | Product Information Management — system for managing product data |
| WMS | Warehouse Management System |
| 3PL | Third-Party Logistics — outsourced fulfillment provider |
| Dropshipping | Fulfillment model where the seller does not hold inventory |
| BNPL | Buy Now Pay Later — deferred payment option |
| LTV | Customer Lifetime Value |
| CAC | Customer Acquisition Cost |
| Cart abandonment | When a shopper adds items to cart but does not complete checkout |
| Chargeback | Payment reversal initiated by the customer's bank |
| PCI DSS | Payment Card Industry Data Security Standard |
| Faceted search | Search with multiple simultaneous filter dimensions |
| UGC | User-Generated Content (reviews, photos) |
