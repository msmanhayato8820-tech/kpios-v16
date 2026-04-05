import { test, expect } from '@playwright/test';

const BASE_URL = 'https://kpios-v16.vercel.app';
const SCREENSHOT_DIR = 'e2e/screenshots';

async function login(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'ceo@anestsystem.jp');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test('各ナビリンクの直接アクセス確認', async ({ page }) => {
  await login(page);

  const pages = [
    { name: 'CEO', url: '/dashboard', selector: 'text=CEO Dashboard' },
    { name: 'CFO', url: '/dashboard/cfo', selector: 'text=CFO' },
    { name: 'Sales', url: '/dashboard/sales', selector: 'text=Sales' },
    { name: 'CS', url: '/dashboard/cs', selector: 'text=CS' },
    { name: 'HR', url: '/dashboard/hr', selector: 'text=HR' },
    { name: 'Ops', url: '/dashboard/ops', selector: 'text=Ops' },
    { name: 'Simulator', url: '/dashboard/simulator', selector: 'text=Simulator' },
  ];

  for (const p of pages) {
    await page.goto(`${BASE_URL}${p.url}`);
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    const urlMatch = currentUrl.includes(p.url.replace('/dashboard/', '/dashboard'));
    const el = page.locator(p.selector).first();
    const visible = await el.isVisible().catch(() => false);
    console.log(`[${p.name}] URL: ${currentUrl} → ${urlMatch ? '✓' : '要確認'} / ページ表示: ${visible ? '✓' : '✗'}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/30-nav-${p.name.toLowerCase()}-page.png`, fullPage: false });
  }
});

test('CEOナビリンクのクリック動作詳細', async ({ page }) => {
  await login(page);

  // CFOリンクをhrefで直接クリック
  const cfoLink = page.locator('a[href="/dashboard/cfo"]');
  const cfoVisible = await cfoLink.isVisible().catch(() => false);
  console.log(`CFOリンク（href="/dashboard/cfo"）表示: ${cfoVisible ? '✓' : '✗'}`);

  if (cfoVisible) {
    await cfoLink.click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    console.log(`CFOクリック後URL: ${url}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/31-cfo-clicked.png`, fullPage: false });
  }

  // ログアウト確認
  await login(page);

  // Simulatorリンク
  const simLink = page.locator('a[href="/dashboard/simulator"]');
  const simVisible = await simLink.isVisible().catch(() => false);
  console.log(`Simulatorリンク表示: ${simVisible ? '✓' : '✗'}`);
  if (simVisible) {
    await simLink.click();
    await page.waitForLoadState('networkidle');
    console.log(`Simulatorクリック後URL: ${page.url()}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/32-simulator-clicked.png`, fullPage: false });
  }
});
