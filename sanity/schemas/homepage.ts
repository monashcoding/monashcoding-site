import { defineType, defineField, defineArrayMember } from 'sanity'

const sponsorSchema = {
  type: 'object',
  name: 'sponsor',
  title: 'Sponsor',
  fields: [
    defineField({
      name: 'name',
      title: 'Sponsor Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'x',
      title: 'Initial X Position (%)',
      type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.required().min(10).max(90),
    }),
    defineField({
      name: 'y',
      title: 'Initial Y Position (%)',
      type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.required().min(10).max(90),
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare({ name }: { name?: string }) {
      return {
        title: name || 'Sponsor',
      }
    },
  },
}

const sponsorsSectionSchema = defineArrayMember({
  type: 'object',
  name: 'sponsorsSection',
  title: 'Sponsors Section',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Our Sponsors',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      initialValue: 'Drag and interact with our amazing partners',
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [sponsorSchema],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      sponsors: 'sponsors',
    },
    prepare({ heading, sponsors }: { heading?: string; sponsors?: unknown[] }) {
      return {
        title: heading || 'Sponsors Section',
        subtitle: `${sponsors?.length || 0} sponsors`,
      }
    },
  },
})

const footerLinkSchema = {
  type: 'object',
  name: 'footerLink',
  title: 'Footer Link',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isExternal',
      title: 'Opens in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
}

const footerColumnSchema = {
  type: 'object',
  name: 'footerColumn',
  title: 'Footer Column',
  fields: [
    defineField({
      name: 'title',
      title: 'Column Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [footerLinkSchema],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({ title, links }: { title?: string; links?: unknown[] }) {
      return {
        title: title || 'Column',
        subtitle: `${links?.length || 0} links`,
      }
    },
  },
}

const footerSectionSchema = defineArrayMember({
  type: 'object',
  name: 'footerSection',
  title: 'Footer',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'MAC',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      initialValue: 'Monash Association of Coding - Empowering students through code since 2019.',
    }),
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [footerColumnSchema],
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
      }
    },
  },
})

const eventsSectionSchema = defineArrayMember({
  type: 'object',
  name: 'eventsSection',
  title: 'Events / Announcements Section',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Events & Announcements',
    }),
    defineField({
      name: 'maxEvents',
      title: 'Maximum Events to Show',
      type: 'number',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(20),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }: { heading?: string }) {
      return {
        title: heading || 'Events Section',
      }
    },
  },
})

const communitySectionSchema = defineArrayMember({
  type: 'object',
  name: 'communitySection',
  title: 'Community Section',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Our Community',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Connect with us on social media',
    }),
    defineField({
      name: 'platforms',
      title: 'Platforms to Show',
      description:
        'Select which platforms to display. Leave empty to show all.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Instagram', value: 'instagram' },
              { title: 'YouTube', value: 'youtube' },
              { title: 'TikTok', value: 'tiktok' },
              { title: 'Facebook', value: 'facebook' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'Discord', value: 'discord' },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }: { heading?: string }) {
      return {
        title: heading || 'Community Section',
      }
    },
  },
})

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Home',
      hidden: true,
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      description: 'Drag to reorder sections on the homepage',
      type: 'array',
      of: [
        sponsorsSectionSchema,
        eventsSectionSchema,
        communitySectionSchema,
        footerSectionSchema,
      ],
    }),
  ],
  preview: {
    select: {
      sections: 'sections',
    },
    prepare({ sections }: { sections?: unknown[] }) {
      return {
        title: 'Homepage',
        subtitle: `${sections?.length || 0} sections`,
      }
    },
  },
})
