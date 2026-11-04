"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ComponentProps } from "react";

const HEADER_OFFSET = 72;

/** Scroll ke section dengan offset header sticky. Return false kalau elemen belum ada. */
export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

/** Normalisasi href: "#about" -> "/#about", "/" tetap "/". */
export function toAbsoluteHref(href: string) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

type SectionLinkProps = ComponentProps<typeof Link>;

/**
 * Link yang aman dipakai dari halaman mana pun:
 * - href "#about" / "/#about" selalu diarahkan ke "/#about" (bukan "/projects/x#about")
 * - kalau sudah di "/", klik langsung scroll ke section tanpa reload
 * - href "/" saat sudah di "/" akan scroll ke atas (kembali ke hero)
 */
export function SectionLink({ href, onClick, ...rest }: SectionLinkProps) {
  const pathname = usePathname();
  const raw = typeof href === "string" ? href : "";
  const target = raw ? toAbsoluteHref(raw) : raw;
  const isHash = target.startsWith("/#") || target === "/";

  return (
    <Link
      href={target}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!isHash || pathname !== "/") return;

        e.preventDefault();
        if (target === "/") {
          window.history.replaceState(null, "", "/");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        window.history.replaceState(null, "", target);
        scrollToSection(target.slice(1));
      }}
      {...rest}
    />
  );
}

/**
 * Menangani scroll ke hash setelah navigasi client-side (mis. dari halaman
 * detail proyek ke "/#works"). Retry beberapa frame karena section di homepage
 * di-lazy-load dan belum ada di DOM saat pathname baru berubah.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let tries = 0;
    let cancelled = false;

    const attempt = () => {
      if (cancelled) return;
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;

      if (scrollToSection(hash)) return;

      // section di homepage lazy-load, coba lagi sampai ~4 detik
      if (tries++ > 80) return;
      timer = setTimeout(attempt, 50);
    };

    // jalankan setelah commit + sedikit jeda untuk lazy section
    timer = setTimeout(attempt, 50);

    const onHashChange = () => {
      tries = 0;
      attempt();
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
