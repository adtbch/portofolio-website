"use client";

import { useCallback, useEffect, useState } from "react";

interface Props {
  src: string;
  alt: string;
  /** kelas untuk container gambar */
  className?: string;
  imgClassName?: string;
}

export function CertificateImage({ src, alt, className = "", imgClassName = "" }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Perbesar ${alt}`}
        className={`relative block w-full cursor-zoom-in overflow-hidden border-b border-border bg-black/20 ${className}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgClassName}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 font-mono text-lg text-white hover:bg-white/10"
          >
            &times;
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
