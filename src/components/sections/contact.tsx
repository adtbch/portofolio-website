import { Container } from "@/components/layout/container";

export default function Contact() {
  const links = [
    { label: "GitHub", href: "https://github.com/adtbch" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Email", href: "mailto:aditya@example.com" },
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

        <div className="flex flex-wrap items-center justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border bg-card text-foreground hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}