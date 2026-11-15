import { client, sanityFetchOptions } from "@/sanity/lib/client";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;

import { contactPageQuery } from "@/sanity/lib/queries";
import type { ContactPageData } from "@/lib/sanity/types";
import ContactPageClient from "@/components/contact/ContactPageClient";
import { getSocialLinksData } from "@/lib/sanity/fetchers";
import { logger } from "@/lib/log";

async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    return await client.fetch(contactPageQuery, {}, sanityFetchOptions(['contactPage']));
  } catch (error) {
    logger.error("Error fetching contact page data", error);

    return null;
  }
}

export default async function ContactPage() {
  const [data, socialLinksData] = await Promise.all([
    getContactPageData(),
    getSocialLinksData(),
  ]);

  return <ContactPageClient data={data} socialLinks={socialLinksData?.links || null} />;
}
