<script setup lang="ts">
useSeoMeta({
  title: 'Resize Image Online Free',
  description: 'Resize images to exact dimensions in your browser. No uploads.',
  ogTitle: 'Resize Image Online Free',
  ogDescription: 'Private, browser-based image resizing.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Image Resize</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Set exact width and height, optionally lock aspect ratio. Your image stays on your device.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageResizeTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading tool…</p>
        </template>
      </ClientOnly>
    </div>
    <p class="mt-8 text-sm text-slate-600">
      Guide:
      <NuxtLink to="/blog/how-to-resize-images-online" class="font-medium text-teal-700 hover:underline">
        How to resize images online
      </NuxtLink>
    </p>
  </div>
</template>
