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

test('テーマ切替ボタンの正確な操作（aria-label使用）', async ({ page }) => {
  await login(page);

  // 初期テーマ確認
  const initialTheme = await page.evaluate(() => {
    const html = document.documentElement;
    return {
      dataTheme: html.getAttribute('data-theme'),
      bgPrimary: getComputedStyle(html).getPropertyValue('--bg-primary').trim(),
    };
  });
  console.log('初期テーマ:', JSON.stringify(initialTheme));

  await page.screenshot({ path: `${SCREENSHOT_DIR}/21-theme-dark-initial.png`, fullPage: false });

  // aria-label="テーマ切替" のボタンを使う
  const themeBtn = page.locator('button[aria-label="テーマ切替"]');
  await expect(themeBtn).toBeVisible({ timeout: 5000 });
  console.log('テーマ切替ボタン: aria-label="テーマ切替" で発見 ✓');

  await themeBtn.click();
  await page.waitForTimeout(800);

  const afterTheme = await page.evaluate(() => {
    const html = document.documentElement;
    return {
      dataTheme: html.getAttribute('data-theme'),
      bgPrimary: getComputedStyle(html).getPropertyValue('--bg-primary').trim(),
      cardBg: getComputedStyle(html).getPropertyValue('--card-bg').trim(),
    };
  });
  console.log('テーマ切替後:', JSON.stringify(afterTheme));

  const themeChanged = initialTheme.dataTheme !== afterTheme.dataTheme ||
                       initialTheme.bgPrimary !== afterTheme.bgPrimary;
  console.log(`テーマ変更: ${themeChanged ? '✓ 変更された' : '✗ 変更されなかった'}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/22-theme-after-toggle.png`, fullPage: false });

  // 戻す
  await themeBtn.click();
  await page.waitForTimeout(800);
  const revertTheme = await page.evaluate(() => ({
    dataTheme: document.documentElement.getAttribute('data-theme'),
    bgPrimary: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim(),
  }));
  console.log('元に戻した後:', JSON.stringify(revertTheme));
  const reverted = revertTheme.dataTheme === initialTheme.dataTheme;
  console.log(`テーマ復元: ${reverted ? '✓' : '✗'}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/23-theme-reverted.png`, fullPage: false });
});

test('ナビリンクの実際の構造調査', async ({ page }) => {
  await login(page);

  // ナビゲーション全体のHTML構造を確認
  const navHTML = await page.evaluate(() => {
    const nav = document.querySelector('nav, header');
    return nav ? nav.outerHTML.substring(0, 3000) : 'nav not found';
  });
  console.log('ナビゲーションHTML（最初の1000文字）:\n' + navHTML.substring(0, 1000));

  // リンク（a要素）を全確認
  const links = await page.locator('a').all();
  console.log(`\n全リンク数: ${links.length}`);
  for (let i = 0; i < links.length; i++) {
    const text = await links[i].textContent();
    const href = await links[i].getAttribute('href');
    const visible = await links[i].isVisible();
    if (visible && text?.trim()) {
      console.log(`リンク[${i}]: text="${text?.trim()}", href="${href}"`);
    }
  }

  // ナビバーボタン確認
  const navButtons = await page.locator('nav button, header button').all();
  console.log(`\nナビボタン数: ${navButtons.length}`);
  for (let i = 0; i < navButtons.length; i++) {
    const text = await navButtons[i].textContent();
    const visible = await navButtons[i].isVisible();
    if (visible) {
      console.log(`ナビボタン[${i}]: text="${text?.trim().substring(0, 50)}"`);
    }
  }

  await page.screenshot({ path: `${SCREENSHOT_DIR}/26-nav-structure.png`, fullPage: false });
});

test('ライトモードでの全体表示確認', async ({ page }) => {
  await login(page);

  // テーマをライトに切替
  const themeBtn = page.locator('button[aria-label="テーマ切替"]');
  await themeBtn.click();
  await page.waitForTimeout(800);

  // テーマ確認
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`テーマ切替後: ${theme}`);

  // ライトモードでの全セクション確認
  const sections = [
    'CEO Dashboard',
    'ARR成長率',
    '主要KPI',
    'ARR推移',
    'P0',
    '重要意思決定',
  ];
  for (const section of sections) {
    const el = page.locator(`text=${section}`).first();
    const visible = await el.isVisible().catch(() => false);
    console.log(`[${section}] ライトモード: ${visible ? '✓' : '✗'}`);
  }

  await page.screenshot({ path: `${SCREENSHOT_DIR}/27-light-mode-full.png`, fullPage: true });
  await page.screenshot({ path: `${SCREENSHOT_DIR}/28-light-mode-top.png`, fullPage: false });

  // スクロールして下部も確認
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/29-light-mode-bottom.png`, fullPage: false });
});
