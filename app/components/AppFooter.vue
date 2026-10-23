<template>
  <footer class="mt-auto border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="font-semibold text-slate-900">QuickFile Tools</p>
        <p class="mt-1 max-w-sm">
          Free browser tools for images and PDFs. Processing stays on your device — we never upload your files.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <NuxtLink to="/privacy" class="hover:text-teal-700">Privacy</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-teal-700">Terms</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-teal-700">Contact</NuxtLink>
      </div>
    </div>
  </footer>
</template>
