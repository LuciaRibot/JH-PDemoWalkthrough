// Merge the captured phases into one ordered steps.final.json, with the copy.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const STATE = path.join(ROOT, 'capture', 'state');
const byId = new Map();
for (const f of ['client', 'client-ai', 'cse1', 'cse2', 'cse3', 'pm']) {
  const fp = path.join(STATE, `steps-${f}.json`);
  if (fs.existsSync(fp)) for (const s of JSON.parse(fs.readFileSync(fp, 'utf8'))) byId.set(s.id, s);
}
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'capture', 'copy.json'), 'utf8'));
const ORDER = C.order;           // [id, ...] in playback order
const steps = [];
for (const id of ORDER) {
  const s = byId.get(id); const c = C.copy[String(id)];
  if (!s) { console.log(`  missing capture ${id}`); continue; }
  if (!c) { console.log(`  missing copy ${id}`); continue; }
  steps.push({
    n: steps.length + 1, chapter: c.chapter || s.chapter, title: c.title, body: c.body, say: null,  // client-facing build: no presenter lines
    persona: c.persona || s.persona, action: c.action || s.action, shot: s.shot,
    target: c.noTarget ? null : s.target,
  });
}
const chapters = [];
for (const s of steps) {
  let ch = chapters.find((c) => c.name === s.chapter);
  if (!ch) chapters.push(ch = { name: s.chapter, from: s.n, count: 0 });
  ch.count++;
}
const out = { title: C.title, subtitle: C.subtitle, captured: new Date().toISOString().slice(0, 10), chapters, steps };
fs.writeFileSync(path.join(STATE, 'steps.final.json'), JSON.stringify(out, null, 2));
console.log(`${steps.length} steps across ${chapters.length} chapters`);
for (const c of chapters) console.log(`  ${String(c.count).padStart(2)}  ${c.name}`);
