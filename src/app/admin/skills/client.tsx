"use client";

import { useState, useTransition } from "react";
import type { Skill } from "@/types";
import { AutoSortButton } from "../auto-sort-button";

interface Props {
  skills: Skill[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function SkillClientManager({ skills, onSaveAction, onDeleteAction }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setPublicId: (id: string) => void,
    folderName: string = "skills"
  ) {
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
        setPublicId(json.public_id || "");
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
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [iconUrl, setIconUrl] = useState("");
  const [iconPublicId, setIconPublicId] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isPending, startTransition] = useTransition();

  function openAddModal() {
    setEditingSkill(null);
    setIconUrl("");
    setIconPublicId("");
    const nextSort = skills.length ? Math.max(...skills.map((s) => s.sort_order)) + 1 : 0;
    setSortOrder(nextSort);
    setIsModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill);
    setIconUrl(skill.icon_url || "");
    setIconPublicId(skill.icon_public_id || "");
    setSortOrder(skill.sort_order);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Skills: {skills.length}</span>
        <div className="flex items-center gap-2">
          <AutoSortButton table="skills" groupLabel="Group" />
          <button
            onClick={openAddModal}
            className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
          >
            + Add New Skill
          </button>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Group</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {skills.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada skill terdaftar.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7]">{skill.name}</td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{skill.group}</td>
                  <td className="p-4 font-mono text-xs">
                    {skill.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{skill.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={skill.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Yakin ingin menghapus skill ini?")) e.preventDefault();
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold font-mono text-[#f5f5f7] mb-4">
              {editingSkill ? `Edit Skill: ${editingSkill.name}` : "Add New Skill"}
            </h2>

            <form
              key={editingSkill?.id ?? "new"}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                startTransition(async () => {
                  await onSaveAction(formData);
                  setIsModalOpen(false);
                });
              }}
              className="space-y-4"
            >
              {editingSkill && <input type="hidden" name="id" value={editingSkill.id} />}
              <input type="hidden" name="icon_public_id" value={iconPublicId} />

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSkill?.name || ""}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Group</label>
                <select
                  name="group"
                  defaultValue={editingSkill?.group || "languages"}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                >
                  <option value="languages">Languages</option>
                  <option value="frameworks">Frameworks</option>
                  <option value="databases">Databases</option>
                  <option value="tools">Tools</option>
                  <option value="embedded">Embedded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Icon URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="icon_url"
                    value={iconUrl}
                    onChange={(e) => {
                      setIconUrl(e.target.value);
                      setIconPublicId("");
                    }}
                    placeholder="https://... or upload icon"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                  <label className={`cursor-pointer bg-[#2a2a2a] hover:bg-[#333] text-[#f5f5f7] px-3 py-2 font-mono text-xs whitespace-nowrap border border-[#333] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : 'Upload Icon'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setIconUrl, setIconPublicId, "skills")}
                    />
                  </label>
                </div>
                {iconUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={iconUrl} alt="Preview" className="w-10 h-10 object-contain border border-[#2a2a2a] bg-white p-1" />
                    <span className="text-xs text-[#a1a1aa] truncate">{iconUrl}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number.parseInt(e.target.value || "0", 10) || 0)}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={editingSkill?.published ?? true}
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
                  disabled={isPending}
                  className="bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4] disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
