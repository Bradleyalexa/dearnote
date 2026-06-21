"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDraftSchema, CardDraft } from "@/lib/schemas/card-draft";
import PhotoUploader from "./PhotoUploader";
import VoiceNoteUploader from "./VoiceNoteUploader";
import BackgroundMusicSelector from "./BackgroundMusicSelector";
import LivePreview from "./LivePreview";
import TemplatePicker from "./TemplatePicker";

export default function CardBuilder() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [validatedData, setValidatedData] = useState<CardDraft | null>(null);
  // Blob URL of custom BGM for CORS-free preview in LivePreview
  const [bgMusicBlobUrl, setBgMusicBlobUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardDraft>({
    resolver: zodResolver(CardDraftSchema),
    defaultValues: {
      template: "classic_editorial",
      fromName: "",
      toName: "",
      secretCode: "",
      letterTitle: "",
      letterBody: "",
      photos: [],
      voiceNote: undefined,
      bgMusic: undefined,
      finalMessage: "",
    },
  });

  const formValues = watch();

  const scrollToPreview = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const el = document.getElementById("live-preview");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const onSubmit = (data: CardDraft) => {
    setValidatedData(data);
    setShowPaymentConfirm(true);
  };

  const confirmAndPay = async () => {
    if (!validatedData) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentGroup: "bank_card", // Force Rp8.000 pricing group
          draft: validatedData,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal membuat pesanan.");
      }

      const { paymentUrl } = await res.json();
      window.location.href = paymentUrl;
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Terjadi kesalahan koneksi server.");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-7xl mx-auto py-4 sm:py-8">
      {/* Left Column: Form (2 cols on desktop) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-2 space-y-6 sm:space-y-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        {/* Header */}
        <div className="pb-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Buat Catatan Kenangan
          </h2>
          <p className="text-sm text-gray-600">
            Dokumentasikan momen berharga, pasang foto & rekaman suara, lalu bagikan.
          </p>
        </div>

        {/* 1. Template Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Pilih Desain & Tata Letak Catatan
          </label>
          <TemplatePicker
            value={formValues.template}
            onChange={(id) => { setValue("template", id); scrollToPreview(); }}
          />
        </div>

        {/* 2. Sender and Recipient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Dari (Nama Anda) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kevin"
              {...register("fromName")}
              maxLength={50}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.fromName && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fromName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Untuk (Nama Penerima) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Jessica"
              {...register("toName")}
              maxLength={50}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.toName && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.toName.message}
              </p>
            )}
          </div>
        </div>

        {/* 3. Access Code */}
        <div className="space-y-2 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label className="block text-sm font-semibold text-gray-900">
              Kode Akses / Passkey (Opsional)
            </label>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-3">
            Jika diisi, pengunjung wajib memasukkan kode ini sebelum catatan terbuka. Jika dikosongkan, catatan langsung terbuka otomatis.
          </p>
          <input
            type="text"
            placeholder="Contoh: dearnote123"
            {...register("secretCode")}
            maxLength={12}
            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm font-mono text-gray-900 tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal"
          />
          {errors.secretCode && (
            <p className="text-xs text-red-600">{errors.secretCode.message}</p>
          )}
        </div>

        {/* 4. Letter Contents */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Judul Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Kenangan Perjalanan Terbaik Kita"
              {...register("letterTitle")}
              maxLength={80}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.letterTitle && (
              <p className="text-xs text-red-600">{errors.letterTitle.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-900">
                Isi Catatan / Jurnal <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500 font-medium">
                {formValues.letterBody?.length || 0}/3000
              </span>
            </div>
            <textarea
              placeholder="Tuliskan cerita, ucapan, atau catatan harian Anda di sini..."
              {...register("letterBody")}
              maxLength={3000}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm text-gray-900 leading-relaxed resize-none"
            />
            {errors.letterBody && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.letterBody.message}
              </p>
            )}
          </div>
        </div>

        {/* 5. Photo Uploader */}
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <PhotoUploader value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 6. Voice Note Uploader */}
        <Controller
          control={control}
          name="voiceNote"
          render={({ field }) => (
            <VoiceNoteUploader value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 7. Background Music Selector */}
        <Controller
          control={control}
          name="bgMusic"
          render={({ field }) => (
            <BackgroundMusicSelector
              value={field.value}
              onChange={field.onChange}
              onBlobUrlChange={setBgMusicBlobUrl}
            />
          )}
        />

        {/* 8. Final Message */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Pesan Penutup (Opsional)</label>
          <input
            type="text"
            placeholder="Contoh: Terima kasih atas segalanya."
            {...register("finalMessage")}
            maxLength={300}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
          />
          {formValues.template === "graduation_memory_lane" && (
            <p className="text-xs text-amber-600 font-medium">
              💡 Khusus template <strong>Graduation Memory Lane</strong>, isi bagian ini jika ingin memunculkan kartu <strong>P.S. (Postscript)</strong> pink di bagian paling bawah catatan.
            </p>
          )}
          {errors.finalMessage && (
            <p className="text-xs text-red-600">{errors.finalMessage.message}</p>
          )}
        </div>

        {submitError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses Pesanan...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Terbitkan Catatan
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Setelah pembayaran dikonfirmasi, catatan akan langsung terbit dan <strong>tidak dapat diedit kembali</strong>. Dengan menerbitkan catatan, Anda menyetujui{" "}
          <Link href="/terms" target="_blank" className="underline hover:text-gray-800 transition-colors">
            Syarat & Ketentuan
          </Link>
          ,{" "}
          <Link href="/privacy" target="_blank" className="underline hover:text-gray-800 transition-colors">
            Kebijakan Privasi
          </Link>
          , serta{" "}
          <Link href="/refund" target="_blank" className="underline hover:text-gray-800 transition-colors">
            Kebijakan Refund
          </Link>{" "}
          kami.
        </p>
      </form>

      {/* Right Column: Live Preview (1 col on desktop) */}
      <div id="live-preview" className="lg:sticky lg:top-8 w-full">
        <LivePreview draft={formValues} bgMusicPreviewUrl={bgMusicBlobUrl} />
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => !submitting && setShowPaymentConfirm(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col z-10 border border-gray-150 p-6 animate-in fade-in zoom-in-95 duration-200 text-center">
            {/* Icon */}
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Terbitkan Catatan
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Catatan kenangan Anda siap diterbitkan secara online selama 90 hari tanpa iklan.
            </p>

            {/* Price Card */}
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 mb-6">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block mb-1">Total Pembayaran</span>
              <span className="text-3xl font-serif font-bold text-gray-900">Rp8.000</span>
              <span className="text-xs text-gray-500 block mt-1">Mendukung semua QRIS, E-wallet, & Transfer Bank</span>
            </div>

            {submitError && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-800">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={confirmAndPay}
                disabled={submitting}
                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Pembayaran...
                  </>
                ) : (
                  "Lanjutkan Pembayaran"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => !submitting && setShowPaymentConfirm(false)}
                disabled={submitting}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
