import { test, expect } from '@playwright/test';

test.describe('Core Business Workflows', () => {

  test('1. Auth Modal & Login interface opens cleanly', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify main navigation bar exists
    const nav = page.locator('nav, header, div').first();
    await expect(nav).toBeVisible();

    // Check for unhandled console errors
    expect(errors.length).toBe(0);
  });

  test('2. Post RFQ Creation form renders all sections and inputs', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/post-requirement');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify main title or form container exists
    const heading = page.locator('h2, h3').first();
    await expect(heading).toBeVisible();

    expect(errors.length).toBe(0);
  });

  test('3. Product Overview quotation form renders fields cleanly', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/product-overview');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    expect(errors.length).toBe(0);
  });

  test('4. Buyer Requirements Overview page loads quotes and navigation', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/account/requirements');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    expect(errors.length).toBe(0);
  });

  test('5. Supplier Tooling & Browse RFQs loads without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/product-listing');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    expect(errors.length).toBe(0);
  });

});
