import { PublishedConfig } from "../../schemas/card-draft";

export function generateSelfieDetectorHtml(config: PublishedConfig): string {
  const appUrl = process.env.APP_URL || "https://dearnote.asia";
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Penyelidikan Kangen Akut 🔍";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote && !!config.voiceNote.src;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-funny-story-2877.mp3";

  // Parse custom upeti values (format: "title|desc")
  const favoriteMoments = config.favoriteMoments || [];
  const defaultUpeti = [
    { emoji: "🧋", title: "Sogokan Boba Gula Aren", desc: "Boba dingin manis diantarkan langsung ke rumahmu." },
    { emoji: "🫂", title: "Voucher Pelukan Hangat", desc: "Pelukan erat 10 menit tanpa syarat kapan pun kamu mau." },
    { emoji: "🚗", title: "Nurut Ditemani Jalan-Jalan", desc: "Pergi ke mana pun kamu mau tanpa protes/cemberut." },
    { emoji: "☕", title: "Kopi Susu Favorit", desc: "Segelas es kopi susu caramel macchiato kesukaanmu." }
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
  <title>Detective Beauty Dossier – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Fredoka:wght@500;700&family=Gochi+Hand&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            courier: ['"Courier Prime"', 'monospace'],
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
      background: radial-gradient(circle, #f4ecd8 0%, #e2d4b7 100%);
      min-height: 100vh;
      overflow: hidden;
      color: #3e2723;
      font-family: 'Plus Jakarta Sans', sans-serif;
      touch-action: manipulation;
    }

    /* Retro grid pattern */
    .grid-bg {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(141, 110, 99, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(141, 110, 99, 0.05) 1px, transparent 1px);
      background-size: 24px 24px;
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
      background: #8d6e63;
      border: 2px solid #5d4037;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
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
      background: linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%);
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

    #ch-approved {
      justify-content: flex-start;
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
    }

    /* Auto scale down on short screens */
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

    /* Folder dossier look */
    .dossier-folder {
      border: 3px solid #5d4037;
      background: #fdfbf7;
      box-shadow: 12px 12px 0px #8d6e63;
      position: relative;
    }

    .dossier-tab {
      position: absolute;
      top: -32px;
      left: 16px;
      height: 32px;
      background: #fdfbf7;
      border: 3px solid #5d4037;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 0 16px;
      display: flex;
      align-items: center;
      font-family: 'Courier Prime', monospace;
      font-weight: bold;
      font-size: 11px;
      color: #5d4037;
      z-index: 5;
    }

    /* Rubber stamp style */
    .dossier-stamp {
      border: 3px dashed #d84315;
      color: #d84315;
      font-family: 'Courier Prime', monospace;
      font-weight: bold;
      text-transform: uppercase;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      transform: rotate(-8deg);
      display: inline-block;
    }

    .voucher-card {
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      background: #faf6f0;
      border: 2px solid #d7ccc8;
    }
    .voucher-card.selected {
      border-color: #d84315;
      background: #fbe9e7;
    }
    .rubber-promised {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-12deg) scale(3);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 3px dashed #d84315;
      color: #d84315;
      font-family: 'Courier Prime', monospace;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 10;
    }
    .voucher-card.selected .rubber-promised {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(-12deg) scale(1);
    }

    /* Red runaway button */
    #no-btn {
      position: relative;
      transition: all 0.15s ease-out;
    }

    /* Custom camera input trigger styling */
    .camera-trigger-box {
      border: 3px dashed #8d6e63;
      background: #faf6f0;
      transition: all 0.2s;
      cursor: pointer;
    }
    .camera-trigger-box:hover {
      background: #f5e6ca;
      border-color: #5d4037;
    }

    /* Polaroid frame for results */
    .polaroid-frame {
      background: white;
      box-shadow: 0 8px 24px rgba(93, 64, 55, 0.2);
      border: 1px solid #d7ccc8;
    }

    /* Stamp verified */
    .verified-stamp {
      border: 3px solid #2e7d32;
      color: #2e7d32;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: 'Courier Prime', monospace;
      font-weight: bold;
      text-transform: uppercase;
      transform: rotate(-10deg);
      display: inline-block;
      letter-spacing: 1px;
      font-size: 0.9rem;
      white-space: nowrap;
      flex-shrink: 0;
      background: rgba(255,255,255,0.9);
      box-shadow: 0 4px 10px rgba(46,125,50,0.15);
      animation: stamp-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      opacity: 0;
    }
    @keyframes stamp-pop {
      0% { transform: rotate(-10deg) scale(3); opacity: 0; }
      100% { transform: rotate(-10deg) scale(1); opacity: 1; }
    }

    .btn-action {
      background: #5d4037;
      color: white;
      font-weight: bold;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: 2px solid #3e2723;
      box-shadow: 4px 4px 0px #3e2723;
      transition: all 0.15s;
    }
    .btn-action:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px #3e2723;
    }
    .btn-action:active {
      transform: translate(4px, 4px);
      box-shadow: 0px 0px 0px #3e2723;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body class="relative min-h-screen">
  <div class="grid-bg"></div>

  <!-- Audio elements -->
  <audio id="bg-music" src="${bgMusicSrc}" loop preload="auto"></audio>
  <audio id="stamp-sound" src="https://assets.mixkit.co/active_storage/sfx/2012/2012-84.wav" preload="auto"></audio>
  <audio id="camera-sound" src="https://assets.mixkit.co/active_storage/sfx/1672/1672-84.wav" preload="auto"></audio>
  <audio id="fanfare-sound" src="https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav" preload="auto"></audio>

  <!-- Floating BGM Toggle -->
  <div id="bgm-btn" title="Toggle Music">🎵</div>

  <!-- ── 0. SECRET CODE GATE SCREEN ── -->
  ${
    hasSecretCode
      ? `
  <div id="code-gate">
    <div class="bg-white p-8 rounded-2xl border-2 border-[#5d4037] shadow-xl max-w-sm w-full text-center relative z-10">
      <div class="text-4xl mb-3">🔒</div>
      <h2 class="text-xl font-bold font-courier text-[#5d4037] mb-2">BERKAS RAHASIA DETEKTIF</h2>
      <p class="text-xs text-slate-500 mb-6">Dokumen penyelidikan kangen. Masukkan sandi otentikasi untuk membuka berkas.</p>
      <input type="password" id="code-input" placeholder="Sandi Otentikasi" class="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:outline-none focus:border-[#8d6e63] text-center mb-4 font-mono text-lg">
      <p id="code-err" class="text-red-500 text-xs mb-3 font-semibold"></p>
      <button id="code-submit" class="w-full btn-action">Buka Berkas</button>
    </div>
  </div>
  `
      : ""
  }

  <!-- Progress Bar Header -->
  <div class="fixed top-0 left-0 right-0 h-1.5 bg-[#d7ccc8] z-50">
    <div id="progress-bar" class="h-full bg-[#8d6e63] transition-all duration-300" style="width:0%"></div>
  </div>

  <!-- ── 1. INTRODUCTION & CASE DOSSIER ── -->
  <div class="chapter active" id="ch-intro">
    <div class="dossier-folder max-w-md w-full p-6 relative z-10 font-sans my-auto rounded-lg">
      <!-- Dossier Folder Tab -->
      <div class="dossier-tab">CASE_FILE: #KGN-${Math.floor(1000 + Math.random() * 9000)}</div>
      
      <!-- Dossier Header -->
      <div class="border-b-2 border-dashed border-[#8d6e63] pb-4 mb-4 mt-2">
        <span class="dossier-stamp float-right">TOP SECRET</span>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">B.P.I.P (Badan Penyelidik Kangen Pacar)</h3>
        <h1 class="text-lg font-bold font-courier text-[#3e2723] mt-1">DOKUMEN PENYELIDIKAN KASUS 🔍</h1>
      </div>

      <!-- Case Info Details -->
      <div class="space-y-2 text-xs font-mono text-[#5d4037] border-b border-[#eeb] pb-3 mb-4">
        <div class="flex justify-between">
          <span class="font-bold">Detektif Kasus:</span>
          <span>${config.fromName}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Tersangka Utama:</span>
          <span>${config.toName}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-bold">Tuduhan Kasus:</span>
          <span class="bg-[#fbe9e7] px-2 py-0.5 border border-[#ffab91] text-[#d84315] font-bold rounded">${letterTitle}</span>
        </div>
      </div>

      <!-- Pouty/Kangen Detective Photo -->
      <div id="detective-photo-container" class="flex justify-center mb-4">
        <!-- Injected by JS -->
      </div>

      <!-- Allegation Letter Body -->
      <div class="bg-[#faf6f0] border border-[#d7ccc8] rounded-xl p-3.5 max-h-[130px] overflow-y-auto">
        <span class="text-[9px] uppercase font-bold text-[#8d6e63] font-mono block mb-1">Pernyataan Tuduhan Detektif:</span>
        <p id="allegation-text" class="font-handwriting text-lg text-[#3e2723] leading-snug whitespace-pre-wrap"></p>
      </div>

      <!-- Action Button -->
      <div class="mt-5">
        <button class="btn-action w-full text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2" id="intro-next-btn">
          Lihat Tuntutan & Sogokan 🎁
        </button>
      </div>
    </div>
  </div>

  <!-- ── 2. IMALAN SOGOKAN (BRIBERY VOUCHERS) ── -->
  <div class="chapter" id="ch-bribery">
    <div class="dossier-folder max-w-md w-full p-6 relative z-10 my-auto rounded-lg">
      <div class="dossier-tab">IMALAN_LIST</div>
      
      <div class="text-center mb-4 mt-2">
        <h2 class="text-lg font-bold font-courier text-[#3e2723]">Daftar Sogokan Penyelidikan 🎁</h2>
        <p class="text-[10px] text-slate-500 font-mono mt-0.5">Ketuk imbalan di bawah untuk mencap persetujuan barang bukti.</p>
      </div>

      <!-- Voucher List -->
      <div class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        <div class="voucher-card p-3 rounded-lg cursor-pointer flex items-center justify-between" data-idx="0">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u1.emoji}</span>
            <div>
              <h4 class="text-xs font-bold font-mono text-[#3e2723]">${u1.title}</h4>
              <p class="text-[9px] text-slate-500 font-mono mt-0.5">${u1.desc}</p>
            </div>
          </div>
          <div class="rubber-promised">Promised!</div>
        </div>

        <div class="voucher-card p-3 rounded-lg cursor-pointer flex items-center justify-between" data-idx="1">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u2.emoji}</span>
            <div>
              <h4 class="text-xs font-bold font-mono text-[#3e2723]">${u2.title}</h4>
              <p class="text-[9px] text-slate-500 font-mono mt-0.5">${u2.desc}</p>
            </div>
          </div>
          <div class="rubber-promised">Promised!</div>
        </div>

        <div class="voucher-card p-3 rounded-lg cursor-pointer flex items-center justify-between" data-idx="2">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u3.emoji}</span>
            <div>
              <h4 class="text-xs font-bold font-mono text-[#3e2723]">${u3.title}</h4>
              <p class="text-[9px] text-slate-500 font-mono mt-0.5">${u3.desc}</p>
            </div>
          </div>
          <div class="rubber-promised">Promised!</div>
        </div>

        <div class="voucher-card p-3 rounded-lg cursor-pointer flex items-center justify-between" data-idx="3">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u4.emoji}</span>
            <div>
              <h4 class="text-xs font-bold font-mono text-[#3e2723]">${u4.title}</h4>
              <p class="text-[9px] text-slate-500 font-mono mt-0.5">${u4.desc}</p>
            </div>
          </div>
          <div class="rubber-promised">Promised!</div>
        </div>
      </div>

      <!-- Voice Note Player (if hasVoiceNote) -->
      ${hasVoiceNote ? `
      <div class="mt-4 p-2.5 bg-[#faf6f0] border border-[#d7ccc8] rounded-xl flex items-center gap-3">
        <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-[#5d4037] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
          <span id="play-icon" class="text-[10px] ml-0.5">▶</span>
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-[9px] font-mono font-bold text-slate-500 mb-1 text-left">🎙️ Catatan Suara Detektif</p>
          <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-slate-200 rounded-full cursor-pointer relative">
            <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#5d4037] rounded-full transition-all duration-100 ease-linear"></div>
          </div>
        </div>
        <span id="audio-time" class="text-[9px] font-mono text-slate-500 flex-shrink-0">0:00</span>
        <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
      ` : ""}

      <!-- Action Button -->
      <div class="mt-5">
        <button id="bribery-next-btn" class="w-full btn-action opacity-50 cursor-not-allowed text-xs font-mono" disabled>
          Pilih Minimal 1 Janji Imbalan 🔒
        </button>
      </div>
    </div>
  </div>

  <!-- ── 3. INTERROGATION & DECISION (RUNAWAY BUTTON) ── -->
  <div class="chapter" id="ch-verdict">
    <div class="dossier-folder max-w-md w-full p-6 relative z-10 my-auto rounded-lg text-center">
      <div class="dossier-tab">VERDICT</div>
      
      <span class="dossier-stamp mb-2">PERSIDANGAN TERSANGKA</span>
      <h2 class="text-lg font-bold font-courier text-[#3e2723] mt-2 mb-3">Apakah Anda Bersedia Mengirimkan Bukti Selfie (PAP)? 📸</h2>
      <p class="text-xs text-slate-500 font-mono px-4 mb-6">Jika setuju, detektif wajib melunasi janji sogokan yang telah Anda berikan cap tanda bukti.</p>

      <div class="text-6xl mb-6">🔍🤨</div>

      <!-- Verdict Buttons -->
      <div class="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px] px-4">
        <!-- Yes Option -->
        <button id="yes-btn" class="px-8 py-3 bg-emerald-700 border-2 border-emerald-950 text-white font-mono font-bold rounded-lg shadow-[4px_4px_0px_#064e3b] hover:scale-105 active:translate-y-1 transition-all text-sm w-full sm:w-auto min-w-[140px] relative z-20">
          Kirim PAP 📸
        </button>

        <!-- No Option (Runaway) -->
        <button id="no-btn" class="px-8 py-3 bg-rose-700 border-2 border-rose-950 text-white font-mono font-bold rounded-lg shadow-[4px_4px_0px_#4c0519] hover:scale-95 text-sm w-full sm:w-auto min-w-[140px] absolute sm:relative z-10">
          Tolak 👎
        </button>
      </div>
    </div>
  </div>

  <!-- ── 4. CAMERA ACCESS & CAPTURE ── -->
  <div class="chapter" id="ch-camera">
    <div class="dossier-folder max-w-md w-full p-6 relative z-10 my-auto rounded-lg text-center">
      <div class="dossier-tab">EVIDENCE_UPLOAD</div>
      
      <h2 class="text-lg font-bold font-courier text-[#3e2723] mt-2 mb-6">PREVIEW</h2>

      <!-- Input Elements -->
      <input type="file" id="selfie-file-input" accept="image/*" multiple class="hidden">
      <input type="file" id="selfie-camera-input" accept="image/*" capture="user" class="hidden">
      
      <!-- Interactive trigger boxes -->
      <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        <div id="trigger-camera" class="camera-trigger-box p-5 rounded-xl flex flex-col items-center justify-center shadow-inner">
          <span class="text-3xl mb-2">📸</span>
          <span class="text-xs font-mono font-bold text-[#5d4037]">Ambil Selfie</span>
          <span class="text-[9px] text-slate-400 font-mono mt-1">Buka Kamera HP</span>
        </div>
        <div id="trigger-upload" class="camera-trigger-box p-5 rounded-xl flex flex-col items-center justify-center shadow-inner">
          <span class="text-3xl mb-2">🖼️</span>
          <span class="text-xs font-mono font-bold text-[#5d4037]">Pilih Galeri</span>
          <span class="text-[9px] text-slate-400 font-mono mt-1">Pilih File Foto</span>
        </div>
      </div>

      <!-- Preview Selected File before finalizing -->
      <div id="image-preview-box" class="mt-5 hidden flex flex-col items-center">
        <div id="mini-preview-strip" class="bg-[#111] p-3 rounded-lg flex flex-col gap-2 w-28 shadow-md mb-4">
          <!-- Injected dynamically by JS -->
        </div>
        <div class="flex gap-3 justify-center w-full">
          <button id="retry-photo-btn" class="px-4 py-2.5 border-2 border-[#8d6e63] text-[#8d6e63] font-mono text-xs rounded-xl hover:bg-[#faf6f0] transition-all uppercase font-bold tracking-wider">
            Retake 🔄
          </button>
          <button id="confirm-photo-btn" class="btn-action text-xs font-mono uppercase tracking-wider px-4 py-2.5">
            Use Photo 🤝
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── 5. FINAL CERTIFICATE DECREE ── -->
  <div class="chapter" id="ch-approved">
    <div class="max-w-md w-full flex flex-col items-center">
      
      <!-- The Card targeted by html2canvas (Film reels strip) -->
      <div id="dossier-certificate-card" class="bg-[#111111] p-4 pt-7 pb-7 rounded-xl w-[200px] max-w-full shadow-2xl relative flex flex-col items-center gap-3">
        <!-- Left Sprocket Holes -->
        <div class="absolute left-2 top-0 bottom-0 w-1.5 flex flex-col justify-around py-3">
          ${Array(10).fill(0).map(() => `<div class="w-1.5 h-2.5 bg-[#e2d4b7] rounded-xs opacity-90"></div>`).join('')}
        </div>
        
        <!-- Right Sprocket Holes -->
        <div class="absolute right-2 top-0 bottom-0 w-1.5 flex flex-col justify-around py-3">
          ${Array(10).fill(0).map(() => `<div class="w-1.5 h-2.5 bg-[#e2d4b7] rounded-xs opacity-90"></div>`).join('')}
        </div>

        <!-- Vertical Film Frames -->
        <div class="w-full flex flex-col gap-3 px-1.5">
          <!-- Frame 1 -->
          <div class="bg-zinc-900 aspect-square overflow-hidden border border-zinc-800 shadow-inner rounded-xs relative">
            <img class="w-full h-full object-cover final-selfie-img-instance" style="filter: sepia(0.22) contrast(1.15) brightness(0.92) saturate(1.1);" alt="Scene 1">
            <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/20" style="mix-blend-mode: multiply;"></div>
            <span class="absolute bottom-1 right-2 text-[7px] font-mono text-zinc-400/80 tracking-widest select-none">SCENE 01</span>
          </div>
          <!-- Frame 2 -->
          <div class="bg-zinc-900 aspect-square overflow-hidden border border-zinc-800 shadow-inner rounded-xs relative">
            <img class="w-full h-full object-cover final-selfie-img-instance" style="filter: sepia(0.22) contrast(1.15) brightness(0.92) saturate(1.1);" alt="Scene 2">
            <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/20" style="mix-blend-mode: multiply;"></div>
            <span class="absolute bottom-1 right-2 text-[7px] font-mono text-zinc-400/80 tracking-widest select-none">SCENE 02</span>
          </div>
          <!-- Frame 3 -->
          <div class="bg-zinc-900 aspect-square overflow-hidden border border-zinc-800 shadow-inner rounded-xs relative">
            <img class="w-full h-full object-cover final-selfie-img-instance" style="filter: sepia(0.22) contrast(1.15) brightness(0.92) saturate(1.1);" alt="Scene 3">
            <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/20" style="mix-blend-mode: multiply;"></div>
            <span class="absolute bottom-1 right-2 text-[7px] font-mono text-zinc-400/80 tracking-widest select-none">SCENE 03</span>
          </div>
        </div>
      </div>

      <!-- Actions outside card (so they aren't screenshotted) -->
      <div class="w-full mt-4 flex flex-col gap-2 relative z-20">
        <button id="share-permit-img-btn" class="w-full btn-action flex items-center justify-center gap-2 text-xs uppercase font-mono tracking-wider bg-emerald-800 text-white font-semibold">
          📸 Bagikan Hasil Frame Selfie
        </button>
        <button id="share-permit-btn" class="w-full btn-action flex items-center justify-center gap-2 text-xs uppercase font-mono tracking-wider">
          🔗 Bagikan Link Berkas Izin
        </button>
        <button id="back-home-btn" class="w-full py-2.5 text-center text-[10px] font-mono font-bold text-[#5d4037] hover:text-[#3e2723] transition-colors">
          Kembali ke Home
        </button>
      </div>
    </div>
  </div>

  <!-- ── CAMERA WEBRTC STREAM MODAL ── -->
  <div id="camera-modal" class="fixed inset-0 bg-black/85 z-[1000] hidden flex flex-col items-center justify-center p-4">
    <div class="bg-[#fdfbf7] border-4 border-[#5d4037] rounded-2xl p-5 max-w-sm w-full text-center relative flex flex-col items-center shadow-2xl">
      <button id="close-camera-modal" class="absolute top-2 right-3 text-slate-500 hover:text-[#5d4037] text-2xl font-bold font-mono">&times;</button>
      <h3 id="camera-status-text" class="text-xs font-bold font-courier text-[#5d4037] mb-2 uppercase tracking-wider">AMBIL FOTO 1 DARI 3 📸</h3>
      
      <!-- Progress indicator dots -->
      <div class="flex gap-2 justify-center mb-3">
        <div id="cam-dot-1" class="w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors"></div>
        <div id="cam-dot-2" class="w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors"></div>
        <div id="cam-dot-3" class="w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors"></div>
      </div>

      <div class="relative w-full aspect-square bg-slate-900 rounded-xl overflow-hidden mb-4 border-2 border-[#5d4037]">
        <video id="camera-stream" autoplay playsinline class="w-full h-full object-cover scale-x-[-1]"></video>
        <canvas id="camera-canvas" class="hidden"></canvas>
      </div>
      <button id="capture-btn" class="w-full btn-action py-3 text-xs uppercase tracking-wider font-mono">Jepret Foto 📸</button>
    </div>
  </div>

  <!-- Global dots -->
  <div class="fixed bottom-4 left-0 right-0 flex justify-center gap-1.5 z-40" id="nav-dots"></div>

  <!-- Confetti script -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const HAS_BGM     = ${hasBgMusic};
    
    // Upetis
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
    CHAPTERS.push('ch-camera');
    CHAPTERS.push('ch-approved');

    let currentIdx = 0;
    const upetiList = [false, false, false, false];

    // Build dots indicator
    const navDotsEl = document.getElementById('nav-dots');
    const VISIBLE_CHAPTERS = CHAPTERS.filter(c => c !== 'code-gate');
    VISIBLE_CHAPTERS.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'w-2 h-2 rounded-full bg-[#d7ccc8] transition-colors duration-200';
      navDotsEl.appendChild(dot);
    });

    function updateNav() {
      const dots = navDotsEl.children;
      const vIdx = VISIBLE_CHAPTERS.indexOf(CHAPTERS[currentIdx]);
      Array.from(dots).forEach((d, i) => {
        d.className = i === vIdx 
          ? 'w-4 h-2 rounded-full bg-[#8d6e63] transition-all duration-200' 
          : 'w-2 h-2 rounded-full bg-[#d7ccc8] transition-all duration-200';
      });
      const pct = CHAPTERS.length > 1 ? (currentIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

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
        
        // Populate placeholders if no image is selected yet (e.g., previewing straight to final)
        document.querySelectorAll('.final-selfie-img-instance').forEach(img => {
          const s = img.getAttribute('src');
          if (!s || s === window.location.href || s === '') {
            if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
              img.src = PHOTOS[0].src;
            } else {
              img.src = "https://images.unsplash.com/photo-1518887570146-0612132dd618?w=300&auto=format&fit=crop&q=60";
            }
          }
        });
      }
    }

    // Inject letter body
    document.getElementById('allegation-text').textContent = LETTER_BODY;

    // Inject detective photo
    const photoContainer = document.getElementById('detective-photo-container');
    if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
      photoContainer.innerHTML = \`
        <div class="border-4 border-white bg-white p-2 pb-6 shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-36">
          <img src="\${PHOTOS[0].src}" class="w-full h-24 object-cover" alt="Detective">
          <p class="text-center font-handwriting text-[10px] text-slate-500 mt-1">Detektif Kasus</p>
        </div>
      \`;
    } else {
      photoContainer.innerHTML = \`
        <div class="border-2 border-dashed border-slate-300 bg-[#faf6f0] p-3 rounded-lg flex flex-col items-center justify-center text-center max-w-[160px]">
          <span class="text-3xl mb-1">🧐</span>
          <p class="text-[9px] text-[#5d4037] font-mono leading-normal">Detektif siap menyelidiki kecantikanmu.</p>
        </div>
      \`;
    }

    // Audio handlers
    const audio = document.getElementById('bg-music');
    const stampSound = document.getElementById('stamp-sound');
    const cameraSound = document.getElementById('camera-sound');
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
    function playCameraSound() {
      cameraSound.currentTime = 0;
      cameraSound.play().catch(() => {});
    }
    function playFanfare() {
      fanfareSound.currentTime = 0;
      fanfareSound.play().catch(() => {});
    }

    // ── Secret Code Gate ──
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
        errEl.textContent = 'Sandi Salah! Detektif menolak akses ❌';
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
          confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#8d6e63'] });
        }

        const totalSelected = upetiList.filter(Boolean).length;
        if (totalSelected >= 1) {
          briberyNextBtn.disabled = false;
          briberyNextBtn.className = 'w-full btn-action opacity-100 cursor-pointer';
          briberyNextBtn.textContent = 'Lanjutkan Interogasi 📄';
        } else {
          briberyNextBtn.disabled = true;
          briberyNextBtn.className = 'w-full btn-action opacity-50 cursor-not-allowed';
          briberyNextBtn.textContent = 'Pilih Minimal 1 Janji Imbalan 🔒';
        }
      });
    });

    briberyNextBtn.addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-verdict'));
    });

    // ── 3. Verdict Scale-Up / Scale-Down Buttons ──
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    const rejectMessages = [
      'Tolak 👎',
      'Yakin nih detektif? 🥺',
      'Pikir-pikir dulu..',
      'Aduh salah klik!',
      'Gak mempan detektif 🤪',
      'Sogokannya kurang?',
      'Boba-nya hangus lho! 🍲',
      'Salah sasaran!',
      'Gak bisa nolak kok ❤️'
    ];
    let msgIdx = 0;
    let noScale = 1.0;
    let yesScale = 1.0;

    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Decrease "No" button scale, increase "Yes" button scale
      noScale = Math.max(0.15, noScale - 0.15);
      yesScale += 0.35;
      
      noBtn.style.transform = "scale(" + noScale + ")";
      yesBtn.style.transform = "scale(" + yesScale + ")";
      
      noBtn.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      yesBtn.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      // Change text of no button
      msgIdx = (msgIdx + 1) % rejectMessages.length;
      noBtn.textContent = rejectMessages[msgIdx];
      
      if (noScale <= 0.2) {
        noBtn.style.opacity = '0';
        noBtn.style.pointerEvents = 'none';
      }
      
      playStampSound();
    });

    yesBtn.addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-camera'));
    });

    // ── 4. Camera & Selfie Capture ──
    const triggerUpload = document.getElementById('trigger-upload');
    const triggerCamera = document.getElementById('trigger-camera');
    const fileInput = document.getElementById('selfie-file-input');
    const cameraInput = document.getElementById('selfie-camera-input');
    const previewBox = document.getElementById('image-preview-box');
    const confirmBtn = document.getElementById('confirm-photo-btn');
    const retryBtn = document.getElementById('retry-photo-btn');
    let selectedPhotosArray = [];

    if (triggerUpload) {
      triggerUpload.addEventListener('click', () => {
        if (fileInput) fileInput.click();
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        selectedPhotosArray = [];
        const stripEl = document.getElementById('mini-preview-strip');
        if (stripEl) stripEl.innerHTML = '';
        previewBox.classList.add('hidden');
        if (triggerUpload) {
          triggerUpload.parentNode.classList.remove('hidden');
        }
        if (fileInput) fileInput.value = '';
        if (cameraInput) cameraInput.value = '';
      });
    }

    // WebRTC Camera Modal controls and Multi-Photo capture
    const cameraModal = document.getElementById('camera-modal');
    const closeCameraBtn = document.getElementById('close-camera-modal');
    const captureBtn = document.getElementById('capture-btn');
    const videoStream = document.getElementById('camera-stream');
    const cameraCanvas = document.getElementById('camera-canvas');
    let localStream = null;

    function updateCameraStatus() {
      const total = selectedPhotosArray.length;
      const statusText = document.getElementById('camera-status-text');
      if (statusText) {
        if (total < 3) {
          statusText.innerText = "AMBIL FOTO " + (total + 1) + " DARI 3 📸";
        } else {
          statusText.innerText = "SELESAI! MENGOLAH FOTO... ⚡";
        }
      }
      
      // Update dots
      for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('cam-dot-' + i);
        if (dot) {
          if (i <= total) {
            dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 transition-colors";
          } else if (i === total + 1) {
            dot.className = "w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse transition-colors";
          } else {
            dot.className = "w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors";
          }
        }
      }
    }

    if (triggerCamera) {
      triggerCamera.addEventListener('click', async () => {
        selectedPhotosArray = [];
        updateCameraStatus();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            localStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
            });
            if (videoStream) {
              videoStream.srcObject = localStream;
              cameraModal.classList.remove('hidden');
            } else {
              cameraInput.click();
            }
          } catch (err) {
            console.warn('getUserMedia failed, falling back to file input:', err);
            cameraInput.click();
          }
        } else {
          cameraInput.click();
        }
      });
    }

    if (closeCameraBtn) {
      closeCameraBtn.addEventListener('click', () => {
        stopCamera();
        cameraModal.classList.add('hidden');
        if (selectedPhotosArray.length > 0) {
          renderMiniPreviewStrip();
          previewBox.classList.remove('hidden');
          triggerUpload.parentNode.classList.add('hidden');
        }
      });
    }

    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        if (!videoStream || !cameraCanvas) return;
        const ctx = cameraCanvas.getContext('2d');
        
        const size = Math.min(videoStream.videoWidth, videoStream.videoHeight) || 480;
        cameraCanvas.width = size;
        cameraCanvas.height = size;
        
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        const sx = (videoStream.videoWidth - size) / 2 || 0;
        const sy = (videoStream.videoHeight - size) / 2 || 0;
        ctx.drawImage(videoStream, sx, sy, size, size, 0, 0, size, size);
        
        const imgData = cameraCanvas.toDataURL('image/png');
        selectedPhotosArray.push(imgData);
        playCameraSound();
        
        updateCameraStatus();

        if (selectedPhotosArray.length >= 3) {
          stopCamera();
          cameraModal.classList.add('hidden');
          renderMiniPreviewStrip();
          previewBox.classList.remove('hidden');
          triggerUpload.parentNode.classList.add('hidden');
        }
      });
    }

    function stopCamera() {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      if (videoStream) {
        videoStream.srcObject = null;
      }
    }

    function renderMiniPreviewStrip() {
      const stripEl = document.getElementById('mini-preview-strip');
      if (!stripEl) return;
      stripEl.innerHTML = '';
      
      for (let i = 0; i < 3; i++) {
        let src = "";
        if (selectedPhotosArray.length === 0) {
          src = "https://images.unsplash.com/photo-1518887570146-0612132dd618?w=100&auto=format&fit=crop&q=60";
        } else if (i < selectedPhotosArray.length) {
          src = selectedPhotosArray[i];
        } else {
          src = selectedPhotosArray[selectedPhotosArray.length - 1];
        }
        
        const frame = document.createElement('div');
        frame.className = "bg-zinc-800 aspect-square overflow-hidden border border-zinc-700 rounded-sm relative";
        
        const img = document.createElement('img');
        img.className = "w-full h-full object-cover";
        img.style.filter = "sepia(0.22) contrast(1.15) brightness(0.92) saturate(1.1)";
        img.src = src;
        
        const vignette = document.createElement('div');
        vignette.className = "absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/20";
        vignette.style.mixBlendMode = "multiply";
        
        frame.appendChild(img);
        frame.appendChild(vignette);
        stripEl.appendChild(frame);
      }
    }

    function handleMultipleImageFiles(filesList) {
      if (!filesList || filesList.length === 0) return;
      selectedPhotosArray = [];
      const files = Array.from(filesList).slice(0, 3);
      let loadedCount = 0;
      
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          selectedPhotosArray[idx] = event.target.result;
          loadedCount++;
          if (loadedCount === files.length) {
            renderMiniPreviewStrip();
            previewBox.classList.remove('hidden');
            triggerUpload.parentNode.classList.add('hidden');
          }
        };
        reader.readAsDataURL(file);
      });
    }

    fileInput.addEventListener('change', (e) => {
      handleMultipleImageFiles(e.target.files);
    });

    if (cameraInput) {
      cameraInput.addEventListener('change', (e) => {
        handleMultipleImageFiles(e.target.files);
      });
    }

    confirmBtn.addEventListener('click', () => {
      if (selectedPhotosArray.length === 0) return;
      playCameraSound();
      
      // Inject to final film strip reels
      const finalImages = document.querySelectorAll('.final-selfie-img-instance');
      finalImages.forEach((img, idx) => {
        let src = "";
        if (idx < selectedPhotosArray.length) {
          src = selectedPhotosArray[idx];
        } else {
          src = selectedPhotosArray[selectedPhotosArray.length - 1];
        }
        img.src = src;
      });
      
      // Transition to final page
      goTo(CHAPTERS.indexOf('ch-approved'));
    });

    // ── 5. Share Certificate ──
    document.getElementById('share-permit-btn').addEventListener('click', async () => {
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set('result', 'approved');
      
      const selectedIndices = [];
      upetiList.forEach((val, i) => {
        if (val) selectedIndices.push(i);
      });
      shareUrl.searchParams.set('u', selectedIndices.join(','));

      const shareData = {
        title: 'Berkas Penyelidikan Sah - DearNote',
        text: 'Berkas penyelidikan kangen dari ${config.fromName} untuk ${config.toName} disahkan bukti PAP-nya! 🔍📜',
        url: shareUrl.toString()
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareUrl.toString());
          alert('Tautan berkas berhasil disalin! Silakan bagikan ke WhatsApp/Sosmed Anda 🌸');
        }
      } catch (err) {
        await navigator.clipboard.writeText(shareUrl.toString());
        alert('Tautan berkas berhasil disalin! 🌸');
      }
    });

    document.getElementById('share-permit-img-btn').addEventListener('click', async () => {
      const cardEl = document.getElementById('dossier-certificate-card');
      if (!cardEl) return;
      try {
        const canvas = await html2canvas(cardEl, { useCORS: true, scale: 2 });
        
        // Auto-Download
        const link = document.createElement('a');
        link.download = 'selfie-dossier-permit.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Share File
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'selfie-dossier-permit.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Berkas Penyelidikan Sah - DearNote',
              text: 'Lihat surat keputusan bukti PAP resmi aku! 🔍📜'
            });
          }
        }, 'image/png');
      } catch (err) {
        console.error(err);
      }
    });

    document.getElementById('back-home-btn').addEventListener('click', () => {
      window.top.location.href = '${appUrl}';
    });

    function triggerConfettiRain() {
      const end = Date.now() + (2 * 1000);
      const colors = ['#8d6e63', '#d7ccc8', '#10b981', '#f59e0b'];

      (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
        if (Date.now() < end) requestAnimationFrame(frame);
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
        if (bgmAudio && bgmBtn && bgmBtn.textContent === '🔊') {
          bgmAudio.play().catch(() => {});
        }
      } else {
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
      if (player.duration) player.currentTime = clickPos * player.duration;
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
            if (idx >= 0 && idx < upetiList.length) upetiList[idx] = true;
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
