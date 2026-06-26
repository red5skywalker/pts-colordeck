'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchableSelectProps {
  items: string[]
  name: string
  placeholder?: string
  initialValue?: string
}

export default function SearchableSelect({
  items,
  name,
  placeholder = 'Search…',
  initialValue = '',
}: SearchableSelectProps) {
  const [query, setQuery] = useState(initialValue)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Value submitted with the form — only set when user actually picks an item
  // If they typed something that exactly matches an item, accept it too
  const confirmedValue =
    items.includes(query) ? query : ''

  const results = query.trim()
    ? items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 16)
    : items.slice(0, 16)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(item: string) {
    setQuery(item)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
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
      if (results[highlighted]) select(results[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="color-picker" ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value)
          setHighlighted(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {/* Submit the typed value directly — models list is text, not slugs */}
      <input type="hidden" name={name} value={query.trim()} />
      {open && (
        <ul className="color-picker-dropdown" role="listbox">
          {results.length === 0 ? (
            <li className="color-picker-empty">No matches for &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((item, i) => (
              <li
                key={item}
                className={`color-picker-option${i === highlighted ? ' highlighted' : ''}`}
                role="option"
                aria-selected={item === query}
                onMouseDown={() => select(item)}
                onMouseEnter={() => setHighlighted(i)}
              >
                {item}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
