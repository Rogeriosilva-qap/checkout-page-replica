// Renderiza projeto/index.html quadro a quadro (Chromium/Playwright) e codifica com ffmpeg.
// Uso:
//   node tools/render.mjs                    → saida/metodo-bussola[-PREVIA].mp4
//   node tools/render.mjs --stills 1,12.5    → saida/stills/t-1.00.png ...
//   node tools/render.mjs --workers 4
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'projeto/timeline.json'), 'utf8'));
const FPS = TL.fps || 30;
const URL = 'file://' + path.join(ROOT, 'projeto/index.html') + '?render';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(URL);
  await page.evaluate(() => window.READY);
  await page.waitForTimeout(150);
  return page;
}

const browser = await chromium.launch();

const stills = opt('--stills');
if (stills) {
  const dir = path.join(ROOT, 'saida/stills'); fs.mkdirSync(dir, { recursive: true });
  const page = await openPage(browser);
  for (const s of stills.split(',')) {
    const t = parseFloat(s);
    await page.evaluate(t => window.renderAt(t), t);
    const f = path.join(dir, `t-${t.toFixed(2).padStart(5, '0')}.png`);
    await page.screenshot({ path: f });
    console.log(f);
  }
  await browser.close();
  process.exit(0);
}

const N = Math.round(TL.duracao * FPS);
const W = parseInt(opt('--workers') || String(Math.max(1, Math.min(4, os.cpus().length))));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bussola-frames-'));
console.log(`renderizando ${N} quadros (${TL.duracao}s @ ${FPS}fps) com ${W} páginas → ${tmp}`);
let next = 0, done = 0; const t0 = Date.now();
await Promise.all(Array.from({ length: W }, async () => {
  const page = await openPage(browser);
  while (true) {
    const i = next++; if (i >= N) break;
    await page.evaluate(t => window.renderAt(t), i / FPS);
    await page.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 });
    if (++done % 150 === 0) console.log(`  ${done}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await page.close();
}));
await browser.close();

const audio = TL.audio ? path.join(ROOT, TL.audio) : null;
const outName = TL.modo === 'audio' ? 'metodo-bussola.mp4' : 'metodo-bussola-PREVIA.mp4';
const out = path.join(ROOT, 'saida', outName);
const ff = ['-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg')];
if (audio) ff.push('-i', audio); else ff.push('-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo');
ff.push('-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-r', String(FPS), '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(TL.duracao), '-movflags', '+faststart', out);
await new Promise((res, rej) => {
  const p = spawn('ffmpeg', ff, { stdio: ['ignore', 'ignore', 'inherit'] });
  p.on('exit', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c)));
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log('ok →', out);
