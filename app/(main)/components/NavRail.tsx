'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { key: 'logbook', href: '/logbook', label: 'Overview', icon: '01' },
  { key: 'colors', href: '/colors', label: 'Archive', icon: '02' },
  { key: 'new', href: '/logbook/new', label: 'Sighting', icon: '03' },
  { key: 'collection', href: '/collection', label: 'Collection', icon: '04' },
  { key: 'profile', href: '/profile', label: 'Profile', icon: '05' },
] as const

function isActive(pathname: string, href: string, key: string) {
  if (key === 'logbook') {
    return pathname === href || (pathname.startsWith('/logbook') && !pathname.includes('/new'))
  }

  if (key === 'new') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NavRail() {
  const pathname = usePathname()

  return (
    <nav className="nav-list" aria-label="Primary">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`nav-link ${isActive(pathname, item.href, item.key) ? 'active' : ''}`}
        >
          <span>{item.label}</span>
          <span className="nav-icon">{item.icon}</span>
        </Link>
      ))}
    </nav>
  )
}
