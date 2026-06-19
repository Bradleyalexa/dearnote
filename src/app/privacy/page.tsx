import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - DearNote",
  description: "Kebijakan Privasi mengenai penggunaan data di layanan DearNote.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/dearnote_logo.png"
              alt="DearNote Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Kebijakan Privasi
        </h1>
        <p className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-gray max-w-none text-gray-750 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Kebijakan Privasi ini menjelaskan bagaimana DearNote mengumpulkan, menggunakan, menyimpan, melindungi, dan menghapus informasi yang diproses melalui situs <strong>dearnote.asia</strong>.
          </p>
          <p>
            Dengan menggunakan layanan DearNote, Anda menyatakan bahwa Anda telah membaca dan memahami Kebijakan Privasi ini.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              1. Tentang DearNote
            </h2>
            <p>
              DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif berbasis web. DearNote dirancang sebagai layanan tanpa akun, sehingga pengguna tidak perlu membuat akun, memasukkan email, atau membuat kata sandi untuk membuat kartu digital.
            </p>
            <p>
              Kontak resmi DearNote:
            </p>
            <p className="font-semibold text-gray-900">
              Email: <a href="mailto:hidearnote@gmail.com" className="underline hover:text-gray-700">hidearnote@gmail.com</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              2. Data yang Kami Kumpulkan
            </h2>
            <p>
              DearNote dapat mengumpulkan dan memproses data berikut sesuai kebutuhan layanan:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Data konten kartu</strong>, termasuk teks, nama pengirim, nama penerima, pesan, judul kartu, foto, rekaman suara, dan data lain yang dimasukkan pengguna ke dalam formulir pembuatan kartu.</li>
              <li><strong>Data teknis</strong>, seperti alamat IP, jenis perangkat, browser, waktu akses, data log, dan informasi teknis lain yang diperlukan untuk keamanan, pemeliharaan, dan pencegahan penyalahgunaan layanan.</li>
              <li><strong>Data transaksi</strong>, seperti Order ID, status pembayaran, nominal pembayaran, metode pembayaran, waktu transaksi, dan informasi lain yang diterima dari penyedia pembayaran pihak ketiga.</li>
              <li><strong>Data komunikasi</strong>, seperti alamat email dan isi pesan apabila pengguna menghubungi DearNote untuk bantuan, laporan, atau pertanyaan.</li>
            </ol>
            <p>
              DearNote tidak menyimpan data kartu kredit, PIN, OTP, kata sandi rekening, atau kredensial pembayaran pengguna.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              3. Tujuan Penggunaan Data
            </h2>
            <p>
              Data diproses untuk tujuan berikut:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Membuat, memproses, dan menerbitkan kartu digital;</li>
              <li>Menyimpan dan menampilkan konten kartu selama masa aktif;</li>
              <li>Menghasilkan tautan unik dan/atau QR Code;</li>
              <li>Memproses dan memverifikasi status pembayaran;</li>
              <li>Memberikan bantuan teknis kepada pengguna;</li>
              <li>Menjaga keamanan layanan dan mencegah penyalahgunaan;</li>
              <li>Memperbaiki kualitas layanan, performa, dan pengalaman pengguna;</li>
              <li>Memenuhi kewajiban hukum yang berlaku apabila diperlukan.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              4. Sifat Publik Kartu Digital
            </h2>
            <p>
              Kartu digital DearNote diterbitkan sebagai halaman web yang dapat dibuka melalui tautan unik dan/atau QR Code.
            </p>
            <p>
              Siapa pun yang memiliki tautan atau QR Code kartu dapat membuka halaman tersebut, kecuali terdapat pembatasan tampilan tertentu seperti kode akses. Karena itu, pengguna bertanggung jawab untuk membagikan tautan dan QR Code hanya kepada pihak yang memang diinginkan.
            </p>
            <p>
              Fitur kode akses atau passcode disediakan untuk menciptakan pengalaman membuka kartu yang lebih personal dan mengejutkan, tetapi tidak dimaksudkan sebagai sistem keamanan tingkat tinggi atau enkripsi penuh.
            </p>
            <p className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm font-medium">
              ⚠️ Pengguna disarankan untuk tidak mengunggah informasi yang sangat rahasia atau sensitif ke DearNote.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              5. Penyimpanan Data
            </h2>
            <p>
              Konten kartu digital, termasuk foto dan rekaman suara, dapat disimpan pada layanan penyimpanan cloud atau infrastruktur pihak ketiga yang digunakan DearNote untuk menjalankan layanan.
            </p>
            <p>
              DearNote berupaya menggunakan penyedia infrastruktur yang wajar dan sesuai untuk menjaga ketersediaan serta keamanan layanan. Namun, pengguna memahami bahwa setiap layanan digital tetap memiliki risiko teknis, termasuk gangguan sistem, kesalahan jaringan, atau gangguan pihak ketiga.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              6. Masa Retensi dan Penghapusan Data
            </h2>
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
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              7. Pembagian Data kepada Pihak Ketiga
            </h2>
            <p>
              DearNote dapat menggunakan layanan pihak ketiga untuk mendukung operasional layanan, termasuk tetapi tidak terbatas pada:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Penyedia pembayaran;</li>
              <li>Penyedia hosting;</li>
              <li>Penyedia penyimpanan cloud;</li>
              <li>Penyedia analitik teknis;</li>
              <li>Penyedia keamanan atau pencegahan penyalahgunaan layanan.</li>
            </ol>
            <p>
              Data hanya dibagikan sejauh diperlukan untuk menjalankan layanan DearNote, memproses pembayaran, menjaga keamanan, atau memenuhi kewajiban hukum.
            </p>
            <p>
              DearNote tidak menjual data pribadi pengguna kepada pihak ketiga.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              8. Keamanan Data
            </h2>
            <p>
              DearNote berupaya menerapkan langkah-langkah keamanan yang wajar untuk melindungi data pengguna dari akses, penggunaan, perubahan, atau penghapusan yang tidak sah.
            </p>
            <p>
              Namun, tidak ada sistem elektronik, jaringan internet, atau metode penyimpanan digital yang sepenuhnya bebas risiko. Oleh karena itu, DearNote tidak dapat menjamin keamanan absolut atas data yang diunggah pengguna.
            </p>
            <p>
              Pengguna bertanggung jawab untuk tidak mengunggah informasi yang sangat rahasia, sensitif, atau berisiko tinggi apabila diketahui oleh pihak lain.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              9. Hak Pengguna
            </h2>
            <p>
              Sesuai ketentuan hukum yang berlaku, pengguna dapat menghubungi DearNote untuk mengajukan permintaan terkait data yang diproses oleh DearNote, termasuk permintaan informasi, koreksi terbatas, atau penghapusan data apabila memungkinkan.
            </p>
            <p>
              Karena DearNote tidak menggunakan sistem akun, permintaan terkait data harus disertai informasi yang cukup untuk memverifikasi hubungan pengguna dengan kartu atau transaksi, seperti:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Order ID;</li>
              <li>Bukti pembayaran;</li>
              <li>Tautan kartu;</li>
              <li>Informasi lain yang dapat membantu proses verifikasi.</li>
            </ol>
            <p>
              DearNote dapat menolak permintaan apabila pengguna tidak dapat memberikan informasi yang cukup untuk verifikasi, permintaan melanggar hukum, atau data telah dihapus secara permanen karena masa aktif telah berakhir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              10. Konten Pihak Ketiga
            </h2>
            <p>
              Kartu digital dapat memuat konten yang diunggah oleh pengguna. DearNote tidak bertanggung jawab atas isi konten yang dibuat atau dibagikan oleh pengguna.
            </p>
            <p>
              Apabila Anda menemukan konten yang melanggar hukum, melanggar hak Anda, atau melanggar ketentuan DearNote, silakan hubungi:
            </p>
            <p className="font-semibold text-gray-900">
              Email: <a href="mailto:hidearnote@gmail.com" className="underline hover:text-gray-700">hidearnote@gmail.com</a>
            </p>
            <p>
              Sertakan tautan kartu dan penjelasan singkat mengenai laporan Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              11. Perubahan Kebijakan Privasi
            </h2>
            <p>
              DearNote dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan berlaku sejak dipublikasikan di situs DearNote, kecuali dinyatakan lain.
            </p>
            <p>
              Pengguna disarankan untuk meninjau Kebijakan Privasi ini secara berkala.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              12. Kontak
            </h2>
            <p>
              Untuk pertanyaan, permintaan, atau laporan terkait privasi dan data, hubungi:
            </p>
            <p className="font-semibold text-gray-900">
              Email: <a href="mailto:hidearnote@gmail.com" className="underline hover:text-gray-700">hidearnote@gmail.com</a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} DearNote. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
