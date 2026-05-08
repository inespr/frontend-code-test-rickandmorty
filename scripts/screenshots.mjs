/**
 * Usage:
 *   npm run screenshots -- https://your-app.vercel.app
 *   npm run screenshots          (uses http://localhost:5173)
 */

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir  = dirname(fileURLToPath(import.meta.url));
const ROOT   = resolve(__dir, '..');
const DOCS   = resolve(ROOT, 'docs', 'screenshots');
const README = resolve(ROOT, 'README.md');

const BASE_URL = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844  },
];

const PAGES = [
  { name: 'home',      path: '/' },
  { name: 'character', path: '/character/1' },
  { name: 'episode',   path: '/episode/1' },
];

mkdirSync(DOCS, { recursive: true });

console.log(`\nCapturing from: ${BASE_URL}\n`);

const browser = await chromium.launch();
let anyError = false;

for (const vp of VIEWPORTS) {
  const ctx  = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    // ignore SSL errors on preview deployments
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();

  // log console errors from the page
  page.on('pageerror', err => console.error(`    [page error] ${err.message}`));

  for (const pg of PAGES) {
    const url  = `${BASE_URL}${pg.path}`;
    const file = resolve(DOCS, `${pg.name}-${vp.name}.png`);
    process.stdout.write(`  ${pg.name} @ ${vp.name}  →  ${url} ... `);

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const status   = response?.status() ?? '?';

      if (status >= 400) {
        console.log(`✗  HTTP ${status}`);
        anyError = true;
        await page.screenshot({ path: file });
        continue;
      }

      // wait for error banner OR real content — whichever appears first
      await Promise.race([
        page.waitForSelector('[data-testid="character-detail"], .grid, [class*="section"]', { timeout: 8000 }).catch(() => {}),
        page.waitForSelector('[class*="error"], [class*="Error"]', { timeout: 8000 }).catch(() => {}),
      ]);

      // extra settle for images / fonts
      await page.waitForTimeout(1200);

      await page.screenshot({ path: file, fullPage: false });
      console.log(`✓  (${status})`);
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`✗  ${e.message.split('\n')[0]}`);
      anyError = true;
      try { await page.screenshot({ path: file }); } catch (_) {}
    }
  }

  await ctx.close();
}

await browser.close();

if (anyError) {
  console.log('\n⚠  Some pages failed. Check the saved screenshots in docs/screenshots/ to see what Vercel returned.');
  console.log('   If you see a 404, make sure vercel.json is committed and the site is redeployed.\n');
}

// ── Update README ──────────────────────────────────────────────────────────
const section = `## Screenshots

### Home
| Desktop | Tablet | Mobile |
|---|---|---|
| ![home desktop](./docs/screenshots/home-desktop.png) | ![home tablet](./docs/screenshots/home-tablet.png) | ![home mobile](./docs/screenshots/home-mobile.png) |

### Character
| Desktop | Tablet | Mobile |
|---|---|---|
| ![character desktop](./docs/screenshots/character-desktop.png) | ![character tablet](./docs/screenshots/character-tablet.png) | ![character mobile](./docs/screenshots/character-mobile.png) |

### Episode
| Desktop | Tablet | Mobile |
|---|---|---|
| ![episode desktop](./docs/screenshots/episode-desktop.png) | ![episode tablet](./docs/screenshots/episode-tablet.png) | ![episode mobile](./docs/screenshots/episode-mobile.png) |`;

let readme = readFileSync(README, 'utf-8');
const marker = '## Screenshots';

if (readme.includes(marker)) {
  readme = readme.replace(/## Screenshots[\s\S]*?(?=\n## |\s*$)/, section + '\n\n');
} else {
  readme = readme.trimEnd() + '\n\n' + section + '\n';
}

writeFileSync(README, readme);
console.log('README.md updated ✓\n');
