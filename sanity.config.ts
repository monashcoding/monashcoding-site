'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-18'

export default defineConfig({
  name: 'monashcoding-studio',
  title: 'Monash Association of Coding',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],

  schema: {
    types: schemaTypes,
  },
})
