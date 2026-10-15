// Small helpers shared by the JH&P capture phases.
export const into = (getLoc, block = 'center') => async (page) => {
  const loc = typeof getLoc === 'function' ? getLoc(page) : getLoc;
  try { await loc.first().scrollIntoViewIfNeeded({ timeout: 8000 }); } catch {}
  await page.evaluate(([b]) => {}, [block]);
  try {
    await loc.first().evaluate((el, b) => el.scrollIntoView({ block: b }), block);
  } catch {}
  await page.waitForTimeout(700);
};
export const top = async (page) => { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600); };
export const waitText = async (page, re, maxMs = 180000, every = 3000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    const txt = await page.evaluate(() => document.body.innerText);
    if (re.test(txt)) return true;
    await page.waitForTimeout(every);
  }
  return false;
};
export const onlySet = () => (process.env.ONLY ? new Set(process.env.ONLY.split(',').map(Number)) : null);
