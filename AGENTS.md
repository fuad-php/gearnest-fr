<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GearNest — Agent Guide

## Project

GearNest is an equipment rental marketplace. Owners list gear; customers browse, book,
pay via Stripe, and rent for a date range. Admins moderate equipment, users, and rentals.

Client: this Next.js app. Server: sibling repo at `../server` (Express 5 + MongoDB).

## Stack

- Next.js 16.4.6 (App Router, Turbopack, React Compiler), React 19, TypeScript
- Tailwind CSS v4 + shadcn/ui (base-nova), lucide-react
- BetterAuth 1.7 + `@better-auth/mongo-adapter` (email/password + Google)
- BetterAuth JWT plugin → Express verifies tokens via JWKS with `jose`
- Express 5 + MongoDB native driver (server), Stripe Checkout, imgbb

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build (must pass before committing a slice)
- `npm run lint` — ESLint
- Server: `cd ../server && npm run dev` (nodemon), `npm run seed`

## Repo layout

```
src/app/            routes (App Router)
src/components/     ui/ layout/ home/ equipment/ dashboard/ charts/
src/lib/            auth.ts auth-client.ts api.ts validators.ts format.ts
src/proxy.ts        route protection (NOT middleware.ts)
../server/src/      config/ middleware/ routes/ utils/
../server/scripts/  seed.js
```

## Architecture rules

### Auth

- BetterAuth owns identity in MongoDB db `gear_nest` (`user`, `session`, `account`, `jwks`).
- Roles: `customer` | `owner` | `admin`. Register lets the user pick customer/owner;
  a `databaseHooks.user.create.before` clamps the value. Admin is seed-only.
  Google sign-ups always become `customer`.
- Client gets a JWT from `GET /api/auth/token` (credentials: include) and sends
  `Authorization: Bearer <token>` to Express. Server-side use `auth.api.getToken({ headers })`.
- Express verifies with `jose` against `${BETTER_AUTH_URL}/api/auth/jwks`, then re-reads the
  user's role from Mongo. Never trust a role from the client or from a stale token.
- Protection layers: `src/proxy.ts` (cookie presence, optimistic) → dashboard layout
  `auth.api.getSession` (authoritative) → Express `verifyToken` + `verifyRenter|verifyOwner|verifyAdmin`.

### API

- Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).
- Public: `GET /api/equipment` (search, category, rentalType, minPrice, maxPrice,
  availability, sort, page, limit), `/featured`, `/:id`, `/categories`, `/reviews`, `/contact`, `/health`.
- Auth: `/api/users/me` (GET/PATCH), favorites CRUD, `GET /api/bookings/my`.
- Payment: `POST /api/payments/checkout`, `POST /api/payments/confirm`, `POST /api/payments/webhook`.
- Owner: equipment CRUD, `/api/owner/bookings`, `/api/owner/stats`.
- Admin: `/api/admin/users`, role change, equipment moderation, `/api/admin/bookings`, `/api/admin/stats`.
- Uploads: `POST /api/uploads/image` (server-side imgbb; never expose the imgbb key).

### Payments

No booking row exists until Stripe reports `paid`. Checkout validates dates/quantity and
creates a `bookingDrafts` row with a TTL; the success page confirms the session, then writes
`bookings` + `payments` idempotently. Availability = sum of overlapping confirmed/active
bookings + requested qty ≤ equipment quantity. Pricing: daily = days, weekly = ceil(days/7),
monthly = ceil(days/30), × qty, minimum 1 day.

## Next.js 16 rules (verified against node_modules/next/dist/docs)

- `proxy.ts` replaces `middleware.ts`.
- `params` and `searchParams` are Promises — `await` them in pages/layouts.
- Route handler context params are Promises.
- Turbopack is the default; no webpack config.
- `next/image` needs `remotePatterns` for `images.unsplash.com`, `i.ibb.co`,
  `lh3.googleusercontent.com`.
- Prefer Server Components; add `"use client"` only for interactivity (forms, filters,
  dashboards, motion).

## Design system — do not improvise

Warm editorial catalogue. Tokens live in `globals.css`.

- Paper `#F6F3EC`, surface `#FFFFFF`, ink `#14231C`, forest `#17493A`,
  accent `#E4572E`, muted `#6B746E`, border `#DCD7CB`.
- Fonts: Bricolage Grotesque (display), Inter (body), JetBrains Mono (prices/metadata).
- 1px borders, 14px radius, minimal shadows, subtle grain. No purple gradients, no glassmorphism.
- Section eyebrow `01 — Featured` in mono uppercase; one consistent heading scale.
- Cards equal height, 4:3 images, price in mono, status pill.
- Buttons: one primary (forest), one accent (orange, for payment/CTA), one outline. Reuse them.
- Motion via `motion/react`: hero stagger, `whileInView` reveals, card hover. Respect reduced motion.
- Dashboard: full-width, role-tinted rail, KPI cards, Recharts, sticky table headers, mobile drawer.

## Code conventions

- TypeScript strict, no `any` in app code; server is plain JS with zod validation.
- 2-space indent, double quotes, named exports, `@/` imports.
- Validate every form with zod + react-hook-form; toast errors with `sonner`.
- Every list/table has loading skeleton, empty state, and error state.
- Dates sent as ISO strings; money stored as integer cents where possible.
- Never hardcode secrets, URLs, or API keys — use env vars.

## Environment

Client `.env` (gitignored): `MongoDB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`.
Server `.env` (gitignored): `MONGODB_URI`, `PORT`, `BETTER_AUTH_URL`, `CLIENT_URL`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `IMGBB_API_KEY`.
Keep `.env.example` files in sync. Never commit real values.

## Git

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Client needs 20+ meaningful commits, server 12+ — commit per feature slice, not one dump.
- Client and server are separate git repos; commit in each separately.
- Do not commit `.env`, `.next`, `node_modules`, or build output.

## Definition of done for a slice

1. `npm run build` passes. 2. No console errors. 3. Responsive at 375/768/1440.
4. Keyboard accessible + visible focus. 5. Loading/empty/error states present.
6. Committed with a descriptive message.

## Never do

- Never modify the `BEGIN:nextjs-agent-rules` block.
- Never implement email verification or forgot-password (assignment says skip).
- Never let a client send its own role, price, or total amount and trust it.
- Never create a booking before payment is confirmed.
- Never expose `STRIPE_SECRET_KEY`, `IMGBB_API_KEY`, or `BETTER_AUTH_SECRET` to the browser.
