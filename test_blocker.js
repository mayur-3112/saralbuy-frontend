const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/post-requirement', {waitUntil: 'networkidle0'});
  console.log('Page loaded');
  await page.type('input[name="title"]', 'Test title');
  console.log('Typed into title');
  
  // Click back button
  await page.click('.lucide-move-left');
  console.log('Clicked back');
  
  await new Promise(r => setTimeout(r, 1000));
  const content = await page.content();
  console.log('Dialog visible:', content.includes('Unsaved Changes'));
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
