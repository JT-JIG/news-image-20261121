// news-image-20261121 — entry runner.
//
// Takes entry.png from beside this file, checks it is a genuine PNG or
// JPEG no bigger than 1 MiB, then places a copy where the grader looks:
// /output/entry.png, or $MAKEFUN_OUTPUT_DIR/entry.png when that variable
// is set. Anything else fails loudly with a plain error message.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_MAGIC = [0xff, 0xd8, 0xff];

function sniffFormat(head: Uint8Array): "PNG" | "JPEG" {
  const matches = (magic: number[]) =>
    magic.every((byte, i) => head[i] === byte);
  if (matches(PNG_MAGIC)) return "PNG";
  if (matches(JPEG_MAGIC)) return "JPEG";
  const seen = [...head.subarray(0, 8)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
  throw new Error(`entry.png is neither PNG nor JPEG (first bytes: ${seen})`);
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, "entry.png");

  let info;
  try {
    info = statSync(source);
  } catch {
    throw new Error(`entry.png not found beside main.ts (${source})`);
  }
  if (info.size > MAX_BYTES) {
    throw new Error(
      `entry.png is ${info.size} bytes, over the 1 MiB (${MAX_BYTES} byte) limit`,
    );
  }

  const format = sniffFormat(readFileSync(source).subarray(0, 8));

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, "entry.png");
  copyFileSync(source, dest);

  // Make sure the copy actually landed intact before claiming success.
  const copied = statSync(dest);
  if (copied.size !== info.size) {
    throw new Error(
      `copy failed: ${dest} is ${copied.size} bytes, expected ${info.size}`,
    );
  }

  console.log(
    `Wrote ${dest} — ${format} image, ${info.size} bytes, copy verified`,
  );
}

try {
  main();
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
}
