"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/shared/spinner";

interface Props {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabledClassName?: string;
}

/**
 * Tombol submit yang otomatis menampilkan spinner selama form action berjalan.
 * Wajib dipakai di dalam <form> (server action atau onSubmit).
 */
export function SubmitButton({
  children,
  pendingLabel = "Menyimpan...",
  className = "",
  disabledClassName = "opacity-60 cursor-not-allowed",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 ${className} ${pending ? disabledClassName : ""}`}
    >
      {pending && <Spinner />}
      {pending ? pendingLabel : children}
    </button>
  );
}
