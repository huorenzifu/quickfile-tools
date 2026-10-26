# P0 / P1 ops checklist

## P0 — Search Console (manual)

After deploy, in [Google Search Console](https://search.google.com/search-console):

1. Confirm sitemap `sitemap.xml` status is OK.
2. Use **URL Inspection** → **Request indexing** for:

- `https://quickfile-tools.vercel.app/`
- `https://quickfile-tools.vercel.app/tools`
- `https://quickfile-tools.vercel.app/tools/png-to-svg`
- `https://quickfile-tools.vercel.app/tools/jpg-to-webp`
- `https://quickfile-tools.vercel.app/tools/png-to-jpg`
- `https://quickfile-tools.vercel.app/tools/webp-to-png`
- `https://quickfile-tools.vercel.app/tools/png-to-webp`
- `https://quickfile-tools.vercel.app/blog/png-to-svg-without-uploading`
- `https://quickfile-tools.vercel.app/blog/jpg-to-webp-smaller-images`

Google may rate-limit requests; do a few per day if needed.

## P0 — GA4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/).
2. Copy Measurement ID (`G-XXXXXXXX`).
3. In Vercel → Project → Settings → Environment Variables:
   - `NUXT_PUBLIC_GA_ID` = `G-XXXXXXXX`
4. Redeploy. Visit the site and confirm realtime hits in GA4.

## P1 — Content cadence

- Weekly: 1 blog post **or** 1 conversion landing page.
- Keep internal links between tool ↔ blog.
