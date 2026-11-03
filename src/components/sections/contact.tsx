import { Container } from "@/components/layout/container";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function Contact() {
  const supabase = createServerSupabase();
  const { data: socials } = await supabase
    .from("socials")
    .select("platform,label,url")
    .eq("published", true)
    .order("sort_order");

  const links =
    socials && socials.length > 0
      ? socials.map((s: any) => ({
          label: s.label || s.platform,
          href:
            s.platform === "email"
              ? "https://mail.google.com/mail/?view=cm&fs=1&to=adit.bachtiar091@gmail.com"
              : s.url,
        }))
      : [
          { label: "GitHub", href: "https://github.com/adtbch" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/adityabachtiarr" },
          { label: "Instagram", href: "https://www.instagram.com/adtb___/" },
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=adit.bachtiar091@gmail.com" },
        ];

  return (
    <section id="contact" className="py-16 sm:py-24">
      <Container className="flex flex-col items-center text-center gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">06</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Mari Terhubung
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tersedia untuk diskusi proyek, kolaborasi, atau sekadar menyapa. Hubungi saya melalui platform di bawah ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {links.map((link: any) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm font-medium border border-border bg-card text-foreground hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}