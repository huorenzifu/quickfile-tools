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
  </div>
</template>
