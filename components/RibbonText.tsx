'use client'

import { useEffect, useRef, useState } from 'react'
import { getRibbonPoints, getRibbonThickness, RibbonPoint } from '@/components/RibbonContext'

// Generate SVG path from ribbon points (matches WebGL shader taper logic)
function generateRibbonPath(points: RibbonPoint[], thickness: number): string {
  if (points.length < 2) return ''

  const count = points.length

  // Calculate normals and offset points with dynamic thickness
  const upperPoints: { x: number; y: number }[] = []
  const lowerPoints: { x: number; y: number }[] = []

  for (let i = 0; i < count; i++) {
    const curr = points[i]
    const prev = points[i - 1] || curr
    const next = points[i + 1] || curr

    // Calculate tangent direction
    const dx = next.x - prev.x
    const dy = next.y - prev.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1

    // Normal perpendicular to tangent
    const nx = -dy / len
    const ny = dx / len

    // UV.y goes from 0 to 1 along the ribbon
    const uvY = i / (count - 1)

    // Match shader: mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0))
    const t = Math.pow(Math.abs(uvY - 0.5) * 2.0, 2.0)
    const taperFactor = 1.0 * (1 - t) + 0.1 * t // mix(1.0, 0.1, t)

    // Match shader: smoothstep(0.0, 0.02, dist) - thinner when points are close
    const dist = Math.sqrt((next.x - prev.x) ** 2 + (next.y - prev.y) ** 2)
    const smoothDist = Math.min(1, Math.max(0, dist / 20)) // approximate smoothstep

    const dynamicThickness = (thickness / 2) * taperFactor * smoothDist

    upperPoints.push({ x: curr.x + nx * dynamicThickness, y: curr.y + ny * dynamicThickness })
    lowerPoints.push({ x: curr.x - nx * dynamicThickness, y: curr.y - ny * dynamicThickness })
  }

  // Build SVG path: upper edge forward, lower edge backward
  let path = `M ${upperPoints[0].x} ${upperPoints[0].y}`
  for (let i = 1; i < upperPoints.length; i++) {
    path += ` L ${upperPoints[i].x} ${upperPoints[i].y}`
  }
  for (let i = lowerPoints.length - 1; i >= 0; i--) {
    path += ` L ${lowerPoints[i].x} ${lowerPoints[i].y}`
  }
  path += ' Z'

  return path
}

// Shared hook for ribbon clip path
function useRibbonClipPath(containerRef: React.RefObject<HTMLElement | null>) {
  const [clipPath, setClipPath] = useState<string>('')
  const clipIdRef = useRef(`ribbon-clip-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    let animationId: number

    const updateClip = () => {
      const points = getRibbonPoints()
      const thickness = getRibbonThickness()

      if (containerRef.current && points.length > 1) {
        const rect = containerRef.current.getBoundingClientRect()

        // Transform points to be relative to this element
        const relativePoints = points.map(p => ({
          x: p.x - rect.left,
          y: p.y - rect.top
        }))

        const path = generateRibbonPath(relativePoints, thickness)
        setClipPath(path)
      }

      animationId = requestAnimationFrame(updateClip)
    }

    updateClip()
    return () => cancelAnimationFrame(animationId)
  }, [containerRef])

  return { clipPath, clipId: clipIdRef.current }
}

// Inline text that changes color where the ribbon overlaps
export function RibbonText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const { clipPath, clipId } = useRibbonClipPath(containerRef)

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d={clipPath || 'M0 0'} />
          </clipPath>
        </defs>
      </svg>
      <span className="text-white">{children}</span>
      <span
        className="absolute inset-0 text-[#252525]"
        style={{ clipPath: `url(#${clipId})` }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}

// Block-level content that changes color where the ribbon overlaps
export function RibbonBlock({ children, className = '', darkClass = 'text-[#252525]' }: { children: React.ReactNode; className?: string; darkClass?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { clipPath, clipId } = useRibbonClipPath(containerRef)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d={clipPath || 'M0 0'} />
          </clipPath>
        </defs>
      </svg>
      <div>{children}</div>
      <div
        className={`absolute inset-0 ${darkClass}`}
        style={{ clipPath: `url(#${clipId})` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}
