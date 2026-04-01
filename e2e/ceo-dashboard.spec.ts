import { test, expect, Page } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'https://kpios-v16.vercel.app';

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'ceo@anest.co.jp');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('CEO Dashboard E2E', () => {

  test('1. ログイン画面の表示とCEOログイン', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // ログインページの基本要素確認
    await expect(page.locator('h1')).toContainText('KPIOS');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // デモアカウントボタン確認
    await expect(page.locator('text=CEO')).toBeVisible();

    // スクリーンショット
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-login-page.png`, fullPage: true });

    // CEOでログイン
    await page.fill('input[type="email"]', 'ceo@anest.co.jp');
    await page.fill('input[type="password"]', 'demo');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-login-filled.png`, fullPage: true });

    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-dashboard-after-login.png`, fullPage: true });
    console.log('✓ ログイン成功 → ダッシュボードへリダイレクト');
  });

  test('2. トップナビバーの表示確認', async ({ page }) => {
    await login(page);

    // ナビバー全体の存在確認
    const navbar = page.locator('nav, header').first();
    await expect(navbar).toBeVisible();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-navbar-full.png`, fullPage: false });

    // ロゴ/サイト名確認
    const logoText = page.locator('text=KPIOS').first();
    const logoVisible = await logoText.isVisible().catch(() => false);
    console.log(`ロゴ表示: ${logoVisible ? '✓' : '✗'}`);

    // ナビリンク確認
    const navLinks = ['CEO', 'CFO', 'Sales', 'CS', 'HR', 'Ops'];
    for (const link of navLinks) {
      const el = page.locator(`text=${link}`).first();
      const visible = await el.isVisible().catch(() => false);
      console.log(`ナビリンク [${link}]: ${visible ? '✓' : '✗'}`);
    }

    // テーマ切替ボタン確認（SVGアイコンを持つボタン）
    const themeBtn = page.locator('button svg').first();
    const themeBtnVisible = await themeBtn.isVisible().catch(() => false);
    console.log(`テーマ切替ボタン: ${themeBtnVisible ? '✓' : '✗'}`);

    // ユーザーメニュー確認（CEO名 or アバター）
    const userMenu = page.locator('text=尾田').first();
    const userMenuVisible = await userMenu.isVisible().catch(() => false);
    console.log(`ユーザーメニュー（尾田）: ${userMenuVisible ? '✓' : '✗'}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-navbar-detail.png`, fullPage: false });
  });

  test('3. North Star Metric（ARR成長率35%）の表示確認', async ({ page }) => {
    await login(page);

    // North Star セクション確認
    const northStar = page.locator('text=North Star').first();
    const northStarVisible = await northStar.isVisible().catch(() => false);
    console.log(`North Star テキスト: ${northStarVisible ? '✓' : '✗'}`);

    // ARR成長率の値（35%）確認
    const arrGrowth = page.locator('text=35').first();
    const arrGrowthVisible = await arrGrowth.isVisible().catch(() => false);
    console.log(`ARR成長率 35: ${arrGrowthVisible ? '✓' : '✗'}`);

    // ARR成長率のラベル確認
    const arrLabel = page.locator('text=ARR成長率').first();
    const arrLabelVisible = await arrLabel.isVisible().catch(() => false);
    console.log(`ARR成長率ラベル: ${arrLabelVisible ? '✓' : '✗'}`);

    // North Star KPI全体のスクリーンショット
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-north-star.png`, fullPage: true });
    console.log('North Starセクションをキャプチャ完了');
  });

  test('4. KPIカードの表示確認', async ({ page }) => {
    await login(page);

    // 主要KPIセクションの確認
    const kpiSection = page.locator('text=主要KPI').first();
    const kpiVisible = await kpiSection.isVisible().catch(() => false);
    console.log(`主要KPIセクション: ${kpiVisible ? '✓' : '✗'}`);

    // KPI値の確認（推定ARR: 27億円）
    const arr = page.locator('text=推定ARR').first();
    const arrVisible = await arr.isVisible().catch(() => false);
    console.log(`推定ARR KPIカード: ${arrVisible ? '✓' : '✗'}`);

    // NRR確認
    const nrr = page.locator('text=NRR').first();
    const nrrVisible = await nrr.isVisible().catch(() => false);
    console.log(`NRR KPIカード: ${nrrVisible ? '✓' : '✗'}`);

    // 前月比確認（+5%等）
    const momChange = page.locator('text=+5%').first();
    const momVisible = await momChange.isVisible().catch(() => false);
    console.log(`前月比（+5%）: ${momVisible ? '✓' : '✗'}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-kpi-cards.png`, fullPage: true });
  });

  test('5. ARR推移チャートの表示確認', async ({ page }) => {
    await login(page);

    // Rechartsのグラフ確認（SVGとして描画される）
    const chart = page.locator('svg').first();
    await expect(chart).toBeVisible({ timeout: 10000 });
    console.log('ARR推移チャート（SVG）: ✓');

    // グラフコンテナの確認
    const recharts = page.locator('.recharts-wrapper, .recharts-responsive-container').first();
    const rechartsVisible = await recharts.isVisible().catch(() => false);
    console.log(`Rechartsコンテナ: ${rechartsVisible ? '✓' : '✗'}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-arr-chart.png`, fullPage: true });
  });

  test('6. P0アクションリストの表示確認', async ({ page }) => {
    await login(page);

    // P0/P1アクションセクション確認
    const p0Section = page.locator('text=P0').first();
    const p0Visible = await p0Section.isVisible().catch(() => false);
    console.log(`P0/P1アクションセクション: ${p0Visible ? '✓' : '✗'}`);

    // アクションアイテムの確認
    const actions = page.locator('text=アクション').first();
    const actionsVisible = await actions.isVisible().catch(() => false);
    console.log(`アクションテキスト: ${actionsVisible ? '✓' : '✗'}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-p0-actions.png`, fullPage: true });
  });

  test('7. 重要意思決定リストの表示確認', async ({ page }) => {
    await login(page);

    // 重要意思決定セクション確認
    const decisions = page.locator('text=重要意思決定').first();
    const decisionsVisible = await decisions.isVisible().catch(() => false);
    console.log(`重要意思決定セクション: ${decisionsVisible ? '✓' : '✗'}`);

    // 優先度バッジ確認（CRITICAL, HIGH等）
    const critical = page.locator('text=CRITICAL').first();
    const criticalVisible = await critical.isVisible().catch(() => false);
    console.log(`CRITICALバッジ: ${criticalVisible ? '✓' : '✗'}`);

    const high = page.locator('text=HIGH').first();
    const highVisible = await high.isVisible().catch(() => false);
    console.log(`HIGHバッジ: ${highVisible ? '✓' : '✗'}`);

    // ステータス確認（進行中、完了等）
    const inProgress = page.locator('text=進行中').first();
    const inProgressVisible = await inProgress.isVisible().catch(() => false);
    console.log(`ステータス（進行中）: ${inProgressVisible ? '✓' : '✗'}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-key-decisions.png`, fullPage: true });
  });

  test('8. ダーク/ライトモード切替の確認', async ({ page }) => {
    await login(page);

    // 初期状態のスクリーンショット
    await page.screenshot({ path: `${SCREENSHOT_DIR}/11-theme-initial.png`, fullPage: false });

    // htmlのクラス確認（dark/light）
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log(`初期HTMLクラス: ${htmlClass}`);

    // テーマ切替ボタンを探してクリック
    // ナビバー内のテーマボタンを探す
    const themeButtons = page.locator('button').filter({ has: page.locator('svg') });
    const count = await themeButtons.count();
    console.log(`SVGを持つボタン数: ${count}`);

    // テーマトグルボタンをクリック（ナビバー内の最初のSVGボタン）
    if (count > 0) {
      await themeButtons.first().click();
      await page.waitForTimeout(500);
      const htmlClassAfter = await page.locator('html').getAttribute('class');
      console.log(`テーマ切替後HTMLクラス: ${htmlClassAfter}`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/12-theme-toggled.png`, fullPage: false });
      console.log('テーマ切替: ✓ クリック実行');
    }

    // ダッシュボードの主要コンポーネントが表示されているか確認
    await expect(page.locator('text=CEO Dashboard')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/13-theme-dashboard-view.png`, fullPage: true });
  });

  test('9. モバイル表示でハンバーガーメニューの確認', async ({ page, isMobile }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/14-mobile-dashboard.png`, fullPage: false });

    // ハンバーガーメニューボタンを探す（モバイルでのみ表示）
    const hamburger = page.locator('[class*="hamburger"], button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    const hamburgerByIcon = page.locator('button').filter({ hasText: /☰|≡/ }).first();

    // モバイルメニューボタンの確認（複数のセレクタで試行）
    const hamburgerSvg = page.locator('button svg').first();
    const hamburgerVisible = await hamburgerSvg.isVisible().catch(() => false);
    console.log(`ハンバーガーアイコン（SVGボタン）: ${hamburgerVisible ? '✓' : '✗'}`);

    // モバイルメニューに表示されるべき要素の確認
    await page.screenshot({ path: `${SCREENSHOT_DIR}/15-mobile-nav.png`, fullPage: false });

    // ナビゲーション要素の確認
    const navElements = page.locator('nav').first();
    const navVisible = await navElements.isVisible().catch(() => false);
    console.log(`モバイルナビ: ${navVisible ? '✓' : '✗'}`);

    // ハンバーガーボタンをクリックして確認
    if (hamburgerVisible) {
      await hamburgerSvg.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/16-mobile-menu-open.png`, fullPage: false });
      console.log('ハンバーガーメニュークリック: ✓');
    }

    // モバイル表示でCEOダッシュボードの内容確認
    const ceoHeader = page.locator('text=CEO Dashboard').first();
    const ceoHeaderVisible = await ceoHeader.isVisible().catch(() => false);
    console.log(`モバイルでCEO Dashboard表示: ${ceoHeaderVisible ? '✓' : '✗'}`);
  });

  test('10. 全体ページ完全スクリーンショット', async ({ page }) => {
    await login(page);

    // ページ全体が描画されるまで少し待機
    await page.waitForLoadState('networkidle');

    // 全セクションをスクロールして確認
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/17-full-page-top.png`, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/18-full-page-mid.png`, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/19-full-page-bottom.png`, fullPage: false });

    // フルページスクリーンショット
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/20-complete-dashboard-full.png`, fullPage: true });

    console.log('全体スクリーンショット完了');
  });
});
