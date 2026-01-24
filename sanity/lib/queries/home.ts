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
      // Story section
      _type == "storySection" => {
        heading,
        items[] {
          _key,
          year,
          title,
          content
        }
      },
      // Instagram section
      _type == "instagramSection" => {
        heading,
        handle,
        url,
        postCount
      },
      // Sponsors section
      _type == "sponsorsSection" => {
        heading,
        description,
        sponsors[] {
          _key,
          name,
          x,
          y
        }
      },
      // Footer section
      _type == "footerSection" => {
        brandName,
        tagline,
        columns[] {
          _key,
          title,
          links[] {
            _key,
            label,
            url,
            isExternal
          }
        },
        instagramUrl,
        linkedinUrl
      }
    }
  }
`
