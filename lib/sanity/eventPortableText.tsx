'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

const eventBodyComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="rounded-xl w-full h-auto"
          />
          {value.caption && (
            <figcaption className="text-white/50 text-sm mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-white/70 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 my-6 text-white/60 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside text-white/70 mb-4 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside text-white/70 mb-4 space-y-1">
        {children}
      </ol>
    ),
  },
}

interface EventBodyProps {
  value: PortableTextBlock[]
  className?: string
}

export function EventBody({ value, className }: EventBodyProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={eventBodyComponents} />
    </div>
  )
}
