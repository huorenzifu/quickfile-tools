<script setup lang="ts">
const width = ref(800)
const height = ref(600)
const lockRatio = ref(true)
const busy = ref(false)
const error = ref('')
const resultUrl = ref('')
const resultName = ref('')
const natural = ref({ w: 0, h: 0 })
let sourceBitmap: ImageBitmap | null = null

const accept = 'image/jpeg,image/png,image/webp'

function onWidthInput() {
  if (!lockRatio.value || !natural.value.w) return
  height.value = Math.max(1, Math.round(width.value * (natural.value.h / natural.value.w)))
}

function onHeightInput() {
  if (!lockRatio.value || !natural.value.h) return
  width.value = Math.max(1, Math.round(height.value * (natural.value.w / natural.value.h)))
}

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

  busy.value = true
  try {
    sourceBitmap?.close()
    sourceBitmap = await createImageBitmap(file)
    natural.value = { w: sourceBitmap.width, h: sourceBitmap.height }
    width.value = sourceBitmap.width
    height.value = sourceBitmap.height
    await render(file.type, file.name)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not read image.'
  }
  finally {
    busy.value = false
  }
}

async function render(mime = 'image/png', name = 'image.png') {
  if (!sourceBitmap) {
    error.value = 'Choose an image first.'
    return
  }
  if (width.value < 1 || height.value < 1) {
    error.value = 'Width and height must be at least 1.'
    return
  }
  busy.value = true
  error.value = ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = width.value
    canvas.height = height.value
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    ctx.drawImage(sourceBitmap, 0, 0, width.value, height.value)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mime, 0.92))
    if (!blob) throw new Error('Failed to export image')
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
    const base = name.replace(/\.[^.]+$/, '')
    const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png'
    resultName.value = `${base}-${width.value}x${height.value}.${ext}`
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Resize failed.'
  }
  finally {
    busy.value = false
  }
}

async function applyResize() {
  await render()
}

onBeforeUnmount(() => {
  sourceBitmap?.close()
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
})
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Choose image</span>
      <input
        type="file"
        :accept="accept"
        class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
        @change="onFileChange"
      >
    </label>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <label class="text-sm font-medium text-slate-700">
        Width (px)
        <input
          v-model.number="width"
          type="number"
          min="1"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          @input="onWidthInput"
        >
      </label>
      <label class="text-sm font-medium text-slate-700">
        Height (px)
        <input
          v-model.number="height"
          type="number"
          min="1"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          @input="onHeightInput"
        >
      </label>
    </div>

    <label class="mt-4 flex items-center gap-2 text-sm text-slate-700">
      <input v-model="lockRatio" type="checkbox" class="accent-teal-700">
      Lock aspect ratio
    </label>

    <button
      type="button"
      class="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      :disabled="busy || !natural.w"
      @click="applyResize"
    >
      {{ busy ? 'Working…' : 'Resize' }}
    </button>

    <p v-if="natural.w" class="mt-3 text-xs text-slate-500">
      Original: {{ natural.w }} × {{ natural.h }}
    </p>
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6">
      <a
        :href="resultUrl"
        :download="resultName"
        class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Download resized image
      </a>
    </div>
  </div>
</template>
