"use client";

import { useState } from "react";
import type { Experience, Project } from "@/types";
import { AutoSortButton } from "../auto-sort-button";
import { SubmitButton } from "../submit-button";
import { DeleteButton } from "../delete-button";
import { ImageUploadField } from "../image-upload";

type ProjectMinimal = Pick<Project, "id" | "title" | "slug">;

interface Props {
  experiences: Experience[];
  projects: ProjectMinimal[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function ExperienceClientManager({ experiences, projects, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePublicId, setImagePublicId] = useState("");

    function openAddModal() {
      setEditingExperience(null);
      setImageUrl("");
      setImagePublicId("");
      setIsModalOpen(true);
    }

    function openEditModal(exp: Experience) {
      setEditingExperience(exp);
      setImageUrl(exp.logo_url || "");
      setImagePublicId(exp.logo_public_id || "");
      setIsModalOpen(true);
    }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Experiences: {experiences.length}</span>
        <div className="flex items-center gap-2">
          <AutoSortButton table="experiences" nameLabel="Perusahaan" />
          <button
            onClick={openAddModal}
            className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
          >
            + Add New Experience
          </button>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Company / Role</th>
              <th className="p-4">Type</th>
              <th className="p-4">Period</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pengalaman terdaftar.
                </td>
              </tr>
            ) : (
              experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#f5f5f7]">{exp.company}</div>
                    <div className="font-mono text-xs text-[#22d3ee]">{exp.role}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#a1a1aa]">{exp.type || "-"}</td>
                  <td className="p-4 font-mono text-xs text-[#a1a1aa]">
                    {exp.start_date} &rarr; {exp.end_date || "Present"}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {exp.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{exp.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={exp.id} />
                      <DeleteButton confirmMessage="Yakin ingin menghapus pengalaman ini?" className="bg-red-950/50 text-red-300 px-3 py-1 text-xs font-mono hover:bg-red-900">Delete</DeleteButton>
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
              {editingExperience ? `Edit Experience: ${editingExperience.company}` : "Add New Experience"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingExperience && <input type="hidden" name="id" value={editingExperience.id} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingExperience?.company || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Role *</label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingExperience?.role || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Company Logo / Image"
                  value={imageUrl}
                  folder="experience"
                  inputName="logo_url"
                  onChange={(url, publicId) => {
                    setImageUrl(url);
                    setImagePublicId(publicId);
                  }}
                />
              </div>

                                <input type="hidden" name="logo_public_id" value={imagePublicId} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Type</label>
                  <select
                    name="type"
                    defaultValue={editingExperience?.type || "fulltime"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  >
                    <option value="fulltime">Full-time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingExperience?.location || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingExperience?.sort_order ?? 0}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Start Date *</label>
                  <input
                    type="text"
                    name="start_date"
                    placeholder="Jan 2023"
                    defaultValue={editingExperience?.start_date || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">End Date (leave blank if present)</label>
                  <input
                    type="text"
                    name="end_date"
                    placeholder="Present"
                    defaultValue={editingExperience?.end_date || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Descriptions (one per line)</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingExperience?.description ? editingExperience.description.join("\n") : ""}
                  placeholder="Developed core features&#10;Optimized database queries"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  name="tech_stack"
                  defaultValue={editingExperience?.tech_stack ? editingExperience.tech_stack.join(", ") : ""}
                  placeholder="Next.js, TypeScript, PostgreSQL"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Proyek Terkait</label>
                <div className="space-y-2 border border-[#2a2a2a] p-3 max-h-48 overflow-y-auto bg-[#0f0f0f]">
                  {projects && projects.length > 0 ? (
                    projects.map((p: any) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm text-[#f5f5f7] cursor-pointer">
                        <input
                          type="checkbox"
                          name="project_ids"
                          value={p.id}
                          defaultChecked={(editingExperience as any)?.projects?.some((linked: any) => linked.id === p.id)}
                          className="accent-[#22d3ee]"
                        />
                        <span>{p.title} ({p.slug})</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-[#a1a1aa] font-mono">No projects available</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="published"
                  id="exp_published"
                  defaultChecked={editingExperience?.published ?? true}
                  className="accent-[#22d3ee]"
                />
                <label htmlFor="exp_published" className="text-xs font-mono cursor-pointer">Published on portfolio</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#2a2a2a] text-[#f5f5f7] px-4 py-2 font-mono text-xs hover:bg-[#333]"
                >
                  Cancel
                </button>
                <SubmitButton className="bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4]">Save Experience</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
