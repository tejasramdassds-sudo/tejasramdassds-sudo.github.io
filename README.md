# Tejas Ramdas Academic Website

Static academic website for GitHub Pages.

## Search Discovery

The homepage includes the Google Search Console verification tag for the owner's
Cornell Google account. Keep it in place to retain verification. A shared JSON-LD
graph connects the website and its pages to Tejas's Person identity, including
the Cornell personal site, departmental profile, NBER, and LinkedIn. The homepage
is a ProfilePage; paper overviews retain ScholarlyArticle metadata. Every page
has its own canonical URL, and the sitemap uses the canonical homepage URL.

Run `python verify-seo.py` after rebuilding to check metadata, structured data,
the sitemap, and local links. The `updated` date in `build-site.mjs` records the
last shared page-content or metadata revision; do not advance it for a no-op build.
Search Console submission and indexing results are separate from these code checks.

## Updating the site

Edit `build-site.mjs` for content and shared page structure, `styles.css` for appearance, and `navigation.js` for navigation behavior. Run `node build-site.mjs` to regenerate the 18 static HTML pages and sitemap. The site works without a development server or build dependencies. Commit the generated HTML alongside its source.

The September 2026 revision uses the August 2026 CV and September application statements. Management Ph.D.: August 2026. Statistics Ph.D.: expected December 2026. The two master's degrees remain separate. The established topic URLs remain available.

`assets/Tejas_Ramdas_Academic_CV_August_2026.pdf` is the original supplied CV, published unchanged at the owner's request. `cv.html` displays complete page images rendered from that PDF and links directly to it. `assets/Tejas_Ramdas_CV.pdf` holds an identical copy to preserve the previous download URL. To update the CV, replace both PDF files with the new original and rerender `assets/cv-original-page-*.png`; do not reconstruct or shorten it. Other application packets and unpublished paper PDFs are not included. The job-market draft is marked not for circulation. Research figures were extracted in full from the research statement; the portrait remains uncropped.

Colors use Cornell red (`#b31b1b`), charcoal, white, and neutral gray. Icons are from Lucide under the license in `assets/lucide-LICENSE`.

## Analytics Logger

The `worker/` folder contains a Cloudflare Worker + D1 event logger. `script.js` points to the deployed `/collect` endpoint. Local previews do not send analytics events. The existing privacy notice remains linked from every page. Worker credentials are ignored by Git and must never be published.
