"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceNoteValue {
  key: string;
  src: string;
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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!value) {
      setLocalAudioUrl(null);
    } else {
      setLocalAudioUrl(value.src);
    }
  }, [value]);

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
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const duration = seconds;
        await uploadAudioBlob(audioBlob, duration);
      };

      mediaRecorder.start();
      setRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 59) {
            stopRecording();
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

  const uploadAudioBlob = async (blob: Blob, duration: number) => {
    setUploading(true);
    setError(null);

    try {
      const fileName = `voice-note-${Date.now()}.webm`;
      const contentType = blob.type;

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Maksimal ukuran audio adalah 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const audioUrl = URL.createObjectURL(file);
      const audioObj = new Audio(audioUrl);

      const duration: number = await new Promise((resolve) => {
        audioObj.addEventListener("loadedmetadata", () => {
          resolve(Math.round(audioObj.duration));
        });
        audioObj.addEventListener("error", () => {
          resolve(0);
        });
      });

      if (duration > 60) {
        throw new Error("Durasi pesan suara maksimal 60 detik.");
      }

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
      <label className="block text-sm font-semibold text-gray-900">
        Pesan Suara (Opsional, Maksimal 60 Detik)
      </label>

      {localAudioUrl ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Rekaman Suara Tersimpan</p>
              {value?.durationSeconds && (
                <p className="text-xs text-gray-500">
                  Durasi: {formatTime(value.durationSeconds)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <audio src={localAudioUrl} controls className="flex-1 sm:flex-none sm:w-56 h-10" />
            <button
              type="button"
              onClick={removeVoiceNote}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mic Recorder */}
          <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
            {recording ? (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{formatTime(seconds)}</p>
                  <p className="text-xs text-gray-500">Merekam...</p>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  Selesai
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Rekam dari Browser</p>
                  <p className="text-xs text-gray-500">Langsung dari mikrofon Anda</p>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={startRecording}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Mulai Rekam
                </button>
              </div>
            )}
          </div>

          {/* File Upload */}
          <label className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="space-y-4 text-center">
              {uploading ? (
                <>
                  <svg className="w-12 h-12 text-gray-400 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-semibold text-gray-900">Mengunggah...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Unggah File Audio</p>
                    <p className="text-xs text-gray-500">MP3, WAV, M4A • Maks 5MB</p>
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/m4a"
              disabled={uploading || recording}
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
