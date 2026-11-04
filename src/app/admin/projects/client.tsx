"use client";

import { useState } from "react";
import type { Project } from "@/types";
import { AutoSortButton } from "../auto-sort-button";
import { SubmitButton } from "../submit-button";
import { DeleteButton } from "../delete-button";
import { ImageUploadField, MultiImageUploadField } from "../image-upload";

interface Props {
  projects: Project[];
  onSaveAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function ProjectClientManager({ projects, onSaveAction, onDeleteAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);

  function openAddModal() {
    setEditingProject(null);
    setCoverUrl("");
    setCoverPublicId("");
    setImagesList([]);
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setCoverUrl(project.cover_image_url || "");
    setCoverPublicId((project as any).cover_public_id || "");
    if (project.images && project.images.length > 0) {
      setImagesList(project.images.map((img: any) => img.url).filter(Boolean));
    } else if ((project as any).gallery && Array.isArray((project as any).gallery)) {
      setImagesList((project as any).gallery.filter(Boolean));
    } else {
      setImagesList([]);
    }
    setIsModalOpen(true);
  }

  function removeImage(idx: number) {
    setImagesList((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Projects: {projects.length}</span>
        <div className="flex items-center gap-2">
          <AutoSortButton table="projects" nameLabel="Judul" />
          <button
            onClick={openAddModal}
            className="bg-[#22d3ee] text-[#0f0f0f] font-mono text-xs uppercase font-bold px-4 py-2 hover:bg-[#06b6d4] transition-colors"
          >
            + Add New Project
          </button>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">Title / Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Published</th>
              <th className="p-4">Sort</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada proyek yang terdaftar.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#f5f5f7]">{p.title}</div>
                    <div className="font-mono text-xs text-[#a1a1aa]">{p.slug}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#22d3ee]">{p.category || "-"}</td>
                  <td className="p-4 font-mono text-xs">
                    {p.featured ? <span className="text-emerald-400">Yes</span> : <span className="text-[#a1a1aa]">No</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {p.published ? <span className="text-emerald-400">Published</span> : <span className="text-amber-400">Draft</span>}
                  </td>
                  <td className="p-4 font-mono text-xs">{p.sort_order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1 text-xs font-mono hover:bg-[#333]"
                    >
                      Edit
                    </button>
                    <form action={onDeleteAction} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton confirmMessage="Yakin ingin menghapus proyek ini?" className="bg-red-950/50 text-red-300 px-3 py-1 text-xs font-mono hover:bg-red-900">Delete</DeleteButton>
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
          <div className="bg-[#151515] border border-[#2a2a2a] max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold font-mono text-[#f5f5f7] mb-4">
              {editingProject ? `Edit Project: ${editingProject.title}` : "Add New Project"}
            </h2>

            <form
              action={async (formData) => {
                await onSaveAction(formData);
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {editingProject && <input type="hidden" name="id" value={editingProject.id} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingProject?.title || ""}
                    required
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingProject?.slug || ""}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingProject?.subtitle || ""}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Cover Image"
                  value={coverUrl}
                  folder="projects"
                  inputName="cover_image_url"
                  uploadLabel="Upload Cover"
                  onChange={(url, publicId) => {
                    setCoverUrl(url);
                    setCoverPublicId(publicId);
                  }}
                />
                <input type="hidden" name="cover_public_id" value={coverPublicId} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProject?.category || "web"}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  >
                    <option value="web">Web</option>
                    <option value="backend">Backend</option>
                    <option value="iot">IoT</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingProject?.sort_order ?? 0}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={editingProject?.featured ?? false}
                      className="accent-[#22d3ee]"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={editingProject?.published ?? true}
                      className="accent-[#22d3ee]"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProject?.description || ""}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Live URL</label>
                  <input
                    type="url"
                    name="live_url"
                    defaultValue={editingProject?.live_url || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Repo URL</label>
                  <input
                    type="url"
                    name="repo_url"
                    defaultValue={editingProject?.repo_url || ""}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <input type="hidden" name="images" value={imagesList.join("\n")} />
                <MultiImageUploadField
                  label="Documentation Images"
                  images={imagesList}
                  folder="projects/documentation"
                  onAdd={(url) => setImagesList((prev) => [...prev, url])}
                  onRemove={removeImage}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  name="tech_stack"
                  defaultValue={editingProject?.tech_stack ? editingProject.tech_stack.join(", ") : ""}
                  placeholder="React, Next.js, Tailwind, Supabase"
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
                <SubmitButton className="bg-[#22d3ee] text-[#0f0f0f] px-4 py-2 font-mono text-xs uppercase font-bold hover:bg-[#06b6d4]">Save Project</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
