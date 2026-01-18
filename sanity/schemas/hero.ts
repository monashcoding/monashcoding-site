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
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
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
      media: 'heroImage',
    },
    prepare({ titleLines, media }) {
      return {
        title: titleLines?.join(' ') || 'Hero Section',
        media,
      }
    },
  },
})
