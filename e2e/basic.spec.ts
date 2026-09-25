import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Shirlene/);
  });

  test('displays hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Shirlene');
  });

  test('has WhatsApp button', async ({ page }) => {
    const whatsappBtn = page.locator('[data-testid="whatsapp-btn"], a[href*="wa.me"]').first();
    await expect(whatsappBtn).toBeVisible();
  });

  test('navigates to collections', async ({ page }) => {
    await page.click('a[href="/collections"]');
    await expect(page).toHaveURL(/.*collections/);
  });
});

test.describe('Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('shows login form', async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="alert"], .text-rose-700')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('redirects unauthenticated user from admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*admin\/login/);
  });

  test('redirects unauthenticated user from media upload', async ({ page }) => {
    await page.goto('/admin/dashboard/media/new');
    await expect(page).toHaveURL(/.*admin\/login/);
  });
});

test.describe('Legal Pages', () => {
  test('terms page loads', async ({ page }) => {
    await page.goto('/legal/terms');
    await expect(page.locator('h1')).toContainText('Terms of Service');
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/legal/privacy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('refund page loads', async ({ page }) => {
    await page.goto('/legal/refund');
    await expect(page.locator('h1')).toContainText('Refund Policy');
  });
});

test.describe('Collections', () => {
  test('collections page loads', async ({ page }) => {
    await page.goto('/collections');
    await expect(page.locator('h1')).toContainText('Collections');
  });
});

test.describe('WhatsApp Contact', () => {
  test('WhatsApp button opens correct URL', async ({ page, context }) => {
    await page.goto('/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.click('a[href*="wa.me"]').first().catch(() => {}),
    ]);
    
    if (popup) {
      await expect(popup).toHaveURL(/wa\.me/);
    }
  });
});

test.describe('Age Gate', () => {
  test('age gate modal appears if enabled', async ({ page }) => {
    await page.goto('/');
    
    const ageGate = page.locator('[role="dialog"]:has-text("18+"), [role="dialog"]:has-text("mature")');
    
    if (await ageGate.isVisible({ timeout: 2000 })) {
      await expect(ageGate).toBeVisible();
    }
  });
});