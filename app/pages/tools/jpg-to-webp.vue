<script setup lang="ts">
const landing = CONVERSION_LANDINGS.find(i => i.slug === 'jpg-to-webp')!

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
    <ConversionGuide :landing="landing" />
  </div>
</template>
