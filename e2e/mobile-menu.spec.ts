import { test, expect } from '@playwright/test';

const BASE_URL = 'https://kpios-v16.vercel.app';
const SCREENSHOT_DIR = 'e2e/screenshots';

test('モバイルハンバーガーメニューの詳細確認', async ({ page }) => {
  // モバイルビューポート
  await page.setViewportSize({ width: 390, height: 844 });

  // ログイン
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'ceo@anestsystem.jp');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: `${SCREENSHOT_DIR}/36-mobile-initial.png`, fullPage: false });

  // デスクトップナビ（md:flex）がモバイルで非表示か確認
  const desktopNav = page.locator('nav.hidden.md\\:flex');
  const desktopNavVisible = await desktopNav.isVisible().catch(() => false);
  console.log(`デスクトップナビ（モバイルで非表示）: ${desktopNavVisible ? '✗ 表示されている' : '✓ 正しく非表示'}`);

  // ハンバーガーボタンが表示されているか（aria-label="メニュー"）
  const hamburger = page.locator('button[aria-label="メニュー"]');
  const hamburgerVisible = await hamburger.isVisible().catch(() => false);
  console.log(`ハンバーガーボタン: ${hamburgerVisible ? '✓ 表示' : '✗ 非表示'}`);

  // ハンバーガークリック前のモバイルメニュー状態
  const mobileMenuBefore = page.locator('.md\\:hidden.border-t');
  const mobileMenuBeforeVisible = await mobileMenuBefore.isVisible().catch(() => false);
  console.log(`モバイルメニュー（クリック前）: ${mobileMenuBeforeVisible ? '開いている' : '閉じている'}`);

  // ハンバーガーをクリック
  if (hamburgerVisible) {
    await hamburger.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/37-mobile-menu-open.png`, fullPage: false });

    // モバイルメニューが開いたか確認
    const mobileMenuAfter = page.locator('.md\\:hidden.border-t');
    const mobileMenuAfterVisible = await mobileMenuAfter.isVisible().catch(() => false);
    console.log(`モバイルメニュー（クリック後）: ${mobileMenuAfterVisible ? '✓ 開いた' : '✗ まだ閉じている'}`);

    // モバイルメニュー内のリンク確認
    const mobileLinks = mobileMenuAfter.locator('a');
    const mobileLinkCount = await mobileLinks.count().catch(() => 0);
    console.log(`モバイルメニューリンク数: ${mobileLinkCount}`);

    for (let i = 0; i < mobileLinkCount; i++) {
      const text = await mobileLinks.nth(i).textContent();
      console.log(`  モバイルリンク[${i}]: ${text?.trim()}`);
    }

    // CFOリンクをモバイルメニューからクリック
    const cfoPMobileLink = mobileMenuAfter.locator('a[href="/dashboard/cfo"]');
    const cfoPMobileVisible = await cfoPMobileLink.isVisible().catch(() => false);
    console.log(`モバイルCFOリンク: ${cfoPMobileVisible ? '✓' : '✗'}`);

    if (cfoPMobileVisible) {
      await cfoPMobileLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`モバイルCFOクリック後URL: ${page.url()}`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/38-mobile-cfo-nav.png`, fullPage: false });
    }
  }
});

test('モバイル表示のUIレイアウト確認', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  // ログイン
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'ceo@anestsystem.jp');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  // KPIカードがモバイルで縦並びになっているか
  const kpiCards = page.locator('.grid-cols-1');
  const kpiCardsVisible = await kpiCards.first().isVisible().catch(() => false);
  console.log(`モバイルKPIグリッド: ${kpiCardsVisible ? '✓' : '✗'}`);

  // 全体のスクロールスクリーンショット
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/39-mobile-top.png`, fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/40-mobile-kpi.png`, fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/41-mobile-north-star.png`, fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/42-mobile-chart.png`, fullPage: false });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/43-mobile-bottom.png`, fullPage: false });

  console.log('モバイル全セクションスクリーンショット完了');
});
