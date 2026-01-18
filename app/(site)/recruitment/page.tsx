import { client } from "@/sanity/lib/client";
import { recruitmentPageQuery, recruitmentPositionsQuery } from "@/sanity/lib/queries";
import { RecruitmentPageData, RecruitmentPosition } from "@/lib/sanity/types";
import RecruitmentPageClient from "@/components/RecruitmentPageClient";

async function getRecruitmentPageData(): Promise<RecruitmentPageData | null> {
  try {
    return await client.fetch(recruitmentPageQuery);
  } catch (error) {
    console.error("Error fetching recruitment page data:", error);
    return null;
  }
}

async function getRecruitmentPositions(): Promise<RecruitmentPosition[] | null> {
  try {
    return await client.fetch(recruitmentPositionsQuery);
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
