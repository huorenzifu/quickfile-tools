<script setup lang="ts">
const busy = ref(false)
const error = ref('')
const resultUrl = ref('')
const resultName = ref('')
const natural = ref({ w: 0, h: 0 })
const previewUrl = ref('')
/** Crop in natural image pixels */
const crop = ref({ x: 0, y: 0, w: 100, h: 100 })

const stageRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const display = ref({ w: 0, h: 0, left: 0, top: 0 })

let sourceBitmap: ImageBitmap | null = null
let sourceMime = 'image/png'
let sourceName = 'image.png'

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'new'
let dragMode: DragMode | null = null
let startPointer = { x: 0, y: 0 }
let startCrop = { x: 0, y: 0, w: 0, h: 0 }

const accept = 'image/jpeg,image/png,image/webp'
const MIN = 20

const scale = computed(() =>
  natural.value.w ? display.value.w / natural.value.w : 1,
)

const boxStyle = computed(() => {
  const s = scale.value
  return {
    left: `${crop.value.x * s}px`,
    top: `${crop.value.y * s}px`,
    width: `${crop.value.w * s}px`,
    height: `${crop.value.h * s}px`,
  }
})

function measureDisplay() {
  const stage = stageRef.value
  const img = imgRef.value
  if (!stage || !img || !natural.value.w) return
  const stageRect = stage.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()
  display.value = {
    w: imgRect.width,
    h: imgRect.height,
    left: imgRect.left - stageRect.left,
    top: imgRect.top - stageRect.top,
  }
}

function clampCrop() {
  const { w: nw, h: nh } = natural.value
  crop.value.w = Math.max(1, Math.min(Math.round(crop.value.w), nw))
  crop.value.h = Math.max(1, Math.min(Math.round(crop.value.h), nh))
  crop.value.x = Math.max(0, Math.min(Math.round(crop.value.x), nw - crop.value.w))
  crop.value.y = Math.max(0, Math.min(Math.round(crop.value.y), nh - crop.value.h))
}

function pointerToNatural(clientX: number, clientY: number) {
  const stage = stageRef.value
  if (!stage) return { x: 0, y: 0 }
  const rect = stage.getBoundingClientRect()
  const lx = clientX - rect.left - display.value.left
  const ly = clientY - rect.top - display.value.top
  const s = scale.value || 1
  return {
    x: lx / s,
    y: ly / s,
  }
}

function onPointerDownBox(mode: DragMode, e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  dragMode = mode
  startPointer = pointerToNatural(e.clientX, e.clientY)
  startCrop = { ...crop.value }
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerDownStage(e: PointerEvent) {
  if (!natural.value.w) return
  // Start a new selection from this point
  const p = pointerToNatural(e.clientX, e.clientY)
  const x = Math.max(0, Math.min(p.x, natural.value.w - 1))
  const y = Math.max(0, Math.min(p.y, natural.value.h - 1))
  crop.value = { x, y, w: 1, h: 1 }
  dragMode = 'new'
  startPointer = { x, y }
  startCrop = { ...crop.value }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!dragMode) return
  const p = pointerToNatural(e.clientX, e.clientY)
  const dx = p.x - startPointer.x
  const dy = p.y - startPointer.y
  const nw = natural.value.w
  const nh = natural.value.h

  if (dragMode === 'move') {
    crop.value.x = startCrop.x + dx
    crop.value.y = startCrop.y + dy
    clampCrop()
    return
  }

  if (dragMode === 'new') {
    const x1 = startPointer.x
    const y1 = startPointer.y
    const x2 = Math.max(0, Math.min(p.x, nw))
    const y2 = Math.max(0, Math.min(p.y, nh))
    crop.value = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      w: Math.max(1, Math.abs(x2 - x1)),
      h: Math.max(1, Math.abs(y2 - y1)),
    }
    return
  }

  let { x, y, w, h } = startCrop
  if (dragMode.includes('e')) w = startCrop.w + dx
  if (dragMode.includes('s')) h = startCrop.h + dy
  if (dragMode.includes('w')) {
    x = startCrop.x + dx
    w = startCrop.w - dx
  }
  if (dragMode.includes('n')) {
    y = startCrop.y + dy
    h = startCrop.h - dy
  }

  if (w < MIN) {
    if (dragMode.includes('w')) x = startCrop.x + startCrop.w - MIN
    w = MIN
  }
  if (h < MIN) {
    if (dragMode.includes('n')) y = startCrop.y + startCrop.h - MIN
    h = MIN
  }

  crop.value = { x, y, w, h }
  clampCrop()
}

function onPointerUp() {
  dragMode = null
  clampCrop()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  error.value = ''
  resultUrl.value = ''
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
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
    previewUrl.value = URL.createObjectURL(file)
    const side = Math.min(sourceBitmap.width, sourceBitmap.height, 400)
    crop.value = {
      x: Math.round((sourceBitmap.width - side) / 2),
      y: Math.round((sourceBitmap.height - side) / 2),
      w: side,
      h: side,
    }
    await nextTick()
    measureDisplay()
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not read image.'
  }
  finally {
    busy.value = false
  }
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

onMounted(() => {
  window.addEventListener('resize', measureDisplay)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureDisplay)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  sourceBitmap?.close()
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
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
      Image: {{ natural.w }} × {{ natural.h }} · Selection: {{ Math.round(crop.w) }} × {{ Math.round(crop.h) }}
      at ({{ Math.round(crop.x) }}, {{ Math.round(crop.y) }})
    </p>
    <p v-if="previewUrl" class="mt-1 text-xs text-slate-500">
      Drag inside the image to draw a box. Drag the box to move, use corners to resize.
    </p>

    <div
      v-if="previewUrl"
      ref="stageRef"
      class="relative mt-4 max-h-[480px] w-full cursor-crosshair select-none overflow-hidden rounded-lg bg-slate-900/90"
      @pointerdown="onPointerDownStage"
    >
      <img
        ref="imgRef"
        :src="previewUrl"
        alt="Crop preview"
        class="mx-auto block max-h-[480px] max-w-full object-contain"
        draggable="false"
        @load="measureDisplay"
      >
      <div
        v-if="display.w"
        class="pointer-events-none absolute"
        :style="{ left: `${display.left}px`, top: `${display.top}px`, width: `${display.w}px`, height: `${display.h}px` }"
      >
        <div
          class="pointer-events-auto absolute box-border border-2 border-teal-300 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          :style="boxStyle"
          @pointerdown="onPointerDownBox('move', $event)"
        >
          <span
            class="absolute -left-1.5 -top-1.5 h-3 w-3 cursor-nw-resize rounded-sm bg-teal-300"
            @pointerdown="onPointerDownBox('nw', $event)"
          />
          <span
            class="absolute -right-1.5 -top-1.5 h-3 w-3 cursor-ne-resize rounded-sm bg-teal-300"
            @pointerdown="onPointerDownBox('ne', $event)"
          />
          <span
            class="absolute -bottom-1.5 -left-1.5 h-3 w-3 cursor-sw-resize rounded-sm bg-teal-300"
            @pointerdown="onPointerDownBox('sw', $event)"
          />
          <span
            class="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-teal-300"
            @pointerdown="onPointerDownBox('se', $event)"
          />
        </div>
      </div>
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
