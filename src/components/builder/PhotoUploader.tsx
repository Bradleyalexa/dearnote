"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

interface PhotoItem {
  key: string;
  src: string; // Public URL for preview
  caption?: string;
}

interface PhotoUploaderProps {
  value: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
}

export default function PhotoUploader({ value, onChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > 5) {
      setError("Maksimal hanya boleh mengunggah 5 foto.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newPhotos: PhotoItem[] = [...value];

      for (const file of files) {
        // 1. Client-Side WebP Compression
        const options = {
          maxSizeMB: 1, // Compress to under 1MB
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp",
        };
        
        console.log(`Compressing ${file.name}...`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(1)} KB`);

        // 2. Request Pre-signed Upload URL
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp", // Set extension to WebP
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

        // 3. Upload Directly to R2 Bucket
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
          src: publicUrl, // Local preview URL
          caption: "",
        });
      }

      onChange(newPhotos);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setUploading(false);
      // Reset input element
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
        <label className="block text-sm font-semibold text-gray-700">
          Foto Kenangan (Maksimal 5)
        </label>
        <span className="text-xs text-gray-400 font-medium">{value.length}/5 Foto</span>
      </div>

      {/* Photo Grid Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.map((photo, idx) => (
            <div
              key={photo.key}
              className="flex flex-col bg-white border border-rose-100 rounded-xl overflow-hidden shadow-sm p-3 relative group"
            >
              {/* Delete button */}
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all z-10 text-xs"
              >
                ✕
              </button>

              <img
                src={photo.src}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />

              <input
                type="text"
                placeholder="Tambahkan teks/caption foto..."
                value={photo.caption || ""}
                onChange={(e) => updateCaption(idx, e.target.value)}
                maxLength={120}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium text-gray-600"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Trigger Area */}
      {value.length < 5 && (
        <div className="relative">
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              uploading
                ? "border-rose-300 bg-rose-50/20 cursor-not-allowed"
                : "border-rose-200 bg-rose-50/5 hover:bg-rose-50/10 hover:border-rose-300"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <span className="text-3xl mb-2">{uploading ? "⏳" : "📸"}</span>
              <p className="text-sm font-semibold text-gray-700">
                {uploading ? "Mengompres & Mengunggah..." : "Pilih/Tarik Foto"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Format: JPG, PNG, WEBP (Otomatis dikompres)
              </p>
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
        <p className="text-xs text-red-500 font-medium transition-all">{error}</p>
      )}
    </div>
  );
}
