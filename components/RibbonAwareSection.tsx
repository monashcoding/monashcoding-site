import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RibbonAwareSectionProps {
  children: ReactNode
  /** Background color/gradient classes applied to the background layer (below ribbon) */
  backgroundClassName?: string
  /** Additional classes for the section container */
  className?: string
  /** Additional classes for the content wrapper (above ribbon) */
  contentClassName?: string
  /** HTML element to render as (default: section) */
  as?: 'section' | 'div' | 'article' | 'aside' | 'main' | 'footer'
}

/**
 * A section component that properly layers content above the global ribbon effect
 * while keeping the background below it.
 *
 * Layering:
 * - Background: z-0 (below ribbon at z-5)
 * - GlobalRibbons: z-5 (fixed, rendered separately)
 * - Content: z-10 (above ribbon)
 */
export function RibbonAwareSection({
  children,
  backgroundClassName,
  className,
  contentClassName,
  as: Component = 'section',
}: RibbonAwareSectionProps) {
  return (
    <Component className={cn('relative', className)}>
      {/* Background layer - sits below the ribbon (z-5) */}
      <div
        className={cn(
          'absolute inset-0 z-0',
          backgroundClassName
        )}
        aria-hidden="true"
      />
      {/* Content layer - sits above the ribbon (z-5) */}
      <div className={cn('relative z-10', contentClassName)}>
        {children}
      </div>
    </Component>
  )
}
