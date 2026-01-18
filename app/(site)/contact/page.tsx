import { client } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { ContactPageData } from "@/lib/sanity/types";
import ContactPageClient from "@/components/ContactPageClient";

async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    return await client.fetch(contactPageQuery);
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return null;
  }
}

export default async function ContactPage() {
  const data = await getContactPageData();

  return <ContactPageClient data={data} />;
}
