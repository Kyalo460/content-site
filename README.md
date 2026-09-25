# Shirlene Creator Platform

A premium, production-ready creator media website built with Next.js 14, TypeScript, Prisma, and Stripe.

## Features

- **Premium Design**: Feminine/erotic aesthetic with rose/gold/cream color palette
- **Authentication**: Secure admin auth with NextAuth v5, bcrypt, rate limiting
- **Media Management**: Upload, optimize, thumbnail generation, signed URLs
- **Collections**: Organize media into published/draft collections
- **Payments**: Stripe Checkout with webhook verification, entitlements
- **Admin Dashboard**: Revenue, orders, media, collections, settings
- **Legal Pages**: Terms, Privacy, Refund policies (CMS-editable)
- **WhatsApp Contact**: Configurable floating button
- **Age Gate**: Configurable 18+ verification
- **Security**: CSP, rate limiting, input validation, audit logging

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials)
- **Payments**: Stripe
- **Storage**: AWS S3 / Cloudflare R2
- **Media**: Sharp (images), FFmpeg (video thumbnails)
- **Validation**: Zod
- **Testing**: Jest + Playwright

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Stripe account
- AWS S3 or Cloudflare R2 bucket

### Installation

```bash
# Clone and install
cd content-site
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` - Admin at `/admin/login`

### Demo Credentials

- Email: `admin@shirlene.com`
- Password: `changeme123!`

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Homepage
│   │   ├── collections/   # Collection pages
│   │   ├── media/         # Media detail
│   │   ├── checkout/      # Stripe checkout
│   │   └── legal/         # Legal pages
│   ├── (admin)/           # Protected admin routes
│   │   ├── layout.tsx     # Admin layout + sidebar
│   │   ├── login/         # Admin login
│   │   └── dashboard/     # Dashboard pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Header, Footer, WhatsAppButton
│   ├── media/             # MediaGrid, MediaDetail
│   └── collections/       # CollectionCard
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── storage.ts         # S3/R2 signed URLs
│   ├── media.ts           # Sharp/FFmpeg processing
│   ├── stripe.ts          # Stripe helpers
│   ├── audit.ts           # Audit logging
│   └── validations/       # Zod schemas
└── styles/
    └── globals.css        # Tailwind + design system
```

## Database Schema

Key models: `AdminUser`, `Customer`, `Collection`, `Media`, `Product`, `Order`, `OrderItem`, `Payment`, `Entitlement`, `SiteSettings`, `AuditLog`

Run `npm run db:studio` to explore.

## Admin Dashboard

Access at `/admin/dashboard`:
- **Overview**: Revenue, orders, media count, recent activity
- **Media**: Upload, edit, publish/unpublish, delete, organize
- **Collections**: CRUD with cover images, sorting
- **Orders**: View all orders with status, customer, payment
- **Settings**: Profile, branding, WhatsApp, Stripe, site config

## Payment Flow

1. User clicks purchase → `/api/checkout` creates Stripe session
2. Redirects to Stripe Checkout
3. On success → Stripe webhook verifies signature
4. Creates `Order`, `Payment`, `Entitlement` records
5. Grants access to premium content
6. Redirects to `/checkout/success`

## Media Access Control

- Free media: Direct signed URLs
- Premium media: Requires valid `Entitlement` record
- Signed URLs expire in 1 hour
- Private S3/R2 bucket - no public access

## Deployment

### Vercel (Frontend) + Railway/Render (Backend)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t shirlene-platform .
docker run -p 3000:3000 --env-file .env.local shirlene-platform
```

### Database Migration

```bash
npm run db:migrate deploy
```

## Environment Variables

See `.env.example` for all required variables.

## Security Checklist

- [ ] Change `NEXTAUTH_SECRET` in production
- [ ] Use strong database password
- [ ] Enable Stripe webhook signatures
- [ ] Configure S3 bucket as private
- [ ] Set up CSP headers (in next.config.js)
- [ ] Enable rate limiting
- [ ] Regular security audits

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

Private - All rights reserved.