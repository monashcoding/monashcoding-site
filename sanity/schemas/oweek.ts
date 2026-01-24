import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const oweekPage = defineType({
  name: 'oweekPage',
  title: 'O Week Page',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'shown',
      title: 'Show Page',
      type: 'boolean',
      description: 'When disabled, the page returns 404 and is hidden from navigation',
      initialValue: false,
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'O Week',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Join us during Orientation Week for exciting events and activities.',
    }),
  ],
  preview: {
    select: {
      shown: 'shown',
    },
    prepare({ shown }) {
      return {
        title: 'O Week Page Settings',
        subtitle: shown ? 'Visible' : 'Hidden',
      }
    },
  },
})
