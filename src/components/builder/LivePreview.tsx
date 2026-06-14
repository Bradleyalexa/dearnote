"use client";

import { useEffect, useState, useRef } from "react";
import { generateConfig } from "@/lib/publisher/generate-config";
import { generateIndexHtml } from "@/lib/publisher/generate-index-html";
import { CardDraft } from "@/lib/schemas/card-draft";
import { makeDummyDraft } from "./TemplatePicker";

interface LivePreviewProps {
  draft: CardDraft;
}

export default function LivePreview({ draft }: LivePreviewProps) {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"cover" | "inside">("inside");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(0.85);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);

  const targetWidth = 380;
  const targetHeight = 696; // 380 / (9/16.5) = 696.67 (standard mobile aspect ratio)

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

    if (draft.bgMusic) {
      // Encode each path segment to handle filenames with spaces or special chars
      const encodedBgSrc = draft.bgMusic.src
        .split("/")
        .map((seg) => encodeURIComponent(seg))
        .join("/");
      config.bgMusic = {
        src: encodedBgSrc,
        durationSeconds: draft.bgMusic.durationSeconds,
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
            const codeInput = document.getElementById('secret-code-input') || document.getElementById('code-input');
            if (codeInput) {
              codeInput.value = config.secretCode || '123';
              if (typeof verifyCode === 'function') verifyCode();
            }
            // Auto bypass envelope/moon/giftbox opening screen or wake up dog
            setTimeout(() => {
              const envelope = document.getElementById('envelope');
              if (envelope) openEnvelope();
              const moon = document.getElementById('moon');
              if (moon) openMoon();
              const ribbon = document.getElementById('ribbon');
              if (ribbon) openGiftBox();
              if (typeof triggerWakeup === 'function') triggerWakeup();
            }, 300);
          });
        </script>
      `;
      html = html.replace("</body>", `${bypassScript}</body>`);
    }

    // 4. Inject watermark overlay for screenshot protection
    const watermarkInject = `
      <style>
        .preview-watermark-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          pointer-events: none;
          display: flex;
          flex-wrap: wrap;
          align-content: space-around;
          justify-content: space-around;
          overflow: hidden;
          opacity: 0.12;
          user-select: none;
          -webkit-user-select: none;
        }
        .preview-watermark-item {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #888;
          text-shadow: 1px 1px 0px rgba(255,255,255,0.6), -1px -1px 0px rgba(0,0,0,0.3);
          transform: rotate(-30deg);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 24px;
        }
      </style>
      <div class="preview-watermark-overlay">
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
        <div class="preview-watermark-item">DearNote Preview</div>
      </div>
    `;
    html = html.replace("</body>", `${watermarkInject}</body>`);

    setSrcDoc(html);
  }, [draft, activeTab]);

  useEffect(() => {
    if (!isAutoFit) return;

    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement?.clientWidth || 400;
      
      // Calculate scaling factors
      const scaleX = (parentWidth - 16) / targetWidth;
      const scaleY = (window.innerHeight - 220) / targetHeight; // 220px vertical buffer
      
      const autoScale = Math.min(1, scaleX, scaleY);
      setZoom(Math.max(0.5, Number(autoScale.toFixed(2))));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAutoFit]);

  const handleManualZoom = (val: number) => {
    setIsAutoFit(false);
    setZoom(val);
  };

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center space-y-4 w-full h-full max-w-[400px] mx-auto select-none">
      {/* Preview Tabs */}
      <div className="flex bg-zinc-100 p-1 rounded-xl w-full border border-zinc-200/50 shadow-sm font-sans flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("inside")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "inside"
              ? "bg-zinc-850 text-white shadow-sm bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Inside Note (Preview)
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
          Cover Screen
        </button>
      </div>

      {/* Dynamic scaled container to hold layout without gaps */}
      <div 
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
        </div>
      </div>

      {/* Zoom / Scale Control Panel */}
      <div className="flex flex-col items-center gap-3.5 w-full bg-zinc-50 border border-zinc-200/60 rounded-2xl p-3 shadow-sm font-sans flex-shrink-0">
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-zinc-400 font-semibold">Zoom:</span>
          <button
            type="button"
            onClick={() => handleManualZoom(0.7)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              !isAutoFit && zoom === 0.7 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
            }`}
          >
            70%
          </button>
          <button
            type="button"
            onClick={() => handleManualZoom(0.85)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              !isAutoFit && zoom === 0.85 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
            }`}
          >
            85%
          </button>
          <button
            type="button"
            onClick={() => handleManualZoom(1.0)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              !isAutoFit && zoom === 1.0 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
            }`}
          >
            100%
          </button>
          <button
            type="button"
            onClick={() => setIsAutoFit(true)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isAutoFit 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
            }`}
          >
            {isAutoFit && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            Auto Fit
          </button>
        </div>

        <div className="w-full h-px bg-zinc-200/80"></div>

        <div className="flex items-center justify-center space-x-6 w-full">
          <button
            type="button"
            onClick={reloadPreview}
            className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>🔄</span> Reset Animation
          </button>
          <button
            type="button"
            onClick={() => {
              // 1. Generate a dummy draft for this template to showcase ONLY the template design
              const dummyDraft = makeDummyDraft(draft.template);
              
              // 2. Generate config
              const dummyConfig = generateConfig("preview_id", dummyDraft);
              
              // 3. Add rich placeholder photos to showcase the layout design beautifully
              dummyConfig.photos = [
                { src: "/img/holiday_bali_pic_mockup.png", caption: "Nostalgic Travel Moments 🌴" },
                { src: "/img/graduation_pic_mockup.png", caption: "Celebrating Achievements 🎓" }
              ];
              
              // 4. Generate clean HTML without watermark for showcase
              const dummyHtml = generateIndexHtml(dummyConfig);
              
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.open();
                newWindow.document.write(dummyHtml);
                newWindow.document.close();
              }
            }}
            className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>✨</span> Open Full Preview
          </button>
        </div>
      </div>
    </div>
  );
}
