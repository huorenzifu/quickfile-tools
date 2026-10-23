<script setup lang="ts">
useSeoMeta({
  title: 'All Tools',
  description: 'Browse free browser-based image and PDF tools from QuickFile Tools.',
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Tools</h1>
    <p class="mt-2 text-slate-600">Pick a tool to get started. No account required.</p>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2">
      <li v-for="tool in TOOLS" :key="tool.slug">
        <NuxtLink
          :to="tool.path"
          class="block h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-300"
        >
          <h2 class="text-lg font-semibold text-slate-900">{{ tool.title }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ tool.description }}</p>
          <span class="mt-4 inline-block text-sm font-medium text-teal-700">Open tool →</span>
        </NuxtLink>
      </li>
    </ul>

    <h2 class="mt-12 text-xl font-semibold text-slate-900">Popular converters</h2>
    <p class="mt-1 text-slate-600">SEO-focused pages for common format pairs.</p>
    <ul class="mt-6 grid gap-3 sm:grid-cols-3">
      <li v-for="item in CONVERSION_LANDINGS" :key="item.slug">
        <NuxtLink
          :to="item.path"
          class="block rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300"
        >
          <h3 class="font-semibold text-slate-900">{{ item.fromLabel }} → {{ item.toLabel }}</h3>
          <p class="mt-1 text-sm text-slate-600">{{ item.h1 }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
