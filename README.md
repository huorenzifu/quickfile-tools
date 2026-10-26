# QuickFile Tools

English browser-based image & PDF tools + SEO blog. Built with Nuxt 4, Tailwind, and `@nuxt/content`. Files are processed on-device.

Live: https://quickfile-tools.vercel.app

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run generate # static output for hosting
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com](https://vercel.com) (Framework Preset: Nuxt).
3. Deploy — you get a free URL like `quickfile-tools.vercel.app`.
4. Optional env vars (see `.env.example`):
   - `NUXT_PUBLIC_GA_ID` — GA4 Measurement ID (`G-XXXXXXXX`)
   - `NUXT_PUBLIC_SITE_URL` — canonical site URL

## After launch / ops

- Search Console + GA4 steps: `docs/ops-p0-p1.md`
- Apply for [Google AdSense](https://www.google.com/adsense/) after stable traffic; swap `AdSlot` placeholders then.
- Facebook ads and AdMob are out of MVP scope (see `docs/superpowers/specs/`).

## Docs

- Design: `docs/superpowers/specs/2026-10-23-tools-content-site-design.md`
- Plan: `docs/superpowers/plans/2026-10-23-nuxt-tools-content-mvp.md`
- Ops P0/P1: `docs/ops-p0-p1.md`
