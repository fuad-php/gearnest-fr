# GearNest — Equipment Rental Marketplace

GearNest is a full-stack equipment rental marketplace for construction crews, photography
studios, event producers, farms and independent operators. Owners list real gear with real
availability; renters search, book and pay securely; admins moderate the marketplace and
watch it grow.

This repository is the **Next.js client**. The API lives in the sibling `../server`
repository (Express 5 + MongoDB).

---

## Live site

| Service | URL |
| --- | --- |
| Web app | _Add your Vercel URL here after deploying_ |
| API | _Add your Render / Railway URL here after deploying_ |

> The app runs fully locally with `npm run dev`. See [Deployment](#deployment) for the
> two-service setup. Stripe, Google login and image uploads degrade gracefully when their
> keys are absent — see [Optional integrations](#optional-integrations).

---

## What it does

GearNest is built around three roles:

| Role | Can do |
| --- | --- |
| **Customer** | Browse the catalogue, view details, save favourites, book with dates and quantity, pay via Stripe, track and cancel rentals, edit their profile |
| **Owner** | Everything a customer can do for their own listings, plus add/edit/delete equipment, approve rental progress (active → completed), and see earnings analytics |
| **Admin** | Manage every user and role, approve or reject equipment listings, monitor every rental, and see platform-wide analytics |

Admins are created by the seed script only. Registration lets a person choose **customer**
or **owner**; Google sign-ups always become customers.

### Feature highlights

- **Public pages** — Home (banner, 6 featured listings, categories, why choose us, how it
  works, reviews, owner CTA), All Equipment, About, How It Works, Contact.
- **Server-side catalogue** — search by name/location, filter by category, rental type, price
  range and availability, sort, paginate. All state lives in the URL.
- **Equipment details** — gallery, specifications, rental terms, owner card, related gear,
  favourite toggle, and a booking panel that shows a live quote and remaining availability.
- **Payments** — Stripe Checkout with server-calculated totals. A booking row is created
  **only** after Stripe reports the session as paid. Abandoned checkouts expire via a TTL
  draft collection.
- **Dashboards** — role-tinted rail, KPI cards, Recharts monthly charts, sticky table
  headers, mobile drawer, loading and empty states everywhere.
- **Design system** — warm editorial catalogue: paper `#F6F3EC`, ink `#14231C`, forest
  `#17493A`, accent `#E4572E`. Bricolage Grotesque / Inter / JetBrains Mono. Motion via
  `motion/react`, respecting `prefers-reduced-motion`.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, React Compiler) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (base-nova), lucide-react |
| Auth | BetterAuth 1.7 (MongoDB adapter, email/password + Google, JWT plugin) |
| Data | MongoDB (Atlas or local) |
| Payments | Stripe Checkout |
| Charts | Recharts |
| Forms | react-hook-form + zod |
| Motion | motion (Framer Motion) |
| Notifications | sonner |

### npm packages used

**Runtime**

- `next`, `react`, `react-dom` — framework and rendering
- `better-auth`, `@better-auth/mongo-adapter`, `mongodb` — authentication and persistence
- `@base-ui/react`, `class-variance-authority`, `cn`, `shadcn`, `lucide-react`,
  `tw-animate-css` — component primitives and icons
- `tailwindcss` (v4 via `@tailwindcss/turbopack`) — styling
- `react-hook-form`, `@hookform/resolvers`, `zod` — typed form validation
- `motion` — page and card animation
- `recharts` — analytics charts
- `sonner` — toast notifications
- `date-fns` — date formatting
- `swr` — client data fetching utilities

**Development**

- `typescript`, `eslint`, `eslint-config-next` — type safety and linting
- `babel-plugin-react-compiler` — React Compiler

---

## Getting started

### 1. Requirements

- Node.js 20+
- A MongoDB connection string (Atlas or local)
- The API running from `../server` on port `5000`

### 2. Install

```bash
npm install
```

### 3. Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | yes | Public URL of this app (`http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | yes | Public URL of the Express API (`http://localhost:5000`) |
| `BETTER_AUTH_URL` | yes | Must match the app URL; used as JWT issuer/audience |
| `BETTER_AUTH_SECRET` | yes | Random secret for BetterAuth |
| `MongoDB_URI` | yes | Mongo connection used by the BetterAuth adapter |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | no | Enables Google sign-in |
| `STRIPE_SECRET_KEY` | no | Enables real Stripe Checkout (server) |
| `IMGBB_API_KEY` | no | Enables image uploads (server) |

Never commit `.env`. Only `.env.example` belongs in git.

### 4. Seed the database

From the server repository:

```bash
cd ../server
npm run seed
```

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gearnest.com` | `Admin123` |
| Owner | `owner@gearnest.com` | `Owner123` |
| Owner | `elena@gearnest.com` | `Owner123` |
| Customer | `customer@gearnest.com` | `Customer123` |

The login page lists these accounts for convenience.

---

## Optional integrations

The app is designed to stay usable without paid third-party keys:

- **Stripe** — with `STRIPE_SECRET_KEY` set, checkout redirects to real Stripe Checkout.
  Without it, the API returns a clearly labelled **demo** session and the success page
  confirms the booking locally. The UI states that the payment was simulated.
- **Google login** — the button is disabled with an explanatory note when
  `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are missing.
- **Image uploads** — owners can always paste a direct image URL. File uploads go through
  `POST /api/uploads/image`, which keeps `IMGBB_API_KEY` on the server.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on :3000 |
| `npm run build` | Production build (the commit gate) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Project structure

```
src/
  app/
    (site)/            public routes: home, equipment, about, how-it-works, contact
    (auth)/            login and register
    dashboard/         protected shell + customer, owner, admin routes
    payment/success/   checkout confirmation
    api/auth/[...all]/ BetterAuth handler
  components/
    ui/                shadcn primitives
    layout/            header, footer, container, headings, hero
    home/              home sections
    equipment/         cards, filters, pagination, booking panel, favourite button
    dashboard/         shells, tables, forms, stat cards, status pills
    charts/            Recharts wrappers
    payment/           payment confirmation
    contact/           contact form
    motion/            reduced-motion-aware reveal helpers
  lib/
    auth.ts            BetterAuth server config
    auth-client.ts     BetterAuth browser client
    api.ts             public/auth fetch helpers + token cache
    server-api.ts      server-side session and authorised fetches
    require-user.ts    role guards for dashboard pages
    validators.ts      shared zod schemas
    format.ts          currency, dates, initials
    categories.ts      category and rental-type constants
    upload.ts          client-side image upload helper
  proxy.ts             optimistic route protection (Next 16 middleware replacement)
  types/               shared TypeScript types
```

### Auth and API bridge

1. BetterAuth owns identity in MongoDB (`user`, `session`, `account`, `jwks`).
2. The browser fetches a short-lived JWT from `GET /api/auth/token`.
3. Requests to Express send `Authorization: Bearer <token>`.
4. Express verifies the token with `jose` against the BetterAuth JWKS endpoint, then
   re-reads the user's role from MongoDB before authorising the action.

Protection layers: `src/proxy.ts` (cookie presence, optimistic) → dashboard layout
(`auth.api.getSession`, authoritative) → Express middleware (`verifyToken` +
`verifyRenter` / `verifyOwner` / `verifyAdmin`).

### Pricing and availability

- Daily = number of days; weekly = `ceil(days / 7)`; monthly = `ceil(days / 30)`.
- Total = rate × rental units × quantity, minimum one day.
- Availability = overlapping confirmed/active bookings + requested quantity ≤ equipment
  quantity. The check runs again at checkout, so two people cannot claim the same unit.

---

## Deployment

The client and API deploy separately.

### Client (Vercel)

1. Import this repository into Vercel.
2. Set the environment variables from the table above, using the production URLs:
   - `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` = your Vercel domain
   - `NEXT_PUBLIC_API_URL` = your API domain
3. Build command `npm run build`, output is handled by Next.js.
4. Add the Vercel domain to the API's `CLIENT_URL` (comma-separated if you have a preview
   domain) so CORS allows it.

### API (Render / Railway / Fly)

1. Deploy the `../server` repository as a Node service: `npm install && npm start`.
2. Set `MONGODB_URI`, `BETTER_AUTH_URL` (the client domain), `CLIENT_URL`, and the optional
   `STRIPE_*` / `IMGBB_API_KEY` values.
3. Point the Stripe webhook at `https://<api-domain>/api/payments/webhook` and copy the
   signing secret into `STRIPE_WEBHOOK_SECRET`.

### MongoDB

Use MongoDB Atlas. The server creates indexes on first boot; the client's BetterAuth
adapter manages its own collections in the `gear_nest` database.

---

## Accessibility and quality

- Keyboard navigable with visible focus rings on every interactive element.
- Semantic landmarks, labelled form controls and `aria-*` state on toggles and tabs.
- Motion respects `prefers-reduced-motion`.
- Every list and table has loading, empty and error states.
- Layouts verified at 375, 768 and 1440 px.
- `npm run build` must pass before committing.

---

## Not implemented (by design)

The assignment explicitly excludes **email verification** and **forgot password** flows.
Everything else — including real Stripe and Google login — works when keys are supplied.
