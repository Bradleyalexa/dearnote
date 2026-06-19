"use client";

import { useState } from "react";
import Link from "next/link";
import TemplatePreview from "@/components/landing/TemplatePreview";

type TemplateKey = "pooh" | "graduation" | "birthday" | "blooming" | "pinkbook";

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("graduation");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<"terms" | "refund" | "privacy" | null>(null);

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

            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">

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
              <div className="flex-1 w-full flex justify-center">
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
        <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
          <button
            onClick={() => setActiveModal("terms")}
            className="hover:text-gray-900 transition-colors cursor-pointer underline decoration-dotted"
          >
            Syarat & Ketentuan
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal("refund")}
            className="hover:text-gray-900 transition-colors cursor-pointer underline decoration-dotted"
          >
            Kebijakan Refund
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal("privacy")}
            className="hover:text-gray-900 transition-colors cursor-pointer underline decoration-dotted"
          >
            Kebijakan Privasi
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>Jakarta Barat, Indonesia</p>
          <p>Kontak: <a href="mailto:hidearnote@gmail.com" className="hover:text-gray-600 underline">hidearnote@gmail.com</a></p>
        </div>
        <p className="text-xs text-gray-400 mt-4">Dibuat dengan cinta untuk mengabadikan momen berharga Anda secara digital.</p>
      </footer>

      {/* Modal Container */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col z-10 border border-gray-150 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                {activeModal === "terms" ? "Syarat & Ketentuan" : activeModal === "refund" ? "Kebijakan Pengembalian Dana" : "Kebijakan Privasi"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                aria-label="Tutup modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-4 text-left">
              {activeModal === "terms" ? (
                <>
                  <p>
                    Selamat datang di <strong>DearNote</strong> (“DearNote”, “kami”, “layanan kami”). Dengan mengakses atau menggunakan situs <strong>dearnote.asia</strong>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini.
                  </p>
                  <p>
                    Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, mohon untuk tidak menggunakan layanan DearNote.
                  </p>
                  
                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">1. Tentang DearNote</h4>
                  <p>
                    DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif berbasis web. Pengguna dapat memilih template, mengisi teks, mengunggah foto, dan/atau rekaman suara, melakukan pembayaran, lalu sistem akan menerbitkan halaman digital statis yang dapat dibuka melalui tautan unik dan/atau QR Code.
                  </p>
                  <p>
                    Layanan DearNote saat ini ditujukan untuk pengguna di wilayah Indonesia.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">2. Layanan Tanpa Akun</h4>
                  <p>
                    DearNote dirancang sebagai layanan tanpa akun untuk mempermudah proses pembuatan kartu digital. Oleh karena itu:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Pengguna tidak diwajibkan membuat akun, memasukkan email, atau membuat kata sandi untuk menggunakan layanan.</li>
                    <li>Setelah kartu diterbitkan, pengguna bertanggung jawab untuk menyimpan tautan unik, QR Code, Order ID, dan/atau bukti pembayaran yang berkaitan dengan transaksi.</li>
                    <li>Karena DearNote tidak menyediakan dashboard pengguna, kehilangan tautan, QR Code, atau informasi pesanan bukan merupakan tanggung jawab DearNote.</li>
                    <li>DearNote tidak dapat menjamin bahwa pesanan yang tautannya hilang dapat ditemukan kembali, terutama apabila pengguna tidak menyimpan Order ID atau bukti pembayaran.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">3. Pembuatan dan Penerbitan Kartu</h4>
                  <p>
                    Untuk membuat kartu digital, pengguna dapat diminta untuk:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Memilih template yang tersedia;</li>
                    <li>Mengisi teks, nama, pesan, atau informasi lain yang diperlukan;</li>
                    <li>Mengunggah foto dengan batas maksimal yang ditentukan pada halaman pembuatan;</li>
                    <li>Mengunggah rekaman suara dengan batas durasi maksimal yang ditentukan pada halaman pembuatan;</li>
                    <li>Meninjau hasil melalui fitur pratinjau;</li>
                    <li>Melakukan pembayaran sesuai harga template yang dipilih.</li>
                  </ol>
                  <p>
                    Setelah pembayaran berhasil dikonfirmasi oleh sistem, DearNote akan menerbitkan kartu digital dalam bentuk halaman web statis yang dapat diakses melalui tautan unik.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">4. Harga dan Pembayaran</h4>
                  <p>
                    DearNote menggunakan sistem pembayaran sekali bayar untuk setiap template atau kartu digital yang dibuat. Harga dapat berbeda untuk setiap template, paket, atau fitur yang tersedia.
                  </p>
                  <p>
                    Pembayaran diproses melalui penyedia pembayaran pihak ketiga. DearNote tidak menyimpan informasi kartu kredit, rekening bank, PIN, kode OTP, atau kredensial pembayaran pengguna.
                  </p>
                  <p>
                    Dengan melakukan pembayaran, pengguna menyatakan bahwa informasi pembayaran yang digunakan adalah sah dan pengguna memiliki hak untuk menggunakan metode pembayaran tersebut.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">5. Ketentuan Konten dan Hak Unggah</h4>
                  <p>
                    Pengguna bertanggung jawab penuh atas seluruh konten yang diunggah, diketik, dikirimkan, atau digunakan dalam kartu digital DearNote, termasuk tetapi tidak terbatas pada teks, foto, suara, nama, pesan, dan informasi lain.
                  </p>
                  <p>
                    Dengan menggunakan layanan DearNote, pengguna menyatakan dan menjamin bahwa:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Pengguna memiliki hak, izin, atau lisensi yang sah atas seluruh konten yang diunggah;</li>
                    <li>Konten tidak melanggar hak cipta, hak merek, hak privasi, hak publisitas, atau hak pihak ketiga lainnya;</li>
                    <li>Konten tidak melanggar hukum yang berlaku di Republik Indonesia;</li>
                    <li>Konten tidak mengandung materi yang dilarang berdasarkan Syarat & Ketentuan ini.</li>
                  </ol>
                  <p>
                    Pengguna dilarang mengunggah, membuat, atau menyebarkan konten yang:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Mengandung pornografi, ketelanjangan eksplisit, atau konten seksual;</li>
                    <li>Mengandung eksploitasi seksual, terutama yang melibatkan anak atau pihak yang tidak memberikan persetujuan;</li>
                    <li>Mengandung pelecehan, ancaman, intimidasi, doxing, atau serangan terhadap individu atau kelompok;</li>
                    <li>Mengandung ujaran kebencian, diskriminasi, atau penghinaan berdasarkan suku, agama, ras, antargolongan, gender, disabilitas, orientasi seksual, kewarganegaraan, atau identitas lainnya;</li>
                    <li>Mengandung kekerasan ekstrem, ajakan menyakiti diri sendiri, atau ajakan menyakiti orang lain;</li>
                    <li>Mengandung informasi rahasia milik pihak lain tanpa izin;</li>
                    <li>Mengandung materi berhak cipta yang digunakan tanpa izin;</li>
                    <li>Melanggar hukum, norma, atau ketentuan lain yang berlaku di Indonesia.</li>
                  </ol>
                  <p>
                    DearNote berhak menolak, membatasi akses, menonaktifkan, atau menghapus kartu digital yang dilaporkan atau ditemukan melanggar ketentuan ini, tanpa pemberitahuan sebelumnya dan tanpa kewajiban memberikan pengembalian dana.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">6. Sifat Publik Tautan dan Kode Akses</h4>
                  <p>
                    Setiap kartu digital DearNote diterbitkan melalui tautan unik yang dapat dibagikan kepada penerima. Tautan tersebut dirancang agar mudah dibuka melalui browser dan QR Code.
                  </p>
                  <p>
                    Perlu dipahami bahwa kartu digital DearNote bersifat berbasis tautan. Artinya, siapa pun yang memiliki tautan atau QR Code kartu dapat membuka halaman tersebut, kecuali terdapat pembatasan tampilan tertentu seperti kode akses.
                  </p>
                  <p>
                    Fitur kode akses atau passcode disediakan sebagai bagian dari pengalaman kejutan dan interaksi pengguna. Fitur ini membantu menciptakan pengalaman membuka kartu yang lebih personal, tetapi tidak dimaksudkan sebagai sistem keamanan tingkat tinggi atau enkripsi penuh.
                  </p>
                  <p>
                    Karena itu, pengguna disarankan untuk tidak mengunggah informasi yang sangat rahasia atau sensitif, termasuk tetapi tidak terbatas pada:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Nomor identitas pribadi;</li>
                    <li>Informasi finansial atau perbankan;</li>
                    <li>Kata sandi, PIN, OTP, atau kredensial akun;</li>
                    <li>Dokumen hukum atau data pribadi yang sangat sensitif;</li>
                    <li>Informasi medis atau informasi pribadi yang tidak ingin diketahui orang lain.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">7. Masa Aktif dan Penghapusan Otomatis</h4>
                  <p>
                    Setiap kartu digital yang berhasil diterbitkan memiliki masa aktif online selama <strong>90 hari kalender</strong> sejak tanggal pembayaran berhasil.
                  </p>
                  <p>
                    Setelah masa aktif berakhir, kartu digital akan dianggap kedaluwarsa dan seluruh berkas terkait, termasuk halaman kartu, foto, dan rekaman suara, dapat dihapus secara otomatis dan permanen dari sistem penyimpanan DearNote.
                  </p>
                  <p>
                    Data yang telah dihapus karena kedaluwarsa tidak dapat dipulihkan kembali. DearNote tidak memberikan pengembalian dana, kompensasi, atau penggantian atas kartu yang telah melewati masa aktif 90 hari.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">8. Tidak Ada Fitur Edit Setelah Terbit</h4>
                  <p>
                    DearNote dirancang menyerupai pengalaman mengirim kartu atau surat fisik. Oleh karena itu, kartu digital yang telah berhasil diterbitkan tidak dapat diedit kembali.
                  </p>
                  <p>
                    Pengguna bertanggung jawab untuk memeriksa seluruh isi kartu melalui fitur pratinjau sebelum melakukan pembayaran. Kesalahan pengetikan, kesalahan pemilihan foto, kesalahan rekaman suara, kesalahan nama, atau kesalahan pemilihan template setelah kartu diterbitkan bukan merupakan tanggung jawab DearNote.
                  </p>
                  <p>
                    Jika pengguna ingin melakukan perubahan setelah kartu diterbitkan, pengguna perlu membuat kartu baru dan melakukan pembayaran baru.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">9. Bantuan Teknis</h4>
                  <p>
                    Apabila pengguna mengalami kendala teknis, pengguna dapat menghubungi DearNote melalui email: <strong>hidearnote@gmail.com</strong>
                  </p>
                  <p>
                    Untuk mempercepat proses bantuan, pengguna disarankan menyertakan:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Order ID;</li>
                    <li>Bukti pembayaran;</li>
                    <li>Waktu transaksi;</li>
                    <li>Tautan kartu, apabila tersedia;</li>
                    <li>Penjelasan singkat mengenai kendala yang dialami.</li>
                  </ol>
                  <p>
                    DearNote akan berupaya membantu kendala teknis yang wajar, termasuk melakukan pemeriksaan atau penerbitan ulang kartu apabila pembayaran telah berhasil tetapi kartu gagal diterbitkan karena kesalahan sistem DearNote.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">10. Ketersediaan Layanan</h4>
                  <p>
                    DearNote disediakan atas dasar “sebagaimana adanya” dan “sebagaimana tersedia”. Kami berupaya menjaga layanan tetap berjalan dengan baik, tetapi tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan, kesalahan, keterlambatan, kehilangan data, atau kendala teknis lainnya.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">11. Batasan Tanggung Jawab</h4>
                  <p>
                    Sepanjang diperbolehkan oleh hukum yang berlaku, DearNote tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Kesalahan pengguna dalam mengisi atau mengunggah konten;</li>
                    <li>Kehilangan tautan, QR Code, Order ID, atau bukti pembayaran;</li>
                    <li>Penyebaran tautan kartu oleh pengguna atau pihak lain;</li>
                    <li>Penggunaan konten yang melanggar hak pihak ketiga;</li>
                    <li>Gangguan layanan pihak ketiga, termasuk penyedia pembayaran, hosting, penyimpanan cloud, browser, atau jaringan internet;</li>
                    <li>Kerugian emosional, reputasi, finansial, atau konsekuensi lain akibat penggunaan atau ketidakmampuan menggunakan layanan DearNote.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">12. Hak DearNote</h4>
                  <p>
                    DearNote berhak untuk:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Mengubah, menambah, atau menghapus fitur layanan;</li>
                    <li>Mengubah harga, template, atau ketentuan layanan;</li>
                    <li>Menolak atau menghapus konten yang melanggar ketentuan;</li>
                    <li>Pembatasan akses terhadap kartu yang disalahgunakan;</li>
                    <li>Memperbarui Syarat & Ketentuan ini dari waktu ke waktu.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">13. Hukum yang Berlaku</h4>
                  <p>
                    Syarat & Ketentuan ini diatur berdasarkan hukum yang berlaku di Republik Indonesia.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">14. Kontak</h4>
                  <p>
                    Untuk pertanyaan, bantuan, atau laporan terkait layanan DearNote, silakan hubungi email: <strong>hidearnote@gmail.com</strong>
                  </p>
                </>
              ) : activeModal === "refund" ? (
                <>
                  <p>
                    Kebijakan ini menjelaskan ketentuan pengembalian dana dan bantuan teknis untuk layanan DearNote.
                  </p>
                  <p>
                    DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif sekali bayar. Setelah pembayaran berhasil dikonfirmasi, sistem akan memproses dan menerbitkan kartu digital secara otomatis dalam bentuk halaman web statis.
                  </p>
                  <p>
                    Dengan menggunakan layanan DearNote dan melakukan pembayaran, pengguna dianggap telah membaca dan menyetujui Kebijakan Refund dan Bantuan Teknis ini.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">1. Kebijakan Utama: Pembayaran Bersifat Final</h4>
                  <p>
                    Seluruh pembayaran yang telah berhasil diproses bersifat final dan tidak dapat dibatalkan atau dikembalikan, kecuali secara khusus dinyatakan lain dalam kebijakan ini.
                  </p>
                  <p>
                    Hal ini karena setelah pembayaran berhasil, sistem DearNote akan langsung memproses pembuatan kartu digital, menerbitkan halaman web, dan mengalokasikan sumber daya penyimpanan untuk konten yang diunggah pengguna.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">2. Tidak Ada Refund untuk Kesalahan Pengguna</h4>
                  <p>
                    DearNote tidak memberikan pengembalian dana untuk kesalahan yang disebabkan oleh pengguna, termasuk tetapi tidak terbatas pada:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Kesalahan pengetikan nama pengirim atau penerima;</li>
                    <li>Kesalahan penulisan judul, pesan, atau isi kartu;</li>
                    <li>Kesalahan pemilihan template;</li>
                    <li>Kesalahan unggahan foto;</li>
                    <li>Kesalahan unggahan atau perekaman suara;</li>
                    <li>Ketidaksesuaian hasil akhir karena pengguna tidak meninjau pratinjau sebelum pembayaran;</li>
                    <li>Kehilangan tautan, QR Code, Order ID, atau bukti pembayaran;</li>
                    <li>Keinginan untuk mengubah isi kartu setelah kartu diterbitkan.</li>
                  </ol>
                  <p className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-medium">
                    💡 Sebelum melakukan pembayaran, pengguna wajib memeriksa kembali seluruh isi kartu melalui fitur pratinjau yang tersedia.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">3. Tidak Ada Fitur Edit Setelah Terbit</h4>
                  <p>
                    Kartu digital yang telah berhasil diterbitkan tidak dapat diedit kembali. DearNote dirancang menyerupai pengalaman mengirim surat atau kartu fisik, sehingga pengguna perlu memastikan seluruh isi kartu sudah benar sebelum melakukan pembayaran.
                  </p>
                  <p>
                    Jika pengguna ingin memperbaiki, mengganti, atau mengubah isi kartu yang telah diterbitkan, pengguna perlu membuat kartu baru dan melakukan pembayaran baru.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">4. Bantuan Teknis untuk Kegagalan Sistem</h4>
                  <p>
                    Apabila pembayaran pengguna telah berhasil diproses, tetapi kartu digital gagal diterbitkan karena kendala teknis pada sistem DearNote, pengguna berhak mengajukan bantuan teknis.
                  </p>
                  <p>
                    Dalam kasus tersebut, prioritas utama DearNote adalah membantu memeriksa transaksi dan melakukan penerbitan ulang atau regenerasi kartu digital, selama pembayaran benar-benar telah berhasil diterima dan kendala terbukti berasal dari sistem DearNote.
                  </p>
                  <p>
                    Contoh kendala yang dapat diajukan untuk bantuan teknis:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Pembayaran berhasil, tetapi kartu tidak diterbitkan;</li>
                    <li>Tautan kartu tidak dapat dibuka sejak awal penerbitan;</li>
                    <li>Kartu terbit dalam kondisi rusak karena kesalahan sistem;</li>
                    <li>File halaman gagal dibuat meskipun pembayaran telah terkonfirmasi berhasil.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">5. Batas Waktu Pengajuan Bantuan Teknis</h4>
                  <p>
                    Pengajuan bantuan teknis atas kegagalan sistem harus dilakukan paling lambat <strong>7 hari kalender</strong> sejak tanggal pembayaran berhasil.
                  </p>
                  <p>
                    Pengajuan yang diajukan setelah melewati batas waktu tersebut dapat ditolak, terutama apabila informasi transaksi tidak lengkap, kartu telah kedaluwarsa, atau kendala tidak dapat diverifikasi secara wajar.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">6. Cara Mengajukan Bantuan Teknis</h4>
                  <p>
                    Untuk mengajukan bantuan teknis, hubungi DearNote melalui email: <strong>hidearnote@gmail.com</strong>
                  </p>
                  <p>
                    Sertakan informasi berikut:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Bukti pembayaran yang sah;</li>
                    <li>Waktu transaksi;</li>
                    <li>Tautan kartu, jika tersedia;</li>
                    <li>Deskripsi singkat kendala;</li>
                    <li>Screenshot atau bukti pendukung, apabila ada.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">7. Pengembalian Dana Manual</h4>
                  <p>
                    Pengembalian dana manual hanya dapat dipertimbangkan dalam kondisi terbatas, yaitu apabila:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Pembayaran pengguna terbukti berhasil diterima;</li>
                    <li>Kartu digital gagal diterbitkan karena kesalahan sistem DearNote;</li>
                    <li>DearNote tidak dapat melakukan regenerasi atau penerbitan ulang kartu dalam waktu yang wajar;</li>
                    <li>Pengguna telah mengajukan laporan sesuai prosedur dan batas waktu dalam kebijakan ini.</li>
                  </ol>
                  <p>
                    Apabila pengembalian dana disetujui, proses dan waktu pengembalian akan mengikuti ketentuan penyedia pembayaran pihak ketiga yang digunakan.
                  </p>
                  <p>
                    Biaya administrasi, biaya transfer, biaya gateway, atau potongan lain dari penyedia pembayaran dapat berlaku sesuai kebijakan pihak terkait.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">8. Tidak Ada Refund Setelah Masa Aktif Berakhir</h4>
                  <p>
                    Setiap kartu digital memiliki masa aktif online selama <strong>90 hari kalender</strong> sejak tanggal pembayaran berhasil.
                  </p>
                  <p>
                    Setelah melewati masa aktif tersebut, kartu digital dan seluruh berkas terkait, termasuk foto and rekaman suara, dapat dihapus secara otomatis dan permanen dari sistem penyimpanan DearNote.
                  </p>
                  <p>
                    DearNote tidak memberikan pengembalian dana, kompensasi, atau penerbitan ulang untuk kartu yang telah dihapus karena melewati masa aktif 90 hari.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">9. Perubahan Kebijakan</h4>
                  <p>
                    DearNote berhak memperbarui Kebijakan Refund dan Bantuan Teknis ini dari waktu ke waktu. Perubahan berlaku sejak dipublikasikan di situs DearNote, kecuali dinyatakan lain.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Kebijakan Privasi ini menjelaskan bagaimana DearNote mengumpulkan, menggunakan, menyimpan, melindungi, dan menghapus informasi yang diproses melalui situs <strong>dearnote.asia</strong>.
                  </p>
                  <p>
                    Dengan menggunakan layanan DearNote, Anda menyatakan bahwa Anda telah membaca dan memahami Kebijakan Privasi ini.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">1. Tentang DearNote</h4>
                  <p>
                    DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif berbasis web. DearNote dirancang sebagai layanan tanpa akun, sehingga pengguna tidak perlu membuat akun, memasukkan email, atau membuat kata sandi untuk membuat kartu digital.
                  </p>
                  <p>
                    Kontak resmi DearNote: <strong>hidearnote@gmail.com</strong>
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">2. Data yang Kami Kumpulkan</h4>
                  <p>
                    DearNote dapat mengumpulkan dan memproses data berikut sesuai kebutuhan layanan:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li><strong>Data konten kartu</strong>, termasuk teks, nama pengirim, nama penerima, pesan, judul kartu, foto, rekaman suara, dan data lain yang dimasukkan pengguna ke dalam formulir pembuatan kartu.</li>
                    <li><strong>Data teknis</strong>, seperti alamat IP, jenis perangkat, browser, waktu akses, data log, dan informasi teknis lain yang diperlukan untuk keamanan, pemeliharaan, dan pencegahan penyalahgunaan layanan.</li>
                    <li><strong>Data transaksi</strong>, seperti Order ID, status pembayaran, nominal pembayaran, metode pembayaran, waktu transaksi, dan informasi lain yang diterima dari penyedia pembayaran pihak ketiga.</li>
                    <li><strong>Data komunikasi</strong>, seperti alamat email dan isi pesan apabila pengguna menghubungi DearNote untuk bantuan, laporan, atau pertanyaan.</li>
                  </ol>
                  <p>
                    DearNote tidak menyimpan data kartu kredit, PIN, OTP, kata sandi rekening, atau kredensial pembayaran pengguna.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">3. Tujuan Penggunaan Data</h4>
                  <p>
                    Data diproses untuk tujuan berikut:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Membuat, memproses, dan menerbitkan kartu digital;</li>
                    <li>Menyimpan dan menampilkan konten kartu selama masa aktif;</li>
                    <li>Menghasilkan tautan unik dan/atau QR Code;</li>
                    <li>Memproses dan memverifikasi status pembayaran;</li>
                    <li>Memberikan bantuan teknis kepada pengguna;</li>
                    <li>Menjaga keamanan layanan dan mencegah penyalahgunaan;</li>
                    <li>Memperbaiki kualitas layanan, performa, dan pengalaman pengguna;</li>
                    <li>Memenuhi kewajiban hukum yang berlaku apabila diperlukan.</li>
                  </ol>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">4. Sifat Publik Kartu Digital</h4>
                  <p>
                    Kartu digital DearNote diterbitkan sebagai halaman web yang dapat dibuka melalui tautan unik dan/atau QR Code.
                  </p>
                  <p>
                    Siapa pun yang memiliki tautan atau QR Code kartu dapat membuka halaman tersebut, kecuali terdapat pembatasan tampilan tertentu seperti kode akses. Karena itu, pengguna bertanggung jawab untuk membagikan tautan dan QR Code hanya kepada pihak yang memang diinginkan.
                  </p>
                  <p>
                    Fitur kode akses atau passcode disediakan untuk menciptakan pengalaman membuka kartu yang lebih personal dan mengejutkan, tetapi tidak dimaksudkan sebagai sistem keamanan tingkat tinggi atau enkripsi penuh.
                  </p>
                  <p>
                    Pengguna disarankan untuk tidak mengunggah informasi yang sangat rahasia atau sensitif ke DearNote.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">5. Penyimpanan Data</h4>
                  <p>
                    Konten kartu digital, termasuk foto dan rekaman suara, dapat disimpan pada layanan penyimpanan cloud atau infrastruktur pihak ketiga yang digunakan DearNote untuk menjalankan layanan.
                  </p>
                  <p>
                    DearNote berupaya menggunakan penyedia infrastruktur yang wajar dan sesuai untuk menjaga ketersediaan serta keamanan layanan. Namun, pengguna memahami bahwa setiap layanan digital tetap memiliki risiko teknis, termasuk gangguan sistem, kesalahan jaringan, atau gangguan pihak ketiga.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">6. Masa Retensi dan Penghapusan Data</h4>
                  <p>
                    Setiap kartu digital memiliki masa aktif online selama <strong>90 hari kalender</strong> sejak tanggal pembayaran berhasil.
                  </p>
                  <p>
                    Setelah masa aktif berakhir, kartu digital dan seluruh berkas terkait, termasuk foto dan rekaman suara, akan dihapus secara otomatis dan permanen dari sistem penyimpanan DearNote.
                  </p>
                  <p>
                    Data yang telah dihapus tidak dapat dipulihkan kembali.
                  </p>
                  <p>
                    Data transaksi, log teknis, atau data komunikasi tertentu dapat disimpan lebih lama apabila diperlukan untuk keperluan pembukuan, keamanan, penyelesaian sengketa, pencegahan penyalahgunaan, atau pemenuhan kewajiban hukum.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">7. Pembagian Data kepada Pihak Ketiga</h4>
                  <p>
                    DearNote dapat menggunakan layanan pihak ketiga untuk mendukung operasional layanan, termasuk tetapi tidak terbatas pada:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
    
                    <li>Penyedia penyimpanan cloud;</li>
                   
                  </ol>
                  <p>
                    Data hanya dibagikan sejauh diperlukan untuk menjalankan layanan DearNote, memproses pembayaran, menjaga keamanan, atau memenuhi kewajiban hukum.
                  </p>
                  <p>
                    DearNote tidak menjual data pribadi pengguna kepada pihak ketiga.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">8. Keamanan Data</h4>
                  <p>
                    DearNote berupaya menerapkan langkah-langkah keamanan yang wajar untuk melindungi data pengguna dari akses, penggunaan, perubahan, atau penghapusan yang tidak sah.
                  </p>
                  <p>
                    Namun, tidak ada sistem elektronik, jaringan internet, atau metode penyimpanan digital yang sepenuhnya bebas risiko. Oleh karena itu, DearNote tidak dapat menjamin keamanan absolut atas data yang diunggah pengguna.
                  </p>
                  <p>
                    Pengguna bertanggung jawab untuk tidak mengunggah informasi yang sangat rahasia, sensitif, atau berisiko tinggi apabila diketahui oleh pihak lain.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">9. Hak Pengguna</h4>
                  <p>
                    Sesuai ketentuan hukum yang berlaku, pengguna dapat menghubungi DearNote untuk mengajukan permintaan terkait data yang diproses oleh DearNote, termasuk permintaan informasi, koreksi terbatas, atau penghapusan data apabila memungkinkan.
                  </p>
                  <p>
                    Karena DearNote tidak menggunakan sistem akun, permintaan terkait data harus disertai informasi yang cukup untuk memverifikasi hubungan pengguna dengan kartu atau transaksi, seperti:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Order ID;</li>
                    <li>Bukti pembayaran;</li>
                    <li>Tautan kartu;</li>
                    <li>Informasi lain yang dapat membantu proses verifikasi.</li>
                  </ol>
                  <p>
                    DearNote dapat menolak permintaan apabila pengguna tidak dapat memberikan informasi yang cukup untuk verifikasi, permintaan melanggar hukum, atau data telah dihapus secara permanen karena masa aktif telah berakhir.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">10. Konten Pihak Ketiga</h4>
                  <p>
                    Kartu digital dapat memuat konten yang diunggah oleh pengguna. DearNote tidak bertanggung jawab atas isi konten yang dibuat atau dibagikan oleh pengguna.
                  </p>
                  <p>
                    Apabila Anda menemukan konten yang melanggar hukum, melanggar hak Anda, atau melanggar ketentuan DearNote, silakan hubungi email: <strong>hidearnote@gmail.com</strong>
                  </p>
                  <p>
                    Sertakan tautan kartu dan penjelasan singkat mengenai laporan Anda.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">11. Perubahan Kebijakan Privasi</h4>
                  <p>
                    DearNote dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan berlaku sejak dipublikasikan di situs DearNote, kecuali dinyatakan lain.
                  </p>

                  <h4 className="font-serif text-base font-bold text-gray-900 pt-2">12. Kontak</h4>
                  <p>
                    Untuk pertanyaan, permintaan, atau laporan terkait privasi dan data, hubungi email: <strong>hidearnote@gmail.com</strong>
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
