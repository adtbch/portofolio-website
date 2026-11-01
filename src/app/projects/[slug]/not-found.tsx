import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function ProjectNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-4 py-20">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">404</span>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
        Project tidak ditemukan
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Slug tidak ada atau project belum dipublikasikan.
      </p>
      <Link
        href="/#works"
        className="mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
      >
        Lihat Karya
      </Link>
    </Container>
  );
}