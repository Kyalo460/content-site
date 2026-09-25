# Deployment Guide

## Production Deployment Checklist

### 1. Database (PostgreSQL)

**Options:**
- **Railway**: `railway add postgresql`
- **Render**: Managed PostgreSQL
- **Neon**: Serverless PostgreSQL
- **Supabase**: PostgreSQL with auth
- **AWS RDS**: Production-grade

**Setup:**
```bash
# Run migrations
npx prisma migrate deploy

# Verify connection
npx prisma db pull
```

### 2. Storage (AWS S3 or Cloudflare R2)

#### AWS S3
1. Create bucket: `shirlene-media-prod`
2. Block all public access
3. Create IAM user with `PutObject`, `GetObject`, `DeleteObject` permissions
4. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

#### Cloudflare R2
1. Create bucket in R2 dashboard
2. Create API token with Object Read/Write permissions
3. Use S3-compatible endpoint: `https://<account-id>.r2.cloudflarestorage.com`

### 3. Stripe Configuration

1. Create Stripe account
2. Get API keys from Dashboard → Developers → API keys
3. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
3. Copy webhook signing secret

### 4. Email Service

**Options:**
- **Resend**: `npm install resend`
- **SendGrid**: `@sendgrid/mail`
- **Postmark**: `postmark`
- **Nodemailer** with SMTP

### 5. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables in Vercel:**
- All from `.env.example`
- `NEXTAUTH_URL` = `https://yourdomain.com`
- `NEXT_PUBLIC_APP_URL` = `https://yourdomain.com`

### 6. Custom Domain

1. Add domain in Vercel dashboard
2. Configure DNS:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
3. Enable HTTPS (automatic)

### 7. Database Migration in Production

```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

Or use GitHub Actions (see `.github/workflows/deploy.yml`)

### 8. Post-Deployment Verification

- [ ] Homepage loads
- [ ] Admin login works
- [ ] Media upload works
- [ ] Stripe checkout completes
- [ ] Webhook receives events
- [ ] Signed URLs generate
- [ ] WhatsApp button opens correctly
- [ ] Age gate appears
- [ ] Legal pages accessible
- [ ] Email sending works

## Monitoring

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
# Add to next.config.js
```

### Vercel Analytics
Enable in Vercel dashboard → Analytics

### Uptime Monitoring
- **Better Uptime**
- **Pingdom**
- **UptimeRobot**

## Backup Strategy

### Database
- Daily automated backups (provider-dependent)
- Point-in-time recovery (RDS, Neon)
- Manual: `pg_dump -h host -U user db > backup.sql`

### Media Files
- S3 versioning enabled
- Cross-region replication (optional)
- Regular sync to backup bucket

## Scaling Considerations

### Database
- Connection pooling: PgBouncer
- Read replicas for heavy read workloads
- Index optimization

### Media Delivery
- CloudFront CDN in front of S3
- Cloudflare Images for transformations
- Signed URL caching

### API
- Edge functions for auth checks
- Rate limiting: Upstash Redis
- Caching: SWR/React Query

## CI/CD Pipeline

See `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`

### GitHub Actions Steps:
1. Install dependencies
2. Lint & Typecheck
3. Run tests
4. Build
5. Deploy to Vercel
6. Run migrations
7. Smoke tests

## Rollback Procedure

```bash
# Vercel rollback
vercel rollback [deployment-url]

# Database rollback
npx prisma migrate resolve --rolled-back "migration_name"
# Or restore from backup
```

## Security Hardening

### Headers (in next.config.js)
- CSP
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
```

### WAF
- Cloudflare WAF rules
- Vercel Edge Middleware

## Cost Optimization

### Database
- Right-size instance
- Connection pooling

### Storage
- S3 Intelligent Tiering
- Cloudflare R2 (no egress fees)

### CDN
- Cloudflare free tier
- Vercel Edge Network

### Compute
- Vercel Pro for team features
- Edge Functions for light workloads