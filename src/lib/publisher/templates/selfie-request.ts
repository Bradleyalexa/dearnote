import { PublishedConfig } from "../../schemas/card-draft";

export function generateSelfieRequestHtml(config: PublishedConfig): string {
  const appUrl = process.env.APP_URL || "https://dearnote.asia";
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Minta PAP Lucu 🥺";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote && !!config.voiceNote.src;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-funny-story-2877.mp3";

  // Parse custom upeti values (format: "title|desc")
  const favoriteMoments = config.favoriteMoments || [];
  const defaultUpeti = [
    { emoji: "🧋", title: "Ditraktir Boba Kekinian", desc: "Boba brown sugar boba milk premium dingin manis." },
    { emoji: "💆‍♀️", title: "Voucher Pijit Pegel Kustom", desc: "Siap mijetin pundak/kaki kamu kapan pun kamu lelah." },
    { emoji: "🧸", title: "Pelukan & Manja Sepuasnya", desc: "Manja-manjaan bareng seharian tanpa diganggu." },
    { emoji: "🥞", title: "Masakan / Makanan Favorit", desc: "Dibuatkan/dibelikan makanan kesukaanmu sampai kenyang." }
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
  <title>Selfie Request Pager – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Gochi+Hand&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
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
      background: linear-gradient(135deg, #fde2e4 0%, #ffcad4 50%, #b5e2fa 100%);
      min-height: 100vh;
      overflow: hidden;
      color: #4a4e69;
      font-family: 'Plus Jakarta Sans', sans-serif;
      touch-action: manipulation;
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
      border: 2px solid #ffcad4;
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
      background: linear-gradient(135deg, #fde2e4 0%, #b5e2fa 100%);
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

    /* Frame style decoration visibility rules */
    .style-decor {
      display: none !important;
    }
    
    .frame-style-1 .style-1-only {
      display: block !important;
    }
    .frame-style-2 .style-2-only {
      display: block !important;
    }
    .frame-style-3 .style-3-only {
      display: block !important;
    }

    /* Style 1: Scribble Doodle */
    .frame-style-1 {
      background-color: #fffaf0 !important;
      border: 3px dashed #ff758f !important;
      background-image: 
        linear-gradient(rgba(255, 117, 143, 0.08) 1.5px, transparent 1.5px),
        linear-gradient(90deg, rgba(255, 117, 143, 0.08) 1.5px, transparent 1.5px) !important;
      background-size: 14px 14px !important;
    }
    .frame-style-1 .photo-holder {
      border: 3px solid #ff758f !important;
      border-radius: 8px !important;
    }

    /* Style 2: Cute Animals & Fruits */
    .frame-style-2 {
      background-color: #fff5f7 !important;
      border: 3px solid #ffaec9 !important;
    }
    .frame-style-2 .photo-holder {
      border: 3px solid #ffaec9 !important;
      border-radius: 18px !important;
    }

    /* Style 3: Romantic Ribbon */
    .frame-style-3 {
      background-color: #ffeef2 !important;
      border: 3px solid #ff4d6d !important;
    }
    .frame-style-3 .photo-holder {
      border: 3px solid #ff4d6d !important;
      border-radius: 6px !important;
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

    /* Chat window glassmorphism */
    .chat-window {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 16px 32px rgba(255, 180, 190, 0.2);
    }

    /* Bubble animation */
    .chat-bubble {
      opacity: 0;
      transform: translateY(10px);
      animation: bubble-in 0.4s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes bubble-in {
      to { opacity: 1; transform: translateY(0); }
    }

    .voucher-card {
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }
    .voucher-card.selected {
      border-color: #ff8fa3;
      background: #fff0f3;
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
      border: 3px dashed #ff4d6d;
      color: #ff4d6d;
      font-family: 'Fredoka', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      background-color: rgba(255, 255, 255, 0.9);
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

    /* Polaroid frame for results */
    .polaroid-frame {
      background: white;
      box-shadow: 0 12px 28px rgba(255, 77, 109, 0.15);
      border: 1px solid #ffcad4;
    }

    /* Stamp verified */
    .verified-stamp {
      border: 3px solid #ff4d6d;
      color: #ff4d6d;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: 'Fredoka', sans-serif;
      font-weight: bold;
      text-transform: uppercase;
      transform: rotate(-12deg);
      display: inline-block;
      letter-spacing: 1px;
      font-size: 0.9rem;
      white-space: nowrap;
      flex-shrink: 0;
      background: rgba(255,255,255,0.9);
      box-shadow: 0 4px 10px rgba(255,77,109,0.15);
      animation: stamp-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      opacity: 0;
    }
    @keyframes stamp-pop {
      0% { transform: rotate(-12deg) scale(3); opacity: 0; }
      100% { transform: rotate(-12deg) scale(1); opacity: 1; }
    }

    .btn-action {
      background: linear-gradient(135deg, #ff8fa3, #ff4d6d);
      color: white;
      font-weight: 600;
      padding: 0.8rem 1.8rem;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(255,77,109,0.25);
      transition: all 0.2s;
    }
    .btn-action:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 16px rgba(255,77,109,0.35);
    }
    .btn-action:active {
      transform: scale(0.98);
    }

    .camera-trigger-box {
      border: 2px dashed #ff8fa3;
      background: #fff0f3;
      transition: all 0.2s;
      cursor: pointer;
    }
    .camera-trigger-box:hover {
      background: #ffe5ec;
      border-color: #ff4d6d;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body class="relative min-h-screen">

  <!-- Audio Player Elements -->
  <audio id="bg-music" src="${bgMusicSrc}" loop preload="auto"></audio>
  <audio id="stamp-sound" src="https://assets.mixkit.co/active_storage/sfx/2012/2012-84.wav" preload="auto"></audio>
  <audio id="camera-sound" src="https://assets.mixkit.co/active_storage/sfx/1672/1672-84.wav" preload="auto"></audio>
  <audio id="fanfare-sound" src="https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav" preload="auto"></audio>
  <audio id="bubble-sound" src="https://assets.mixkit.co/active_storage/sfx/2011/2011-84.wav" preload="auto"></audio>

  <!-- Floating BGM Toggle -->
  <div id="bgm-btn" title="Toggle Music">🎵</div>

  <!-- ── 0. SECRET CODE GATE SCREEN ── -->
  ${
    hasSecretCode
      ? `
  <div id="code-gate">
    <div class="bg-white p-8 rounded-3xl border border-pink-200 shadow-xl max-w-sm w-full text-center relative z-10">
      <div class="text-4xl mb-3">💬🔒</div>
      <h2 class="text-xl font-bold font-fredoka text-[#ff4d6d] mb-2">Chat Rahasia Dikunci</h2>
      <p class="text-xs text-slate-500 mb-6">Masukkan PIN otentikasi kustom untuk membuka chat room.</p>
      <input type="password" id="code-input" placeholder="PIN Rahasia" class="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-center mb-4 font-fredoka text-lg">
      <p id="code-err" class="text-red-500 text-xs mb-3 font-semibold"></p>
      <button id="code-submit" class="w-full btn-action">Buka Chat</button>
    </div>
  </div>
  `
      : ""
  }

  <!-- Progress Bar Header -->
  <div class="fixed top-0 left-0 right-0 h-1.5 bg-[#f5d6da] z-50">
    <div id="progress-bar" class="h-full bg-pink-500 transition-all duration-300" style="width:0%"></div>
  </div>

  <!-- ── 1. CHAT THREAD INTRODUCTION ── -->
  <div class="chapter active" id="ch-intro">
    <div class="chat-window max-w-md w-full rounded-3xl p-5 relative z-10 my-auto flex flex-col h-[520px] justify-between">
      
      <!-- Chat Room Header -->
      <div class="flex items-center gap-3 border-b border-pink-100 pb-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center font-bold font-fredoka text-sm shadow-md">
          ${config.fromName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-700">${config.fromName}</h3>
          <span class="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Online (Shortage of You)
          </span>
        </div>
      </div>

      <!-- Live-Chat-Like Container -->
      <div id="chat-thread-box" class="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
        
        <!-- Bubble 1 (Left/Sender) -->
        <div class="chat-bubble flex gap-2 max-w-[85%] items-start" style="animation-delay: 0.3s">
          <div class="bg-white text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-xs leading-normal">
            Aduh sayang... kangen banget deh hari ini 🥺❤️
          </div>
        </div>

        <!-- Bubble 2 (Left/Sender requester photo if present) -->
        <div id="chat-photo-bubble" class="chat-bubble flex gap-2 max-w-[85%] items-start hidden" style="animation-delay: 1.2s">
          <!-- Injected by JS -->
        </div>

        <!-- Bubble 3 (Left/Sender kangen title) -->
        <div class="chat-bubble flex gap-2 max-w-[85%] items-start" style="animation-delay: 2s">
          <div class="bg-white text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-xs leading-normal">
            Aku butuh asupan vitamin pap kamu. Boleh minta foto pap kamu yang paling cantik? 🥺👉👈
          </div>
        </div>

        <!-- Bubble 4 (Left/Sender Letter Body) -->
        <div class="chat-bubble flex gap-2 max-w-[85%] items-start" style="animation-delay: 3s">
          <div class="bg-pink-100/60 text-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-pink-200/50 shadow-xs leading-relaxed whitespace-pre-wrap font-handwriting text-base" id="chat-letter-content">
            <!-- Text injected -->
          </div>
        </div>

      </div>

      <!-- Chat Input Mock Footer -->
      <div class="border-t border-pink-100 pt-3 flex justify-center">
        <button id="intro-next-btn" class="w-full btn-action flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold">
          Balas & Lihat Sogokan 🎁
        </button>
      </div>

    </div>
  </div>

  <!-- ── 2. IMALAN VOUCHERS ── -->
  <div class="chapter" id="ch-bribery">
    <div class="chat-window max-w-md w-full rounded-3xl p-5 relative z-10 my-auto">
      
      <div class="text-center mb-4">
        <h2 class="text-lg font-bold font-fredoka text-[#ff4d6d]">Sogokan Kangen Manis 🎁</h2>
        <p class="text-[10px] text-slate-500 mt-0.5">Pilih minimal 1 sogokan manis sebagai imbalan foto selfie cantikmu!</p>
      </div>

      <!-- Vouchers list -->
      <div class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        <div class="voucher-card p-3 border border-pink-100 bg-white rounded-xl cursor-pointer flex items-center justify-between" data-idx="0">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u1.emoji}</span>
            <div>
              <h4 class="text-xs font-bold text-slate-700">${u1.title}</h4>
              <p class="text-[9px] text-slate-500 mt-0.5">${u1.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <div class="voucher-card p-3 border border-pink-100 bg-white rounded-xl cursor-pointer flex items-center justify-between" data-idx="1">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u2.emoji}</span>
            <div>
              <h4 class="text-xs font-bold text-slate-700">${u2.title}</h4>
              <p class="text-[9px] text-slate-500 mt-0.5">${u2.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <div class="voucher-card p-3 border border-pink-100 bg-white rounded-xl cursor-pointer flex items-center justify-between" data-idx="2">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u3.emoji}</span>
            <div>
              <h4 class="text-xs font-bold text-slate-700">${u3.title}</h4>
              <p class="text-[9px] text-slate-500 mt-0.5">${u3.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>

        <div class="voucher-card p-3 border border-pink-100 bg-white rounded-xl cursor-pointer flex items-center justify-between" data-idx="3">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${u4.emoji}</span>
            <div>
              <h4 class="text-xs font-bold text-slate-700">${u4.title}</h4>
              <p class="text-[9px] text-slate-500 mt-0.5">${u4.desc}</p>
            </div>
          </div>
          <div class="rubber-stamp">Promised!</div>
        </div>
      </div>

      <!-- Voice Note Player (if hasVoiceNote) -->
      ${hasVoiceNote ? `
      <div class="mt-4 p-2.5 bg-white border border-pink-100 rounded-xl flex items-center gap-3">
        <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-[#ff4d6d] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
          <span id="play-icon" class="text-[10px] ml-0.5">▶</span>
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-[9px] font-bold text-slate-450 mb-1 text-left">🎙️ Catatan Suara Pasangan</p>
          <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-slate-200 rounded-full cursor-pointer relative">
            <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#ff4d6d] rounded-full transition-all duration-100 ease-linear"></div>
          </div>
        </div>
        <span id="audio-time" class="text-[9px] text-slate-400 flex-shrink-0">0:00</span>
        <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
      ` : ""}

      <!-- Action Button -->
      <div class="mt-5">
        <button id="bribery-next-btn" class="w-full btn-action opacity-50 cursor-not-allowed text-xs font-bold uppercase tracking-wider" disabled>
          Pilih Minimal 1 Janji Imbalan 🔒
        </button>
      </div>

    </div>
  </div>

  <!-- ── 3. VERDICT DECISION ── -->
  <div class="chapter" id="ch-verdict">
    <div class="chat-window max-w-md w-full rounded-3xl p-6 relative z-10 my-auto text-center">
      <h2 class="text-xl font-bold font-fredoka text-[#ff4d6d] mb-2">Kasih PAP Selfie Cantik Nggak Ya? 📸</h2>
      <p class="text-xs text-slate-500 px-4 mb-6">Jika disetujui, si doi harus melunasi seluruh janji/sogokan di atas secara jujur!</p>

      <div class="text-7xl mb-6 animate-pulse">🥺<br>👉👈</div>

      <!-- Verdict Buttons -->
      <div class="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px] px-4">
        <!-- Yes Option -->
        <button id="yes-btn" class="px-8 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-transform text-sm w-full sm:w-auto min-w-[140px] relative z-20">
          Kasih PAP 📸
        </button>

        <!-- No Option (Runaway) -->
        <button id="no-btn" class="px-8 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-95 text-sm w-full sm:w-auto min-w-[140px] absolute sm:relative z-10">
          Gak Mau 👎
        </button>
      </div>
    </div>
  </div>

  <!-- ── 4. CAMERA ACCESSIBILITY ── -->
  <div class="chapter" id="ch-camera">
    <div class="chat-window max-w-md w-full rounded-3xl p-6 relative z-10 my-auto text-center">
      <h2 class="text-lg font-bold font-fredoka text-[#ff4d6d] mt-2 mb-2">Jepret Selfie Cantik Kamu 📸</h2>
      <p class="text-xs text-slate-500 mb-6 font-sans">Ambil foto baru atau upload foto selfie terbaikmu untuk dipasang ke frame polaroid kustom.</p>

      <input type="file" id="selfie-file-input" accept="image/*" class="hidden">
      <input type="file" id="selfie-camera-input" accept="image/*" capture="user" class="hidden">

      <!-- Upload box triggers -->
      <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        <div id="trigger-camera" class="camera-trigger-box p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <span class="text-3xl mb-1.5">📸</span>
          <span class="text-xs font-bold text-[#ff4d6d]">Ambil Selfie</span>
          <span class="text-[8px] text-slate-400 mt-0.5">Buka Kamera HP</span>
        </div>
        <div id="trigger-upload" class="camera-trigger-box p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <span class="text-3xl mb-1.5">🖼️</span>
          <span class="text-xs font-bold text-[#ff4d6d]">Pilih Galeri</span>
          <span class="text-[8px] text-slate-400 mt-0.5">Pilih File Foto</span>
        </div>
      </div>

      <!-- Preview selected file -->
      <div id="image-preview-box" class="mt-5 hidden flex flex-col items-center">
        <div class="border-4 border-white bg-white p-2.5 pb-6 shadow-md w-44 rotate-2">
          <img id="temp-preview-img" class="w-full h-36 object-cover" src="">
        </div>
        <button id="confirm-photo-btn" class="btn-action mt-6 text-xs uppercase tracking-wider">
          Pasang ke Frame & Selesai ✨
        </button>
      </div>
    </div>
  </div>

  <!-- ── 5. FINAL CERTIFICATE ── -->
  <div class="chapter" id="ch-approved">
    <div class="max-w-md w-full flex flex-col items-center">
      
      <!-- Polaroid framed photo card to render -->
      <div id="chat-certificate-card" class="bg-gradient-to-tr from-[#ffe5ec] to-[#ffb3c1] border-4 border-white rounded-[32px] p-6 relative z-10 w-full shadow-2xl font-sans text-center flex flex-col items-center overflow-hidden">
        <!-- Floating glitter star sticker -->
        <div class="absolute -top-3 -left-2 text-3xl animate-bounce">✨</div>
        <div class="absolute -bottom-3 -right-2 text-3xl animate-bounce" style="animation-delay: 0.5s">💖</div>

        <div class="text-center mb-5">
          <span class="text-[9px] font-bold uppercase tracking-widest text-[#ff4d6d] font-fredoka">SELFIE COMPLETED • DEARNOTE</span>
        </div>

        <!-- Polaroid Frame representing the evidence -->
        <div id="polaroid-frame" class="relative p-4 pb-8 shadow-xl transform rotate-[1.5deg] w-64 max-w-full rounded-2xl transition-all duration-300 frame-style-1">
          <!-- Washi tape (style 1 only) -->
          <div class="style-decor style-1-only absolute -top-3 left-1/2 transform -translate-x-1/2 w-14 h-4 bg-emerald-300/80 border border-emerald-400 rotate-[-2deg] opacity-90 z-20 flex items-center justify-center text-[5px] text-emerald-800 font-mono font-bold tracking-widest">GRID TAPE</div>
          
          <!-- Flower doodles (style 1 only) -->
          <div class="style-decor style-1-only absolute -top-3 -left-3 text-2xl z-20 select-none">🌼</div>
          <div class="style-decor style-1-only absolute -bottom-3 -right-3 text-2xl z-20 select-none">🌼</div>
          <div class="style-decor style-1-only absolute top-1/2 -right-4 text-xl z-20 select-none">🌱</div>

          <!-- Puffy clouds & characters (style 2 only) -->
          <div class="style-decor style-2-only absolute -top-4 -left-4 text-3xl z-20 select-none">☁️</div>
          <div class="style-decor style-2-only absolute -top-4 -right-4 text-3xl z-20 select-none">☁️</div>
          <div class="style-decor style-2-only absolute -bottom-3 -left-3 text-2xl z-20 select-none">🍒</div>
          <div class="style-decor style-2-only absolute -bottom-3 -right-3 text-2xl z-20 select-none">🍓</div>
          <div class="style-decor style-2-only absolute top-[14px] -left-[14px] text-[20px] z-20 select-none">🐰</div>
          <div class="style-decor style-2-only absolute top-[14px] -right-[14px] text-[20px] z-20 select-none">🐻</div>

          <!-- Romantic bow & cakes (style 3 only) -->
          <div class="style-decor style-3-only absolute -top-4 -left-4 text-4xl z-20 select-none rotate-[-12deg]">🎀</div>
          <div class="style-decor style-3-only absolute -top-3 -right-3 text-2xl z-20 select-none">🍰</div>
          <div class="style-decor style-3-only absolute -bottom-3.5 -left-3 text-2xl z-20 select-none">✉️</div>
          <div class="style-decor style-3-only absolute -bottom-3 -right-3 text-2xl z-20 select-none">🍓</div>

          <!-- Photo Holder -->
          <div class="photo-holder overflow-hidden bg-slate-50 border border-slate-200">
            <img id="final-selfie-img" src="" class="w-full h-56 object-cover" alt="Selfie Bukti">
          </div>
          
          <!-- Caption text below photo -->
          <div class="mt-4 text-center font-handwriting text-2xl text-[#ff4d6d] leading-snug">
            my favorite view ✨
            <span class="block text-[9px] font-fredoka font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">
              ${config.toName} • ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
            </span>
          </div>
        </div>

        <!-- Frame Style Selector -->
        <div class="mt-6 flex flex-col items-center gap-2 w-full z-20">
          <span class="text-[9px] font-bold uppercase tracking-widest text-[#ff4d6d] font-fredoka">GANTI STYLE FRAME 🎀</span>
          <div class="flex gap-3 justify-center">
            <button class="frame-selector-btn w-8 h-8 rounded-full border-2 border-pink-600 ring-2 ring-pink-300 scale-110 bg-[#fffaf0] hover:scale-110 active:scale-95 transition-all text-sm flex items-center justify-center shadow-xs" data-style="1" title="Scribble Doodle">🌼</button>
            <button class="frame-selector-btn w-8 h-8 rounded-full border-2 border-pink-400 bg-[#fff5f7] hover:scale-110 active:scale-95 transition-all text-sm flex items-center justify-center shadow-xs" data-style="2" title="Cute Animals">🐰</button>
            <button class="frame-selector-btn w-8 h-8 rounded-full border-2 border-pink-400 bg-[#ffeef2] hover:scale-110 active:scale-95 transition-all text-sm flex items-center justify-center shadow-xs" data-style="3" title="Romantic Ribbon">🎀</button>
          </div>
        </div>

        <div class="mt-6 text-[9px] font-fredoka text-slate-500">
          Made with love by DearNote
        </div>
      </div>

      <!-- Actions outside screenshot card -->
      <div class="w-full mt-4 flex flex-col gap-2 relative z-20">
        <button id="share-permit-img-btn" class="w-full btn-action flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold bg-gradient-to-r from-pink-400 to-rose-500">
          📸 Bagikan Hasil Frame Selfie
        </button>
        <button id="share-permit-btn" class="w-full btn-action flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold">
          🔗 Bagikan Link Berkas Izin
        </button>
        <button id="back-home-btn" class="w-full py-2.5 text-center text-[10px] font-bold text-[#ff4d6d] hover:text-[#ff758f] transition-colors">
          Kembali ke Home
        </button>
      </div>

    </div>
  </div>

  <!-- ── CAMERA WEBRTC STREAM MODAL ── -->
  <div id="camera-modal" class="fixed inset-0 bg-black/85 z-[1000] hidden flex flex-col items-center justify-center p-4">
    <div class="bg-white border-2 border-pink-200 rounded-3xl p-5 max-w-sm w-full text-center relative flex flex-col items-center shadow-2xl">
      <button id="close-camera-modal" class="absolute top-2 right-3 text-slate-500 hover:text-slate-800 text-2xl font-bold font-mono">&times;</button>
      <h3 class="text-sm font-bold font-fredoka text-slate-800 mb-3">AMBIL FOTO SELFIE CANTIK 📸</h3>
      <div class="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden mb-4 border border-pink-200">
        <video id="camera-stream" autoplay playsinline class="w-full h-full object-cover scale-x-[-1]"></video>
        <canvas id="camera-canvas" class="hidden"></canvas>
      </div>
      <button id="capture-btn" class="w-full btn-action py-3 font-bold text-xs uppercase tracking-wider">Jepret Foto 📸</button>
    </div>
  </div>

  <!-- Global Navigation controls -->
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
      dot.className = 'w-2 h-2 rounded-full bg-[#f5d6da] transition-colors duration-200';
      navDotsEl.appendChild(dot);
    });

    function updateNav() {
      const dots = navDotsEl.children;
      const vIdx = VISIBLE_CHAPTERS.indexOf(CHAPTERS[currentIdx]);
      Array.from(dots).forEach((d, i) => {
        d.className = i === vIdx 
          ? 'w-4 h-2 rounded-full bg-pink-500 transition-all duration-200' 
          : 'w-2 h-2 rounded-full bg-[#f5d6da] transition-all duration-200';
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
      if (chId === 'ch-intro') {
        // Trigger live bubbles delay sound
        playBubbleSound();
        setTimeout(playBubbleSound, 1200);
        setTimeout(playBubbleSound, 2000);
        setTimeout(playBubbleSound, 3000);
      }
      
      if (chId === 'ch-approved') {
        playFanfare();
        triggerConfettiRain();
        
        // Populate placeholders if no image is selected yet
        const img = document.getElementById('final-selfie-img');
        if (img) {
          const s = img.getAttribute('src');
          if (!s || s === window.location.href || s === '') {
            if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
              img.src = PHOTOS[0].src;
            } else {
              img.src = "https://images.unsplash.com/photo-1518887570146-0612132dd618?w=300&auto=format&fit=crop&q=60";
            }
          }
        }
      }
    }

    // Inject letter body
    document.getElementById('chat-letter-content').textContent = LETTER_BODY;

    // Inject photo bubble if exists
    const photoBubble = document.getElementById('chat-photo-bubble');
    if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
      photoBubble.classList.remove('hidden');
      photoBubble.innerHTML = \`
        <div class="border-2 border-white bg-white p-1 pb-4 shadow-xs rounded-xl w-32 transform rotate-1">
          <img src="\${PHOTOS[0].src}" class="w-full h-24 object-cover rounded-lg" alt="Requester">
        </div>
      \`;
    }

    // Audio handlers
    const audio = document.getElementById('bg-music');
    const stampSound = document.getElementById('stamp-sound');
    const cameraSound = document.getElementById('camera-sound');
    const fanfareSound = document.getElementById('fanfare-sound');
    const bubbleSound = document.getElementById('bubble-sound');
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
    function playBubbleSound() {
      bubbleSound.currentTime = 0;
      bubbleSound.play().catch(() => {});
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
        errEl.textContent = 'PIN salah sayang, silakan coba lagi 🌸';
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
          confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff4d6d'] });
        }

        const totalSelected = upetiList.filter(Boolean).length;
        if (totalSelected >= 1) {
          briberyNextBtn.disabled = false;
          briberyNextBtn.className = 'w-full btn-action opacity-100 cursor-pointer';
          briberyNextBtn.textContent = 'Lanjutkan Balasan 📄';
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
      'Gak Mau 👎',
      'Yakin nih? 🥺',
      'Pikir-pikir dulu..',
      'Aduh salah klik!',
      'Gak bisa dipencet 🤪',
      'Sogokannya kurang?',
      'Boba-nya angus lho!',
      'Salah sasaran!',
      'Sayang doi dong ❤️'
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

    // ── 4. Camera Upload ──
    const triggerUpload = document.getElementById('trigger-upload');
    const triggerCamera = document.getElementById('trigger-camera');
    const fileInput = document.getElementById('selfie-file-input');
    const cameraInput = document.getElementById('selfie-camera-input');
    const previewBox = document.getElementById('image-preview-box');
    const previewImg = document.getElementById('temp-preview-img');
    const confirmBtn = document.getElementById('confirm-photo-btn');
    
    let selectedImageSrc = "";

    triggerUpload.addEventListener('click', () => {
      fileInput.click();
    });

    // WebRTC Camera Modal controls
    const cameraModal = document.getElementById('camera-modal');
    const closeCameraBtn = document.getElementById('close-camera-modal');
    const captureBtn = document.getElementById('capture-btn');
    const videoStream = document.getElementById('camera-stream');
    const cameraCanvas = document.getElementById('camera-canvas');
    let localStream = null;

    if (triggerCamera) {
      triggerCamera.addEventListener('click', async () => {
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
      });
    }

    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        if (!videoStream || !cameraCanvas) return;
        const ctx = cameraCanvas.getContext('2d');
        
        // Match canvas dimensions to video aspect
        const size = Math.min(videoStream.videoWidth, videoStream.videoHeight) || 480;
        cameraCanvas.width = size;
        cameraCanvas.height = size;
        
        // Crop & Draw (mirror horizontal for natural selfie)
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        const sx = (videoStream.videoWidth - size) / 2 || 0;
        const sy = (videoStream.videoHeight - size) / 2 || 0;
        ctx.drawImage(videoStream, sx, sy, size, size, 0, 0, size, size);
        
        selectedImageSrc = cameraCanvas.toDataURL('image/png');
        previewImg.src = selectedImageSrc;
        previewBox.classList.remove('hidden');
        triggerUpload.parentNode.classList.add('hidden');
        
        stopCamera();
        cameraModal.classList.add('hidden');
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

    function handleImageFile(file) {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        selectedImageSrc = event.target.result;
        previewImg.src = selectedImageSrc;
        previewBox.classList.remove('hidden');
        triggerUpload.parentNode.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', (e) => {
      handleImageFile(e.target.files[0]);
    });

    if (cameraInput) {
      cameraInput.addEventListener('change', (e) => {
        handleImageFile(e.target.files[0]);
      });
    }

    confirmBtn.addEventListener('click', () => {
      if (!selectedImageSrc) return;
      playCameraSound();
      
      // Inject to final certificate image
      document.getElementById('final-selfie-img').src = selectedImageSrc;
      
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
        title: 'Surat Izin PAP Resmi - DearNote',
        text: 'Permintaan PAP resmi dari ${config.fromName} untuk ${config.toName} telah disetujui! 📸🎉',
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
      const cardEl = document.getElementById('chat-certificate-card');
      if (!cardEl) return;
      try {
        const canvas = await html2canvas(cardEl, { useCORS: true, scale: 2 });
        
        // Auto-Download
        const link = document.createElement('a');
        link.download = 'selfie-request-permit.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Share File
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'selfie-request-permit.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Surat Izin PAP Resmi - DearNote',
              text: 'Lihat surat keputusan izin PAP resmi aku! 📸💖'
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
      const colors = ['#ff8fa3', '#ff4d6d', '#ffcad4', '#b5e2fa'];

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
      } else {
        // Trigger initial chat delays
        setTimeout(() => { onEnter('ch-intro'); }, 100);
      }
    });

    // Switch Frame Styles
    const selectorBtns = document.querySelectorAll('.frame-selector-btn');
    const polaroidFrame = document.getElementById('polaroid-frame');
    
    selectorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active styles from all buttons
        selectorBtns.forEach(b => {
          b.classList.remove('border-pink-600', 'ring-2', 'ring-pink-300', 'scale-110');
          b.classList.add('border-pink-400');
        });
        
        // Add active styles to clicked button
        btn.classList.remove('border-pink-400');
        btn.classList.add('border-pink-600', 'ring-2', 'ring-pink-300', 'scale-110');
        
        // Switch class on frame container
        const styleId = btn.getAttribute('data-style');
        if (polaroidFrame) {
          polaroidFrame.className = "relative p-4 pb-8 shadow-xl transform rotate-[1.5deg] w-64 max-w-full rounded-2xl transition-all duration-300 frame-style-" + styleId;
        }
      });
    });

    updateNav();
  </script>
</body>
</html>
`;
}
