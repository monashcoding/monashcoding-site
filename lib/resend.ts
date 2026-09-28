import { Resend } from 'resend'

let resend: Resend | undefined

// Created on first use so `next build` can load the API routes without RESEND_API_KEY
export function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(
        'RESEND_API_KEY is not configured. Please set the RESEND_API_KEY environment variable.'
      )
    }
    resend = new Resend(apiKey)
  }
  return resend
}
