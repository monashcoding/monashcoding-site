import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID environment variable')
}
if (!dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET environment variable')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
