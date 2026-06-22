"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { generateConfig } from "@/lib/publisher/generate-config";
import { generateIndexHtml } from "@/lib/publisher/generate-index-html";
import { TemplateType } from "@/lib/schemas/card-draft";

export const TEMPLATE_REGISTRY: {
  id: TemplateType;
  name: string;
  description: string;
  category: "semua" | "minimal" | "romantic" | "playful" | "interaktif" | "hari_raya";
  accent: string;
  tags: string[];
}[] = [
  {
    id: "eternal_love",
    name: "Eternal Love Cinema",
    description: "Most premium couple template — cinematic chapters, canvas particles, typewriter, polaroid gallery & fireworks finale.",
    category: "romantic",
    accent: "linear-gradient(135deg, #2c1020, #c8936a)",
    tags: ["Couple", "Anniversary", "Flagship"],
  },
  {
    id: "classic_editorial",
    name: "Classic Editorial",
    description: "Elegant serif typography, warm cream paper, subtle dust particles.",
    category: "minimal",
    accent: "linear-gradient(135deg, #F5F0E8, #DDD3C0)",
    tags: ["Farewell", "Thank You", "Family"],
  },
  {
    id: "nocturnal_journal",
    name: "Nocturnal Journal",
    description: "Starry night sky, dark, quiet, and minimalist.",
    category: "minimal",
    accent: "linear-gradient(135deg, #1A1A2E, #16213E)",
    tags: ["Family", "Farewell", "Memories"],
  },
  {
    id: "apology_letter",
    name: "Apology Letter",
    description: "Wax-sealed envelope, heartfelt handwritten letter — touching.",
    category: "minimal",
    accent: "linear-gradient(135deg, #E8E0D8, #CFC4B8)",
    tags: ["Apology"],
  },
  {
    id: "scrapbook",
    name: "Vintage Scrapbook",
    description: "Dark brown cover, draggable polaroids, nostalgic feel.",
    category: "romantic",
    accent: "linear-gradient(135deg, #BF8A60, #8C6040)",
    tags: ["Couple", "Friendship"],
  },
  {
    id: "pink_book_folds",
    name: "Pink Book Folds",
    description: "Cute pastel pink binder, 3D page animations, cassette tape.",
    category: "romantic",
    accent: "linear-gradient(135deg, #FFCCE0, #FFB3D1)",
    tags: ["Couple", "Birthday"],
  },
  {
    id: "open_when_cards",
    name: "Open When Cards",
    description: "Collection of interactive envelope flip-cards for various moments.",
    category: "interaktif",
    accent: "linear-gradient(135deg, #FAF6F0, #DDD0BC)",
    tags: ["LDR", "Friendship", "Birthday"],
  },
  {
    id: "gift_box_reveal",
    name: "Gift Box Reveal",
    description: "3D gift box, pull ribbon, celebratory confetti!",
    category: "interaktif",
    accent: "linear-gradient(135deg, #FF9A9E, #FF6B6B)",
    tags: ["Birthday", "Graduation", "Anniversary"],
  },
  {
    id: "playful_gift",
    name: "Playful Cute Gift",
    description: "Cute pastel pink gift box, cheerful balloons & bubbles.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFE5EC, #F0E6FF)",
    tags: ["Birthday", "Couple"],
  },
  {
    id: "playful_dog",
    name: "Playful Shiba Dog",
    description: "Interactive Shiba Inu! Tap to wake up, feed bones, play ball.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFF9E6, #FFE4CC)",
    tags: ["Couple", "Friendship", "Birthday"],
  },
  {
    id: "playful_pooh",
    name: "Playful Pooh Bear",
    description: "Sleeping Pooh, wake up, eat honey, play with bees — super cute!",
    category: "playful",
    accent: "linear-gradient(135deg, #FFFDE6, #FFCB4C33)",
    tags: ["Couple", "Friendship", "Birthday"],
  },
  {
    id: "birthday_magic",
    name: "Birthday Magic",
    description: "Ultimate flagship birthday template! Pop rising balloons, blow out interactive cake candles, swipe 3D memories, and trigger fireworks!",
    category: "playful",
    accent: "linear-gradient(135deg, #FF99C8, #FCF6BD, #D0F4DE, #A9DEF9, #E4C1F9)",
    tags: ["Birthday", "Anniversary", "Flagship"],
  },
  {
    id: "blooming_note",
    name: "Blooming Note",
    description: "Heartwarming floral surprise flagship. Tap the wax-sealed envelope to watch procedurally growing vines and blooming wildflowers fill the screen.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFB7B2, #E8C7EA, #B5EAD7)",
    tags: ["Anniversary", "Birthday", "Flagship"],
  },
  {
    id: "graduation_note",
    name: "Graduation Note",
    description: "Premium flagship graduation celebration. Sophisticated navy & gold design, elegant diploma scroll reveal, confetti burst.",
    category: "interaktif",
    accent: "linear-gradient(135deg, #1B2B4D, #D4AF37, #4A90E2)",
    tags: ["Graduation", "Achievement", "Flagship"],
  },
  {
    id: "graduation_memory_lane",
    name: "Graduation Memory Lane",
    description: "Elegant single-page graduation memory lane. Cozy cream & gold theme, photo scrapbook grid, and audio card with pink P.S. details.",
    category: "interaktif",
    accent: "linear-gradient(135deg, #FDF7E7, #D4AF37, #FDF0F2)",
    tags: ["Graduation", "Scrapbook", "Memory Lane"],
  },
  {
    id: "sweet_cradle",
    name: "Sweet Cradle Surprise",
    description: "Heartwarming newborn baby congratulations flagship template. Interactive cradle rocking, spinning mobile, baby footprint wax seal, and sweet pastel lullaby elements.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFF0F5, #E0FFFF, #FFFACD)",
    tags: ["Newborn", "Family", "Congratulations", "Flagship"],
  },
  {
    id: "tender_welcome",
    name: "Tender Welcome Nursery",
    description: "Elegant minimalist newborn congratulations template for parents. Warm sand-beige linen theme, hand-pressed leaf wax seal, gentle morning sunbeam glow, and olive branch motifs.",
    category: "minimal",
    accent: "linear-gradient(135deg, #F5EBE6, #E8EFE9, #DDD3C0)",
    tags: ["Newborn", "Parents", "Minimalist", "Warm"],
  },
  {
    id: "christmas_magic",
    name: "Christmas Magic",
    description: "Magical Christmas flagship template! Shake the interactive snow globe, decorate & light up the Christmas tree, read cozy cards on glowing fairy lights, and watch Santa fly across the night sky!",
    category: "hari_raya",
    accent: "linear-gradient(135deg, #A8201A, #143601, #F0E6D2)",
    tags: ["Christmas", "Holiday", "Interactive", "Flagship"],
  },
  {
    id: "ramadhan_blessings",
    name: "Ramadan Blessings",
    description: "Warm and peaceful Ramadan/Eid flagship template. Light the hanging lantern, strike the Bedug drum, unwrap the Ketupat, read scroll letters, and watch lanterns float up!",
    category: "hari_raya",
    accent: "linear-gradient(135deg, #004B23, #D4AF37, #0D1B2A)",
    tags: ["Ramadhan", "Lebaran", "Eid", "Interactive", "Flagship"],
  },
  {
    id: "mothers_day",
    name: "Mother's Herbarium Book",
    description: "Elegant 3D pressed-flower herbarium journal. Flip open the linen cover, turn pages of handwritten memories, and discover cozy taped Polaroids with falling flower petals.",
    category: "romantic",
    accent: "linear-gradient(135deg, #FFF0F2, #FFB3C1, #FF8EA6)",
    tags: ["Mother's Day", "Family", "Interactive", "Flagship"],
  },
  {
    id: "herbarium_book",
    name: "Classic Herbarium Book",
    description: "Elegant 3D pressed-flower journal. Drag & drop flowers, cycle polaroid photo stack, and slide out a secret pocket letter. Suitable for partners, best friends, or crushes.",
    category: "romantic",
    accent: "linear-gradient(135deg, #FCF7ED, #DFD3BE, #8B5A2B)",
    tags: ["Herbarium", "Interactive", "General", "Flagship"],
  },
  {
    id: "teachers_day",
    name: "Teacher's Chalkboard Notebook",
    description: "Chalkboard-themed tribute book for teachers. Erase the chalkboard cover with the sponge eraser, grade your teacher with interactive stars/stickers on the report card, cycle photos, and open a 3D red apple gift note.",
    category: "playful",
    accent: "linear-gradient(135deg, #1B2E24, #C5A880, #FAF9F6)",
    tags: ["Teacher's Day", "School", "Interactive", "Flagship"],
  },
  {
    id: "fathers_day",
    name: "Father's Classic Wallet",
    description: "Classic dark-leather wallet journal tribute to Father. Unbuckle the brass snap fastener, click interactive stamps on Dad's badge board, view warm polaroid photos on a workbench desk, and slide out a vintage pocket watch message.",
    category: "playful",
    accent: "linear-gradient(135deg, #3D2B1F, #5C4033, #0F2A4A)",
    tags: ["Father's Day", "Family", "Interactive", "Flagship"],
  },
  {
    id: "cute_apology",
    name: "Cute Couple Apology",
    description: "Kirim permintaan maaf menggemaskan ke pasanganmu. Lepas plester luka pink di amplop, kumpulkan poin maaf lewat sesajen Boba/Cokelat, dan pecahkan kue keberuntungan.",
    category: "playful",
    accent: "linear-gradient(135deg, #FFB5C5, #FFE4E1, #FAF0E6)",
    tags: ["Apology", "Couple", "Cute", "Interactive", "Flagship"],
  },
  {
    id: "farewell_keepsake",
    name: "Sincere Farewell",
    description: "Desain bersih, elegan, dan khidmat untuk perpisahan rekan kerja, teman, atau guru. Minim interaksi, berfokus penuh pada ketulusan pesan, foto berbingkai rapi, dan pesan suara hangat.",
    category: "minimal",
    accent: "linear-gradient(135deg, #E6E6E6, #D4AF37, #FFFFFF)",
    tags: ["Farewell", "Goodbye", "Minimalist", "Sincere"],
  },
];

type Category = "semua" | "minimal" | "romantic" | "playful" | "interaktif" | "hari_raya";

const CATEGORY_LABELS: Record<Category, string> = {
  semua: "All",
  minimal: "Minimal",
  romantic: "Romantic",
  playful: "Playful",
  interaktif: "Interactive",
  hari_raya: "Hari Raya",
};

export function makeDummyDraft(templateId: TemplateType) {
  return {
    template: templateId,
    fromName: "Me",
    toName: "You",
    secretCode: "",
    letterTitle: "A Message for You",
    letterBody: "Hello! This is a design preview. The actual letter content will appear here after you fill out the form.",
    photos: [],
    voiceNote: undefined,
    bgMusic: undefined,
    finalMessage: "With all my love",
  };
}

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

  const generatePreview = useCallback((templateId: TemplateType) => {
    setPreviewLoading(true);
    const draft = makeDummyDraft(templateId);
    const config = generateConfig("preview_id", draft);
    config.photos = [];
    let html = generateIndexHtml(config);

    const bypassScript = `
      <script>
        window.addEventListener('load', () => {
          const ci = document.getElementById('secret-code-input') || document.getElementById('code-input');
          if (ci && typeof verifyCode === 'function') { ci.value='123'; verifyCode(); }
          setTimeout(() => {
            const el = document.getElementById('envelope'); if (el && typeof openEnvelope === 'function') openEnvelope();
            const mn = document.getElementById('moon'); if (mn && typeof openMoon === 'function') openMoon();
            const rb = document.getElementById('ribbon'); if (rb && typeof openGiftBox === 'function') openGiftBox();
            const sg = document.getElementById('snowglobe'); if (sg && typeof openSnowGlobe === 'function') openSnowGlobe();
            const lt = document.getElementById('lantern'); if (lt && typeof lightLantern === 'function') lightLantern();
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
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm"
            style={{ background: currentTemplate?.accent ?? "#e5e7eb" }}
          />
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">
              {currentTemplate?.name ?? "Select Design"}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {currentTemplate?.description.slice(0, 60)}...
            </p>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal overlay */}
      {mounted && typeof document !== "undefined" && isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-serif">Choose Note Design</h2>
                <p className="text-xs text-gray-500 mt-0.5">Click a design for a live preview</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category tabs */}
            <div className="border-b border-gray-100">
              <div className="flex gap-2 px-6 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                      category === cat
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Body: list + preview */}
            <div className="flex flex-1 overflow-hidden">

              {/* Left: Template list */}
              <div className="w-full sm:w-80 flex-shrink-0 overflow-y-auto border-r border-gray-100 p-4 space-y-2">
                {filtered.map((tmpl) => {
                  const isSelected = highlighted === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleHighlight(tmpl.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gray-900 shadow-md"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm"
                        style={{ background: tmpl.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                          {tmpl.name}
                        </p>
                        <p className={`text-xs line-clamp-2 mt-1 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                          {tmpl.description}
                        </p>
                        {tmpl.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {tmpl.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  isSelected ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right: Live preview */}
              <div className="hidden sm:flex flex-1 flex-col items-center justify-center bg-gray-50 p-8 overflow-hidden">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-10 h-10 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-gray-500">Loading preview...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-8 w-full h-full max-h-[600px]">
                    {/* Preview viewport */}
                    <div className="flex-1 h-full max-h-[500px] aspect-[9/16] bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewSrc}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts"
                        title="Template Preview"
                      />
                    </div>

                    {/* Info panel */}
                    <div className="w-64 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-shrink-0">
                      {(() => {
                        const tmpl = TEMPLATE_REGISTRY.find((t) => t.id === highlighted);
                        return tmpl ? (
                          <>
                            <div className="mb-4">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Design Details
                              </span>
                              <h3 className="text-lg font-bold text-gray-900 mt-2 font-serif">
                                {tmpl.name}
                              </h3>
                            </div>
                            <div className="w-12 h-1 bg-gray-900 rounded-full mb-4" />
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                              {tmpl.description}
                            </p>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                              <div className="w-4 h-4 rounded-full shadow-sm" style={{ background: tmpl.accent }} />
                              <span className="text-xs text-gray-500 font-medium">
                                Color Theme
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

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 hidden sm:block">
                {highlighted !== value ? `Will use: ${TEMPLATE_REGISTRY.find((t) => t.id === highlighted)?.name}` : "This design is currently selected"}
              </p>
              <div className="flex gap-3 ml-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Select This Design
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
