# ReactFood

ReactFood is a Next.js App Router food ordering platform with a TypeScript frontend, Zod validation, Auth.js credentials/OAuth support, Mongoose persistence, Stripe Checkout, transactional email hooks, and a local development fallback for browsing and guest checkout.

The project uses ESLint 9 because the current Next.js 16 flat-config plugins do not yet support ESLint 10; all other core versions were checked against the current stable npm releases during the migration.

## Local setup

1. Install Node.js 24 or newer.
2. Copy `.env.local.example` to `.env.local` and fill in the values you use.
3. Run `npm install`.
4. Run `npm run dev` and open the URL shown by Next.js.
5. With `MONGODB_URI` set, run `npm run seed` to migrate all 20 meals from the original tutorial catalog.

Required production variables are `MONGODB_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, and `EMAIL_FROM`. Google OAuth additionally uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## Stripe webhook

In Stripe Dashboard, create a webhook endpoint for `https://YOUR_DOMAIN/api/webhooks/stripe`, subscribe to `checkout.session.completed`, and copy its signing secret to `STRIPE_WEBHOOK_SECRET`. Keep Stripe test keys for staging and production keys for the live deployment.

## Deploying to Vercel

1. Connect this repository to Vercel.
2. Add every required environment variable in the Vercel project settings.
3. Deploy the project; no separate Express server is required.
4. Run `npm run seed` with the production or staging `MONGODB_URI`.
5. Register the deployed `/api/webhooks/stripe` URL in Stripe as described above.

## Checks

`npm run typecheck` runs strict TypeScript validation, `npm run lint` runs ESLint, `npm run test` runs Vitest, `npm run e2e` runs Playwright browser journeys, and `npm run build` creates the Vercel production build. Set `NEXT_PUBLIC_FEATURE_PROMO_CODES`, `NEXT_PUBLIC_FEATURE_ADMIN_CHARTS`, or `NEXT_PUBLIC_FEATURE_PWA_PROMPT` to `true`/`false` to control settling features.

## Architecture

The App Router serves the storefront and server routes in one deployable process. Client components own cart/forms and call API routes; `lib/services` owns business rules; repository-shaped dependencies in the services keep pricing and persistence testable; Mongoose owns durable data; the payment provider interface isolates Stripe; Resend handles transactional email.

## Common Issues

Fonts are packaged locally with `@fontsource/lato` and `@fontsource/raleway`, so builds do not require access to Google Fonts. Stripe checkout and webhooks require the environment variables in `.env.local`. Without MongoDB, browsing can use seed fallback data, but order creation and payment intentionally require durable storage.

## Contributing

Use the local quickstart above, keep changes small and reviewable, and land one coherent change at a time. Brooks's Law applies here: more simultaneous, uncoordinated changes increase integration risk rather than making delivery faster. Run lint, typecheck, and tests before opening a pull request.
