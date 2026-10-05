# Website Event Logger

Cloudflare Worker + D1 backend for the academic website analytics logger.

It stores page views and interaction events with server-side request metadata:

- IP address from Cloudflare request headers
- timestamp
- event name and target
- visitor ID cookie value
- page URL/path/title
- clicked link URL/text when available
- referrer
- user agent
- Cloudflare country/region/city/colo/ASN/organization metadata when available
- UTM parameters

## Setup

From this `worker` folder:

```powershell
npm install
npx wrangler login
npx wrangler d1 create tejas-website-events
```

Copy the returned `database_id` into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

Then apply the schema and deploy:

```powershell
npx wrangler d1 migrations apply tejas-website-events --remote
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

The deployed Worker URL is:

```text
https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev
```

Put this exact collect endpoint in `script.js`:

```js
const TRACKING_ENDPOINT = "https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev/collect";
```

Then commit and push the website.

## Viewing Logs

The October 5 update is deployed as version
`6a5145cd-a8b2-4305-b119-2a099507153c`. The account remains on Workers Free.

The updated logger supports the personal GitHub Pages origin and, with explicit analytics
consent, the `/tejasramdas/` path on `sites.coecis.cornell.edu`. Other Cornell
sites are rejected. Cornell events use no visitor-ID cookie. The private
`/events` response now includes `page_url` and its derived `site` label
(`personal`, `cornell`, or `unknown` for unrecognized historical records).
`/summary` includes `page_views_by_site`; `analytics_test` events do not count
as page views. Browser page and click tracking on Cornell is configured in
the sibling `website-cornell` directory.

Run focused backend tests with `node --test src/index.test.js` before deployment.

Use your admin token:

```powershell
$token = "YOUR_ADMIN_TOKEN"
Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } `
  -Uri "https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev/summary"

Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } `
  -Uri "https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev/events?limit=100"
```

Keep the admin token private. Anyone with that token can read stored IP/event logs.
