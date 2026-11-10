'use client'
import { useEffect, useId, useRef, useState } from 'react'

export default function MenuSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const choices = [{ value: '', label: '전체 메뉴' }, ...options.map(value => ({ value, label: value }))]
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  const focusOption = (index: number) => requestAnimationFrame(() => root.current?.querySelectorAll<HTMLButtonElement>('[role=option]')[index]?.focus())
  return <div className="menu-filter custom-menu-select" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false) }}>

    <button ref={trigger} id="route-menu-select" type="button" className="menu-select-trigger" aria-label={'메뉴 선택: ' + (value || '전체 메뉴')} aria-haspopup="listbox" aria-controls={id + '-list'} aria-expanded={open} onClick={() => setOpen(!open)} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); focusOption(event.key === 'ArrowDown' ? Math.max(0, choices.findIndex(choice => choice.value === value)) : choices.length - 1) }
      if (event.key === 'Escape') setOpen(false)
    }}><span id={id + '-value'}>{value || '전체 메뉴'}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg></button>
    {open && <div id={id + '-list'} className="menu-select-list" role="listbox" aria-label="메뉴 목록" onKeyDown={event => {
      const focused = [...event.currentTarget.querySelectorAll('button')].indexOf(document.activeElement as HTMLButtonElement)
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); focusOption(event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (focused + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length) }
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus() }
    }}>{choices.map(choice => <button type="button" role="option" data-ga-event="route_menu_select" data-ga-item={choice.value ? "representative_menu" : "all_menus"} aria-selected={value === choice.value} key={choice.value} onClick={() => { onChange(choice.value); setOpen(false); trigger.current?.focus() }}><span>{choice.label}</span>{value === choice.value && <span aria-hidden="true">✓</span>}</button>)}</div>}
  </div>
}

