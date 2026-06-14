"use client";

import { useState } from "react";
import Link from "next/link";
import TemplatePreview from "@/components/landing/TemplatePreview";

type TemplateKey = "pooh" | "graduation" | "birthday" | "blooming" | "pinkbook";

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("graduation");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBF9] via-[#F4F3EF] to-[#EAE8E2] text-zinc-800 flex flex-col font-sans overflow-x-hidden selection:bg-zinc-200">
      
      {/* Navbar / Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center group">
          <img
            src="/dearnote_logo.png"
            alt="DearNote Logo"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
        <div>
          <Link
            href="/create"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-950 text-white font-semibold text-xs rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest cursor-pointer"
          >
            Mulai Buat
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center py-12 sm:py-20 z-10 relative">
        
        {/* Floating Background Ornaments */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-zinc-300/30 rounded-3xl rotate-12 pointer-events-none animate-float opacity-40 hidden md:block" />
        <div className="absolute top-40 right-20 w-16 h-16 border-2 border-dashed border-zinc-300/20 rounded-full pointer-events-none animate-float-delayed opacity-30 hidden md:block" />
        <div className="absolute bottom-20 left-20 w-20 h-20 border border-dashed border-zinc-300/30 rounded-xl -rotate-12 pointer-events-none animate-float-delayed opacity-30 hidden md:block" />

        {/* Tagline / Badge */}
        <span className="px-4 py-2 bg-white/70 border border-zinc-200 text-zinc-650 text-[10px] uppercase font-bold tracking-widest rounded-full mb-6 shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          No Login • Tanpa Registrasi • Diterbitkan Instan
        </span>

        {/* Hero Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-zinc-900 leading-tight max-w-4xl mb-6 tracking-tight">
          Jurnal Kenangan Digital untuk Setiap <span className="text-zinc-650 italic font-medium font-serif">Momen Berharga</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-zinc-500 text-sm sm:text-base md:text-lg font-medium max-w-3xl leading-relaxed mb-10">
          Bukan sekadar pesan teks biasa. Rangkai ucapan digital beranimasi indah lengkap dengan kompilasi foto kenangan terindah dan rekaman suara hangat Anda. Kirim instan lewat link rahasia atau cetak sebagai QR Code custom.
        </p>

        {/* CTA Button */}
        <div className="mb-20">
          <Link
            href="/create"
            className="px-8 py-4 bg-zinc-900 hover:bg-zinc-950 text-white font-bold text-base rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 inline-flex items-center gap-2 group cursor-pointer"
          >
            📝 Buat Catatan Kenangan Sekarang
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-3">
            Hanya Rp5.000 per catatan • Selesai dalam 5 menit
          </p>
        </div>

        {/* Interactive Preview Section */}
        <div className="w-full max-w-5xl mx-auto space-y-10 py-12 border-t border-zinc-250/30">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-800">Pratinjau Jurnal Interaktif</h2>
            <p className="text-xs text-zinc-500 font-medium max-w-md mx-auto">
              Klik tab di bawah untuk melihat simulasi tampilan template di layar handphone penerima.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">

            {/* Tabs (Left on desktop) */}
            <div className="flex md:flex-col gap-3 w-full md:w-64 justify-center">
              {[
                { id: "pooh", label: "Playful Pooh", desc: "Beruang Pooh yang lucu tidur nyenyak dengan pot madu, nuansa hangat kuning keemasan, dan interaksi yang menggemaskan." },
                { id: "graduation", label: "Graduation Note", desc: "Diploma elegan dengan wax seal emas, kanvas krem premium, font serif mewah, dan animasi confetti merayakan kelulusan." },
                { id: "birthday", label: "Birthday Magic", desc: "Kue ulang tahun interaktif dengan lilin yang bisa ditiup, balon mengapung, dan pesta kembang api penuh warna." },
                { id: "blooming", label: "Blooming Flower", desc: "Amplop dengan wax seal yang mekar menjadi taman bunga indah, nuansa pastel lembut, dan animasi bunga tumbuh." },
                { id: "pinkbook", label: "Pink Book Folds", desc: "Buku scrapbook 3D dengan halaman yang bisa dibalik, polaroid yang bisa di-drag, dan nuansa pink yang hangat." }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTemplate(tab.id as TemplateKey)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col gap-1.5 w-full ${
                    activeTemplate === tab.id
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-md transform md:translate-x-2"
                      : "bg-white/60 hover:bg-white text-zinc-650 border-zinc-200/60"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold block">{tab.label}</span>
                  <span className={`text-[10px] leading-relaxed hidden md:block ${activeTemplate === tab.id ? "text-zinc-300" : "text-zinc-400"}`}>
                    {tab.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Template Preview Component */}
            <div className="relative animate-float">
              <TemplatePreview activeTemplate={activeTemplate} />
            </div>

          </div>
        </div>

        {/* Occasions Gallery */}
        <div className="w-full max-w-5xl mx-auto space-y-8 py-16 border-t border-zinc-250/30">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-800">Satu Link untuk Berbagai Cerita</h2>
            <p className="text-xs text-zinc-500 font-medium max-w-md mx-auto">
              DearNote didesain netral dan elegan untuk merayakan segala jenis hubungan dan momen berharga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {[
              { title: "🎓 Hadiah Kelulusan", desc: "Ucapkan selamat wisuda untuk sahabat dengan kompilasi foto perjuangan kuliah dan suara banggamu." },
              { title: "🎂 Ulang Tahun", desc: "Kejutan manis berisi tumpukan foto kenangan konyol masa lalu dan ucapan tulus di hari spesialnya." },
              { title: "💌 Hari Jadi (Anniversary)", desc: "Kirim surat rahasia berpenampilan mewah lengkap dengan digital wax seal sebagai kado romantis." },
              { title: "✉️ Pesan Rahasia", desc: "Amankan pesan emosional Anda menggunakan fitur kunci sandi passcode unik yang hanya Anda berdua ketahui." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/50 border border-zinc-200/60 hover:border-zinc-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-serif text-base font-bold text-zinc-850">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="w-full max-w-5xl mx-auto space-y-12 py-16 border-t border-zinc-250/30">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-800">Cara Kerja Sederhana</h2>
            <p className="text-xs text-zinc-500 font-medium max-w-md mx-auto">
              Tidak membutuhkan pendaftaran akun yang rumit. Proses instan selesai dalam 3 langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="bg-white/40 border border-zinc-200/50 p-6 rounded-2xl space-y-3 flex flex-col">
              <div className="w-9 h-9 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center font-bold">1</div>
              <h3 className="font-serif text-lg font-bold text-zinc-800">Tulis Cerita Anda</h3>
              <p className="text-xs text-zinc-550 leading-relaxed font-medium">Pilih layout tema, tuliskan isi pesan Anda dengan leluasa. Pasang pengaman password opsional untuk privasi total.</p>
            </div>
            <div className="bg-white/40 border border-zinc-200/50 p-6 rounded-2xl space-y-3 flex flex-col">
              <div className="w-9 h-9 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center font-bold">2</div>
              <h3 className="font-serif text-lg font-bold text-zinc-800">Sematkan Foto & Suara</h3>
              <p className="text-xs text-zinc-550 leading-relaxed font-medium">Unggah hingga 5 foto memori beresolusi tinggi, lalu rekam pesan suara hangat berdurasi maksimal 60 detik langsung dari browser.</p>
            </div>
            <div className="bg-white/40 border border-zinc-200/50 p-6 rounded-2xl space-y-3 flex flex-col">
              <div className="w-9 h-9 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center font-bold">3</div>
              <h3 className="font-serif text-lg font-bold text-zinc-800">Terbitkan & Bagikan</h3>
              <p className="text-xs text-zinc-550 leading-relaxed font-medium">Selesaikan pembayaran QRIS Rp5.000. Dapatkan link unik serta unduh QR Code berbentuk hati untuk dilampirkan pada kado fisik.</p>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-3xl mx-auto space-y-8 py-16 border-t border-zinc-250/30 mb-8">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-800">Tarif Transparan, Sekali Bayar</h2>
            <p className="text-xs text-zinc-500 font-medium max-w-md mx-auto">
              Tidak ada tagihan bulanan atau sistem langganan. Anda hanya membayar ketika ingin menerbitkan kenangan.
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* QRIS / E-Wallet */}
            <div className="bg-white border-2 border-zinc-900 rounded-3xl p-8 shadow-xl flex flex-col justify-between w-full max-w-sm text-left transform transition-transform hover:scale-[1.01]">
              <div className="space-y-3">
                <span className="text-[10px] bg-zinc-900 text-white px-3 py-1 font-bold rounded-full uppercase tracking-wider inline-block">Akses Penuh</span>
                <h4 className="font-serif text-2xl font-bold text-zinc-800">QRIS / E-Wallet</h4>
                <p className="text-xs text-zinc-500 leading-normal font-medium">Mendukung Gopay, OVO, ShopeePay, Dana, LinkAja, serta semua QRIS BCA/Mandiri/BRI/dll.</p>
                
                <ul className="space-y-2 pt-4 border-t border-zinc-100 text-xs font-medium text-zinc-600">
                  <li className="flex items-center gap-2">✓ Aktif online selama 90 hari</li>
                  <li className="flex items-center gap-2">✓ Bebas iklan & spam pihak ketiga</li>
                  <li className="flex items-center gap-2">✓ Unggah hingga 5 foto berkualitas tinggi</li>
                  <li className="flex items-center gap-2">✓ Rekam pesan suara personal</li>
                  <li className="flex items-center gap-2">✓ Modifikasi QR Code bentuk Hati</li>
                </ul>
              </div>
              
              <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-zinc-900 font-serif">Rp5.000</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sekali Terbit</span>
                </div>
                <Link
                  href="/create"
                  className="px-5 py-3 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider"
                >
                  Buat Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl mx-auto space-y-8 py-16 border-t border-zinc-250/30">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-800">Tanya & Jawab</h2>
            <p className="text-xs text-zinc-500 font-medium max-w-md mx-auto">
              Beberapa pertanyaan yang sering ditanyakan mengenai DearNote.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {[
              {
                q: "Bagaimana cara penerima membuka catatan kenangan ini?",
                a: "Penerima tidak perlu menginstal aplikasi apa pun. Mereka cukup membuka link unik yang Anda kirimkan, atau memindai QR Code custom yang Anda tempel di kado fisik melalui kamera ponsel mereka. Jurnal akan terbuka secara instan di browser mobile."
              },
              {
                q: "Bagaimana cara menjaga kerahasiaan isi pesan?",
                a: "Saat membuat jurnal di formulir, Anda dapat mencentang opsi 'Kunci Catatan'. Anda akan diminta membuat password sederhana. Ketika penerima membuka link jurnal tersebut, mereka harus memasukkan password tersebut terlebih dahulu sebelum isi surat, foto, dan pesan suara ditampilkan."
              },
              {
                q: "Berapa lama catatan ini akan tetap aktif online?",
                a: "Setiap catatan yang berhasil Anda terbitkan akan aktif online selama 90 hari (3 bulan). Kami akan menyimpan foto, pesan tertulis, dan pesan suara Anda dengan aman tanpa iklan selama periode tersebut. Akses akan otomatis kedaluwarsa setelahnya demi privasi data."
              },
              {
                q: "Apakah saya bisa mengubah isi jurnal setelah diterbitkan?",
                a: "Demi menjaga keaslian jurnal (seperti layaknya surat fisik yang sudah dikirim), jurnal yang sudah diterbitkan tidak dapat diubah kembali. Kami menyarankan Anda untuk meninjau pratinjau live secara teliti sebelum menekan tombol pembayaran."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/50 border border-zinc-200/60 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-zinc-850 font-bold text-xs sm:text-sm text-left cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-lg transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-550 leading-relaxed font-medium border-t border-zinc-100 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/30 py-8 text-center text-xs text-zinc-400 font-semibold uppercase tracking-wider space-y-1">
        <p>© {new Date().getFullYear()} DearNote. Semua hak cipta dilindungi.</p>
        <p className="text-[9px] text-zinc-400/80 normal-case">Dibuat dengan cinta untuk mengabadikan momen berharga Anda secara digital.</p>
      </footer>

    </div>
  );
}
