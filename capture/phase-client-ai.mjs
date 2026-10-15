// CLIENT — the in-line onboarding assistant (Appian chat agent) on the Source of wealth step.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, onlySet } from './helpers.mjs';
import { waitAgentIdle } from './lib.mjs';
const CH = 'The client application';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const CHAT = 'textarea[aria-label="Chat message input"]';
try {
  await cap.as('rebecca', SITES.portal);
  await P().getByRole('button', { name: 'VIEW YOUR APPLICATION' }).click(); await settle(P(), 3000);
  await P().getByText('Source of wealth', { exact: true }).first().click(); await settle(P(), 3000);
  const ta = await P().evaluate(() => [...document.querySelectorAll('textarea')].map(t => t.getAttribute('aria-label')).join('|'));
  console.log('textareas before:', ta);
  await cap.step({ id: 150, chapter: CH, title: 'Ask a question', body: '', action: 'click',
    target: () => P().getByText('Ask a question', { exact: false }), before: into(() => P().getByText('Ask a question', { exact: false })), slow: true, slowMs: 4000 });
  const ta2 = await P().evaluate(() => [...document.querySelectorAll('textarea')].map(t => t.getAttribute('aria-label') + '/' + t.placeholder).join('|'));
  console.log('textareas after:', ta2);
  await cap.step({ id: 151, chapter: CH, title: 'Assistant question', body: '', action: 'type',
    text: 'Why do you need my completion statement, and what counts as source of wealth?',
    target: () => P().locator(CHAT), before: into(() => P().locator(CHAT)),
    after: async (page) => { await page.locator(CHAT).press('Enter'); await page.waitForTimeout(3000); await waitAgentIdle(page, 90000); } });
  await cap.step({ id: 152, chapter: CH, title: 'Assistant answer', body: '', action: 'none', target: null,
    before: async (page) => { await page.locator(CHAT).evaluate(el => el.scrollIntoView({ block: 'end' })); await page.waitForTimeout(800); } });
} finally {
  cap.save('client-ai'); await cap.close(); process.exit(0);
}
