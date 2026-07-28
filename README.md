Authentication (Google One Tap Login)

Replace the current login/signup flow with a frictionless authentication experience.

Requirements:

Integrate Google Sign-In.

Support Google One Tap Login.

If a user already has a Google account logged into the browser, clicking Login or Sign Up should immediately show the Google account selector.

After selecting the account, the user should be authenticated automatically without asking for unnecessary information.

If the user is new, automatically create an account.

If the account already exists, log them in.

Store user profile securely.

Support refresh tokens/session management.

Keep users logged in securely.

Implement logout correctly.

Handle expired sessions gracefully.

Protect against authentication attacks.

Prevent duplicate accounts.

⸻

Payment System

The current payment flow is unreliable.

Completely rebuild the payment confirmation process.

Requirements:

When the customer completes payment through:

Google Pay

PhonePe

UPI

Razorpay (or current gateway)

the website must:

Verify payment server-side.

Never trust frontend success callbacks.

Verify payment signature.

Update order status automatically.

Mark payment as:

Pending

Processing

Paid

Failed

Refunded

Redirect customer automatically back to the application.

Show:

✅ Payment Successful

or

❌ Payment Failed

Never allow payments to remain stuck.

Handle:

Network failures

Duplicate callbacks

Refresh during payment

User closes browser

Retry payment

Timeout

Failed verification

Use Webhooks.

When payment gateway sends a webhook:

Verify signature

Update database

Notify frontend instantly

No manual refresh should be required.

⸻

Orders

After successful payment:

Automatically create an order.

Order should contain:

Order ID

Customer Name

Products

Quantity

Amount

Taxes

Payment Status

Shipping Status

Date

Address

Phone Number

Email

Customer should immediately see the order inside:

“My Orders”

without refreshing.

⸻

Shipping Integration (Shiprocket)

Integrate Shiprocket API professionally.

Admin should be able to:

Generate shipment

Upload tracking ID

Create AWB

Assign courier

Update shipment

Once shipment is created:

Customer should automatically see:

Tracking Number

Courier Name

Estimated Delivery Date

Current Shipment Status

For example:

Order Confirmed

↓

Packed

↓

Picked Up

↓

In Transit

↓

Out For Delivery

↓

Delivered

Whenever Shiprocket updates shipment status, my website must automatically update too.

No manual refresh.

Use Shiprocket Webhooks or Polling (whichever is recommended).

⸻

Order Tracking

Customer should have a beautiful tracking page.

Include:

Progress Timeline

✓ Order Placed

✓ Payment Confirmed

✓ Packed

✓ Shipped

✓ In Transit

✓ Out for Delivery

✓ Delivered

Show:

Estimated Delivery

Live Status

Courier

Tracking ID

Tracking History

Last Updated Time

⸻

Admin Dashboard

Improve the dashboard.

Admin should be able to:

View all orders

Search orders

Filter orders

Update shipment

Add tracking ID

Change status

Issue refunds

Cancel orders

Export CSV

View payment logs

View failed payments

View user details

Dashboard should feel modern and responsive.

⸻

Bug Fixes

Find every bug in the project.

Fix:

UI glitches

Broken pages

Slow loading

API failures

Image loading

Mobile responsiveness

Browser compatibility

Memory leaks

Duplicate requests

Broken routing

State management issues

Validation errors

Security vulnerabilities

Database inconsistencies

Do not ignore any warning.

⸻

Performance Optimization

Optimize the application for production.

Implement:

Lazy Loading

Code Splitting

Image Optimization

Compression

API Caching

Database Indexing

Query Optimization

CDN-ready assets

Faster rendering

Reduce API calls

Loading skeletons

Error boundaries

Target:

Lighthouse Score above 95

Mobile Performance above 90

Fast initial load

Smooth animations

No lag

⸻

Security

Implement enterprise-grade security.

Include:

CSRF protection

XSS protection

SQL Injection prevention

Secure Authentication

Secure Cookies

HTTPS enforcement

Rate Limiting

Input Validation

JWT security (if used)

Encryption of sensitive data

Proper environment variables

Secure API endpoints

Role-based authorization

Admin-only routes

⸻

User Experience

The website should feel premium.

Requirements:

Beautiful animations

Smooth page transitions

Responsive design

Clean spacing

Elegant typography

Fast interactions

Accessible UI

Mobile-first layout

Modern loading states

Professional empty states

Meaningful error messages

Toast notifications

Confirmation dialogs where needed

⸻

Notifications

After successful payment:

Customer receives:

Order confirmation

Payment confirmation

Shipping updates

Delivery updates

Support:

Email notifications

In-app notifications

⸻

Database

Review the schema.

Improve:

Relationships

Indexes

Constraints

Foreign Keys

Transactions

Rollback handling

Backup safety

Ensure data consistency.

⸻

API

Review every API endpoint.

Improve:

Response format

Error handling

Validation

Logging

Security

Performance

Use consistent REST conventions (or improve the existing architecture if it’s already using another pattern).

⸻

Logging & Monitoring

Implement:

Server logs

Error logs

Payment logs

Authentication logs

Shipment logs

API logs

Add centralized error handling so failures can be diagnosed quickly.

⸻

Testing

Before considering the project complete:

Fix all compile errors

Fix all runtime errors

Fix all console warnings

Test authentication

Test payments

Test shipment

Test order creation

Test tracking

Test mobile responsiveness

Test desktop responsiveness

Test edge cases

Nothing should break.

⸻

Final Deliverables

The final application must:

Be production-ready.

Have zero known critical bugs.

Have a reliable Google Sign-In flow.

Confirm payments automatically using secure backend verification and webhooks.

Create orders instantly after successful payment.

Integrate Shiprocket with live tracking updates.

Provide a premium admin dashboard.

Be fully responsive across devices.

Be secure, scalable, maintainable, and optimized for performance.

Include clean, well-documented code with no placeholder implementations.

Preserve all existing features unless an improvement is necessary, ensuring backward compatibility where possible.

Work methodically: first analyze the existing codebase, then implement improvements feature by feature, testing each one before moving to the next. Do not mark the task complete until every feature has been verified end-to-end.
