import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBF9] via-[#F4F3EF] to-[#EAE8E2] text-zinc-800 flex flex-col font-sans">
      
      {/* Navbar / Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">📓</span>
          <span className="font-serif text-2xl font-bold tracking-tight text-zinc-800">DearNote</span>
        </div>
        <div>
          <Link
            href="/create"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold text-xs rounded-full shadow-md transition-all uppercase tracking-wider"
          >
            Mulai Buat
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center py-16 sm:py-24 z-10">
        
        {/* Tagline / Badge */}
        <span className="px-4 py-1.5 bg-zinc-200/50 border border-zinc-300/30 text-zinc-600 text-[10px] uppercase font-bold tracking-widest rounded-full mb-6 shadow-sm">
          No Login • No Setup Fee • Instan
        </span>

        {/* Hero Heading */}
        <h1 className="font-serif text-5xl sm:text-7xl font-semibold text-zinc-900 leading-tight max-w-4xl mb-6">
          Abadikan Momen dalam <span className="text-zinc-600 italic">Catatan Interaktif</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-zinc-500 text-base sm:text-lg font-medium max-w-2xl leading-relaxed mb-10">
          Buat kartu ucapan, catatan kenangan, dan jurnal beranimasi indah untuk setiap momen berharga. Unggah foto kenangan dan pesan suara pribadi, bayar sekali, lalu bagikan secara instan.
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <Link
            href="/create"
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-base rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
          >
            📝 Buat Catatan Sekarang
          </Link>
          <p className="text-[10px] text-zinc-405 font-bold uppercase tracking-widest mt-3">
            Hanya butuh waktu kurang dari 5 menit
          </p>
        </div>

        {/* How it works */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-left border-t border-zinc-300/30 pt-16 mb-20">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-200/60 text-zinc-700 text-lg flex items-center justify-center font-bold">1</div>
            <h3 className="font-serif text-lg font-bold text-zinc-800">Tulis & Unggah</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Pilih 1 dari 3 layout jurnal, tulis pesan Anda, lalu unggah hingga 5 foto kenangan dan pesan suara pribadi Anda.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-200/60 text-zinc-700 text-lg flex items-center justify-center font-bold">2</div>
            <h3 className="font-serif text-lg font-bold text-zinc-800">Bayar Sekali</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Pilih pembayaran instan QRIS/E-Wallet (hanya Rp3.000) atau Transfer Bank/Kartu (Rp8.000). Tanpa biaya tersembunyi.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-200/60 text-zinc-700 text-lg flex items-center justify-center font-bold">3</div>
            <h3 className="font-serif text-lg font-bold text-zinc-800">Bagikan Link</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Dapatkan alamat link unik dan QR Code secara instan. Penerima bisa langsung membukanya di ponsel mereka!</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="w-full max-w-3xl mx-auto space-y-6 mb-12">
          <h2 className="font-serif text-3xl font-bold text-zinc-800">Tarif Transparan & Sederhana</h2>
          <p className="text-xs text-zinc-400 font-semibold max-w-md mx-auto">Kami tidak menggunakan sistem langganan. Anda hanya membayar saat ingin menerbitkan catatan kenangan.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
            {/* QRIS / E-Wallet */}
            <div className="bg-white/70 border border-zinc-200 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Paling Populer</span>
                <h4 className="font-serif text-xl font-bold text-zinc-800 mt-1">QRIS / E-Wallet</h4>
                <p className="text-[11px] text-zinc-400 font-semibold mt-1 font-sans">Gopay, OVO, Dana, LinkAja, QRIS BCA/Mandiri/Shopee</p>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-800 font-serif">Rp3.000</span>
                <span className="text-xs text-zinc-400 font-bold uppercase">/ Catatan</span>
              </div>
            </div>

            {/* Virtual Account / Card */}
            <div className="bg-white/40 border border-zinc-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Transfer & Bank</span>
                <h4 className="font-serif text-xl font-bold text-zinc-800 mt-1">Transfer Bank / Kartu</h4>
                <p className="text-[11px] text-zinc-400 font-semibold mt-1 font-sans">Virtual Account Bank Transfer, Kartu Debit & Kredit</p>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-800 font-serif">Rp8.000</span>
                <span className="text-xs text-zinc-400 font-bold uppercase">/ Catatan</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/30 py-8 text-center text-xs text-zinc-400 font-semibold uppercase tracking-wider">
        <p>© {new Date().getFullYear()} DearNote. Semua hak cipta dilindungi.</p>
        <p className="text-[9px] text-zinc-400/80 mt-1">Setiap catatan aktif selama 180 hari sejak diterbitkan.</p>
      </footer>

    </div>
  );
}
