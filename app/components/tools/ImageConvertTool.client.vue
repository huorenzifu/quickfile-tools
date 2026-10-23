<script setup lang="ts">
import { GIFEncoder, quantize, applyPalette } from 'gifenc'
import ImageTracer from 'imagetracerjs'
import JSZip from 'jszip'
import { canvasToBlob, encodeBmp, encodeIcoFromPng } from '~/utils/imageEncode'
import type { OutputFormat } from '~/utils/conversions'

type SvgMode = 'trace' | 'embed'

type ResultItem = {
  id: string
  sourceName: string
  name: string
  url: string
  size: number
  originalSize: number
}

const props = withDefaults(defineProps<{
  defaultFormat?: OutputFormat
  lockFormat?: boolean
  defaultSvgMode?: SvgMode
  acceptOverride?: string
}>(), {
  defaultFormat: 'image/jpeg',
  lockFormat: false,
  defaultSvgMode: 'trace',
  acceptOverride: '',
})

const format = ref<OutputFormat>(props.defaultFormat)
const svgMode = ref<SvgMode>(props.defaultSvgMode)
const quality = ref(0.9)
const busy = ref(false)
const progress = ref('')
const error = ref('')
const note = ref('')
const results = ref<ResultItem[]>([])
const zipUrl = ref('')

const acceptDefault = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/x-ms-bmp',
  'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon',
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.avif', '.ico',
].join(',')

const accept = computed(() => props.acceptOverride || acceptDefault)

const needsQuality = computed(() =>
  format.value === 'image/jpeg'
  || format.value === 'image/webp'
  || format.value === 'image/avif',
)

const extMap: Record<OutputFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/svg+xml': 'svg',
}

function clearResults() {
  for (const r of results.value) URL.revokeObjectURL(r.url)
  results.value = []
  if (zipUrl.value) URL.revokeObjectURL(zipUrl.value)
  zipUrl.value = ''
}

function scaleCanvasForTrace(source: HTMLCanvasElement, maxSide = 800): HTMLCanvasElement {
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height))
  if (scale >= 1) return source
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(source.width * scale))
  canvas.height = Math.max(1, Math.round(source.height * scale))
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

async function encodeSvg(canvas: HTMLCanvasElement): Promise<Blob> {
  if (svgMode.value === 'embed') {
    const png = await canvasToBlob(canvas, 'image/png')
    if (!png) throw new Error('SVG embed failed')
    const buf = new Uint8Array(await png.arrayBuffer())
    let binary = ''
    for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]!)
    const b64 = btoa(binary)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" href="data:image/png;base64,${b64}" xlink:href="data:image/png;base64,${b64}"/>
</svg>`
    return new Blob([svg], { type: 'image/svg+xml' })
  }

  const work = scaleCanvasForTrace(canvas)
  const ctx = work.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, work.width, work.height)
  const tracer = ImageTracer as { imagedataToSVG: (d: ImageData, o?: Record<string, unknown>) => string }
  const svgstr = tracer.imagedataToSVG(imageData, {
    numberofcolors: 16,
    pathomit: 8,
    ltres: 1,
    qtres: 1,
  })
  return new Blob([svgstr], { type: 'image/svg+xml' })
}

function isAllowedFile(file: File): boolean {
  const t = file.type
  const n = file.name.toLowerCase()
  if (t.startsWith('image/')) return true
  return /\.(jpe?g|png|webp|gif|bmp|avif|ico)$/.test(n)
}

async function loadToCanvas(file: File): Promise<HTMLCanvasElement> {
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()
    return canvas
  }
  catch {
    const url = URL.createObjectURL(file)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error(`Could not decode ${file.name}`))
        el.src = url
      })
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')
      ctx.drawImage(img, 0, 0)
      return canvas
    }
    finally {
      URL.revokeObjectURL(url)
    }
  }
}

async function encodeGif(canvas: HTMLCanvasElement): Promise<Blob> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const palette = quantize(imageData.data, 256)
  const index = applyPalette(imageData.data, palette)
  const gif = GIFEncoder()
  gif.writeFrame(index, width, height, { palette })
  gif.finish()
  return new Blob([gif.bytes()], { type: 'image/gif' })
}

async function exportBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  if (format.value === 'image/jpeg') {
    const flat = document.createElement('canvas')
    flat.width = canvas.width
    flat.height = canvas.height
    const fctx = flat.getContext('2d')!
    fctx.fillStyle = '#ffffff'
    fctx.fillRect(0, 0, flat.width, flat.height)
    fctx.drawImage(canvas, 0, 0)
    const blob = await canvasToBlob(flat, 'image/jpeg', quality.value)
    if (!blob) throw new Error('JPG export failed')
    return blob
  }

  if (format.value === 'image/bmp') {
    return encodeBmp(ctx.getImageData(0, 0, canvas.width, canvas.height))
  }

  if (format.value === 'image/gif') {
    return encodeGif(canvas)
  }

  if (format.value === 'image/x-icon') {
    const size = Math.min(canvas.width, canvas.height, 256)
    const iconCanvas = document.createElement('canvas')
    iconCanvas.width = size
    iconCanvas.height = size
    const ictx = iconCanvas.getContext('2d')!
    ictx.drawImage(canvas, 0, 0, size, size)
    const png = await canvasToBlob(iconCanvas, 'image/png')
    if (!png) throw new Error('ICO export failed')
    return encodeIcoFromPng(png, size, size)
  }

  if (format.value === 'image/avif') {
    const blob = await canvasToBlob(canvas, 'image/avif', quality.value)
    if (!blob) {
      throw new Error('AVIF export is not supported in this browser. Try Chrome/Edge, or choose WebP.')
    }
    return blob
  }

  if (format.value === 'image/svg+xml') {
    return encodeSvg(canvas)
  }

  const blob = await canvasToBlob(
    canvas,
    format.value,
    needsQuality.value ? quality.value : undefined,
  )
  if (!blob) throw new Error('Conversion failed')
  return blob
}

async function convertFiles(files: File[]) {
  error.value = ''
  note.value = ''
  progress.value = ''
  clearResults()
  if (!files.length) return

  const list = files.filter(isAllowedFile)
  if (!list.length) {
    error.value = 'Please choose supported image files.'
    return
  }
  if (list.length < files.length) {
    note.value = 'Some files were skipped because the type is not supported.'
  }
  if (list.some(f => f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif'))) {
    note.value = [note.value, 'GIF uses the first frame only.'].filter(Boolean).join(' ')
  }
  if (format.value === 'image/svg+xml') {
    note.value = [
      note.value,
      svgMode.value === 'trace'
        ? 'SVG trace is best for logos; photos are simplified.'
        : 'SVG embed keeps the raster look inside an SVG file.',
    ].filter(Boolean).join(' ')
  }

  busy.value = true
  const next: ResultItem[] = []
  try {
    for (let i = 0; i < list.length; i++) {
      const file = list[i]!
      progress.value = `Converting ${i + 1} / ${list.length}: ${file.name}`
      const canvas = await loadToCanvas(file)
      const blob = await exportBlob(canvas)
      const base = file.name.replace(/\.[^.]+$/, '')
      const name = `${base}.${extMap[format.value]}`
      next.push({
        id: `${file.name}-${i}-${Date.now()}`,
        sourceName: file.name,
        name,
        url: URL.createObjectURL(blob),
        size: blob.size,
        originalSize: file.size,
      })
    }
    results.value = next

    if (next.length > 1) {
      progress.value = 'Building ZIP…'
      const zip = new JSZip()
      for (const item of next) {
        const res = await fetch(item.url)
        zip.file(item.name, await res.blob())
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      zipUrl.value = URL.createObjectURL(zipBlob)
    }
    progress.value = ''
  }
  catch (e) {
    clearResults()
    error.value = e instanceof Error ? e.message : 'Conversion failed.'
  }
  finally {
    busy.value = false
    progress.value = ''
  }
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  await convertFiles(files)
  input.value = ''
}

onBeforeUnmount(() => {
  clearResults()
})
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <label v-if="!lockFormat" class="block text-sm font-medium text-slate-700">
      Output format
      <select v-model="format" class="mt-2 w-full rounded-md border border-slate-300 px-3 py-2">
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
        <option value="image/avif">AVIF</option>
        <option value="image/gif">GIF</option>
        <option value="image/bmp">BMP</option>
        <option value="image/x-icon">ICO</option>
        <option value="image/svg+xml">SVG</option>
      </select>
    </label>
    <p v-else class="text-sm text-slate-600">
      Output locked to <span class="font-semibold text-slate-900">{{ extMap[format].toUpperCase() }}</span>
    </p>

    <label v-if="format === 'image/svg+xml'" class="mt-4 block text-sm font-medium text-slate-700">
      SVG mode
      <select v-model="svgMode" class="mt-2 w-full rounded-md border border-slate-300 px-3 py-2">
        <option value="trace">Vectorize (trace paths) — best for logos</option>
        <option value="embed">Embed raster in SVG — keeps photo look</option>
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
      <span class="text-sm font-medium text-slate-700">Choose image(s) — batch supported</span>
      <input
        type="file"
        :accept="accept"
        multiple
        class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
        @change="onFileChange"
      >
    </label>

    <p class="mt-3 text-xs text-slate-500">
      Files stay on your device. Select multiple images for batch convert; download a ZIP when there is more than one result.
    </p>

    <p v-if="busy" class="mt-4 text-sm text-slate-600">{{ progress || 'Converting…' }}</p>
    <p v-if="note && !error" class="mt-4 text-sm text-amber-700">{{ note }}</p>
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="results.length" class="mt-6 space-y-3">
      <a
        v-if="zipUrl"
        :href="zipUrl"
        download="converted-images.zip"
        class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Download all (ZIP)
      </a>
      <ul class="space-y-2">
        <li
          v-for="item in results"
          :key="item.id"
          class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
        >
          <div>
            <p class="font-medium text-slate-900">{{ item.name }}</p>
            <p class="text-xs text-slate-500">
              {{ item.sourceName }} · {{ formatBytes(item.originalSize) }} → {{ formatBytes(item.size) }}
            </p>
          </div>
          <a
            :href="item.url"
            :download="item.name"
            class="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
          >
            Download
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
