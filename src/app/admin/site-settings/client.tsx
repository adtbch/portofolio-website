"use client";

import { useState } from "react";
import type { SiteSetting } from "@/types";
import React from "react";
import { DeleteButton } from "../delete-button";
import { SubmitButton } from "../submit-button";

interface Props {
  settings: SiteSetting[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function SiteSettingsClientManager({ settings, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);

  function openAddModal() {
    setEditingSetting(null);
    setIsModalOpen(true);
  }

  function openEditModal(setting: SiteSetting) {
    setEditingSetting(setting);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Settings: {settings.length}</span>
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
              <th className="p-4">Key</th>
              <th className="p-4">Value</th>
              <th className="p-4">Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {settings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pengaturan situs terdaftar.
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.key} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7] font-mono text-xs">{setting.key}</td>
                  <td className="p-4 font-mono text-xs max-w-xs truncate">{setting.value}</td>
                  <td className="p-4 font-mono text-xs">
                    {setting.updated_at ? new Date(setting.updated_at).toLocaleString("id-ID") : "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(setting)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="key" value={setting.key} />
                      <DeleteButton confirmMessage="Yakin ingin menghapus pengaturan ini?" className="bg-red-950/50 text-red-300 px-3 py-1 text-xs font-mono hover:bg-red-900">Delete</DeleteButton>
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
              {editingSetting ? `Edit Setting: ${editingSetting.key}` : "Add New Site Setting"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingSetting && <input type="hidden" name="key" value={editingSetting.key} />}

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Key *</label>
                <input
                  type="text"
                  name="key"
                  defaultValue={editingSetting?.key || ""}
                  required
                  placeholder="e.g., site_name, meta_description, ga_id"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Value *</label>
                <textarea
                  name="value"
                  defaultValue={editingSetting?.value || ""}
                  required
                  rows={4}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#2a2a2a] text-[#f5f5f7] px-4 py-2 font-mono text-xs hover:bg-[#333]"
                >
                  Cancel
                </button>
                <SubmitButton className="bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4]">Save Setting</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}