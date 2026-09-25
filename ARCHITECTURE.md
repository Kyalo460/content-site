# Shirlene Creator Platform - Architecture Plan

## Tech Stack Decision

**Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
**Backend**: Next.js API Routes + Prisma ORM
**Database**: PostgreSQL (via Prisma)
**Auth**: NextAuth.js v5 with credentials + email provider
**Payments**: Stripe (supports global, compliant, webhook-based)
**Storage**: AWS S3 / Cloudflare R2 (signed URLs, private buckets)
**Media Processing**: Sharp (images), FFmpeg (video thumbnails)
**Deployment**: Vercel (frontend) + Railway/Render (backend workers) or all-in-one on Railway
**Monitoring**: Sentry + Vercel Analytics

## Database Schema (Prisma)

```prisma
// Core models
model AdminUser {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          Role      @default(ADMIN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  loginAttempts Int       @default(0)
  lockedUntil   DateTime?
  sessions      Session[]
}

model Session {
  id           String     @id @default(cuid())
  userId       String
  user         AdminUser  @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String     @unique
  expiresAt    DateTime
  createdAt    DateTime   @default(now())
  ipAddress    String?
  userAgent    String?
}

model Customer {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  stripeCustomerId String? @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
  entitlements  Entitlement[]
}

model Collection {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  coverImage  String?
  sortOrder   Int      @default(0)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  media       Media[]
}

model Media {
  id              String       @id @default(cuid())
  collectionId    String?
  collection      Collection?  @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  title           String
  description     String?
  type            MediaType
  fileUrl         String       // S3/R2 object key
  fileSize        Int
  mimeType        String
  width           Int?
  height          Int?
  duration        Float?       // for videos
  thumbnailUrl    String?      // generated thumbnail
  previewUrl      String?      // blurred/low-res preview
  isPublished     Boolean      @default(false)
  isPremium       Boolean      @default(false)
  priceCents      Int          @default(0)
  sortOrder       Int          @default(0)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  products        Product[]
  entitlements    Entitlement[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  type        ProductType
  priceCents  Int
  currency    String   @default("USD")
  isActive    Boolean  @default(true)
  media       Media[]  @relation("ProductMedia")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      OrderItem[]
}

model Order {
  id              String       @id @default(cuid())
  customerId      String
  customer        Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  stripeSessionId String?      @unique
  stripePaymentIntentId String?
  status          OrderStatus  @default(PENDING)
  subtotalCents   Int
  taxCents        Int          @default(0)
  totalCents      Int
  currency        String       @default("USD")
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  items           OrderItem[]
  payment         Payment?
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  quantity  Int     @default(1)
  priceCents Int
}

model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  stripePaymentId String        @unique
  amountCents     Int
  currency        String
  status          PaymentStatus
  rawWebhook      Json?
  createdAt       DateTime      @default(now())
}

model Entitlement {
  id          String   @id @default(cuid())
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  mediaId     String
  media       Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  grantedAt   DateTime @default(now())
  expiresAt   DateTime?
  @@unique([customerId, mediaId])
}

model SiteSettings {
  id                String   @id @default("singleton")
  siteName          String   @default("Shirlene")
  siteDescription   String?
  heroTitle         String
  heroSubtitle      String?
  heroImage         String?
  whatsappNumber    String?
  whatsappMessage   String?
  contactEmail      String?
  termsUrl          String?
  privacyUrl        String?
  refundUrl         String?
  ageGateEnabled    Boolean  @default(true)
  ageGateMessage    String?
  stripePublishableKey String?
  stripeSecretKey   String?  // encrypted
  stripeWebhookSecret String? // encrypted
  storageProvider   String   @default("s3")
  storageBucket     String?
  storageRegion     String?
  storageAccessKey  String?  // encrypted
  storageSecretKey  String?  // encrypted
  updatedAt         DateTime @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  metadata  Json?
  ipAddress String?
  createdAt DateTime @default(now())
  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
}

enum Role { ADMIN EDITOR }
enum MediaType { IMAGE VIDEO }
enum ProductType { SINGLE_ACCESS SUBSCRIPTION BUNDLE }
enum OrderStatus { PENDING COMPLETED FAILED REFUNDED CANCELLED }
enum PaymentStatus { SUCCEEDED FAILED REFUNDED }
```

## Project Structure

```
content-site/
├── .github/workflows/          # CI/CD
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── images/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── collections/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   ├── media/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── [productId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── success/
│   │   │   │       └── page.tsx
│   │   │   ├── legal/
│   │   │   │   ├── terms/
│   │   │   │   ├── privacy/
│   │   │   │   └── refund/
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       ├── media/
│   │   │       ├── checkout/
│   │   │       ├── webhooks/
│   │   │       └── signed-url/
│   │   ├── (admin)/            # Admin routes (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── media/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── collections/
│   │   │   │   ├── orders/
│   │   │   │   ├── customers/
│   │   │   │   └── settings/
│   │   │   └── api/
│   │   │       ├── media/
│   │   │       ├── collections/
│   │   │       ├── orders/
│   │   │       └── settings/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── media/[id]/serve/
│   │   │   ├── webhooks/stripe/
│   │   │   └── signed-url/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/
│   │   ├── media/
│   │   ├── collections/
│   │   ├── checkout/
│   │   ├── admin/
│   │   └── forms/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── stripe.ts
│   │   ├── storage.ts
│   │   ├── media.ts
│   │   ├── utils.ts
│   │   └── validations/
│   ├── hooks/
│   ├── types/
│   └── styles/
├── scripts/
│   ├── setup-admin.ts
│   └── migrate-media.ts
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── DEPLOYMENT.md
├── SECURITY.md
└── TESTING.md
```

## Agent Task Breakdown

### Phase 1: Foundation (Week 1)
1. **Database Agent**: Prisma schema, migrations, seed script
2. **Backend Agent**: Auth setup (NextAuth), API route structure, middleware
3. **DevOps Agent**: Environment config, Docker, CI/CD pipeline
4. **Security Agent**: Security headers, rate limiting, input validation

### Phase 2: Core Features (Week 2)
5. **Media/Storage Agent**: Upload, processing, signed URLs, thumbnails
6. **Frontend Agent**: Public pages (home, collections, media detail)
7. **UI/UX Agent**: Design system, animations, responsive layouts
8. **Payments Agent**: Stripe integration, checkout flow, webhooks

### Phase 3: Admin Dashboard (Week 3)
9. **Admin Agent**: Dashboard UI, media management, collections, settings
10. **Backend Agent**: Admin APIs, RBAC, audit logging

### Phase 4: Integration & Polish (Week 4)
11. **QA Agent**: E2E testing, cross-browser, mobile testing
12. **Security Agent**: Penetration testing, vulnerability scan
13. **DevOps Agent**: Production deployment, monitoring
14. **Lead Agent**: Final integration, documentation, handoff

## Critical Implementation Notes

### Feminine/Erotic Design Language (Tasteful)
- Color palette: Deep rose, warm gold, cream, charcoal
- Typography: Serif headlines (Playfair Display), sans body (Inter)
- Subtle animations: Framer Motion page transitions, hover reveals
- Imagery: Soft focus, artistic composition, suggestive not explicit
- Whitespace: Generous, breathing room

### Security Requirements
- All admin routes protected by middleware
- Signed URLs for premium media (expire in 1 hour)
- Stripe webhook signature verification
- Password hashing: bcrypt (cost 12)
- CSRF tokens on forms
- Rate limiting: 10 req/min auth, 100 req/min API
- File upload validation: MIME, size (50MB max), malware scan
- Content Security Policy headers

### Legal Compliance
- Age gate modal on entry (configurable)
- Terms/Privacy/Refund pages (CMS-editable)
- GDPR/CCPA ready (data export, deletion)
- DMCA contact in footer
- 2257 compliance placeholder (if applicable)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://shirlene.com"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Storage (AWS S3 or Cloudflare R2)
STORAGE_PROVIDER="s3"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="shirlene-media"

# Email (for password reset)
SMTP_HOST="..."
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASSWORD="..."
EMAIL_FROM="noreply@shirlene.com"

# App
NEXT_PUBLIC_APP_URL="https://shirlene.com"
```

## Deliverables Checklist

- [ ] Complete working source code
- [ ] Database schema and migrations
- [ ] Environment variable example
- [ ] Setup instructions
- [ ] Development commands
- [ ] Production deployment instructions
- [ ] Payment provider configuration
- [ ] Storage configuration
- [ ] Admin credentials setup
- [ ] Testing instructions
- [ ] Security checklist
- [ ] Implemented features list
- [ ] Intentionally omitted features list