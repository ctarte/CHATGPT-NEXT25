const { test, expect } = require('@playwright/test');

const base = process.env.PREVIEW_URL;
if (!base || !/^https:\/\//.test(base)) throw new Error('PREVIEW_URL must be an https URL');
const paths = ['/', '/how-it-works', '/explore', '/blueprint', '/pricing', '/start'];

async function requireActualPreview(page) {
  const title = await page.title();
  const body = (await page.locator('body').innerText()).slice(0, 1200);
  if (/Login – Vercel|Log in to Vercel|Continue with SAML SSO|Vercel Authentication/i.test(title + ' ' + body)) {
    throw new Error('BLOCKED: Vercel Deployment Protection presented a login page; no application content was tested. Configure authorized preview access before claiming any PASS.');
  }
  if (!/Discovered by Design|DISCOVERED BY DESIGN|Think Tank|Discovery/i.test(body + ' ' + title)) {
    throw new Error('UNVERIFIED: expected Discovered by Design application content was not detected.');
  }
}


test.describe('Development preview — read-only visual smoke tests', () => {
  for (const route of paths) {
    test(route + ' loads and renders usable content', async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(new URL(route, base).toString(), { waitUntil: 'domcontentloaded', timeout: 45000 });
      expect(response, 'Expected a page response').toBeTruthy();
      expect(response.status(), 'Unexpected HTTP status').toBeLessThan(400);
      await requireActualPreview(page);
      await expect(page.locator('body')).toBeVisible();
      const text = (await page.locator('body').innerText()).trim();
      expect(text.length, 'Page has almost no readable text').toBeGreaterThan(80);
      await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
      expect(errors, 'Uncaught browser errors').toEqual([]);
    });
  }
  test('pricing and start navigation is accessible', async ({ page }) => {
    await page.goto(new URL('/pricing', base).toString(), { waitUntil: 'domcontentloaded' });
    await requireActualPreview(page);
    await expect(page.locator('body')).toContainText('595');
    await expect(page.locator('body')).toContainText('995');
    const links = page.locator('a[href]');
    expect(await links.count()).toBeGreaterThan(0);
  });
  test('visible disclosures open and close where present', async ({ page }) => {
    await page.goto(new URL('/start', base).toString(), { waitUntil: 'domcontentloaded' });
    await requireActualPreview(page);
    const details = page.locator('details:visible').first();
    if (await details.count()) {
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
      await details.locator('summary').click();
      await expect(details).not.toHaveAttribute('open', '');
    } else {
      test.info().annotations.push({ type: 'not-covered', description: 'No disclosure visible on initial /start state; authenticated/advanced stages NOT VERIFIED' });
    }
  });
});

// Additional read-only journey checks. These never submit forms, authenticate, or modify data.
test.describe('Development preview — public customer journey', () => {
  test('homepage has a usable route toward Discovery', async ({ page }) => {
    await page.goto(new URL('/', base).toString(), { waitUntil: 'domcontentloaded' });
    await requireActualPreview(page);
    const hrefs = await page.locator('a[href]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || ''));
    expect(hrefs.some(h => /(^|\\/)start(?:[/?#]|$)/i.test(h)), 'Homepage needs a direct link toward /start').toBeTruthy();
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('pricing links offer a path toward starting Discovery', async ({ page }) => {
    await page.goto(new URL('/pricing', base).toString(), { waitUntil: 'domcontentloaded' });
    await requireActualPreview(page);
    const hrefs = await page.locator('a[href]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || ''));
    expect(hrefs.some(h => /(^|\\/)start(?:[/?#]|$)/i.test(h)), 'Pricing needs a link toward /start').toBeTruthy();
  });

  for (const route of ['/', '/how-it-works', '/explore', '/blueprint', '/pricing', '/start']) {
    test(route + ' does not clip content horizontally at test viewport', async ({ page }) => {
      await page.goto(new URL(route, base).toString(), { waitUntil: 'domcontentloaded' });
      await requireActualPreview(page);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth
      }));
      expect(dimensions.content, 'Horizontal overflow: ' + JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 3);
    });
  }
});
