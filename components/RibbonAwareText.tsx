'use client'

import { ReactNode } from 'react'

interface RibbonAwareTextProps {
  children: ReactNode
  className?: string
  lightColor?: string
}

/**
 * Text component - ribbon color change effect removed for now due to performance.
 * This is a placeholder for future implementation.
 */
export function RibbonAwareText({
  children,
  className = '',
  lightColor = 'text-white',
}: RibbonAwareTextProps) {
  return (
    <span className={`${lightColor} ${className}`}>
      {children}
    </span>
  )
}
