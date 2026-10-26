<script setup lang="ts">
const landing = CONVERSION_LANDINGS.find(i => i.slug === 'png-to-webp')!

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
      <NuxtLink to="/tools/jpg-to-webp" class="font-medium text-teal-700 hover:underline">JPG to WebP</NuxtLink>
      ·
      <NuxtLink to="/tools/webp-to-png" class="font-medium text-teal-700 hover:underline">WebP to PNG</NuxtLink>
      ·
      <NuxtLink to="/blog/jpg-to-webp-smaller-images" class="font-medium text-teal-700 hover:underline">WebP guide</NuxtLink>
    </p>
    <ConversionGuide :landing="landing" />
  </div>
</template>
