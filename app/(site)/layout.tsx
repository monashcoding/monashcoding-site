import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";
import { RibbonProvider } from "@/components/GlobalRibbons";
import { client } from "@/sanity/lib/client";
import { navigationQuery, socialLinksQuery } from "@/sanity/lib/queries";
import { NavigationData, SocialLinksData } from "@/lib/sanity/types";

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery, {}, { next: { tags: ['navigation'] } });
  } catch (error) {
    console.error("Error fetching navigation:", error);
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

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigationData, socialLinksData] = await Promise.all([
    getNavigationData(),
    getSocialLinksData(),
  ]);

  return (
    <RibbonProvider>
      <ClickSpark
        sparkColor="#FFE330"
        sparkSize={10}
        sparkRadius={30}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1.5}
      >
        <Navigation data={navigationData} socialLinks={socialLinksData?.links || null} />
        {children}
      </ClickSpark>
    </RibbonProvider>
  );
}
