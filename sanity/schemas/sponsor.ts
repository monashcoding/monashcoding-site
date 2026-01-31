import { defineType, defineField, defineArrayMember } from 'sanity'
import { CreditCardIcon } from '@sanity/icons'

export const sponsorPage = defineType({
  name: 'sponsorPage',
  title: 'Sponsor Page',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Partner With Us',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Join leading tech companies in supporting the next generation of developers. Your partnership helps us create impactful events and opportunities for students.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      description: 'Key statistics to showcase',
      type: 'array',
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
      name: 'tiersTitle',
      title: 'Tiers Section Title',
      type: 'string',
      initialValue: 'Sponsorship Tiers',
    }),
    defineField({
      name: 'tiersSubtitle',
      title: 'Tiers Section Subtitle',
      type: 'string',
      initialValue: 'Choose a partnership level that aligns with your goals and budget',
    }),
    defineField({
      name: 'tiers',
      title: 'Sponsorship Tiers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Tier Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              description: 'e.g., "$500", "$1,500", "Custom"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'featured',
              title: 'Featured',
              description: 'Highlight this tier as "Most Popular"',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
              featured: 'featured',
            },
            prepare({ title, subtitle, featured }) {
              return {
                title: featured ? `⭐ ${title}` : title,
                subtitle,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'benefitsTitle',
      title: 'Benefits Section Title',
      type: 'string',
      initialValue: 'Why Partner With MAC?',
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
