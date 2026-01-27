/**
 * Migration script: Renames _type from teamMember → committeeMember
 * and teamPage → committeePage in the Sanity dataset.
 *
 * Usage:
 *   npx tsx scripts/migrate-team-to-committee.ts
 *
 * Requires SANITY_API_TOKEN environment variable with write access.
 */

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables')
  process.exit(1)
}

if (!token) {
  console.error('Missing SANITY_API_TOKEN environment variable (needs write access)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-18',
  token,
  useCdn: false,
})

interface SanityDocument {
  _id: string
  _type: string
  [key: string]: unknown
}

const TYPE_MAP: Record<string, string> = {
  teamMember: 'committeeMember',
  teamPage: 'committeePage',
}

async function migrate() {
  for (const [oldType, newType] of Object.entries(TYPE_MAP)) {
    console.log(`\nMigrating ${oldType} → ${newType}...`)

    const docs: SanityDocument[] = await client.fetch(
      `*[_type == $oldType]{ _id, _type }`,
      { oldType }
    )

    if (docs.length === 0) {
      console.log(`  No documents found with _type "${oldType}"`)
      continue
    }

    console.log(`  Found ${docs.length} document(s)`)

    // For each document: create a copy with the new _type, then delete the old one
    for (const doc of docs) {
      const fullDoc: SanityDocument = await client.fetch(
        `*[_id == $id][0]`,
        { id: doc._id }
      )

      if (!fullDoc) {
        console.log(`  Skipping ${doc._id} — could not fetch full document`)
        continue
      }

      // Strip internal Sanity fields that can't be set during creation
      const { _rev, _createdAt, _updatedAt, ...rest } = fullDoc as SanityDocument & {
        _rev?: string
        _createdAt?: string
        _updatedAt?: string
      }

      const newDoc = {
        ...rest,
        _type: newType,
      }

      try {
        const transaction = client.transaction()
        transaction.createOrReplace(newDoc)
        transaction.delete(doc._id)
        await transaction.commit()
        console.log(`  Migrated: ${doc._id}`)
      } catch (err) {
        console.error(`  Failed to migrate ${doc._id}:`, err)
      }
    }
  }

  console.log('\nMigration complete.')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
