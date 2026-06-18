"use client";

import { useState } from "react";
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
  const [paymentGroup, setPaymentGroup] = useState<"qris_ewallet" | "bank_card">("qris_ewallet");

  const scrollToPreview = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const el = document.getElementById("live-preview");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const onSubmit = async (data: CardDraft) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentGroup,
          draft: data,
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
            <BackgroundMusicSelector value={field.value} onChange={field.onChange} />
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
          {errors.finalMessage && (
            <p className="text-xs text-red-600">{errors.finalMessage.message}</p>
          )}
        </div>

        {/* 9. Payment Method */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-900">Pilih Metode Pembayaran</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentGroup("qris_ewallet")}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                paymentGroup === "qris_ewallet"
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-900">QRIS / E-Wallet</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentGroup === "qris_ewallet" ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentGroup === "qris_ewallet" && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">GoPay, OVO, Dana, LinkAja, ShopeePay, dll</p>
              <div className="text-2xl font-bold text-gray-900">Rp5.000</div>
            </div>

            <div
              onClick={() => setPaymentGroup("bank_card")}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                paymentGroup === "bank_card"
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-900">Transfer Bank / Kartu</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentGroup === "bank_card" ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentGroup === "bank_card" && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">VA BCA/Mandiri/BRI, Visa/Mastercard</p>
              <div className="text-2xl font-bold text-gray-900">Rp8.000</div>
            </div>
          </div>
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

        <p className="text-xs text-gray-500 text-center">
          Setelah pembayaran dikonfirmasi, catatan akan langsung terbit dan <strong>tidak dapat diedit kembali</strong>.
        </p>
      </form>

      {/* Right Column: Live Preview (1 col on desktop) */}
      <div id="live-preview" className="lg:sticky lg:top-8 w-full">
        <LivePreview draft={formValues} />
      </div>
    </div>
  );
}
