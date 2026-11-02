<script setup lang="ts">
useSeoMeta({
  title: 'Compress Image Online Free — No Upload',
  description: 'Compress JPG, PNG, and WebP online in your browser. Shrink file size privately with no uploads or signup.',
  ogTitle: 'Compress Image Online Free',
  ogDescription: 'Private, browser-based image compression. Files stay on your device.',
})

const compareRows = [
  { label: 'Privacy', other: 'Image uploaded to a server', us: 'Compressed only on your device' },
  { label: 'Formats', other: 'Varies by site', us: 'JPG, PNG, WebP' },
  { label: 'Signup', other: 'Often required for batch', us: 'Not required' },
  { label: 'Quality control', other: 'Fixed presets', us: 'Adjustable quality slider' },
]

const faqs = [
  {
    q: 'Will compressing ruin image quality?',
    a: 'Lower quality means a smaller file. Start around 70% and compare. For screenshots with text, keep quality higher or resize first.',
  },
  {
    q: 'Do you upload my photos?',
    a: 'No. Compression runs in your browser. Files are not sent to QuickFile Tools servers.',
  },
  {
    q: 'PNG still too large after compress?',
    a: 'Try converting photos to JPG/WebP, or resize dimensions first, then compress again.',
  },
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
      Compress Image Online Free
    </h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Shrink JPG, PNG, and WebP file sizes in your browser — fast, free, and private. No upload required.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageCompressTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading compressor…</p>
        </template>
      </ClientOnly>
    </div>

    <p class="mt-8 text-sm text-slate-600">
      Guides:
      <NuxtLink to="/blog/how-to-compress-images-online" class="font-medium text-teal-700 hover:underline">
        How to compress images online
      </NuxtLink>
      ·
      <NuxtLink to="/blog/compress-png-without-losing-quality" class="font-medium text-teal-700 hover:underline">
        Compress PNG without losing quality
      </NuxtLink>
      ·
      <NuxtLink to="/blog/batch-convert-images-locally" class="font-medium text-teal-700 hover:underline">
        Batch convert images locally
      </NuxtLink>
    </p>

    <div class="mt-12 space-y-10 text-slate-700">
      <section>
        <h2 class="text-xl font-semibold text-slate-900">How to compress an image</h2>
        <ol class="mt-4 list-decimal space-y-2 pl-5">
          <li>Choose a JPG, PNG, or WebP file.</li>
          <li>Adjust the quality slider if needed.</li>
          <li>Download the smaller result.</li>
        </ol>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900">Why compress locally?</h2>
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
              <tr v-for="row in compareRows" :key="row.label" class="border-t border-slate-200">
                <td class="px-4 py-3 font-medium text-slate-900">{{ row.label }}</td>
                <td class="px-4 py-3">{{ row.other }}</td>
                <td class="px-4 py-3">{{ row.us }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900">FAQ</h2>
        <dl class="mt-4 space-y-4">
          <div v-for="item in faqs" :key="item.q" class="rounded-lg border border-slate-200 bg-white p-4">
            <dt class="font-semibold text-slate-900">{{ item.q }}</dt>
            <dd class="mt-2 text-sm">{{ item.a }}</dd>
          </div>
        </dl>
      </section>

      <p class="text-sm text-slate-500">
        Need another format first?
        <NuxtLink to="/tools/image-convert" class="font-medium text-teal-700 hover:underline">Image Convert</NuxtLink>
        ·
        <NuxtLink to="/tools/png-to-webp" class="font-medium text-teal-700 hover:underline">PNG to WebP</NuxtLink>
      </p>
    </div>
  </div>
</template>
