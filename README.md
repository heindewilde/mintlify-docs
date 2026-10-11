# Yungle developer docs

Source of [docs.yungle.co](https://docs.yungle.co), built with [Mintlify](https://mintlify.com) from `main`.

```bash
npm i -g mint
mint dev                          # preview at http://localhost:3000
node scripts/copy-guard.mjs       # what the docs may never claim
mint validate && node scripts/links.mjs
```

`snippets/generated/` and `openapi.json` are synced from the Yungle app and must not be edited by hand. See
[AGENTS.md](AGENTS.md) for that and the other rules these docs follow.
