<script setup lang="ts">
useSeoMeta({
  title: 'Blog',
  description: 'Guides and tips for using QuickFile Tools.',
})

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Blog</h1>
    <p class="mt-2 text-slate-600">Practical guides for image and PDF workflows.</p>
    <ul class="mt-8 space-y-4">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink
          :to="post.path"
          class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300"
        >
          <time class="text-xs text-slate-500" :datetime="post.date">{{ post.date }}</time>
          <h2 class="mt-1 text-lg font-semibold text-slate-900">{{ post.title }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ post.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
