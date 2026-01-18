import { client } from "@/sanity/lib/client";
import { teamPageQuery, teamMembersQuery } from "@/sanity/lib/queries";
import { TeamMember, TeamPageData } from "@/lib/sanity/types";
import TeamPageClient from "@/components/TeamPageClient";

async function getTeamPageData(): Promise<TeamPageData | null> {
  try {
    return await client.fetch(teamPageQuery);
  } catch (error) {
    console.error("Error fetching team page data:", error);
    return null;
  }
}

async function getTeamMembers(): Promise<TeamMember[] | null> {
  try {
    return await client.fetch(teamMembersQuery);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return null;
  }
}

export default async function TeamPage() {
  const [pageData, members] = await Promise.all([
    getTeamPageData(),
    getTeamMembers(),
  ]);

  return <TeamPageClient pageData={pageData} members={members} />;
}
