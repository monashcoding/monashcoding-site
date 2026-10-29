import { GoogleAnalytics } from "@next/third-parties/google";
import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";
import { RibbonProvider } from "@/components/GlobalRibbons";
import { Footer } from "@/components/home/Footer";
import { client, sanityFetchOptions } from "@/sanity/lib/client";
import { navigationQuery } from "@/sanity/lib/queries";
import { NavigationData } from "@/lib/sanity/types";
import { getSocialLinksData } from "@/lib/sanity/fetchers";

// Public by design (it ships in every page), so it lives in code, not .env.
// Lives in the (site) layout so the Sanity studio at /studio isn't tracked.
const GA_MEASUREMENT_ID = "G-69933Q0KLF";

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery, {}, sanityFetchOptions(['navigation']));
  } catch (error) {
    console.error("Error fetching navigation:", error);
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
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </RibbonProvider>
  );
}
