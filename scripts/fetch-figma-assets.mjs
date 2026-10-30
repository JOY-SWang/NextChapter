#!/usr/bin/env node
/**
 * Downloads the photos used in the Figma file into public/images/<name>.jpg
 * so the prototype shows the real images instead of on-palette placeholders.
 *
 * Usage:
 *   FIGMA_TOKEN=<your personal access token> npm run fetch:assets
 *
 * Create a token in Figma → Settings → Security → Personal access tokens
 * (scope: "File content: read-only"). The token is only sent to api.figma.com.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'LUxFUBSSOTlHjLod5a5L3x';
const TOKEN = process.env.FIGMA_TOKEN;
const SCALE = Number(process.env.FIGMA_SCALE ?? 2);

/** Photo slot name (see src/components/Photo.tsx) → Figma node id on "Page 4 Job Transition". */
const ASSETS = {
  'hero-welcome': '2458:2622', //        P1 hero photo
  sarah: '2445:2360', //                 Sarah's avatar (top bar / drawer)
  elena: '2432:12008', //                Elena Rostova, human guide (P7)
  'peer-1': '2432:11944', //             peer circle avatars (P7)
  'peer-2': '2432:11946',
  'peer-3': '2432:11948',
  'path-yoga': '2430:11337', //          P4 possibility cards
  'path-mentor': '2430:11345',
  'path-facilitator': '2430:11389',
  'class-beginner': '2432:14161', //     P4.2 recommendation cards
  'course-ytt': '2432:14189',
  'studio-helper': '2432:14217',
  'connect-instructors': '2432:14245',
  'yoga-space': '2432:11861', //         P6 "Action dissolves hesitation"
  reflection: '2432:12937', //           Me page reflection note
};

if (!TOKEN) {
  console.error('Missing FIGMA_TOKEN. Run:  FIGMA_TOKEN=xxxx npm run fetch:assets');
  process.exit(1);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
await mkdir(outDir, { recursive: true });

const ids = Object.values(ASSETS).join(',');
const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=jpg&scale=${SCALE}`;
const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } });
if (!res.ok) {
  console.error(`Figma API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { images, err } = await res.json();
if (err) {
  console.error('Figma API error:', err);
  process.exit(1);
}

let ok = 0;
for (const [name, id] of Object.entries(ASSETS)) {
  const src = images?.[id];
  if (!src) {
    console.warn(`  ✗ ${name} (${id}) — no render returned`);
    continue;
  }
  const img = await fetch(src);
  if (!img.ok) {
    console.warn(`  ✗ ${name} — download failed (${img.status})`);
    continue;
  }
  await writeFile(join(outDir, `${name}.jpg`), Buffer.from(await img.arrayBuffer()));
  console.log(`  ✓ ${name}.jpg`);
  ok += 1;
}
console.log(`\nSaved ${ok}/${Object.keys(ASSETS).length} images to public/images/. Restart the dev server if it is running.`);
