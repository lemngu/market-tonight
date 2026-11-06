const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
const extensions: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' }

// Windows can leave File.type empty for exported SVGs. The server still validates
// the actual bytes before storing anything; this only selects the decoder.
export function imageTypeForFile(file: { name: string; type: string }) {
  const type = file.type.toLowerCase().split(';')[0].trim()
  if (supportedTypes.has(type)) return type
  if (type === '' || type === 'application/octet-stream') return extensions[file.name.split('.').pop()?.toLowerCase() || ''] || null
  return null
}
