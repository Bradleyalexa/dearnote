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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">

      {/* Navbar / Header */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/dearnote_logo.png"
              alt="DearNote Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <Link
            href="/create"
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            Mulai Buat
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            No Login • Tanpa Registrasi • Diterbitkan Instan
          </div>

          {/* Hero Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto mb-6">
            Jurnal Kenangan Digital untuk Setiap <span className="text-gray-600">Momen Berharga</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Bukan sekadar pesan teks biasa. Rangkai ucapan digital beranimasi indah lengkap dengan kompilasi foto kenangan terindah dan rekaman suara hangat Anda.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              Buat Catatan Kenangan Sekarang
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-xs text-gray-500 font-medium mt-4">
              Hanya Rp5.000 per catatan • Selesai dalam 5 menit
            </p>
          </div>
        </section>

        {/* Interactive Preview Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pratinjau Jurnal Interaktif</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Klik tab di bawah untuk melihat simulasi tampilan template di layar handphone penerima.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

              {/* Tabs */}
              <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-72 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                {[
                  { id: "pooh", label: "Playful Pooh", desc: "Beruang Pooh yang lucu tidur nyenyak dengan pot madu, nuansa hangat kuning keemasan." },
                  { id: "graduation", label: "Graduation Note", desc: "Diploma elegan dengan wax seal emas, kanvas krem premium, font serif mewah." },
                  { id: "birthday", label: "Birthday Magic", desc: "Kue ulang tahun interaktif dengan lilin yang bisa ditiup, balon mengapung." },
                  { id: "blooming", label: "Blooming Flower", desc: "Amplop dengan wax seal yang mekar menjadi taman bunga indah." },
                  { id: "pinkbook", label: "Pink Book Folds", desc: "Buku scrapbook 3D dengan halaman yang bisa dibalik, polaroid yang bisa di-drag." }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTemplate(tab.id as TemplateKey)}
                    className={`flex-shrink-0 lg:flex-shrink p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      activeTemplate === tab.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-md"
                        : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-semibold block mb-1">{tab.label}</span>
                    <span className={`text-xs leading-relaxed hidden lg:block ${activeTemplate === tab.id ? "text-gray-300" : "text-gray-500"}`}>
                      {tab.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Template Preview */}
              <div className="flex-1 flex justify-center">
                <TemplatePreview activeTemplate={activeTemplate} />
              </div>

            </div>
          </div>
        </section>

        {/* Occasions Gallery */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Satu Link untuk Berbagai Cerita</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                DearNote didesain netral dan elegan untuk merayakan segala jenis hubungan dan momen berharga Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🎓", title: "Hadiah Kelulusan", desc: "Ucapkan selamat wisuda untuk sahabat dengan kompilasi foto perjuangan kuliah." },
                { icon: "🎂", title: "Ulang Tahun", desc: "Kejutan manis berisi tumpukan foto kenangan konyol masa lalu." },
                { icon: "💌", title: "Hari Jadi", desc: "Kirim surat rahasia berpenampilan mewah lengkap dengan digital wax seal." },
                { icon: "✉️", title: "Pesan Rahasia", desc: "Amankan pesan emosional menggunakan fitur kunci sandi passcode unik." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Cara Kerja Sederhana</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tidak membutuhkan pendaftaran akun yang rumit. Proses instan selesai dalam 3 langkah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "1", title: "Tulis Cerita Anda", desc: "Pilih layout tema, tuliskan isi pesan Anda dengan leluasa. Pasang pengaman password opsional." },
                { num: "2", title: "Sematkan Foto & Suara", desc: "Unggah hingga 5 foto memori beresolusi tinggi, lalu rekam pesan suara hangat maksimal 60 detik." },
                { num: "3", title: "Terbitkan & Bagikan", desc: "Selesaikan pembayaran QRIS Rp5.000. Dapatkan link unik serta unduh QR Code berbentuk hati." }
              ].map((step, idx) => (
                <div key={idx} className="bg-white border border-gray-200 p-8 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white text-lg flex items-center justify-center font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tarif Transparan, Sekali Bayar</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tidak ada tagihan bulanan atau sistem langganan. Anda hanya membayar ketika ingin menerbitkan kenangan.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-900 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs bg-gray-900 text-white px-3 py-1 font-semibold rounded-full uppercase">Akses Penuh</span>
                  <h4 className="font-serif text-2xl font-bold text-gray-900 mt-3">QRIS / E-Wallet</h4>
                  <p className="text-sm text-gray-600 mt-1">Mendukung Gopay, OVO, ShopeePay, Dana, LinkAja, serta semua QRIS BCA/Mandiri/BRI.</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8 border-t border-gray-100 pt-6">
                {[
                  "Aktif online selama 90 hari",
                  "Bebas iklan & spam pihak ketiga",
                  "Unggah hingga 5 foto berkualitas tinggi",
                  "Rekam pesan suara personal",
                  "Modifikasi QR Code bentuk Hati"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  <span className="text-4xl font-bold text-gray-900 font-serif">Rp5.000</span>
                  <span className="text-xs text-gray-500 block mt-1">Sekali Terbit</span>
                </div>
                <Link
                  href="/create"
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Buat Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tanya & Jawab</h2>
              <p className="text-gray-600">
                Beberapa pertanyaan yang sering ditanyakan mengenai DearNote.
              </p>
            </div>

            <div className="space-y-4">
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
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 flex items-center justify-between text-gray-900 font-semibold text-left cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DearNote. Semua hak cipta dilindungi.</p>
        <p className="text-xs text-gray-400 mt-2">Dibuat dengan cinta untuk mengabadikan momen berharga Anda secara digital.</p>
      </footer>

    </div>
  );
}
