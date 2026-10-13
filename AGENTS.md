# Yungle developer docs

The source of https://docs.yungle.co, built by Mintlify from `main`. The product lives in the private
app repo (heindewilde/yungle); the CLI, MCP server and SDKs in heindewilde/yungle-clients.

Install the Mintlify skill before editing: `npx skills add https://mintlify.com/docs`. Check every change
with `node scripts/copy-guard.mjs`, `mint validate` and `node scripts/links.mjs` (CI runs all three).

## Never edit `snippets/generated/` or `openapi.json`

The CLI commands, MCP tools, error codes and plan numbers are rendered from the app's code by
`apps/web/scripts/gen-mintlify-snippets.mts` in heindewilde/yungle. `openapi.json` (the API reference
tab) is the spec production serves at https://yungle.co/api/v1/openapi.json, built from the API's Zod
schemas. That repo's `docs-sync` workflow pushes both here, hourly, from the revision production runs,
so they always describe what is live; a hand edit is overwritten by the next sync. Fix them in the app.

The written pages are not synced. A weekly Claude routine reads what changed in the app and the clients
and opens a pull request here with page edits and a changelog entry; a human merges it.

## What the docs may and may not say

- **Never call the default product end-to-end encrypted or zero-knowledge.** It is per-file envelope
  encryption with keys Yungle holds, which is what makes previews and virus scanning possible. Say
  "always encrypted". Opt-in end-to-end transfers and the vault may be called end-to-end.
- **No uptime figure, no target, no SLA claim.** One server, no failover. The "no SLA" disclaimer was
  removed on purpose (2026-10-13, YUN-8): don't add it back, and don't promise uptime either.
- **Unbuilt features are written in the future tense.**
- **The MCP server never deletes, revokes or invites**, and emails someone only when the user allowed
  it and confirms each send. Nothing here may suggest otherwise.
- Plain words, second person, no marketing adjectives.

## URLs

Pages keep the slugs they had at `yungle.co/developers/<slug>`, which now 308-redirects here, with
one exception: the MCP page is `/mcp-server`, because Mintlify serves its own docs MCP server at
`/mcp` and that path cannot be a page (yungle.co redirects `/developers/mcp` there explicitly). Renaming
a page breaks those links and every API error body's `docs` link (`/errors#<code>`). If you must
rename one, add a redirect in `docs.json`.
