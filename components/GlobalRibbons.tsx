'use client'

import { memo } from 'react'
import dynamic from 'next/dynamic'
import { setRibbonCanvas, setRibbonPoints, RibbonPoint } from './RibbonContext'

const Ribbons = dynamic(() => import('@/components/Ribbons'), { ssr: false })

export { RibbonProvider } from './RibbonContext'

// Stable references to prevent useEffect re-runs
const RIBBON_COLORS = ['#FFE330']
const RIBBON_BACKGROUND: number[] = [0, 0, 0, 0]
const RIBBON_CONFIG = {
  baseSpring: 0.03,
  baseFriction: 0.9,
  baseThickness: 40,
  offsetFactor: 0,
  maxAge: 500,
  pointCount: 50,
  speedMultiplier: 0.6,
  enableFade: false,
  enableShaderEffect: false,
  effectAmplitude: 2,
} as const

function handlePointsUpdate(points: RibbonPoint[], thickness: number) {
  setRibbonPoints(points, thickness)
}

// Memoized to prevent re-renders from parent
// The Ribbons component renders directly to document.body, bypassing React entirely
export const GlobalRibbons = memo(function GlobalRibbons() {
  return (
    <Ribbons
      colors={RIBBON_COLORS}
      backgroundColor={RIBBON_BACKGROUND}
      {...RIBBON_CONFIG}
      onCanvasReady={setRibbonCanvas}
      onPointsUpdate={handlePointsUpdate}
    />
  )
})
