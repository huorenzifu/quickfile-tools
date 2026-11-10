<script setup lang="ts">
const landing = CONVERSION_LANDINGS.find(i => i.slug === 'jpg-to-png')!

useSeoMeta({
  title: landing.title,
  description: landing.description,
  ogTitle: landing.h1,
  ogDescription: landing.description,
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">{{ landing.h1 }}</h1>
    <p class="mt-2 max-w-2xl text-slate-600">{{ landing.description }}</p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsImageConvertTool
          :default-format="landing.defaultFormat"
          :lock-format="landing.lockFormat"
          :accept-override="landing.accept"
        />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading converter…</p>
        </template>
      </ClientOnly>
    </div>
    <p class="mt-8 text-sm text-slate-600">
      Related:
      <NuxtLink to="/tools/png-to-jpg" class="font-medium text-teal-700 hover:underline">PNG to JPG</NuxtLink>
      ·
      <NuxtLink to="/tools/jpg-to-webp" class="font-medium text-teal-700 hover:underline">JPG to WebP</NuxtLink>
      ·
      <NuxtLink to="/blog/resize-image-for-web" class="font-medium text-teal-700 hover:underline">
        Resize images for the web
      </NuxtLink>
    </p>
    <ConversionGuide :landing="landing" />
  </div>
</template>
