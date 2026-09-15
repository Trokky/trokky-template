# Trokky magazine template

A complete site on [Trokky](https://trokky.dev) — Astro frontend, Trokky API, and Studio — that
deploys to your own Cloudflare account in one click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Trokky/trokky-template)

## What you get

One Worker serving three things:

| path | what |
|---|---|
| `/` | the magazine, rendered on request — edit in Studio, refresh, it's live |
| `/studio` | the Studio, where content is written |
| `/api` | the Trokky API |

Cloudflare provisions a **D1** database for content, an **R2** bucket for uploads, and the
**Images** binding for thumbnails — all on your account. The deploy button clones this repo into
your GitHub or GitLab, so every push redeploys.

## The first minute

1. Click the button. It asks for two secrets — **generate them, don't invent them**:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Open `https://<your-worker>.workers.dev/studio`. Nobody owns the instance yet, so the first
   screen asks you to **claim** it: pick a username and password, paste the claim secret.
3. You are signed in, and the magazine has sample content to edit or delete.

Without a claim secret the claim is open to whoever reaches the URL first — fine for the minute
between deploying and opening the link, not for an instance left sitting.

## Local

```
cp .dev.vars.example .dev.vars   # fill both secrets
npm install
npm run build && npm run preview  # wrangler dev, with local D1/R2/Images
```

## Notes

- `database_id` in `wrangler.jsonc` is **empty on purpose**. Wrangler and the deploy button
  provision a D1 database with that name on first deploy and bind it. Putting an id there would
  point every copy of this template at one database.
- The Astro adapter adds a `SESSION` KV namespace for its session store. The template does not
  use sessions; it is harmless and free-tier, and provisioned the same way.

## Make it yours

- `src/trokky/schemas.ts` — the content model. The Studio follows it.
- `src/trokky/structure.ts` — the Studio sidebar.
- `src/pages/` and `src/layouts/` — the site.
- `wrangler.jsonc` — the Worker's name and resources.
