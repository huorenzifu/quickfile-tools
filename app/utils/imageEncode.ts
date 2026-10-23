/** Encode ImageData as 24-bit BMP (no compression). */
export function encodeBmp(imageData: ImageData): Blob {
  const { width, height, data } = imageData
  const rowSize = Math.ceil((width * 3) / 4) * 4
  const pixelSize = rowSize * height
  const fileSize = 54 + pixelSize
  const buf = new ArrayBuffer(fileSize)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)

  // BITMAPFILEHEADER
  view.setUint16(0, 0x4d42, true) // 'BM'
  view.setUint32(2, fileSize, true)
  view.setUint32(10, 54, true)
  // BITMAPINFOHEADER
  view.setUint32(14, 40, true)
  view.setInt32(18, width, true)
  view.setInt32(22, height, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(30, 0, true)
  view.setUint32(34, pixelSize, true)

  let offset = 54
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      u8[offset++] = data[i + 2]! // B
      u8[offset++] = data[i + 1]! // G
      u8[offset++] = data[i]! // R
    }
    offset += rowSize - width * 3
  }

  return new Blob([buf], { type: 'image/bmp' })
}

/** Single-image ICO wrapping a PNG blob (Vista+). */
export async function encodeIcoFromPng(png: Blob, width: number, height: number): Promise<Blob> {
  const pngBytes = new Uint8Array(await png.arrayBuffer())
  const w = width >= 256 ? 0 : width
  const h = height >= 256 ? 0 : height
  const header = new ArrayBuffer(22)
  const view = new DataView(header)
  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type icon
  view.setUint16(4, 1, true) // count
  view.setUint8(6, w)
  view.setUint8(7, h)
  view.setUint8(8, 0)
  view.setUint8(9, 0)
  view.setUint16(10, 1, true)
  view.setUint16(12, 32, true)
  view.setUint32(14, pngBytes.byteLength, true)
  view.setUint32(18, 22, true)
  return new Blob([header, pngBytes], { type: 'image/x-icon' })
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}
