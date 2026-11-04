"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 500;
const SAFETY_MS = 10000;

/**
 * Bar progres tipis di atas halaman untuk navigasi client-side.
 * Muncul saat klik link internal, selesai ketika pathname berubah
 * (dengan durasi minimum agar tetap terlihat walau route sudah prefetch).
 */
export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const startedAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    hideTimer.current = null;
    safetyTimer.current = null;
  }

  // Route berubah -> selesaikan bar setelah durasi minimum
  useEffect(() => {
    if (!startedAt.current) return;
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    clearTimers();
    hideTimer.current = setTimeout(() => {
      setActive(false);
      startedAt.current = 0;
    }, wait);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (!href.startsWith("/") || href.startsWith("//")) return;

      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return;

      clearTimers();
      startedAt.current = Date.now();
      setActive(true);
      safetyTimer.current = setTimeout(() => {
        setActive(false);
        startedAt.current = 0;
      }, SAFETY_MS);
    }

    // capture: jalan sebelum handler Next/Link yang memanggil preventDefault
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-0.5"
    >
      <div
        className="h-full origin-left bg-accent transition-[transform,opacity] duration-300 ease-out"
        style={{
          transform: active ? "scaleX(1)" : "scaleX(0)",
          opacity: active ? 1 : 0,
          animation: active ? "nav-progress-pulse 1.4s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}
