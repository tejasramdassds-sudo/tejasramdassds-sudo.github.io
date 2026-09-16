# Tejas Ramdas Academic Website

Static academic website for GitHub Pages.

## Updating the site

Edit `build-site.mjs` for content and shared page structure, `styles.css` for appearance, and `navigation.js` for navigation behavior. Run `node build-site.mjs` to regenerate the 18 static HTML pages and sitemap. The site works without a development server or build dependencies. Commit the generated HTML alongside its source.

The September 2026 revision uses the August 2026 CV and September application statements. Management Ph.D.: August 2026. Statistics Ph.D.: expected December 2026. The two master's degrees remain separate. The established topic URLs remain available.

`assets/Tejas_Ramdas_Academic_CV_August_2026.pdf` is the original supplied CV, published unchanged at the owner's request. `cv.html` displays complete page images rendered from that PDF and links directly to it. `assets/Tejas_Ramdas_CV.pdf` holds an identical copy to preserve the previous download URL. To update the CV, replace both PDF files with the new original and rerender `assets/cv-original-page-*.png`; do not reconstruct or shorten it. Other application packets and unpublished paper PDFs are not included. The job-market draft is marked not for circulation. Research figures were extracted in full from the research statement; the portrait remains uncropped.

Colors use Cornell red (`#b31b1b`), charcoal, white, and neutral gray. Icons are from Lucide under the license in `assets/lucide-LICENSE`.

## Analytics Logger

The `worker/` folder contains a Cloudflare Worker + D1 event logger. `script.js` points to the deployed `/collect` endpoint. Local previews do not send analytics events. The existing privacy notice remains linked from every page. Worker credentials are ignored by Git and must never be published.
