import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'
import type { SanityImage } from '@/lib/sanity/types'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImage | SanityImage['asset']) {
  return builder.image(source)
}
