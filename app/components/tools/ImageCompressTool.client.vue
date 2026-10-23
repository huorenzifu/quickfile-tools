<script setup lang="ts">
import imageCompression from 'browser-image-compression'

const quality = ref(0.7)
const busy = ref(false)
const error = ref('')
const originalName = ref('')
const originalSize = ref(0)
const resultUrl = ref('')
const resultSize = ref(0)
const resultName = ref('')

const accept = 'image/jpeg,image/png,image/webp'

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  error.value = ''
  resultUrl.value = ''
  resultSize.value = 0
  if (!file) return

  if (!accept.split(',').includes(file.type)) {
    error.value = 'Please choose a JPG, PNG, or WebP image.'
    return
  }

  originalName.value = file.name
  originalSize.value = file.size
  busy.value = true
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 4096,
      useWebWorker: true,
      initialQuality: quality.value,
      fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    })
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(compressed)
    resultSize.value = compressed.size
    const base = file.name.replace(/\.[^.]+$/, '')
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    resultName.value = `${base}-compressed.${ext}`
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Compression failed. Try another image.'
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
    <label class="block text-sm font-medium text-slate-700">
      Quality
      <input
        v-model.number="quality"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        class="mt-2 w-full accent-teal-700"
      >
      <span class="mt-1 block text-xs text-slate-500">{{ Math.round(quality * 100) }}%</span>
    </label>

    <label class="mt-6 block">
      <span class="text-sm font-medium text-slate-700">Choose image</span>
      <input
        type="file"
        :accept="accept"
        class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
        @change="onFileChange"
      >
    </label>

    <p v-if="busy" class="mt-4 text-sm text-slate-600">Compressing…</p>
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6 space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
      <p>
        <span class="font-medium">Original:</span>
        {{ originalName }} · {{ formatBytes(originalSize) }}
      </p>
      <p>
        <span class="font-medium">Compressed:</span>
        {{ formatBytes(resultSize) }}
        <span v-if="originalSize" class="text-teal-700">
          ({{ Math.max(0, Math.round((1 - resultSize / originalSize) * 100)) }}% smaller)
        </span>
      </p>
      <a
        :href="resultUrl"
        :download="resultName"
        class="inline-flex rounded-md bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
      >
        Download
      </a>
    </div>
  </div>
</template>
