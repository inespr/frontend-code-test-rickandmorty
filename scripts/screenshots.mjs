/**
 * Usage:
 *   npm run screenshots -- https://your-app.vercel.app
 *   npm run screenshots          (uses http://localhost:5173)
 *
 * Saves PNGs to docs/screenshots/ and updates the Screenshots section in README.md.
 */

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir  = dirname(fileURLToPath(import.meta.url));
const ROOT   = resolve(__dir, '..');
const DOCS   = resolve(ROOT, 'docs', 'screenshots');
const README = resolve(ROOT, 'README.md');

const BASE_URL = process.argv[2] ?? 'http://localhost:5173';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844  },
];

const PAGES = [
  { name: 'home',      path: '/',            wait: '.grid, [data-testid]' },
  { name: 'character', path: '/character/1', wait: '[data-testid="character-detail"]' },
  { name: 'episode',   path: '/episode/1',   wait: '.grid, [data-testid]' },
];

mkdirSync(DOCS, { recursive: true });

console.log(`\nCapturing screenshots from ${BASE_URL}\n`);

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx  = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  for (const pg of PAGES) {
    process.stdout.write(`  ${pg.name} @ ${vp.name} (${vp.width}px)... `);
    try {
      await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800);
      const file = resolve(DOCS, `${pg.name}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log('✓');
    } catch (e) {
      console.log(`✗ (${e.message.split('\n')[0]})`);
    }
  }

  await ctx.close();
}

await browser.close();

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

const marker = '## Screenshots';
let readme = readFileSync(README, 'utf-8');

if (readme.includes(marker)) {
  // replace existing section up to next ## or end of file
  readme = readme.replace(/## Screenshots[\s\S]*?(?=\n## |\s*$)/, section + '\n\n');
} else {
  readme = readme.trimEnd() + '\n\n' + section + '\n';
}

writeFileSync(README, readme);
console.log('\nREADME.md updated ✓\n');
