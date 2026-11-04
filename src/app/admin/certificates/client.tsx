"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/shared/spinner";
import type { Certificate } from "@/types";
import { AutoSortButton } from "../auto-sort-button";
import { DeleteButton } from "../delete-button";
import { ImageUploadField } from "../image-upload";

interface Props {
  certificates: Certificate[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function CertificateClientManager({ certificates, onSaveAction, onDeleteAction }: Props) {
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  function openAddModal() {
    setEditingCert(null);
    setImageUrl("");
    setImagePublicId("");
    setSortOrder(certificates.length ? Math.max(...certificates.map((c) => c.sort_order ?? 0)) + 1 : 0);
    setIsModalOpen(true);
  }

  function openEditModal(cert: Certificate) {
    setEditingCert(cert);
    setImageUrl(cert.image_url || "");
    setImagePublicId(cert.image_public_id || "");
    setSortOrder(cert.sort_order ?? 0);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Certificates: {certificates.length}</span>
        <div className="flex items-center gap-2">
          <AutoSortButton table="certificates" nameLabel="Judul" />
          <button
            onClick={openAddModal}
            className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
          >
            + Add New Certificate
          </button>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Title / Issuer</th>
              <th className="p-4">Issued At</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  No certificates found.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-[#f5f5f7]">{cert.title}</div>
                    <div className="text-xs text-[#a1a1aa] font-mono">{cert.issuer}</div>
                  </td>
                  <td className="p-4 text-[#a1a1aa] font-mono text-xs">{cert.issued_at || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-mono px-2 py-1 ${
                        cert.published ? "bg-green-950 text-green-300" : "bg-yellow-950 text-yellow-300"
                      }`}
                    >
                      {cert.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td className="p-4 text-[#a1a1aa] font-mono text-xs">{cert.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="text-xs font-mono text-[#22d3ee] hover:underline"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={cert.id} />
                      <DeleteButton
                        confirmMessage="Yakin ingin menghapus sertifikat ini?"
                        className="text-xs font-mono text-red-400 hover:underline"
                      >
                        Delete
                      </DeleteButton>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#151515] border border-[#2a2a2a] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
              <h2 className="font-heading text-lg font-semibold">
                {editingCert ? "Edit Certificate" : "Add New Certificate"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-[#f5f5f7]">
                ✕
              </button>
            </div>
            <form
              key={editingCert?.id ?? "new"}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                startTransition(async () => {
                  await onSaveAction(formData);
                  setIsModalOpen(false);
                });
              }}
              className="p-6 space-y-4"
            >
              {editingCert && <input type="hidden" name="id" value={editingCert.id} />}
              <input type="hidden" name="image_public_id" value={imagePublicId} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">TITLE *</label>
                  <input
                    name="title"
                    defaultValue={editingCert?.title || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">ISSUER *</label>
                  <input
                    name="issuer"
                    defaultValue={editingCert?.issuer || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">ISSUED AT (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    name="issued_at"
                    defaultValue={editingCert?.issued_at || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">CREDENTIAL URL</label>
                  <input
                    name="credential_url"
                    defaultValue={editingCert?.credential_url || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField
                    label="Image"
                    value={imageUrl}
                    folder="certificates"
                    onChange={(url, publicId) => {
                      setImageUrl(url);
                      setImagePublicId(publicId);
                    }}
                    previewClass="w-12 h-12 object-cover border border-[#2a2a2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">SORT ORDER</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number.parseInt(e.target.value || "0", 10) || 0)}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingCert?.published !== false}
                    id="published"
                    className="accent-[#22d3ee]"
                  />
                  <label htmlFor="published" className="text-sm">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-[#a1a1aa] hover:text-[#f5f5f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className="inline-flex items-center justify-center gap-2 bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] disabled:opacity-50"
                >
                  {isPending && <Spinner />}
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
