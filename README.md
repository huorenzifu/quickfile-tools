# QuickFile Tools

English browser-based image & PDF tools + SEO blog. Built with Nuxt 4, Tailwind, and `@nuxt/content`. Files are processed on-device.

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
3. Deploy — you get a free URL like `your-project.vercel.app`.
4. Later: buy a domain and attach it under Project → Domains.

## After launch

- Replace `hello@quickfile.tools` with your real email on Contact / Privacy.
- Apply for [Google AdSense](https://www.google.com/adsense/) when content is live; swap `AdSlot` placeholders for ad units after approval.
- Optional: set `NUXT_PUBLIC_GA_ID` for GA4.
- Facebook ads and AdMob are out of MVP scope (see `docs/superpowers/specs/`).

## Docs

- Design: `docs/superpowers/specs/2026-10-23-tools-content-site-design.md`
- Plan: `docs/superpowers/plans/2026-10-23-nuxt-tools-content-mvp.md`
