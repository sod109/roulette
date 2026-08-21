import fs from 'node:fs';

const indexTsPath = 'upstream/src/index.ts';
const htmlPath = 'upstream/index.html';

let ts = fs.readFileSync(indexTsPath, 'utf8');

// Remove AdService import and all ad bootstrap/window.ads code.
// Keep original Roulette/UI/physics code untouched.
ts = ts.replace(/import\s+\{\s*AdService\s*\}\s+from\s+['"]\.\/adService['"];\s*/g, '');

const start = ts.indexOf("const isLocalhost =");
const endMarker = "(window as any).ads =";
if (start !== -1) {
  const adsStart = ts.indexOf(endMarker, start);
  if (adsStart !== -1) {
    // Keep window.roulette/window.options assignments, replace the whole ad setup with just those.
    const tailEnd = ts.indexOf("\n};", adsStart);
    if (tailEnd !== -1) {
      const before = ts.slice(0, start);
      const after = ts.slice(tailEnd + 4);
      ts = before +
`(window as any).roulette = roulette;
(window as any).options = options;
` + after;
    }
  }
}

fs.writeFileSync(indexTsPath, ts);

let html = fs.readFileSync(htmlPath, 'utf8');

// Remove Umami analytics script.
html = html.replace(
  /\s*<script\s+defer\s+src=["']https:\/\/umami\.lazygyu\.net\/script\.js["'][\s\S]*?<\/script>/gi,
  ''
);

// Remove analytics tracking blocks.
html = html.replace(
  /\s*if\s*\(typeof\s+umami\s*!==\s*['"]undefined['"]\)\s*\{[\s\S]*?\n\s*\}/g,
  ''
);

// Start immediately instead of going through window.ads.
html = html.replace(
  /if\s*\(window\.ads\)\s*\{\s*window\.ads\.beginRound\(\(\)\s*=>\s*window\.roulette\.start\(\)\);\s*\}\s*else\s*\{\s*window\.roulette\.start\(\);\s*\}/g,
  'window.roulette.start();'
);

// Remove result ad call.
html = html.replace(
  /\s*if\s*\(window\.ads\)\s*window\.ads\.showResult\(\);/g,
  ''
);

fs.writeFileSync(htmlPath, html);

console.log('Ads/analytics removed; original map/UI/physics preserved.');
