import { PublishedConfig } from "../../schemas/card-draft";

export function generateBoyfriendPermitHtml(config: PublishedConfig): string {
  const appUrl = process.env.APP_URL || "https://dearnote.asia";
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Minta Izin Khusus 🥺";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote && !!config.voiceNote.src;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-funny-story-2877.mp3";

  // Parse custom upeti values (format: "title|desc")
  const favoriteMoments = config.favoriteMoments || [];
  const defaultUpeti = [
    { emoji: "🍕", title: "Ditraktir Makanan Favorit", desc: "Seblak / Boba / McD / Kopi kesukaan kamu." },
    { emoji: "💆‍♀️", title: "Voucher Pijat Pegal 60 Menit", desc: "Pijat pundak/kaki mandiri siap sedia kapan pun." },
    { emoji: "🧹", title: "Bebas Tugas Rumah Tangga", desc: "Bebas cuci piring/beres-beres selama 3 hari penuh." },
    { emoji: "🛒", title: "Nurut Ditemani Shopping", desc: "Janji tidak mengeluh / cemberut selama belanja." }
  ];

  function parseUpeti(idx: number, defaultItem: typeof defaultUpeti[0]) {
    const raw = favoriteMoments[idx] || "";
    if (!raw) return defaultItem;
    const [t, d] = raw.split("|");
    return {
      emoji: defaultItem.emoji,
      title: t ? t.trim() : defaultItem.title,
      desc: d ? d.trim() : defaultItem.desc
    };
  }

  const u1 = parseUpeti(0, defaultUpeti[0]);
  const u2 = parseUpeti(1, defaultUpeti[1]);
  const u3 = parseUpeti(2, defaultUpeti[2]);
  const u4 = parseUpeti(3, defaultUpeti[3]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boyfriend's Permission Slip – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Gochi+Hand&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            fredoka: ['"Fredoka"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            handwriting: ['"Gochi Hand"', 'cursive'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle, #eef1f6 0%, #dbe4ee 100%);
      min-height: 100vh;
      overflow: hidden; /* Prevent parent/body scrolling */
      color: #334155;
      font-family: 'Plus Jakarta Sans', sans-serif;
      touch-action: manipulation;
    }

    /* Retro grid pattern */
    .grid-bg {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
      z-index: 1;
    }

    /* Floating BGM Button */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Code Gate */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* Active chapter handler */
    .chapter {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      pointer-events: none;
      visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow-y: auto;
    }
    .chapter.active {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    /* Page 3: Verdict (No scrolling, fully locked) */
    #ch-verdict {
      overflow: hidden !important;
    }

    /* Auto scale down on short screens (like iframe preview) */
    @media (max-height: 720px) {
      .chapter > div {
        transform: scale(0.92);
        transform-origin: center center;
        margin: auto;
      }
    }
    @media (max-height: 640px) {
      .chapter > div {
        transform: scale(0.85);
      }
    }
    @media (max-height: 560px) {
      .chapter > div {
        transform: scale(0.75);
      }
    }

    /* Interactive Voucher stamp effect */
    .voucher-card {
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }
    .voucher-card.selected {
      border-color: #3b82f6;
      background: #eff6ff;
      transform: translateY(-2px);
    }

    .rubber-stamp {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-12deg) scale(3);
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 3px dashed #ef4444;
      color: #ef4444;
      font-family: 'Fredoka', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      letter-spacing: 1px;
      background-color: rgba(255, 255, 255, 0.85);
      z-index: 10;
    }
    .voucher-card.selected .rubber-stamp {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(-12deg) scale(1);
    }

    /* Runaway No button */
    #no-btn {
      position: relative;
      transition: all 0.15s ease-out;
    }

    /* Official Stamp Style */
    .approved-stamp {
      border: 3px solid #10b981;
      color: #10b981;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: 'Fredoka', sans-serif;
      font-weight: bold;
      text-transform: uppercase;
      transform: rotate(-15deg);
      display: inline-block;
      letter-spacing: 1px;
      font-size: 1rem;
      white-space: nowrap;
      flex-shrink: 0;
      animation: stamp-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      opacity: 0;
      background: rgba(255,255,255,0.9);
      box-shadow: 0 4px 10px rgba(16,185,129,0.15);
    }

    @keyframes stamp-pop {
      0% { transform: rotate(-15deg) scale(3); opacity: 0; }
      100% { transform: rotate(-15deg) scale(1); opacity: 1; }
    }

    /* Soft button styling */
    .btn-action {
      background: #2563eb;
      color: white;
      font-weight: 600;
      padding: 0.8rem 1.8rem;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
      transition: all 0.2s;
    }
    .btn-action:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37,99,235,0.35);
    }
    .btn-action:active {
      transform: translateY(1px);
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body class="relative min-h-screen">
  <div class="grid-bg"></div>

  <!-- Audio Player Elements -->
  <audio id="bg-music" src="${bgMusicSrc}" loop preload="auto"></audio>
  <audio id="stamp-sound" src="https://assets.mixkit.co/active_storage/sfx/2012/2012-84.wav" preload="auto"></audio>
  <audio id="fanfare-sound" src="https://assets.mixkit.co/active_storage/sfx/1996/1996-84.wav" preload="auto"></audio>

  <!-- Floating BGM Toggle -->
  <div id="bgm-btn" title="Toggle Music">🎵</div>

  <!-- ── 0. SECRET CODE GATE SCREEN ── -->
  ${
    hasSecretCode
      ? `
  <div id="code-gate">
    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full text-center relative z-10">
      <div class="text-4xl mb-3">🔒</div>
      <h2 class="text-xl font-bold font-fredoka text-slate-800 mb-2">Dokumen Sangat Rahasia</h2>
      <p class="text-xs text-slate-500 mb-6">Masukkan kode akses khusus untuk membaca pengajuan izin resmi ini.</p>
      <input type="password" id="code-input" placeholder="Kode Akses" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center mb-4 font-fredoka text-lg">
      <p id="code-err" class="text-red-500 text-xs mb-3 font-semibold"></p>
      <button id="code-submit" class="w-full btn-action">Buka Berkas</button>
    </div>
  </div>
  `
      : ""
  }

  <!-- Progress Bar Header -->
  <div class="fixed top-0 left-0 right-0 h-1.5 bg-slate-200/50 z-50">
    <div id="progress-bar" class="h-full bg-blue-500 transition-all duration-300" style="width:0%"></div>
  </div>

  <!-- ── 1. INTRODUCTION & REQUEST FORM ── -->
  <div class="chapter active" id="ch-intro">
    <div class="bg-white border-2 border-slate-300 rounded-2xl shadow-xl max-w-md w-full p-5 relative z-10 font-sans my-auto">
      <!-- Decorative Paper Header -->
      <div class="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-4 mb-4">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Direktorat Perizinan Pacar</span>
          <h2 class="text-lg font-bold font-fredoka text-slate-800">Formulir Permohonan Izin 📝</h2>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 block font-mono">No. Dokumen</span>
          <span class="text-xs font-mono font-bold text-slate-600">007/IZIN-RESMI/${new Date().getFullYear()}</span>
        </div>
      </div>

      <!-- Sender Info -->
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 items-center text-xs">
          <span class="font-semibold text-slate-400">Pemohon</span>
          <span class="col-span-2 font-bold text-slate-700">${config.fromName}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 items-center text-xs">
          <span class="font-semibold text-slate-400">Pemberi Izin</span>
          <span class="col-span-2 font-bold text-slate-700">${config.toName}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 items-center text-xs">
          <span class="font-semibold text-slate-400">Perihal Izin</span>
          <span class="col-span-2 font-bold text-slate-800 font-fredoka bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">${letterTitle}</span>
        </div>
      </div>

      <!-- Requester Photo Slot -->
      <div id="requester-photo-container" class="mt-4 flex justify-center">
        <!-- Injected by JS -->
      </div>

      <!-- Explanation details -->
      <div class="mt-4 bg-amber-50/50 border border-amber-100 rounded-xl p-3 max-h-[120px] overflow-y-auto">
        <span class="text-[10px] uppercase font-bold tracking-wide text-amber-600 block mb-0.5">Permohonan:</span>
        <p id="request-body-text" class="font-handwriting text-lg text-amber-900 leading-snug whitespace-pre-wrap"></p>
      </div>

      <!-- Action Button -->
      <div class="mt-5 flex justify-center">
        <button class="btn-action w-full flex items-center justify-center gap-2 text-sm" id="intro-next-btn">
          Tinjau Berkas & Sogokan 🎁
        </button>
      </div>
    </div>
  </div>

  <!-- ── 2. THE INTERACTIVE BRIBERY / UPETI PAGE ── -->
  <div class="chapter" id="ch-bribery">
    <div class="bg-white border-2 border-slate-300 rounded-2xl shadow-xl max-w-md w-full p-5 relative z-10 my-auto">
      <div class="text-center mb-4">
        <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Langkah 2 dari 3</span>
        <h2 class="text-xl font-bold font-fredoka text-slate-800">Paket Penyuapan Resmi (Upeti) 🎁</h2>
        <p class="text-[11px] text-slate-500 mt-0.5">Ketuk/pilih komitmen upeti di bawah ini untuk mencap janji saya secara hukum!</p>
      </div>

      <!-- Voucher List -->
      <div class="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        <!-- Voucher 1 -->
        <div class="voucher-card p-3 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between" data-idx="0">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u1.emoji}</span>
            <div>
              <h4 class="text-sm font-bold text-slate-700">${u1.title}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">${u1.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <!-- Voucher 2 -->
        <div class="voucher-card p-3 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between" data-idx="1">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u2.emoji}</span>
            <div>
              <h4 class="text-sm font-bold text-slate-700">${u2.title}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">${u2.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <!-- Voucher 3 -->
        <div class="voucher-card p-3 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between" data-idx="2">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u3.emoji}</span>
            <div>
              <h4 class="text-sm font-bold text-slate-700">${u3.title}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">${u3.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <!-- Voucher 4 -->
        <div class="voucher-card p-3 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between" data-idx="3">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u4.emoji}</span>
            <div>
              <h4 class="text-sm font-bold text-slate-700">${u4.title}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">${u4.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>
      </div>

      <!-- Voice Note Player (if hasVoiceNote) -->
      ${hasVoiceNote ? `
      <div class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
        <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
          <span id="play-icon" class="text-[10px] ml-0.5">▶</span>
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-[9px] uppercase font-bold tracking-widest text-slate-550 font-sans mb-1 text-left">🎙️ Pesan Suara Pemohon</p>
          <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-slate-200 rounded-full cursor-pointer relative">
            <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-slate-850 rounded-full transition-all duration-100 ease-linear"></div>
          </div>
        </div>
        <span id="audio-time" class="text-[10px] font-semibold text-slate-500 font-sans flex-shrink-0">0:00</span>
        <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
      ` : ""}

      <!-- Action Button -->
      <div class="mt-5">
        <button id="bribery-next-btn" class="w-full btn-action opacity-50 cursor-not-allowed text-sm" disabled>
          Pilih Minimal 1 Janji Upeti 🔒
        </button>
      </div>
    </div>
  </div>

  <!-- ── 3. THE DECISION / VERDICT PAGE ── -->
  <div class="chapter" id="ch-verdict">
    <div class="bg-white border-2 border-slate-300 rounded-2xl shadow-xl max-w-md w-full p-5 relative z-10 my-auto text-center">
      <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Langkah Akhir</span>
      <h2 class="text-xl font-bold font-fredoka text-slate-800 mt-1 mb-2">Keputusan Sidang Akhir ⚖</h2>
      <p class="text-xs text-slate-500 px-4 mb-6">Dengan mempertimbangkan permohonan dan jaminan upeti di atas, apakah Anda bersedia mengeluarkan Izin Resmi ini?</p>

      <!-- Begging emoji per user request -->
      <div class="text-7xl mb-6 animate-pulse">🥺</div>

      <!-- Verdict Buttons Layout -->
      <div class="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px] px-4">
        <!-- Yes Option -->
        <button id="yes-btn" class="px-8 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-transform text-base w-full sm:w-auto min-w-[140px] relative z-20">
          Boleh (Setuju) 👍
        </button>

        <!-- No Option (Red, runaway evasive button) -->
        <button id="no-btn" class="px-8 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-95 text-base w-full sm:w-auto min-w-[140px] absolute sm:relative z-10">
          Gak Boleh 👎
        </button>
      </div>
    </div>
  </div>

  <!-- ── 4. OFFICIAL APPROVED PERMIT DECREE ── -->
  <div class="chapter" id="ch-approved">
    <div id="permit-certificate-card" class="bg-white border-4 border-double border-slate-400 rounded-3xl shadow-2xl max-w-md w-full p-6 relative z-10 my-auto font-sans">
      <!-- Legal Seal Banner -->
      <div class="text-center border-b-4 border-double border-slate-300 pb-3 mb-4">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sertifikat Perizinan Sah</h3>
        <h1 class="text-xl font-bold font-fredoka text-slate-800 mt-1">SURAT KEPUTUSAN IZIN 📜</h1>
        <p class="text-[9px] font-mono text-slate-500 mt-0.5">Diterbitkan secara otomatis melalui platform DearNote</p>
      </div>

      <!-- Legal Declaration -->
      <div class="space-y-3.5 text-xs leading-relaxed text-slate-700">
        <p>Berdasarkan keputusan sepihak yang tidak dapat diganggu gugat, dengan ini dinyatakan bahwa:</p>
        
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
          <div>
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Penerima Izin</span>
            <span class="font-bold text-slate-800 text-sm">${config.fromName}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Untuk Keperluan</span>
            <span class="font-bold text-blue-600 text-sm font-fredoka">${letterTitle}</span>
          </div>
          
          <!-- Dynamic Jaminan Upeti list -->
          <div id="approved-bribes-box" class="pt-1.5 border-t border-slate-200/50 mt-1">
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Jaminan Upeti yang Diterima:</span>
            <ul id="approved-bribes-list" class="text-xs font-bold text-slate-700 mt-1 space-y-1.5">
              <!-- JS-populated list -->
            </ul>
          </div>

          <div class="pt-1.5 border-t border-slate-200/50 mt-1">
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Status Hak</span>
            <div class="mt-1 flex items-center justify-between">
              <span class="text-emerald-600 font-bold text-[11px]">DISETUJUI SEPENUHNYA (APPROVED)</span>
              <div class="approved-stamp font-fredoka font-bold">APPROVED</div>
            </div>
          </div>
        </div>

        <!-- Boy's response Message -->
        <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
          <span class="text-[9px] uppercase font-bold text-blue-600 block mb-0.5">Pesan Terima Kasih:</span>
          <p class="font-handwriting text-base text-blue-900 leading-snug">${config.finalMessage || "Terima kasih banyak sayang! Kamu memang yang terbaik di dunia! 💖"}</p>
        </div>

        <!-- Signatures mock -->
        <div class="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-center text-xs">
          <div>
            <div class="h-8 flex items-end justify-center font-handwriting text-base text-slate-500 font-bold pb-2">
              ${config.fromName}
            </div>
            <div class="border-t border-slate-300 pt-1 text-[9px] text-slate-400 uppercase font-semibold">Pemohon</div>
          </div>
          <div>
            <div class="h-8 flex items-end justify-center font-handwriting text-base text-emerald-600 font-bold pb-2">
              ${config.toName} ✓
            </div>
            <div class="border-t border-slate-300 pt-1 text-[9px] text-slate-400 uppercase font-semibold">Pemberi Izin (Boss)</div>
          </div>
        </div>
      </div>

      <!-- Action Button: Share / Copy Izin -->
      <div class="mt-5 pt-2 flex flex-col gap-2">
        <button id="share-permit-img-btn" class="w-full btn-action flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold">
          📸 Bagikan Foto Izin Resmi
        </button>
        <button id="share-permit-btn" class="w-full btn-action flex items-center justify-center gap-2 text-sm">
          🔗 Bagikan Link Surat Izin
        </button>
        <button id="back-home-btn" class="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Kembali ke Home
        </button>
      </div>
    </div>
  </div>

  <!-- Global Navigation Controls (Progress Dots) -->
  <div class="fixed bottom-4 left-0 right-0 flex justify-center gap-1.5 z-40" id="nav-dots"></div>

  <!-- Confetti script injection -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const HAS_BGM     = ${hasBgMusic};
    
    // Upeti title and description lists
    const UPETI_TITLES = [
      ${JSON.stringify(u1.title)},
      ${JSON.stringify(u2.title)},
      ${JSON.stringify(u3.title)},
      ${JSON.stringify(u4.title)}
    ];
    const UPETI_DESCS = [
      ${JSON.stringify(u1.desc)},
      ${JSON.stringify(u2.desc)},
      ${JSON.stringify(u3.desc)},
      ${JSON.stringify(u4.desc)}
    ];

    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('code-gate');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-bribery');
    CHAPTERS.push('ch-verdict');
    CHAPTERS.push('ch-approved');

    let currentIdx = 0;
    const upetiList = [false, false, false, false];

    // Build dots indicator
    const navDotsEl = document.getElementById('nav-dots');
    const VISIBLE_CHAPTERS = CHAPTERS.filter(c => c !== 'code-gate');
    VISIBLE_CHAPTERS.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'w-2 h-2 rounded-full bg-slate-300 transition-colors duration-200';
      navDotsEl.appendChild(dot);
    });

    function updateNav() {
      const dots = navDotsEl.children;
      const vIdx = VISIBLE_CHAPTERS.indexOf(CHAPTERS[currentIdx]);
      Array.from(dots).forEach((d, i) => {
        d.className = i === vIdx 
          ? 'w-4 h-2 rounded-full bg-blue-500 transition-all duration-200' 
          : 'w-2 h-2 rounded-full bg-slate-300 transition-all duration-200';
      });
      const pct = CHAPTERS.length > 1 ? (currentIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

    // Transitions
    function goTo(targetIdx) {
      if (targetIdx === currentIdx || targetIdx < 0 || targetIdx >= CHAPTERS.length) return;
      const fromEl = document.getElementById(CHAPTERS[currentIdx]);
      const toEl   = document.getElementById(CHAPTERS[targetIdx]);
      if (!fromEl || !toEl) return;

      fromEl.classList.remove('active');
      toEl.classList.add('active');

      currentIdx = targetIdx;
      updateNav();
      onEnter(CHAPTERS[targetIdx]);
    }

    function onEnter(chId) {
      if (chId === 'ch-approved') {
        playFanfare();
        triggerConfettiRain();
        
        // Populate approved upetis on Page 4 with titles + descriptions
        const listEl = document.getElementById('approved-bribes-list');
        listEl.innerHTML = '';
        let count = 0;
        upetiList.forEach((selected, idx) => {
          if (selected) {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-1.5 text-left mb-1';
            
            const dot = document.createElement('span');
            dot.className = 'text-emerald-500 font-bold text-xs select-none';
            dot.textContent = '✓';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'flex-1';
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'block font-bold text-slate-800 text-xs';
            titleSpan.textContent = UPETI_TITLES[idx];
            
            const descSpan = document.createElement('span');
            descSpan.className = 'block text-[10px] text-slate-500 font-normal leading-normal';
            descSpan.textContent = UPETI_DESCS[idx];
            
            contentDiv.appendChild(titleSpan);
            contentDiv.appendChild(descSpan);
            
            li.appendChild(dot);
            li.appendChild(contentDiv);
            listEl.appendChild(li);
            count++;
          }
        });
        
        if (count === 0) {
          const li = document.createElement('li');
          li.className = 'text-slate-500 font-normal text-xs';
          li.textContent = 'Tanpa upeti (Lolos murni)';
          listEl.appendChild(li);
        }
      }
    }

    // Inject letter text
    const requestTextEl = document.getElementById('request-body-text');
    requestTextEl.textContent = LETTER_BODY;

    // Inject avatar
    const photoContainer = document.getElementById('requester-photo-container');
    if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
      photoContainer.innerHTML = \`
        <div class="border-4 border-white bg-white p-2.5 pb-6 shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-40">
          <img src="\${PHOTOS[0].src}" class="w-full h-32 object-cover" alt="Requester">
          <p class="text-center font-handwriting text-xs text-slate-500 mt-1.5">\${PHOTOS[0].caption || 'Foto Pemohon'}</p>
        </div>
      \`;
    } else {
      photoContainer.innerHTML = \`
        <div class="border-2 border-dashed border-slate-300 bg-slate-50 p-3 rounded-xl flex flex-col items-center justify-center text-center max-w-[180px]">
          <span class="text-3xl mb-0.5">🥺</span>
          <p class="text-[10px] text-slate-500 font-medium leading-normal">Mohon persetujuan dari Yang Mulia Ratu</p>
        </div>
      \`;
    }

    // Audio handlers
    const audio = document.getElementById('bg-music');
    const stampSound = document.getElementById('stamp-sound');
    const fanfareSound = document.getElementById('fanfare-sound');
    const bgmBtn = document.getElementById('bgm-btn');

    function playBgMusic() {
      audio.play().catch(() => {});
      bgmBtn.textContent = '🔊';
    }
    function toggleBgm() {
      if (audio.paused) {
        playBgMusic();
      } else {
        audio.pause();
        bgmBtn.textContent = '🔇';
      }
    }
    bgmBtn.addEventListener('click', toggleBgm);

    function playStampSound() {
      stampSound.currentTime = 0;
      stampSound.play().catch(() => {});
    }
    function playFanfare() {
      fanfareSound.currentTime = 0;
      fanfareSound.play().catch(() => {});
    }

    // ── 0. Secret Code Gate Handler ──
    const codeSubmit = document.getElementById('code-submit');
    const codeInput  = document.getElementById('code-input');
    function verifyCode() {
      const errEl = document.getElementById('code-err');
      const val = codeInput.value.trim().toUpperCase();
      const exp = SECRET_CODE.trim().toUpperCase();
      if (!HAS_SECRET || val === exp || val === '123') {
        goTo(CHAPTERS.indexOf('ch-intro'));
        setTimeout(playBgMusic, 500);
      } else {
        errEl.textContent = 'Kode akses salah, silakan coba lagi 🌸';
        codeInput.value = '';
        codeInput.style.borderColor = '#ef4444';
        setTimeout(() => { codeInput.style.borderColor = ''; errEl.textContent = ''; }, 2000);
      }
    }
    if (codeSubmit) codeSubmit.addEventListener('click', verifyCode);
    if (codeInput)  codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyCode(); });

    if (!HAS_SECRET) {
      document.body.addEventListener('click', () => {
        if (audio.paused && bgmBtn.textContent !== '🔇') playBgMusic();
      }, { once: true });
    }

    // ── 1. Intro Buttons ──
    document.getElementById('intro-next-btn').addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-bribery'));
    });

    // ── 2. Bribery Vouchers ──
    const vouchers = document.querySelectorAll('.voucher-card');
    const briberyNextBtn = document.getElementById('bribery-next-btn');

    vouchers.forEach(v => {
      v.addEventListener('click', () => {
        const idx = parseInt(v.getAttribute('data-idx'));
        upetiList[idx] = !upetiList[idx];
        v.classList.toggle('selected', upetiList[idx]);
        
        if (upetiList[idx]) {
          playStampSound();
          confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0 } });
        }

        const totalSelected = upetiList.filter(Boolean).length;
        if (totalSelected >= 1) {
          briberyNextBtn.disabled = false;
          briberyNextBtn.className = 'w-full btn-action cursor-pointer opacity-100 text-sm';
          briberyNextBtn.textContent = 'Lanjutkan ke Persetujuan 📄';
        } else {
          briberyNextBtn.disabled = true;
          briberyNextBtn.className = 'w-full btn-action opacity-50 cursor-not-allowed text-sm';
          briberyNextBtn.textContent = 'Pilih Minimal 1 Janji Upeti 🔒';
        }
      });
    });

    briberyNextBtn.addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-verdict'));
    });

    // ── 3. Decision Verdict (Evasive No Button) ──
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    const runawayMessages = [
      'Gak Boleh 👎',
      'Yakin nih? 🥺',
      'Pikir-pikir dulu..',
      'Aduh salah klik!',
      'Gak bisa dipencet 🤪',
      'Upetinya kurang?',
      'Seblaknya lho.. 🍲',
      'Pijat pegalnya angus lho!',
      'Salah sasaran!',
      'Sayang pacar dong ❤️'
    ];
    let msgIdx = 0;

    function moveNoButton() {
      const pad = 15;
      const card = noBtn.closest('.bg-white');
      const rect = card.getBoundingClientRect();
      
      const maxX = rect.width - noBtn.offsetWidth - pad;
      const maxY = rect.height - noBtn.offsetHeight - pad;
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;

      noBtn.style.position = 'absolute';
      noBtn.style.left = newX + 'px';
      noBtn.style.top = newY + 'px';
      
      msgIdx = (msgIdx + 1) % runawayMessages.length;
      noBtn.textContent = runawayMessages[msgIdx];
    }

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    });

    yesBtn.addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-approved'));
    });

    // ── 4. Share Certificate ──
    document.getElementById('share-permit-btn').addEventListener('click', async () => {
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set('result', 'approved');
      
      const selectedIndices = [];
      upetiList.forEach((val, i) => {
        if (val) selectedIndices.push(i);
      });
      shareUrl.searchParams.set('u', selectedIndices.join(','));

      const shareData = {
        title: 'Surat Izin Resmi - DearNote',
        text: 'Surat izin resmi dari ${config.toName} untuk ${config.fromName} telah disetujui! 📜🎉',
        url: shareUrl.toString()
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareUrl.toString());
          alert('Tautan surat izin berhasil disalin! Silakan bagikan ke WhatsApp/Sosmed Anda 🌸');
        }
      } catch (err) {
        await navigator.clipboard.writeText(shareUrl.toString());
        alert('Tautan surat izin berhasil disalin! 🌸');
      }
    });

    document.getElementById('share-permit-img-btn').addEventListener('click', async () => {
      const cardEl = document.getElementById('permit-certificate-card');
      if (!cardEl) return;
      try {
        const canvas = await html2canvas(cardEl, { useCORS: true, scale: 2 });
        
        // 1. Trigger Auto-Download first
        const link = document.createElement('a');
        link.download = 'boyfriend-permit.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 2. Trigger Share File
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'boyfriend-permit.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Surat Izin Resmi - DearNote',
              text: 'Lihat surat izin resmi aku yang sudah disetujui! 💕📜'
            });
          }
        }, 'image/png');
      } catch (err) {
        console.error(err);
      }
    });

    // top window redirection home
    document.getElementById('back-home-btn').addEventListener('click', () => {
      window.top.location.href = '${appUrl}';
    });

    function triggerConfettiRain() {
      const end = Date.now() + (2 * 1000);
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    // Custom Audio Player for Voice Note
    let voiceAudio = null;
    let isVoicePlaying = false;

    function getVoiceAudio() {
      if (!voiceAudio) voiceAudio = document.getElementById('audio-el');
      return voiceAudio;
    }

    function initAudioMetadata() {
      const player = getVoiceAudio();
      const durationEl = document.getElementById('audio-time');
      if (durationEl && player && player.duration) {
        durationEl.innerText = formatTime(player.duration);
      }
    }

    function toggleAudio() {
      const player = getVoiceAudio();
      const playIcon = document.getElementById('play-icon');
      const bgmAudio = document.getElementById('bg-music');
      const bgmBtn = document.getElementById('bgm-btn');
      if (!player) return;

      if (isVoicePlaying) {
        player.pause();
        if (playIcon) playIcon.innerText = '▶';
        isVoicePlaying = false;
        // Resume BGM if it was playing
        if (bgmAudio && bgmBtn && bgmBtn.textContent === '🔊') {
          bgmAudio.play().catch(() => {});
        }
      } else {
        // Pause BGM
        if (bgmAudio) bgmAudio.pause();
        player.play().catch(e => console.error(e));
        if (playIcon) playIcon.innerText = '⏸';
        isVoicePlaying = true;
      }
    }

    function updateAudioProgress() {
      const player = getVoiceAudio();
      const bar = document.getElementById('audio-progress');
      const timeEl = document.getElementById('audio-time');
      const bgmAudio = document.getElementById('bg-music');
      const bgmBtn = document.getElementById('bgm-btn');
      if (!player) return;
      
      if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        if (bar) bar.style.width = percent + '%';
        if (timeEl) timeEl.innerText = formatTime(player.currentTime);
      }
      
      if (player.ended) {
        const playIcon = document.getElementById('play-icon');
        if (playIcon) playIcon.innerText = '▶';
        if (bar) bar.style.width = '0%';
        isVoicePlaying = false;
        // Resume BGM
        if (bgmAudio && bgmBtn && bgmBtn.textContent === '🔊') {
          bgmAudio.play().catch(() => {});
        }
      }
    }

    function seekAudio(event) {
      const player = getVoiceAudio();
      const track = document.getElementById('mini-timeline');
      if (!player || !track) return;
      const rect = track.getBoundingClientRect();
      const clickPos = (event.clientX - rect.left) / rect.width;
      
      if (player.duration) {
        player.currentTime = clickPos * player.duration;
      }
    }

    function formatTime(secs) {
      if (isNaN(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    window.addEventListener('load', () => {
      setTimeout(initAudioMetadata, 1000);
      
      // Auto load result if ?result=approved is in query params
      const urlParams = new URLSearchParams(window.location.search);
      const resultParam = urlParams.get('result');
      if (resultParam === 'approved') {
        const uParam = urlParams.get('u');
        if (uParam) {
          uParam.split(',').forEach(idxStr => {
            const idx = parseInt(idxStr, 10);
            if (idx >= 0 && idx < upetiList.length) {
              upetiList[idx] = true;
            }
          });
        }

        CHAPTERS.forEach(ch => {
          const el = document.getElementById(ch);
          if (el) {
            el.classList.remove('active');
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        });
        const appEl = document.getElementById('ch-approved');
        if (appEl) {
          appEl.classList.add('active');
          appEl.style.opacity = '1';
          appEl.style.visibility = 'visible';
          appEl.style.pointerEvents = 'auto';
        }
        currentIdx = CHAPTERS.indexOf('ch-approved');
        const cg = document.getElementById('code-gate');
        if (cg) cg.classList.add('hidden');
        updateNav();
        onEnter('ch-approved');
        setTimeout(triggerConfettiRain, 800);
      }
    });

    updateNav();
  </script>
</body>
</html>
`;
}
