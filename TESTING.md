# Testing Documentation

## Test Strategy

### Unit Tests (Jest)
- **Lib functions**: storage, media, stripe, auth, utils, audit
- **Validations**: Zod schema tests
- **Components**: React component rendering (React Testing Library)

### Integration Tests (Jest + Supertest)
- **API Routes**: All `/api/*` endpoints
- **Database**: Prisma operations with test database
- **Auth flows**: Login, session, logout

### E2E Tests (Playwright)
- **Critical User Journeys**:
  1. Visitor: Homepage → Browse → Media → Checkout → Payment → Access
  2. Admin: Login → Dashboard → Upload → Publish → Verify public
  3. Contact: Homepage → WhatsApp → Conversation
  4. Security: Unauthorized access rejected

## Running Tests

```bash
# Unit & Integration
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage

# E2E
npm run test:e2e

# E2E with UI
npx playwright test --ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Test Database

### Setup
```bash
# Create test database
createdb shirlene_test

# Run migrations
DATABASE_URL="postgresql://.../shirlene_test" npx prisma migrate deploy
```

### Configuration (jest.config.ts)
```typescript
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Test Helpers

### Database Seeding (tests/helpers/db.ts)
```typescript
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function createTestAdmin() {
  return prisma.adminUser.create({
    data: {
      email: 'test@admin.com',
      passwordHash: await bcrypt.hash('testpass123', 12),
      name: 'Test Admin',
    },
  });
}

export async function createTestMedia(overrides = {}) {
  return prisma.media.create({
    data: {
      title: 'Test Media',
      type: 'IMAGE',
      fileUrl: 'test/key.jpg',
      fileSize: 1000,
      mimeType: 'image/jpeg',
      isPublished: true,
      ...overrides,
    },
  });
}

export async function cleanupTestData() {
  await prisma.media.deleteMany({ where: { title: { startsWith: 'Test' } } });
  await prisma.adminUser.deleteMany({ where: { email: { startsWith: 'test' } } });
}
```

## Critical User Journey Tests

### 1. Visitor Purchase Flow
```typescript
// e2e/visitor-purchase.spec.ts
test('visitor can purchase premium media', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Collections');
  await page.click('[data-testid="media-card"]:first-child');
  
  // Should show blurred preview with purchase button
  await expect(page.locator('[data-testid="purchase-btn"]')).toBeVisible();
  
  await page.click('[data-testid="purchase-btn"]');
  await page.waitForURL('**/checkout/**');
  
  // Fill Stripe test card
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button:has-text("Pay")');
  
  // Handle Stripe test mode
  await page.waitForURL('**/checkout/success**');
  
  // Should now have access
  await page.goto('/media/[id]');
  await expect(page.locator('video, img')).toBeVisible();
});
```

### 2. Admin Media Upload
```typescript
// e2e/admin-upload.spec.ts
test('admin can upload and publish media', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('[name="email"]', 'admin@shirlene.com');
  await page.fill('[name="password"]', 'changeme123!');
  await page.click('button:has-text("Sign In")');
  
  await page.goto('/admin/dashboard/media/new');
  await page.fill('[name="title"]', 'E2E Test Media');
  await page.setInputFiles('[type="file"]', 'test/fixtures/test-image.jpg');
  await page.click('button:has-text("Upload Media")');
  
  await page.waitForURL('/admin/dashboard/media/**');
  await expect(page.locator('text=E2E Test Media')).toBeVisible();
  
  // Publish
  await page.click('[data-testid="publish-btn"]');
  await page.reload();
  await expect(page.locator('[data-testid="status"]')).toHaveText('Published');
});
```

### 3. WhatsApp Contact
```typescript
// e2e/whatsapp.spec.ts
test('WhatsApp button opens correct URL', async ({ page, context }) => {
  await page.goto('/');
  
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click('[data-testid="whatsapp-btn"]'),
  ]);
  
  await expect(popup).toHaveURL(/wa\.me/);
  await expect(popup).toHaveURL(/text=/);
});
```

### 4. Security - Unauthorized Access
```typescript
// e2e/security.spec.ts
test('unauthenticated user cannot access admin', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL('/admin/login');
});

test('unauthorized user cannot access premium media', async ({ page }) => {
  const media = await createTestMedia({ isPremium: true, isPublished: true });
  
  await page.goto(`/media/${media.id}`);
  
  // Should show blurred preview
  await expect(page.locator('[data-testid="blur-preview"]')).toBeVisible();
  await expect(page.locator('video, img')).not.toBeVisible();
});
```

## Test Fixtures

### Media Files
```
test/fixtures/
├── test-image.jpg      # 100KB JPEG
├── test-image.png      # 100KB PNG
├── test-video.mp4      # 500KB MP4
└── test-video.webm     # 500KB WebM
```

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## CI/CD Integration

### GitHub Actions (`.github/workflows/ci.yml`)
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: shirlene_test
          POSTGRES_PASSWORD: postgres
        ports: [5432:5432]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
        env: { DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shirlene_test }
      - run: npm test
      - run: npm run typecheck
      - run: npm run lint
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Test Coverage Targets

| Category | Target |
|----------|--------|
| Statements | > 80% |
| Branches | > 70% |
| Functions | > 80% |
| Lines | > 80% |

## Debugging Tests

### Jest
```bash
# Debug specific test
npm test -- --testNamePattern="should hash password"

# Debug with VS Code
# Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--testNamePattern", "${selectedText}"],
  "console": "integratedTerminal"
}
```

### Playwright
```bash
# Debug mode
npx playwright test --debug

# Trace viewer
npx playwright show-trace trace.zip

#headed mode
npx playwright test --headed
```

## Performance Testing

### Load Testing (k6)
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://yourdomain.com/');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Accessibility Testing

```bash
# axe-core integration
npm install -D @axe-core/playwright

# In test:
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## Visual Regression (Optional)

```bash
npm install -D @playwright/test @pixelmatch/core

# Compare screenshots
test('homepage matches baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```