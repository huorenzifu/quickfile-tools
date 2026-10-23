<script setup lang="ts">
useSeoMeta({
  title: 'Convert Image Formats Free — PNG JPG WebP SVG',
  description: 'Convert images between JPG, PNG, WebP, GIF, BMP, AVIF, ICO, and SVG in your browser. Batch convert with no uploads.',
  ogTitle: 'Convert Image Online Free',
  ogDescription: 'Private, browser-based image format conversion with batch support.',
})

const guide = {
  fromLabel: 'Source',
  toLabel: 'Target',
  compareRows: [
    { label: 'Privacy', from: 'Many sites upload files', to: 'QuickFile runs locally' },
    { label: 'Batch', from: 'Often limited', to: 'Multiple files + ZIP download' },
    { label: 'SVG', from: 'Usually server-side', to: 'Trace paths or embed raster' },
  ],
  faqs: [
    {
      q: 'Which formats can I convert?',
      a: 'JPG, PNG, WebP, GIF (still frame), BMP, AVIF, ICO, and SVG.',
    },
    {
      q: 'Can I convert many files at once?',
      a: 'Yes. Select multiple images. Download each result or one ZIP archive.',
    },
    {
      q: 'Looking for a specific conversion?',
      a: 'Try dedicated pages like PNG to SVG, JPG to WebP, or PNG to JPG for focused SEO guides.',
    },
  ],
} as const
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Image Convert</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Convert between JPG, PNG, WebP, GIF, BMP, AVIF, ICO, and SVG locally — including PNG/JPG → SVG. Batch convert supported. Files never leave this device.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageConvertTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>

    <div class="mt-10">
      <h2 class="text-xl font-semibold text-slate-900">Popular converters</h2>
      <ul class="mt-4 grid gap-3 sm:grid-cols-3">
        <li v-for="item in CONVERSION_LANDINGS" :key="item.slug">
          <NuxtLink
            :to="item.path"
            class="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-teal-800 hover:border-teal-300"
          >
            {{ item.fromLabel }} → {{ item.toLabel }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mt-12 space-y-10 text-slate-700">
      <section>
        <h2 class="text-xl font-semibold text-slate-900">How to convert images</h2>
        <ol class="mt-4 list-decimal space-y-2 pl-5">
          <li>Pick an output format (or open a dedicated converter page).</li>
          <li>Select one or more images.</li>
          <li>Download results individually or as a ZIP.</li>
        </ol>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-slate-900">Why convert locally?</h2>
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-100 text-slate-900">
              <tr>
                <th class="px-4 py-3 font-semibold">Feature</th>
                <th class="px-4 py-3 font-semibold">Typical upload sites</th>
                <th class="px-4 py-3 font-semibold">QuickFile Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in guide.compareRows" :key="row.label" class="border-t border-slate-200">
                <td class="px-4 py-3 font-medium text-slate-900">{{ row.label }}</td>
                <td class="px-4 py-3">{{ row.from }}</td>
                <td class="px-4 py-3">{{ row.to }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-semibold text-slate-900">FAQ</h2>
        <dl class="mt-4 space-y-4">
          <div v-for="item in guide.faqs" :key="item.q" class="rounded-lg border border-slate-200 bg-white p-4">
            <dt class="font-semibold text-slate-900">{{ item.q }}</dt>
            <dd class="mt-2 text-sm">{{ item.a }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>
