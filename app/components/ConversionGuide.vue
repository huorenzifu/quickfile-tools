<script setup lang="ts">
import type { ConversionLanding } from '~/utils/conversions'

defineProps<{
  landing: ConversionLanding
}>()
</script>

<template>
  <div class="mt-12 space-y-10 text-slate-700">
    <section>
      <h2 class="text-xl font-semibold text-slate-900">How to convert {{ landing.fromLabel }} to {{ landing.toLabel }}</h2>
      <ol class="mt-4 list-decimal space-y-2 pl-5">
        <li>Choose one or more {{ landing.fromLabel }} files (batch is supported).</li>
        <li>Adjust quality or SVG mode if shown.</li>
        <li>Wait for local conversion — nothing is uploaded.</li>
        <li>Download each file, or download a ZIP when converting multiple images.</li>
      </ol>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-slate-900">{{ landing.fromLabel }} vs {{ landing.toLabel }}</h2>
      <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-100 text-slate-900">
            <tr>
              <th class="px-4 py-3 font-semibold">Feature</th>
              <th class="px-4 py-3 font-semibold">{{ landing.fromLabel }}</th>
              <th class="px-4 py-3 font-semibold">{{ landing.toLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in landing.compareRows"
              :key="row.label"
              class="border-t border-slate-200"
            >
              <td class="px-4 py-3 font-medium text-slate-900">{{ row.label }}</td>
              <td class="px-4 py-3">{{ row.from }}</td>
              <td class="px-4 py-3">{{ row.to }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-slate-900">FAQ</h2>
      <dl class="mt-4 space-y-4">
        <div v-for="item in landing.faqs" :key="item.q" class="rounded-lg border border-slate-200 bg-white p-4">
          <dt class="font-semibold text-slate-900">{{ item.q }}</dt>
          <dd class="mt-2 text-sm">{{ item.a }}</dd>
        </div>
      </dl>
    </section>

    <p class="text-sm text-slate-500">
      Need other formats?
      <NuxtLink to="/tools/image-convert" class="font-medium text-teal-700 hover:underline">Open Image Convert</NuxtLink>
      for JPG, PNG, WebP, GIF, BMP, AVIF, ICO, and SVG.
    </p>
  </div>
</template>
