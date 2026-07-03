const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  const filePath = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait a moment for GSAP to init
  await new Promise(r => setTimeout(r, 500));

  const times = [2, 4.5, 9, 12.5]; // Hook, Grid, Drawer, Outro
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    await page.evaluate((time) => {
      window.__timelines['main'].seek(time);
    }, t);
    
    await page.screenshot({ path: path.join(__dirname, `shot-${i}.png`) });
    console.log(`Saved shot-${i}.png at t=${t}s`);
  }

  await browser.close();
})();
