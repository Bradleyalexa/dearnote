import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan - DearNote",
  description: "Syarat dan ketentuan penggunaan platform DearNote untuk membuat ucapan digital.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/img/dearnote_logo.png"
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
          Syarat & Ketentuan
        </h1>
        <p className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-gray max-w-none text-gray-750 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Selamat datang di <strong>DearNote</strong> (“DearNote”, “kami”, “layanan kami”). Dengan mengakses atau menggunakan situs <strong>dearnote.asia</strong>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini.
          </p>
          <p>
            Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, mohon untuk tidak menggunakan layanan DearNote.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              1. Tentang DearNote
            </h2>
            <p>
              DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif berbasis web. Pengguna dapat memilih template, mengisi teks, mengunggah foto, dan/atau rekaman suara, melakukan pembayaran, lalu sistem akan menerbitkan halaman digital statis yang dapat dibuka melalui tautan unik dan/atau QR Code.
            </p>
            <p>
              Layanan DearNote saat ini ditujukan untuk pengguna di wilayah Indonesia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              2. Layanan Tanpa Akun
            </h2>
            <p>
              DearNote dirancang sebagai layanan tanpa akun untuk mempermudah proses pembuatan kartu digital. Oleh karena itu:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Pengguna tidak diwajibkan membuat akun, memasukkan email, atau membuat kata sandi untuk menggunakan layanan.</li>
              <li>Setelah kartu diterbitkan, pengguna bertanggung jawab untuk menyimpan tautan unik, QR Code, Order ID, dan/atau bukti pembayaran yang berkaitan dengan transaksi.</li>
              <li>Karena DearNote tidak menyediakan dashboard pengguna, kehilangan tautan, QR Code, atau informasi pesanan bukan merupakan tanggung jawab DearNote.</li>
              <li>DearNote tidak dapat menjamin bahwa pesanan yang tautannya hilang dapat ditemukan kembali, terutama apabila pengguna tidak menyimpan Order ID atau bukti pembayaran.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              3. Pembuatan dan Penerbitan Kartu
            </h2>
            <p>
              Untuk membuat kartu digital, pengguna dapat diminta untuk:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
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
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              4. Harga dan Pembayaran
            </h2>
            <p>
              DearNote menggunakan sistem pembayaran sekali bayar untuk setiap template atau kartu digital yang dibuat. Harga dapat berbeda untuk setiap template, paket, atau fitur yang tersedia.
            </p>
            <p>
              Pembayaran diproses melalui penyedia pembayaran pihak ketiga. DearNote tidak menyimpan informasi kartu kredit, rekening bank, PIN, kode OTP, atau kredensial pembayaran pengguna.
            </p>
            <p>
              Dengan melakukan pembayaran, pengguna menyatakan bahwa informasi pembayaran yang digunakan adalah sah dan pengguna memiliki hak untuk menggunakan metode pembayaran tersebut.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              5. Ketentuan Konten dan Hak Unggah
            </h2>
            <p>
              Pengguna bertanggung jawab penuh atas seluruh konten yang diunggah, diketik, dikirimkan, atau digunakan dalam kartu digital DearNote, termasuk tetapi tidak terbatas pada teks, foto, suara, nama, pesan, dan informasi lain.
            </p>
            <p>
              Dengan menggunakan layanan DearNote, pengguna menyatakan dan menjamin bahwa:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Pengguna memiliki hak, izin, atau lisensi yang sah atas seluruh konten yang diunggah;</li>
              <li>Konten tidak melanggar hak cipta, hak merek, hak privasi, hak publisitas, atau hak pihak ketiga lainnya;</li>
              <li>Konten tidak melanggar hukum yang berlaku di Republik Indonesia;</li>
              <li>Konten tidak mengandung materi yang dilarang berdasarkan Syarat & Ketentuan ini.</li>
            </ol>
            <p>
              Pengguna dilarang mengunggah, membuat, atau menyebarkan konten yang:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
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
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              6. Sifat Publik Tautan dan Kode Akses
            </h2>
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
            <ol className="list-decimal pl-6 space-y-2">
              <li>Nomor identitas pribadi;</li>
              <li>Informasi finansial atau perbankan;</li>
              <li>Kata sandi, PIN, OTP, atau kredensial akun;</li>
              <li>Dokumen hukum atau data pribadi yang sangat sensitif;</li>
              <li>Informasi medis atau informasi pribadi yang tidak ingin diketahui orang lain.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              7. Masa Aktif dan Penghapusan Otomatis
            </h2>
            <p>
              Setiap kartu digital yang berhasil diterbitkan memiliki masa aktif online selama <strong>90 hari kalender</strong> sejak tanggal pembayaran berhasil.
            </p>
            <p>
              Setelah masa aktif berakhir, kartu digital akan dianggap kedaluwarsa dan seluruh berkas terkait, termasuk halaman kartu, foto, dan rekaman suara, dapat dihapus secara otomatis dan permanen dari sistem penyimpanan DearNote.
            </p>
            <p>
              Data yang telah dihapus karena kedaluwarsa tidak dapat dipulihkan kembali. DearNote tidak memberikan pengembalian dana, kompensasi, atau penggantian atas kartu yang telah melewati masa aktif 90 hari.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              8. Tidak Ada Fitur Edit Setelah Terbit
            </h2>
            <p>
              DearNote dirancang menyerupai pengalaman mengirim kartu atau surat fisik. Oleh karena itu, kartu digital yang telah berhasil diterbitkan tidak dapat diedit kembali.
            </p>
            <p>
              Pengguna bertanggung jawab untuk memeriksa seluruh isi kartu melalui fitur pratinjau sebelum melakukan pembayaran. Kesalahan pengetikan, kesalahan pemilihan foto, kesalahan rekaman suara, kesalahan nama, atau kesalahan pemilihan template setelah kartu diterbitkan bukan merupakan tanggung jawab DearNote.
            </p>
            <p>
              Jika pengguna ingin melakukan perubahan setelah kartu diterbitkan, pengguna perlu membuat kartu baru dan melakukan pembayaran baru.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              9. Bantuan Teknis
            </h2>
            <p>
              Apabila pengguna mengalami kendala teknis, pengguna dapat menghubungi DearNote melalui email:
            </p>
            <p className="font-semibold text-gray-900">
              <a href="mailto:hidearnote@gmail.com" className="underline hover:text-gray-700">hidearnote@gmail.com</a>
            </p>
            <p>
              Untuk mempercepat proses bantuan, pengguna disarankan menyertakan:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Order ID;</li>
              <li>Bukti pembayaran;</li>
              <li>Waktu transaksi;</li>
              <li>Tautan kartu, apabila tersedia;</li>
              <li>Penjelasan singkat mengenai kendala yang dialami.</li>
            </ol>
            <p>
              DearNote akan berupaya membantu kendala teknis yang wajar, termasuk melakukan pemeriksaan atau penerbitan ulang kartu apabila pembayaran telah berhasil tetapi kartu gagal diterbitkan karena kesalahan sistem DearNote.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              10. Ketersediaan Layanan
            </h2>
            <p>
              DearNote disediakan atas dasar “sebagaimana adanya” dan “sebagaimana tersedia”. Kami berupaya menjaga layanan tetap berjalan dengan baik, tetapi tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan, kesalahan, keterlambatan, kehilangan data, atau kendala teknis lainnya.
            </p>
            <p>
              Layanan dapat mengalami gangguan karena pemeliharaan sistem, gangguan penyedia hosting, gangguan penyimpanan cloud, gangguan penyedia pembayaran, gangguan jaringan internet, atau kondisi lain di luar kendali DearNote.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              11. Batasan Tanggung Jawab
            </h2>
            <p>
              Sepanjang diperbolehkan oleh hukum yang berlaku, DearNote tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Kesalahan pengguna dalam mengisi atau mengunggah konten;</li>
              <li>Kehilangan tautan, QR Code, Order ID, atau bukti pembayaran;</li>
              <li>Penyebaran tautan kartu oleh pengguna atau pihak lain;</li>
              <li>Penggunaan konten yang melanggar hak pihak ketiga;</li>
              <li>Gangguan layanan pihak ketiga, termasuk penyedia pembayaran, hosting, penyimpanan cloud, browser, atau jaringan internet;</li>
              <li>Kerugian emosional, reputasi, finansial, atau konsekuensi lain akibat penggunaan atau ketidakmampuan menggunakan layanan DearNote.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              12. Hak DearNote
            </h2>
            <p>
              DearNote berhak untuk:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Mengubah, menambah, atau menghapus fitur layanan;</li>
              <li>Mengubah harga, template, atau ketentuan layanan;</li>
              <li>Menolak atau menghapus konten yang melanggar ketentuan;</li>
              <li>Pembatasan akses terhadap kartu yang disalahgunakan;</li>
              <li>Memperbarui Syarat & Ketentuan ini dari waktu ke waktu.</li>
            </ol>
            <p>
              Perubahan Syarat & Ketentuan akan berlaku sejak dipublikasikan di situs DearNote, kecuali dinyatakan lain.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              13. Hukum yang Berlaku
            </h2>
            <p>
              Syarat & Ketentuan ini diatur berdasarkan hukum yang berlaku di Republik Indonesia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              14. Kontak
            </h2>
            <p>
              Untuk pertanyaan, bantuan, atau laporan terkait layanan DearNote, silakan hubungi:
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
        <div className="mt-2 space-y-0.5 text-gray-400">
          <p>Jakarta Barat, Indonesia</p>
          <p>Kontak: <a href="mailto:hidearnote@gmail.com" className="hover:text-gray-600 underline">hidearnote@gmail.com</a></p>
        </div>
      </footer>
    </div>
  );
}
