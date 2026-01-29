import { client } from "@/sanity/lib/client";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;
import { sponsorPageQuery } from "@/sanity/lib/queries";
import { SponsorPageData } from "@/lib/sanity/types";
import SponsorPageClient from "@/components/sponsor/SponsorPageClient";

async function getSponsorPageData(): Promise<SponsorPageData | null> {
  try {
    return await client.fetch(sponsorPageQuery, {}, { next: { tags: ['sponsorPage'] } });
  } catch (error) {
    console.error("Error fetching sponsor page data:", error);
    return null;
  }
}

export default async function SponsorPage() {
  const data = await getSponsorPageData();

  return <SponsorPageClient data={data} />;
}
