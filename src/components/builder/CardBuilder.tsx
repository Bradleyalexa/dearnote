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

  // Watch the form state to feed the LivePreview dynamically
  const formValues = watch();

  const [paymentGroup, setPaymentGroup] = useState<"qris_ewallet" | "bank_card">("qris_ewallet");

  // On mobile, scroll to preview after template selection so user sees result immediately
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
        className="lg:col-span-2 space-y-8 bg-white/70 backdrop-blur-md border border-zinc-200/50 rounded-3xl p-6 sm:p-10 shadow-xl"
      >
        <div>
          <h2 className="font-serif text-3xl font-semibold text-zinc-800 mb-1">
            Buat Catatan Kenangan
          </h2>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            Dokumentasikan momen berharga, pasang foto & rekaman suara, lalu bagikan.
          </p>
        </div>

        {/* 1. Template Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-700">
            Pilih Desain & Tata Letak Catatan
          </label>
          <TemplatePicker
            value={formValues.template}
            onChange={(id) => { setValue("template", id); scrollToPreview(); }}
          />
        </div>



        {/* 2. Sender and Recipient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-zinc-700">Dari (Nama Anda)</label>
            <input
              type="text"
              placeholder="Contoh: Kevin"
              {...register("fromName")}
              maxLength={40}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.fromName && (
              <p className="text-xs text-red-500 font-medium">{errors.fromName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-zinc-700">Untuk (Nama Penerima)</label>
            <input
              type="text"
              placeholder="Contoh: Jessica"
              {...register("toName")}
              maxLength={40}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.toName && (
              <p className="text-xs text-red-500 font-medium">{errors.toName.message}</p>
            )}
          </div>
        </div>

        {/* 3. Access Code Gate */}
        <div className="space-y-1.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-zinc-700">Kode Akses / Passkey (Opsional)</label>
            <span className="text-[9px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Keamanan
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-normal mb-2">
            Jika diisi, pengunjung wajib memasukkan kode ini sebelum catatan terbuka. Jika dikosongkan, catatan langsung terbuka otomatis.
          </p>
          <input
            type="text"
            placeholder="Contoh: dearnote"
            {...register("secretCode")}
            maxLength={12}
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-bold text-zinc-700 tracking-widest placeholder:tracking-normal placeholder:font-normal uppercase"
          />
          {errors.secretCode && (
            <p className="text-xs text-red-500 font-medium">{errors.secretCode.message}</p>
          )}
        </div>

        {/* 4. Letter Contents */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-zinc-700">Judul Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Kenangan Perjalanan Terbaik Kita"
              {...register("letterTitle")}
              maxLength={80}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
            />
            {errors.letterTitle && (
              <p className="text-xs text-red-500 font-medium">{errors.letterTitle.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-zinc-700">Isi Catatan / Jurnal</label>
              <span className="text-xs text-zinc-400 font-medium">
                {formValues.letterBody?.length || 0}/3000
              </span>
            </div>
            <textarea
              placeholder="Tuliskan cerita, ucapan, atau catatan harian Anda di sini..."
              {...register("letterBody")}
              maxLength={3000}
              rows={6}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700 leading-relaxed"
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

        {/* 6. Voice Note Uploader (Optional) */}
        <Controller
          control={control}
          name="voiceNote"
          render={({ field }) => (
            <VoiceNoteUploader value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 7. Background Music Selector (Optional) */}
        <Controller
          control={control}
          name="bgMusic"
          render={({ field }) => (
            <BackgroundMusicSelector value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 7. Final Message */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-700">Pesan Penutup (Opsional)</label>
          <input
            type="text"
            placeholder="Contoh: Terima kasih atas segalanya."
            {...register("finalMessage")}
            maxLength={300}
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
          />
          {errors.finalMessage && (
            <p className="text-xs text-red-500 font-medium">{errors.finalMessage.message}</p>
          )}
        </div>

        {/* 8. Payment Method Group */}
        <div className="space-y-3 pt-4 border-t border-zinc-150">
          <label className="block text-sm font-semibold text-zinc-700">Pilih Metode Pembayaran</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            {/* Option 1: QRIS / E-Wallet */}
            <div
              onClick={() => setPaymentGroup("qris_ewallet")}
              className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                paymentGroup === "qris_ewallet"
                  ? "border-zinc-800 bg-zinc-50/50 shadow-sm"
                  : "border-gray-200 hover:border-zinc-300 hover:bg-zinc-50/10"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-850 text-[#18181b]">QRIS / E-Wallet</span>
                <span className="text-[10px] text-zinc-400 mt-1 leading-normal">OVO, GoPay, Dana, LinkAja, dll</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-850 text-[#18181b]">Rp5.000</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentGroup === "qris_ewallet" ? "border-zinc-800" : "border-gray-300"
                }`}>
                  {paymentGroup === "qris_ewallet" && <div className="w-2 h-2 rounded-full bg-zinc-800" />}
                </div>
              </div>
            </div>

            {/* Option 2: Bank Transfer / Credit Card */}
            <div
              onClick={() => setPaymentGroup("bank_card")}
              className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                paymentGroup === "bank_card"
                  ? "border-zinc-800 bg-zinc-50/50 shadow-sm"
                  : "border-gray-200 hover:border-zinc-300 hover:bg-zinc-50/10"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-850 text-[#18181b]">Transfer Bank / Kartu</span>
                <span className="text-[10px] text-zinc-400 mt-1 leading-normal">Virtual Account (BCA, Mandiri, dll), Visa/Mastercard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-850 text-[#18181b]">Rp8.000</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentGroup === "bank_card" ? "border-zinc-800" : "border-gray-300"
                }`}>
                  {paymentGroup === "bank_card" && <div className="w-2 h-2 rounded-full bg-zinc-800" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-500 font-semibold text-center">{submitError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-zinc-800 hover:bg-zinc-900 disabled:bg-zinc-300 text-white font-bold rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-lg">⏳</span> Memproses Pesanan Anda...
            </>
          ) : (
            <>
              🔒 Terbitkan Catatan
            </>
          )}
        </button>

        <p className="text-[10px] text-zinc-400 font-semibold text-center">
          *Setelah pembayaran dikonfirmasi, catatan akan langsung terbit dan **tidak dapat diedit kembali**.
        </p>
      </form>

      {/* Right Column: Live Visual Preview Mockup (1 col on desktop) */}
      <div id="live-preview" className="self-stretch w-full flex justify-center scroll-mt-6">
        <div className="lg:sticky lg:top-8 w-full flex justify-center h-fit">
          <LivePreview draft={formValues} />
        </div>
      </div>
    </div>
  );
}
