import { defineType, defineField, defineArrayMember } from 'sanity'

const storyItemSchema = {
  type: 'object',
  name: 'storyItem',
  title: 'Story Item',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
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
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      year: 'year',
      title: 'title',
    },
    prepare({ year, title }: { year?: string; title?: string }) {
      return {
        title: `${year} - ${title}`,
      }
    },
  },
}

const storySectionSchema = defineArrayMember({
  type: 'object',
  name: 'storySection',
  title: 'Story Section',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Our Story',
    }),
    defineField({
      name: 'items',
      title: 'Story Items',
      type: 'array',
      of: [storyItemSchema],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      items: 'items',
    },
    prepare({ heading, items }: { heading?: string; items?: unknown[] }) {
      return {
        title: heading || 'Story Section',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})

const instagramSectionSchema = defineArrayMember({
  type: 'object',
  name: 'instagramSection',
  title: 'Instagram Section',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Follow Our Journey',
    }),
    defineField({
      name: 'handle',
      title: 'Instagram Handle',
      type: 'string',
      initialValue: '@monashcoding',
    }),
    defineField({
      name: 'url',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/monashcoding',
    }),
    defineField({
      name: 'postCount',
      title: 'Number of Posts to Show',
      type: 'number',
      initialValue: 6,
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      handle: 'handle',
    },
    prepare({ heading, handle }: { heading?: string; handle?: string }) {
      return {
        title: heading || 'Instagram Section',
        subtitle: handle,
      }
    },
  },
})

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
        storySectionSchema,
        instagramSectionSchema,
        sponsorsSectionSchema,
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
