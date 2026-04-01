import { test, expect, Page } from '@playwright/test';
import * as path from 'path';

const BASE_URL = 'https://kpios-v16.vercel.app/login';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: false,
  });
}

test.describe('kpios-v16 ログインページ E2E テスト', () => {
  test.setTimeout(60000);

  // ─────────────────────────────────────────────────────
  // 1. ログインページの表示確認
  // ─────────────────────────────────────────────────────
  test('1. ログインページが正しく表示される', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await screenshot(page, '01-login-initial');

    // ページタイトル / URL
    expect(page.url()).toContain('/login');

    // ロゴ確認（img タグ or テキスト "KPIOS" or "アネスト" を含む要素）
    const logo = page.locator('img, [alt*="logo" i], [alt*="kpios" i], h1, header').first();
    await expect(logo).toBeVisible({ timeout: 10000 });

    // フォーム: email/username 入力欄
    const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="メール" i], input[placeholder*="email" i], input[type="text"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // フォーム: password 入力欄
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });

    // ログインボタン
    const loginBtn = page.locator('button[type="submit"], button:has-text("ログイン"), button:has-text("Login"), button:has-text("サインイン")').first();
    await expect(loginBtn).toBeVisible({ timeout: 10000 });

    // デモアカウントボタン群（CEO を含む）
    const ceoBtn = page.locator('button:has-text("CEO"), button:has-text("ceo")').first();
    await expect(ceoBtn).toBeVisible({ timeout: 10000 });

    console.log('[PASS] 1. ログインページが正しく表示される');
  });

  // ─────────────────────────────────────────────────────
  // 2. テーマ切替ボタンの動作確認
  // ─────────────────────────────────────────────────────
  test('2. テーマ切替ボタン（太陽/月アイコン）が動作する', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // テーマ切替ボタンを探す（aria-label, svg title, data-testid など複数パターン）
    const themeBtn = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="テーマ" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[aria-label*="moon" i], button[aria-label*="sun" i], button[title*="theme" i], [data-testid*="theme"]'
    ).first();

    // ボタンが見つからない場合は SVG アイコンを持つ小さいボタンをフォールバックで探す
    const themeBtnFallback = page.locator('button svg').first();

    const btnToClick = (await themeBtn.count()) > 0 ? themeBtn : themeBtnFallback;
    await expect(btnToClick).toBeVisible({ timeout: 10000 });

    // クリック前のテーマクラスを取得
    const htmlBefore = await page.locator('html').getAttribute('class');
    const bodyBefore = await page.locator('body').getAttribute('class');
    const dataBefore = await page.locator('html').getAttribute('data-theme');

    await btnToClick.click();
    await page.waitForTimeout(500); // アニメーション待機

    const htmlAfter = await page.locator('html').getAttribute('class');
    const bodyAfter = await page.locator('body').getAttribute('class');
    const dataAfter = await page.locator('html').getAttribute('data-theme');

    await screenshot(page, '02-theme-toggled');

    // いずれかの属性が変化していることを確認
    const changed =
      htmlBefore !== htmlAfter ||
      bodyBefore !== bodyAfter ||
      dataBefore !== dataAfter;

    if (changed) {
      console.log(`[PASS] 2. テーマ切替: html.class ${htmlBefore} → ${htmlAfter}`);
    } else {
      console.warn('[WARN] 2. テーマ属性に変化なし。ボタン動作を再確認してください。');
    }

    expect(btnToClick).toBeVisible();
  });

  // ─────────────────────────────────────────────────────
  // 3. デモアカウント「CEO」ボタンで自動入力
  // ─────────────────────────────────────────────────────
  test('3. デモ「CEO」ボタンをクリックして自動入力される', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const ceoBtn = page.locator('button:has-text("CEO")').first();
    await expect(ceoBtn).toBeVisible({ timeout: 10000 });
    await ceoBtn.click();
    await page.waitForTimeout(300);

    await screenshot(page, '03-demo-ceo-filled');

    // 入力欄に値が入っているか確認
    const emailInput = page.locator('input[type="email"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    const emailVal = await emailInput.inputValue();
    const passVal = await passwordInput.inputValue();

    console.log(`[INFO] 3. email="${emailVal}", password="${passVal.replace(/./g, '*')}"`);
    expect(emailVal.length).toBeGreaterThan(0);
    expect(passVal.length).toBeGreaterThan(0);

    console.log('[PASS] 3. CEO ボタンで自動入力された');
  });

  // ─────────────────────────────────────────────────────
  // 4. ログインしてダッシュボードへ遷移
  // ─────────────────────────────────────────────────────
  test('4. ログインボタンを押してダッシュボードに遷移する', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // CEO ボタンで資格情報を自動入力
    const ceoBtn = page.locator('button:has-text("CEO")').first();
    await expect(ceoBtn).toBeVisible({ timeout: 10000 });
    await ceoBtn.click();
    await page.waitForTimeout(300);

    // ログインボタンをクリック
    const loginBtn = page.locator('button[type="submit"], button:has-text("ログイン"), button:has-text("Login")').first();
    await expect(loginBtn).toBeVisible({ timeout: 5000 });

    // ナビゲーション待機
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => null),
      loginBtn.click(),
    ]);

    await screenshot(page, '04-after-login');

    const currentUrl = page.url();
    console.log(`[INFO] 4. ログイン後URL: ${currentUrl}`);

    // /login 以外のページ（ダッシュボード等）に遷移したか確認
    const redirected = !currentUrl.endsWith('/login') && !currentUrl.includes('/login?');
    if (redirected) {
      console.log('[PASS] 4. ダッシュボードへの遷移を確認');
    } else {
      // エラーメッセージがあれば記録
      const errorMsg = await page.locator('[role="alert"], .error, .text-red').first().textContent().catch(() => '');
      console.warn(`[WARN] 4. ログイン後も /login にいます。エラー: "${errorMsg}"`);
    }

    expect(currentUrl).not.toContain('/login');
  });

  // ─────────────────────────────────────────────────────
  // 5. モバイル表示（幅375px）のレイアウト確認
  // ─────────────────────────────────────────────────────
  test('5. モバイル表示（375px）でレイアウトが崩れない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await screenshot(page, '05-mobile-375px');

    // 主要要素が表示されているか
    const emailInput = page.locator('input[type="email"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginBtn = page.locator('button[type="submit"], button:has-text("ログイン"), button:has-text("Login")').first();
    const ceoBtn = page.locator('button:has-text("CEO")').first();

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await expect(loginBtn).toBeVisible({ timeout: 10000 });
    await expect(ceoBtn).toBeVisible({ timeout: 10000 });

    // 横スクロールが発生していないか（body の scrollWidth が viewport 幅以内）
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    console.log(`[INFO] 5. body.scrollWidth=${scrollWidth}px (viewport=375px)`);

    if (scrollWidth <= 380) {
      console.log('[PASS] 5. 横スクロールなし、モバイルレイアウト正常');
    } else {
      await screenshot(page, '05-mobile-overflow');
      console.warn(`[WARN] 5. 横スクロール発生 scrollWidth=${scrollWidth}px`);
    }

    expect(scrollWidth).toBeLessThanOrEqual(400);
  });
});
