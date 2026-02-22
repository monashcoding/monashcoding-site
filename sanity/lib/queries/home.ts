import { groq } from 'next-sanity'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    titleLines,
    description,
    heroMedia[] {
      _key,
      _type,
      // Image fields
      image {
        asset->,
        hotspot,
        crop
      },
      // Video fields
      video {
        asset->
      },
      poster {
        asset->,
        hotspot,
        crop
      },
      alt
    },
    overlayOpacity,
    slideshowInterval,
    fadeDuration,
    scrollIndicatorText,
    showAnnouncements,
    announcementCycleDuration,
    announcements[] {
      _key,
      message
    }
  }
`

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    sections[] {
      _key,
      _type,
      // Sponsors section (data comes from sponsorPage, this is just a section marker)
      _type == "sponsorsSection" => {
        heading
      },
      // Events section
      _type == "eventsSection" => {
        heading,
        maxEvents
      },
      // Community section
      _type == "communitySection" => {
        heading,
        subheading,
        platforms,
        instagramReels[] {
          _key,
          url,
          pinned
        }
      },
    }
  }
`
