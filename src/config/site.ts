import type { Social } from "@/types";

export const siteConfig = {
  name: "Aditya Bachtiar",
  shortName: "Adit",
  role: "Lulusan Teknik Informatika | Backend Developer & Robotics Engineer",
  description:
    "Lulusan Teknik Informatika Universitas Islam Sultan Agung dengan pengalaman dalam pengembangan perangkat lunak, backend, embedded system, dan robotika. Memiliki pengalaman mengembangkan sistem elektronik dan pemrograman Automated Guided Vehicle (AGV), REST API menggunakan Golang, serta aplikasi berbasis web. Aktif dalam riset dan kompetisi robotika hingga tingkat nasional serta meraih Juara 2 kompetisi Web Development tingkat nasional. Terbiasa menggunakan C/C++, Python, Golang, PHP, SQL, ESP32, dan berbagai teknologi pengembangan perangkat lunak.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "id_ID",
  status: {
    available: true,
    text: "Tersedia untuk bekerja",
  },
  nav: [
    { label: "Tentang", href: "/#about" },
    { label: "Pengalaman", href: "/#experience" },
    { label: "Karya", href: "/#works" },
    { label: "Prestasi", href: "/#certificates" },
    { label: "Kontak", href: "/#contact" },
  ],
} as const;

export const socials: Social[] = [
  { id: "1", platform: "github", label: "GitHub", url: "https://github.com/adtbch", sort_order: 1, published: true },
  { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/adityabachtiarr", sort_order: 2, published: true },
  { id: "3", platform: "instagram", label: "Instagram", url: "https://www.instagram.com/adtb___/", sort_order: 3, published: true },
  { id: "4", platform: "email", label: "Email", url: "mailto:adit.bachtiar091@gmail.com", sort_order: 4, published: true },
];
