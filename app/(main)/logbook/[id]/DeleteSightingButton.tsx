'use client'

import { useState, useTransition } from 'react'
import { deleteSighting } from '@/app/actions'

export default function DeleteSightingButton({ sightingId }: { sightingId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="ghost-button"
          style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
          disabled={isPending}
          onClick={() => startTransition(async () => { await deleteSighting(sightingId) })}
        >
          {isPending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          className="ghost-button"
          disabled={isPending}
          onClick={() => setConfirming(false)}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      className="ghost-button"
      style={{ color: 'var(--red)' }}
      onClick={() => setConfirming(true)}
    >
      Delete sighting
    </button>
  )
}
