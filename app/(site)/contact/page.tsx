import { client } from "@/sanity/lib/client";

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false;
import { contactPageQuery, socialLinksQuery } from "@/sanity/lib/queries";
import { ContactPageData, SocialLinksData } from "@/lib/sanity/types";
import ContactPageClient from "@/components/ContactPageClient";

async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    return await client.fetch(contactPageQuery, {}, { next: { tags: ['contactPage'] } });
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return null;
  }
}

async function getSocialLinksData(): Promise<SocialLinksData | null> {
  try {
    return await client.fetch(socialLinksQuery, {}, { next: { tags: ['socialLinks'] } });
  } catch (error) {
    console.error("Error fetching social links:", error);
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
