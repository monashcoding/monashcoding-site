import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { firstYearRecruitmentPageQuery } from "@/sanity/lib/queries";
import { FirstYearRecruitmentPageData } from "@/lib/sanity/types";
import FirstYearRecruitmentPageClient from "@/components/FirstYearRecruitmentPageClient";

async function getFirstYearRecruitmentPageData(): Promise<FirstYearRecruitmentPageData | null> {
  try {
    return await client.fetch(firstYearRecruitmentPageQuery);
  } catch (error) {
    console.error("Error fetching First Year Recruitment page data:", error);
    return null;
  }
}

export default async function FirstYearRecruitmentPage() {
  const data = await getFirstYearRecruitmentPageData();

  if (!data || data.shown !== true) {
    notFound();
  }

  return <FirstYearRecruitmentPageClient data={data} />;
}
