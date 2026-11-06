import sharp from 'sharp'
import { htmlToDOM, Element, type DOMNode } from 'html-react-parser'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_UPLOAD_BYTES = MAX_IMAGE_BYTES + 256 * 1024
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
export class ImageUploadError extends Error {}
const svgTags = new Set('svg g defs path rect circle ellipse line polyline polygon text tspan textPath title desc linearGradient radialGradient stop clipPath mask pattern symbol use style'.split(' '))
const svgAttributes = new Set(('id class style version baseProfile enable-background xmlns xmlns:xlink xml:space x y x1 x2 y1 y2 dx dy width height viewBox preserveAspectRatio d points r rx ry cx cy fill fill-opacity fill-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset opacity transform gradientTransform gradientUnits spreadMethod offset stop-color stop-opacity clip-path clip-rule clipPathUnits mask maskUnits maskContentUnits patternUnits patternContentUnits patternTransform href xlink:href font-family font-size font-weight font-style text-anchor dominant-baseline alignment-baseline letter-spacing word-spacing textLength lengthAdjust startOffset method spacing display visibility color vector-effect overflow').split(' '))
const escapeXML = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function checkCSS(value: string) {
  // No CSS imports, escapes, comments or external resources, including file URLs.
  if (/[\\@<>]|\/\*|expression\s*\(|(?:https?|file|data|javascript):/i.test(value)) throw new ImageUploadError('SVG에 외부 파일 참조 또는 지원하지 않는 스타일이 있습니다. PNG나 WebP로 내보낸 파일을 첨부해주세요.')
  const rest = value.replace(/url\(\s*(['"]?)#[\p{L}\p{N}\p{M}_.:-]+\1\s*\)/giu, '')
  if (/url\s*\(/i.test(rest)) throw new ImageUploadError('SVG가 외부 이미지를 참조하고 있습니다. 이미지를 포함한 PNG나 WebP로 내보내주세요.')
}

export function sanitizeSVG(bytes: Buffer) {
  const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '').replace(/^\s*<\?xml\s[^?]*\?>/, '')
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(source)) throw new ImageUploadError('SVG의 외부 문서 선언은 지원하지 않습니다. DTD 없이 다시 내보내거나 PNG로 첨부해주세요.')
  const nodes = htmlToDOM(source, { xmlMode: true, decodeEntities: true })
  let count = 0
  function serialize(node: DOMNode, depth = 0): string {
    if (++count > 50_000 || depth > 100) throw new Error('SVG is too complex')
    if (node.type === 'comment') return ''
    if (node.type === 'text') return escapeXML(node.data)
    if (!(node instanceof Element) || !svgTags.has(node.name)) throw new ImageUploadError('SVG에 지원하지 않는 요소가 있습니다. PNG나 WebP로 내보내서 첨부해주세요.')
    const attributes = Object.entries(node.attribs).map(([key, value]) => {
      // Illustrator uses data-name for layer labels. These are inert metadata,
      // not event handlers or resource references; retain them without changing artwork.
      if (/^data-[a-zA-Z0-9_.:-]+$/.test(key)) return ` ${key}="${escapeXML(value)}"`
      if (!svgAttributes.has(key)) throw new ImageUploadError(`SVG 속성 '${key}'은 지원하지 않습니다. PNG나 WebP로 내보내서 첨부해주세요.`)
      if (key === 'xmlns' && value !== 'http://www.w3.org/2000/svg') throw new Error('Invalid namespace')
      if (key === 'xmlns:xlink' && value !== 'http://www.w3.org/1999/xlink') throw new Error('Invalid namespace')
      if ((key === 'href' || key === 'xlink:href') && !/^#[\p{L}\p{N}\p{M}_.:-]+$/u.test(value)) throw new ImageUploadError('SVG의 외부 링크는 지원하지 않습니다. 이미지를 포함한 PNG나 WebP로 내보내주세요.')
      if (key !== 'xmlns' && key !== 'xmlns:xlink') checkCSS(value)
      return ` ${key}="${escapeXML(value)}"`
    }).join('')
    if (node.name === 'style') {
      if (node.children.some(child => child.type !== 'text')) throw new Error('Invalid SVG style')
      checkCSS(node.children.map(child => child.type === 'text' ? child.data : '').join(''))
    }
    return `<${node.name}${attributes}>${node.children.map(child => serialize(child as DOMNode, depth + 1)).join('')}</${node.name}>`
  }
  const roots = nodes.filter(node => node.type !== 'comment' && !(node.type === 'text' && !node.data.trim()))
  if (roots.length !== 1 || !('name' in roots[0]) || roots[0].name !== 'svg') throw new Error('Invalid SVG root')
  // Serialize only validated nodes; never pass the original XML to the renderer.
  return Buffer.from(serialize(roots[0]))
}

export async function convertImage(bytes: Buffer, type: string) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES || !IMAGE_TYPES.includes(type)) throw new Error('Invalid image')
  const safeBytes = type === 'image/svg+xml' ? sanitizeSVG(bytes) : bytes
  const input = sharp(safeBytes, { limitInputPixels: 40_000_000 }).timeout({ seconds: 10 })
  const metadata = await input.metadata()
  const expected: Record<string, string> = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg' }
  if (metadata.format !== expected[type] || (metadata.pages ?? 1) > 1 || !metadata.width || !metadata.height || metadata.width > 20_000 || metadata.height > 20_000 || metadata.width * metadata.height > 40_000_000) throw new Error('Invalid image dimensions or format')
  // SVG is rasterized: scripts, XML and external references are never served.
  return input.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer({ resolveWithObject: true })
}

export async function readUploadForm(request: Request) {
  if (Number(request.headers.get('content-length')) > MAX_UPLOAD_BYTES) throw new Error('UPLOAD_TOO_LARGE')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Empty upload')
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > MAX_UPLOAD_BYTES) { await reader.cancel(); throw new Error('UPLOAD_TOO_LARGE') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData()
}
