'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const [value, setValue] = useState(queryFromUrl)

  useEffect(() => {
    setValue(queryFromUrl)
  }, [queryFromUrl, pathname])

  function updateSearch(nextValue: string) {
    setValue(nextValue)

    const params = new URLSearchParams(pathname === '/colors' ? searchParams.toString() : '')
    if (nextValue) {
      params.set('q', nextValue)
    } else {
      params.delete('q')
    }

    const query = params.toString()
    const targetPath = pathname === '/colors' ? '/colors' : '/colors'
    router.push(query ? `${targetPath}?${query}` : targetPath)
  }

  return (
    <>
      <label className="sr-only" htmlFor="globalSearch">
        Search paint, code, model, year
      </label>
      <input
        id="globalSearch"
        type="search"
        placeholder="Search paint, code, model, year"
        value={value}
        onChange={(event) => updateSearch(event.target.value)}
      />
    </>
  )
}
