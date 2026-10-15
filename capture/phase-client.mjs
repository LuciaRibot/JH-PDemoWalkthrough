// CLIENT — Rebecca completes her application on the JH&P Portal.
import { Capture, SITES, settle, settleSlow } from './engine.mjs';
import { into, top, waitText, onlySet } from './helpers.mjs';
const CH = 'The client application';
const cap = new Capture({ only: onlySet() });
await cap.open();
const P = () => cap.page;
const btn = (name) => () => P().getByRole('button', { name, exact: true });
const wand = () => P().getByText('Fill demo data', { exact: false });
let id = 100;
try {
  await cap.as('rebecca', SITES.portal);
  await cap.step({ id: id++, chapter: CH, title: 'Portal home', body: '', action: 'none', target: () => P().getByText('Welcome', { exact: false }), before: top, settle: 2500 });
  await cap.step({ id: id++, chapter: CH, title: 'Continue application', body: '', action: 'click', target: btn('CONTINUE APPLICATION'), before: into(btn('CONTINUE APPLICATION')), slow: true });
  for (let i = 0; i < 12; i++) {
    const heading = await P().evaluate(() => (document.querySelector('main h1, main h2, h1, h2')?.innerText || '').trim());
    console.log(`\n   step heading: ${heading}`);
    if (await wand().count()) {
      await cap.step({ id: id++, chapter: CH, title: `Step ${i + 1}: ${heading}`, body: '', action: 'click', target: wand, before: top, slow: true, slowMs: 3500 });
    }
    if (await P().getByRole('button', { name: 'Go to signing', exact: true }).count()) {
      await cap.step({ id: id++, chapter: CH, title: 'Documents filled', body: '', action: 'none', target: () => P().getByText('Received', { exact: false }), before: top });
      await cap.step({ id: id++, chapter: CH, title: 'Go to signing', body: '', action: 'click', target: btn('Go to signing'), before: into(btn('Go to signing')), slow: true, slowMs: 7000 });
      break;
    }
    await cap.step({ id: id++, chapter: CH, title: `Step ${i + 1} filled: ${heading}`, body: '', action: 'click', target: btn('Continue'), before: into(btn('Continue')), slow: true, slowMs: 3500 });
  }
  await cap.step({ id: id++, chapter: CH, title: 'Signing', body: '', action: 'none', target: null, before: top, settle: 2500 });
  await cap.step({ id: id++, chapter: CH, title: 'Sign and submit', body: '', action: 'click', target: btn('SIGN AND SUBMIT'), before: into(btn('SIGN AND SUBMIT')), slow: true, slowMs: 7000 });
  await cap.step({ id: id++, chapter: CH, title: 'Submitted', body: '', action: 'none', target: null, before: top, settle: 3000 });
} finally {
  cap.save('client'); await cap.close(); process.exit(0);
}
