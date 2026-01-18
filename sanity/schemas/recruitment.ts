import { defineType, defineField, defineArrayMember } from 'sanity'
import { CaseIcon, DocumentsIcon } from '@sanity/icons'

export const recruitmentPosition = defineType({
  name: 'recruitmentPosition',
  title: 'Recruitment Position',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Position Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Emoji or icon character',
      type: 'string',
      validation: (Rule) => Rule.required().max(4),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'isOpen',
      title: 'Position Open',
      description: 'Is this position currently accepting applications?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      icon: 'icon',
      isOpen: 'isOpen',
    },
    prepare({ title, icon, isOpen }) {
      return {
        title: `${icon} ${title}`,
        subtitle: isOpen ? 'Open' : 'Closed',
      }
    },
  },
})

export const recruitmentPage = defineType({
  name: 'recruitmentPage',
  title: 'Recruitment Page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Join Our Team',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Be part of something amazing. Help us empower the next generation of coders.',
    }),
    defineField({
      name: 'perks',
      title: 'Perks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              validation: (Rule) => Rule.required().max(4),
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
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
            },
            prepare({ title, icon }) {
              return {
                title: `${icon} ${title}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Recruitment Timeline',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Date/Week',
              type: 'string',
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
          preview: {
            select: {
              title: 'title',
              subtitle: 'date',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      initialValue: 'Ready to Make an Impact?',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
      initialValue: 'Applications are now open. Join us in building the future of tech education at Monash.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Apply Now',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '#apply',
    }),
    defineField({
      name: 'applicationsOpen',
      title: 'Applications Open',
      description: 'Global toggle for whether applications are currently open',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Recruitment Page Settings',
      }
    },
  },
})
