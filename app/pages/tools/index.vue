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
  </div>
</template>
