"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContact } from "@/app/actions/contact";
import { useTransition, useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = (data: ContactInput) => {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const res = await submitContact(data);
      if (res.ok) {
        setSuccess(true);
        reset();
        if (toast) toast.success("Pesan terkirim");
        return;
      }
      setServerError(res.error || "Gagal mengirim pesan");
      if (toast) toast.error(res.error || "Gagal mengirim pesan");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-live="polite"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nama
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.name && (
            <p className="text-xs text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.email && (
            <p className="text-xs text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Pesan
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          aria-invalid={errors.message ? "true" : "false"}
          className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.message && (
          <p className="text-xs text-red-500" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {serverError && (
        <p className="text-sm text-red-500" role="alert">
          {serverError}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-500">
          Pesan berhasil terkirim. Terima kasih.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
