# ReactFood UX Audit

## Heuristic evaluation

| Nielsen heuristic               | Finding                                                                                  | Resolution                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Visibility of system status     | Cart additions had feedback, but it covered header controls; loading states were static. | Toasts move to a capped bottom stack; cart count pulses; shimmer loading states and cart sync copy are present. |
| Match with the real world       | The UI alternated between two names for the shopping cart.                               | “Cart” is now the single product term.                                                                          |
| User control and freedom        | Removing a cart line was irreversible.                                                   | Removal offers an Undo action.                                                                                  |
| Consistency and standards       | Admin/status and quantity behavior were duplicated.                                      | Shared status constants, admin helper, and touch-sized controls reduce drift.                                   |
| Error prevention                | Quantity could grow without a product limit; checkout feedback was delayed.              | Cart quantities are capped at 20 and checkout disables during submission.                                       |
| Recognition rather than recall  | Search could not be combined with sorting.                                               | Search, category, and server-backed price/name sorting work together.                                           |
| Flexibility and efficiency      | Keyboard users lacked a skip target and explicit search Enter handling.                  | Skip link and keyboard-friendly search are included.                                                            |
| Aesthetic and minimalist design | Cards felt flat and skeletons were static.                                               | Hover elevation, pulse feedback, blur-up images, shimmer, and reduced-motion support were added.                |
| Help users recover from errors  | Technical infrastructure wording could reach users.                                      | Customer-facing API errors use plain language; details stay server-side.                                        |
| Help/documentation              | There was no living UX reference.                                                        | This audit and journey map document the intended experience and follow-ups.                                     |

## Guest checkout cognitive walkthrough

1. **Goal:** A guest can identify the menu, search/filter it, and add a meal without creating an account.
2. **Next action:** Cart feedback is visible without blocking Account or Cart controls; the cart drawer exposes a clear checkout action.
3. **Form comprehension:** Checkout fields are labelled and validate in place. Cart state persists while navigating away.
4. **Recovery:** API failures retain the form and cart; checkout submission disables immediately to prevent duplicates.
5. **Completion:** The confirmation route exposes the order reference and payment/fulfillment state.

Known follow-ups: live order polling, a richer order timeline, real saved-address editing, and a production browser test against Stripe test mode require deployed infrastructure and credentials.

## SUS deployment note

Once real traffic exists, show a two-question post-checkout prompt with an optional 10-item System Usability Scale survey. Sample after successful delivery, keep it dismissible, and segment by guest versus returning customer.

## Manual QA checklist

- Test 320px, 768px, and 1440px widths.
- Add an item, keep the toast visible, and click Cart and Account.
- Verify keyboard skip link, search Enter, drawer close, and quantity controls.
- Test `prefers-reduced-motion` and both theme token sets when light theme work lands.
