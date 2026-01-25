import { defineType, defineField } from 'sanity'
import { UsersIcon, UserIcon } from '@sanity/icons'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        list: [
          { title: 'Management', value: 'management' },
          { title: 'Events', value: 'events' },
          { title: 'Marketing', value: 'marketing' },
          { title: 'Design', value: 'design' },
          { title: 'Human Resources', value: 'human-resources' },
          { title: 'Sponsorship', value: 'sponsorship' },
          { title: 'Media', value: 'media' },
          { title: 'Projects', value: 'projects' },
          { title: 'Outreach', value: 'outreach' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Team, then Order',
      name: 'teamOrder',
      by: [
        { field: 'team', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      team: 'team',
      media: 'photo',
    },
    prepare({ title, subtitle, team, media }) {
      return {
        title,
        subtitle: `${team} - ${subtitle}`,
        media,
      }
    },
  },
})

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team Page Settings',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Meet the Team',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline Events',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timelineEvent',
          title: 'Timeline Event',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'string',
              description: 'e.g. "July 2019"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Team Page Settings',
      }
    },
  },
})
