import type { Social } from "@/types";

export const siteConfig = {
  name: "Aditya Bachtiar",
  shortName: "Adit",
  role: "Pengembang Fullstack | Laravel, Go & Sistem Tertanam",
  description:
    "Pengembang fullstack yang membangun API skalabel dengan Laravel dan Go, serta sistem tertanam/IoT berbasis ESP32.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "id_ID",
  status: {
    available: true,
    text: "Tersedia untuk bekerja",
  },
  nav: [
    { label: "Karya", href: "#works" },
    { label: "Tentang", href: "#about" },
    { label: "Keahlian", href: "#skills" },
    { label: "Pengalaman", href: "#experience" },
    { label: "Kontak", href: "#contact" },
  ],
} as const;

export const socials: Social[] = [
  { id: "1", platform: "github", label: "GitHub", url: "https://github.com/", sort_order: 1, published: true },
  { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/", sort_order: 2, published: true },
  { id: "3", platform: "email", label: "Email", url: "mailto:", sort_order: 3, published: true },
];
