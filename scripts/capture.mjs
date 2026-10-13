// Headless Edge capture over the DevTools protocol (no dependencies; Node 22+ has global WebSocket).
// Usage: node scripts/capture.mjs jobs.json   (or inline JSON array)  e.g. '[{"url":"http://127.0.0.1:4321/","w":390,"h":844,"out":"x.png","full":false,"eval":"document.title"}]'
// Each job sets the device metrics, loads the URL, optionally evaluates JS (result printed) and saves a PNG.
// full: true sizes the viewport to the document height first, so the PNG is the whole page at width w.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9333;
const arg = process.argv[2] ?? '[]';
const jobs = JSON.parse(arg.endsWith('.json') ? readFileSync(arg, 'utf8') : arg);
const profile = mkdtempSync(join(tmpdir(), 'capture-'));

const proc = spawn(
  EDGE,
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: 'ignore' },
);

async function targetList() {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch {
      /* browser still starting */
    }
    await sleep(200);
  }
  throw new Error('Edge did not expose a page target');
}

const page = await targetList();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

let nextId = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(String(ev.data));
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) {
    for (const l of listeners) l(msg);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value;
};
const loaded = (timeoutMs = 15000) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, timeoutMs);
    listeners.push((m) => {
      if (m.method === 'Page.loadEventFired') {
        clearTimeout(t);
        resolve();
      }
    });
  });

await send('Page.enable');
await send('Runtime.enable');

for (const job of jobs) {
  const w = job.w ?? 390;
  let h = job.h ?? 844;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
  const done = loaded();
  await send('Page.navigate', { url: job.url });
  await done;
  await sleep(job.wait ?? 1200);
  if (job.eval) console.log(`${job.out ?? job.url} eval:`, JSON.stringify(await evaluate(job.eval)));
  if (job.full) {
    h = (await evaluate('Math.ceil(document.documentElement.scrollHeight)')) ?? h;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
    await sleep(400);
  }
  if (job.out) {
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 }, captureBeyondViewport: true });
    writeFileSync(job.out, Buffer.from(shot.result.data, 'base64'));
    console.log(`saved ${job.out} (${w}x${h})`);
  }
}

ws.close();
proc.kill();
process.exit(0);
