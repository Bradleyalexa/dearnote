import { PublishedConfig } from "../../schemas/card-draft";

export function generateFathersDayHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Pesan Hangat Untuk Ayah Hebat";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // A warm acoustic guitar/piano tune for dad
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Father's Keepsake Journal – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fredericka+the+Great&family=Architects+Daughter&family=Lora:ital,wght@0,500;0,600;1,400&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            cursive: ['"Dancing Script"', 'cursive'],
            playfair: ['"Playfair Display"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            chalk: ['"Fredericka the Great"', 'cursive'],
            handwriting: ['"Architects Daughter"', 'cursive'],
            lora: ['"Lora"', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle, #2a3439 0%, #151b1e 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #2D3748;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Falling sparkles Canvas */
    #sparkle-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Warm overlay glow */
    .glow-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0) 80%);
      pointer-events: none;
      z-index: 1;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(139, 90, 43, 0.03);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(139, 90, 43, 0.25);
      border-radius: 3px;
    }

    /* Code Gate Screen */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1b262c 0%, #0f172a 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Leather Wallet Gate ── */
    #leather-gate {
      position: fixed;
      inset: 0;
      background-color: #3d2b1f;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%),
        repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px);
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
      transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.2s ease;
      touch-action: none;
    }

    .leather-stitching {
      position: absolute;
      inset: 22px;
      border: 2.5px dashed #8b5a2b;
      pointer-events: none;
      z-index: 510;
      opacity: 0.55;
    }

    .wallet-flap {
      width: 145px;
      height: 65px;
      background: #2b1e17;
      border-radius: 0 0 20px 20px;
      border: 3px solid #5c4033;
      border-top: none;
      box-shadow: 0 10px 20px rgba(0,0,0,0.45);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 45px);
      z-index: 520;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wallet-snap {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #ffd700, #b8860b);
      border-radius: 50%;
      border: 2px solid #5c4033;
      box-shadow: 
        0 4px 8px rgba(0,0,0,0.3), 
        inset 0 2px 4px rgba(255,255,255,0.45);
      cursor: pointer;
      position: relative;
      transition: transform 0.2s;
    }
    .wallet-snap:hover {
      transform: scale(1.1);
    }
    .wallet-snap::after {
      content: "";
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      border: 1.5px dashed rgba(255,255,255,0.4);
    }

    /* ── 3D Book Container & Pages ── */
    .book-wrapper {
      position: relative;
      width: 320px;
      height: 520px;
      perspective: 1500px;
      z-index: 10;
      transform-style: preserve-3d;
    }

    /* Ring binder spine */
    .book-spine {
      position: absolute;
      left: -8px;
      top: 2%;
      width: 20px;
      height: 96%;
      background: linear-gradient(to right, #5c4c3e, #7c6c5e, #3d2f23);
      border-radius: 4px 0 0 4px;
      box-shadow: -5px 5px 15px rgba(0,0,0,0.3);
      z-index: 60;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0;
    }
    .binder-ring {
      width: 24px;
      height: 10px;
      background: linear-gradient(to bottom, #dcdcdc, #a9a9a9, #4a4a4a);
      border-radius: 10px;
      transform: translateX(-4px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    }

    /* Book Pages */
    .book-page {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #FFFDF9;
      background-image: 
        linear-gradient(90deg, rgba(220, 220, 250, 0.4) 1px, transparent 1px),
        linear-gradient(rgba(210, 220, 240, 0.3) 1px, transparent 1px);
      background-size: 100% 100%, 100% 24px;
      border-radius: 0 12px 12px 0;
      box-shadow: 
        inset 5px 0 15px rgba(0, 0, 0, 0.08), 
        inset 0 0 30px rgba(92, 64, 51, 0.04),
        5px 10px 30px rgba(0, 0, 0, 0.2);
      transform-origin: left center;
      transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), z-index 1.5s;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
      border: 1px solid #E8E2D5;
      padding: 24px;
    }
    
    /* Notebook margin line */
    .book-page::before {
      content: "";
      position: absolute;
      left: 32px;
      top: 0;
      bottom: 0;
      width: 1.5px;
      background: rgba(59, 130, 246, 0.35); /* blue vertical margin line */
      pointer-events: none;
    }

    .book-page.flipped {
      transform: rotateY(-180deg) translateZ(1px);
    }

    /* ── Dad's Stamp Badge Board (Page 1) ── */
    .badge-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 15px;
    }
    .dad-badge {
      background: #Fcfaf2;
      border: 2px dashed #d4af37;
      border-radius: 12px;
      padding: 10px 8px;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s, border-color 0.2s;
      box-shadow: 0 3px 6px rgba(0,0,0,0.03);
    }
    .dad-badge:hover {
      transform: translateY(-2px) scale(1.03);
      border-color: #8a6d1c;
    }
    .badge-stamp {
      position: absolute;
      inset: 0;
      background: rgba(253, 246, 227, 0.96);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #795548;
      font-weight: 800;
      font-size: 11px;
      opacity: 0;
      transform: scale(0.6) rotate(-15deg);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
      border: 2.5px double #d4af37;
    }
    .dad-badge.active .badge-stamp {
      opacity: 1;
      transform: scale(1) rotate(-8deg);
    }

    /* Ruled journal writing */
    .notebook-journal-text {
      line-height: 24px;
      font-size: 13px;
      font-family: 'Lora', serif;
      background: transparent;
      padding-top: 4px;
    }

    /* Cassette Player */
    .cassette-player {
      background: #FFFDF9;
      border: 2px dashed #C5A880;
      border-radius: 14px;
      box-shadow: 0 4px 10px rgba(92, 64, 51, 0.06);
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
      border: 1px solid #C5A880;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(92, 64, 51, 0.15);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Book bookmarks navigation */
    .nav-bookmark {
      position: absolute;
      bottom: 16px;
      padding: 6px 12px;
      background: #3e2723;
      color: #FFFDF9;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      z-index: 45;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .nav-bookmark:hover {
      background: #1b0e0b;
      transform: translateY(-1px);
    }
    .nav-bookmark.prev { left: 40px; }
    .nav-bookmark.next { right: 20px; }

    /* Sparkles */
    .sparkle-float {
      position: absolute;
      font-size: 1.3rem;
      pointer-events: none;
      animation: floatStar 1s forwards ease-out;
      z-index: 100;
    }
    @keyframes floatStar {
      0% { opacity: 0; transform: translate(0, 0) scale(0.6) rotate(0deg); }
      30% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--dx), -80px) scale(1.2) rotate(120deg); }
    }

    /* Workbench gallery styles */
    .workbench-bg {
      background-color: #0f2a4a;
      background-image: 
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 16px 16px;
      box-shadow: inset 0 0 35px rgba(0,0,0,0.5);
    }
    
    .workbench-polaroid {
      background: white;
      border: 5px solid white;
      border-bottom: 22px solid white;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
      border-radius: 1px;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, z-index 0.6s;
      cursor: pointer;
    }
    
    /* Paperclip style */
    .paperclip {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 16px;
      background: linear-gradient(to bottom, #eaeaea, #b0b0b0);
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      z-index: 10;
    }

    /* ── Interactive Pocket Watch (Page 4) ── */
    .pocket-watch {
      width: 130px;
      height: 130px;
      background: radial-gradient(circle at 35% 35%, #fff2a3 0%, #d4af37 60%, #8a6d1c 100%);
      border-radius: 50%;
      position: relative;
      box-shadow: 
        0 15px 30px rgba(0,0,0,0.35),
        inset 0 -10px 20px rgba(0,0,0,0.2),
        inset 5px 5px 15px rgba(255,255,255,0.5);
      cursor: pointer;
      margin: 20px auto 10px;
      transition: transform 0.3s;
      border: 4px solid #b8860b;
    }
    .pocket-watch:hover {
      transform: scale(1.05) rotate(5deg);
    }
    /* Top loop of pocket watch */
    .pocket-watch::before {
      content: "";
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 20px;
      border: 4px solid #d4af37;
      border-radius: 50% 50% 0 0;
      z-index: -1;
    }
    /* Watch Face */
    .watch-face {
      position: absolute;
      inset: 12px;
      background: #faf6eb;
      border-radius: 50%;
      border: 2px solid #8a6d1c;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.15);
    }
    /* Watch Hands */
    .watch-hand-hour {
      position: absolute;
      width: 4px;
      height: 30px;
      background: #2b1e17;
      top: 20px;
      transform-origin: bottom center;
      transform: rotate(35deg);
    }
    .watch-hand-minute {
      position: absolute;
      width: 2.5px;
      height: 42px;
      background: #2b1e17;
      top: 8px;
      transform-origin: bottom center;
      transform: rotate(120deg);
    }
    .watch-center-pin {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #8a6d1c;
      border-radius: 50%;
      z-index: 5;
    }

    /* Sliding gold plaque note */
    #watch-card {
      position: absolute;
      width: 210px;
      height: 180px;
      background: #fffdfc;
      border: 3px double #d4af37;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      padding: 16px;
      z-index: 10;
      transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.7s;
      transform: translate(-50%, 40px) scale(0.6);
      left: 50%;
      opacity: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    #watch-card.active {
      transform: translate(-50%, -160px) scale(1.05);
      opacity: 1;
      pointer-events: auto;
    }
  </style>
</head>
<body class="flex flex-col min-h-screen items-center justify-center p-4 relative" onclick="spawnSparkleEffect(event)">

  <!-- Falling sparkles canvas -->
  <canvas id="sparkle-canvas"></canvas>
  <div class="glow-overlay"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-[#FFFDF9] max-w-sm w-full rounded-[1.5rem] p-8 border-4 border-[#3D2B1F] shadow-2xl text-center relative overflow-hidden">
      <div class="absolute inset-0 border border-[#dfd3be] pointer-events-none"></div>
      
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#8b5a2b] mb-2 font-sans">DearNote • Keepsake</p>
      <h1 class="text-2xl font-bold font-playfair text-[#2b1e17] mb-4">A Father's Legacy</h1>
      <p class="text-xs text-stone-700 leading-relaxed mb-6 font-sans">
        Keepsake Jurnal Ayah dari <strong>${config.fromName}</strong> terkunci. Masukkan kode akses untuk membukanya.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Passkey" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#C5A880] rounded-xl text-center font-sans tracking-widest text-[#2b1e17] focus:outline-none focus:border-[#3D2B1F] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#3d2b1f] hover:bg-[#2b1e17] text-white font-bold rounded-xl transition-all shadow-md font-sans text-xs tracking-wider uppercase">
          Buka Jurnal
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah. Silakan coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: INTERACTIVE LEATHER WALLET COVER GATE ── -->
  <div id="leather-gate">
    <div class="leather-stitching"></div>
    
    <div class="text-center z-10 max-w-xs px-6 select-none pointer-events-none mb-12">
      <span class="block text-xs uppercase tracking-[4px] text-stone-300 font-bold mb-4 font-handwriting">Jurnal Spesial</span>
      <h1 class="text-white text-3xl md:text-4xl font-bold font-playfair leading-tight mb-8">Selamat Hari Ayah!</h1>
      
      <p class="text-xs text-stone-300 font-semibold font-handwriting leading-relaxed opacity-90">
        Untuk: <span class="text-yellow-200 font-bold">${config.toName}</span><br>
        Dari: <span class="text-yellow-200 font-bold">${config.fromName}</span>
      </p>
    </div>

    <!-- Flap and Buckle -->
    <div class="wallet-flap">
      <div class="wallet-snap" onclick="completeWalletGate()"></div>
    </div>

    <div class="absolute bottom-16 text-center pointer-events-none z-20">
      <span class="text-[9px] text-stone-300 uppercase tracking-widest font-bold font-sans animate-pulse">Tekuk Kancing Kuningan untuk Membuka &darr;</span>
    </div>
  </div>

  <!-- ── VIEW 3: 3D LEATHER BOOK CONTAINER ── -->
  <div class="book-wrapper">
    <div class="book-spine">
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
    </div>

    <!-- ── PAGE 1: DAD BADGE COLLECTION BOARD ── -->
    <div id="page-1" class="book-page flex flex-col justify-between" style="z-index: 40">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center border-b border-[#5c4033]/20 pb-2 mb-2 ml-4">
          <h2 class="font-playfair text-base font-bold text-[#3e2723]">Papan Penghargaan Ayah</h2>
          <span class="block text-[7px] font-bold uppercase tracking-widest text-[#C5A880]">Dad's Stamp Collection</span>
        </div>
        
        <p class="text-[9px] text-[#5c4033] leading-relaxed italic text-center px-2 mt-1 ml-4">
          Ketuk lencana di bawah untuk menyematkan stempel penghargaan emas!
        </p>

        <!-- Stamp badging grid -->
        <div class="ml-4 overflow-y-auto max-h-[300px] mt-2 pr-1">
          <div class="badge-grid">
            <div class="dad-badge" onclick="toggleBadgeStamp(this)">
              <span class="text-2xl block mb-1">🔧</span>
              <span class="text-[10px] font-bold block text-stone-700">Master Fixer</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Bisa memperbaiki segala hal.</span>
              <div class="badge-stamp active">🏆 APPROVED</div>
            </div>
            <div class="dad-badge" onclick="toggleBadgeStamp(this)">
              <span class="text-2xl block mb-1">☕</span>
              <span class="text-[10px] font-bold block text-stone-700">Coffee Legend</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Pecinta seduhan kopi sejati.</span>
              <div class="badge-stamp active">🏆 APPROVED</div>
            </div>
            <div class="dad-badge" onclick="toggleBadgeStamp(this)">
              <span class="text-2xl block mb-1">💬</span>
              <span class="text-[10px] font-bold block text-stone-700">Dad Jokes King</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Raja tebak-tebakan garing.</span>
              <div class="badge-stamp active">🏆 APPROVED</div>
            </div>
            <div class="dad-badge" onclick="toggleBadgeStamp(this)">
              <span class="text-2xl block mb-1">👑</span>
              <span class="text-[10px] font-bold block text-stone-700">Family Hero</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Pelindung terhebat kami.</span>
              <div class="badge-stamp active">🏆 APPROVED</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-1 relative flex items-center justify-end">
        <button class="nav-bookmark next" onclick="turnPage(1, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 2: LINED JOURNAL LETTER ── -->
    <div id="page-2" class="book-page flex flex-col justify-between" style="z-index: 30">
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Letter header -->
        <div class="border-b border-[#5c4033]/25 pb-2 mb-2 ml-4 text-center">
          <h2 class="text-[8px] font-bold text-[#C5A880] uppercase tracking-widest font-sans">Surat Untuk Ayah</h2>
          <h1 class="font-playfair text-xs sm:text-sm font-bold text-[#3e2723] mt-0.5">${letterTitle}</h1>
        </div>

        <!-- lined sheet text -->
        <div class="notebook-journal-text ml-4 text-[#3e2723] flex-1 whitespace-pre-wrap break-words overflow-y-auto pr-1" id="typewriter-text" style="max-height: 290px;"></div>

        <!-- Voice note Cassette tape -->
        ${hasVoiceNote ? `
        <div class="cassette-player ml-4 p-3 flex items-center gap-3 mt-3 flex-shrink-0">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-[#795548] hover:bg-[#5d4037] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-[9px] ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[6.5px] uppercase font-bold tracking-widest text-[#C5A880] font-sans mb-0.5">🎙️ Pesan Suara Untuk Ayah</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-[#d7ccc8] rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#795548] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[8px] font-semibold text-[#795548] font-sans flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-2 relative">
        <button class="nav-bookmark prev" onclick="turnPage(2, false)">&larr; Prev</button>
        <button class="nav-bookmark next" onclick="turnPage(2, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 3: BLUEPRINT WORKBENCH PHOTO ALBUM ── -->
    <div id="page-3" class="book-page workbench-bg flex flex-col justify-between" style="z-index: 20">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center pb-2 border-b border-white/20 mb-4 ml-4">
          <h2 class="text-[8px] font-bold text-sky-200 uppercase tracking-widest font-sans">Meja Kenangan</h2>
          <h1 class="font-playfair text-sm font-bold text-white">Galeri Foto Bersama Ayah</h1>
        </div>

        <!-- Polaroid Stack -->
        <div class="flex-1 flex items-center justify-center relative min-h-[300px] overflow-hidden ml-4" id="gallery-container-node">
          ${config.photos && config.photos.length > 0 ? `
          <div class="relative w-full h-[280px] flex items-center justify-center" id="photo-deck">
            ${config.photos.map((photo, i) => {
              return `
              <div class="workbench-polaroid p-2 w-[240px] absolute transition-all duration-500" 
                id="pcard-${i}"
                onclick="cyclePhoto(${i})">
                <div class="paperclip"></div>
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-stone-50">
                  <img src="${photo.src}" alt="Dad Photo" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-handwriting text-[16px] text-stone-700 mt-2 px-2 leading-snug break-words">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
          ` : `
          <div class="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-white/30 rounded-2xl">
            <span class="text-2xl text-white/50">❤️</span>
            <p class="text-xs text-white/80 font-medium mt-2 text-center">Setiap kenangan adalah harta berharga</p>
          </div>
          `}
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-2 relative">
        <button class="nav-bookmark prev" onclick="turnPage(3, false)">&larr; Prev</button>
        <button class="nav-bookmark next" onclick="turnPage(3, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 4: VINTAGE POCKET WATCH KEEPSAKE ── -->
    <div id="page-4" class="book-page flex flex-col justify-between" style="z-index: 10">
      
      <div class="text-center pb-2 border-b border-[#5c4033]/25 mb-4 ml-4">
        <h2 class="text-[8px] font-bold text-[#C5A880] uppercase tracking-widest font-sans">Waktu Bersama Ayah</h2>
        <h1 class="font-playfair text-sm font-bold text-[#3e2723]">Jam Saku Kenangan</h1>
      </div>

      <!-- Interactive pocket watch -->
      <div class="relative flex-1 flex flex-col items-center justify-center ml-4">
        <div class="pocket-watch" onclick="toggleWatchNote()">
          <div class="watch-face">
            <div class="watch-center-pin"></div>
            <div class="watch-hand-hour"></div>
            <div class="watch-hand-minute"></div>
          </div>
        </div>

        <p class="text-[9px] text-[#5c4033] font-bold animate-pulse text-center uppercase tracking-wider mt-2">
          Ketuk Jam Saku
        </p>

        <!-- Slide Up gold card note -->
        <div id="watch-card">
          <p class="font-cursive text-sm text-[#8a6d1c] font-bold border-b border-yellow-100 pb-1">Terima Kasih, Ayah...</p>
          <div class="font-sans text-[10px] text-stone-700 leading-relaxed italic flex-1 mt-2 overflow-y-auto pr-0.5">
            ${config.finalMessage || "Terima kasih atas segala cinta, perlindungan, dan nasihat bijak yang selalu menuntun hidupku. Jasa dan pengorbananmu tidak akan pernah terlupakan! ❤️"}
          </div>
          <p class="text-[7.5px] text-[#5c4033] text-right uppercase tracking-wider font-bold mt-1.5">— Dari Anakmu yang Menyayangimu</p>
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 relative flex items-center justify-start">
        <button class="nav-bookmark prev" onclick="turnPage(4, false)">&larr; Prev</button>
      </div>
    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-sm w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-[#C5A880] shadow flex items-center justify-center font-bold text-[#5c4033] hover:bg-stone-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-handwriting text-xs text-stone-700 mt-3 px-2"></p>
    </div>
  </div>

  <!-- Script Logic -->
  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      fromName: ${JSON.stringify(config.fromName)},
      toName: ${JSON.stringify(config.toName)},
      letterTitle: ${JSON.stringify(letterTitle)},
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote}
    };

    function $(id) { return document.getElementById(id); }

    // 1. Spawning falling golden sparkles
    const canvas = $('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -20 - 20;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.15;
        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, ' + this.opacity + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < 20; i++) {
      stars.push(new Star());
      stars[i].y = Math.random() * canvas.height;
    }

    function animateStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();

    // 2. Secret Code Gate
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        $('code-gate').classList.add('translate-y-[-100%]', 'opacity-0');
        playBgm();
        setTimeout(() => {
          $('code-gate').remove();
        }, 900);
      } else {
        $('code-err').classList.remove('opacity-0');
        $('code-input').classList.add('border-red-500', 'animate-shake');
        setTimeout(() => $('code-input').classList.remove('animate-shake'), 400);
      }
    }

    // 3. Complete Wallet Gate (Buckle click trigger)
    function completeWalletGate() {
      const leatherGate = $('leather-gate');
      if (!leatherGate) return;
      
      playBgm();
      // Smooth slide up & fade
      leatherGate.classList.add('translate-y-[-100%]', 'opacity-0');
      setTimeout(() => {
        leatherGate.remove();
        triggerTypewriter();
      }, 1200);
    }

    // 4. Dad badge board interactions
    function toggleBadgeStamp(badge) {
      badge.classList.toggle('active');
      if (badge.classList.contains('active')) {
        spawnRowSparkles(badge);
      }
    }

    function spawnRowSparkles(badge) {
      const rect = badge.getBoundingClientRect();
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle-float';
        sp.innerText = '✨';
        
        const rx = rect.left + (rect.width * 0.5) + (Math.random() * 40 - 20);
        const ry = rect.top + (rect.height / 2) + (Math.random() * 20 - 10);
        
        sp.style.left = rx + 'px';
        sp.style.top = ry + 'px';
        sp.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
        
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 1000);
      }
    }

    // 5. 3D Book Navigation flip logic
    let currentPageIndex = 0;
    const pages = [
      $('page-1'),
      $('page-2'),
      $('page-3'),
      $('page-4')
    ];

    function updateZIndices() {
      pages.forEach((p, idx) => {
        if (!p) return;
        if (p.classList.contains('flipped')) {
          p.style.zIndex = idx + 1; // Flipped layers sit on bottom
        } else {
          p.style.zIndex = 40 - idx * 10; // Unflipped layers stack on top
        }
      });
    }
    updateZIndices();

    function turnPage(pageIndex, goNext) {
      if (goNext) {
        pages[pageIndex - 1].classList.add('flipped');
        currentPageIndex = pageIndex;
      } else {
        pages[pageIndex - 2].classList.remove('flipped');
        currentPageIndex = pageIndex - 1;
      }
      updateZIndices();
    }

    // 6. Typewriter engine for Page 2 Letter
    let typewriterStarted = false;
    function triggerTypewriter() {
      if (typewriterStarted) return;
      typewriterStarted = true;
      
      const container = $('typewriter-text');
      const text = CONFIG.letterBody;
      let index = 0;
      const speed = 25; // ms per character

      function type() {
        if (index < text.length) {
          container.innerHTML += text.charAt(index);
          index++;
          container.scrollTop = container.scrollHeight;
          setTimeout(type, speed);
        }
      }
      setTimeout(type, 500);
    }

    // 7. Interactive pocket watch logic
    let watchCardActive = false;
    function toggleWatchNote() {
      const card = $('watch-card');
      watchCardActive = !watchCardActive;
      if (watchCardActive) {
        card.classList.add('active');
        spawnSparkleEffect({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 - 100 });
      } else {
        card.classList.remove('active');
      }
    }

    // 8. Polaroid cycling deck for Page 3 Workbench
    let currentPhotoIndex = 0;
    const photoCount = CONFIG.photos ? CONFIG.photos.length : 0;
    
    function initPhotoDeck() {
      if (photoCount === 0) return;
      for (let i = 0; i < photoCount; i++) {
        const card = $('pcard-' + i);
        if (!card) continue;
        
        let relativePos = (i - currentPhotoIndex + photoCount) % photoCount;
        
        card.style.opacity = '1';
        card.style.pointerEvents = relativePos === 0 ? 'auto' : 'none';
        
        if (relativePos === 0) {
          card.style.zIndex = 30;
          card.style.transform = 'scale(1.0) rotate(-2deg) translateY(0px) translateX(0px)';
        } else if (relativePos === 1) {
          card.style.zIndex = 20;
          card.style.transform = 'scale(0.94) rotate(4deg) translateY(6px) translateX(4px)';
        } else if (relativePos === 2) {
          card.style.zIndex = 10;
          card.style.transform = 'scale(0.88) rotate(-5deg) translateY(12px) translateX(-4px)';
        } else {
          card.style.zIndex = 5;
          card.style.transform = 'scale(0.82) rotate(0deg) translateY(18px)';
          card.style.opacity = '0';
        }
      }
    }
    
    setTimeout(initPhotoDeck, 100);

    function cyclePhoto(index) {
      if (photoCount <= 1) {
        zoomPhoto(CONFIG.photos[index].src, CONFIG.photos[index].caption || '');
        return;
      }
      
      if (index !== currentPhotoIndex) return;
      
      const topCard = $('pcard-' + index);
      if (!topCard) return;
      
      topCard.style.transform = 'translateX(130%) translateY(-20px) rotate(15deg) scale(0.95)';
      topCard.style.opacity = '0';
      
      setTimeout(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoCount;
        initPhotoDeck();
      }, 350);
    }

    function zoomPhoto(src, caption) {
      $('modal-img').src = src;
      $('modal-caption').innerText = caption || "";
      const modal = $('photo-modal');
      modal.classList.remove('opacity-0', 'pointer-events-none');
    }
    function closePhotoModal() {
      const modal = $('photo-modal');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }

    // 9. Audio Player Interface
    let isPlaying = false;
    let audio = $('audio-el');

    function initAudioMetadata() {
      const durationEl = $('audio-time');
      if (audio && audio.duration) {
        durationEl.innerText = formatTime(audio.duration);
      }
    }

    function toggleAudio() {
      const playIcon = $('play-icon');
      if (isPlaying) {
        audio.pause();
        playIcon.innerText = '▶';
        isPlaying = false;
        playBgm();
      } else {
        pauseBgm();
        audio.play().catch(err => console.error(err));
        playIcon.innerText = '⏸';
        isPlaying = true;
      }
    }

    function updateAudioProgress() {
      const progress = $('audio-progress');
      const timeDisplay = $('audio-time');
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = pct + '%';
        timeDisplay.innerText = formatTime(audio.currentTime);
      }
      if (audio.ended) {
        $('play-icon').innerText = '▶';
        progress.style.width = '0%';
        isPlaying = false;
        playBgm();
      }
    }

    function seekAudio(e) {
      const bar = $('mini-timeline');
      const rect = bar.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (audio.duration) {
        audio.currentTime = clickPos * audio.duration;
      }
    }

    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // 10. Background Music (BGM)
    const bgm = $('bgm-audio');
    let isBgmPlaying = false;
    let isBgmMuted = false;

    function playBgm() {
      if (bgm && !isBgmPlaying && !isBgmMuted && !isPlaying) {
        bgm.play().catch(e => console.log('BGM blocked:', e));
        isBgmPlaying = true;
        $('bgm-icon').innerText = '🎵';
      }
    }

    function pauseBgm() {
      if (bgm && isBgmPlaying) {
        bgm.pause();
        isBgmPlaying = false;
      }
    }

    function toggleBgm() {
      if (isBgmMuted) {
        isBgmMuted = false;
        $('bgm-icon').innerText = '🎵';
        if (!isPlaying) {
          bgm.play().catch(e => console.log(e));
          isBgmPlaying = true;
        }
      } else {
        isBgmMuted = true;
        $('bgm-icon').innerText = '🔇';
        bgm.pause();
        isBgmPlaying = false;
      }
    }

    // 11. Sparkles on tap
    function spawnSparkleEffect(e) {
      for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'sparkle-float';
        star.innerText = ['❤️','✨','🛠️','💼','👑','☕'][Math.floor(Math.random() * 6)];
        
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        
        star.style.setProperty('--dx', (Math.random() * 100 - 50) + 'px');
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
      }
    }
  </script>
</body>
</html>`;
}
