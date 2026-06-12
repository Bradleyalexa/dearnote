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
}

const CATEGORIES = [
  { id: "all", label: "✨ Semua" },
  { id: "acoustic", label: "🎻 Acoustic" },
  { id: "romantic", label: "💖 Romantic" },
  { id: "classical", label: "🎼 Classical" },
  { id: "christmas", label: "🎄 Christmas" },
  { id: "songs", label: "🎵 Songs" },
];

const TRACKS = [
  { id: "track1", label: "Melodi Piano Romantis", icon: "🎹", src: "/audio/track1.mp3", duration: 20, category: "romantic" },
  { id: "track_acoustic", label: "Gitar Akustik Ceria", icon: "🎸", src: "/audio/track2.mp3", duration: 8, category: "acoustic" },
  { id: "track_classical", label: "Melodi Piano Klasik", icon: "🎼", src: "/audio/track1.mp3", duration: 20, category: "classical" },
  { id: "track_christmas", label: "Jingle Bells Joy", icon: "🎄", src: "/audio/track3.mp3", duration: 30, category: "christmas" },
  { id: "track_the1975_aboutyou", label: "About You — The 1975", icon: "🎵", src: "/audio/The 1975 - About You.mp3", duration: 24, category: "songs" },
];

export default function BackgroundMusicSelector({ value, onChange }: BackgroundMusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Stop audio on unmount
  useEffect(() => {
    setMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = (trackId: string, src: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering track selection

    if (playingTrack === trackId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Encode the path to handle filenames with spaces or special chars
      const encodedSrc = src.split("/").map((seg) => encodeURIComponent(seg)).join("/");
      const audio = new Audio(encodedSrc);
      audioRef.current = audio;
      audio.loop = true;
      audio.play().catch((err) => console.error("Playback blocked or failed:", err));
      setPlayingTrack(trackId);
    }
  };

  const handleSelect = (trackId: string | null) => {
    if (trackId === null) {
      onChange(undefined);
    } else {
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

  const selectedTrackId = value?.key || null;
  const selectedTrack = TRACKS.find((t) => t.id === selectedTrackId);

  // Stop audio when modal is closed
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrack(null);
    setIsOpen(false);
  };

  // Filter tracks based on activeCategory
  const filteredTracks = activeCategory === "all"
    ? TRACKS
    : TRACKS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-2 pt-4 border-t border-zinc-150 font-sans">
      {/* CSS Animation & Hide Scrollbar Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleDown {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-fade {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-scale {
          animation: scaleDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <label className="block text-sm font-semibold text-zinc-700">Background Music (Opsional)</label>
          <p className="text-xs text-zinc-400 font-medium">Pilih lagu latar untuk diputar saat jurnal dibuka oleh penerima.</p>
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
        >
          <span>🎵</span>{" "}
          {selectedTrack
            ? `${selectedTrack.icon} ${selectedTrack.label}`
            : "Pilih Musik Latar"}
        </button>
      </div>

      {/* Modal Overlay (Rendered via React Portal under document.body) */}
      {mounted && typeof document !== "undefined" && isOpen && createPortal(
        <div 
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-zinc-950/45 backdrop-blur-sm animate-modal-fade overflow-y-auto md:items-center"
        >
          {/* Modal Card */}
          <div 
            className="w-full max-w-md sm:max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-zinc-100 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-modal-scale overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b-0">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-bold text-zinc-800 text-left">Pilih Musik Latar</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-left font-sans">Background Music</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-zinc-200/50 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-all text-sm cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Horizontal Scrollable Categories/Genre Buttons */}
            <div className="flex gap-2 px-4 sm:px-6 pb-3 overflow-x-auto scrollbar-none border-b border-zinc-100">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-zinc-800 border-zinc-800 text-white shadow-sm"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Tracks List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 max-h-[45vh] sm:max-h-[50vh]">
              {/* Option: None */}
              <div
                onClick={() => handleSelect(null)}
                className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all gap-3 ${
                  selectedTrackId === null
                    ? "border-zinc-800 bg-zinc-50/50 shadow-sm"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
                    🔇
                  </div>
                  <div className="text-left font-sans min-w-0">
                    <p className="text-xs font-bold text-zinc-700 truncate">Tanpa Musik Latar</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Hening saat jurnal dibuka</p>
                  </div>
                </div>

                <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
                  selectedTrackId === null ? "border-zinc-800" : "border-gray-300"
                }`}>
                  {selectedTrackId === null && <div className="w-2 h-2 rounded-full bg-zinc-800" />}
                </div>
              </div>

              {/* Filtered Preset Track Options */}
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => {
                  const isSelected = selectedTrackId === track.id;
                  const isPlaying = playingTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelect(track.id)}
                      className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all gap-3 ${
                        isSelected
                          ? "border-zinc-800 bg-zinc-50/50 shadow-sm"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 font-sans min-w-0">
                        {/* Play/Pause Button */}
                        <button
                          type="button"
                          onClick={(e) => handlePlayPause(track.id, track.src, e)}
                          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs transition-all shadow-sm cursor-pointer ${
                            isPlaying
                              ? "bg-zinc-800 text-white hover:bg-zinc-900"
                              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                          }`}
                          title={isPlaying ? "Jeda Musik" : "Putar Pratinjau"}
                        >
                          {isPlaying ? "⏸" : "▶"}
                        </button>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-zinc-700 truncate">
                            {track.icon} {track.label}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-medium">Durasi Loop: {track.duration}s</p>
                        </div>
                      </div>

                      {/* Radio circle indicator */}
                      <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-zinc-800" : "border-gray-300"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-zinc-800" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-zinc-400 text-xs font-medium font-sans">
                  Belum ada pilihan musik di kategori ini.
                </div>
              )}
            </div>

            {/* Footer Action Button */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider font-sans"
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
