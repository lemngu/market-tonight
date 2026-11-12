'use client'
import { useRef, useState } from 'react'
import { fleaMarketZones } from '@/lib/flea-market'

export default function FleaMarketTabs() {
  const [selected, setSelected] = useState(0)
  const panel = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const choose = (index: number) => {
    setSelected(index)
    const top = panel.current?.getBoundingClientRect().top ?? 0
    if (top < 0) panel.current?.scrollIntoView({ block: 'start' })
  }
  return <div className="flea-market-browser" ref={panel}>
    <div className="flea-zone-tabs" role="tablist" aria-label="플리마켓 구역">
      {fleaMarketZones.map((zone, index) => <button key={zone.id} ref={element => { buttons.current[index] = element }} type="button" role="tab" id={'tab-' + zone.id}
        aria-selected={selected === index} aria-controls={'panel-' + zone.id} tabIndex={selected === index ? 0 : -1}
        onClick={() => choose(index)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? fleaMarketZones.length - 1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + fleaMarketZones.length) % fleaMarketZones.length
          choose(next); buttons.current[next]?.focus()
        }}>{zone.name}</button>)}
    </div>
    {fleaMarketZones.map((zone, index) => <section className="flea-market-zone" key={zone.id} id={'panel-' + zone.id} role="tabpanel" aria-labelledby={'tab-' + zone.id} hidden={selected !== index} tabIndex={0}>
      <h3>{zone.name}<span>{zone.booths.length}개 부스</span></h3>
      <table><caption className="sr-only">{zone.name} 부스 목록</caption><thead><tr><th scope="col">부스 번호</th><th scope="col">부스명</th></tr></thead>
        <tbody>{zone.booths.map(booth => <tr key={booth.number}><th scope="row">{booth.number.replace(/^가/, '가로').replace(/^세/, '세로')}</th><td>{booth.name}</td></tr>)}</tbody>
      </table>
    </section>)}
  </div>
}
