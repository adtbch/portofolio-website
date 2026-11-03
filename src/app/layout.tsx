import type { Metadata } from "next";
import { fontHeading, fontBody, fontMono } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/shared/preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
        <Preloader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
