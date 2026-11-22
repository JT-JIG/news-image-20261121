// news-image-20261121 entry: hand the day's image to the gate.
//
// The image is the entry — a 1024x1024 infographic summing up Saturday
// 21 November 2026's world news, drawn from the day's verified reports:
// the Russian barrage on Ukraine and the missiles that landed in Poland
// (with NATO's Rutte in Warsaw), the Claude-aided Riemann proof passing
// independent Lean checks, the AI stock sell-off, COP31 running past its
// deadline, the capture of 'El Chapo Isidro' in Mexico, Iran's strike on
// Bahrain, and GTA VI's $3.79bn day one.
// This program's only job is to place entry.png into /output where the
// gate reads it. It checks the file first: it must be a PNG or a JPEG
// by its first bytes and at most 1 MiB, or the gate refuses it — so a
// bad file fails here, loudly, instead of silently there.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const MAX_BYTES = 1048576; // 1 MiB, the gate's limit

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const src = join(fileURLToPath(new URL('.', import.meta.url)), 'entry.png');
if (!existsSync(src)) fail('entry.png not found beside main.ts');

const size = statSync(src).size;
if (size > MAX_BYTES) fail(`entry.png is ${size} bytes, over the 1 MiB limit`);

const head = readFileSync(src).subarray(0, 8);
const isPng = head.equals(PNG_MAGIC);
const isJpeg = head.subarray(0, 3).equals(JPEG_MAGIC);
if (!isPng && !isJpeg) fail('entry.png is neither a PNG nor a JPEG by its first bytes');

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, join(OUTPUT_DIR, 'entry.png'));
console.log(`entry image: ${size} bytes, ${isPng ? 'PNG' : 'JPEG'}`);
