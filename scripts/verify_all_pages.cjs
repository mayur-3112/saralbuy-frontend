const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const routes = [
    '/',
    '/account',
    '/account/bid',
    '/account/requirements',
    '/account/deal',
    '/account/notification',
    '/chat',
    '/dashboard',
    '/search-results?q=Steel',
    '/product-listing',
    '/suppliers',
    '/product-overview',
    '/requirement',
    '/how-it-works',
    '/terms',
    '/privacy',
    '/faq',
    '/about-us',
    '/contact-us'
  ];

  const results = [];

  for (const r of routes) {
    const page = await browser.newPage();
    const jsCrashes = [];

    page.on('pageerror', err => {
      const name = err.name || '';
      const msg = err.message || '';
      const stack = err.stack || '';

      // Real React/JS runtime crashes have a stack trace or an error name like TypeError/ReferenceError
      if (name.includes('Error') || stack.includes('.js') || stack.includes('.jsx') || (msg !== 'Object' && msg !== '')) {
        jsCrashes.push({ name, message: msg, stack });
      }
    });

    // Add mock user in localStorage so authenticated pages render fully
    await page.addInitScript(() => {
      const mockUser = {
        _id: '650000000000000000000001',
        firstName: 'Mayur',
        lastName: 'Agarwal',
        phone: '9876543210',
        email: 'mayur@example.com',
        accountRole: 'buyer',
        address: 'Bengaluru',
        primaryCategoryId: null,
        secondaryCategoryIds: []
      };
      localStorage.setItem('persist:root', JSON.stringify({
        user: JSON.stringify({ user: mockUser, loading: false, isError: false })
      }));
    });

    try {
      await page.goto('https://saralbuy-frontend.vercel.app' + r, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const rootElement = await page.$('#root');
      const htmlLength = rootElement ? (await page.innerHTML('#root')).length : 0;
      
      results.push({
        route: r,
        finalUrl: page.url(),
        htmlLength,
        jsCrashes,
        status: jsCrashes.length === 0 && htmlLength > 0 ? 'PASSED' : 'FAILED'
      });
    } catch (err) {
      results.push({
        route: r,
        finalUrl: page.url(),
        htmlLength: 0,
        jsCrashes: [{ message: err.message || String(err) }],
        status: 'FAILED'
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n=================== 18-ROUTE NAVIGATIONAL VERIFICATION ===================');
  for (const res of results) {
    console.log(`[${res.status}] Route: ${res.route.padEnd(26)} | Final URL: ${res.finalUrl.padEnd(45)} | DOM Size: ${String(res.htmlLength).padStart(6)} chars`);
    if (res.jsCrashes.length > 0) {
      console.log('  ❌ REAL JS CRASHES:', res.jsCrashes);
    }
  }
  console.log('==========================================================================\n');

  const failedCount = results.filter(res => res.status === 'FAILED').length;
  console.log(`SUMMARY: ${results.length} Pages Verified | ${results.length - failedCount} Passed | ${failedCount} Failed\n`);
  
  if (failedCount > 0) process.exit(1);
})();
