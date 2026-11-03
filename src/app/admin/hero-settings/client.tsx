"use client";

import { useState } from "react";
import type { HeroSettings } from "@/types";

interface Props {
  heroSettings: HeroSettings[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function HeroSettingsClientManager({ heroSettings, onSaveAction, onDeleteAction }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, setPublicId?: (id: string) => void, folderName: string = "hero") {
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
        if (setPublicId && json.public_id) {
          setPublicId(json.public_id);
        }
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
  const [editingSetting, setEditingSetting] = useState<HeroSettings | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  function openAddModal() {
    setEditingSetting(null);
    setImageUrl("");
    setImagePublicId("");
    setIsModalOpen(true);
  }

  function openEditModal(setting: HeroSettings) {
    setEditingSetting(setting);
    setImageUrl(setting.image_url || "");
    setImagePublicId(setting.image_public_id || "");
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Hero Settings: {heroSettings.length}</span>
        <button
          onClick={openAddModal}
          className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
        >
          + Add New Setting
        </button>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {heroSettings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pengaturan hero terdaftar.
                </td>
              </tr>
            ) : (
              heroSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7]">{setting.name}</td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{setting.role}</td>
                  <td className="p-4 font-mono text-xs">
                    {setting.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{setting.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(setting)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={setting.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Yakin ingin menghapus pengaturan hero ini?")) e.preventDefault();
                        }}
                        className="bg-red-950/50 text-red-300 px-3 py-1 text-xs font-mono hover:bg-red-900"
                      >
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#151515] border border-[#2a2a2a] max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold font-mono text-[#f5f5f7] mb-4">
              {editingSetting ? `Edit Hero: ${editingSetting.name}` : "Add New Hero Setting"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingSetting && <input type="hidden" name="id" value={editingSetting.id} />}

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSetting?.name || ""}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Role *</label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingSetting?.role || ""}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingSetting?.description || ""}
                  rows={3}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Primary CTA Label</label>
                  <input
                    type="text"
                    name="cta_primary_label"
                    defaultValue={editingSetting?.cta_primary_label || "Lihat Karya"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Primary CTA Href</label>
                  <input
                    type="text"
                    name="cta_primary_href"
                    defaultValue={editingSetting?.cta_primary_href || "#works"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Secondary CTA Label</label>
                  <input
                    type="text"
                    name="cta_secondary_label"
                    defaultValue={editingSetting?.cta_secondary_label || "Hubungi"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Secondary CTA Href</label>
                  <input
                    type="text"
                    name="cta_secondary_href"
                    defaultValue={editingSetting?.cta_secondary_href || "#contact"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Image URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or upload image"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                  <label className={`cursor-pointer bg-[#2a2a2a] hover:bg-[#333] text-[#f5f5f7] px-3 py-2 font-mono text-xs whitespace-nowrap border border-[#333] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setImageUrl, setImagePublicId, "hero")}
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
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Image Public ID (auto-filled on upload)</label>
                <input
                  type="text"
                  name="image_public_id"
                  value={imagePublicId}
                  onChange={(e) => setImagePublicId(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Available Text</label>
                <input
                  type="text"
                  name="available_text"
                  defaultValue={editingSetting?.available_text || "Tersedia untuk bekerja"}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingSetting?.sort_order ?? 0}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="available"
                      defaultChecked={editingSetting?.available ?? true}
                      className="accent-[#22d3ee]"
                    />
                    <span>Available</span>
                  </label>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={editingSetting?.published ?? true}
                      className="accent-[#22d3ee]"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#2a2a2a] text-[#f5f5f7] px-4 py-2 font-mono text-xs hover:bg-[#333]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4]"
                >
                  Save Hero Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}