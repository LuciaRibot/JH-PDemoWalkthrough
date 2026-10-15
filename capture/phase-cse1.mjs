// STAFF — the client service executive picks up the submission (JH&P Onboarding site).
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, onlySet } from './helpers.mjs';
import { waitAgentIdle } from './lib.mjs';
const CH = 'The onboarding team';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const CHAT = 'textarea[aria-label="Chat message input"]';
const tab = (name) => () => P().getByText(name, { exact: true });
try {
  await cap.as('cse', SITES.staff);
  await cap.step({ id: 200, chapter: CH, title: 'Queue', body: '', action: 'none', target: () => P().getByText('New submission', { exact: false }), before: top, settle: 3000 });
  await cap.step({ id: 201, chapter: CH, title: 'Open case assistant', body: '', action: 'click', target: () => P().getByText('Ask a question', { exact: false }).first(), before: top, slow: true, slowMs: 4000 });
  await cap.step({ id: 202, chapter: CH, title: 'Ask the case assistant', body: '', action: 'type',
    text: 'Which cases are past the service target, and what is still outstanding on Hartley-Vance?',
    target: () => P().locator(CHAT), before: into(() => P().locator(CHAT)),
    after: async (page) => { await page.locator(CHAT).press('Enter'); await page.waitForTimeout(3000); await waitAgentIdle(page, 120000); } });
  await cap.step({ id: 203, chapter: CH, title: 'Case assistant answer', body: '', action: 'none', target: null,
    before: async (page) => { await page.evaluate(() => window.scrollTo(0, 230)); await page.waitForTimeout(800); } });
  await cap.step({ id: 204, chapter: CH, title: 'Hide assistant', body: '', action: 'click', target: () => P().getByText('Hide', { exact: false }).first(), before: top });
  await cap.step({ id: 205, chapter: CH, title: 'Review submission', body: '', action: 'click', target: () => P().getByRole('button', { name: 'REVIEW' }).first(), before: top, slow: true, slowMs: 4000 });
  await cap.step({ id: 206, chapter: CH, title: 'Application tab', body: '', action: 'none', target: null, before: top, settle: 2500 });
  await cap.step({ id: 207, chapter: CH, title: 'DocCenter reading', body: '', action: 'none', target: () => P().getByText('DocCenter is reading', { exact: false }),
    before: into(() => P().getByText('Completion statement', { exact: false }).last()) });
  await cap.step({ id: 208, chapter: CH, title: 'Overview tab', body: '', action: 'click', target: tab('OVERVIEW'), before: top, slow: true, slowMs: 3000 });
  await cap.step({ id: 209, chapter: CH, title: 'Overview', body: '', action: 'none', target: null, before: top, settle: 2500 });
  await cap.step({ id: 210, chapter: CH, title: 'Systems panel', body: '', action: 'none', target: () => P().getByText('In sync', { exact: false }).first(),
    before: into(() => P().getByText('Azure warehouse', { exact: false }).first()) });
  await cap.step({ id: 211, chapter: CH, title: 'Parties tab', body: '', action: 'click', target: tab('PARTIES'), before: top, slow: true, slowMs: 3000 });
  await cap.step({ id: 212, chapter: CH, title: 'Parties', body: '', action: 'none', target: null, before: top, settle: 2000 });
  await cap.step({ id: 213, chapter: CH, title: 'Documents tab', body: '', action: 'click', target: tab('DOCUMENTS'), before: top, slow: true, slowMs: 3000 });
  await cap.step({ id: 214, chapter: CH, title: 'Documents', body: '', action: 'none', target: null, before: top, settle: 2000 });
} finally {
  cap.save('cse1'); await cap.close(); process.exit(0);
}
