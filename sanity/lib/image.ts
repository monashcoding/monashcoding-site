import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import { SanityImage } from '@/lib/sanity/types'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage | SanityImage['asset']) {
  return builder.image(source)
}
