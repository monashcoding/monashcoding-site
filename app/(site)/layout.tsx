import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";
import { Analytics } from "@/components/Analytics";
import { RibbonProvider } from "@/components/GlobalRibbons";
import { Footer } from "@/components/home/Footer";
import { client, sanityFetchOptions } from "@/sanity/lib/client";
import { navigationQuery } from "@/sanity/lib/queries";
import type { NavigationData } from "@/lib/sanity/types";
import { getSocialLinksData } from "@/lib/sanity/fetchers";
import { logger } from "@/lib/log";

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery, {}, sanityFetchOptions(['navigation']));
  } catch (error) {
    logger.error("Error fetching navigation", error);

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
        <Footer navItems={navigationData?.navItems} socialLinks={socialLinksData?.links} />
      </ClickSpark>
      {/* In the (site) layout so the Sanity studio at /studio isn't tracked. */}
      <Analytics />
    </RibbonProvider>
  );
}
