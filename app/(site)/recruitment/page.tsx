import { client } from "@/sanity/lib/client";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;
import { recruitmentPageQuery, recruitmentPositionsQuery } from "@/sanity/lib/queries";
import { RecruitmentPageData, RecruitmentPosition } from "@/lib/sanity/types";
import RecruitmentPageClient from "@/components/RecruitmentPageClient";

async function getRecruitmentPageData(): Promise<RecruitmentPageData | null> {
  try {
    return await client.fetch(recruitmentPageQuery, {}, { next: { tags: ['recruitmentPage'] } });
  } catch (error) {
    console.error("Error fetching recruitment page data:", error);
    return null;
  }
}

async function getRecruitmentPositions(): Promise<RecruitmentPosition[] | null> {
  try {
    return await client.fetch(recruitmentPositionsQuery, {}, { next: { tags: ['recruitmentPosition'] } });
  } catch (error) {
    console.error("Error fetching recruitment positions:", error);
    return null;
  }
}

export default async function RecruitmentPage() {
  const [pageData, positions] = await Promise.all([
    getRecruitmentPageData(),
    getRecruitmentPositions(),
  ]);

  return <RecruitmentPageClient pageData={pageData} positions={positions} />;
}
