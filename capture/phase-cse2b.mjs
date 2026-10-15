// STAFF — screening, second half: comparison, agent, decision, confirm dialog, email.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, onlySet } from './helpers.mjs';
const CH = 'KYC and screening';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const below = (getLoc, offset = 140) => async (page) => {
  const loc = getLoc(); await loc.first().evaluate((el, o) => { const y = el.getBoundingClientRect().top + window.scrollY - o; window.scrollTo(0, y); }, offset);
  await page.waitForTimeout(800);
};
try {
  await cap.as('cse', SITES.staff);
  await P().getByText('Hartley-Vance family', { exact: true }).first().click(); await settle(P(), 3500);
  await P().getByText('Review match', { exact: true }).first().click(); await settle(P(), 3500);
  await cap.step({ id: 305, chapter: CH, title: 'Identifier comparison', body: '', action: 'none', target: () => P().getByText('Identifier comparison', { exact: false }).first(),
    before: below(() => P().getByText('Identifier comparison', { exact: false }), 160) });
  await cap.step({ id: 306, chapter: CH, title: 'Agent recommendation', body: '', action: 'none', target: () => P().getByText(/SCREENING AGENT/).first(),
    before: below(() => P().getByText(/SCREENING AGENT/), 160) });
  await cap.step({ id: 307, chapter: CH, title: 'Decide', body: '', action: 'click', target: () => P().getByText('Not the same person (false positive)', { exact: true }),
    before: below(() => P().getByText('Your decision', { exact: true }), 170) });
  await cap.step({ id: 308, chapter: CH, title: 'Reasoning', body: '', action: 'type',
    text: 'Name and year of birth match, but the address history (London since 2009 vs Edinburgh) and directorships do not overlap. Not the same person.',
    target: () => P().getByLabel('Reasoning for the file'), before: below(() => P().getByText('Your decision', { exact: true }), 170),
    after: async (page) => { await page.keyboard.press('Tab'); await page.waitForTimeout(800); } });
  await cap.step({ id: 309, chapter: CH, title: 'Confirm compared', body: '', action: 'click', target: () => P().getByText('I have compared every identifier above with what we hold', { exact: true }),
    before: below(() => P().getByText('Your decision', { exact: true }), 170) });
  await cap.step({ id: 310, chapter: CH, title: 'Confirm decision', body: '', action: 'click', target: () => P().getByRole('button', { name: 'CONFIRM DECISION' }),
    before: below(() => P().getByText('Your decision', { exact: true }), 170) });
  await cap.step({ id: 311, chapter: CH, title: 'Confirm dialog', body: '', action: 'click', target: () => P().getByRole('button', { name: 'Confirm', exact: true }), slow: true, slowMs: 6000 });
  await cap.step({ id: 312, chapter: CH, title: 'Second approval email', body: '', action: 'none', target: () => P().getByText('Head of Compliance', { exact: false }).first(),
    before: below(() => P().getByText('Head of Compliance', { exact: false }), 260) });
  await cap.step({ id: 313, chapter: CH, title: 'Cleared', body: '', action: 'none', target: null, before: top });
} finally {
  cap.save('cse2'); await cap.close(); process.exit(0);
}
