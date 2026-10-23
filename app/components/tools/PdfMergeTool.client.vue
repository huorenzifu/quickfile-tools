<script setup lang="ts">
import { PDFDocument } from 'pdf-lib'

type Item = { id: string, name: string, file: File }

const items = ref<Item[]>([])
const busy = ref(false)
const error = ref('')
const resultUrl = ref('')

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  error.value = ''
  if (!files?.length) return
  for (const file of Array.from(files)) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      error.value = `"${file.name}" is not a PDF.`
      continue
    }
    items.value.push({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      file,
    })
  }
  input.value = ''
}

function removeAt(index: number) {
  items.value.splice(index, 1)
}

function move(index: number, delta: number) {
  const next = index + delta
  if (next < 0 || next >= items.value.length) return
  const copy = [...items.value]
  const [row] = copy.splice(index, 1)
  copy.splice(next, 0, row)
  items.value = copy
}

async function merge() {
  error.value = ''
  resultUrl.value = ''
  if (items.value.length < 2) {
    error.value = 'Add at least two PDF files to merge.'
    return
  }
  busy.value = true
  try {
    const merged = await PDFDocument.create()
    for (const item of items.value) {
      const bytes = await item.file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const pages = await merged.copyPages(doc, doc.getPageIndices())
      pages.forEach(page => merged.addPage(page))
    }
    const out = await merged.save()
    const blob = new Blob([out], { type: 'application/pdf' })
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Merge failed. One of the PDFs may be damaged or encrypted.'
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
      <span class="text-sm font-medium text-slate-700">Add PDF files</span>
      <input
        type="file"
        accept="application/pdf,.pdf"
        multiple
        class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
        @change="onFiles"
      >
    </label>

    <ul v-if="items.length" class="mt-6 space-y-2">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
      >
        <span class="font-medium text-slate-800">{{ index + 1 }}. {{ item.name }}</span>
        <div class="flex gap-2">
          <button type="button" class="text-slate-600 hover:text-teal-700" @click="move(index, -1)">Up</button>
          <button type="button" class="text-slate-600 hover:text-teal-700" @click="move(index, 1)">Down</button>
          <button type="button" class="text-red-600 hover:text-red-700" @click="removeAt(index)">Remove</button>
        </div>
      </li>
    </ul>

    <button
      type="button"
      class="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      :disabled="busy"
      @click="merge"
    >
      {{ busy ? 'Merging…' : 'Merge PDFs' }}
    </button>

    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6">
      <a
        :href="resultUrl"
        download="merged.pdf"
        class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Download merged.pdf
      </a>
    </div>
  </div>
</template>
