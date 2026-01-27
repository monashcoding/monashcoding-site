import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue: "Have a question or want to collaborate? We'd love to hear from you.",
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email(),
      initialValue: 'hello@monashcoding.com',
    }),
    defineField({
      name: 'discordLink',
      title: 'Discord Link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
      initialValue: 'https://discord.gg/monashcoding',
    }),
    defineField({
      name: 'discordLabel',
      title: 'Discord Label',
      type: 'string',
      initialValue: 'Join our community',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Monash University, Clayton VIC',
    }),
    defineField({
      name: 'locationMapLink',
      title: 'Location Map Link',
      type: 'url',
      initialValue: 'https://maps.google.com/?q=Monash+University+Clayton',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page Settings',
      }
    },
  },
})
