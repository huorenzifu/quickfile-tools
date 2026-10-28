<script setup lang="ts">
useSeoMeta({
  title: 'Split PDF Online Free',
  description: 'Extract a page range from a PDF in your browser. No uploads.',
  ogTitle: 'Split PDF Online Free',
  ogDescription: 'Private, browser-based PDF page extraction.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">PDF Split</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Extract pages from–to into a new PDF. Everything runs locally in your browser.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsPdfSplitTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>
    <p class="mt-8 text-sm text-slate-600">
      Guide:
      <NuxtLink to="/blog/split-pdf-without-uploading" class="font-medium text-teal-700 hover:underline">
        Split a PDF without uploading
      </NuxtLink>
      ·
      <NuxtLink to="/tools/merge-pdf-online" class="font-medium text-teal-700 hover:underline">
        Merge PDF online
      </NuxtLink>
    </p>
  </div>
</template>
