import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

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

    // Revalidate the tag matching the Sanity document type
    revalidateTag(_type, { expire: 0 })

    return Response.json({
      revalidated: true,
      tag: _type,
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return Response.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}
