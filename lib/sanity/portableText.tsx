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

// --- About Us Portable Text utilities ---

/** Extract plain text and bold ranges from Portable Text blocks (for TypewriterText) */
export function blocksToTextAndBoldRanges(blocks: PortableTextBlock[]): {
  text: string
  boldRanges: [number, number][]
} {
  let text = ''
  const boldRanges: [number, number][] = []
  for (const block of blocks) {
    if (block._type !== 'block') continue
    const children = (block as { children?: { text?: string; marks?: string[] }[] }).children
    if (!children) continue
    for (const child of children) {
      const childText = child.text || ''
      if (child.marks?.includes('strong')) {
        boldRanges.push([text.length, text.length + childText.length])
      }
      text += childText
    }
  }
  return { text, boldRanges }
}

/** Helper to construct a Portable Text block for default/fallback data */
export function ptBlock(
  ...segments: (string | [string, ...string[]])[]
): PortableTextBlock {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 8),
    style: 'normal',
    markDefs: [],
    children: segments.map((seg, i) => {
      if (typeof seg === 'string') {
        return { _type: 'span', _key: `s${i}`, text: seg, marks: [] }
      }
      const [text, ...marks] = seg
      return { _type: 'span', _key: `s${i}`, text, marks }
    }),
  } as unknown as PortableTextBlock
}

/**
 * Convert a legacy markdown-style string (**bold**, __underline__) to Portable Text blocks.
 * Paragraphs are split on double newlines. If the value is already a PT block array, returns as-is.
 */
export function toPortableTextBlocks(value: string | PortableTextBlock[]): PortableTextBlock[] {
  if (Array.isArray(value)) return value

  return value.split('\n\n').map((paragraph) => {
    const segments: (string | [string, ...string[]])[] = []

    // Split on **bold** markers first
    const boldParts = paragraph.split(/\*\*(.+?)\*\*/g)
    for (let i = 0; i < boldParts.length; i++) {
      const isBold = i % 2 === 1
      const part = boldParts[i]
      if (!part) continue

      // Within each part, split on __underline__ markers
      const underlineParts = part.split(/__(.+?)__/g)
      for (let j = 0; j < underlineParts.length; j++) {
        const isUnderline = j % 2 === 1
        const text = underlineParts[j]
        if (!text) continue

        const marks: string[] = []
        if (isBold) marks.push('strong')
        if (isUnderline) marks.push('underline')

        if (marks.length > 0) {
          segments.push([text, ...marks])
        } else {
          segments.push(text)
        }
      }
    }

    return ptBlock(...segments)
  })
}
