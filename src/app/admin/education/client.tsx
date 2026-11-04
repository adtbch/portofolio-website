"use client";

import { useState } from "react";
import type { Education } from "@/types";
import { AutoSortButton } from "../auto-sort-button";

interface Props {
  education: Education[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function EducationClientManager({ education, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  function openAddModal() {
    setEditingEdu(null);
    setIsModalOpen(true);
  }

  function openEditModal(edu: Education) {
    setEditingEdu(edu);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Education: {education.length}</span>
        <div className="flex items-center gap-2">
          <AutoSortButton table="education" nameLabel="Institusi" />
          <button
            onClick={openAddModal}
            className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
          >
            + Add New Education
          </button>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Institution</th>
              <th className="p-4">Degree</th>
              <th className="p-4">Period</th>
              <th className="p-4">GPA</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {education.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pendidikan terdaftar.
                </td>
              </tr>
            ) : (
              education.map((edu) => (
                <tr key={edu.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#f5f5f7]">{edu.institution}</td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{edu.degree}</td>
                  <td className="p-4 font-mono text-xs">{edu.period || "-"}</td>
                  <td className="p-4 font-mono text-xs">{edu.gpa || "-"}</td>
                  <td className="p-4 font-mono text-xs">
                    {edu.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{edu.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(edu)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={edu.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Yakin ingin menghapus data pendidikan ini?")) e.preventDefault();
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
              {editingEdu ? `Edit Education: ${editingEdu.institution}` : "Add New Education"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingEdu && <input type="hidden" name="id" value={editingEdu.id} />}

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Institution *</label>
                <input
                  type="text"
                  name="institution"
                  defaultValue={editingEdu?.institution || ""}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Degree *</label>
                <input
                  type="text"
                  name="degree"
                  defaultValue={editingEdu?.degree || ""}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Period (e.g., 2019-2023)</label>
                <input
                  type="text"
                  name="period"
                  defaultValue={editingEdu?.period || ""}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingEdu?.description || ""}
                  rows={3}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">GPA</label>
                <input
                  type="text"
                  name="gpa"
                  defaultValue={editingEdu?.gpa || ""}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingEdu?.sort_order ?? 0}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={editingEdu?.published ?? true}
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
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}