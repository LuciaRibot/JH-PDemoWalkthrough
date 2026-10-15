// Settings → RESET DEMO, then wait for the confirmation text.
import { chromium } from 'playwright';
import { settle, SITES } from './lib.mjs';
const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
const p = await b.contexts()[0].newPage(); await p.bringToFront(); await p.setViewportSize({ width: 1440, height: 810 });
await p.goto(SITES.settings, { waitUntil: 'domcontentloaded' }); await settle(p, 4000);
await p.getByRole('button', { name: 'RESET DEMO' }).scrollIntoViewIfNeeded();
await p.getByRole('button', { name: 'RESET DEMO' }).click();
await p.waitForTimeout(1500);
await p.getByRole('button', { name: 'Reset', exact: true }).click();
let ok = false;
for (let i = 0; i < 40 && !ok; i++) { await p.waitForTimeout(1500); ok = await p.getByText('Done. Rebecca').count() > 0; }
console.log(ok ? 'reset done' : 'reset NOT confirmed');
await p.close(); process.exit(ok ? 0 : 1);
