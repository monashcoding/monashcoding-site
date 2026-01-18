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
          { title: 'Executive', value: 'Executive' },
          { title: 'Education', value: 'Education' },
          { title: 'Events', value: 'Events' },
          { title: 'Marketing', value: 'Marketing' },
          { title: 'Technology', value: 'Technology' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'image',
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
      media: 'image',
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
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Meet the Team',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      initialValue: 'Click on a branch to explore each team',
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
