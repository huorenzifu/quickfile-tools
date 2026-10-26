<script setup lang="ts">
useSeoMeta({
  title: 'Free Image & PDF Tools in Your Browser',
  description: 'Compress, convert, crop, resize images, and merge or split PDFs locally. No uploads. Free forever.',
})

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog').order('date', 'DESC').limit(3).all(),
)
</script>

<template>
  <div>
    <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-800 via-teal-700 to-slate-800 px-6 py-14 text-white sm:px-10">
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-400/20 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-2xl" />
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-teal-100">QuickFile Tools</p>
      <h1 class="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
        File tools that stay on your device
      </h1>
      <p class="mt-4 max-w-lg text-teal-50/90">
        Compress, convert, crop, resize images, and merge or split PDFs in the browser — private, fast, and free.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink
          to="/tools/image-compress"
          class="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:bg-teal-50"
        >
          Compress image
        </NuxtLink>
        <NuxtLink
          to="/tools"
          class="rounded-md border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          Browse all tools
        </NuxtLink>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-semibold text-slate-900">Popular converters</h2>
      <p class="mt-1 text-slate-600">High-intent format tools — private, no upload.</p>
      <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in CONVERSION_LANDINGS" :key="item.slug">
          <NuxtLink
            :to="item.path"
            class="block rounded-xl border border-teal-200 bg-teal-50/40 p-5 transition hover:border-teal-400 hover:bg-teal-50"
          >
            <h3 class="font-semibold text-slate-900">{{ item.fromLabel }} → {{ item.toLabel }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ item.h1 }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-semibold text-slate-900">Popular tools</h2>
      <p class="mt-1 text-slate-600">Everything runs locally in your browser.</p>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="tool in TOOLS" :key="tool.slug">
          <NuxtLink
            :to="tool.path"
            class="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow"
          >
            <h3 class="font-semibold text-slate-900">{{ tool.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ tool.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="posts?.length" class="mt-14">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">From the blog</h2>
          <p class="mt-1 text-slate-600">Guides to get more from each tool.</p>
        </div>
        <NuxtLink to="/blog" class="text-sm font-medium text-teal-700 hover:text-teal-900">View all</NuxtLink>
      </div>
      <ul class="mt-6 space-y-3">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path" class="block rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-teal-300">
            <span class="font-medium text-slate-900">{{ post.title }}</span>
            <p class="mt-1 text-sm text-slate-600">{{ post.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
