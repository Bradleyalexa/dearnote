"use client";

import { useEffect, useState, useRef } from "react";
import { generatePlayfulPoohHtml } from "@/lib/publisher/templates/playful-pooh";
import { generateGraduationNoteHtml } from "@/lib/publisher/templates/graduation-note";
import { generateBirthdayMagicHtml } from "@/lib/publisher/templates/birthday-magic";
import { generateBloomingNoteHtml } from "@/lib/publisher/templates/blooming-note";
import { generatePinkBookFoldsHtml } from "@/lib/publisher/templates/pink-book-folds";
import { PublishedConfig } from "@/lib/schemas/card-draft";
import { injectTailwindWarningSuppress } from "@/lib/publisher/generate-index-html";

type TemplateKey = "pooh" | "graduation" | "birthday" | "blooming" | "pinkbook";

interface TemplatePreviewProps {
  activeTemplate: TemplateKey;
}

// Sample demo configs for each template
const demoConfigs: Record<TemplateKey, PublishedConfig> = {
  pooh: {
    cardId: "demo_pooh",
    template: "playful_pooh",
    fromName: "Kamu",
    toName: "Sarah",
    letterTitle: "Pesan Manis Untukmu",
    letterBody: "Hai Sarah! Aku harap kamu suka dengan catatan kecil ini. Pooh dan aku sudah menyiapkan sesuatu yang spesial untukmu. Semoga harimu menyenangkan! 🍯",
    photos: [
      { src: "/img/holiday_bali_pic_mockup.png", caption: "Momen indah bersama" }
    ],
    finalMessage: "Selalu ingat, kamu istimewa!",
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  graduation: {
    cardId: "demo_grad",
    template: "graduation_note",
    fromName: "Keluarga",
    toName: "Sarah",
    letterTitle: "Selamat Wisuda!",
    letterBody: "Hari ini adalah pencapaian luar biasa yang telah kamu perjuangkan dengan keras. Kami sangat bangga atas semua usaha dan dedikasimu. Ini adalah awal dari perjalanan baru yang menakjubkan. Terus terbang tinggi dan raih impianmu!",
    photos: [
      { src: "/img/graduation_pic_mockup.png", caption: "Hari kelulusan yang membanggakan" }
    ],
    finalMessage: "The tassel was worth the hassle. Your future is bright!",
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  birthday: {
    cardId: "demo_bday",
    template: "birthday_magic",
    fromName: "Teman-teman",
    toName: "Sarah",
    letterTitle: "Happy Birthday!",
    letterBody: "Selamat ulang tahun untuk orang yang paling istimewa! Semoga tahun ini membawa kebahagiaan, kesuksesan, dan banyak momen indah yang tak terlupakan. Mari rayakan hari spesialmu dengan penuh suka cita!",
    photos: [
      { src: "/img/graduation_pic_mockup.png", caption: "Momen ulang tahun yang ceria" }
    ],
    finalMessage: "Wishing you a magical birthday filled with sweet surprises!",
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  blooming: {
    cardId: "demo_bloom",
    template: "blooming_note",
    fromName: "Sahabat",
    toName: "Sarah",
    letterTitle: "Pesan Berbunga",
    letterBody: "Seperti bunga yang mekar di taman, kehadiranmu membawa warna dan keindahan dalam hidup. Terima kasih telah menjadi teman yang luar biasa. Semoga hari-harimu selalu dipenuhi dengan kebahagiaan dan kehangatan.",
    photos: [
      { src: "/img/holiday_bali_pic_mockup.png", caption: "Bunga-bunga indah untuk hari indah" }
    ],
    finalMessage: "May your life keep blooming beautifully, day by day.",
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  pinkbook: {
    cardId: "demo_pink",
    template: "pink_book_folds",
    fromName: "Orang Spesial",
    toName: "Sarah",
    letterTitle: "Buku Kenangan Kita",
    letterBody: "Setiap halaman dalam buku ini menyimpan cerita indah yang kita buat bersama. Dari tawa hingga air mata, semuanya adalah bagian dari perjalanan kita yang berharga. Terima kasih telah menjadi bagian dari ceritaku.",
    photos: [
      { src: "/img/holiday_bali_pic_mockup.png", caption: "Kenangan terindah" }
    ],
    finalMessage: "Our story continues, page by page.",
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

const templateGenerators: Record<TemplateKey, (config: PublishedConfig) => string> = {
  pooh: generatePlayfulPoohHtml,
  graduation: generateGraduationNoteHtml,
  birthday: generateBirthdayMagicHtml,
  blooming: generateBloomingNoteHtml,
  pinkbook: generatePinkBookFoldsHtml,
};

export default function TemplatePreview({ activeTemplate }: TemplatePreviewProps) {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [zoom] = useState<number>(0.85);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetWidth = 380;
  const targetHeight = 696;

  useEffect(() => {
    const config = demoConfigs[activeTemplate];
    const generator = templateGenerators[activeTemplate];

    if (!config || !generator) return;

    let html = generator(config);

    // Auto-bypass code screen and trigger animations for preview
    const bypassScript = `
      <script>
        window.addEventListener('load', () => {
          // Auto bypass code screen
          const codeInput = document.getElementById('secret-code-input') ||
                           document.getElementById('code-input');
          if (codeInput) {
            codeInput.value = config.secretCode || '123';
            if (typeof verifyCode === 'function') verifyCode();
          }

          // Auto trigger wake/reveal for specific templates
          setTimeout(() => {
            // Pooh: wake up
            if (typeof triggerWakeup === 'function') triggerWakeup();

            // Envelope-based: open envelope
            const envelope = document.getElementById('envelope');
            if (envelope && typeof openEnvelope === 'function') openEnvelope();

            // Moon-based: open moon
            const moon = document.getElementById('moon');
            if (moon && typeof openMoon === 'function') openMoon();

            // Gift box: open gift
            const ribbon = document.getElementById('ribbon');
            if (ribbon && typeof openGiftBox === 'function') openGiftBox();

            // Blooming: open envelope trigger
            if (typeof openEnvelopeTrigger === 'function') openEnvelopeTrigger();
          }, 300);
        });
      </script>
    `;
    html = html.replace("</body>", `${bypassScript}</body>`);
    html = injectTailwindWarningSuppress(html);

    setSrcDoc(html);
  }, [activeTemplate]);

  return (
    <div
      ref={containerRef}
      className="relative transition-all duration-300"
      style={{
        width: `${targetWidth * zoom}px`,
        height: `${targetHeight * zoom}px`
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left transition-all duration-300"
        style={{
          transform: `scale(${zoom})`,
          width: `${targetWidth}px`,
          height: `${targetHeight}px`
        }}
      >
        {/* Mobile device mockup frame */}
        <div className="relative w-full h-full bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-950 flex flex-col overflow-hidden">
          {/* Speaker / Camera notch */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 ml-2"></div>
          </div>

          {/* iframe viewport */}
          <div className="flex-1 w-full h-full rounded-[30px] overflow-hidden bg-slate-950 relative z-10">
            <iframe
              ref={iframeRef}
              srcDoc={srcDoc}
              title="Template Preview"
              className="w-full h-full border-none select-none"
              sandbox="allow-scripts"
            />
          </div>

          {/* Home Bar */}
          <div className="h-4 flex items-center justify-center z-20">
            <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
