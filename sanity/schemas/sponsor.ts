import { defineType, defineField, defineArrayMember } from 'sanity'
import { CreditCardIcon } from '@sanity/icons'

export const sponsorPage = defineType({
  name: 'sponsorPage',
  title: 'Sponsor Page',
  type: 'document',
  icon: CreditCardIcon,
  fieldsets: [
    { name: 'hero', title: 'Hero Section', options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      fieldset: 'hero',
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
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      fieldset: 'hero',
      initialValue: 'Partner With Us',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      fieldset: 'hero',
      initialValue: 'Join leading tech companies in supporting the next generation of developers. Your partnership helps us create impactful events and opportunities for students.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      description: 'Key statistics displayed in the hero section',
      type: 'array',
      fieldset: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              description: 'e.g., "2,000+", "50+", "95%"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'reasons',
      title: 'Why Sponsor Reasons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Reason Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Reason Description',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Reason Image',
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
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
          },
        }),
      ],
      initialValue: [
        {
          title: 'Boost Recognitions',
          description: "Make your brand known by partnering with Monash University's largest tech student society with 1600+ members reaching a wide range of communities locally and internationally.",
        },
        {
          title: 'Audience Reach',
          description: 'Our platform boasts a diverse and engaged audience, spanning various demographics and interests. Through our social channels, events and collaborations, we consistently reach millions of active users each month.',
        },
        {
          title: 'Social Media Exposure',
          description: 'As of 2025 we have reached over 230 million views through our social media, and we are still continuing to grow!',
        },
      ],
    }),

     defineField({
      name: 'benefits',
      title: 'Benefits',
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
      name: 'sponsorsTitle',
      title: 'Sponsors Section Title',
      type: 'string',
      initialValue: '2025 Sponsors',
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsor Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Company Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/jpeg,image/png,image/svg+xml',
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      initialValue: 'Ready to Partner?',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
      initialValue: "Let's discuss how we can create a partnership that benefits both your organization and our community.",
    }),
    defineField({
      name: 'contactImage',
      title: 'Contact Section Image',
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
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/contact',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Sponsor Page Settings',
      }
    },
  },
})
