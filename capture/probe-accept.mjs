import { chromium } from 'playwright';
const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
const pages = b.contexts()[0].pages();
console.log(pages.map(x => x.url()).join('\n'));
const p = pages.filter(x => /task\//.test(x.url())).pop();
if (p) {
  const info = await p.evaluate(() => [...document.querySelectorAll('button')].filter(e => /accept/i.test(e.innerText + e.getAttribute('aria-label'))).map(e => JSON.stringify({t: e.innerText, a: e.getAttribute('aria-label'), r: e.getBoundingClientRect().toJSON()})));
  console.log(info.join('\n'));
  console.log('frames', p.frames().length);
  console.log('role count', await p.getByRole('button', { name: /^ACCEPT/ }).count(), await p.getByRole('button', { name: /accept/i }).count());
}
process.exit(0);
