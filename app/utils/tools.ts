export type ToolMeta = {
  slug: string
  title: string
  description: string
  path: string
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'image-compress',
    title: 'Image Compress',
    description: 'Shrink JPG, PNG, and WebP in your browser. Files never leave your device.',
    path: '/tools/image-compress',
  },
  {
    slug: 'image-resize',
    title: 'Image Resize',
    description: 'Resize images to exact dimensions without uploading to a server.',
    path: '/tools/image-resize',
  },
  {
    slug: 'image-convert',
    title: 'Image Convert',
    description: 'Convert JPG, PNG, WebP, GIF, BMP, AVIF, ICO, and SVG locally in your browser.',
    path: '/tools/image-convert',
  },
  {
    slug: 'image-crop',
    title: 'Image Crop',
    description: 'Crop images to an exact region without uploading to a server.',
    path: '/tools/image-crop',
  },
  {
    slug: 'pdf-merge',
    title: 'PDF Merge',
    description: 'Combine multiple PDFs into one file locally in your browser.',
    path: '/tools/pdf-merge',
  },
  {
    slug: 'pdf-split',
    title: 'PDF Split',
    description: 'Extract a page range from a PDF entirely on your device.',
    path: '/tools/pdf-split',
  },
]

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
