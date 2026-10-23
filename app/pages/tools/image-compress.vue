<script setup lang="ts">
useSeoMeta({
  title: 'Compress Image Online Free',
  description: 'Compress JPG, PNG, and WebP in your browser. Files never leave your device.',
  ogTitle: 'Compress Image Online Free',
  ogDescription: 'Private, browser-based image compression.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Image Compress</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Reduce image file size without uploading. Processing happens locally in your browser.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageCompressTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>
    <p class="mt-8 text-sm text-slate-600">
      Need a walkthrough?
      <NuxtLink to="/blog/how-to-compress-images-online" class="font-medium text-teal-700 hover:underline">
        How to compress images online
      </NuxtLink>
    </p>
  </div>
</template>
