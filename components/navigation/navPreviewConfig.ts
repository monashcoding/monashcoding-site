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
  "/team": {
    href: "/team",
    title: "Meet the Team",
    description: "Get to know the passionate people behind MAC who make everything happen.",
  },
  "/recruitment": {
    href: "/recruitment",
    title: "Recruitment",
    description: "Join our team and help shape the future of coding at Monash.",
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
};

export function getPreviewConfig(href: string): NavPreviewConfig | null {
  return NAV_PREVIEWS[href] || null;
}
