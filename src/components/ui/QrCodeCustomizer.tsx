"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QrCodeCustomizerProps {
  cardUrl: string;
  orderId: string;
  onClose: () => void;
}

type PixelStyle = "square" | "dots" | "hearts";
type FrameDesign = "none" | "heart-outline" | "heart-silhouette" | "polaroid";
type CenterLogo = "none" | "heart-red" | "heart-dark" | "note";
type ThemeColor = "charcoal" | "burgundy" | "sage" | "navy" | "terracotta" | "forest" | "espresso" | "plum" | "lavender" | "peach";

interface ColorPalette {
  qr: string;
  bg: string;
  frame: string;
  text: string;
  border: string;
}

const PALETTES: Record<ThemeColor, ColorPalette> = {
  charcoal: {
    qr: "#27272A", // zinc-800
    bg: "#FAF9F6", // Ivory
    frame: "#EAE8E2", // Linen
    text: "#18181B", // Zinc-900
    border: "#C5A880", // Muted Gold/Bronze
  },
  burgundy: {
    qr: "#6B1D2F", // Muted Burgundy
    bg: "#FFFDFB", // Warm Rose Cream
    frame: "#F5E6E8", // Muted Soft Pink
    text: "#4A0E17", // Deep Wine
    border: "#D4A373", // Warm Sand
  },
  sage: {
    qr: "#2E3F35", // Dark Forest Sage
    bg: "#F4F7F5", // Soft sage bg
    frame: "#DFE5E1", // Sage frame
    text: "#1E2B22", // Deep Sage Text
    border: "#9CA99E", // Muted Sage Border
  },
  navy: {
    qr: "#1E293B", // slate-800
    bg: "#F8FAFC", // slate-50
    frame: "#E2E8F0", // slate-200
    text: "#0F172A", // slate-900
    border: "#94A3B8", // slate-400
  },
  terracotta: {
    qr: "#8B4F35", // Terracotta clay
    bg: "#FCFAF7", // Warm soft cream
    frame: "#F2E8DF", // Soft clay accent
    text: "#5C2E16", // Deep clay
    border: "#D9A07E", // Muted terracotta border
  },
  forest: {
    qr: "#1E352F", // Deep pine forest
    bg: "#FAFBF9", // Soft leaf cream
    frame: "#E5EAE4", // Pale forest mist
    text: "#0F201C", // Dark forest pine
    border: "#A3B899", // Muted leaf sage
  },
  espresso: {
    qr: "#3E2723", // Dark espresso
    bg: "#FAF8F5", // Warm oat cream
    frame: "#EFEBE9", // Warm taupe
    text: "#271C19", // Deep coffee text
    border: "#D7CCC8", // Soft mocha border
  },
  plum: {
    qr: "#4A154B", // Plum purple
    bg: "#FDFBFC", // Pale pinkish cream
    frame: "#F5E6F5", // Soft plum mist
    text: "#2D092E", // Deep plum/black
    border: "#C5A880", // Gold/bronze accent
  },
  lavender: {
    qr: "#5C5470", // Pastel lavender purple
    bg: "#F9F7FC", // Pale lavender cream
    frame: "#ECE8F5", // Soft lavender accent
    text: "#352F44", // Deep indigo-slate
    border: "#B3A3C4", // Pastel purple accent
  },
  peach: {
    qr: "#3D6B5A", // Soft teal/mint
    bg: "#FAFDFC", // Very soft pale mint
    frame: "#F1E3D3", // Pastel peach accent
    text: "#2A4B3E", // Deep forest text
    border: "#E29578", // Warm pastel peach border
  },
};

export default function QrCodeCustomizer({ cardUrl, orderId, onClose }: QrCodeCustomizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pixelStyle, setPixelStyle] = useState<PixelStyle>("square");
  const [frameDesign, setFrameDesign] = useState<FrameDesign>("none");
  const [centerLogo, setCenterLogo] = useState<CenterLogo>("none");
  const [themeColor, setThemeColor] = useState<ThemeColor>("charcoal");

  useEffect(() => {
    drawQr();
  }, [cardUrl, pixelStyle, frameDesign, centerLogo, themeColor]);

  const drawQr = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasSize = 600;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const palette = PALETTES[themeColor];

    // Helper: Draw Rounded Rectangle
    const fillRoundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
      c.fill();
    };

    // Helper: Draw Symmetrical Heart
    const drawHeartPath = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      c.beginPath();
      c.moveTo(x + w / 2, y + h / 5);
      c.bezierCurveTo(x + w / 2, y, x, y, x, y + h / 2.2);
      c.bezierCurveTo(x, y + h * 0.75, x + w / 2, y + h, x + w / 2, y + h);
      c.bezierCurveTo(x + w / 2, y + h, x + w, y + h * 0.75, x + w, y + h / 2.2);
      c.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h / 5);
      c.closePath();
    };

    // 1. Draw Background
    if (frameDesign === "heart-outline") {
      // Clear canvas to keep transparent outside the heart shape
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      
      // Fill the main heart card background
      ctx.fillStyle = palette.bg;
      drawHeartPath(ctx, 30, 35, 540, 530);
      ctx.fill();

      // Stroke outer gold border
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawHeartPath(ctx, 30, 35, 540, 530);
      ctx.stroke();

      // Stroke inner border
      ctx.strokeStyle = palette.frame;
      ctx.lineWidth = 2.5;
      drawHeartPath(ctx, 48, 53, 504, 494);
      ctx.stroke();
    } else {
      // Standard full rectangle background
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    // 2. Render Frames / Background decorations
    let qrSize = 380;
    let qrX = 110;
    let qrY = 110;

    if (frameDesign === "polaroid") {
      qrSize = 340;
      qrX = 130;
      qrY = 75;

      // Draw polaroid card frame inner boundary
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvasSize - 40, canvasSize - 40);

      // Draw a subtle border around QR area
      ctx.strokeStyle = palette.frame;
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      // Draw Polaroid Text
      ctx.fillStyle = palette.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Title
      ctx.font = "bold 26px var(--font-playfair), Georgia, serif";
      ctx.fillText("Scan untuk Membuka Jurnal", canvasSize / 2, 490);
      
      // Subtitle / Brand
      ctx.font = "italic 16px var(--font-playfair), Georgia, serif";
      ctx.fillStyle = palette.border;
      ctx.fillText("Abadikan momen indah bersama DearNote", canvasSize / 2, 530);

      // Draw small decorative heart at bottom center
      ctx.fillStyle = palette.qr;
      drawHeartPath(ctx, canvasSize / 2 - 8, 550, 16, 16);
      ctx.fill();

    } else if (frameDesign === "heart-silhouette") {
      qrSize = 270;
      qrX = 165;
      qrY = 165;

      // Draw a large, soft silhouette heart behind the QR code
      ctx.fillStyle = themeColor === "charcoal" ? "#EAE8E2" : palette.frame;
      drawHeartPath(ctx, 50, 50, 500, 500);
      ctx.fill();

    } else if (frameDesign === "heart-outline") {
      // "Kartu Hati": QR size is centered exactly at 165
      qrSize = 270;
      qrX = 165;
      qrY = 165;

      // Draw text at the bottom tip of the heart
      ctx.fillStyle = palette.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "italic 18px var(--font-playfair), Georgia, serif";
      ctx.fillText("DearNote", canvasSize / 2, 490);

      // Draw a tiny heart below text
      ctx.fillStyle = palette.qr;
      drawHeartPath(ctx, canvasSize / 2 - 6, 515, 12, 12);
      ctx.fill();
    }

    // 3. Generate QR Code Matrix
    const qrObj = QRCode.create(cardUrl, { errorCorrectionLevel: "H" });
    const matrix = qrObj.modules;
    const count = matrix.size;
    const mSize = qrSize / count;

    // Calculate center logo boundary (5x5 modules skipped in center)
    const hasCenterLogo = centerLogo !== "none";
    const centerStart = Math.floor(count / 2) - 2;
    const centerEnd = Math.floor(count / 2) + 2;

    // 4. Draw Modules
    ctx.fillStyle = palette.qr;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        // Skip central area if we want to place a center logo
        if (hasCenterLogo && r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
          continue;
        }

        const isActive = matrix.get(r, c) === 1;
        if (!isActive) continue;

        const x = qrX + c * mSize;
        const y = qrY + r * mSize;

        // Finder patterns (three large corners, size 7x7 modules)
        const isFinderPattern =
          (r < 7 && c < 7) || // Top Left
          (r < 7 && c >= count - 7) || // Top Right
          (r >= count - 7 && c < 7); // Bottom Left

        if (isFinderPattern) {
          // Render Finder Patterns as slightly rounded rectangles for high compatibility and premium look
          // We only want to draw the outer border (7x7) and inner dot (3x3), but since the matrix has them all as 1s,
          // drawing a customized finder eye looks extremely clean.
          // To draw custom eye, let's identify the top-left of each finder pattern
          let fRow = 0;
          let fCol = 0;
          if (r < 7 && c >= count - 7) fCol = count - 7;
          if (r >= count - 7 && c < 7) fRow = count - 7;

          // Draw outer eye (7x7 modules) only once per finder pattern
          if (r === fRow && c === fCol) {
            const eyeSize = 7 * mSize;
            const eyeX = qrX + fCol * mSize;
            const eyeY = qrY + fRow * mSize;

            // Clear this 7x7 area to draw custom finder eye
            ctx.fillStyle = palette.bg;
            ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);

            // Draw outer rounded box
            ctx.fillStyle = palette.qr;
            fillRoundRect(ctx, eyeX, eyeY, eyeSize, eyeSize, mSize * 1.8);

            // Draw inner cutout (white)
            ctx.fillStyle = palette.bg;
            fillRoundRect(ctx, eyeX + mSize, eyeY + mSize, eyeSize - 2 * mSize, eyeSize - 2 * mSize, mSize * 1.0);

            // Draw center rounded dot (3x3)
            ctx.fillStyle = palette.qr;
            fillRoundRect(ctx, eyeX + 2 * mSize, eyeY + 2 * mSize, eyeSize - 4 * mSize, eyeSize - 4 * mSize, mSize * 0.6);
          }
        } else {
          // Render normal pixel modules based on style
          if (pixelStyle === "square") {
            ctx.fillRect(x, y, mSize + 0.5, mSize + 0.5);
          } else if (pixelStyle === "dots") {
            ctx.beginPath();
            ctx.arc(x + mSize / 2, y + mSize / 2, mSize / 2 * 0.82, 0, Math.PI * 2);
            ctx.fill();
          } else if (pixelStyle === "hearts") {
            ctx.fillStyle = palette.qr;
            drawHeartPath(ctx, x, y, mSize * 0.95, mSize * 0.95);
            ctx.fill();
          }
        }
      }
    }

    // 5. Draw Center Logo
    if (hasCenterLogo) {
      const logoModules = 5;
      const logoSize = logoModules * mSize;
      const logoX = qrX + centerStart * mSize;
      const logoY = qrY + centerStart * mSize;

      // Draw solid bg clearing area with small rounded rect
      ctx.fillStyle = palette.bg;
      fillRoundRect(ctx, logoX - 2, logoY - 2, logoSize + 4, logoSize + 4, mSize * 0.6);

      if (centerLogo === "heart-red" || centerLogo === "heart-dark") {
        ctx.fillStyle = centerLogo === "heart-red" ? "#EF4444" : palette.qr;
        drawHeartPath(ctx, logoX + logoSize * 0.15, logoY + logoSize * 0.15, logoSize * 0.7, logoSize * 0.7);
        ctx.fill();
      } else if (centerLogo === "note") {
        // Draw note notebook symbol
        ctx.font = `${logoSize * 0.65}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("📓", logoX + logoSize / 2, logoY + logoSize / 2 + 1);
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `dearnote-qr-${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] border border-zinc-200/80 shadow-2xl rounded-3xl max-w-4xl w-full flex flex-col md:flex-row p-6 sm:p-8 gap-8 animate-fade-in relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-500 hover:text-zinc-800 transition-all flex items-center justify-center font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Left Column: Canvas Preview */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-md p-3 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 font-semibold tracking-wider uppercase text-center">
            Preview QR Code 
          </p>
        </div>

        {/* Right Column: Customizer Controls */}
        <div className="flex-[1.2] flex flex-col space-y-6 justify-between">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-zinc-800">Modifikasi QR Code</h2>
            <p className="text-xs text-zinc-500 font-medium">
              Sesuaikan tampilan QR Code jurnal Anda sebelum diunduh.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold text-zinc-700">
            {/* 1. Theme Color Selector */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Warna Tema</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {(Object.keys(PALETTES) as ThemeColor[]).map((key) => {
                  const p = PALETTES[key];
                  const isActive = themeColor === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setThemeColor(key)}
                      style={{ backgroundColor: p.qr }}
                      className={`w-7 h-7 rounded-full relative cursor-pointer transition-all transform hover:scale-110 border-2 ${
                        isActive ? "border-zinc-800 ring-2 ring-zinc-400" : "border-transparent"
                      }`}
                      title={key}
                    />
                  );
                })}
              </div>
            </div>

            {/* 2. Pixel Style */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Bentuk Pixel</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "square", label: "Kotak" },
                  { id: "dots", label: "Bulat" },
                  { id: "hearts", label: "Hati ❤️" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPixelStyle(item.id as PixelStyle)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      pixelStyle === item.id
                        ? "bg-zinc-800 text-white border-zinc-800 shadow-sm"
                        : "bg-white text-zinc-650 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Frame Design */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Desain Bingkai</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "none", label: "Tanpa" },
                  { id: "heart-silhouette", label: "Latar Hati" },
                  { id: "heart-outline", label: "Kartu Hati" },
                  { id: "polaroid", label: "Polaroid" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFrameDesign(item.id as FrameDesign)}
                    className={`py-2 px-1 rounded-xl border text-center text-[11px] transition-all cursor-pointer ${
                      frameDesign === item.id
                        ? "bg-zinc-800 text-white border-zinc-800 shadow-sm"
                        : "bg-white text-zinc-650 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Center Logo */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Logo Tengah</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "none", label: "Tanpa" },
                  { id: "heart-red", label: "Hati Merah" },
                  { id: "heart-dark", label: "Hati Senada" },
                  { id: "note", label: "Notebook" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCenterLogo(item.id as CenterLogo)}
                    className={`py-2 px-1 rounded-xl border text-center text-[11px] transition-all cursor-pointer ${
                      centerLogo === item.id
                        ? "bg-zinc-800 text-white border-zinc-800 shadow-sm"
                        : "bg-white text-zinc-650 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-900 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
            >
              📥 Unduh QR Code
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold rounded-2xl transition-all text-center cursor-pointer text-xs uppercase tracking-wider border border-zinc-200/40"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
