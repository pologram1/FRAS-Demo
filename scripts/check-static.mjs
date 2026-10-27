/** Validate the self-contained prototype without running browser code or using real data. */
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(page, /<!doctype html>/i, 'Missing HTML document declaration');
assert.match(page, /<title>[^<]+<\/title>/i, 'Missing document title');
assert.match(page, /<html[^>]+lang=/i, 'Missing document language');
assert.match(page, /name=["']viewport["']/i, 'Missing responsive viewport');

// Compile inline and local classic scripts; do not execute application actions.
const scripts = [...page.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
let compiled = 0;
for (const [whole, attributes, code] of scripts) {
  if (/\btype\s*=\s*["'](?:module|application\/)/i.test(attributes)) continue;
  const source = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (source) {
    assert.ok(!/^(?:https?:|\/\/)/i.test(source), 'Prototype scripts must resolve locally');
    const path = new URL('../' + source, import.meta.url);
    assert.ok(existsSync(path), `Missing script: ${source}`);
    new Script(readFileSync(path, 'utf8'), { filename: source });
    compiled++;
    continue;
  }
  if (!code.trim()) continue;
  new Script(code, { filename: `index.html:inline-script-${++compiled}` });
}
for (const [whole, path] of page.matchAll(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi)) {
  assert.ok(existsSync(new URL('../' + path, import.meta.url)), `Missing stylesheet: ${path}`);
}
assert.ok(compiled > 0, 'No executable prototype script found');
console.log(`Static entry checks passed; ${compiled} script(s) compile. No browser workflow or recognition accuracy is asserted.`);
