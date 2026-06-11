"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface OrderStatusResponse {
  orderId: string;
  status: string;
  cardUrl?: string;
  qrPngUrl?: string;
  qrSvgUrl?: string;
}

export default function SuccessPage(props: { params: Promise<{ orderId: string }> }) {
  const params = use(props.params);
  const orderId = params.orderId;
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    // Check if simulate query parameter is present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const isSimulated = urlParams.get("simulate") === "true";

    let attempts = 0;
    const maxAttempts = 40; // Poll for 2 minutes max

    const pollStatus = async () => {
      try {
        // Feed simulate flag to API to trigger auto-publish on local testing
        const url = `/api/orders/${orderId}${isSimulated ? "?simulate=true" : ""}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error("Gagal mengambil status pesanan.");
        }

        const data: OrderStatusResponse = await res.json();
        setOrder(data);
        setLoading(false);

        // Stop polling if published or failed
        if (data.status === "published" || data.status === "failed") {
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          setError("Waktu konfirmasi habis. Silakan refresh halaman jika Anda sudah membayar.");
          return;
        }

        // Continue polling every 3 seconds if still pending
        setTimeout(pollStatus, 3000);
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat data. Kami akan mencoba lagi...");
        setTimeout(pollStatus, 4000);
      }
    };

    pollStatus();
  }, [orderId]);

  const copyToClipboard = () => {
    if (order?.cardUrl) {
      navigator.clipboard.writeText(order.cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffe5ec] via-[#f5ebe0] to-[#e3d5ca] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="glass-card max-w-md w-full rounded-3xl p-8 shadow-xl bg-white/60 backdrop-blur-md border border-rose-100/30 flex flex-col items-center">
          <span className="animate-spin text-4xl mb-4">⏳</span>
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">Memuat Pesanan</h2>
          <p className="text-sm text-gray-500 font-medium">Sedang memverifikasi data transaksi Anda...</p>
        </div>
      </div>
    );
  }

  const isPublished = order?.status === "published";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5ec] via-[#f5ebe0] to-[#e3d5ca] flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-gray-800">
      <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl bg-white/70 backdrop-blur-md border border-rose-100/40 text-center space-y-6">
        
        {isPublished ? (
          <>
            {/* PUBLISHED STATE */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-4xl mb-2 shadow-inner">
                🎉
              </div>
              <h1 className="font-serif text-3xl font-bold text-slate-800">Kartu Anda Telah Aktif!</h1>
              <p className="text-xs text-rose-500 font-semibold uppercase tracking-wider">Surat cinta digital Anda sudah dipublikasikan</p>
            </div>

            {/* Card Link Display Box */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between text-left">
              <div className="overflow-hidden w-full">
                <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider mb-0.5">Link Publik Kartu</span>
                <span className="text-xs font-semibold text-slate-700 block truncate">{order?.cardUrl}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full sm:w-auto px-4 py-2 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {copied ? "✓ Tersalin!" : "📋 Salin Link"}
              </button>
            </div>

            {/* Redirect Button */}
            <div className="pt-2">
              <a
                href={order?.cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
              >
                💌 Buka Kartu Cinta Anda
              </a>
            </div>

            {/* QR Code Section */}
            {order?.qrPngUrl && (
              <div className="bg-white border border-rose-50 rounded-2xl p-6 shadow-sm flex flex-col items-center space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-700">Scan QR Code untuk Membuka</h3>
                <img
                  src={order.qrPngUrl}
                  alt="QR Code Link"
                  className="w-40 h-40 border border-gray-100 rounded-lg shadow-inner"
                />
                <div className="flex gap-3 text-xs font-semibold uppercase tracking-wider text-rose-500">
                  <a href={order.qrPngUrl} download={`qrcode-${orderId}.png`} className="hover:text-rose-700">
                    📥 Download PNG
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href={order.qrSvgUrl} download={`qrcode-${orderId}.svg`} className="hover:text-rose-700">
                    📥 Download SVG
                  </a>
                </div>
              </div>
            )}

            {/* Important Warning Note */}
            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-left flex gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Simpan Link ini!</h5>
                <p className="text-[11px] text-amber-700 leading-normal font-medium">
                  DearNote **tidak menyediakan pembuatan akun**, sehingga tidak ada opsi pemulihan. Simpan alamat link atau unduh QR Code di atas agar tidak kehilangan akses kartu Anda.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PENDING PAYMENT STATE */}
            <div className="space-y-4 py-8">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-rose-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-rose-500 text-white text-lg items-center justify-center animate-bounce">
                  💳
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-slate-800">Menunggu Pembayaran</h2>
                <p className="text-xs text-rose-500 font-semibold uppercase tracking-wider">Transaksi ID: {orderId}</p>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                Silakan selesaikan pembayaran Anda di jendela pembayaran. Halaman ini akan otomatis diperbarui begitu konfirmasi pembayaran sukses kami terima.
              </p>
            </div>
            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>
            )}
            <div className="pt-4 flex gap-4 text-xs font-semibold justify-center text-rose-500">
              <Link href="/" className="hover:text-rose-700">← Kembali ke Beranda</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
