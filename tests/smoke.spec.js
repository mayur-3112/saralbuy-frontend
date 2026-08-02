import { test, expect } from '@playwright/test';

test.describe('Website Smoke Tests', () => {
  const setupErrorTracking = page => {
    const errors = [];
    page.on('pageerror', err => {
      if (err.message?.includes('Network Error') || err.message?.includes('Failed to fetch')) return;
      errors.push(err.message);
    });
    return errors;
  };

  test('homepage loads successfully without crashing', async ({ page }) => {
    const errors = setupErrorTracking(page);
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });
  
  test('product overview page loads successfully without crashing', async ({ page }) => {
    const errors = setupErrorTracking(page);
    
    await page.goto('/product-overview');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });

  test('universal search results page loads successfully without crashing', async ({ page }) => {
    const errors = setupErrorTracking(page);
    
    await page.goto('/search-results?q=Steel');
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
    expect(errors.length).toBe(0);
  });
});
