import { client, sanityFetchOptions } from "@/sanity/lib/client";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;

import { sponsorPageQuery } from "@/sanity/lib/queries";
import type { SponsorPageData } from "@/lib/sanity/types";
import SponsorPageClient from "@/components/sponsor/SponsorPageClient";
import { logger } from "@/lib/log";

async function getSponsorPageData(): Promise<SponsorPageData | null> {
  try {
    return await client.fetch(sponsorPageQuery, {}, sanityFetchOptions(['sponsorPage']));
  } catch (error) {
    logger.error("Error fetching sponsor page data", error);

    return null;
  }
}

export default async function SponsorPage() {
  const data = await getSponsorPageData();

  return <SponsorPageClient data={data} />;
}
