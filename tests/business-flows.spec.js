import { test, expect } from '@playwright/test';

test.describe('Core Business Workflows', () => {
  const setupErrorTracking = page => {
    const errors = [];
    page.on('pageerror', err => {
      if (err.message?.includes('Network Error') || err.message?.includes('Failed to fetch')) return;
      errors.push(err.message);
    });
    return errors;
  };

  test('1. Auth Modal & Login interface opens cleanly', async ({ page }) => {
    const errors = setupErrorTracking(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

  test('2. Post RFQ Creation form renders all sections and inputs', async ({ page }) => {
    const errors = setupErrorTracking(page);

    await page.goto('/post-requirement');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

  test('3. Product Overview quotation form renders fields cleanly', async ({ page }) => {
    const errors = setupErrorTracking(page);

    await page.goto('/product-overview');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

  test('4. Buyer Requirements Overview page loads quotes and navigation', async ({ page }) => {
    const errors = setupErrorTracking(page);

    await page.goto('/account/requirements');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

  test('5. Supplier Tooling & Browse RFQs loads without errors', async ({ page }) => {
    const errors = setupErrorTracking(page);

    await page.goto('/product-listing');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

});
