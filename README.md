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

`npm run typecheck` runs strict TypeScript validation, `npm run lint` runs ESLint, `npm run test` runs Vitest, and `npm run build` creates the Vercel production build.
