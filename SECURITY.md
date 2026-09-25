# Security Documentation

## Overview

This document outlines the security measures implemented in the Shirlene Creator Platform.

## Authentication & Authorization

### Admin Authentication
- **Provider**: NextAuth.js v5 with Credentials
- **Password Hashing**: bcrypt with cost factor 12
- **Session**: JWT with 24-hour expiry, secure cookies
- **Rate Limiting**: 10 requests/minute on auth endpoints
- **Brute Force Protection**: Account lockout after 5 failed attempts (15 min)
- **CSRF Protection**: Built into NextAuth

### Authorization
- **Middleware**: Protects all `/admin/*` routes
- **Role-Based**: Admin/Editor roles (extensible)
- **Ownership Checks**: All admin APIs verify resource ownership
- **Entitlement Verification**: Premium content access checked server-side

## Data Protection

### Encryption
- **In Transit**: TLS 1.2+ (enforced by Vercel/hosting)
- **At Rest**: Database encryption (provider-dependent)
- **Secrets**: Environment variables only, never in code
- **Payment Data**: Never stored - handled by Stripe

### File Upload Security
- **Validation**: MIME type allowlist (images + videos only)
- **Size Limit**: 50MB maximum
- **Magic Bytes**: Server-side verification (planned)
- **Malware Scanning**: Placeholder for ClamAV integration
- **Storage**: Private bucket, signed URLs only
- **Processing**: Sharp/FFmpeg in isolated environment

### Database Security
- **ORM**: Prisma with parameterized queries (SQL injection prevention)
- **Constraints**: Foreign keys, unique indexes, check constraints
- **Soft Deletes**: Not implemented (hard deletes with audit trail)
- **PII**: Minimal - email, name only

## API Security

### Rate Limiting
- **Auth endpoints**: 10 req/min
- **API endpoints**: 100 req/min
- **Media upload**: 5 req/min
- **Implementation**: In-memory (use Upstash Redis for production)

### Input Validation
- **All inputs**: Zod schemas
- **File uploads**: Type + size validation
- **API bodies**: Strict schema validation
- **Query params**: Validated in each route

### Headers (next.config.js)
```javascript
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

## Payment Security

### Stripe Integration
- **Client**: Only publishable key exposed
- **Server**: Secret key + webhook secret only
- **Flow**: Server-side session creation → Stripe Checkout → Webhook verification
- **Idempotency**: Stripe session IDs prevent duplicate orders
- **Webhook**: Signature verification with `stripe.webhooks.constructEvent`

### PCI Compliance
- **SAQ A**: Eligible (Stripe handles card data)
- **No card data**: Ever touches our servers
- **Webhook verification**: Mandatory before granting access

## Content Security

### Media Access Control
- **Free content**: Signed URLs (1hr expiry)
- **Premium content**: Requires valid Entitlement record
- **URL Structure**: No predictable paths (`/api/media/[id]/serve`)
- **Watermarking**: Not implemented (planned)

### Age Verification
- **Age Gate**: Configurable modal on entry
- **Cookie**: Remembers consent for session
- **Legal**: 18+ requirement in Terms

## Audit & Monitoring

### Audit Logging
All admin actions logged:
- Authentication events
- Media CRUD operations
- Collection management
- Order/payment events
- Settings changes
- Customer data access

### Log Structure
```typescript
{
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  metadata: Json,
  ipAddress: string,
  createdAt: DateTime
}
```

## Vulnerability Prevention

### OWASP Top 10 Mitigations

| Risk | Mitigation |
|------|------------|
| A01: Broken Access Control | Middleware + ownership checks + entitlement verification |
| A02: Cryptographic Failures | bcrypt(12), TLS, env vars for secrets |
| A03: Injection | Prisma parameterized queries, Zod validation |
| A04: Insecure Design | Secure defaults, defense in depth |
| A05: Security Misconfiguration | Secure headers, private buckets, minimal permissions |
| A06: Vulnerable Components | `npm audit`, Dependabot, regular updates |
| A07: Auth Failures | Rate limiting, lockout, secure sessions |
| A08: Software Integrity | Signed dependencies, CI/CD verification |
| A09: Logging Failures | Comprehensive audit logs, error tracking |
| A10: SSRF | No user-controlled URLs, validated external requests |

### Additional Protections
- **XSS**: React auto-escaping, no dangerouslySetInnerHTML
- **CSRF**: NextAuth built-in, SameSite=Lax cookies
- **Clickjacking**: X-Frame-Options: DENY
- **MIME Sniffing**: X-Content-Type-Options: nosniff

## Incident Response

### Breach Detection
- Audit log monitoring
- Failed login alerts
- Unusual payment patterns
- File upload anomalies

### Response Plan
1. **Contain**: Revoke sessions, rotate secrets
2. **Assess**: Determine scope via audit logs
3. **Notify**: Users, authorities (if required)
4. **Remediate**: Patch vulnerability, restore data
5. **Review**: Post-incident analysis

## Compliance

### GDPR/CCPA Ready
- Data export endpoint (planned)
- Deletion endpoint (planned)
- Consent tracking (age gate)
- Privacy Policy page

### 2257 Compliance (if applicable)
- Record keeping structure in place
- Age verification on upload (planned)
- Model release tracking (planned)

### DMCA
- Contact in footer
- Takedown process documented

## Security Testing

### Automated
- `npm audit` in CI
- Dependabot alerts
- SAST in GitHub Actions (planned)

### Manual
- Penetration testing (annual)
- Code review for auth/payment changes
- Webhook signature verification tests

### Checklist for Releases
- [ ] No secrets in code
- [ ] Auth tests pass
- [ ] Payment flow tested
- [ ] File upload validated
- [ ] Rate limiting functional
- [ ] Audit logs generated
- [ ] CSP headers present
- [ ] Dependencies updated

## Contact

Security issues: security@shirlene.com (configure in settings)