import { test, expect } from '@playwright/test';

test.describe('Website Smoke Tests', () => {
  test('homepage loads successfully without crashing', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.goto('/');
    
    // Wait a moment for dynamic content to render
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify there are no unhandled JavaScript exceptions in the console
    if (errors.length > 0) {
      console.error('Page errors encountered:', errors);
    }
    expect(errors.length).toBe(0);
  });
  
  test('product overview page loads successfully without crashing', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    // Attempting to visit the generic requirements URL that we know exists
    await page.goto('/product');
    
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    if (errors.length > 0) {
      console.error('Page errors encountered on product overview:', errors);
    }
    expect(errors.length).toBe(0);
  });
});
