import type { SiteCopy } from '@/lib/content-schema'
import { festivalArtwork } from '@/lib/festival-artwork'
import ZoomableMap from './ZoomableMap'

export default function MarketMap({ copy, compact = false }: { copy: SiteCopy['mapPage']; compact?: boolean }) {
  return <ZoomableMap image={copy.image || festivalArtwork.map} compact={compact} />
}
