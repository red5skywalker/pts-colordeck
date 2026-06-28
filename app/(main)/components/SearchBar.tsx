'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { COLORS, type PorscheColor } from '@/lib/colors'

export default function SearchBar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const [value, setValue] = useState(queryFromUrl)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setValue(queryFromUrl)
  }, [queryFromUrl, pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const results: PorscheColor[] = value.trim()
    ? COLORS.filter(
        (c) =>
          c.name.toLowerCase().includes(value.toLowerCase()) ||
          (c.code ?? '').toLowerCase().includes(value.toLowerCase()) ||
          c.family.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10)
    : []

  function navigate(query: string) {
    const params = new URLSearchParams(pathname === '/colors' ? searchParams.toString() : '')
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    const qs = params.toString()
    router.push(qs ? `/colors?${qs}` : '/colors')
  }

  function selectColor(color: PorscheColor) {
    setValue(color.name)
    setOpen(false)
    router.push(`/colors/${color.slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === 'Enter') navigate(value)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[highlighted]) selectColor(results[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <label className="sr-only" htmlFor="globalSearch">
        Search paint, code, model, year
      </label>
      <input
        id="globalSearch"
        type="search"
        placeholder="Search paint, code, model, year"
        value={value}
        autoComplete="off"
        onChange={(e) => {
          const next = e.target.value
          setValue(next)
          setHighlighted(0)
          setOpen(next.trim().length > 0)
          navigate(next)
        }}
        onFocus={() => { if (value.trim()) setOpen(true) }}
        onKeyDown={handleKeyDown}
      />
      {open && results.length > 0 && (
        <ul className="color-picker-dropdown" role="listbox" style={{ zIndex: 300 }}>
          {results.map((color, i) => (
            <li
              key={color.slug}
              className={`color-picker-option${i === highlighted ? ' highlighted' : ''}`}
              role="option"
              aria-selected={i === highlighted}
              onMouseDown={() => selectColor(color)}
              onMouseEnter={() => setHighlighted(i)}
            >
              <span
                className="color-picker-swatch"
                style={{ background: `linear-gradient(135deg, ${color.hex[0]}, ${color.hex[1]})` }}
              />
              <span className="color-picker-label">
                <strong>{color.name}</strong>
                <span>{color.code ? `${color.code} · ` : ''}{color.rarityCategory}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
