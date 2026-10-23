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
    slug: 'pdf-merge',
    title: 'PDF Merge',
    description: 'Combine multiple PDFs into one file locally in your browser.',
    path: '/tools/pdf-merge',
  },
]

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
