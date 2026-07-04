"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { useI18nStore } from "@/lib/i18n/store";

interface PhotoItem {
  key: string;
  src: string;
  caption?: string;
}

interface PhotoUploaderProps {
  value: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  max?: number;
}

export default function PhotoUploader({ value, onChange, max = 5 }: PhotoUploaderProps) {
  const { lang } = useI18nStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...value];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, removed);

    onChange(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Mobile Touch Drag & Drop support using elementFromPoint
  const handleTouchStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;

    const itemEl = target.closest("[data-drag-index]");
    if (!itemEl) return;

    const indexAttr = itemEl.getAttribute("data-drag-index");
    if (indexAttr === null) return;

    const targetIndex = parseInt(indexAttr, 10);
    if (targetIndex !== draggedIndex) {
      const reordered = [...value];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, removed);
      onChange(reordered);
      setDraggedIndex(targetIndex);
      setDragOverIndex(targetIndex);
    }
  };

  const handleTouchEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;

    const reordered = [...value];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    onChange(reordered);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > max) {
      setError(
        lang === "en"
          ? `You can only upload up to ${max} photos.`
          : `Maksimal hanya boleh mengunggah ${max} foto.`
      );
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newPhotos: PhotoItem[] = [...value];

      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp",
        };

        console.log(`Compressing ${file.name}...`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(1)} KB`);

        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
            contentType: "image/webp",
            fileSize: compressedFile.size,
            kind: "photo",
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Gagal mendapatkan pre-signed URL");
        }

        const { uploadUrl, key, publicUrl } = await res.json();

        console.log(`Uploading ${key} directly to R2...`);
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "image/webp",
          },
          body: compressedFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah gambar ke penyimpanan.");
        }

        newPhotos.push({
          key,
          src: publicUrl,
          caption: "",
        });
      }

      onChange(newPhotos);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = value.map((photo, i) =>
      i === index ? { ...photo, caption } : photo
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            {lang === "en" ? `Memory Photos (Max ${max})` : `Foto Kenangan (Maksimal ${max})`}
          </label>
          {max === 1 ? (
            <p className="text-xs text-rose-500 font-medium leading-normal mt-0.5">
              {lang === "en" 
                ? "💡 Circular avatar photo for the landing/intro page." 
                : "💡 Foto avatar bulat untuk halaman pembuka (intro)."}
            </p>
          ) : max === 2 ? (
            <p className="text-xs text-rose-500 font-medium leading-normal mt-0.5">
              {lang === "en" 
                ? "💡 Photo 1 is for landing page, Photo 2 is for inside the concert ticket." 
                : "💡 Foto #1 untuk poster depan, Foto #2 untuk di dalam tiket kencan."}
            </p>
          ) : (
            value.length > 1 && (
              <p className="text-xs text-gray-500 font-medium">
                {lang === "en" 
                  ? "Drag handle ☰ or use arrow buttons to reorder" 
                  : "Tarik handle ☰ atau gunakan tombol panah untuk menyusun urutan"}
              </p>
            )
          )}
        </div>
        <span className="text-xs text-gray-500 font-medium">{value.length}/{max} {lang === "en" ? "Photos" : "Foto"}</span>
      </div>

      {/* Photo Grid Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.map((photo, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && draggedIndex !== idx;

            return (
              <div
                key={photo.key}
                data-drag-index={idx}
                draggable={!uploading}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md p-3 relative group transition-all duration-200 select-none ${
                  isDragging
                    ? "opacity-40 scale-95 border-gray-400 border-dashed"
                    : isOver
                    ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/10 scale-[1.02]"
                    : "border-gray-200"
                }`}
              >
                {/* Drag Handle (Mobile touch source & Desktop indicator) */}
                <div
                  onTouchStart={() => handleTouchStart(idx)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="absolute top-5 left-5 w-8 h-8 rounded-full bg-gray-900/80 hover:bg-gray-900 text-white flex items-center justify-center cursor-grab active:cursor-grabbing z-10 select-none touch-none transition-colors"
                  title="Tarik untuk memindahkan"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-all z-10 cursor-pointer group/btn"
                  aria-label="Hapus foto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <img
                  src={photo.src}
                  alt={`Uploaded ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  draggable={false}
                />

                {/* Order fallback navigation buttons */}
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs text-gray-500 font-semibold">Foto {idx + 1}</span>
                  {value.length > 1 && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, "left")}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Pindahkan ke kiri"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        disabled={idx === value.length - 1}
                        onClick={() => moveItem(idx, "right")}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Pindahkan ke kanan"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Tambahkan caption foto..."
                  value={photo.caption || ""}
                  onChange={(e) => updateCaption(idx, e.target.value)}
                  maxLength={120}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Trigger Area */}
      {value.length < 5 && (
        <div className="relative">
          <label
            className={`flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-xl transition-all ${
              uploading
                ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
            }`}
          >
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
              {uploading ? (
                <>
                  <svg className="w-10 h-10 text-gray-400 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-semibold text-gray-700">Mengompres & Mengunggah...</p>
                  <p className="text-xs text-gray-500 mt-1">Mohon tunggu sebentar</p>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Klik untuk memilih foto</p>
                  <p className="text-xs text-gray-500">atau tarik & lepas file di sini</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP • Otomatis dikompres</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
