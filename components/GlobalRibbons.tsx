'use client'

import dynamic from 'next/dynamic'
import { setRibbonCanvas, setRibbonPoints, RibbonPoint } from './RibbonContext'

const Ribbons = dynamic(() => import('@/components/Ribbons'), { ssr: false })

export { RibbonProvider } from './RibbonContext'

function handlePointsUpdate(points: RibbonPoint[], thickness: number) {
  setRibbonPoints(points, thickness)
}

export function GlobalRibbons() {
  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      <Ribbons
        colors={['#FFE330']}
        baseSpring={0.03}
        baseFriction={0.9}
        baseThickness={40}
        offsetFactor={0}
        maxAge={500}
        pointCount={50}
        speedMultiplier={0.6}
        enableFade={false}
        enableShaderEffect={false}
        effectAmplitude={2}
        onCanvasReady={setRibbonCanvas}
        onPointsUpdate={handlePointsUpdate}
      />
    </div>
  )
}
