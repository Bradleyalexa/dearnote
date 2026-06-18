"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

interface PhotoItem {
  key: string;
  src: string;
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
        <label className="block text-sm font-semibold text-gray-900">
          Foto Kenangan (Maksimal 5)
        </label>
        <span className="text-xs text-gray-500 font-medium">{value.length}/5 Foto</span>
      </div>

      {/* Photo Grid Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.map((photo, idx) => (
            <div
              key={photo.key}
              className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-3 relative group"
            >
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
              />

              <input
                type="text"
                placeholder="Tambahkan caption foto..."
                value={photo.caption || ""}
                onChange={(e) => updateCaption(idx, e.target.value)}
                maxLength={120}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
              />
            </div>
          ))}
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
