import { defineType, defineField, defineArrayMember } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g. "oweek-2026"). This becomes the event page URL.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Shown on the event card on the homepage',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      description: 'Optional — for multi-day events',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'signupLink',
      title: 'Signup / RSVP Link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: false }),
    }),
    defineField({
      name: 'tag',
      title: 'Event Tag',
      type: 'string',
      options: {
        list: [
          { title: 'Event', value: 'event' },
          { title: 'Hackathon', value: 'hackathon' },
          { title: 'Social', value: 'social' },
          { title: 'Recruitment', value: 'recruitment' },
        ],
      },
      initialValue: 'event',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPinned',
      title: 'Pinned / Featured',
      description:
        'Pinned events appear larger and more prominent on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Full Description',
      description: 'Rich text shown on the individual event page',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Event Date (Upcoming First)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      tag: 'tag',
    },
    prepare({
      title,
      date,
      tag,
    }: {
      title?: string
      date?: string
      tag?: string
    }) {
      const d = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title: title || 'Untitled Event',
        subtitle: `${tag || 'event'} — ${d}`,
      }
    },
  },
})
