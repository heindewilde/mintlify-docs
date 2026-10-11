/**
 * `mint broken-links --check-anchors`, minus one known blind spot.
 *
 * The error codes table comes from a snippet (snippets/generated/error-codes.mdx)
 * whose rows carry the ids every API error links to (`/errors#<code>`). The page
 * renders them, but Mint's checker does not look inside snippets, so it reports
 * every such link as broken. This accepts exactly those links whose code is an id
 * in the generated table, and fails on anything else, including a link to a code
 * that does not exist.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const ids = new Set([...readFileSync(`${ROOT}snippets/generated/error-codes.mdx`, 'utf8').matchAll(/<tr id="([a-z0-9_]+)">/g)].map((m) => m[1]));
if (ids.size === 0) throw new Error('no error-code anchors found in the generated snippet');

let out = '';
try {
  out = execFileSync('mint', ['broken-links', '--check-anchors'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (err) {
  out = `${err.stdout ?? ''}${err.stderr ?? ''}`;
}
const lines = out.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').split(/[\r\n]+/).map((l) => l.trim());
const links = lines.filter((l) => l.startsWith('⎿')).map((l) => l.replace(/^⎿\s*/, ''));
const broken = links.filter((href) => {
  const m = href.match(/^\/errors#([a-z0-9_]+)$/);
  return !(m && ids.has(m[1]));
});

if (broken.length > 0) {
  console.error(`broken links:\n${[...new Set(broken)].map((b) => `  ${b}`).join('\n')}`);
  process.exit(1);
}
if (links.length === 0 && !/no broken links/.test(out)) {
  console.error(out);
  throw new Error('could not read mint broken-links output');
}
console.log(`links: ok (${links.length} error-code anchors accepted from the generated table)`);
