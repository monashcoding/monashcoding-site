import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";
import { RibbonProvider } from "@/components/GlobalRibbons";
import { client } from "@/sanity/lib/client";
import { navigationQuery } from "@/sanity/lib/queries";
import { NavigationData } from "@/lib/sanity/types";

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery);
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
  const navigationData = await getNavigationData();

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
        <Navigation data={navigationData} />
        {children}
      </ClickSpark>
    </RibbonProvider>
  );
}
