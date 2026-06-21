"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DraftBgMusic {
  key: string;
  src: string;
  durationSeconds?: number;
}

interface BackgroundMusicSelectorProps {
  value: DraftBgMusic | undefined;
  onChange: (val: DraftBgMusic | undefined) => void;
  /** Called with a local blob URL when a custom track is uploaded, or null when removed */
  onBlobUrlChange?: (url: string | null) => void;
}

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "acoustic", label: "Acoustic" },
  { id: "romantic", label: "Romantic" },
  { id: "classical", label: "Classical" },
  { id: "christmas", label: "Christmas" },
  { id: "songs", label: "Songs" },
];

const TRACKS = [
  { id: "track1", label: "Melodi Piano Romantis", src: "/audio/track1.mp3", duration: 20, category: "romantic" },
  { id: "track_acoustic", label: "Gitar Akustik Ceria", src: "/audio/track2.mp3", duration: 8, category: "acoustic" },
  { id: "track_classical", label: "Melodi Piano Klasik", src: "/audio/track1.mp3", duration: 20, category: "classical" },
  { id: "track_christmas", label: "Jingle Bells Joy", src: "/audio/track3.mp3", duration: 30, category: "christmas" },
  { id: "track_the1975_aboutyou", label: "About You — The 1975", src: "/audio/The 1975 - About You.mp3", duration: 24, category: "songs" },
];

export default function BackgroundMusicSelector({ value, onChange, onBlobUrlChange }: BackgroundMusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customTrack, setCustomTrack] = useState<DraftBgMusic | null>(() => {
    if (value && !TRACKS.some((t) => t.id === value.key)) {
      return value;
    }
    return null;
  });
  // Local blob URL for CORS-free preview of the freshly-compressed WAV
  const previewBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Revoke blob URL to free memory
      if (previewBlobUrlRef.current) {
        URL.revokeObjectURL(previewBlobUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (value && !TRACKS.some((t) => t.id === value.key)) {
      setCustomTrack(value);
    } else if (!value) {
      setCustomTrack(null);
    }
  }, [value]);

  const handlePlayPause = (trackId: string, src: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingTrack === trackId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Use local blob URL for custom track (CORS-free, instant);
      // for predefined tracks encode only relative segments (handles spaces in filenames).
      let audioSrc: string;
      if (trackId === customTrack?.key && previewBlobUrlRef.current) {
        audioSrc = previewBlobUrlRef.current;
        console.log("[BGM] Playing custom track via blob URL:", audioSrc.substring(0, 60));
      } else if (src.startsWith("http://") || src.startsWith("https://")) {
        audioSrc = src; // absolute URL — use as-is
        console.log("[BGM] Playing via absolute URL (no blob URL available):", src.substring(0, 80));
      } else {
        audioSrc = src.split("/").map((seg) => encodeURIComponent(seg)).join("/");
        console.log("[BGM] Playing via encoded relative URL:", audioSrc.substring(0, 80));
      }
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.loop = true;
      audio.play().catch((err) => console.error("[BGM] Playback failed:", err));
      setPlayingTrack(trackId);
    }
  };

  const handleSelect = (trackId: string | null) => {
    if (trackId === null) {
      onChange(undefined);
    } else {
      // Check if it's the custom track
      if (customTrack && customTrack.key === trackId) {
        onChange(customTrack);
        return;
      }
      // Check predefined tracks
      const track = TRACKS.find((t) => t.id === trackId);
      if (track) {
        onChange({
          key: track.id,
          src: track.src,
          durationSeconds: track.duration,
        });
      }
    }
  };

  /**
   * Compress audio using Web Audio API to mono WAV <1MB before uploading.
   * Tries 22050 Hz first; falls back to 16000 Hz if still >950 KB.
   */
  const compressAudioToWav = async (
    arrayBuffer: ArrayBuffer,
    targetSampleRate = 22050
  ): Promise<{ wav: Blob; duration: number }> => {
    const AudioCtx =
      window.AudioContext ||
      (window as any).webkitAudioContext;
    const decodeCtx = new AudioCtx();
    // slice(0) copies the buffer — decodeAudioData() detaches (transfers) its
    // argument, so without this the fallback second call would fail with
    // "Cannot decode detached ArrayBuffer".
    const decoded = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
    await decodeCtx.close();

    const duration = decoded.duration;
    if (duration > 30) {
      throw new Error("Durasi musik latar kustom maksimal 30 detik.");
    }

    // Render to mono at targetSampleRate
    const offlineCtx = new OfflineAudioContext(
      1, // mono
      Math.ceil(duration * targetSampleRate),
      targetSampleRate
    );
    const source = offlineCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(offlineCtx.destination);
    source.start(0);
    const rendered = await offlineCtx.startRendering();

    // Encode to 16-bit PCM WAV
    const samples = rendered.getChannelData(0);
    const numSamples = samples.length;
    const bytesPerSample = 2; // 16-bit
    const dataSize = numSamples * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);          // chunk size
    view.setUint16(20, 1, true);           // PCM
    view.setUint16(22, 1, true);           // mono
    view.setUint32(24, targetSampleRate, true);
    view.setUint32(28, targetSampleRate * bytesPerSample, true); // byte rate
    view.setUint16(32, bytesPerSample, true); // block align
    view.setUint16(34, 16, true);          // bits per sample
    writeStr(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    const wav = new Blob([buffer], { type: "audio/wav" });
    return { wav, duration };
  };

  const handleCustomBgmUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept up to 15MB source file — it will be compressed before upload
    if (file.size > 15 * 1024 * 1024) {
      setError("Maksimal ukuran file sumber audio adalah 15MB.");
      return;
    }

    setError(null);
    setUploading(true);

    // Create a preview blob URL from the ORIGINAL file immediately —
    // this is always decodable by the browser without WAV encoding.
    if (previewBlobUrlRef.current) URL.revokeObjectURL(previewBlobUrlRef.current);
    previewBlobUrlRef.current = URL.createObjectURL(file);
    onBlobUrlChange?.(previewBlobUrlRef.current);
    console.log("[BGM] Preview blob URL created:", previewBlobUrlRef.current);

    try {
      const sourceBuffer = await file.arrayBuffer();

      // First attempt: 22050 Hz mono → ~1.26 MB for 30s
      let { wav, duration } = await compressAudioToWav(sourceBuffer, 22050);
      console.log(`[BGM] Compressed at 22050Hz: ${(wav.size / 1024).toFixed(1)} KB, ${duration.toFixed(1)}s`);

      // If still >950 KB, retry at 16000 Hz → ~0.96 MB for 30s
      if (wav.size > 950 * 1024) {
        ({ wav, duration } = await compressAudioToWav(sourceBuffer, 16000));
        console.log(`[BGM] Recompressed at 16000Hz: ${(wav.size / 1024).toFixed(1)} KB`);
      }

      // Hard cap — should never happen with 30s clips, but guard just in case
      if (wav.size > 1 * 1024 * 1024) {
        throw new Error("Audio tidak dapat dikompresi cukup. Coba file yang lebih pendek.");
      }

      const fileName = `bgmusic-${Date.now()}-compressed.wav`;
      const contentType = "audio/wav";

      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          contentType,
          fileSize: wav.size,
          kind: "voice",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal mendapatkan pre-signed URL");
      }

      const { uploadUrl, key, publicUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: wav,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file audio.");
      }

      const newCustom = {
        key,
        src: publicUrl,
        durationSeconds: Math.round(duration),
      };

      setCustomTrack(newCustom);
      onChange(newCustom);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengunggah musik latar.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const selectedTrackId = value?.key || null;
  const selectedTrack = TRACKS.find((t) => t.id === selectedTrackId) || 
    (customTrack && customTrack.key === selectedTrackId 
      ? { id: customTrack.key, label: "Musik Latar Kustom Anda 🎙️", src: customTrack.src, duration: customTrack.durationSeconds || 0 } 
      : null);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrack(null);
    setIsOpen(false);
  };

  const filteredTracks = activeCategory === "all"
    ? TRACKS
    : TRACKS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-3 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-900">Background Music (Opsional)</label>
          <p className="text-xs text-gray-500">Pilih lagu latar untuk diputar saat jurnal dibuka oleh penerima.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          {selectedTrack ? selectedTrack.label : "Pilih Musik Latar"}
        </button>
      </div>

      {mounted && typeof document !== "undefined" && isOpen && createPortal(
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900">Pilih Musik Latar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Background Music</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categories */}
            <div className="flex-shrink-0 overflow-x-auto border-b border-gray-100 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex gap-2 px-6 py-3 w-max">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                      activeCategory === cat.id
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracks List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {/* None Option */}
              <div
                onClick={() => handleSelect(null)}
                className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                  selectedTrackId === null
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Tanpa Musik Latar</p>
                    <p className="text-xs text-gray-500">Hening saat jurnal dibuka</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTrackId === null ? "border-gray-900" : "border-gray-300"
                }`}>
                  {selectedTrackId === null && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                </div>
              </div>

              {/* Custom Track Card (if uploaded) */}
              {customTrack && (
                <div
                  onClick={() => handleSelect(customTrack.key)}
                  className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    selectedTrackId === customTrack.key
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handlePlayPause(customTrack.key, customTrack.src, e)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                        playingTrack === customTrack.key
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      title={playingTrack === customTrack.key ? "Jeda Musik" : "Putar Pratinjau"}
                    >
                      {playingTrack === customTrack.key ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">Musik Latar Kustom Anda 🎙️</p>
                      <p className="text-xs text-gray-500">Durasi Loop: {customTrack.durationSeconds}s (Maks 30s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Stop playback if playing
                        if (audioRef.current) audioRef.current.pause();
                        setPlayingTrack(null);
                        setCustomTrack(null);
                        // Revoke blob URL and notify parent
                        if (previewBlobUrlRef.current) {
                          URL.revokeObjectURL(previewBlobUrlRef.current);
                          previewBlobUrlRef.current = null;
                        }
                        onBlobUrlChange?.(null);
                        if (selectedTrackId === customTrack.key) {
                          onChange(undefined);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTrackId === customTrack.key ? "border-gray-900" : "border-gray-300"
                    }`}>
                      {selectedTrackId === customTrack.key && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Custom Audio (if no custom audio uploaded) */}
              {!customTrack && (
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center">
                  {uploading ? (
                    <div className="space-y-2">
                      <svg className="w-8 h-8 text-gray-400 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-xs font-semibold text-gray-700">Mengompresi &amp; Mengunggah...</p>
                      <p className="text-[10px] text-gray-400">Ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-bold text-gray-800">Unggah Lagu Latar Kustom (Maks 30s)</p>
                      <p className="text-[10px] text-gray-500">MP3, WAV, M4A • Otomatis dikompres &lt;1MB 🎵</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/m4a"
                    disabled={uploading}
                    onChange={handleCustomBgmUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Error messages */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-800 font-semibold">{error}</p>
                </div>
              )}

              {/* Track Options */}
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => {
                  const isSelected = selectedTrackId === track.id;
                  const isPlaying = playingTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelect(track.id)}
                      className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => handlePlayPause(track.id, track.src, e)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                            isPlaying
                              ? "bg-gray-900 text-white hover:bg-gray-800"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          title={isPlaying ? "Jeda Musik" : "Putar Pratinjau"}
                        >
                          {isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                        <div className="text-left min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{track.label}</p>
                          <p className="text-xs text-gray-500">Durasi Loop: {track.duration}s</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        isSelected ? "border-gray-900" : "border-gray-300"
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-sm text-gray-500">Belum ada pilihan musik di kategori ini</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all cursor-pointer"
              >
                Simpan & Selesai
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
