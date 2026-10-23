<script setup lang="ts">
import { PDFDocument } from 'pdf-lib'

const busy = ref(false)
const error = ref('')
const resultUrl = ref('')
const pageCount = ref(0)
const fromPage = ref(1)
const toPage = ref(1)
let sourceBytes: ArrayBuffer | null = null

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  error.value = ''
  resultUrl.value = ''
  pageCount.value = 0
  sourceBytes = null
  if (!file) return
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    error.value = 'Please choose a PDF file.'
    return
  }

  busy.value = true
  try {
    sourceBytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(sourceBytes.slice(0))
    pageCount.value = doc.getPageCount()
    fromPage.value = 1
    toPage.value = pageCount.value
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not read PDF.'
  }
  finally {
    busy.value = false
  }
}

async function split() {
  error.value = ''
  resultUrl.value = ''
  if (!sourceBytes || pageCount.value < 1) {
    error.value = 'Choose a PDF first.'
    return
  }
  if (fromPage.value < 1 || toPage.value > pageCount.value || fromPage.value > toPage.value) {
    error.value = `Enter a valid range between 1 and ${pageCount.value}.`
    return
  }

  busy.value = true
  try {
    const src = await PDFDocument.load(sourceBytes.slice(0))
    const out = await PDFDocument.create()
    const indices = []
    for (let i = fromPage.value - 1; i <= toPage.value - 1; i++) indices.push(i)
    const pages = await out.copyPages(src, indices)
    pages.forEach(page => out.addPage(page))
    const bytes = await out.save()
    const blob = new Blob([bytes], { type: 'application/pdf' })
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Split failed. The PDF may be encrypted or damaged.'
  }
  finally {
    busy.value = false
  }
}

onBeforeUnmount(() => {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
})
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Choose PDF</span>
      <input
        type="file"
        accept="application/pdf,.pdf"
        class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
        @change="onFileChange"
      >
    </label>

    <p v-if="pageCount" class="mt-3 text-sm text-slate-600">
      Pages in file: <span class="font-medium">{{ pageCount }}</span>
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <label class="text-sm font-medium text-slate-700">
        From page
        <input
          v-model.number="fromPage"
          type="number"
          min="1"
          :max="pageCount || 1"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          :disabled="!pageCount"
        >
      </label>
      <label class="text-sm font-medium text-slate-700">
        To page
        <input
          v-model.number="toPage"
          type="number"
          min="1"
          :max="pageCount || 1"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          :disabled="!pageCount"
        >
      </label>
    </div>

    <button
      type="button"
      class="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      :disabled="busy || !pageCount"
      @click="split"
    >
      {{ busy ? 'Working…' : 'Extract pages' }}
    </button>

    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6">
      <a
        :href="resultUrl"
        :download="`pages-${fromPage}-${toPage}.pdf`"
        class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Download extracted PDF
      </a>
    </div>
  </div>
</template>
