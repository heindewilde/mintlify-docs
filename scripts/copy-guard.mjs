/**
 * The claims these docs must never make, and the one they must always make.
 *
 * Ported from the app repo (heindewilde/yungle: apps/web/lib/blog.test.ts and
 * lib/marketing/copy-guard.ts), where the same rules guard the blog and the
 * marketing pages. Run in CI on every push: `node scripts/copy-guard.mjs`.
 *
 * - The default product is per-file envelope encryption with server-held keys,
 *   which is what makes previews and virus scanning possible. Calling it
 *   "end-to-end" is wrong. Opt-in E2E transfers and the vault may be discussed.
 * - There is no SLA: one server, no failover. No uptime figure, ever. (The
 *   overview's "no SLA" disclaimer was removed by decision, 2026-10-13.)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const FORBIDDEN = [
  [/\b(?:yungle|we|our service|your files?|every file|all files)\s+(?:is|are|uses?|gets?)\s+end[- ]to[- ]end encrypted/i, 'the default product is not end-to-end encrypted — say "always encrypted"'],
  [/\byungle is zero[- ]knowledge\b/i, 'zero-knowledge is not what the default product is'],
  [/\b99\.\d+%\s*uptime\b/i, 'there is no SLA to back an uptime figure'],
  [/\bwe guarantee\b/i, 'nothing here is guaranteed; say what is actually true'],
  [/\bmilitary[- ]grade\b/i, 'meaningless phrase; name the algorithm'],
];

const REQUIRED = [];

function mdxFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith('.') || name === 'node_modules') return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? mdxFiles(path) : name.endsWith('.mdx') ? [path] : [];
  });
}

// Guard the guard: a pattern that matches nothing enforces nothing.
for (const bad of ['Yungle is end-to-end encrypted by default.', 'Yungle is zero-knowledge.', 'We run at 99.9% uptime.', 'We guarantee delivery.', 'Military-grade encryption.']) {
  if (!FORBIDDEN.some(([p]) => p.test(bad))) throw new Error(`copy guard misses a known-bad sentence: ${bad}`);
}

const problems = [];
for (const file of mdxFiles(ROOT)) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, why] of FORBIDDEN) {
    const hit = text.match(pattern);
    if (hit) problems.push(`${relative(ROOT, file)}: ${why} — found "${hit[0]}"`);
  }
}
for (const [file, pattern, why] of REQUIRED) {
  if (!pattern.test(readFileSync(join(ROOT, file), 'utf8'))) problems.push(`${file}: ${why}`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('copy guard: ok');
