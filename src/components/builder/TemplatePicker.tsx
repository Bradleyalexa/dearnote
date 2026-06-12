"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { generateConfig } from "@/lib/publisher/generate-config";
import { generateIndexHtml } from "@/lib/publisher/generate-index-html";
import { TemplateType } from "@/lib/schemas/card-draft";

/* ── Template Registry ── */
export const TEMPLATE_REGISTRY: {
  id: TemplateType;
  name: string;
  description: string;
  category: "semua" | "minimal" | "romantic" | "playful" | "interaktif";
  accent: string; // CSS gradient or solid colour for the swatch dot
  tags: string[];
}[] = [
  {
    id: "classic_editorial",
    name: "Classic Editorial",
    description: "Tipografi serif elegan, kertas krem hangat, partikel debu halus.",
    category: "minimal",
    accent: "linear-gradient(135deg, #F5F0E8, #DDD3C0)",
    tags: ["Perpisahan", "Terima Kasih", "Keluarga"],
  },
  {
    id: "nocturnal_journal",
    name: "Nocturnal Journal",
    description: "Langit malam berbintang, gelap, tenang, dan minimalis.",
    category: "minimal",
    accent: "linear-gradient(135deg, #1A1A2E, #16213E)",
    tags: ["Keluarga", "Perpisahan", "Kenangan"],
  },
  {
    id: "apology_letter",
    name: "Apology Letter",
    description: "Amplop tersegel lilin, surat tulus tulis tangan — menyentuh.",
    category: "minimal",
    accent: "linear-gradient(135deg, #E8E0D8, #CFC4B8)",
    tags: ["Permintaan Maaf"],
  },
  {
    id: "scrapbook",
    name: "Scrapbook Vintage",
    description: "Sampul coklat tua, polaroid drag, nuansa nostalgia.",
    category: "romantic",
    accent: "linear-gradient(135deg, #BF8A60, #8C6040)",
    tags: ["Couple", "Persahabatan"],
  },
  {
    id: "pink_book_folds",
    name: "Pink Book Folds",
    description: "Binder pastel pink imut, animasi halaman 3D, kaset rekaman.",
    category: "romantic",
    accent: "linear-gradient(135deg, #FFCCE0, #FFB3D1)",
    tags: ["Couple", "Ulang Tahun"],
  },
  {
    id: "open_when_cards",
    name: "Open When Cards",
    description: "Kumpulan amplop interaktif flip-card untuk aneka momen.",
    category: "interaktif",
    accent: "linear-gradient(135deg, #FAF6F0, #DDD0BC)",
    tags: ["LDR", "Persahabatan", "Ulang Tahun"],
  },
  {
    id: "gift_box_reveal",
    name: "Gift Box Reveal",
    description: "Kotak hadiah 3D, tarik pita, confetti perayaan!",
    category: "interaktif",
    accent: "linear-gradient(135deg, #FF9A9E, #FF6B6B)",
    tags: ["Ulang Tahun", "Wisuda", "Anniversary"],
  },
  {
    id: "playful_gift",
    name: "Playful Cute Gift",
    description: "Kotak kado pink pastel imut, balon & gelembung ceria.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFE5EC, #F0E6FF)",
    tags: ["Ulang Tahun", "Couple"],
  },
  {
    id: "playful_dog",
    name: "Playful Shiba Dog 🐾",
    description: "Shiba Inu interaktif! Ketuk bangun, beri tulang, main bola.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFF9E6, #FFE4CC)",
    tags: ["Couple", "Persahabatan", "Ulang Tahun"],
  },
  {
    id: "playful_pooh",
    name: "Playful Pooh Bear 🍯",
    description: "Pooh tidur, bangun, makan madu, main lebah — super imut!",
    category: "playful",
    accent: "linear-gradient(135deg, #FFFDE6, #FFCB4C33)",
    tags: ["Couple", "Persahabatan", "Ulang Tahun"],
  },
];

type Category = "semua" | "minimal" | "romantic" | "playful" | "interaktif";

const CATEGORY_LABELS: Record<Category, string> = {
  semua: "Semua",
  minimal: "Minimal",
  romantic: "Romantis",
  playful: "Playful",
  interaktif: "Interaktif",
};

/* ── A minimal dummy CardDraft for preview generation ── */
function makeDummyDraft(templateId: TemplateType) {
  return {
    template: templateId,
    fromName: "Kamu",
    toName: "Dia",
    secretCode: "",
    letterTitle: "Sebuah Pesan Untukmu",
    letterBody: "Halo! Ini adalah preview desain. Isi surat yang sesungguhnya akan muncul di sini setelah kamu mengisi formnya.",
    photos: [],
    voiceNote: undefined,
    bgMusic: undefined,
    finalMessage: "Dengan sepenuh hati 💖",
  };
}

/* ── Props ── */
interface TemplatePickerProps {
  value: TemplateType;
  onChange: (id: TemplateType) => void;
}

export default function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category>("semua");
  const [highlighted, setHighlighted] = useState<TemplateType>(value);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTemplate = TEMPLATE_REGISTRY.find((t) => t.id === value);

  const filtered =
    category === "semua"
      ? TEMPLATE_REGISTRY
      : TEMPLATE_REGISTRY.filter((t) => t.category === category);

  /* Generate preview HTML when highlighted changes */
  const generatePreview = useCallback((templateId: TemplateType) => {
    setPreviewLoading(true);
    const draft = makeDummyDraft(templateId);
    const config = generateConfig("preview_id", draft);
    config.photos = [];
    let html = generateIndexHtml(config);

    // Inject auto-reveal script
    const bypassScript = `
      <script>
        window.addEventListener('load', () => {
          const ci = document.getElementById('secret-code-input') || document.getElementById('code-input');
          if (ci && typeof verifyCode === 'function') { ci.value='123'; verifyCode(); }
          setTimeout(() => {
            const el = document.getElementById('envelope'); if (el && typeof openEnvelope === 'function') openEnvelope();
            const mn = document.getElementById('moon'); if (mn && typeof openMoon === 'function') openMoon();
            const rb = document.getElementById('ribbon'); if (rb && typeof openGiftBox === 'function') openGiftBox();
            if (typeof triggerWakeup === 'function') triggerWakeup();
          }, 500);
        });
      </script>
    `;
    html = html.replace("</body>", `${bypassScript}</body>`);
    setPreviewSrc(html);
    setPreviewLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHighlighted(value);
      generatePreview(value);
    }
  }, [isOpen, value, generatePreview]);

  const handleHighlight = (id: TemplateType) => {
    setHighlighted(id);
    generatePreview(id);
  };

  const handleConfirm = () => {
    onChange(highlighted);
    setIsOpen(false);
  };

  const handleClose = () => {
    setHighlighted(value);
    setIsOpen(false);
  };

  /* Prevent body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white border-2 border-zinc-200 hover:border-zinc-300 rounded-2xl shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          {/* colour swatch */}
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 shadow-sm"
            style={{ background: currentTemplate?.accent ?? "#e5e7eb" }}
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-zinc-800 leading-tight">
              {currentTemplate?.name ?? "Pilih Desain"}
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
              {currentTemplate?.description.slice(0, 55)}…
            </p>
          </div>
        </div>
        <span className="text-zinc-400 group-hover:text-zinc-700 transition-colors ml-2 text-xs font-semibold flex items-center gap-1">
          Ganti
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </button>

      {/* ── Modal overlay ── */}
      {mounted && typeof document !== "undefined" && isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-modal-fade"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          onClick={handleClose}
        >
          {/* Panel */}
          <div
            className="bg-white w-full sm:w-[95vw] max-w-6xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-modal-scale"
            style={{ maxHeight: "92vh", minHeight: "60vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-zinc-800 font-serif">Pilih Desain Catatan</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Klik desain untuk melihat preview langsung</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 px-6 py-3 overflow-x-auto flex-shrink-0 scrollbar-hide border-b border-zinc-100">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Body: list + preview */}
            <div className="flex flex-1 overflow-hidden">

              {/* Left: Template list (scrollable) */}
              <div className="w-full sm:w-64 lg:w-72 flex-shrink-0 overflow-y-auto border-r border-zinc-100 py-3 px-3 space-y-1.5">
                {filtered.map((tmpl) => {
                  const isSelected = highlighted === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleHighlight(tmpl.id)}
                      className={`w-full text-left px-3 py-3 rounded-2xl flex items-center gap-3 transition-all ${
                        isSelected
                          ? "bg-zinc-800 shadow-sm"
                          : "hover:bg-zinc-50"
                      }`}
                    >
                      {/* swatch */}
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm"
                        style={{ background: tmpl.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold leading-tight truncate ${isSelected ? "text-white" : "text-zinc-800"}`}>
                          {tmpl.name}
                        </p>
                        <p className={`text-[10px] leading-tight mt-0.5 line-clamp-2 ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                          {tmpl.description}
                        </p>
                        {tmpl.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {tmpl.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                  isSelected ? "bg-zinc-600 text-zinc-200" : "bg-zinc-100 text-zinc-500"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right: Live iframe preview */}
              <div className="hidden sm:flex flex-1 flex-col items-center justify-center bg-zinc-50 relative overflow-hidden p-6">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
                    <p className="text-xs text-zinc-400">Memuat preview…</p>
                  </div>
                ) : (
                  <div className="relative flex flex-row items-center justify-center gap-6 w-full h-full max-h-[62vh] lg:max-h-[70vh] min-h-0 px-6">
                    {/* Clean edge-to-edge preview viewport card */}
                    <div className="relative h-full max-h-[480px] lg:max-h-[560px] aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-xl border border-zinc-200 flex-shrink-0">
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewSrc}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts allow-same-origin"
                        title="Template Preview"
                      />
                    </div>

                    {/* template info panel on the side */}
                    <div className="flex flex-col text-left w-56 flex-shrink-0 bg-white border border-zinc-200 rounded-2xl p-5 shadow-md">
                      {(() => {
                        const tmpl = TEMPLATE_REGISTRY.find((t) => t.id === highlighted);
                        return tmpl ? (
                          <>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                              Detail Desain
                            </span>
                            <h3 className="text-base font-extrabold text-zinc-850 text-[#18181b] mt-1 leading-tight font-serif">
                              {tmpl.name}
                            </h3>
                            <div className="w-8 h-1 bg-zinc-800 rounded-full mt-2.5 mb-3" />
                            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                              {tmpl.description}
                            </p>
                            
                            {/* Accent theme indicator */}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
                              <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: tmpl.accent }} />
                              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                Tema Warna
                              </span>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 flex-shrink-0 gap-3">
              <p className="text-xs text-zinc-400 hidden sm:block">
                {highlighted !== value ? `Akan menggunakan: ${TEMPLATE_REGISTRY.find((t) => t.id === highlighted)?.name}` : "Desain saat ini sudah dipilih"}
              </p>
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-900 rounded-xl transition-all shadow-sm"
                >
                  Pilih Desain Ini
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
