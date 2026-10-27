/** Validate the self-contained prototype without running browser code or using real data. */
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(page, /<!doctype html>/i, 'Missing HTML document declaration');
assert.match(page, /<title>[^<]+<\/title>/i, 'Missing document title');
assert.match(page, /<html[^>]+lang=/i, 'Missing document language');
assert.match(page, /name=["']viewport["']/i, 'Missing responsive viewport');

// Compile each inline classic script, but never execute it in the Node process.
const scripts = [...page.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
let compiled = 0;
for (const [whole, attributes, code] of scripts) {
  if (/\bsrc\s*=|\btype\s*=\s*["'](?:module|application\/)/i.test(attributes)) continue;
  if (!code.trim()) continue;
  new Script(code, { filename: `index.html:inline-script-${++compiled}` });
}
assert.ok(compiled > 0, 'No executable inline prototype script found');
console.log(`Static entry checks passed; ${compiled} inline script(s) compile. No browser workflow or recognition accuracy is asserted.`);
