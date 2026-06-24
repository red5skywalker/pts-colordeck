'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface ColorFiltersProps {
  families: string[]
  rarities: string[]
}

export default function ColorFilters({ families, rarities }: ColorFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeFamily = searchParams.get('family') ?? 'All'
  const activeRarity = searchParams.get('rarity') ?? 'All'

  function updateParam(key: 'family' | 'rarity', value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'All') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const query = params.toString()
    router.push(query ? `/colors?${query}` : '/colors')
  }

  return (
    <aside className="filter-panel" aria-label="Archive filters">
      <div>
        <h2>Filters</h2>
        <p>Refine the archive by color family, rarity tier, or collection status.</p>
      </div>
      <div>
        <p className="filter-label">Family</p>
        <div className="filter-row vertical">
          {families.map((family) => (
            <button
              key={family}
              type="button"
              className={`chip-button ${family === activeFamily ? 'active' : ''}`}
              onClick={() => updateParam('family', family)}
            >
              {family}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="filter-label">Rarity</p>
        <div className="filter-row vertical">
          {rarities.map((rarity) => (
            <button
              key={rarity}
              type="button"
              className={`chip-button ${rarity === activeRarity ? 'active' : ''}`}
              onClick={() => updateParam('rarity', rarity)}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
