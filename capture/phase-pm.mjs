// PORTFOLIO MANAGER — approval on the JH&P Portfolio site; then the client sees the result,
// and the MI, configuration and case-start screens.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, waitText, onlySet } from './helpers.mjs';
const PM = 'Portfolio manager approval';
const CL = 'Accounts opened';
const MI = 'Reporting and configuration';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const btn = (n) => () => P().getByRole('button', { name: new RegExp('^' + n + '$', 'i') });
const below = (getLoc, offset = 160) => async (page) => {
  await getLoc().first().evaluate((el, o) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o), offset); await page.waitForTimeout(800);
};
try {
  await cap.as('pm', SITES.portfolio);
  await cap.step({ id: 500, chapter: PM, title: 'Pipeline', body: '', action: 'click', target: () => P().getByText('Hartley-Vance family', { exact: true }).first(), before: top, settle: 3000, slow: true, slowMs: 4000 });
  await cap.step({ id: 501, chapter: PM, title: 'Approval', body: '', action: 'none', target: null, before: top, settle: 2500 });
  await cap.step({ id: 502, chapter: PM, title: 'Checks', body: '', action: 'none', target: () => P().getByText('CHECKS BEFORE APPROVAL', { exact: false }).first(),
    before: below(() => P().getByText('CHECKS BEFORE APPROVAL', { exact: false }), 60) });
  await cap.step({ id: 503, chapter: PM, title: 'Approval note', body: '', action: 'type', text: 'Approved. Suitability confirmed at our meeting on 2 September.',
    target: () => P().getByLabel('Note for the file'), before: into(btn('APPROVE AND OPEN ACCOUNTS')), after: async (page) => { await page.keyboard.press('Tab'); await page.waitForTimeout(700); } });
  await cap.step({ id: 504, chapter: PM, title: 'Approve', body: '', action: 'click', target: btn('APPROVE AND OPEN ACCOUNTS'), before: into(btn('APPROVE AND OPEN ACCOUNTS')), slow: true, slowMs: 8000 });
  await cap.step({ id: 505, chapter: PM, title: 'Approved', body: '', action: 'none', target: null, before: top, settle: 2500 });

  await cap.as('rebecca', SITES.portal);
  await cap.step({ id: 600, chapter: CL, title: 'Client sees accounts opened', body: '', action: 'none', target: null, before: top, settle: 3000 });

  await cap.as('cse', SITES.reports);
  await cap.step({ id: 700, chapter: MI, title: 'Reports', body: '', action: 'none', target: null, before: top, settle: 4000 });
  await cap.step({ id: 701, chapter: MI, title: 'Reports lower', body: '', action: 'none', target: null, before: async (page) => { await page.evaluate(() => window.scrollTo(0, 760)); await page.waitForTimeout(900); } });
  await cap.goto(SITES.settings, 3500);
  await cap.step({ id: 702, chapter: MI, title: 'Settings', body: '', action: 'none', target: null, before: top });
} finally {
  cap.save('pm'); await cap.close(); process.exit(0);
}
