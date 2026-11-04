"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/shared/spinner";

interface Props {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}

/**
 * Tombol submit untuk aksi destruktif: konfirmasi dulu, lalu tampilkan spinner
 * selama server action berjalan.
 */
export function DeleteButton({
  confirmMessage,
  children,
  className = "",
  pendingLabel = "Menghapus...",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={(e) => {
        if (pending) {
          e.preventDefault();
          return;
        }
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending && <Spinner className="h-3 w-3" />}
      {pending ? pendingLabel : children}
    </button>
  );
}
