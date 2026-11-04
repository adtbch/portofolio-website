"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (url: string, publicId: string) => void;
  folder: string;
  /** nama field pada FormData, default image_url */
  inputName?: string;
  placeholder?: string;
  uploadLabel?: string;
  /** kelas untuk preview gambar, default kotak kecil */
  previewClass?: string;
  /** tinggi area dropzone, default h-24 */
  dropHeight?: string;
}

async function uploadFile(file: File, folder: string): Promise<{ url?: string; public_id?: string; error?: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar." };
  }
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) return { url: json.url, public_id: json.public_id || "" };
    return { error: json.error || "Upload gagal." };
  } catch {
    return { error: "Upload error." };
  }
}

/** Ctrl+V / Cmd+V di mana pun selama fokus ada di dalam container ini */
function usePasteToUpload(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onFile: (file: File) => void,
) {
  const handlerRef = useRef(onFile);
  handlerRef.current = onFile;

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const container = containerRef.current;
      if (!container) return;
      const active = document.activeElement;
      if (!active || !container.contains(active)) return;
      const file = Array.from(e.clipboardData?.files || []).find((f) => f.type.startsWith("image/"));
      if (file) {
        e.preventDefault();
        handlerRef.current(file);
      }
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [containerRef]);
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  inputName = "image_url",
  placeholder = "https://... or drag & drop / paste image",
  uploadLabel = "Upload Image",
  previewClass = "w-12 h-12 object-cover border border-[#2a2a2a]",
  dropHeight = "h-24",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function upload(file: File) {
    setError("");
    setUploading(true);
    const result = await uploadFile(file, folder);
    setUploading(false);
    if (result.url) {
      onChange(result.url, result.public_id || "");
    } else {
      setError(result.error || "Upload gagal.");
    }
  }

  usePasteToUpload(containerRef, (file) => void upload(file));

  function handleFiles(files: FileList | null | undefined) {
    const file = files?.[0];
    if (file) void upload(file);
  }

  return (
    <div ref={containerRef}>
      <label className="block text-xs font-mono uppercase text-[#a1a1aa] mb-1">{label}</label>

      <div
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const file = Array.from(e.clipboardData.files)[0];
          if (file) {
            e.preventDefault();
            void upload(file);
          }
        }}
        className={`border p-3 transition-colors outline-none ${
          dragging
            ? "border-[#22d3ee] bg-[#22d3ee]/5"
            : "border-[#2a2a2a] focus:border-[#22d3ee]"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            name={inputName}
            value={value}
            onChange={(e) => onChange(e.target.value, "")}
            placeholder={placeholder}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-2 text-sm focus:outline-none focus:border-[#22d3ee]"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-[#2a2a2a] hover:bg-[#333] text-[#f5f5f7] px-3 py-2 font-mono text-xs whitespace-nowrap border border-[#333] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : uploadLabel}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className={`mt-2 ${dropHeight} border border-dashed border-[#2a2a2a] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#22d3ee]/60 transition-colors`}
        >
          <span className="text-xs font-mono text-[#a1a1aa]">
            {uploading ? "Uploading..." : "Drag & drop gambar ke sini"}
          </span>
          <span className="text-[10px] font-mono text-[#a1a1aa]/60">
            atau klik, atau Ctrl+V paste dari clipboard
          </span>
        </div>

        {error && <p className="mt-2 text-xs font-mono text-red-400">{error}</p>}

        {value && (
          <div className="mt-2 flex items-center gap-2">
            <img src={value} alt="Preview" className={previewClass} />
            <span className="text-xs text-[#a1a1aa] truncate">{value}</span>
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="ml-auto text-xs font-mono text-red-400 hover:underline whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface MultiProps {
  label: string;
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
  folder: string;
  uploadLabel?: string;
}

/** Banyak gambar: drag & drop / paste / pilih file, otomatis ditambahkan ke list */
export function MultiImageUploadField({
  label,
  images,
  onAdd,
  onRemove,
  folder,
  uploadLabel = "Upload & Add",
}: MultiProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function upload(files: FileList | File[] | null | undefined) {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setError("");
    setUploading(true);
    for (const file of list) {
      const result = await uploadFile(file, folder);
      if (result.url) onAdd(result.url);
      else setError(result.error || "Upload gagal.");
    }
    setUploading(false);
  }

  usePasteToUpload(containerRef, (file) => void upload([file]));

  return (
    <div ref={containerRef}>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-mono uppercase text-[#a1a1aa]">{label}</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-[#2a2a2a] hover:bg-[#333] text-[#f5f5f7] px-2 py-1 font-mono text-xs border border-[#333] disabled:opacity-50"
        >
          {uploading ? "Uploading..." : uploadLabel}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
          if (files.length) {
            e.preventDefault();
            void upload(files);
          }
        }}
        className={`border border-dashed p-3 text-center cursor-pointer transition-colors outline-none ${
          dragging ? "border-[#22d3ee] bg-[#22d3ee]/5" : "border-[#2a2a2a] hover:border-[#22d3ee]/60"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <span className="text-xs font-mono text-[#a1a1aa]">
          {uploading ? "Uploading..." : "Drag & drop / klik / Ctrl+V paste (bisa banyak sekaligus)"}
        </span>
      </div>

      {error && <p className="mt-2 text-xs font-mono text-red-400">{error}</p>}

      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-[#2a2a2a] bg-[#0f0f0f] p-2">
        {images.length === 0 && <div className="text-xs text-[#6b6b6b] font-mono p-2">Belum ada gambar</div>}
        {images.map((url, idx) => (
          <div key={`${url}-${idx}`} className="flex items-center gap-2">
            <img src={url} alt={`Doc ${idx + 1}`} className="w-10 h-10 object-cover border border-[#2a2a2a]" />
            <span className="text-xs text-[#a1a1aa] truncate flex-1">{url}</span>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="text-xs font-mono text-red-400 hover:underline whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
