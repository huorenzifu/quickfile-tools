<script setup lang="ts">
type Format = 'image/jpeg' | 'image/png' | 'image/webp'

const format = ref<Format>('image/jpeg')
const quality = ref(0.9)
const busy = ref(false)
const error = ref('')
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const originalSize = ref(0)

const accept = 'image/jpeg,image/png,image/webp'
const needsQuality = computed(() => format.value !== 'image/png')

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  error.value = ''
  resultUrl.value = ''
  if (!file) return
  if (!accept.split(',').includes(file.type)) {
    error.value = 'Please choose a JPG, PNG, or WebP image.'
    return
  }

  originalSize.value = file.size
  busy.value = true
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    if (format.value === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        resolve,
        format.value,
        needsQuality.value ? quality.value : undefined,
      )
    })
    if (!blob) throw new Error('Conversion failed')

    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
    resultSize.value = blob.size
    const base = file.name.replace(/\.[^.]+$/, '')
    const ext = format.value === 'image/png' ? 'png' : format.value === 'image/webp' ? 'webp' : 'jpg'
    resultName.value = `${base}.${ext}`
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Conversion failed.'
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
      Output format
      <select v-model="format" class="mt-2 w-full rounded-md border border-slate-300 px-3 py-2">
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
    </label>

    <label v-if="needsQuality" class="mt-4 block text-sm font-medium text-slate-700">
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

    <p v-if="busy" class="mt-4 text-sm text-slate-600">Converting…</p>
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
      <p>
        <span class="font-medium">Original:</span> {{ formatBytes(originalSize) }}
        →
        <span class="font-medium">Result:</span> {{ formatBytes(resultSize) }}
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
