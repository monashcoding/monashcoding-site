declare module '@/components/Ribbons' {
  interface RibbonPoint {
    x: number
    y: number
  }

  interface RibbonsProps {
    colors?: string[]
    baseSpring?: number
    baseFriction?: number
    baseThickness?: number
    offsetFactor?: number
    maxAge?: number
    pointCount?: number
    speedMultiplier?: number
    enableFade?: boolean
    enableShaderEffect?: boolean
    effectAmplitude?: number
    backgroundColor?: number[]
    onCanvasReady?: ((canvas: HTMLCanvasElement) => void) | null
    onPointsUpdate?: ((points: RibbonPoint[], thickness: number) => void) | null
  }

  const Ribbons: React.FC<RibbonsProps>
  export default Ribbons
}
