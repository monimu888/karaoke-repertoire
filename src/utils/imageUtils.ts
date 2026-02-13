const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 0.8

const HEIC_TYPES = ['image/heic', 'image/heif']

function isHeic(file: File): boolean {
  if (HEIC_TYPES.includes(file.type)) return true
  const ext = file.name.toLowerCase()
  return ext.endsWith('.heic') || ext.endsWith('.heif')
}

async function convertHeicToJpeg(file: File): Promise<Blob> {
  const { default: heic2any } = await import('heic2any')
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: QUALITY,
  })
  return Array.isArray(result) ? result[0] : result
}

function resizeBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        'image/jpeg',
        QUALITY
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })
}

export async function resizeImage(file: File): Promise<Blob> {
  const source = isHeic(file) ? await convertHeicToJpeg(file) : file
  return resizeBlob(source)
}

export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob)
}

export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url)
}
