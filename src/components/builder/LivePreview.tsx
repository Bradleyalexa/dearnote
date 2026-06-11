"use client";

import { useEffect, useState, useRef } from "react";
import { generateConfig } from "@/lib/publisher/generate-config";
import { generateIndexHtml } from "@/lib/publisher/generate-index-html";
import { CardDraft } from "@/lib/schemas/card-draft";

interface LivePreviewProps {
  draft: CardDraft;
}

export default function LivePreview({ draft }: LivePreviewProps) {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"cover" | "inside">("inside");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 1. Generate Config
    const config = generateConfig("preview_id", draft);

    // Override S3 remapping for preview using direct data URLs or public keys
    config.photos = draft.photos.map((p) => ({
      src: p.src, // Use the src (public Url) for live previewing
      caption: p.caption,
    }));
    
    if (draft.voiceNote) {
      config.voiceNote = {
        src: draft.voiceNote.src,
        durationSeconds: draft.voiceNote.durationSeconds,
      };
    }

    // 2. Generate HTML
    let html = generateIndexHtml(config);

    // 3. Inject preview control script
    // If tab is "inside", automatically trigger the reveal animations
    if (activeTab === "inside") {
      const bypassScript = `
        <script>
          window.addEventListener('load', () => {
            // Disable actual fetching from local folder, use pre-injected config
            // Auto bypass code screen
            const codeInput = document.getElementById('secret-code-input');
            const codeBtn = document.querySelector('#code-section button');
            if (codeInput && codeBtn) {
              codeInput.value = config.secretCode || '123';
              verifyCode();
            }
            // Auto bypass envelope/moon opening screen
            setTimeout(() => {
              const envelope = document.getElementById('envelope');
              if (envelope) openEnvelope();
              const moon = document.getElementById('moon');
              if (moon) openMoon();
            }, 300);
          });
        </script>
      `;
      html = html.replace("</body>", `${bypassScript}</body>`);
    }

    setSrcDoc(html);
  }, [draft, activeTab]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full h-full max-w-sm mx-auto">
      {/* Preview Tabs */}
      <div className="flex bg-zinc-100 p-1 rounded-xl w-full border border-zinc-200/50 shadow-sm font-sans">
        <button
          type="button"
          onClick={() => setActiveTab("inside")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "inside"
              ? "bg-zinc-850 text-white shadow-sm bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Isi Catatan (Preview)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cover")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "cover"
              ? "bg-zinc-850 text-white shadow-sm bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Layar Pembuka
        </button>
      </div>

      {/* Mobile device mockup frame */}
      <div className="relative w-full aspect-[9/19] max-h-[680px] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-950 flex flex-col overflow-hidden">
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
            title="Live Card Preview"
            className="w-full h-full border-none select-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        {/* Home Bar */}
        <div className="h-4 flex items-center justify-center z-20">
          <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>

      <button
        type="button"
        onClick={reloadPreview}
        className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold flex items-center gap-1.5 font-sans"
      >
        <span>🔄</span> Reset Animasi
      </button>
    </div>
  );
}
