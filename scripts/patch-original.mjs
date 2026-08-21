import fs from 'node:fs';

const indexTsPath = 'upstream/src/index.ts';
const htmlPath = 'upstream/index.html';

let ts = fs.readFileSync(indexTsPath, 'utf8');

ts = ts.replace("import { AdService } from './adService';\n", '');

const start = ts.indexOf("const isLocalhost =");
if (start !== -1) {
  const adsBlock = ts.indexOf("(window as any).ads = {", start);
  if (adsBlock !== -1) {
    let depth = 0;
    let end = adsBlock;
    let seenBrace = false;
    for (let i = adsBlock; i < ts.length; i++) {
      const c = ts[i];
      if (c === '{') { depth++; seenBrace = true; }
      if (c === '}') {
        depth--;
        if (seenBrace && depth === 0) {
          end = ts.indexOf(';', i);
          if (end === -1) end = i;
          break;
        }
      }
    }
    const replacement = `(window as any).roulette = roulette;\n(window as any).options = options;\n\n(window as any).ads = {\n  beginRound(onStart: () => void) {\n    roulette.startRecording().then(onStart);\n  },\n  showResult() {},\n};`;
    ts = ts.slice(0, start) + replacement + ts.slice(end + 1);
  }
}

fs.writeFileSync(indexTsPath, ts);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\s*<script\s+async\s+src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js[^>]*><\/script>/gi, '');
html = html.replace(/\s*<script\s+defer\s+src=["']https:\/\/umami\.lazygyu\.net\/script\.js["'][\s\S]*?<\/script>/gi, '');

const muteScript = `\n<script>\n(() => {\n  const mute = (el) => { try { el.muted = true; el.volume = 0; } catch (_) {} };\n  const NativeAudio = window.Audio;\n  if (NativeAudio) {\n    window.Audio = function(...args) { const el = new NativeAudio(...args); mute(el); return el; };\n    window.Audio.prototype = NativeAudio.prototype;\n  }\n  const mediaPlay = HTMLMediaElement.prototype.play;\n  HTMLMediaElement.prototype.play = function(...args) { mute(this); return mediaPlay.apply(this, args); };\n  const observer = new MutationObserver(() => document.querySelectorAll('audio,video').forEach(mute));\n  window.addEventListener('DOMContentLoaded', () => {\n    document.querySelectorAll('audio,video').forEach(mute);\n    observer.observe(document.documentElement, { childList: true, subtree: true });\n  });\n})();\n<\/script>`;
html = html.replace('</head>', muteScript + '\n</head>');
fs.writeFileSync(htmlPath, html);
console.log('Original UI/maps/physics preserved. Ads removed. Audio muted.');
