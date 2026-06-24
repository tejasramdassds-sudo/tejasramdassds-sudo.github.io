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

Use your admin token:

```powershell
$token = "YOUR_ADMIN_TOKEN"
Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } `
  -Uri "https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev/summary"

Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } `
  -Uri "https://tejas-website-event-logger.tejas-ramdas-sds.workers.dev/events?limit=100"
```

Keep the admin token private. Anyone with that token can read stored IP/event logs.
