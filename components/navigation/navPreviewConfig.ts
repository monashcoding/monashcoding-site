export interface NavPreviewConfig {
  href: string;
  title: string;
  description: string;
}

export const NAV_PREVIEWS: Record<string, NavPreviewConfig> = {
  "/": {
    href: "/",
    title: "Home",
    description: "Welcome to the Monash Association of Coding. Discover our events, community, and opportunities.",
  },
  "/about": {
    href: "/about",
    title: "About Us",
    description: "Learn about our mission, values, and the community behind MAC.",
  },
  "/team": {
    href: "/team",
    title: "Meet the Team",
    description: "Get to know the passionate people behind MAC who make everything happen.",
  },
  "/sponsor": {
    href: "/sponsor",
    title: "Sponsor Us",
    description: "Partner with MAC and connect with Monash's coding community.",
  },
  "/contact": {
    href: "/contact",
    title: "Contact",
    description: "Get in touch with us. We'd love to hear from you.",
  },
  "/o-week": {
    href: "/o-week",
    title: "O-Week 2026",
    description: "Everything you need to know for Orientation Week. Check out our pamphlet and upcoming events.",
  },
};

export const DEFAULT_PREVIEW_HREF = "/";

export function getPreviewConfig(href: string): NavPreviewConfig | null {
  return NAV_PREVIEWS[href] || null;
}
