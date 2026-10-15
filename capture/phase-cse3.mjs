// STAFF — DocCenter reconcile, resolving what is outstanding, and sending for approval.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, waitText, onlySet } from './helpers.mjs';
const CH1 = 'Document intelligence';
const CH2 = 'The onboarding team';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const openCase = async () => {
  await cap.goto(SITES.staff, 3500);
  const link = P().getByRole('link', { name: 'Hartley-Vance family', exact: true }).first();
  await link.scrollIntoViewIfNeeded(); await link.click(); await settle(P(), 3500);
  await P().getByText('Case 2026-0418', { exact: false }).first().waitFor({ timeout: 30000 });
  await P().evaluate(() => window.scrollTo(0, 0)); await P().waitForTimeout(600);
};
const below = (getLoc, offset = 160) => async (page) => {
  await getLoc().first().evaluate((el, o) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o), offset); await page.waitForTimeout(800);
};
const btn = (n) => () => P().getByRole('button', { name: new RegExp('^' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
try {
  await cap.as('cse', null); await openCase();
  await cap.step({ id: 400, chapter: CH1, title: 'Reconcile in DocCenter', body: '', action: 'click', target: () => P().getByText('Reconcile in DocCenter', { exact: true }).first(),
    before: below(() => P().getByText('Reconcile in DocCenter', { exact: true }), 330), slow: true, slowMs: 7000 });
  await cap.step({ id: 401, chapter: CH1, title: 'Accept task', body: '', action: 'click', target: () => P().getByRole('button', { name: /^accept/i }).first(), before: top, slow: true, slowMs: 5000 });
  await cap.step({ id: 402, chapter: CH1, title: 'Reconcile fields', body: '', action: 'none', target: null, before: top, settle: 4000 });
  await cap.step({ id: 403, chapter: CH1, title: 'Net proceeds field', body: '', action: 'none', target: () => P().getByText(/Net Proceeds/i).first(),
    before: async (page) => { await P().getByText(/Net Proceeds/i).first().scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1000); } });
  await cap.step({ id: 404, chapter: CH1, title: 'Submit reconcile', body: '', action: 'click', target: btn('SUBMIT'), before: into(btn('SUBMIT')), slow: true, slowMs: 9000 });
  await openCase();
  if (cap.wanted(405)) { if (!(await waitText(P(), /Review evidence/, 120000, 5000))) await openCase(); }
  await cap.step({ id: 405, chapter: CH1, title: 'Mismatch raised', body: '', action: 'click', target: () => P().getByText('Review evidence', { exact: true }).first(), before: top, slow: true, slowMs: 4000 });
  await cap.step({ id: 406, chapter: CH1, title: 'Evidence review', body: '', action: 'click', target: () => P().getByText('Accept the evidence: the difference is explained by the statement', { exact: true }),
    before: below(() => P().getByText('Your decision', { exact: true }), 380) });
  await cap.step({ id: 407, chapter: CH1, title: 'Evidence note', body: '', action: 'type', text: 'Net proceeds are after £131,600 of deal fees itemised on page 2; the gross price matches the £2.1m declared.',
    target: () => P().getByLabel('Note for the file'), before: below(() => P().getByText('Your decision', { exact: true }), 200), after: async (page) => { await page.keyboard.press('Tab'); await page.waitForTimeout(700); } });
  await cap.step({ id: 408, chapter: CH1, title: 'Resolve mismatch', body: '', action: 'click', target: btn('RESOLVE'), before: into(btn('RESOLVE')), slow: true, slowMs: 5000 });
  // Edward's identity: confirmed with the client
  await cap.step({ id: 410, chapter: CH2, title: 'Resolve Edward', body: '', action: 'click', target: () => P().getByText('Resolve', { exact: true }).first(), before: top, slow: true, slowMs: 3500 });
  await cap.step({ id: 411, chapter: CH2, title: 'How resolved', body: '', action: 'click', target: () => P().getByText('Confirmed with the client by phone or in person', { exact: true }),
    before: below(() => P().getByText('How was it resolved?', { exact: true }), 300) });
  await cap.step({ id: 412, chapter: CH2, title: 'Resolve Edward note', body: '', action: 'type', text: 'Spoke to Edward on 15 October; he completes his identity section on his return on the 20th.',
    target: () => P().getByLabel('Note for the file'), before: below(() => P().getByText('How was it resolved?', { exact: true }), 200), after: async (page) => { await page.keyboard.press('Tab'); await page.waitForTimeout(700); } });
  await cap.step({ id: 413, chapter: CH2, title: 'Resolve', body: '', action: 'click', target: btn('RESOLVE'), before: into(btn('RESOLVE')), slow: true, slowMs: 5000 });
  await cap.step({ id: 414, chapter: CH2, title: 'Application tab', body: '', action: 'click', target: () => P().getByText('APPLICATION', { exact: true }), before: top, slow: true, slowMs: 3000 });
  await cap.step({ id: 415, chapter: CH2, title: 'Mark reviewed', body: '', action: 'click', target: btn('MARK APPLICATION REVIEWED'), before: into(btn('MARK APPLICATION REVIEWED')), slow: true, slowMs: 5000 });
  await cap.step({ id: 416, chapter: CH2, title: 'Send for approval', body: '', action: 'click', target: () => P().getByRole('button', { name: /send for approval/i }), before: top, slow: true, slowMs: 7000 });
  await cap.step({ id: 417, chapter: CH2, title: 'With PM', body: '', action: 'none', target: () => P().getByText(/for approval/).first(), before: top, settle: 2500 });
  await cap.step({ id: 418, chapter: CH2, title: 'Audit tab', body: '', action: 'click', target: () => P().getByText('AUDIT', { exact: true }), before: top, slow: true, slowMs: 3500 });
  await cap.step({ id: 419, chapter: CH2, title: 'Audit trail', body: '', action: 'none', target: null, before: top, settle: 2500 });
} finally {
  cap.save('cse3'); await cap.close(); process.exit(0);
}
