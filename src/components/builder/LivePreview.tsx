"use client";

import { useEffect, useState, useRef } from "react";
import { generateConfig } from "@/lib/publisher/generate-config";
import { generateIndexHtml } from "@/lib/publisher/generate-index-html";
import { CardDraft } from "@/lib/schemas/card-draft";
import { makeDummyDraft } from "./TemplatePicker";
import { useI18nStore } from "@/lib/i18n/store";

interface LivePreviewProps {
  draft: CardDraft;
  /** Blob URL of custom BGM for CORS-free audio preview (from BackgroundMusicSelector) */
  bgMusicPreviewUrl?: string | null;
  onFlowersChange?: (flowers: any[]) => void;
}

export default function LivePreview({ draft, bgMusicPreviewUrl, onFlowersChange }: LivePreviewProps) {
  const { lang } = useI18nStore();
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"cover" | "inside">("inside");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(0.85);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);

  const targetWidth = 380;
  const targetHeight = 696;

  const [debouncedDraft, setDebouncedDraft] = useState<CardDraft>(draft);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const savedFlowersRef = useRef<any>(null);

  // Listen for flower arrangement state messages from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "save_flowers") {
        savedFlowersRef.current = event.data.flowers;
        if (onFlowersChange) {
          onFlowersChange(event.data.flowers);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onFlowersChange]);

  // Sync saved flower positions from draft when template/flowers change
  useEffect(() => {
    if (draft.template === "herbarium_book" || draft.template === "mothers_day") {
      if (draft.flowers && draft.flowers.length > 0) {
        savedFlowersRef.current = draft.flowers;
      }
    } else {
      savedFlowersRef.current = null;
    }
  }, [draft.template, draft.flowers]);

  useEffect(() => {
    const isInstantChange =
      draft.template !== debouncedDraft.template ||
      draft.themeColor !== debouncedDraft.themeColor ||
      draft.openingGame !== debouncedDraft.openingGame ||
      JSON.stringify(draft.photos) !== JSON.stringify(debouncedDraft.photos) ||
      draft.voiceNote?.src !== debouncedDraft.voiceNote?.src ||
      draft.bgMusic?.src !== debouncedDraft.bgMusic?.src;

    if (isInstantChange) {
      setDebouncedDraft(draft);
      return;
    }

    // Check if other text content changed
    const hasTextChanged =
      draft.fromName !== debouncedDraft.fromName ||
      draft.toName !== debouncedDraft.toName ||
      draft.letterTitle !== debouncedDraft.letterTitle ||
      draft.letterBody !== debouncedDraft.letterBody ||
      draft.finalMessage !== debouncedDraft.finalMessage ||
      draft.secretCode !== debouncedDraft.secretCode;

    if (!hasTextChanged) {
      // If only flowers changed, do not trigger a reload
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedDraft(draft);
    }, 1500);

    return () => clearTimeout(timer);
  }, [draft, debouncedDraft]);

  useEffect(() => {
    const config = generateConfig("preview_id", debouncedDraft);
    config.lang = lang;

    config.photos = debouncedDraft.photos.map((p) => ({
      src: p.src,
      caption: p.caption,
    }));

    if (debouncedDraft.voiceNote) {
      config.voiceNote = {
        src: debouncedDraft.voiceNote.src,
        durationSeconds: debouncedDraft.voiceNote.durationSeconds,
      };
    }

    if (debouncedDraft.bgMusic) {
      const src = debouncedDraft.bgMusic.src;
      // Use blob URL for custom uploads (CORS-free, always accessible in the same session).
      // For predefined tracks (relative paths like /audio/...), encode only path segments.
      // Never encode absolute https:// URLs — encodeURIComponent would mangle the protocol.
      let resolvedSrc: string;
      if (bgMusicPreviewUrl) {
        resolvedSrc = bgMusicPreviewUrl;
      } else if (src.startsWith("http://") || src.startsWith("https://")) {
        resolvedSrc = src; // absolute URL — use as-is (may fail due to CORS in local dev)
      } else {
        resolvedSrc = src.split("/").map((seg) => encodeURIComponent(seg)).join("/");
      }
      config.bgMusic = {
        src: resolvedSrc,
        durationSeconds: debouncedDraft.bgMusic.durationSeconds,
      };
    }

    let html = generateIndexHtml(config);

    if (activeTab === "inside") {
      const bypassScript = `
        <script>
          window.addEventListener('load', () => {
            const codeInput = document.getElementById('secret-code-input') || document.getElementById('code-input');
            if (codeInput) {
              codeInput.value = config.secretCode || '123';
              if (typeof verifyCode === 'function') verifyCode();
            }
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
        }
        .preview-watermark-item {
          font-family: -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #888;
          text-shadow: 1px 1px 0px rgba(255,255,255,0.6);
          transform: rotate(-30deg);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 24px;
        }
      </style>
      <div class="preview-watermark-overlay">
        ${Array(9).fill('<div class="preview-watermark-item">DearNote Preview</div>').join('')}
      </div>
    `;
    html = html.replace("</body>", `${watermarkInject}</body>`);

    const stateInject = `
      <script>
        window.IS_DEARNOTE_PREVIEW = true;
        ${savedFlowersRef.current ? `window.PREV_FLOWERS_STATE = ${JSON.stringify(savedFlowersRef.current)};` : ""}
      </script>
    `;
    if (html.includes("<head>")) {
      html = html.replace("<head>", "<head>" + stateInject);
    } else {
      html = stateInject + html;
    }

    setSrcDoc(html);
  }, [debouncedDraft, activeTab, bgMusicPreviewUrl, reloadKey, lang]);

  useEffect(() => {
    if (!isAutoFit) return;

    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement?.clientWidth || 400;
      const scaleX = (parentWidth - 16) / targetWidth;
      const scaleY = (window.innerHeight - 220) / targetHeight;
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
    savedFlowersRef.current = null;
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center space-y-4 w-full max-w-[400px] mx-auto">
      {/* Preview Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full border border-gray-200 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("inside")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "inside"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Inside Note
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cover")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "cover"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Cover Screen
        </button>
      </div>

      {/* Scaled container */}
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
          {/* Mobile mockup frame */}
          <div className="relative w-full h-full bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-950 flex flex-col overflow-hidden">
            {/* Notch */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 ml-2"></div>
            </div>

            {/* Viewport */}
            <div className="flex-1 w-full h-full rounded-[30px] overflow-hidden bg-slate-950 relative z-10">
              <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                title="Live Card Preview"
                className="w-full h-full border-none"
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

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500 font-medium">Zoom:</span>
          <button
            type="button"
            onClick={() => handleManualZoom(0.7)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !isAutoFit && zoom === 0.7
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            70%
          </button>
          <button
            type="button"
            onClick={() => handleManualZoom(0.85)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !isAutoFit && zoom === 0.85
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            85%
          </button>
          <button
            type="button"
            onClick={() => handleManualZoom(1.0)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !isAutoFit && zoom === 1.0
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            100%
          </button>
          <button
            type="button"
            onClick={() => setIsAutoFit(true)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ${
              isAutoFit
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {isAutoFit && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            Auto
          </button>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        <div className="flex items-center justify-center space-x-6 w-full">
          <button
            type="button"
            onClick={reloadPreview}
            className="text-xs text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              const dummyDraft = makeDummyDraft(draft.template);
              const dummyConfig = generateConfig("preview_id", dummyDraft);
              dummyConfig.photos = [
                { src: "/img/holiday_bali_pic_mockup.png", caption: "Nostalgic Travel Moments" },
                { src: "/img/graduation_pic_mockup.png", caption: "Celebrating Achievements" }
              ];
              const dummyHtml = generateIndexHtml(dummyConfig);
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.open();
                newWindow.document.write(dummyHtml);
                newWindow.document.close();
              }
            }}
            className="text-xs text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Full Preview
          </button>
        </div>
      </div>
    </div>
  );
}
