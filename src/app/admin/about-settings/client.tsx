"use client";

import { useState } from "react";
import type { AboutSettings } from "@/types";

interface Props {
  aboutSettings: AboutSettings[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function AboutSettingsClientManager({ aboutSettings, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<AboutSettings | null>(null);

  function openAddModal() {
    setEditingSetting(null);
    setIsModalOpen(true);
  }

  function openEditModal(setting: AboutSettings) {
    setEditingSetting(setting);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total About Settings: {aboutSettings.length}</span>
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
              <th className="p-4">Heading</th>
              <th className="p-4">Title</th>
              <th className="p-4">Published</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {aboutSettings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pengaturan about terdaftar.
                </td>
              </tr>
            ) : (
              aboutSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7]">{setting.heading}</td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{setting.title}</td>
                  <td className="p-4 font-mono text-xs">
                    {setting.body_left || setting.body_right ? <span className="text-emerald-400">Has Content</span> : <span className="text-amber-400">Empty</span>}
                  </td>
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
                          if (!confirm("Yakin ingin menghapus pengaturan about ini?")) e.preventDefault();
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
              {editingSetting ? `Edit About: ${editingSetting.heading}` : "Add New About Setting"}
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
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Heading *</label>
                <input
                  type="text"
                  name="heading"
                  defaultValue={editingSetting?.heading || "Tentang Saya"}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSetting?.title || "Backend Developer & Robotics Engineer"}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Body Left (Paragraph 1)</label>
                <textarea
                  name="body_left"
                  defaultValue={editingSetting?.body_left || ""}
                  rows={4}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Body Right (Paragraph 2)</label>
                <textarea
                  name="body_right"
                  defaultValue={editingSetting?.body_right || ""}
                  rows={4}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">CTA Label (optional)</label>
                  <input
                    type="text"
                    name="cta_label"
                    defaultValue={editingSetting?.cta_label || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">CTA Href (optional)</label>
                  <input
                    type="text"
                    name="cta_href"
                    defaultValue={editingSetting?.cta_href || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
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
                  Save About Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}