# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.js >> Website Smoke Tests >> product overview page loads successfully without crashing
- Location: tests\smoke.spec.js:23:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic:
  - generic:
    - region "Notifications alt+T"
    - generic:
      - generic:
        - generic:
          - navigation:
            - generic:
              - generic:
                - button:
                  - img
              - link:
                - /url: /
                - img
              - generic:
                - img
                - textbox:
                  - /placeholder: Location...
            - generic:
              - combobox
              - textbox:
                - /placeholder: Looking For...
              - img
            - generic:
              - generic:
                - generic:
                  - img
              - button:
                - text: Post Requirements
                - generic: →
              - button:
                - img
                - text: My Account
    - generic:
      - heading [level=1]: 404 Not Found
      - paragraph: The page you are looking for does not exist or has been moved.
      - link:
        - /url: "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        - text: Back to Home
        - img
    - contentinfo:
      - generic:
        - generic:
          - link:
            - /url: /
            - img
          - paragraph: SaralBuy is Karnataka's leading B2B bulk procurement platform. We connect verified buyers and industrial suppliers directly, bringing transparent reverse-bidding and direct trade to bulk procurement.
        - generic:
          - heading [level=4]: Category
          - list:
            - listitem: Building Materials
            - listitem: Electrical & Lighting
            - listitem: Plumbing & Sanitation
            - listitem: Steel & Structural
            - listitem: Finishing & Tiles
        - generic:
          - heading [level=4]: Support
          - list:
            - listitem: Help & Support
            - listitem:
              - link:
                - /url: /terms
                - text: Terms & Conditions
            - listitem:
              - link:
                - /url: /privacy
                - text: Privacy Policy
            - listitem: Help
        - generic:
          - heading [level=4]: Contact
          - list:
            - listitem:
              - img
              - text: Peenya Industrial Area, Bengaluru, Karnataka, India
            - listitem:
              - img
              - text: support@SaralBuy.com
            - listitem:
              - img
              - text: +91 98765 43210
      - generic:
        - generic:
          - img
          - img
          - img
          - img
          - img
        - paragraph: Copyright@SaralBuy2025
  - dialog:
    - generic:
      - generic:
        - img
      - heading [level=2]: Accept Platform Terms & Policies
      - paragraph: Welcome to SaralBuy! By continuing to use this B2B exchange, you acknowledge and agree that SaralBuy is solely a reverse-bidding procurement platform.
      - generic:
        - heading [level=4]: ⚠️ Zero Platform Liability Policy
        - paragraph: We hold no responsibility or liability for defaults on payment, delivery delays, quality disputes, or if a buyer rejects material upon delivery. All contracts are directly between the buyer and the supplier.
      - generic:
        - text: Read the full
        - link:
          - /url: /terms
          - text: Terms of Service
        - text: and
        - link:
          - /url: /privacy
          - text: Privacy Policy
        - text: .
      - button:
        - img
        - text: I Accept and Agree
    - button:
      - img
      - generic: Close
  - dialog "Post & Compare Quotes" [ref=e3]:
    - generic [ref=e4]:
      - img "Logo" [ref=e7]
      - generic [ref=e8]:
        - button "I am a Buyer" [active] [ref=e9]
        - button "I am a Supplier" [ref=e10]
      - generic [ref=e11]:
        - heading "Post & Compare Quotes" [level=2] [ref=e12]
        - heading "Sign in to post requirements and compare competitive quotes instantly." [level=2] [ref=e13]
      - generic [ref=e14]:
        - textbox "Enter your Mobile Number" [ref=e15]
        - generic [ref=e16]:
          - checkbox "I accept the Terms & Privacy Policy. I acknowledge SaralBuy does not guarantee supplier fulfillment or material quality." [ref=e17]
          - generic [ref=e18]:
            - text: I accept the
            - link "Terms" [ref=e19] [cursor=pointer]:
              - /url: /terms
            - text: "&"
            - link "Privacy Policy" [ref=e20] [cursor=pointer]:
              - /url: /privacy
            - text: . I acknowledge SaralBuy does not guarantee supplier fulfillment or material quality.
        - generic [ref=e21]:
          - button "Send OTP" [disabled]
          - generic [ref=e22]:
            - img [ref=e23]
            - text: End-to-End Encrypted Messaging
    - button "Close" [ref=e26]:
      - img
      - generic [ref=e27]: Close
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Website Smoke Tests', () => {
  4  |   test('homepage loads successfully without crashing', async ({ page }) => {
  5  |     const errors = [];
  6  |     page.on('pageerror', err => errors.push(err.message));
  7  |     
  8  |     await page.goto('/');
  9  |     
  10 |     // Wait a moment for dynamic content to render
  11 |     await page.waitForLoadState('networkidle');
  12 | 
  13 |     const body = page.locator('body');
  14 |     await expect(body).toBeVisible();
  15 | 
  16 |     // Verify there are no unhandled JavaScript exceptions in the console
  17 |     if (errors.length > 0) {
  18 |       console.error('Page errors encountered:', errors);
  19 |     }
  20 |     expect(errors.length).toBe(0);
  21 |   });
  22 |   
  23 |   test('product overview page loads successfully without crashing', async ({ page }) => {
  24 |     const errors = [];
  25 |     page.on('pageerror', err => errors.push(err.message));
  26 |     
  27 |     // Attempting to visit the generic requirements URL that we know exists
  28 |     await page.goto('/product');
  29 |     
  30 |     await page.waitForLoadState('domcontentloaded');
  31 | 
  32 |     const body = page.locator('body');
  33 |     await expect(body).toBeVisible();
  34 | 
  35 |     if (errors.length > 0) {
  36 |       console.error('Page errors encountered on product overview:', errors);
  37 |     }
> 38 |     expect(errors.length).toBe(0);
     |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  39 |   });
  40 | });
  41 | 
```