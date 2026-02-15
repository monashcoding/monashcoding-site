import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { eventBySlugQuery, eventSlugsQuery } from '@/sanity/lib/queries'
import { EventDocument } from '@/lib/sanity/types'
import { EventPageClient } from '@/components/events/EventPageClient'

export const revalidate = false

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(eventSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Event Not Found' }
  return {
    title: `${event.title} | MAC Events`,
    description: event.description,
  }
}

async function getEvent(slug: string): Promise<EventDocument | null> {
  try {
    return await client.fetch(
      eventBySlugQuery,
      { slug },
      { next: { tags: ['event'] } }
    )
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return null
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  return <EventPageClient event={event} />
}
