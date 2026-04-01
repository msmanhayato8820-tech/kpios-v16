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

test('ナビリンクとsessionStorageの関係調査', async ({ page }) => {
  await login(page);

  // sessionStorage確認
  const session = await page.evaluate(() => sessionStorage.getItem('kpios_user'));
  console.log('sessionStorage（ログイン後）:', session ? '✓ 存在' : '✗ なし');

  // CFOリンクをクリック
  const cfoLink = page.locator('a[href="/dashboard/cfo"]');
  await cfoLink.click();

  // URL変化を待つ
  await page.waitForTimeout(2000);
  const urlAfterClick = page.url();
  console.log(`CFOクリック後URL: ${urlAfterClick}`);

  // sessionStorage確認（遷移後）
  const sessionAfter = await page.evaluate(() => sessionStorage.getItem('kpios_user'));
  console.log('sessionStorage（遷移後）:', sessionAfter ? '✓ 存在' : '✗ なし');

  // 現在表示されているページの内容確認
  const pageTitle = await page.title();
  const h1Text = await page.locator('h1').first().textContent().catch(() => 'N/A');
  console.log(`ページタイトル: ${pageTitle}`);
  console.log(`H1テキスト: ${h1Text}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/33-cfo-nav-debug.png`, fullPage: false });

  // isAuthenticated状態の確認（コンソールエラー）
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // 直接CFOページにアクセス
  await page.goto(`${BASE_URL}/dashboard/cfo`);
  await page.waitForLoadState('networkidle');
  const urlDirect = page.url();
  console.log(`直接アクセス後URL: ${urlDirect}`);
  const sessionDirect = await page.evaluate(() => sessionStorage.getItem('kpios_user'));
  console.log('sessionStorage（直接アクセス後）:', sessionDirect ? '✓ 存在' : '✗ なし');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/34-cfo-direct.png`, fullPage: false });
});

test('ナビリンク遷移後のCFOダッシュボード内容確認', async ({ page }) => {
  // ログイン
  await login(page);

  // sessionStorageをPlaywrightが保持するか確認してから移動
  const sessionBefore = await page.evaluate(() => sessionStorage.getItem('kpios_user'));
  console.log(`CEOダッシュ時sessionStorage: ${sessionBefore ? '有り' : '無し'}`);

  // Next.jsのクライアントサイドナビゲーション（SPA遷移）
  await page.evaluate(() => {
    window.history.pushState({}, '', '/dashboard/cfo');
  });
  await page.waitForTimeout(1000);
  console.log(`pushState後URL: ${page.url()}`);

  // React Routerによる再レンダリングを確認
  const h1 = await page.locator('h1').first().textContent().catch(() => 'N/A');
  console.log(`H1: ${h1}`);

  // Next.js Linkコンポーネントは client-side navigationを使用
  // 通常のクリックでSPA遷移するはず
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForLoadState('networkidle');

  // ナビリンクのhref確認
  const cfoHref = await page.locator('a[href="/dashboard/cfo"]').getAttribute('href');
  console.log(`CFOリンクのhref: ${cfoHref}`);

  // Linkコンポーネントを直接クリックしてNext.js SPAナビゲーション
  await page.locator('a[href="/dashboard/cfo"]').click();
  await page.waitForTimeout(3000);

  const finalUrl = page.url();
  const finalSession = await page.evaluate(() => sessionStorage.getItem('kpios_user'));
  const h1Final = await page.locator('h1').first().textContent().catch(() => 'N/A');

  console.log(`最終URL: ${finalUrl}`);
  console.log(`最終sessionStorage: ${finalSession ? '有り' : '無し'}`);
  console.log(`最終H1: ${h1Final}`);

  // CFOダッシュボードコンテンツ確認
  const cfoContent = await page.locator('text=CFO').first().isVisible().catch(() => false);
  console.log(`CFOコンテンツ表示: ${cfoContent ? '✓' : '✗'}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/35-cfo-spa-nav.png`, fullPage: false });
});
