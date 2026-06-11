import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5ec] via-[#f5ebe0] to-[#e3d5ca] text-gray-800 flex flex-col font-sans">
      
      {/* Navbar / Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💝</span>
          <span className="font-serif text-2xl font-bold tracking-tight text-rose-600">DearNote</span>
        </div>
        <div>
          <Link
            href="/create"
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-full shadow-md transition-all uppercase tracking-wider"
          >
            Mulai Buat
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center py-16 sm:py-24 z-10">
        
        {/* Tagline / Badge */}
        <span className="px-4 py-1.5 bg-rose-100/60 border border-rose-200/50 text-rose-600 text-[10px] uppercase font-bold tracking-widest rounded-full mb-6 shadow-sm">
          No Login • No Setup Fee • Instan
        </span>

        {/* Hero Heading */}
        <h1 className="font-serif text-5xl sm:text-7xl font-bold text-slate-800 leading-tight max-w-4xl mb-6">
          Kirim Surat Cinta Digital yang <span className="text-rose-500 italic">Interaktif</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-600 text-base sm:text-xl font-medium max-w-2xl leading-relaxed mb-10">
          Buat kartu ucapan dan pesan romantis beranimasi indah untuk pasangan Anda. Unggah kenangan foto dan rekaman suara khusus, bayar sekali, lalu bagikan link/QR secara instan.
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <Link
            href="/create"
            className="px-8 py-4.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-base rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
          >
            💌 Buat Surat Sekarang
          </Link>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-3">
            Hanya butuh waktu kurang dari 5 menit
          </p>
        </div>

        {/* How it works */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-left border-t border-slate-300/30 pt-16 mb-20">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 text-lg flex items-center justify-center font-bold">1</div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Tulis & Unggah</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Pilih 1 dari 3 tema desain, tulis pesan Anda, lalu unggah hingga 5 foto kenangan dan pesan suara pribadi Anda.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 text-lg flex items-center justify-center font-bold">2</div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Bayar Sekali</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Pilih pembayaran instan QRIS/E-Wallet (hanya Rp3.000) atau Transfer Bank/Kartu (Rp8.000). Tanpa biaya tambahan.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 text-lg flex items-center justify-center font-bold">3</div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Bagikan Link</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Dapatkan alamat link publik unik dan QR Code secara instan. Pasangan Anda bisa langsung membukanya di HP mereka!</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="w-full max-w-3xl mx-auto space-y-6 mb-12">
          <h2 className="font-serif text-3xl font-bold text-slate-800">Tarif Transparan & Murah</h2>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">Kami tidak menggunakan sistem langganan. Anda hanya membayar saat ingin menerbitkan kartu cinta.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
            {/* QRIS / E-Wallet */}
            <div className="bg-white/80 border border-rose-100 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Paling Populer</span>
                <h4 className="font-serif text-xl font-bold text-slate-800 mt-1">QRIS / E-Wallet</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-1">Gopay, OVO, Dana, LinkAja, QRIS BCA/Mandiri/Shopee</p>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">Rp3.000</span>
                <span className="text-xs text-gray-400 font-semibold">/ kartu</span>
              </div>
            </div>

            {/* Virtual Account / Card */}
            <div className="bg-white/50 border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transfer & Bank</span>
                <h4 className="font-serif text-xl font-bold text-slate-800 mt-1">Transfer Bank / Kartu</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-1">Virtual Account Bank Transfer, Kartu Debit & Kredit</p>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">Rp8.000</span>
                <span className="text-xs text-gray-400 font-semibold">/ kartu</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-300/20 py-8 text-center text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} DearNote. Semua hak cipta dilindungi.</p>
        <p className="text-[10px] text-slate-400 mt-1">Setiap kartu aktif selama 180 hari sejak diterbitkan.</p>
      </footer>

    </div>
  );
}
