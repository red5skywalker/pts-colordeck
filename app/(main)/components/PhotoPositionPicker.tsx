'use client'

import { useState, useRef, useEffect } from 'react'

interface PhotoPositionPickerProps {
  src: string
  initialPosition?: string
  initialScale?: number
  name?: string
  scaleName?: string
}

export default function PhotoPositionPicker({
  src,
  initialPosition = '50% 50%',
  initialScale = 1,
  name = 'photo_position',
  scaleName = 'photo_scale',
}: PhotoPositionPickerProps) {
  const parsePos = (pos: string) => {
    const m = pos.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
    return { x: m ? parseFloat(m[1]) : 50, y: m ? parseFloat(m[2]) : 50 }
  }

  const [pos, setPos] = useState(() => parsePos(initialPosition))
  const [scale, setScale] = useState(() => Math.max(1, Math.min(4, initialScale)))

  const containerRef = useRef<HTMLDivElement>(null)
  // Single-finger pan
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  // Multi-touch pinch
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null)

  // Non-passive wheel listener so we can preventDefault and prevent page scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.1 : -0.1
      setScale((s) => parseFloat(Math.max(1, Math.min(4, s + delta)).toFixed(2)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function getPinchDist() {
    const pts = Array.from(pointersRef.current.values())
    if (pts.length < 2) return null
    return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size === 1) {
      dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y }
    } else if (pointersRef.current.size === 2) {
      dragRef.current = null
      const dist = getPinchDist()
      if (dist) pinchRef.current = { dist, scale }
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const dist = getPinchDist()
      if (dist) {
        const next = pinchRef.current.scale * (dist / pinchRef.current.dist)
        setScale(parseFloat(Math.max(1, Math.min(4, next)).toFixed(2)))
      }
    } else if (pointersRef.current.size === 1 && dragRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100
      setPos({
        x: Math.round(Math.max(0, Math.min(100, dragRef.current.startPosX - dx))),
        y: Math.round(Math.max(0, Math.min(100, dragRef.current.startPosY - dy))),
      })
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(e.pointerId)
    pinchRef.current = null
    if (pointersRef.current.size === 0) {
      dragRef.current = null
    } else if (pointersRef.current.size === 1) {
      const [pt] = pointersRef.current.values()
      dragRef.current = { startX: pt.x, startY: pt.y, startPosX: pos.x, startPosY: pos.y }
    }
  }

  const positionString = `${pos.x}% ${pos.y}%`
  const scaleDisplay = scale.toFixed(1)

  return (
    <div className="photo-position-picker">
      <div
        ref={containerRef}
        className="photo-position-preview"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={src}
          alt="Reposition preview"
          style={{
            objectPosition: positionString,
            transform: `scale(${scale})`,
            transformOrigin: positionString,
          }}
          draggable={false}
        />
        <div className="photo-position-crosshair" aria-hidden="true" />
        <span className="photo-position-hint">
          {scale > 1 ? `${scaleDisplay}× · Drag to pan` : 'Drag or pinch to adjust'}
        </span>
      </div>

      <div className="photo-position-zoom-row">
        <span className="photo-position-zoom-icon" aria-hidden="true">−</span>
        <input
          className="photo-position-zoom-slider"
          type="range"
          min="1"
          max="4"
          step="0.05"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          aria-label="Zoom level"
        />
        <span className="photo-position-zoom-icon" aria-hidden="true">+</span>
        <span className="photo-position-zoom-value">{scaleDisplay}×</span>
      </div>

      <input type="hidden" name={name} value={positionString} />
      <input type="hidden" name={scaleName} value={scale} />
    </div>
  )
}
