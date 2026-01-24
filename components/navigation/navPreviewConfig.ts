export interface NavPreviewConfig {
  href: string;
  title: string;
  description: string;
  image?: string;
  accentColor?: string;
}

export const NAV_PREVIEWS: Record<string, NavPreviewConfig> = {
  "/": {
    href: "/",
    title: "Home",
    description: "Welcome to the Monash Association of Coding. Discover our events, community, and opportunities.",
    image: "/previews/home.jpg",
  },
  "/team": {
    href: "/team",
    title: "Meet the Team",
    description: "Get to know the passionate people behind MAC who make everything happen.",
    image: "/previews/team.jpg",
  },
  "/recruitment": {
    href: "/recruitment",
    title: "Recruitment",
    description: "Join our team and help shape the future of coding at Monash.",
    image: "/previews/recruitment.jpg",
  },
  "/sponsor": {
    href: "/sponsor",
    title: "Sponsor Us",
    description: "Partner with MAC and connect with Monash's coding community.",
    image: "/previews/sponsor.jpg",
  },
  "/contact": {
    href: "/contact",
    title: "Contact",
    description: "Get in touch with us. We'd love to hear from you.",
    image: "/previews/contact.jpg",
  },
};

export function getPreviewConfig(href: string): NavPreviewConfig | null {
  return NAV_PREVIEWS[href] || null;
}
