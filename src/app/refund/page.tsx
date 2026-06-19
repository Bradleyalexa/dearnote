import Link from "next/link";

export const metadata = {
  title: "Kebijakan Refund dan Bantuan Teknis - DearNote",
  description: "Ketentuan pengembalian dana dan bantuan teknis layanan DearNote.",
};

export default function RefundPage() {
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
          Kebijakan Refund dan Bantuan Teknis
        </h1>
        <p className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-gray max-w-none text-gray-750 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Kebijakan ini menjelaskan ketentuan pengembalian dana dan bantuan teknis untuk layanan DearNote.
          </p>
          <p>
            DearNote adalah layanan pembuatan kartu ucapan, catatan personal, dan jurnal digital interaktif sekali bayar. Setelah pembayaran berhasil dikonfirmasi, sistem akan memproses dan menerbitkan kartu digital secara otomatis dalam bentuk halaman web statis.
          </p>
          <p>
            Dengan menggunakan layanan DearNote dan melakukan pembayaran, pengguna dianggap telah membaca dan menyetujui Kebijakan Refund dan Bantuan Teknis ini.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              1. Kebijakan Utama: Pembayaran Bersifat Final
            </h2>
            <p>
              Seluruh pembayaran yang telah berhasil diproses bersifat final dan tidak dapat dibatalkan atau dikembalikan, kecuali secara khusus dinyatakan lain dalam kebijakan ini.
            </p>
            <p>
              Hal ini karena setelah pembayaran berhasil, sistem DearNote akan langsung memproses pembuatan kartu digital, menerbitkan halaman web, dan mengalokasikan sumber daya penyimpanan untuk konten yang diunggah pengguna.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              2. Tidak Ada Refund untuk Kesalahan Pengguna
            </h2>
            <p>
              DearNote tidak memberikan pengembalian dana untuk kesalahan yang disebabkan oleh pengguna, termasuk tetapi tidak terbatas pada:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Kesalahan pengetikan nama pengirim atau penerima;</li>
              <li>Kesalahan penulisan judul, pesan, atau isi kartu;</li>
              <li>Kesalahan pemilihan template;</li>
              <li>Kesalahan unggahan foto;</li>
              <li>Kesalahan unggahan atau perekaman suara;</li>
              <li>Ketidaksesuaian hasil akhir karena pengguna tidak meninjau pratinjau sebelum pembayaran;</li>
              <li>Kehilangan tautan, QR Code, Order ID, atau bukti pembayaran;</li>
              <li>Keinginan untuk mengubah isi kartu setelah kartu diterbitkan.</li>
            </ol>
            <p className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm font-medium">
              💡 Sebelum melakukan pembayaran, pengguna wajib memeriksa kembali seluruh isi kartu melalui fitur pratinjau yang tersedia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              3. Tidak Ada Fitur Edit Setelah Terbit
            </h2>
            <p>
              Kartu digital yang telah berhasil diterbitkan tidak dapat diedit kembali. DearNote dirancang menyerupai pengalaman mengirim surat atau kartu fisik, sehingga pengguna perlu memastikan seluruh isi kartu sudah benar sebelum melakukan pembayaran.
            </p>
            <p>
              Jika pengguna ingin memperbaiki, mengganti, atau mengubah isi kartu yang telah diterbitkan, pengguna perlu membuat kartu baru dan melakukan pembayaran baru.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              4. Bantuan Teknis untuk Kegagalan Sistem
            </h2>
            <p>
              Apabila pembayaran pengguna telah berhasil diproses, tetapi kartu digital gagal diterbitkan karena kendala teknis pada sistem DearNote, pengguna berhak mengajukan bantuan teknis.
            </p>
            <p>
              Dalam kasus tersebut, prioritas utama DearNote adalah membantu memeriksa transaksi dan melakukan penerbitan ulang atau regenerasi kartu digital, selama pembayaran benar-benar telah berhasil diterima dan kendala terbukti berasal dari sistem DearNote.
            </p>
            <p>
              Contoh kendala yang dapat diajukan untuk bantuan teknis:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Pembayaran berhasil, tetapi kartu tidak diterbitkan;</li>
              <li>Tautan kartu tidak dapat dibuka sejak awal penerbitan;</li>
              <li>Kartu terbit dalam kondisi rusak karena kesalahan sistem;</li>
              <li>File halaman gagal dibuat meskipun pembayaran telah terkonfirmasi berhasil.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              5. Batas Waktu Pengajuan Bantuan Teknis
            </h2>
            <p>
              Pengajuan bantuan teknis atas kegagalan sistem harus dilakukan paling lambat <strong>7 hari kalender</strong> sejak tanggal pembayaran berhasil.
            </p>
            <p>
              Pengajuan yang diajukan setelah melewati batas waktu tersebut dapat ditolak, terutama apabila informasi transaksi tidak lengkap, kartu telah kedaluwarsa, atau kendala tidak dapat diverifikasi secara wajar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              6. Cara Mengajukan Bantuan Teknis
            </h2>
            <p>
              Untuk mengajukan bantuan teknis, hubungi DearNote melalui email:
            </p>
            <p className="font-semibold text-gray-900">
              <a href="mailto:hidearnote@gmail.com" className="underline hover:text-gray-700">hidearnote@gmail.com</a>
            </p>
            <p>
              Sertakan informasi berikut:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Bukti pembayaran yang sah;</li>
              <li>Waktu transaksi;</li>
              <li>Tautan kartu, jika tersedia;</li>
              <li>Deskripsi singkat kendala;</li>
              <li>Screenshot atau bukti pendukung, apabila ada.</li>
            </ol>
            <p>
              DearNote akan memeriksa laporan dan berupaya membantu menyelesaikan kendala sesuai informasi yang tersedia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              7. Pengembalian Dana Manual
            </h2>
            <p>
              Pengembalian dana manual hanya dapat dipertimbangkan dalam kondisi terbatas, yaitu apabila:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
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
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              8. Tidak Ada Refund Setelah Masa Aktif Berakhir
            </h2>
            <p>
              Setiap kartu digital memiliki masa aktif online selama <strong>90 hari kalender</strong> sejak tanggal pembayaran berhasil.
            </p>
            <p>
              Setelah melewati masa aktif tersebut, kartu digital dan seluruh berkas terkait, termasuk foto dan rekaman suara, dapat dihapus secara otomatis dan permanen dari sistem penyimpanan DearNote.
            </p>
            <p>
              DearNote tidak memberikan pengembalian dana, kompensasi, atau penerbitan ulang untuk kartu yang telah dihapus karena melewati masa aktif 90 hari.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-8">
              9. Perubahan Kebijakan
            </h2>
            <p>
              DearNote berhak memperbarui Kebijakan Refund dan Bantuan Teknis ini dari waktu ke waktu. Perubahan berlaku sejak dipublikasikan di situs DearNote, kecuali dinyatakan lain.
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
