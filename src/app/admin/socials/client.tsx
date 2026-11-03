"use client";

import { useState } from "react";
import type { Social } from "@/types";

interface Props {
  socials: Social[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

const commonPlatforms = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "email",
  "facebook",
  "youtube",
  "discord",
  "telegram",
  "medium",
  "devto",
  "stackoverflow",
  "other",
];

export default function SocialsClientManager({ socials, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);

  function openAddModal() {
    setEditingSocial(null);
    setIsModalOpen(true);
  }

  function openEditModal(social: Social) {
    setEditingSocial(social);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Social Links: {socials.length}</span>
        <button
          onClick={openAddModal}
          className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
        >
          + Add New Social Link
        </button>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Platform</th>
              <th className="p-4">Label</th>
              <th className="p-4">URL</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {socials.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada tautan sosial terdaftar.
                </td>
              </tr>
            ) : (
              socials.map((social) => (
                <tr key={social.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7] font-mono text-xs">{social.platform}</td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{social.label || "-"}</td>
                  <td className="p-4 font-mono text-xs max-w-xs truncate">{social.url}</td>
                  <td className="p-4 font-mono text-xs">
                    {social.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{social.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(social)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={social.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Yakin ingin menghapus tautan sosial ini?")) e.preventDefault();
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
          <div className="bg-[#151515] border border-[#2a2a2a] max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold font-mono text-[#f5f5f7] mb-4">
              {editingSocial ? `Edit Social: ${editingSocial.platform}` : "Add New Social Link"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingSocial && <input type="hidden" name="id" value={editingSocial.id} />}

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Platform *</label>
                <select
                  name="platform"
                  defaultValue={editingSocial?.platform || "github"}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                >
                  {commonPlatforms.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Label (optional, defaults to platform name)</label>
                <input
                  type="text"
                  name="label"
                  defaultValue={editingSocial?.label || ""}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">URL *</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingSocial?.url || ""}
                  required
                  placeholder="https://..."
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingSocial?.sort_order ?? 0}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={editingSocial?.published ?? true}
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
                  Save Social Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}