# Tejas Ramdas Academic Website

Static academic website for GitHub Pages.

The site intentionally does not publish source PDFs from the local working folder. The working paper is listed as available upon request because the draft PDF is marked not for circulation.

## Analytics Logger

The `worker/` folder contains a Cloudflare Worker + D1 event logger. Once deployed, set `TRACKING_ENDPOINT` in `script.js` to the Worker's `/collect` URL, then commit and push.
