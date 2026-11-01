import type { Social } from "@/types";

export const siteConfig = {
  name: "Aditya Bachtiar",
  shortName: "Adit",
  role: "Fullstack Developer | Laravel, Go & Embedded Systems",
  description:
    "Fullstack developer building scalable APIs with Laravel and Go, plus embedded/IoT systems on ESP32.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "id_ID",
  status: {
    available: true,
    text: "Available for work",
  },
  nav: [
    { label: "Works", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const socials: Social[] = [
  { id: "1", platform: "github", label: "GitHub", url: "https://github.com/", sort_order: 1, published: true },
  { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/", sort_order: 2, published: true },
  { id: "3", platform: "email", label: "Email", url: "mailto:", sort_order: 3, published: true },
];
