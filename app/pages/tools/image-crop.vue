<script setup lang="ts">
useSeoMeta({
  title: 'Crop Image Online Free',
  description: 'Crop images to an exact region in your browser. No uploads.',
  ogTitle: 'Crop Image Online Free',
  ogDescription: 'Private, browser-based image cropping.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Image Crop</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Set left, top, width, and height to crop precisely. Processing stays on your device.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageCropTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
