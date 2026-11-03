"use client";

import { useState } from "react";
import type { Certificate } from "@/types";

interface Props {
  certificates: Certificate[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function CertificateClientManager({ certificates, onSaveAction, onDeleteAction }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, folderName: string = "certificates") {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", folderName);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        setUrl(json.url);
      } else {
        alert(json.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  function openAddModal() {
    setEditingCert(null);
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(cert: Certificate) {
    setEditingCert(cert);
    setImageUrl(cert.image_url || "");
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Certificates: {certificates.length}</span>
        <button
          onClick={openAddModal}
          className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
        >
          + Add New Certificate
        </button>
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
                      <button type="submit" className="text-xs font-mono text-red-400 hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151515] border border-[#2a2a2a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
              <h2 className="font-heading text-lg font-semibold">
                {editingCert ? "Edit Certificate" : "Add New Certificate"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-[#f5f5f7]">
                ✕
              </button>
            </div>
            <form action={onSaveAction} className="p-6 space-y-4">
              {editingCert && <input type="hidden" name="id" value={editingCert.id} />}
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
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">IMAGE URL</label>
                  <div className="flex items-center gap-3">
                    <input
                      name="image_url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or upload image"
                      className="w-full bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                    />
                    <label className={`cursor-pointer bg-[#2a2a2a] hover:bg-[#333] text-[#f5f5f7] px-3 py-2 font-mono text-xs whitespace-nowrap border border-[#333] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setImageUrl, "certificates")}
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover border border-[#2a2a2a]" />
                      <span className="text-xs text-[#a1a1aa] truncate">{imageUrl}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] mb-2">SORT ORDER</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingCert?.sort_order || 0}
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
