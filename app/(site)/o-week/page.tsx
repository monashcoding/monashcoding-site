import { notFound } from "next/navigation";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;
import { client } from "@/sanity/lib/client";
import { oweekPageQuery } from "@/sanity/lib/queries";
import { OWeekPageData } from "@/lib/sanity/types";
import OWeekPageClient from "@/components/OWeekPageClient";

async function getOWeekPageData(): Promise<OWeekPageData | null> {
  try {
    return await client.fetch(oweekPageQuery);
  } catch (error) {
    console.error("Error fetching O Week page data:", error);
    return null;
  }
}

export default async function OWeekPage() {
  const data = await getOWeekPageData();

  if (!data || data.shown !== true) {
    notFound();
  }

  return <OWeekPageClient data={data} />;
}
