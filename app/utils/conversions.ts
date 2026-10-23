export type OutputFormat =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif'
  | 'image/gif'
  | 'image/bmp'
  | 'image/x-icon'
  | 'image/svg+xml'

export type ConversionLanding = {
  slug: string
  path: string
  title: string
  h1: string
  description: string
  defaultFormat: OutputFormat
  lockFormat?: boolean
  defaultSvgMode?: 'trace' | 'embed'
  accept?: string
  fromLabel: string
  toLabel: string
  compareRows: { label: string, from: string, to: string }[]
  faqs: { q: string, a: string }[]
}

export const CONVERSION_LANDINGS: ConversionLanding[] = [
  {
    slug: 'png-to-svg',
    path: '/tools/png-to-svg',
    title: 'PNG to SVG Converter Free (No Upload)',
    h1: 'PNG to SVG Converter',
    description: 'Convert PNG to SVG in your browser. Vectorize logos or embed the image — files never leave your device.',
    defaultFormat: 'image/svg+xml',
    lockFormat: true,
    defaultSvgMode: 'trace',
    accept: 'image/png,.png',
    fromLabel: 'PNG',
    toLabel: 'SVG',
    compareRows: [
      { label: 'Type', from: 'Raster (pixels)', to: 'Vector (paths) or SVG wrapper' },
      { label: 'Scales cleanly', from: 'No — blurs when enlarged', to: 'Yes for traced paths' },
      { label: 'Best for', from: 'Photos, screenshots, UI with detail', to: 'Logos, icons, simple graphics' },
      { label: 'Privacy here', from: 'Processed locally', to: 'Processed locally' },
    ],
    faqs: [
      {
        q: 'Is this a real vector SVG?',
        a: 'Use Vectorize (trace) for path-based SVG. Embed mode keeps the PNG pixels inside an SVG file for exact appearance.',
      },
      {
        q: 'Do you upload my PNG?',
        a: 'No. Conversion runs in your browser. Your file is not sent to our servers.',
      },
      {
        q: 'Why does my photo look simplified after tracing?',
        a: 'Tracing reduces colors into shapes. For photos, choose Embed mode or keep PNG/WebP instead.',
      },
    ],
  },
  {
    slug: 'jpg-to-webp',
    path: '/tools/jpg-to-webp',
    title: 'JPG to WebP Converter Free (No Upload)',
    h1: 'JPG to WebP Converter',
    description: 'Convert JPG/JPEG to WebP in your browser for smaller files. Nothing is uploaded.',
    defaultFormat: 'image/webp',
    lockFormat: true,
    accept: 'image/jpeg,.jpg,.jpeg',
    fromLabel: 'JPG',
    toLabel: 'WebP',
    compareRows: [
      { label: 'Typical size', from: 'Larger for similar quality', to: 'Often smaller than JPG' },
      { label: 'Browser support', from: 'Universal', to: 'Modern browsers' },
      { label: 'Transparency', from: 'No', to: 'Yes (when source has it)' },
      { label: 'Privacy here', from: 'Local only', to: 'Local only' },
    ],
    faqs: [
      {
        q: 'Will WebP look worse than JPG?',
        a: 'Usually you can keep similar quality at a smaller size. Use the quality slider if the result looks soft.',
      },
      {
        q: 'Can I convert multiple JPGs?',
        a: 'Yes. Select multiple files; download each result or a ZIP of all conversions.',
      },
    ],
  },
  {
    slug: 'png-to-jpg',
    path: '/tools/png-to-jpg',
    title: 'PNG to JPG Converter Free (No Upload)',
    h1: 'PNG to JPG Converter',
    description: 'Convert PNG to JPG in your browser. Transparent areas become white. No uploads.',
    defaultFormat: 'image/jpeg',
    lockFormat: true,
    accept: 'image/png,.png',
    fromLabel: 'PNG',
    toLabel: 'JPG',
    compareRows: [
      { label: 'Transparency', from: 'Supported', to: 'Not supported (filled with white here)' },
      { label: 'File size', from: 'Often larger for photos', to: 'Usually smaller for photos' },
      { label: 'Best for', from: 'Graphics with sharp edges', to: 'Photos and dense images' },
    ],
    faqs: [
      {
        q: 'What happens to transparent pixels?',
        a: 'They are flattened onto a white background before saving JPG.',
      },
      {
        q: 'Is my image uploaded?',
        a: 'No. Everything runs locally in your browser.',
      },
    ],
  },
]
