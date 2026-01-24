import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const firstYearRecruitmentPage = defineType({
  name: 'firstYearRecruitmentPage',
  title: 'First Year Recruitment Page',
  type: 'document',
  icon: UsersIcon,
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
      initialValue: 'First Year Recruitment',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Start your coding journey with us. First-year students welcome!',
    }),
  ],
  preview: {
    select: {
      shown: 'shown',
    },
    prepare({ shown }) {
      return {
        title: 'First Year Recruitment Page Settings',
        subtitle: shown ? 'Visible' : 'Hidden',
      }
    },
  },
})
