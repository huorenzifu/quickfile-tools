<script setup lang="ts">
const links = [
  { to: '/tools', label: 'Tools' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]
</script>

<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-slate-900">
        QuickFile <span class="text-teal-700">Tools</span>
      </NuxtLink>
      <nav class="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="hover:text-teal-700"
          active-class="text-teal-700"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
