# Cloud job store — Cloudflare Worker + D1

This gives the H&S plan tool a shared **job library** that syncs across devices.
Jobs are stored in a Cloudflare **D1** database and served by a small **Worker**
API. Your data stays in your own Cloudflare account (private).

## What you deploy (one-time)

You'll need the [Cloudflare CLI `wrangler`](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
(`npm install -g wrangler`) and to be logged in (`wrangler login`).

From this `cloud/` folder:

```bash
# 1. Create the D1 database
wrangler d1 create mostlane_hs
#    -> copy the printed database_id into wrangler.toml (database_id = "...")

# 2. Create the table
wrangler d1 execute mostlane_hs --remote --file=./schema.sql

# 3. Set the access token (make up a long random string; you'll paste the
#    same value into the app). You'll be prompted for the value.
wrangler secret put APP_TOKEN

# 4. Deploy the Worker
wrangler deploy
```

`wrangler deploy` prints your Worker URL, e.g.
`https://mostlane-hs-jobs.<your-subdomain>.workers.dev`.

> Prefer the dashboard? You can also create the D1 database and a Worker in the
> Cloudflare dashboard, paste in `worker.js`, bind the database as `DB`, run the
> SQL from `schema.sql`, and add an `APP_TOKEN` variable (encrypted).

## Connect the app

1. Open the tool, go to the **library** screen, click **Cloud settings**.
2. Paste the **Worker URL** and the **APP_TOKEN** you chose.
3. Save. Your jobs now load from, and save to, D1 — on any device where you
   enter the same Worker URL + token.

## Notes
- The token is the only thing protecting the API, so keep it private and make
  it long/random. To rotate it: `wrangler secret put APP_TOKEN` again and update
  the app on each device.
- CORS is open (`*`) so the Pages site can call it. To lock it to your site,
  replace `Access-Control-Allow-Origin: *` in `worker.js` with
  `https://mostlane.github.io`.
- API shape: `GET /jobs`, `GET /jobs/:id`, `PUT /jobs/:id`, `DELETE /jobs/:id`.
