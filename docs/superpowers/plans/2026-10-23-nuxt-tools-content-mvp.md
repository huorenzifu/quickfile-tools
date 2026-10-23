# Nuxt Tools + Content MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an English Nuxt static site with 3 client-side tools (image compress, image resize, PDF merge), blog via `@nuxt/content`, legal pages, SEO basics, ad placeholders, deployable to Vercel `*.vercel.app`.

**Architecture:** Nuxt SSG site. Tool logic runs only in the browser (`ClientOnly` components). Blog posts are Markdown under `content/blog`. No server upload, no Supabase, no AdSense code until approval. Shared layout provides nav/footer and consistent SEO meta.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, `@nuxt/content`, `browser-image-compression`, `pdf-lib`, Vercel.

## Global Constraints

- English UI and blog copy only for MVP
- Files process on-device; never upload to a backend
- Host on Vercel free `*.vercel.app` first
- AdSense: reserve slots only (no publisher script yet)
- GA4: optional env `NUXT_PUBLIC_GA_ID`; omit script if empty
- Do not commit unless the user explicitly asks
- YAGNI: no auth, no payments, no Facebook ads, no AdMob

## File Structure

```
project/
  app.vue
  nuxt.config.ts
  package.json
  public/robots.txt
  public/favicon.svg
  assets/css/main.css
  layouts/default.vue
  components/
    AppHeader.vue
    AppFooter.vue
    AdSlot.vue
    tools/
      ImageCompressTool.client.vue
      ImageResizeTool.client.vue
      PdfMergeTool.client.vue
  pages/
    index.vue
    tools/index.vue
    tools/image-compress.vue
    tools/image-resize.vue
    tools/pdf-merge.vue
    blog/index.vue
    blog/[...slug].vue
    about.vue
    contact.vue
    privacy.vue
    terms.vue
  content/blog/
    how-to-compress-images-online.md
    how-to-resize-images-online.md
    how-to-merge-pdfs-online.md
  utils/tools.ts
```

---

### Task 1: Scaffold Nuxt + Tailwind + Content

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `app.vue`, `assets/css/main.css`, `.gitignore`, `README.md`
- Remove or replace: empty root `index.html` (conflicts with Nuxt)

**Interfaces:**
- Produces: runnable `npm run dev` Nuxt app with Tailwind + `@nuxt/content`

- [ ] **Step 1: Scaffold project in place**

Run from `c:\Users\dell\Desktop\project` (keep `docs/`):

```bash
npx nuxi@latest init . --force --packageManager npm
```

If interactive prompts appear, choose: npm, no extra modules yet (add manually).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @nuxt/content @nuxtjs/tailwindcss browser-image-compression pdf-lib
```

- [ ] **Step 3: Configure `nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.vercel.app',
    name: 'QuickFile Tools',
  },
  app: {
    head: {
      titleTemplate: '%s · QuickFile Tools',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Free browser-based image and PDF tools. Files stay on your device.' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    public: {
      gaId: '',
      siteUrl: '',
    },
  },
})
```

- [ ] **Step 4: Add `assets/css/main.css` and `app.vue`**

`assets/css/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-50 text-slate-900 antialiased;
}
```

`app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Expected: site loads on `http://localhost:3000` without errors.

---

### Task 2: Layout, chrome, AdSlot, tool registry

**Files:**
- Create: `layouts/default.vue`, `components/AppHeader.vue`, `components/AppFooter.vue`, `components/AdSlot.vue`, `utils/tools.ts`, `public/favicon.svg`, `public/robots.txt`

**Interfaces:**
- Produces: `TOOLS` array `{ slug, title, description, path, href }` used by home and tools index
- Produces: `<AdSlot label="..." />` dashed placeholder

- [ ] **Step 1: `utils/tools.ts`**

```ts
export type ToolMeta = {
  slug: string
  title: string
  description: string
  path: string
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'image-compress',
    title: 'Image Compress',
    description: 'Shrink JPG/PNG/WebP in your browser. Files never leave your device.',
    path: '/tools/image-compress',
  },
  {
    slug: 'image-resize',
    title: 'Image Resize',
    description: 'Resize images to exact dimensions without uploading to a server.',
    path: '/tools/image-resize',
  },
  {
    slug: 'pdf-merge',
    title: 'PDF Merge',
    description: 'Combine multiple PDFs into one file locally in your browser.',
    path: '/tools/pdf-merge',
  },
]
```

- [ ] **Step 2: Header / Footer / Layout / AdSlot**

Header: logo text "QuickFile Tools", links Tools, Blog, About.  
Footer: Privacy, Terms, Contact, short privacy line about on-device processing.  
`AdSlot.vue`: bordered dashed box, text `Advertisement placeholder`, `aria-hidden` optional note for a11y.  
`layouts/default.vue`: header + `<main class="mx-auto max-w-5xl px-4 py-8">` + footer.

- [ ] **Step 3: `public/robots.txt`**

```
User-agent: *
Allow: /
```

- [ ] **Step 4: Smoke-check layout on `/` placeholder page**

Expected: nav and footer render.

---

### Task 3: Static pages (home, tools index, legal, contact)

**Files:**
- Create: `pages/index.vue`, `pages/tools/index.vue`, `pages/about.vue`, `pages/contact.vue`, `pages/privacy.vue`, `pages/terms.vue`

- [ ] **Step 1: Home** — hero with brand name "QuickFile Tools", one headline, one sentence, CTA links to three tools; list latest blog via `queryContent('blog').limit(3)` when content exists.
- [ ] **Step 2: Tools index** — map `TOOLS` to cards linking to each tool path.
- [ ] **Step 3: About / Contact / Privacy / Terms** — real English copy covering on-device processing, no account, AdSense future disclosure, contact email placeholder `hello@quickfile.tools` (update later).
- [ ] **Step 4: Set `useSeoMeta` on each page** with unique title/description.

---

### Task 4: Image Compress tool

**Files:**
- Create: `components/tools/ImageCompressTool.client.vue`, `pages/tools/image-compress.vue`

**Interfaces:**
- Produces: client component accepting file input, quality slider (0.1–1 default 0.7), max size optional; outputs downloadable blob
- Uses: `browser-image-compression`

- [ ] **Step 1: Page shell** with H1, short SEO intro, `<AdSlot />`, `<ClientOnly><ImageCompressTool /></ClientOnly>`, link to related blog post.
- [ ] **Step 2: Tool component** — validate image types `image/jpeg|png|webp`; show original vs compressed size; error message on failure; download button.
- [ ] **Step 3: Manual test** — compress a sample PNG/JPG in Chrome; confirm download works and no network upload of the file.

---

### Task 5: Image Resize tool

**Files:**
- Create: `components/tools/ImageResizeTool.client.vue`, `pages/tools/image-resize.vue`

- [ ] **Step 1: Page shell** same pattern as compress.
- [ ] **Step 2: Tool** — width/height number inputs, lock aspect ratio checkbox (default on), canvas draw + `toBlob`, download.
- [ ] **Step 3: Manual test** — resize and download.

---

### Task 6: PDF Merge tool

**Files:**
- Create: `components/tools/PdfMergeTool.client.vue`, `pages/tools/pdf-merge.vue`

- [ ] **Step 1: Page shell** same pattern.
- [ ] **Step 2: Tool** — multi-file input `application/pdf`, order list, merge with `pdf-lib` `PDFDocument`, download `merged.pdf`; clear errors for non-PDF.
- [ ] **Step 3: Manual test** — merge 2 small PDFs.

---

### Task 7: Blog with @nuxt/content

**Files:**
- Create: `pages/blog/index.vue`, `pages/blog/[...slug].vue`, three Markdown posts under `content/blog/`

- [ ] **Step 1: Posts** (frontmatter: `title`, `description`, `date`, `tools` related slug):
  - `how-to-compress-images-online.md`
  - `how-to-resize-images-online.md`
  - `how-to-merge-pdfs-online.md`
- [ ] **Step 2: Blog index** — list posts sorted by date desc.
- [ ] **Step 3: Blog slug page** — render ContentRenderer; `<AdSlot />` below title and at end; internal link to matching tool.
- [ ] **Step 4: Verify** `/blog` and one post render.

---

### Task 8: SEO extras + Vercel readiness

**Files:**
- Modify: `nuxt.config.ts` (prerender routes if needed)
- Create: `vercel.json` only if required; prefer Nuxt Vercel preset defaults

- [ ] **Step 1: Ensure sitemap** — add `@nuxtjs/sitemap` OR generate simple `public/sitemap.xml` listing home, tools, blog posts, legal pages for MVP speed.
- [ ] **Step 2: `npm run generate`** — expect success; `.output/public` or Nuxt generate output present.
- [ ] **Step 3: README** — how to `npm run dev`, `npm run generate`, deploy: push to GitHub → Import on Vercel → use given `*.vercel.app`.
- [ ] **Step 4: Document next ops** in README: AdSense apply after content live; GA4 env; custom domain later.

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| 3 tools local | 4–6 |
| Blog + SEO articles | 7 |
| Legal/about/contact | 3 |
| Ad placeholders | 2, 4–7 |
| Vercel domain | 8 |
| No Supabase/auth | Global |
| GA4 optional | config + README |

## Execution

Default for this session: **Inline Execution** (user said 开始).
