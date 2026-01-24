import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

// Map Sanity document types to their corresponding paths
const documentTypeToPath: Record<string, string[]> = {
  // Pages
  hero: ['/'],
  homepage: ['/'],
  teamPage: ['/team'],
  teamMember: ['/team'],
  contactPage: ['/contact'],
  sponsorPage: ['/sponsor'],
  recruitmentPage: ['/recruitment'],
  recruitmentPosition: ['/recruitment'],
  oWeekPage: ['/o-week'],
  firstYearRecruitmentPage: ['/first-year-recruitment'],
  // Navigation affects all pages
  navigation: ['/', '/team', '/contact', '/sponsor', '/recruitment', '/o-week', '/first-year-recruitment'],
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-sanity-webhook-secret')

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return Response.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { _type } = body

    if (!_type) {
      return Response.json(
        { message: 'Missing document type' },
        { status: 400 }
      )
    }

    const pathsToRevalidate = documentTypeToPath[_type]

    if (!pathsToRevalidate) {
      // Unknown document type, revalidate home page as fallback
      revalidatePath('/')
      return Response.json({
        revalidated: true,
        paths: ['/'],
        message: `Unknown type "${_type}", revalidated home page`,
      })
    }

    // Revalidate all paths associated with this document type
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return Response.json({
      revalidated: true,
      paths: pathsToRevalidate,
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return Response.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}
