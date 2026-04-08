# Domain Reference: Logistics / Delivery

Domain-specific knowledge for logistics and delivery projects: last-mile delivery platforms, courier management systems, freight and cargo tracking, warehouse management systems (WMS), fleet management, 3PL portals, route optimisation tools.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Service type: last-mile parcel delivery, same-day courier, long-haul freight, food/grocery delivery logistics layer, reverse logistics (returns), 3PL white-label?
- Ownership model: own fleet, gig/contractor drivers, hybrid?
- Geographic scope: city-level, national, cross-border?
- Order origination: e-commerce platform orders, business clients (B2B), or both?
- Existing integrations: ERP, e-commerce platform (Shopify, Magento), carrier APIs, mapping services?

### Typical business goals
- Reduce cost-per-delivery through route optimisation and load efficiency.
- Increase on-time delivery rate and reduce failed delivery rate.
- Provide end-to-end real-time visibility to customers and dispatchers.
- Scale operations without proportional headcount growth.
- Reduce driver idle time and fuel consumption.

### Typical risks
- Driver safety and liability for contractor fleet.
- Real-time GPS accuracy and connectivity in dead-zones.
- Proof-of-delivery disputes — legal and operational risk.
- Route planning failure during peak demand (e.g., holiday season).
- Cross-border customs compliance and documentation errors.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Actors: customer (end recipient), business client (shipper), dispatcher/operations manager, driver/courier, warehouse operator, admin, customer support?
- Order creation: via platform UI, API integration (B2B), or both?
- Route assignment: manual by dispatcher, auto-assigned by algorithm, or driver self-assign?
- Delivery confirmation: signature, OTP, photo of parcel at door, QR scan?
- Notifications: customer SMS/email on dispatch, ETA updates, failed delivery; driver push notifications?
- Returns: return pickup scheduling, reverse logistics workflow?
- SLA tiers: standard, express, same-day — different pricing and priority rules?

### Typical functional areas
- Order intake (manual, API, batch import).
- Order lifecycle management (created → collected → in-transit → delivered / failed).
- Route planning and optimisation.
- Driver / courier management (profiles, shifts, capacity, vehicle).
- Real-time GPS tracking and ETA calculation.
- Proof of Delivery (POD) capture: photo, signature, OTP.
- Customer notifications and self-service tracking page.
- Dispatcher dashboard (live map, order queue, exceptions).
- Returns and reverse logistics.
- Warehouse / hub management (inbound, sorting, outbound).
- B2B client portal (order submission, bulk upload, reporting, invoicing).
- Reporting and analytics (delivery performance, SLA adherence, driver KPIs).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Driver app flows: receive assignment, navigate to pickup, confirm pickup, navigate to delivery, capture POD, report exception?
- Dispatcher flows: assign unassigned orders, monitor live map, handle failed delivery, re-route driver?
- Customer flows: track parcel, reschedule delivery, provide safe-place instructions, view POD?

### Typical epics
- Order Creation and Management.
- Route Planning and Optimisation.
- Driver Mobile App (pickup, delivery, POD).
- Real-time Tracking (dispatcher and customer).
- Proof of Delivery.
- Failed Delivery and Exception Handling.
- Notifications (customer, driver, dispatcher).
- Returns and Reverse Logistics.
- B2B Client Portal.
- Reporting and Analytics.
- Fleet and Driver Management.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Failed delivery scenarios: no answer at door, address not found, parcel damaged, customer refuses delivery?
- Edge cases: driver app offline, GPS unavailable in building, customer OTP expired?
- Cross-border: customs hold, import duty unpaid by recipient?

### Typical exceptional flows
- Driver cannot locate address — dispatcher intervention, customer contact attempt, re-route or return to depot.
- Recipient not available — leave in safe place (if instructed), leave notice, reschedule, or return to depot after N attempts.
- Parcel damaged at pickup — photo evidence captured, order flagged, shipper notified, claim initiated.
- Driver app goes offline — last known GPS position retained, orders cached locally, sync on reconnect.
- GPS signal lost in building — manual status update by driver, ETA paused.
- OTP expired — dispatcher can regenerate and resend to customer.
- Route optimisation service unavailable — fallback to manually ordered stop list.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- ETA accuracy: what tolerance is acceptable? What triggers an ETA recalculation?
- POD validity: what counts as valid proof — photo only, photo + signature, OTP?
- Failed delivery retry policy: how many attempts before return to depot? Time between attempts?
- SLA breach: when is a delivery marked as breached? Who is notified and within what timeframe?
- Driver tracking update frequency: how often is GPS position sent to the server?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Fleet size and concurrent drivers: how many drivers active simultaneously at peak?
- Tracking update frequency required by customers: every 30 seconds, every minute?
- Map provider: Google Maps Platform, HERE, Mapbox, or OpenStreetMap?
- Offline-first driver app requirement: must work without connectivity for N minutes?
- Data retention for POD and audit: how many months/years?

### Mandatory NFR categories for Logistics
- **Real-time Performance:** GPS position updates processed within 2s of receipt. ETA recalculations completed within 3s of position update. Customer tracking page reflects driver position within 5s.
- **Scalability:** Dispatch and tracking infrastructure must handle peak order volume (e.g., holiday season) with ≤10% increase in latency.
- **Offline Resilience (driver app):** Driver app must queue up to 200 actions (status updates, POD captures) offline and sync automatically on reconnect with no data loss.
- **Availability:** Order management and dispatch: 99.9% SLA. Driver app backend: 99.95%. Customer tracking page: 99.9%.
- **Data Integrity:** POD data (photos, signatures, OTP confirmation) is write-once immutable. Delivery status transitions must be logged with actor and timestamp.
- **Security:** Driver identity verified before shift start. POD photos stored in private object storage, signed URLs for access. Customer PII (address, phone) masked in driver app after delivery completion.
- **Location Accuracy:** GPS accuracy ≤ 50m for urban routing. Fallback to cell-tower location when GPS unavailable.
- **Compliance:** Cross-border shipments must include required customs data fields. GDPR-compliant handling of recipient address data.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Order vs. shipment vs. parcel: does one order produce one shipment, or can it be split into multiple parcels?
- Stop model: is a route a list of stops, and can stops have multiple orders?
- Driver identity: employee record, contractor profile, or linked to external HR system?
- Address: geocoded at creation time or on-demand?

### Mandatory entities for Logistics
- **Order** — delivery request: origin (pickup) address, destination address, parcel details, SLA tier, status lifecycle.
- **Parcel** — physical item: dimensions, weight, barcode/QR, contents description.
- **Shipment** — groups one or more orders for dispatch: assigned driver, vehicle, planned route, actual departure/arrival.
- **Route** — planned sequence of stops: optimisation parameters, total distance, estimated duration.
- **Stop** — single delivery or pickup point on a route: address, time window, linked orders.
- **Driver** — profile: name, contact, licence, vehicle assignment, status (available, on-shift, off-duty).
- **Vehicle** — type, capacity (weight and volume), licence plate, current assignment.
- **TrackingEvent** — immutable event: type (picked-up, in-transit, delivered, failed), timestamp, GPS coordinates, actor.
- **ProofOfDelivery** — delivery confirmation: photo URL, signature data, OTP token, recipient name, timestamp.
- **FailedDelivery** — reason code, attempt number, next action (reschedule, return, safe-place), notes.
- **Notification** — channel (SMS, email, push), type (dispatch, ETA, delivered), status (sent, delivered, failed).
- **Hub / Depot** — warehouse or sorting hub: address, capacity, working hours.
- **BusinessClient** — B2B shipper account: SLA agreement, billing, API credentials.
- **Invoice** — billing to B2B client: billing period, order count, amount, payment status.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Public tracking API: unauthenticated customer tracking by tracking number?
- Webhook needs: delivery status updates to B2B client systems, failed delivery alert to shipper?
- Driver app API: REST or more efficient protocol (GraphQL, gRPC) for frequent GPS polling?

### Typical endpoint groups
- **Orders** — create, list, get detail, cancel, update SLA tier.
- **Tracking** — get current status by tracking number (public, unauthenticated), get full event history.
- **Routes** — create optimised route, get route detail, update stop sequence.
- **Driver App** — get assigned route, confirm pickup, update stop status, submit POD, report exception.
- **GPS** — ingest position update (high-frequency, lightweight endpoint).
- **Dispatch** — list unassigned orders, assign to driver, reassign, dispatcher override.
- **Notifications** — trigger manual notification, get notification history.
- **Returns** — create return request, schedule pickup, get return status.
- **B2B Client Portal** — submit orders (single/bulk), get order statuses, download invoice, API key management.
- **Admin** — driver management, vehicle management, hub management, reports.
- **Webhooks** — delivery status change, failed delivery, POD captured, SLA breach.

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Dispatcher screen: live map as primary view, or table/queue view with map as secondary?
- Driver app: mobile-native (iOS/Android) or mobile web (PWA)?
- Customer tracking: standalone tracking page or embedded in shipper's website?

### Typical screens
- **Dispatcher Dashboard — Live Map** — real-time driver positions, order pins, status legend, exception alerts.
- **Order Queue** — list of all active orders: status, driver, ETA, SLA indicator, filter/search.
- **Order Detail (Dispatcher)** — full order timeline, current driver location, contact driver, reassign action.
- **Route View** — ordered stop list, ETA per stop, map route overlay, capacity utilisation.
- **Driver App — Active Route** — current stop detail, navigation action (deep link to maps), stop list.
- **Driver App — Stop Detail** — recipient name, address, instructions, delivery action buttons (delivered, exception).
- **Driver App — POD Capture** — photo capture, signature pad, OTP input, submit.
- **Driver App — Exception Report** — reason selector, notes, photo, save and proceed.
- **Customer Tracking Page** — order status, driver position on map, ETA, delivery instructions input.
- **B2B Client Portal — Order Submission** — single order form or bulk CSV upload, SLA selector.
- **B2B Client Portal — Reporting** — delivery performance, SLA adherence, failed deliveries, invoice download.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| POD | Proof of Delivery — evidence that delivery was completed (photo, signature, OTP) |
| Last-mile | Final leg of delivery from depot/hub to recipient's address |
| ETA | Estimated Time of Arrival |
| 3PL | Third-Party Logistics — outsourced logistics and fulfillment |
| AWB | Air Waybill — shipping document for air freight |
| Manifesto | List of shipments assigned to a vehicle or route for a given trip |
| Depot | Distribution centre or hub where parcels are sorted and loaded |
| SLA | Service Level Agreement — contracted delivery timeframe |
| Dwell time | Time a driver spends at a stop — indicator of stop efficiency |
| Geocoding | Converting a text address to geographic coordinates (lat/lon) |
| Geofencing | Triggering an event when a device enters or exits a defined geographic area |
| Route optimisation | Algorithm to minimise total distance/time for a set of stops |
| Reverse logistics | Logistics flow from customer back to seller or depot (returns) |
| Dead zone | Area with no cellular or GPS signal coverage |
| OTP | One-Time Password — numeric code used to confirm identity at delivery |
| Capacity | Vehicle load limit (weight in kg, volume in m³) |
| Safe place | Pre-authorised location where parcel can be left without signature |
