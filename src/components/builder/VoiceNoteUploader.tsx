"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceNoteValue {
  key: string;
  src: string; // Public preview URL
  durationSeconds?: number;
}

interface VoiceNoteUploaderProps {
  value?: VoiceNoteValue;
  onChange: (voice?: VoiceNoteValue) => void;
}

export default function VoiceNoteUploader({ value, onChange }: VoiceNoteUploaderProps) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(value?.src || null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update preview when value resets
  useEffect(() => {
    if (!value) {
      setLocalAudioUrl(null);
    } else {
      setLocalAudioUrl(value.src);
    }
  }, [value]);

  // Start recording voice
  const startRecording = async () => {
    setError(null);
    setLocalAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg",
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const duration = seconds;

        // Automatically trigger upload
        await uploadAudioBlob(audioBlob, duration);
      };

      mediaRecorder.start();
      setRecording(true);
      setSeconds(0);

      // Start 60-second limit timer
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 59) {
            stopRecording(); // Automatically stop at 60s
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError("Gagal mengakses mikrofon. Pastikan Anda memberikan izin akses.");
    }
  };

  // Stop recording voice
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Upload the audio blob directly to R2
  const uploadAudioBlob = async (blob: Blob, duration: number) => {
    setUploading(true);
    setError(null);

    try {
      const fileName = `voice-note-${Date.now()}.webm`;
      const contentType = blob.type;

      // 1. Get pre-signed URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          contentType,
          fileSize: blob.size,
          kind: "voice",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal mendapatkan pre-signed URL");
      }

      const { uploadUrl, key, publicUrl } = await res.json();

      // 2. Upload file blob directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: blob,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah rekaman suara.");
      }

      setLocalAudioUrl(publicUrl);
      onChange({
        key,
        src: publicUrl,
        durationSeconds: duration,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengunggah pesan suara.");
    } finally {
      setUploading(false);
    }
  };

  // Handle file uploads (pre-recorded audio files)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Maksimal ukuran audio adalah 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create a temporary audio element to check duration
      const audioUrl = URL.createObjectURL(file);
      const audioObj = new Audio(audioUrl);
      
      const duration: number = await new Promise((resolve) => {
        audioObj.addEventListener("loadedmetadata", () => {
          resolve(Math.round(audioObj.duration));
        });
        audioObj.addEventListener("error", () => {
          resolve(0); // fallback if metadata cannot be parsed
        });
      });

      if (duration > 60) {
        throw new Error("Durasi pesan suara maksimal 60 detik.");
      }

      // Upload file directly
      await uploadAudioBlob(file, duration);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengunggah file audio.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeVoiceNote = () => {
    setLocalAudioUrl(null);
    onChange(undefined);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Pesan Suara (Opsional, Maksimal 60 Detik)
      </label>

      {localAudioUrl ? (
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎙</span>
            <div>
              <p className="text-xs font-semibold text-gray-700">Rekaman Suara Tersimpan</p>
              {value?.durationSeconds && (
                <p className="text-[10px] text-gray-400 font-medium">
                  Durasi: {formatTime(value.durationSeconds)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <audio src={localAudioUrl} controls className="w-48 sm:w-60 h-8 text-xs" />
            <button
              type="button"
              onClick={removeVoiceNote}
              className="text-xs text-rose-500 hover:text-red-700 font-bold px-2 py-1"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mic Recorder */}
          <div className="flex flex-col items-center justify-center p-4 border border-rose-100 rounded-xl bg-white text-center shadow-sm">
            {recording ? (
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 animate-pulse text-lg">
                  🔴
                </div>
                <p className="text-sm font-bold text-gray-700">Merekam: {formatTime(seconds)}</p>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-2xl">🎙</span>
                <p className="text-xs font-semibold text-gray-700">Rekam langsung dari browser</p>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={startRecording}
                  className="px-4 py-2 bg-rose-400 hover:bg-rose-500 disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Mulai Rekam
                </button>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-center justify-center p-4 border border-rose-100 rounded-xl bg-white text-center shadow-sm relative cursor-pointer">
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-2xl mb-1">{uploading ? "⏳" : "📤"}</span>
              <p className="text-xs font-semibold text-gray-700">
                {uploading ? "Mengunggah..." : "Unggah Berkas Audio"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Format: MP3, WAV, M4A (Maks 5MB)
              </p>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/m4a"
                disabled={uploading || recording}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium transition-all">{error}</p>
      )}
    </div>
  );
}
