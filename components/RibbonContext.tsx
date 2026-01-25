'use client'

import { ReactNode } from 'react'

export interface RibbonPoint {
  x: number
  y: number
}

// Global store for ribbon data
let ribbonPoints: RibbonPoint[] = []
let ribbonThickness = 40

export function setRibbonPoints(points: RibbonPoint[], thickness: number) {
  ribbonPoints = points
  ribbonThickness = thickness
}

export function getRibbonPoints(): RibbonPoint[] {
  return ribbonPoints
}

export function getRibbonThickness(): number {
  return ribbonThickness
}

// Keep canvas ref for backwards compatibility
let ribbonCanvas: HTMLCanvasElement | null = null

export function setRibbonCanvas(canvas: HTMLCanvasElement | null) {
  ribbonCanvas = canvas
}

export function getRibbonCanvas(): HTMLCanvasElement | null {
  return ribbonCanvas
}

// Provider is just a pass-through
export function RibbonProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
