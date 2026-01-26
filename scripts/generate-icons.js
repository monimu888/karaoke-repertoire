import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sizes = [192, 512]

const generateSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#6366F1"/>
  <g transform="translate(${size * 0.25}, ${size * 0.15})">
    <rect x="${size * 0.15}" y="0" width="${size * 0.2}" height="${size * 0.4}" rx="${size * 0.1}" fill="white"/>
    <path d="M${size * 0.05} ${size * 0.2} Q${size * 0.05} ${size * 0.5} ${size * 0.25} ${size * 0.5} Q${size * 0.45} ${size * 0.5} ${size * 0.45} ${size * 0.2}" stroke="white" stroke-width="${size * 0.04}" fill="none"/>
    <line x1="${size * 0.25}" y1="${size * 0.5}" x2="${size * 0.25}" y2="${size * 0.65}" stroke="white" stroke-width="${size * 0.04}"/>
    <line x1="${size * 0.1}" y1="${size * 0.65}" x2="${size * 0.4}" y2="${size * 0.65}" stroke="white" stroke-width="${size * 0.04}" stroke-linecap="round"/>
  </g>
</svg>
`

const outputDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  for (const size of sizes) {
    const svg = generateSVG(size)
    const pngFilename = `icon-${size}x${size}.png`

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(outputDir, pngFilename))

    console.log(`Generated: ${pngFilename}`)
  }
  console.log('All icons generated!')
}

generateIcons().catch(console.error)
