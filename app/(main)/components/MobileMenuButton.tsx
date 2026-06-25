'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function MobileMenuButton() {
  const pathname = usePathname()

  useEffect(() => {
    document.body.classList.remove('nav-open')
  }, [pathname])

  return (
    <>
      <button
        className="icon-button mobile-menu"
        type="button"
        aria-label="Open navigation"
        onClick={() => document.body.classList.toggle('nav-open')}
      >
        <span />
        <span />
        <span />
      </button>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="nav-backdrop"
        aria-hidden="true"
        onClick={() => document.body.classList.remove('nav-open')}
      />
    </>
  )
}
