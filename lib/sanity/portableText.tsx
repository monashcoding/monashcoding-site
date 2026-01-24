'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'

const heroDescriptionComponents: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => (
      <span className="bg-accent px-1 py-0.5 text-accent-foreground">{children}</span>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

interface HeroDescriptionProps {
  value: PortableTextBlock[]
  className?: string
}

export function HeroDescription({ value, className }: HeroDescriptionProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={heroDescriptionComponents} />
    </div>
  )
}
