"use client";

import { use, useEffect, useState } from "react";
import QrCodeCustomizer from "@/components/ui/QrCodeCustomizer";

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
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    // Check if simulate query parameter is present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const isSimulated = urlParams.get("simulate") === "true";

    let attempts = 0;
    const maxAttempts = 40; // Poll for 2 minutes max

    const pollStatus = async () => {
      try {
        // In simulate mode, use the dedicated simulate route (no secret needed from browser)
        const url = isSimulated
          ? `/api/simulate/${orderId}`
          : `/api/orders/${orderId}`;
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full rounded-2xl p-10 border border-gray-200 bg-white shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Memuat Pesanan</h2>
          <p className="text-sm text-gray-600">Sedang memverifikasi data transaksi Anda...</p>
        </div>
      </div>
    );
  }

  const isPublished = order?.status === "published";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-gray-900">
      <div className="max-w-2xl w-full rounded-2xl p-8 sm:p-12 border border-gray-200 bg-white shadow-lg text-center space-y-8">

        {isPublished ? (
          <>
            {/* PUBLISHED STATE */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-2">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Catatan Anda Telah Aktif!</h1>
              <p className="text-sm text-gray-600">Jurnal kenangan interaktif Anda telah berhasil terbit</p>
            </div>

            {/* Card Link Display Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="overflow-hidden w-full text-left">
                <span className="text-xs font-semibold text-gray-500 block mb-1">Link Publik Catatan</span>
                <span className="text-sm font-medium text-gray-900 block truncate">{order?.cardUrl}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tersalin!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Salin Link
                  </>
                )}
              </button>
            </div>

            {/* Redirect Button */}
            <div>
              <a
                href={order?.cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Buka Catatan Kenangan Anda
              </a>
            </div>

            {/* QR Code Section */}
            {order?.qrPngUrl && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-900">Scan QR Code untuk Membuka</h3>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <img
                    src={order.qrPngUrl}
                    alt="QR Code Link"
                    className="w-48 h-48"
                  />
                </div>
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Modifikasi & Unduh QR
                </button>
              </div>
            )}

            {/* Important Warning Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-amber-900 mb-2">Simpan Link ini!</h5>
                <p className="text-sm text-amber-800 leading-relaxed">
                  DearNote <strong>tidak menyediakan pembuatan akun</strong>, sehingga tidak ada opsi pemulihan. Simpan alamat link atau unduh QR Code di atas agar tidak kehilangan akses catatan Anda.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PENDING PAYMENT STATE */}
            <div className="space-y-6 py-8">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-blue-100 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-16 w-16 bg-blue-500 text-white items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold text-gray-900">Menunggu Pembayaran</h2>
                <p className="text-xs text-gray-500 font-medium">Transaksi ID: {orderId}</p>
              </div>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Mohon menunggu... Halaman ini akan otomatis diperbarui begitu konfirmasi pembayaran sukses kami terima.
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}
          </>
        )}

      </div>

      {showCustomizer && order?.cardUrl && (
        <QrCodeCustomizer
          cardUrl={order.cardUrl}
          orderId={orderId}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
