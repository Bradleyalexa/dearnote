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
  charcoal: { qr: "#27272A", bg: "#FAF9F6", frame: "#EAE8E2", text: "#18181B", border: "#C5A880" },
  burgundy: { qr: "#6B1D2F", bg: "#FFFDFB", frame: "#F5E6E8", text: "#4A0E17", border: "#D4A373" },
  sage: { qr: "#2E3F35", bg: "#F4F7F5", frame: "#DFE5E1", text: "#1E2B22", border: "#9CA99E" },
  navy: { qr: "#1E293B", bg: "#F8FAFC", frame: "#E2E8F0", text: "#0F172A", border: "#94A3B8" },
  terracotta: { qr: "#8B4F35", bg: "#FCFAF7", frame: "#F2E8DF", text: "#5C2E16", border: "#D9A07E" },
  forest: { qr: "#1E352F", bg: "#FAFBF9", frame: "#E5EAE4", text: "#0F201C", border: "#A3B899" },
  espresso: { qr: "#3E2723", bg: "#FAF8F5", frame: "#EFEBE9", text: "#271C19", border: "#D7CCC8" },
  plum: { qr: "#4A154B", bg: "#FDFBFC", frame: "#F5E6F5", text: "#2D092E", border: "#C5A880" },
  lavender: { qr: "#5C5470", bg: "#F9F7FC", frame: "#ECE8F5", text: "#352F44", border: "#B3A3C4" },
  peach: { qr: "#3D6B5A", bg: "#FAFDFC", frame: "#F1E3D3", text: "#2A4B3E", border: "#E29578" },
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

    const drawHeartPath = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      c.beginPath();
      c.moveTo(x + w / 2, y + h / 5);
      c.bezierCurveTo(x + w / 2, y, x, y, x, y + h / 2.2);
      c.bezierCurveTo(x, y + h * 0.75, x + w / 2, y + h, x + w / 2, y + h);
      c.bezierCurveTo(x + w / 2, y + h, x + w, y + h * 0.75, x + w, y + h / 2.2);
      c.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h / 5);
      c.closePath();
    };

    // Background setup based on frame design
    if (frameDesign === "heart-outline") {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = palette.bg;
      drawHeartPath(ctx, 30, 35, 540, 530);
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawHeartPath(ctx, 30, 35, 540, 530);
      ctx.stroke();
      ctx.strokeStyle = palette.frame;
      ctx.lineWidth = 2.5;
      drawHeartPath(ctx, 48, 53, 504, 494);
      ctx.stroke();
    } else {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    let qrSize = 380;
    let qrX = 110;
    let qrY = 110;

    if (frameDesign === "polaroid") {
      qrSize = 340;
      qrX = 130;
      qrY = 75;
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvasSize - 40, canvasSize - 40);
      ctx.strokeStyle = palette.frame;
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      ctx.fillStyle = palette.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 26px var(--font-playfair), Georgia, serif";
      ctx.fillText("Scan untuk Membuka Jurnal", canvasSize / 2, 490);
      ctx.font = "italic 16px var(--font-playfair), Georgia, serif";
      ctx.fillStyle = palette.border;
      ctx.fillText("Abadikan momen indah bersama DearNote", canvasSize / 2, 530);
      ctx.fillStyle = palette.qr;
      drawHeartPath(ctx, canvasSize / 2 - 8, 550, 16, 16);
      ctx.fill();
    } else if (frameDesign === "heart-silhouette") {
      qrSize = 270;
      qrX = 165;
      qrY = 165;
      ctx.fillStyle = themeColor === "charcoal" ? "#EAE8E2" : palette.frame;
      drawHeartPath(ctx, 50, 50, 500, 500);
      ctx.fill();
    } else if (frameDesign === "heart-outline") {
      qrSize = 270;
      qrX = 165;
      qrY = 165;
      ctx.fillStyle = palette.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "italic 18px var(--font-playfair), Georgia, serif";
      ctx.fillText("DearNote", canvasSize / 2, 490);
      ctx.fillStyle = palette.qr;
      drawHeartPath(ctx, canvasSize / 2 - 6, 515, 12, 12);
      ctx.fill();
    }

    const qrObj = QRCode.create(cardUrl, { errorCorrectionLevel: "H" });
    const matrix = qrObj.modules;
    const count = matrix.size;
    const mSize = qrSize / count;

    const hasCenterLogo = centerLogo !== "none";
    const centerStart = Math.floor(count / 2) - 2;
    const centerEnd = Math.floor(count / 2) + 2;

    ctx.fillStyle = palette.qr;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (hasCenterLogo && r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
          continue;
        }

        const isActive = matrix.get(r, c) === 1;
        if (!isActive) continue;

        const x = qrX + c * mSize;
        const y = qrY + r * mSize;

        const isFinderPattern =
          (r < 7 && c < 7) ||
          (r < 7 && c >= count - 7) ||
          (r >= count - 7 && c < 7);

        if (isFinderPattern) {
          let fRow = 0;
          let fCol = 0;
          if (r < 7 && c >= count - 7) fCol = count - 7;
          if (r >= count - 7 && c < 7) fRow = count - 7;

          if (r === fRow && c === fCol) {
            const eyeSize = 7 * mSize;
            const eyeX = qrX + fCol * mSize;
            const eyeY = qrY + fRow * mSize;
            ctx.fillStyle = palette.bg;
            ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
            ctx.fillStyle = palette.qr;
            fillRoundRect(ctx, eyeX, eyeY, eyeSize, eyeSize, mSize * 1.8);
            ctx.fillStyle = palette.bg;
            fillRoundRect(ctx, eyeX + mSize, eyeY + mSize, eyeSize - 2 * mSize, eyeSize - 2 * mSize, mSize * 1.0);
            ctx.fillStyle = palette.qr;
            fillRoundRect(ctx, eyeX + 2 * mSize, eyeY + 2 * mSize, eyeSize - 4 * mSize, eyeSize - 4 * mSize, mSize * 0.6);
          }
        } else {
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

    if (hasCenterLogo) {
      const logoModules = 5;
      const logoSize = logoModules * mSize;
      const logoX = qrX + centerStart * mSize;
      const logoY = qrY + centerStart * mSize;

      ctx.fillStyle = palette.bg;
      fillRoundRect(ctx, logoX - 2, logoY - 2, logoSize + 4, logoSize + 4, mSize * 0.6);

      if (centerLogo === "heart-red" || centerLogo === "heart-dark") {
        ctx.fillStyle = centerLogo === "heart-red" ? "#EF4444" : palette.qr;
        drawHeartPath(ctx, logoX + logoSize * 0.15, logoY + logoSize * 0.15, logoSize * 0.7, logoSize * 0.7);
        ctx.fill();
      } else if (centerLogo === "note") {
        ctx.fillStyle = palette.qr;
        ctx.font = `${logoSize * 0.5}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("📝", logoX + logoSize / 2, logoY + logoSize / 2);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-4xl w-full flex flex-col md:flex-row p-6 sm:p-8 gap-8 relative my-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all flex items-center justify-center cursor-pointer z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Canvas Preview */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md p-3 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider text-center">
            Preview QR Code
          </p>
        </div>

        {/* Right: Controls */}
        <div className="flex-[1.2] flex flex-col space-y-6 justify-between">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Modifikasi QR Code</h2>
            <p className="text-sm text-gray-600">
              Sesuaikan tampilan QR Code jurnal Anda sebelum diunduh.
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Colors */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Warna Tema</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {(Object.keys(PALETTES) as ThemeColor[]).map((key) => {
                  const p = PALETTES[key];
                  const isActive = themeColor === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setThemeColor(key)}
                      style={{ backgroundColor: p.qr }}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 border-2 ${
                        isActive ? "border-gray-900 ring-2 ring-gray-400" : "border-transparent"
                      }`}
                      title={key}
                      aria-label={`Theme color ${key}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Pixel Style */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Bentuk Pixel</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "square", label: "Kotak" },
                  { id: "dots", label: "Bulat" },
                  { id: "hearts", label: "Hati" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPixelStyle(item.id as PixelStyle)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      pixelStyle === item.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Design */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Desain Bingkai</span>
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
                    className={`py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      frameDesign === item.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Logo */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Logo Tengah</span>
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
                    className={`py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      centerLogo === item.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh QR Code
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all cursor-pointer border border-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
