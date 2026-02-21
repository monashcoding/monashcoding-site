import { defineType, defineField, defineArrayMember } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const aboutUsPage = defineType({
  name: 'aboutUsPage',
  title: 'About Us Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About MAC',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle / Intro',
      type: 'text',
      rows: 4,
      initialValue:
        'Monash Association of Coding (MAC) is the largest student-run computing club at Monash University, with over 1,500 current members and an online presence that extends across the globe.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Section Title',
      type: 'string',
      initialValue: 'Our Mission',
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission Body',
      type: 'text',
      rows: 6,
      initialValue:
        'We strive to upskill students through high-quality events, workshops and hackathons, spanning both technical and professional domains.\n\nThrough our impact, we aim to make coding enjoyable and accessible to all, offering students real-world experience and insight into the tech industry.',
    }),
    defineField({
      name: 'missionImage',
      title: 'Mission Section Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'image',
              title: 'Image / Icon',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'journey',
      title: 'Our Journey',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: { title: 'year', subtitle: 'summary' },
          },
        }),
      ],
    }),
    defineField({
      name: 'journeyImage',
      title: 'Journey Section Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'whereAreWeNow',
      title: 'Where Are We Now?',
      type: 'text',
      rows: 6,
      initialValue:
        "MAC's exponential growth has led us to become one of Australia's leading computing societies.\n\nWe unite over 1500 enthusiastic members and a tight-knit committee of over 60 passionate students in technology. We endeavour to equip our community with professional skills, industry insights and connections with ambitious individuals.\n\nThrough weekly technical events, hackathons and networking nights, totalling 2000+ attendees, we empower our students to thrive holistically in a forever-evolving tech space.",
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Us Page Settings',
      }
    },
  },
})
