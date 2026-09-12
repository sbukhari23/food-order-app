# ReactFood User Journeys

## Guest purchase

**Given** a visitor lands on the menu, **when** they search, filter, sort, and add a meal, **then** the cart count, live announcement, and non-blocking toast confirm the action. **When** they open the cart and submit valid delivery details, **then** the order is created, payment begins, and confirmation shows the order reference.

## Returning customer reorder

**Given** an authenticated customer has order history, **when** they open Account and choose a previous order, **then** they can review its items and use reorder to restore those items to the cart. **When** checkout opens, **then** saved delivery details are prefilled.

## Admin menu management

**Given** an authenticated admin, **when** they open the admin area, **then** they can review menu and order operations. **When** they create, edit, or delete a meal, **then** validation, double-submit protection, and confirmation for destructive actions prevent accidental changes.
