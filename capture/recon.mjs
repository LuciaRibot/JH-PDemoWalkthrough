import { chromium } from 'playwright';
import { settle } from './lib.mjs';
const pairs = process.argv.slice(2);
const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
const p = await b.contexts()[0].newPage(); await p.bringToFront(); await p.setViewportSize({ width: 1440, height: 810 });
for (let i = 0; i < pairs.length; i += 2) {
  await p.goto(pairs[i], { waitUntil: 'domcontentloaded' }); await settle(p, 5000);
  const items = await p.evaluate(() => [...document.querySelectorAll('button,a,[role=tab],[role=button]')].filter(e => e.offsetParent && (e.innerText||'').trim()).map(e => e.tagName[0] + ':' + e.innerText.trim().replace(/\s+/g,' ').slice(0,50)));
  console.log('=== ' + pairs[i+1] + '\n' + [...new Set(items)].join(' | '));
  await p.screenshot({ path: `../recon/${pairs[i+1]}.png` });
}
await p.close(); process.exit(0);
