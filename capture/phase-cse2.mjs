// STAFF — screening: provider check, the screening agent's recommendation, the decision.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, waitText, onlySet } from './helpers.mjs';
const CH = 'KYC and screening';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
try {
  await cap.as('cse', SITES.staff);
  await P().getByText('Hartley-Vance family', { exact: true }).first().click(); await settle(P(), 3500);
  await cap.step({ id: 300, chapter: CH, title: 'Review match', body: '', action: 'click', target: () => P().getByText('Review match', { exact: true }).first(), before: top, slow: true, slowMs: 3500 });
  console.log('\n   page has RUN:', await P().getByRole('button', { name: 'RUN SCREENING CHECK' }).count());
  await cap.step({ id: 301, chapter: CH, title: 'Screening check', body: '', action: 'none', target: null, before: top, settle: 2000 });
  await cap.step({ id: 302, chapter: CH, title: 'Run screening check', body: '', action: 'click', target: () => P().getByRole('button', { name: 'RUN SCREENING CHECK' }),
    before: into(() => P().getByRole('button', { name: 'RUN SCREENING CHECK' })), slow: true, slowMs: 5000 });
  await cap.step({ id: 303, chapter: CH, title: 'Agent reviewing', body: '', action: 'none', target: null, before: top });
  // wait for the agent's recommendation, nudging with "Check now"
  for (let i = 0; i < 30; i++) {
    const txt = await P().evaluate(() => document.body.innerText);
    if (/recommends|RECOMMENDS|Recommendation/.test(txt) && !/reviewing the match/i.test(txt)) break;
    const cn = P().getByText('Check now', { exact: true });
    if (await cn.count()) await cn.first().click().catch(() => {});
    await P().waitForTimeout(5000);
  }
  await settle(P(), 2500);
  await cap.step({ id: 304, chapter: CH, title: 'Provider result', body: '', action: 'none', target: null, before: top });
  await cap.step({ id: 305, chapter: CH, title: 'Identifier comparison', body: '', action: 'none', target: () => P().getByText('Identifier comparison', { exact: false }).first(),
    before: into(() => P().getByText('Identifier comparison', { exact: false }).first(), 'start') });
  await cap.step({ id: 306, chapter: CH, title: 'Agent recommendation', body: '', action: 'none', target: () => P().getByText(/SCREENING AGENT/i).first(),
    before: into(() => P().getByText(/SCREENING AGENT/i).first(), 'start') });
  const radio = () => P().getByText('Not the same person (false positive)', { exact: true });
  await cap.step({ id: 307, chapter: CH, title: 'Decide', body: '', action: 'click', target: radio, before: into(() => P().getByText('Your decision', { exact: true }), 'start') });
  await cap.step({ id: 308, chapter: CH, title: 'Reasoning', body: '', action: 'type',
    text: 'Name and year of birth match, but the address history (London since 2009 vs Edinburgh) and directorships do not overlap. Not the same person.',
    target: () => P().getByLabel('Reasoning for the file'), before: into(() => P().getByText('Your decision', { exact: true }), 'start'),
    after: async (page) => { await page.keyboard.press('Tab'); await page.waitForTimeout(800); } });
  await cap.step({ id: 309, chapter: CH, title: 'Confirm compared', body: '', action: 'click', target: () => P().getByText('I have compared every identifier above with what we hold', { exact: true }),
    before: into(() => P().getByRole('button', { name: 'CONFIRM DECISION' })) });
  await cap.step({ id: 310, chapter: CH, title: 'Confirm decision', body: '', action: 'click', target: () => P().getByRole('button', { name: 'CONFIRM DECISION' }),
    before: into(() => P().getByRole('button', { name: 'CONFIRM DECISION' })), slow: true, slowMs: 6000 });
  await cap.step({ id: 311, chapter: CH, title: 'Second approval email', body: '', action: 'none', target: () => P().getByText('Head of Compliance', { exact: false }).first(),
    before: into(() => P().getByText('Head of Compliance', { exact: false }).first()) });
  await cap.step({ id: 312, chapter: CH, title: 'Cleared', body: '', action: 'none', target: null, before: top });
} finally {
  cap.save('cse2'); await cap.close(); process.exit(0);
}
