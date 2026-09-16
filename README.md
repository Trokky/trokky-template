# trokky-template

A [Trokky](https://trokky.dev) project: a site, the Studio and the API, on Cloudflare Workers.

Generated with `npm create trokky@latest`.

## What is in it

| | |
|---|---|
| Content | cloudflare-d1 |
| Uploads | cloudflare-r2 |
| Thumbnails | cloudflare-images |
| Parts | a site, the Studio and the API |
| Starting content | magazine |

## Run it

```
cp .dev.vars.example .dev.vars   # fill both secrets
npm install
npm run build && npm run preview
```

## Deploy

```
npm run build && npm run deploy
```

Wrangler provisions the D1 database and R2 bucket named in `wrangler.jsonc` on first deploy.
`database_id` is intentionally empty: it is bound by name.

## The first minute

Open `/studio`. Nobody owns this instance yet, so the first
screen asks you to **claim** it: pick a username and password, and paste `TROKKY_CLAIM_SECRET`.
Sample content appears a moment later — edit it or delete it.

Without a claim secret the claim is open to whoever reaches the URL first. That is fine for the
minute between deploying and opening the link; it is not fine for an instance left sitting.

## Make it yours

- `src/trokky/schemas.ts` — the content model. The Studio follows it.
- `src/trokky/structure.ts` — the Studio sidebar.
- `src/pages/` and `src/layouts/` — the site.
- `wrangler.jsonc` — the Worker name and its resources.
