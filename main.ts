// Real-Life Patch Notes: The Comedy Changelog — entry program (draft).
//
// Writes one patch note (1-160 UTF-8 characters, not only whitespace),
// a software changelog entry for a bug in real life / human biology,
// to /output/entry.txt.
//
// Node 22, no dependencies. The line is a fixed constant, so every run
// produces identical bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line: the brain's nightly replay of an old embarrassment, filed
// as a shipped fix in dry release-note register.
const ENTRY =
  "v4.1.0: fixed a bug where the brain replayed your most embarrassing moment from 2009 every time you tried to fall asleep.";

// A real release note opens with a version tag and states a fix, so the
// program refuses to ship a line that does not read as one.
const VERSION_TAG = /^v\d+\.\d+\.\d+:/;
const FIX_PHRASE = "fixed a bug";

function validate(entry: string): void {
  const chars = [...entry];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (entry !== entry.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (entry.includes("  ")) {
    throw new Error("entry must not contain double spaces");
  }
  if (!entry.endsWith(".")) {
    throw new Error("entry must end with a period, like a finished release note");
  }
  if (!VERSION_TAG.test(entry)) {
    throw new Error("entry must open with a version tag like v4.1.0:");
  }
  if (!entry.includes(FIX_PHRASE)) {
    throw new Error(`entry must state a fix ("${FIX_PHRASE}")`);
  }
  // Gate is on characters, but keep bytes in step: a 160-char line of
  // multi-byte text must still be a single short line on disk.
  const bytes = Buffer.from(entry, "utf8");
  if (bytes.length > 640) {
    throw new Error(`entry too long in bytes: ${bytes.length}`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

function main(): void {
  validate(ENTRY);
  const chars = [...ENTRY];
  const bytes = Buffer.from(ENTRY, "utf8");

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, ENTRY, "utf8");

  // Read back and verify byte-for-byte, with no trailing newline added.
  const back = readFileSync(outFile, "utf8");
  if (back !== ENTRY) {
    throw new Error("verification failed: file content differs from entry");
  }
  if (back.endsWith("\n")) {
    throw new Error("verification failed: entry must not end with a newline");
  }
  console.log(`wrote ${outFile}: ${chars.length} chars, ${bytes.length} bytes`);
}

main();
