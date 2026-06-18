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

export default function BackgroundMusicSelector({ value, onChange }: BackgroundMusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
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
            <div className="overflow-x-auto border-b border-gray-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
