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
      name: 'senderEmail',
      title: 'Sender Email (From)',
      type: 'string',
      description: 'The "from" address for contact form emails. Must be a verified domain in Resend.',
      validation: (Rule) => Rule.email(),
      initialValue: 'noreply@monashcoding.com',
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Recipient Email (To)',
      type: 'string',
      description: 'The email address that receives contact form submissions.',
      validation: (Rule) => Rule.email(),
      initialValue: 'projects@monashcoding.com',
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
    // Image
    defineField({
      name: 'bottomImage',
      title: 'Bottom Image',
      type: 'image',
      description: 'Image shown at the bottom of the contact page.',
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
