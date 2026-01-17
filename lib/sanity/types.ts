import { PortableTextBlock } from '@portabletext/types'

export interface HeroImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
      }
    }
  }
  alt: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface HeroData {
  titleLines: string[]
  subtitle: string
  description: PortableTextBlock[]
  heroImage: HeroImage
  scrollIndicatorText?: string
}
