<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData('blog-' + route.path, () =>
  queryCollection('blog').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
})

const toolPath = computed(() =>
  post.value?.tool ? `/tools/${post.value.tool}` : null,
)
</script>

<template>
  <article v-if="post" class="max-w-3xl">
    <p class="text-sm text-slate-500">
      <NuxtLink to="/blog" class="hover:text-teal-700">Blog</NuxtLink>
      <span class="mx-2">/</span>
      <time :datetime="post.date">{{ post.date }}</time>
    </p>
    <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{{ post.title }}</h1>
    <p class="mt-3 text-lg text-slate-600">{{ post.description }}</p>
    <AdSlot />
    <div class="prose-blog mt-2">
      <ContentRenderer :value="post" />
    </div>
    <AdSlot label="Advertisement" />
    <p v-if="toolPath" class="mt-8">
      <NuxtLink
        :to="toolPath"
        class="inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        Open related tool
      </NuxtLink>
    </p>
  </article>
</template>
