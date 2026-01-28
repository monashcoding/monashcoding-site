import { client } from "@/sanity/lib/client";
import { socialLinksQuery } from "@/sanity/lib/queries";
import { SocialLinksData } from "@/lib/sanity/types";

export async function getSocialLinksData(): Promise<SocialLinksData | null> {
  try {
    return await client.fetch(socialLinksQuery, {}, { next: { tags: ['socialLinks'] } });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return null;
  }
}
