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
    defineField({
      name: 'instagramReels',
      title: 'Instagram Reels',
      description:
        'Paste Instagram reel or post URLs. Thumbnails and captions are fetched automatically.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'instagramReelUrl',
          title: 'Instagram Reel URL',
          fields: [
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required()
                  .uri({ scheme: ['https'] })
                  .custom((url) => {
                    if (typeof url !== 'string') return true
                    if (!url.match(/instagram\.com\/(reel|p)\//)) {
                      return 'URL must be an Instagram reel or post URL'
                    }
                    return true
                  }),
            }),
            defineField({
              name: 'pinned',
              title: 'Pinned',
              type: 'boolean',
              description: 'Pinned reels are shown first.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { url: 'url', pinned: 'pinned' },
            prepare({ url, pinned }: { url?: string; pinned?: boolean }) {
              const shortcode =
                url?.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/)?.[2] ?? ''
              const type = url?.includes('/reel/') ? 'Reel' : 'Post'
              return {
                title: `${pinned ? '(Pinned) ' : ''}${shortcode || 'No URL'}`,
                subtitle: type,
              }
            },
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
