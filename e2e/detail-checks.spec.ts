import { test, expect } from '@playwright/test';

const BASE_URL = 'https://kpios-v16.vercel.app';
const SCREENSHOT_DIR = 'e2e/screenshots';

async function login(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'ceo@anest.co.jp');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test('テーマ切替詳細調査', async ({ page }) => {
  await login(page);

  // 現在のhtmlクラスとCSSカスタムプロパティを確認
  const initialTheme = await page.evaluate(() => {
    const html = document.documentElement;
    const style = getComputedStyle(html);
    return {
      class: html.className,
      dataTheme: html.getAttribute('data-theme'),
      bgPrimary: style.getPropertyValue('--bg-primary').trim(),
      textPrimary: style.getPropertyValue('--text-primary').trim(),
      cardBg: style.getPropertyValue('--card-bg').trim(),
    };
  });
  console.log('初期テーマ状態:', JSON.stringify(initialTheme, null, 2));

  await page.screenshot({ path: `${SCREENSHOT_DIR}/21-theme-dark-initial.png`, fullPage: false });

  // 全ボタンをリストアップ
  const buttons = await page.locator('button').all();
  console.log(`全ボタン数: ${buttons.length}`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const ariaLabel = await buttons[i].getAttribute('aria-label');
    const title = await buttons[i].getAttribute('title');
    const visible = await buttons[i].isVisible();
    if (visible) {
      console.log(`ボタン[${i}]: text="${text?.trim().substring(0, 30)}", aria-label="${ariaLabel}", title="${title}"`);
    }
  }

  // テーマボタンをクリック
  const themeBtn = page.locator('button').nth(2);
  await themeBtn.click();
  await page.waitForTimeout(800);

  const afterTheme = await page.evaluate(() => {
    const html = document.documentElement;
    const style = getComputedStyle(html);
    return {
      class: html.className,
      dataTheme: html.getAttribute('data-theme'),
      bgPrimary: style.getPropertyValue('--bg-primary').trim(),
      cardBg: style.getPropertyValue('--card-bg').trim(),
    };
  });
  console.log('テーマ切替後:', JSON.stringify(afterTheme, null, 2));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/22-theme-after-toggle.png`, fullPage: true });

  // もう一度クリック（元に戻す）
  await themeBtn.click();
  await page.waitForTimeout(800);
  const thirdTheme = await page.evaluate(() => ({
    class: document.documentElement.className,
    dataTheme: document.documentElement.getAttribute('data-theme'),
    bgPrimary: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim(),
  }));
  console.log('再切替後:', JSON.stringify(thirdTheme, null, 2));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/23-theme-toggled-back.png`, fullPage: false });
});

test('ナビゲーションリンクの動作確認', async ({ page }) => {
  await login(page);

  const navItems = [
    { text: 'CFO', url: 'cfo' },
    { text: 'Sales', url: 'sales' },
    { text: 'CS', url: 'cs' },
    { text: 'HR', url: 'hr' },
    { text: 'Ops', url: 'ops' },
    { text: 'Simulator', url: 'simulator' },
  ];

  for (const item of navItems) {
    const link = page.locator(`a:has-text("${item.text}"), button:has-text("${item.text}")`).first();
    const visible = await link.isVisible().catch(() => false);
    if (visible) {
      await link.click();
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      const urlMatch = currentUrl.toLowerCase().includes(item.url.toLowerCase());
      console.log(`[${item.text}] → URL: ${currentUrl} ${urlMatch ? '✓' : '✗'}`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-${item.url}.png`, fullPage: false });
    } else {
      console.log(`[${item.text}] リンクが見つからない ✗`);
    }
    // CEOに戻る
    await login(page);
  }
});

test('ARRチャート詳細確認', async ({ page }) => {
  await login(page);
  await page.waitForLoadState('networkidle');

  // ARRチャートのセクションタイトル確認
  const chartTitle = page.locator('text=ARR推移').first();
  const titleVisible = await chartTitle.isVisible().catch(() => false);
  console.log(`ARR推移タイトル: ${titleVisible ? '✓' : '✗'}`);

  // SVGが描画されているか
  const chartWrapper = page.locator('.recharts-wrapper').first();
  const chartVisible = await chartWrapper.isVisible().catch(() => false);
  console.log(`Rechartsチャートコンテナ: ${chartVisible ? '✓' : '✗'}`);

  if (chartVisible) {
    const box = await chartWrapper.boundingBox();
    console.log(`チャートサイズ: ${Math.round(box?.width ?? 0)}x${Math.round(box?.height ?? 0)}`);

    // チャートのパス要素を確認
    const paths = await page.locator('.recharts-wrapper path').count();
    console.log(`SVGパス要素数: ${paths}`);

    // X軸テキスト確認
    const xTicks = await page.locator('.recharts-xAxis text').allTextContents();
    console.log(`X軸ラベル: ${xTicks.slice(0, 6).join(', ')}`);

    // チャートにスクロール
    await chartWrapper.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/24-arr-chart-detail.png`, fullPage: false });
});

test('要対応アラートセクションの詳細確認', async ({ page }) => {
  await login(page);

  // アラートセクション
  const alertSection = page.locator('text=要対応アラート').first();
  const alertVisible = await alertSection.isVisible().catch(() => false);
  console.log(`要対応アラートセクション: ${alertVisible ? '✓' : '✗'}`);

  // アラート件数の確認
  const alertCount = page.locator('text=3件').first();
  const alertCountVisible = await alertCount.isVisible().catch(() => false);
  console.log(`アラート3件表示: ${alertCountVisible ? '✓' : '✗'}`);

  // CRITICALアラートの詳細
  const criticalItems = page.locator('text=CRITICAL');
  const criticalCount = await criticalItems.count();
  console.log(`CRITICALバッジ数: ${criticalCount}`);

  // 各KPIカードのバーを確認（ステータスバー）
  const progressBars = page.locator('[class*="rounded-full"][class*="bg-"]');
  const barCount = await progressBars.count();
  console.log(`ステータスバー数: ${barCount}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/25-alert-section-detail.png`, fullPage: false });
});
