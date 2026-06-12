# DearNote 📓

DearNote adalah aplikasi pembuatan jurnal kenangan digital (*keepsake*) berbasis web yang sederhana, elegan, dan tanpa memerlukan pendaftaran akun (*no-login*). Pengguna dapat merangkai ucapan digital interaktif dengan kompilasi foto kenangan, musik latar belakang, dan rekaman suara, lalu menerbitkannya menjadi halaman statis unik yang dapat dibagikan via link atau dicetak sebagai QR Code berbentuk hati.

## Fitur Utama

- **Tanpa Akun (No-Login)**: Pembuatan instan langsung dari halaman `/create` tanpa proses registrasi yang rumit.
- **Desain & Tema Elegan**: Menyediakan 3 pilihan template visual premium (Classic Editorial, Polaroid Scrapbook, Nocturnal Journal).
- **Format Media Kaya**: Mendukung kompilasi hingga 5 foto kenangan dan perekaman audio/suara langsung dari browser.
- **Musik Latar Belakang (BGM)**: Berbagai pilihan instrumen loop berdurasi pendek untuk meningkatkan emosi pesan.
- **Keamanan Passcode (Opsional)**: Pengamanan kosmetik kode akses rahasia yang hanya diketahui oleh pengirim dan penerima.
- **Cetak QR Code Hati**: Kustomisasi letak, warna, bentuk pixel, dan bingkai QR Code berbentuk hati untuk dilampirkan pada kado fisik.
- **Hosting Statis Cepat**: Halaman jurnal penerima diterbitkan sebagai HTML statis di Cloudflare R2 untuk performa maksimal dan durasi aktif 90 hari.

## Arsitektur Teknologi

- **Frontend & API**: Next.js (Route Handlers) di-host di Vercel.
- **Penyimpanan Statis**: Cloudflare R2 (menyimpan draf, aset media, file HTML statis, dan QR code).
- **Gateway Pembayaran**: DOKU Checkout (QRIS & E-Wallet / Virtual Account).
- **Pustaka QR**: `qrcode` dengan custom canvas parser di sisi klien.

## Memulai Pengembangan Lokal

1. Salin berkas `.env.example` menjadi `.env.local` dan isi kredensial yang diperlukan (Cloudflare R2, DOKU Sandbox, Admin Secret).
2. Jalankan server pengembangan lokal:

```bash
npm install
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.
