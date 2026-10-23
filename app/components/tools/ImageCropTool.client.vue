<script setup lang="ts">
const busy = ref(false)
const error = ref('')
const resultUrl = ref('')
const resultName = ref('')
const natural = ref({ w: 0, h: 0 })
const crop = ref({ x: 0, y: 0, w: 400, h: 300 })
let sourceBitmap: ImageBitmap | null = null
let sourceMime = 'image/png'
let sourceName = 'image.png'

const accept = 'image/jpeg,image/png,image/webp'

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
    sourceMime = file.type
    sourceName = file.name
    crop.value = {
      x: 0,
      y: 0,
      w: Math.min(400, sourceBitmap.width),
      h: Math.min(300, sourceBitmap.height),
    }
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not read image.'
  }
  finally {
    busy.value = false
  }
}

function clampCrop() {
  const { w: nw, h: nh } = natural.value
  crop.value.w = Math.max(1, Math.min(crop.value.w, nw))
  crop.value.h = Math.max(1, Math.min(crop.value.h, nh))
  crop.value.x = Math.max(0, Math.min(crop.value.x, nw - crop.value.w))
  crop.value.y = Math.max(0, Math.min(crop.value.y, nh - crop.value.h))
}

async function applyCrop() {
  if (!sourceBitmap) {
    error.value = 'Choose an image first.'
    return
  }
  clampCrop()
  busy.value = true
  error.value = ''
  try {
    const { x, y, w, h } = crop.value
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    ctx.drawImage(sourceBitmap, x, y, w, h, 0, 0, w, h)
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, sourceMime, 0.92),
    )
    if (!blob) throw new Error('Crop failed')
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
    const base = sourceName.replace(/\.[^.]+$/, '')
    const ext = sourceMime === 'image/jpeg' ? 'jpg' : sourceMime === 'image/webp' ? 'webp' : 'png'
    resultName.value = `${base}-crop-${w}x${h}.${ext}`
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Crop failed.'
  }
  finally {
    busy.value = false
  }
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

    <p v-if="natural.w" class="mt-3 text-xs text-slate-500">
      Image size: {{ natural.w }} × {{ natural.h }}
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <label class="text-sm font-medium text-slate-700">
        Left (x)
        <input v-model.number="crop.x" type="number" min="0" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
      </label>
      <label class="text-sm font-medium text-slate-700">
        Top (y)
        <input v-model.number="crop.y" type="number" min="0" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
      </label>
      <label class="text-sm font-medium text-slate-700">
        Width
        <input v-model.number="crop.w" type="number" min="1" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
      </label>
      <label class="text-sm font-medium text-slate-700">
        Height
        <input v-model.number="crop.h" type="number" min="1" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
      </label>
    </div>

    <button
      type="button"
      class="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      :disabled="busy || !natural.w"
      @click="applyCrop"
    >
      {{ busy ? 'Working…' : 'Crop' }}
    </button>

    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="resultUrl" class="mt-6">
      <a
        :href="resultUrl"
        :download="resultName"
        class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Download cropped image
      </a>
    </div>
  </div>
</template>
