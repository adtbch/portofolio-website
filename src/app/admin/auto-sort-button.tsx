"use client";

import { useState, useTransition } from "react";
import { autoSort } from "@/lib/admin/auto-sort";
import { Spinner } from "@/components/shared/spinner";

interface Props {
  table: "skills" | "certificates" | "education" | "experiences" | "projects" | "socials";
  /** Label untuk field yang diurutkan, mis. "Nama", "Judul", "Institusi" */
  nameLabel?: string;
  /** Aktifkan mode "Berdasarkan Group" (khusus tabel yang punya kolom group) */
  groupLabel?: string;
}

export function AutoSortButton({ table, nameLabel = "Nama", groupLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2a2a2a] text-[#f5f5f7] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#333] transition-colors"
      >
        Auto Sort
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#151515] border border-[#2a2a2a] max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold font-mono text-[#f5f5f7] mb-2">Auto Sort</h2>
            <p className="text-xs text-[#a1a1aa] mb-5 leading-relaxed">
              Urutkan ulang semua data dan reset <span className="text-[#22d3ee]">sort_order</span> jadi
              0, 1, 2, ... secara berurutan.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.set("table", table);
                startTransition(async () => {
                  await autoSort(formData);
                  setOpen(false);
                });
              }}
              className="space-y-3"
            >
              <label className="flex items-start gap-3 p-3 border border-[#2a2a2a] cursor-pointer hover:border-[#22d3ee] transition-colors">
                <input type="radio" name="mode" value="name-asc" defaultChecked className="mt-0.5 accent-[#22d3ee]" />
                <span className="text-sm">
                  <span className="block text-[#f5f5f7]">{nameLabel} A → Z</span>
                  <span className="block text-xs text-[#a1a1aa]">Urut abjad menaik</span>
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 border border-[#2a2a2a] cursor-pointer hover:border-[#22d3ee] transition-colors">
                <input type="radio" name="mode" value="name-desc" className="mt-0.5 accent-[#22d3ee]" />
                <span className="text-sm">
                  <span className="block text-[#f5f5f7]">{nameLabel} Z → A</span>
                  <span className="block text-xs text-[#a1a1aa]">Urut abjad menurun</span>
                </span>
              </label>

              {groupLabel && (
                <label className="flex items-start gap-3 p-3 border border-[#2a2a2a] cursor-pointer hover:border-[#22d3ee] transition-colors">
                  <input type="radio" name="mode" value="group" className="mt-0.5 accent-[#22d3ee]" />
                  <span className="text-sm">
                    <span className="block text-[#f5f5f7]">Berdasarkan {groupLabel}</span>
                    <span className="block text-xs text-[#a1a1aa]">
                      Kelompokkan per {groupLabel.toLowerCase()}, lalu A → Z
                    </span>
                  </span>
                </label>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-[#2a2a2a] text-[#f5f5f7] px-4 py-2 font-mono text-xs hover:bg-[#333]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className="inline-flex items-center justify-center gap-2 bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4] disabled:opacity-50"
                >
                  {isPending && <Spinner />}
                  {isPending ? "Sorting..." : "Apply Sort"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
