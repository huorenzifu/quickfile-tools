# Design: English Tools + Content Site (AdSense → later App/AdMob)

Date: 2026-10-23  
Status: Approved in conversation; pending user review of this file

## 1. Goal

Build a lightweight English website for file/image productivity tools plus SEO content.  
Cold-start with zero ad budget (SEO + free communities). Monetize the **website** with **Google AdSense** first. Later: optional Facebook ads tests, then a mobile app with **AdMob**.

## 2. Positioning

One-liner: Browser-based file/image utility tools (processing stays on-device) + How-to articles for English users.

Success criteria (about 8–12 weeks):

- Site live and tools usable
- Steady content + community exposure
- AdSense application submitted / preferably approved
- 1–2 pages earning stable organic search traffic

## 3. Approach (chosen)

**Static tool site + content SEO** (not full Supabase app, not WordPress).

- Tools run in the browser (privacy-friendly, cheap to host)
- Articles as Markdown in the repo
- Deploy on Vercel free tier with `*.vercel.app` first
- Supabase deferred until after MVP / AdSense

## 4. MVP Scope

### In scope

- 3 local tools:
  1. Image Compress
  2. Image Resize
  3. PDF Merge
- Per tool: 1 landing page + 1–2 SEO articles
- Pages: home, tools index, blog list/post, Privacy, Terms, About, Contact
- SEO basics: titles, descriptions, sitemap, robots, Open Graph
- Analytics: GA4 (one property; privacy note in Privacy page)
- Ad slot placeholders (no AdSense code until approved)

### Out of scope (MVP)

- Auth, paid membership, heavy Supabase
- Facebook paid ads
- AdMob / native app store listing
- Custom purchased domain (optional later)

## 5. Information Architecture

| Path | Purpose |
|------|---------|
| `/` | Brand, 3 tool CTAs, latest posts |
| `/tools` | Tool list |
| `/tools/image-compress` | Tool |
| `/tools/image-resize` | Tool |
| `/tools/pdf-merge` | Tool |
| `/blog` | Post list |
| `/blog/[slug]` | Post |
| `/privacy`, `/terms`, `/about`, `/contact` | Trust / AdSense |

## 6. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 3/4 (Vue), SSG/`nuxt generate` for static hosting on Vercel |
| Styling | Tailwind CSS (via `@nuxtjs/tailwindcss` or UnoCSS if preferred later) |
| Image tools | Canvas / `browser-image-compression` (client-only) |
| PDF merge | `pdf-lib` (client-only) |
| Content | Markdown via `@nuxt/content` |
| Hosting | Vercel (`project.vercel.app`) |
| Backend | None for MVP (no Nitro API routes required) |
| Ads | Placeholder slots → AdSense after approval |

### Domain

- MVP: Vercel-provided `*.vercel.app` (auto after deploy)
- Later: buy a short `.com` and attach under Vercel → Domains

### Ad placements (reserve only)

- Tool pages: above results; desktop sidebar optional
- Articles: below title, mid-article, end of article

## 7. Architecture Notes

- Each tool page = Nuxt page + client-only Vue component for file processing (`<ClientOnly>` / `.client.vue`)
- Files never upload to a server in MVP
- Blog = `@nuxt/content` Markdown → static HTML at generate time
- Error handling: clear client messages for unsupported file types, size limits, PDF failures
- Testing: manual smoke tests per tool on desktop Chrome; basic mobile layout check

## 8. Go-to-Market & Monetization

### Phase A (weeks 1–2) — Launch

- Ship 3 tools + legal pages + blog skeleton
- Publish on `*.vercel.app`
- At least one English SEO article per tool

### Phase B (weeks 2–8) — Zero-budget acquisition

- SEO: intent-rich titles, internal links, sitemap
- Communities: Reddit (rules-first), forums, occasional X
- Cadence: ~1 article or tool improvement per week
- No Facebook ad spend yet

### Phase C — AdSense (site monetization)

1. Apply when content and pages are real and crawlable
2. Place units in reserved slots after approval
3. Payments: configure bank / supported wallet in AdSense (country-dependent); Google pays when threshold is met — no custom Stripe required for ads

### Phase D — Later

- Facebook: Page + creatives, then small tests on one tool landing page
- App / AdMob: wrap or rebuild core tools; AdMob is separate from site AdSense

## 9. Operator Checklist (minimum)

- Watch which pages get search traffic → improve those tools/posts
- Do not artificially inflate AdSense clicks
- Configure AdSense payout details once

## 10. Future App Path (not MVP)

- Reuse tool UX and brand
- Ship iOS/Android (or simple WebView) when web traffic validates demand
- Monetize app inventory with AdMob

## 11. Non-goals / Risks

- `vercel.app` is fine for MVP; custom domain improves trust and brand later
- AdSense approval is not guaranteed; quality content and clear policies help
- Competing with large tool portals: win on speed, privacy (local processing), and focused SEO pages
