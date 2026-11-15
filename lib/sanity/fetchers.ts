import { client, sanityFetchOptions } from "@/sanity/lib/client";
import { socialLinksQuery } from "@/sanity/lib/queries";
import type { SocialLinksData } from "@/lib/sanity/types";
import { logger } from "@/lib/log";

export async function getSocialLinksData(): Promise<SocialLinksData | null> {
  try {
    return await client.fetch(socialLinksQuery, {}, sanityFetchOptions(['socialLinks']));
  } catch (error) {
    logger.error("Error fetching social links", error);

    return null;
  }
}
