<script setup lang="ts">
useSeoMeta({
  title: 'Convert Image to JPG PNG WebP GIF BMP AVIF ICO',
  description: 'Convert images between JPG, PNG, WebP, GIF, BMP, AVIF, and ICO in your browser. No uploads.',
  ogTitle: 'Convert Image Online Free',
  ogDescription: 'Private, browser-based image format conversion.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Image Convert</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Convert between JPG, PNG, WebP, GIF, BMP, AVIF, and ICO locally. Your file never leaves this device.
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
  </div>
</template>
