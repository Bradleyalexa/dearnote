"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDraftSchema, CardDraft } from "@/lib/schemas/card-draft";
import PhotoUploader from "./PhotoUploader";
import VoiceNoteUploader from "./VoiceNoteUploader";
import LivePreview from "./LivePreview";

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
      template: "flower_secret_letter",
      fromName: "",
      toName: "",
      secretCode: "",
      letterTitle: "",
      letterBody: "",
      photos: [],
      finalMessage: "",
    },
  });

  // Watch the form state to feed the LivePreview dynamically
  const formValues = watch();

  const [paymentGroup, setPaymentGroup] = useState<"qris_ewallet" | "bank_card">("qris_ewallet");

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
      
      // Redirect to simulated checkout holding / success page
      window.location.href = paymentUrl;
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Terjadi kesalahan koneksi server.");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto py-4 px-2">
      {/* Left Column: Customize Form (2 cols on desktop) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-2 space-y-8 bg-white/60 backdrop-blur-md border border-rose-100/50 rounded-3xl p-6 sm:p-10 shadow-xl"
      >
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-1">
            Buat Surat Cintamu
          </h2>
          <p className="text-xs text-rose-500 font-semibold uppercase tracking-wider">
            Sesuaikan pesan, unggah foto, dan bagikan dalam hitungan menit
          </p>
        </div>

        {/* 1. Template Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Pilih Desain Tema Kartu
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Template 1 */}
            <label
              className={`border-2 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                formValues.template === "flower_secret_letter"
                  ? "border-rose-400 bg-rose-50/20 shadow-sm"
                  : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/5"
              }`}
            >
              <input
                type="radio"
                value="flower_secret_letter"
                checked={formValues.template === "flower_secret_letter"}
                onChange={() => setValue("template", "flower_secret_letter")}
                className="hidden"
              />
              <span className="text-2xl mb-2">🌸</span>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">Flower Secret</p>
                <p className="text-[9px] text-gray-400 mt-1 leading-tight">Kelopak bunga gugur, warna merah muda lembut.</p>
              </div>
            </label>

            {/* Template 2 */}
            <label
              className={`border-2 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                formValues.template === "polaroid_memory_note"
                  ? "border-rose-400 bg-rose-50/20 shadow-sm"
                  : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/5"
              }`}
            >
              <input
                type="radio"
                value="polaroid_memory_note"
                checked={formValues.template === "polaroid_memory_note"}
                onChange={() => setValue("template", "polaroid_memory_note")}
                className="hidden"
              />
              <span className="text-2xl mb-2">📷</span>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">Polaroid Scrapbook</p>
                <p className="text-[9px] text-gray-400 mt-1 leading-tight">Kertas kerajinan hangat, foto bergaya polaroid.</p>
              </div>
            </label>

            {/* Template 3 */}
            <label
              className={`border-2 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                formValues.template === "moonlight_voice_letter"
                  ? "border-rose-400 bg-rose-50/20 shadow-sm"
                  : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/5"
              }`}
            >
              <input
                type="radio"
                value="moonlight_voice_letter"
                checked={formValues.template === "moonlight_voice_letter"}
                onChange={() => setValue("template", "moonlight_voice_letter")}
                className="hidden"
              />
              <span className="text-2xl mb-2">🌙</span>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">Moonlight Voice</p>
                <p className="text-[9px] text-gray-400 mt-1 leading-tight">Langit malam berbintang gelap, syahdu dan romantis.</p>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Sender and Recipient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Nama Pengirim</label>
            <input
              type="text"
              placeholder="Nama Anda (Misal: Ardi)"
              {...register("fromName")}
              maxLength={40}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-gray-700"
            />
            {errors.fromName && (
              <p className="text-xs text-red-500 font-medium">{errors.fromName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Nama Penerima</label>
            <input
              type="text"
              placeholder="Nama Pasangan (Misal: Nadya)"
              {...register("toName")}
              maxLength={40}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-gray-700"
            />
            {errors.toName && (
              <p className="text-xs text-red-500 font-medium">{errors.toName.message}</p>
            )}
          </div>
        </div>

        {/* 3. Cosmetic Secret Code */}
        <div className="space-y-1.5 bg-rose-50/30 border border-rose-100/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">Kode Rahasia (Opsional)</label>
            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Kosmetik
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium leading-normal mb-2">
            Jika diisi, penerima wajib memasukkan kode ini sebelum surat terbuka. Jika dikosongkan, surat akan langsung terbuka secara otomatis.
          </p>
          <input
            type="text"
            placeholder="KODE123 (Maks 12 Huruf/Angka)"
            {...register("secretCode")}
            maxLength={12}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-bold text-gray-700 tracking-widest placeholder:tracking-normal placeholder:font-normal uppercase"
          />
          {errors.secretCode && (
            <p className="text-xs text-red-500 font-medium">{errors.secretCode.message}</p>
          )}
        </div>

        {/* 4. Letter Contents */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Judul Surat (Opsional)</label>
            <input
              type="text"
              placeholder="Judul Pesan (Misal: Untuk Cintaku)"
              {...register("letterTitle")}
              maxLength={80}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-gray-700"
            />
            {errors.letterTitle && (
              <p className="text-xs text-red-500 font-medium">{errors.letterTitle.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Isi Surat</label>
              <span className="text-xs text-gray-400 font-medium">
                {formValues.letterBody?.length || 0}/3000
              </span>
            </div>
            <textarea
              placeholder="Tuliskan ungkapan perasaan cintamu di sini secara jujur..."
              {...register("letterBody")}
              maxLength={3000}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-gray-700 leading-relaxed"
            />
            {errors.letterBody && (
              <p className="text-xs text-red-500 font-medium">{errors.letterBody.message}</p>
            )}
          </div>
        </div>

        {/* 5. Photo Uploader (Max 5) */}
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <PhotoUploader value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 6. Voice Note Uploader (Optional, Max 60s) */}
        <Controller
          control={control}
          name="voiceNote"
          render={({ field }) => (
            <VoiceNoteUploader value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 7. Final Message */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Pesan Penutup (Opsional)</label>
          <input
            type="text"
            placeholder="Pesan Penutup (Misal: Aku Selalu Mencintaimu)"
            {...register("finalMessage")}
            maxLength={300}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-gray-700"
          />
          {errors.finalMessage && (
            <p className="text-xs text-red-500 font-medium">{errors.finalMessage.message}</p>
          )}
        </div>

        {/* 8. Payment Method Group */}
        <div className="space-y-3 pt-4 border-t border-rose-100">
          <label className="block text-sm font-semibold text-gray-700">Pilih Metode Pembayaran</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* QRIS / E-Wallet */}
            <label
              className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                paymentGroup === "qris_ewallet"
                  ? "border-rose-400 bg-rose-50/20 shadow-sm"
                  : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/5"
              }`}
            >
              <input
                type="radio"
                value="qris_ewallet"
                checked={paymentGroup === "qris_ewallet"}
                onChange={() => setPaymentGroup("qris_ewallet")}
                className="hidden"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">QRIS / E-Wallet</span>
                <span className="text-[10px] text-gray-400 mt-0.5 leading-none">OVO, GoPay, Dana, dll</span>
              </div>
              <span className="text-sm font-bold text-rose-500">Rp3.000</span>
            </label>

            {/* Bank / Cards */}
            <label
              className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                paymentGroup === "bank_card"
                  ? "border-rose-400 bg-rose-50/20 shadow-sm"
                  : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/5"
              }`}
            >
              <input
                type="radio"
                value="bank_card"
                checked={paymentGroup === "bank_card"}
                onChange={() => setPaymentGroup("bank_card")}
                className="hidden"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Transfer Bank / Kartu</span>
                <span className="text-[10px] text-gray-400 mt-0.5 leading-none">Virtual Account, Debit/Kredit</span>
              </div>
              <span className="text-sm font-bold text-rose-500">Rp8.000</span>
            </label>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-500 font-semibold text-center">{submitError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-lg">⏳</span> Memproses Pesanan Anda...
            </>
          ) : (
            <>
              🔒 Bayar & Publikasikan Kartu
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-400 font-medium text-center">
          *Setelah pembayaran berhasil, surat akan langsung dipublikasikan dan **tidak dapat diubah kembali**.
        </p>
      </form>

      {/* Right Column: Live Visual Preview Mockup (1 col on desktop) */}
      <div className="lg:sticky lg:top-8 w-full flex justify-center">
        <LivePreview draft={formValues} />
      </div>
    </div>
  );
}
