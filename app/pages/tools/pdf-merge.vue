<script setup lang="ts">
useSeoMeta({
  title: 'Merge PDF Online Free',
  description: 'Combine multiple PDFs into one file in your browser. No uploads.',
  ogTitle: 'Merge PDF Online Free',
  ogDescription: 'Private, browser-based PDF merge.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">PDF Merge</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Select PDFs, reorder them, and download a single merged file. Everything runs locally.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsPdfMergeTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>
    <p class="mt-8 text-sm text-slate-600">
      Guide:
      <NuxtLink to="/blog/how-to-merge-pdfs-online" class="font-medium text-teal-700 hover:underline">
        How to merge PDFs online
      </NuxtLink>
    </p>
  </div>
</template>
