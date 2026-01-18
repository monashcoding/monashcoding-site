import { defineType, defineField } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'titleLines',
      title: 'Title Lines',
      description: 'Each line of the main hero title (displayed one per line)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Main description paragraph with highlight support',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Highlight', value: 'highlight' },
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'heroMedia',
      title: 'Hero Media',
      description: 'Images or videos that will fade between each other in sequence. Add multiple items for a slideshow effect.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroImage',
          title: 'Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              media: 'image',
              alt: 'alt',
            },
            prepare({ media, alt }) {
              return {
                title: alt || 'Image',
                subtitle: 'Image',
                media,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'heroVideo',
          title: 'Video',
          fields: [
            {
              name: 'video',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'poster',
              title: 'Poster Image',
              description: 'Image shown while video loads (optional)',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'alt',
              title: 'Alt Text / Description',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              alt: 'alt',
              poster: 'poster',
            },
            prepare({ alt, poster }) {
              return {
                title: alt || 'Video',
                subtitle: 'Video',
                media: poster,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Darkness',
      description: 'How dark the overlay on the media should be (0 = no overlay, 100 = fully dark)',
      type: 'number',
      initialValue: 40,
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'slideshowInterval',
      title: 'Slideshow Interval (seconds)',
      description: 'How long each image is displayed before fading to the next (videos play to completion)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(2).max(30),
    }),
    defineField({
      name: 'fadeDuration',
      title: 'Fade Duration (seconds)',
      description: 'How long the fade transition takes',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(0.3).max(3),
    }),
    defineField({
      name: 'scrollIndicatorText',
      title: 'Scroll Indicator Text',
      type: 'string',
      initialValue: 'Scroll',
    }),
  ],
  preview: {
    select: {
      titleLines: 'titleLines',
      heroMedia: 'heroMedia',
    },
    prepare({ titleLines, heroMedia }) {
      const count = heroMedia?.length || 0
      return {
        title: titleLines?.join(' ') || 'Hero Section',
        subtitle: count ? `${count} media item(s) in slideshow` : 'No media',
        media: heroMedia?.[0]?.image || heroMedia?.[0]?.poster,
      }
    },
  },
})
