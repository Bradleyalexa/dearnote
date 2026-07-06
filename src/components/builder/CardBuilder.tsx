"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDraftSchema, CardDraft } from "@/lib/schemas/card-draft";
import PhotoUploader from "./PhotoUploader";
import VoiceNoteUploader from "./VoiceNoteUploader";
import BackgroundMusicSelector from "./BackgroundMusicSelector";
import LivePreview from "./LivePreview";
import TemplatePicker from "./TemplatePicker";
import { useI18nStore } from "@/lib/i18n/store";
import { translations } from "@/lib/i18n/translations";

export default function CardBuilder() {
  const { lang } = useI18nStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? lang : "id";
  const t = translations[currentLang];

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [validatedData, setValidatedData] = useState<CardDraft | null>(null);
  // Blob URL of custom BGM for CORS-free preview in LivePreview
  const [visibleDates, setVisibleDates] = useState(2);
  const [visibleActivities, setVisibleActivities] = useState(2);
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
      favoriteMoments: Array(10).fill(""),
      themeColor: "green",
      flowers: [],
      openingGame: "cat_paw",
    },
  });

  const formValues = watch();

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dearnote_draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          Object.entries(parsed).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              setValue(key as any, val);
            }
          });
          
          if (parsed.favoriteMoments && Array.isArray(parsed.favoriteMoments)) {
            // date options are 0..4
            let dateCount = 2;
            for (let i = 2; i < 5; i++) {
              if (parsed.favoriteMoments[i]) {
                dateCount = i + 1;
              }
            }
            setVisibleDates(dateCount);

            // custom activities are 5..9
            let actCount = 2;
            for (let i = 2; i < 5; i++) {
              if (parsed.favoriteMoments[5 + i]) {
                actCount = i + 1;
              }
            }
            setVisibleActivities(actCount);
          }
        } catch (e) {
          console.error("Failed to parse saved draft", e);
        }
      }
    }
  }, [setValue]);

  // Auto-save draft to localStorage with 1.5s debounce
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        // Avoid saving completely empty form states
        if (formValues.fromName || formValues.toName || formValues.letterBody) {
          localStorage.setItem("dearnote_draft", JSON.stringify(formValues));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formValues]);

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
          draft: { ...validatedData, lang: currentLang },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal membuat pesanan.");
      }

      const { paymentUrl } = await res.json();
      if (typeof window !== "undefined") {
        localStorage.removeItem("dearnote_draft");
      }
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
            {t.builderTitle}
          </h2>
          <p className="text-sm text-gray-600">
            {t.builderSubtitle}
          </p>
        </div>

        {/* 1. Template Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            {t.templateLabel}
          </label>
          <TemplatePicker
            value={formValues.template}
            onChange={(id) => { setValue("template", id); scrollToPreview(); }}
          />
        </div>

        {/* 1b. Theme Color Picker (Only for Herbarium Book) */}
        {formValues.template === "herbarium_book" && (
          <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <label className="block text-sm font-semibold text-gray-900">
              {t.themeColorLabel} <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "green", label: currentLang === "id" ? "Forest Green" : "Forest Green", bg: "bg-[#2E5A44]", border: "border-[#173627]" },
                { id: "navy", label: currentLang === "id" ? "Midnight Navy" : "Midnight Navy", bg: "bg-[#1A2F4C]", border: "border-[#0B182B]" },
                { id: "burgundy", label: currentLang === "id" ? "Ruby Burgundy" : "Ruby Burgundy", bg: "bg-[#6B1D2F]", border: "border-[#3D0C17]" },
                { id: "mocha", label: currentLang === "id" ? "Mocha Amber" : "Mocha Amber", bg: "bg-[#5C4033]", border: "border-[#2B1E17]" },
                { id: "lavender", label: currentLang === "id" ? "Lavender Amethyst" : "Lavender Amethyst", bg: "bg-[#7E6088]", border: "border-[#4D3656]" },
                { id: "pink", label: currentLang === "id" ? "Sakura Pink" : "Sakura Pink", bg: "bg-[#FF758F]", border: "border-[#FF5C8A]" },
                { id: "pastel_pink", label: currentLang === "id" ? "Pastel Pink" : "Pastel Pink", bg: "bg-[#F9B2D7]", border: "border-[#EB6AA9]" },
                { id: "pastel_blue", label: currentLang === "id" ? "Pastel Slate" : "Pastel Slate", bg: "bg-[#576A8F]", border: "border-[#3C4E70]" },
                { id: "pastel_mint", label: currentLang === "id" ? "Pastel Mint" : "Pastel Mint", bg: "bg-[#BADFDB]", border: "border-[#93C9C4]" },
                { id: "pastel_yellow", label: currentLang === "id" ? "Pastel Yellow" : "Pastel Yellow", bg: "bg-[#FEE2AD]", border: "border-[#E3C288]" },
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setValue("themeColor", color.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
                    (formValues.themeColor || "green") === color.id
                      ? "border-zinc-800 ring-2 ring-zinc-500/20 text-zinc-900 bg-white"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-white"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${color.bg} border ${color.border}`} />
                  {color.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("themeColor")} />
          </div>
        )}

        {/* 1c. Opening Game Picker (Only for Evasive Confession) */}
        {formValues.template === "evasive_confession" && (
          <div className="space-y-3 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
            <label className="block text-sm font-semibold text-gray-900">
              {currentLang === "id" ? "Pilih Game Pembuka Catatan" : "Choose Opening Game"} <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600">
              {currentLang === "id" ? "Pilih game interaktif imut yang harus dimainkan penerima sebelum membuka pesan pengakuanmu." : "Choose a cute interactive game the recipient must play before opening your confession."}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { id: "cat_paw", label: currentLang === "id" ? "Cakar Kucing 🐾" : "Cat Paw 🐾", desc: currentLang === "id" ? "Towel cakar kucing imut" : "Poke cute cat paws" },
                { id: "claw_machine", label: currentLang === "id" ? "Capit Boneka 🧸" : "Claw Machine 🧸", desc: currentLang === "id" ? "Capit boneka cinta" : "Catch love dolls" },
                { id: "tape_peeling", label: currentLang === "id" ? "Kupas Selotip 🎀" : "Peel Tape 🎀", desc: currentLang === "id" ? "Kupas selotip washi tape" : "Peel off washi tape" },
                { id: "catch_hearts", label: currentLang === "id" ? "Tangkap Hati 🧺" : "Catch Hearts 🧺", desc: currentLang === "id" ? "Tangkap hati jatuh" : "Catch falling hearts" },
              ].map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setValue("openingGame", game.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    (formValues.openingGame || "cat_paw") === game.id
                      ? "border-rose-500 bg-white ring-2 ring-rose-500/20 text-rose-950"
                      : "border-zinc-200 hover:border-rose-200 text-zinc-600 bg-white"
                  }`}
                >
                  <span className="text-sm font-bold block">{game.label}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 leading-normal">{game.desc}</span>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("openingGame")} />
          </div>
        )}

        {/* 2. Sender and Recipient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              {t.fromLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t.fromPlaceholder}
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
              {t.toLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t.toPlaceholder}
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
              {t.secretCodeLabel}
            </label>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-3">
            {t.secretCodeDesc}
          </p>
          <input
            type="text"
            placeholder={t.secretCodePlaceholder}
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
            <label className="block text-sm font-semibold text-gray-900">
              {formValues.template === "boyfriend_permit"
                ? (currentLang === "id" ? "Perihal Izin" : "Permission Subject")
                : (formValues.template === "date_invitation" || formValues.template === "date_ticket")
                ? (currentLang === "id" ? "Nama Tur / Agenda Utama 🌹" : "Tour Name / Main Subject 🌹")
                : t.letterTitleLabel}
            </label>
            <input
              type="text"
              placeholder={
                formValues.template === "boyfriend_permit"
                  ? (currentLang === "id" ? "Contoh: Minta Izin Beli PS5" : "e.g., Request to buy PS5")
                  : (formValues.template === "date_invitation" || formValues.template === "date_ticket")
                  ? (currentLang === "id" ? "Contoh: TIE THE KNOT TOUR 🎸" : "e.g., TIE THE KNOT TOUR 🎸")
                  : t.letterTitlePlaceholder
              }
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
                {t.letterBodyLabel} <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500 font-medium">
                {formValues.letterBody?.length || 0}/5000
              </span>
            </div>
            <textarea
              placeholder={t.letterBodyPlaceholder}
              {...register("letterBody")}
              maxLength={5000}
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

        {/* Template-specific: Favorite Moments (only for Anniversary Scrapbook) */}
        {formValues.template === "anniversary_scrapbook" && (
          <div className="space-y-4 p-5 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <label className="block text-sm font-semibold text-gray-900">
              {currentLang === "id" ? "Kenangan Terindah (Favorite Moments)" : "Favorite Moments"}
            </label>
            <p className="text-xs text-gray-600 leading-relaxed">
              {currentLang === "id" 
                ? "Tuliskan hingga 3 kenangan indah kalian untuk ditampilkan pada kartu kertas bergaris di kanan bawah halaman scrapbook." 
                : "Write up to 3 beautiful memories to be displayed on the lined card at the bottom-right of the scrapbook."}
            </p>
            <div className="space-y-3">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-5">#{idx + 1}</span>
                  <input
                    type="text"
                    placeholder={
                      idx === 0 
                        ? (currentLang === "id" ? 'Contoh: First "I love you"' : 'e.g., First "I love you"')
                        : idx === 1
                        ? (currentLang === "id" ? "Contoh: Liburan ke Bali bersama" : "e.g., Road trip memories")
                        : (currentLang === "id" ? "Contoh: Ketawa bareng sampai menangis" : "e.g., Laughing until we cry")
                    }
                    {...register(`favoriteMoments.${idx}` as any)}
                    maxLength={36}
                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm text-zinc-700 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template-specific: Upeti/Bribery Vouchers (only for Boyfriend's Permission Slip) */}
        {formValues.template === "boyfriend_permit" && (
          <div className="space-y-4 p-5 bg-blue-50/60 border border-blue-100 rounded-2xl">
            <label className="block text-sm font-semibold text-gray-900">
              {currentLang === "id" ? "Daftar Upeti / Sogokan Pacar 🎁" : "Bribery Vouchers List 🎁"}
            </label>
            <p className="text-xs text-gray-600 leading-relaxed">
              {currentLang === "id" 
                ? "Sesuaikan judul upeti dan keterangan upeti yang kamu tawarkan untuk meluluhkan hati pacarmu agar permohonan ini disetujui." 
                : "Customize the title and subtext of the bribery vouchers you offer to melt your partner's heart."}
            </p>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((idx) => {
                const rawVal = formValues.favoriteMoments?.[idx] || "";
                const [titleVal, descVal] = rawVal.split("|");
                
                return (
                  <div key={idx} className="space-y-2 p-3 bg-white rounded-xl border border-zinc-150 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 w-5">#{idx + 1}</span>
                      <input
                        type="text"
                        value={titleVal || ""}
                        placeholder={
                          idx === 0 
                            ? (currentLang === "id" ? "Judul Upeti (Contoh: Ditraktir Seblak & Boba)" : "Upeti Title (e.g., Treat to Seblak & Boba)")
                            : idx === 1
                            ? (currentLang === "id" ? "Judul Upeti (Contoh: Voucher Pijat Pegal)" : "Upeti Title (e.g., Massage Voucher)")
                            : idx === 2
                            ? (currentLang === "id" ? "Judul Upeti (Contoh: Bebas Cuci Piring)" : "Upeti Title (e.g., Chore Waiver)")
                            : (currentLang === "id" ? "Judul Upeti (Contoh: Menemani Shopping)" : "Upeti Title (e.g., Shopping Companion)")
                        }
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          const currentDesc = descVal || "";
                          setValue(`favoriteMoments.${idx}` as any, `${newTitle}|${currentDesc}`);
                        }}
                        maxLength={40}
                        className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm text-zinc-700 bg-white font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2 pl-7">
                      <input
                        type="text"
                        value={descVal || ""}
                        placeholder={
                          idx === 0 
                            ? (currentLang === "id" ? "Keterangan/Subtext (Contoh: Seblak spesial level 5 + es teh manis)" : "Subtext (e.g., Spicy seblak level 5 + sweet iced tea)")
                            : idx === 1
                            ? (currentLang === "id" ? "Keterangan/Subtext (Contoh: Pijat pundak/kaki mandiri siap sedia kapan pun)" : "Subtext (e.g., Full shoulder massage whenever you want)")
                            : idx === 2
                            ? (currentLang === "id" ? "Keterangan/Subtext (Contoh: Bebas cuci piring & beres-beres selama 3 hari)" : "Subtext (e.g., Free from washing dishes and cleaning for 3 days)")
                            : (currentLang === "id" ? "Keterangan/Subtext (Contoh: Janji tidak cemberut/mengeluh saat nemenin belanja)" : "Subtext (e.g., Promise not to complain while waiting outside)")
                        }
                        onChange={(e) => {
                          const newDesc = e.target.value;
                          const currentTitle = titleVal || "";
                          setValue(`favoriteMoments.${idx}` as any, `${currentTitle}|${newDesc}`);
                        }}
                        maxLength={80}
                        className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-[11px] text-zinc-500 bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Template-specific: Date Options (only for Date Invitation or Date Ticket) */}
        {(formValues.template === "date_invitation" || formValues.template === "date_ticket") && (
          <div className="space-y-4 p-5 bg-rose-50/60 border border-rose-100 rounded-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                {currentLang === "id" ? "Pilihan Tanggal Kencan 📅" : "Date Options 📅"}
              </label>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {currentLang === "id"
                  ? "Berikan beberapa opsi tanggal kencan buat dia pilih (awal 2 opsi, max 5). Penerima nanti yang milih mana yang cocok~ 🥰"
                  : "Offer date options for them to choose from (starts with 2, max 5)."}
              </p>
            </div>
            
            <div className="space-y-2">
              {Array.from({ length: visibleDates }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-5">#{idx + 1}</span>
                  <input
                    type="text"
                    placeholder={
                      idx === 0
                        ? (currentLang === "id" ? "Contoh: Sabtu, 12 Juli 2025" : "e.g., Saturday, July 12th 2025")
                        : idx === 1
                        ? (currentLang === "id" ? "Contoh: Minggu, 13 Juli 2025" : "e.g., Sunday, July 13th 2025")
                        : (currentLang === "id" ? `Opsi Tanggal #${idx + 1}` : `Date Option #${idx + 1}`)
                    }
                    {...register(`favoriteMoments.${idx}` as any)}
                    maxLength={40}
                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm text-zinc-700 bg-white"
                  />
                  {idx === visibleDates - 1 && visibleDates > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setValue(`favoriteMoments.${idx}` as any, "");
                        setVisibleDates(prev => Math.max(2, prev - 1));
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>

            {visibleDates < 5 && (
              <button
                type="button"
                onClick={() => setVisibleDates(prev => Math.min(5, prev + 1))}
                className="mt-1 w-full py-1.5 border border-dashed border-rose-300 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-100/50 transition-colors"
              >
                + {currentLang === "id" ? "Tambah Opsi Tanggal baru" : "Add New Date Option"}
              </button>
            )}

            <div className="border-t border-rose-100 pt-3 mt-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {currentLang === "id" ? "Kegiatan Kustom Tambahan (opsional) ✨" : "Extra Custom Activities (optional) ✨"}
              </label>
              <p className="text-[11px] text-gray-500 mb-3 leading-normal">
                {currentLang === "id"
                  ? "Selain preset kegiatan (makan, nonton, dll), kamu bisa tambah kegiatan sendiri (awal 2 opsi, max 5). Format: emoji + spasi + nama (cth: 🏊 Renang Bareng)"
                  : "Alongside the preset activities, add custom ones (starts with 2, max 5). Format: emoji + space + name (e.g. 🏊 Swimming Together)"}
              </p>
              
              <div className="space-y-2">
                {Array.from({ length: visibleActivities }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 w-5">#{idx + 1}</span>
                    <input
                      type="text"
                      placeholder={currentLang === "id" ? "Contoh: 🏊 Renang Bareng" : "e.g., 🏊 Swimming Together"}
                      {...register(`favoriteMoments.${5 + idx}` as any)}
                      maxLength={40}
                      className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm text-zinc-700 bg-white"
                    />
                    {idx === visibleActivities - 1 && visibleActivities > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue(`favoriteMoments.${5 + idx}` as any, "");
                          setVisibleActivities(prev => Math.max(2, prev - 1));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {visibleActivities < 5 && (
                <button
                  type="button"
                  onClick={() => setVisibleActivities(prev => Math.min(5, prev + 1))}
                  className="mt-2 w-full py-1.5 border border-dashed border-rose-300 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-100/50 transition-colors"
                >
                  + {currentLang === "id" ? "Tambah Opsi Kegiatan baru" : "Add New Activity Option"}
                </button>
              )}
            </div>

            {formValues.template === "date_ticket" && (
              <div className="border-t border-rose-100 pt-3 mt-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {currentLang === "id" ? "Lokasi / Tempat Pertemuan 📍" : "Venue / Location 📍"}
                </label>
                <input
                  type="text"
                  placeholder={currentLang === "id" ? "Contoh: Paris, France" : "e.g., Paris, France"}
                  {...register("favoriteMoments.9" as any)}
                  maxLength={40}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm text-zinc-700 bg-white"
                />
              </div>
            )}
          </div>
        )}

        {/* 5. Photo Uploader */}
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <PhotoUploader 
              value={field.value} 
              onChange={field.onChange} 
              max={
                formValues.template === "date_invitation"
                  ? 1
                  : formValues.template === "date_ticket"
                  ? 2
                  : 5
              } 
            />
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
          <label className="block text-sm font-semibold text-gray-900">{t.finalMessageLabel}</label>
          <input
            type="text"
            placeholder={currentLang === "id" ? "Contoh: Terima kasih atas segalanya." : "e.g., Thank you for everything."}
            {...register("finalMessage")}
            maxLength={300}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm font-medium text-zinc-700"
          />
          {formValues.template === "graduation_memory_lane" && (
            <p className="text-xs text-amber-600 font-medium">
              {t.finalMessageDescGrad}
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
              {t.processingBtn}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t.publishBtn}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          {currentLang === "id"
            ? "Setelah pembayaran dikonfirmasi, catatan akan langsung terbit dan tidak dapat diedit kembali. Dengan menerbitkan catatan, Anda menyetujui "
            : "After payment is confirmed, the note will be published instantly and cannot be edited again. By publishing, you agree to our "}
          <Link href="/terms" target="_blank" className="underline hover:text-gray-800 transition-colors">
            {t.terms}
          </Link>
          {currentLang === "id" ? ", " : ", "}
          <Link href="/privacy" target="_blank" className="underline hover:text-gray-800 transition-colors">
            {t.privacy}
          </Link>
          {currentLang === "id" ? ", serta " : ", and "}
          <Link href="/refund" target="_blank" className="underline hover:text-gray-800 transition-colors">
            {t.refund}
          </Link>{" "}
          {currentLang === "id" ? "kami." : "policies."}
        </p>
      </form>

      {/* Right Column: Live Preview (1 col on desktop) */}
      <div id="live-preview" className="lg:sticky lg:top-8 w-full">
        <LivePreview
          draft={formValues}
          bgMusicPreviewUrl={bgMusicBlobUrl}
          onFlowersChange={(flowers) => setValue("flowers", flowers)}
        />
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
              {t.confirmTitle}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {t.confirmDesc}
            </p>

            {/* Price Card */}
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 mb-6">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block mb-1">{t.priceCardTitle}</span>
              <span className="text-3xl font-serif font-bold text-gray-900">Rp8.000</span>
              <span className="text-xs text-gray-500 block mt-1">{t.priceCardDesc}</span>
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
                    {t.processingBtn}
                  </>
                ) : (
                  t.continuePayBtn
                )}
              </button>
              
              <button
                type="button"
                onClick={() => !submitting && setShowPaymentConfirm(false)}
                disabled={submitting}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer text-sm"
              >
                {t.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
