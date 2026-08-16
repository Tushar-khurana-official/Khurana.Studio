# Khurana Studio — Premium Photography E-commerce

Full-stack, production-ready e-commerce platform for a professional photography studio: cinematic 3D
hero, portfolio galleries with lightbox, packages store with Razorpay checkout, calendar booking with
deposit payments, and a protected admin dashboard.

## Tech stack

| Layer          | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) · TypeScript                          |
| 3D / animation | React Three Fiber + drei · Framer Motion                      |
| Styling        | Tailwind CSS v4 · dark/light mode · responsive 320px → 4K     |
| Database       | PostgreSQL via Prisma ORM 7 (pg driver adapter)               |
| Media          | Cloudinary (upload widget + signed server uploads)            |
| Auth           | NextAuth.js v4 (email/password + Google)                      |
| Payments       | Razorpay (orders, verify, webhooks)                           |
| Data fetching  | TanStack Query + server components                            |
| Deploy         | Vercel frontend + managed Postgres (Neon / Supabase / Railway)|

## Getting started

```bash
npm install
cp .env.example .env          # fill in real values
npm run prisma:generate       # generate Prisma client
npm run prisma:migrate        # apply schema to your Postgres
npm run prisma:seed           # admin user, sample products, testimonials
npm run dev
```

## Environment variables

See `.env.example` for the full list. Notable groups:

- `DATABASE_URL` — Postgres connection string
- `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET` — auth
- `CLOUDINARY_*` + `NEXT_PUBLIC_CLOUDINARY_*` — media (create an **unsigned upload preset**
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in Cloudinary settings)
- `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` + `NEXT_PUBLIC_RAZORPAY_KEY_ID` — payments
- `WHATSAPP_NUMBER`/`WHATSAPP_API_KEY` — optional order/booking confirmation hook (reuse existing
  WhatsApp automation infra; no-op when unset)

## Project structure

```
src/
  app/
    page.tsx                    # Home (3D hero, carousel, stats, testimonials)
    portfolio/                  # Gallery + lightbox
    shop/ + shop/[slug]/        # Store + product detail (3D framed-print mockup)
    cart/ checkout/ order-success/
    booking/ booking-success/   # Calendar booking + Razorpay deposit
    login/ register/ account/   # Auth + order/booking/download history
    admin/                      # Protected dashboard (portfolio, products, orders, bookings, messages)
    api/                        # Route handlers (all zod-validated + rate-limited)
  components/three/             # HeroScene, CameraModel, FrameMockup (lazy, ssr:false)
  lib/                          # prisma, auth, cloudinary, razorpay, whatsapp, rate-limit
  hooks/                        # React Query hooks
  generated/prisma/             # Generated client (gitignored)
```

## Key flows

- **3D hero**: procedural low-poly camera in a R3F canvas. Degrades by device memory / core count /
  connection speed (`hero-3d.tsx`) — low-end devices get a lighter scene, reduced motion or a 2D fallback.
  All 3D scenes load via `dynamic(..., { ssr: false })`.
- **Checkout**: client creates a Razorpay order server-side → Razorpay checkout opens → server verifies
  the HMAC signature → order marked `PAID` → WhatsApp/order confirmation.
- **Bookings**: pick service → calendar month view → available slots (server-computed from existing
  bookings) → details → pay deposit → slot confirmed.
- **Admin uploads**: `CldUploadWidget` uploads direct-to-Cloudinary; `/api/upload/confirm` stores
  metadata. `POST /api/upload/sign` returns signed params for custom flows.
- **Digital downloads**: `/api/download` issues signed, expiring Cloudinary URLs only to users who
  purchased that digital product.

## Performance notes

- Every image flows through `CldImage` (auto format/quality, responsive srcset).
- All data-fetching sections show skeleton loaders; queries use React Query caching.
- Scroll-linked 3D logic is eased/throttled; polygon counts kept low (no external `.glb`).
- `robots.txt`, `sitemap.xml`, Open Graph metadata and LocalBusiness JSON-LD are included.

## Deployment

1. Push to GitHub, import into Vercel.
2. Provision a Postgres instance (Neon/Supabase/Railway) and set `DATABASE_URL`.
3. Add all env vars to Vercel. Run `npx prisma migrate deploy` (and `npx prisma generate`) during build.
4. Register the Razorpay webhook at `<site>/api/orders/webhook` (events: `payment.captured`, `payment.failed`).

> Google Calendar sync and WhatsApp notifications are wired to your existing automation: bookings carry
> `googleCalendarEventId` and confirmation hooks call the WhatsApp endpoint when credentials are set.