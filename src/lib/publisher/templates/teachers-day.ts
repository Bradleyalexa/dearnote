import { PublishedConfig } from "../../schemas/card-draft";

export function generateTeachersDayHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Catatan Terima Kasih Spesial Untuk Guru";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // A warm classical acoustic guitar or piano tune for teacher celebration
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teacher's Keepsake Journal – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fredericka+the+Great&family=Architects+Daughter&display=swap" rel="stylesheet">
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
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle, #2d3748 0%, #1a202c 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #2D3748;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Falling Glowing Stars Canvas */
    #star-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Warm light glow */
    .glow-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 25%, rgba(254, 243, 199, 0.15) 0%, rgba(255, 255, 255, 0) 80%);
      pointer-events: none;
      z-index: 1;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(197, 160, 89, 0.03);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(197, 160, 89, 0.3);
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
      background: linear-gradient(135deg, #1C2E24 0%, #101F17 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Blackboard Eraser Gate ── */
    #chalkboard-gate {
      position: fixed;
      inset: 0;
      background: #1B2E24;
      background-image: 
        radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 80%),
        linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
      background-size: 100% 100%, 20px 20px, 20px 20px;
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 100px rgba(0,0,0,0.6);
      transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.2s ease;
      touch-action: none;
    }
    
    .wood-frame {
      position: absolute;
      inset: 0;
      border: 18px solid #5C4033; /* wood frame border */
      border-image: linear-gradient(to bottom right, #5C4033, #3D2B1F, #5C4033, #2B1E17) 18;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 15px 30px rgba(0,0,0,0.5);
      pointer-events: none;
      z-index: 510;
    }

    /* Chalk writings styling */
    .chalk-writing {
      color: rgba(255, 255, 255, 0.88);
      font-family: 'Fredericka the Great', cursive;
      text-shadow: 
        0 0 3px rgba(255,255,255,0.4),
        0 0 6px rgba(255,255,255,0.2);
    }
    
    .chalk-doodle {
      position: absolute;
      color: rgba(255,255,255,0.18);
      font-family: 'Architects Daughter', cursive;
      pointer-events: none;
      user-select: none;
    }

    /* Blackboard Eraser component */
    .sponge-eraser {
      width: 80px;
      height: 48px;
      background: #8E7C6E;
      border-radius: 6px;
      box-shadow: 
        0 5px 12px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.3);
      cursor: grab;
      position: absolute;
      z-index: 520;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px;
      border: 2px solid #5C4C42;
    }
    .sponge-eraser::before {
      content: "";
      height: 12px;
      background: #D7CCC8;
      border-radius: 4px 4px 0 0;
      opacity: 0.9;
    }
    .sponge-eraser::after {
      content: "ERASER";
      font-size: 8px;
      color: #3e2723;
      font-weight: bold;
      letter-spacing: 1px;
      text-align: center;
    }
    .sponge-eraser:active {
      cursor: grabbing;
    }

    /* Chalk dust particles */
    .chalk-dust {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      pointer-events: none;
      animation: fadeOutDust 1s forwards ease-out;
      z-index: 515;
    }
    @keyframes fadeOutDust {
      0% { opacity: 0.9; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(3) translateY(-30px); }
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
      background: linear-gradient(to right, #8A7E72, #A89B8E, #6B6055);
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
      background: linear-gradient(to bottom, #E2E8F0, #94A3B8, #475569);
      border-radius: 10px;
      transform: translateX(-4px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    }

    /* School binder book pages */
    .book-page {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #FFFDF9;
      background-image: 
        linear-gradient(90deg, rgba(220, 220, 250, 0.5) 1px, transparent 1px),
        linear-gradient(rgba(190, 210, 245, 0.4) 1px, transparent 1px);
      background-size: 100% 100%, 100% 24px;
      border-radius: 0 12px 12px 0;
      box-shadow: 
        inset 5px 0 15px rgba(0, 0, 0, 0.08), 
        inset 0 0 30px rgba(139, 90, 43, 0.04),
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
      background: rgba(239, 68, 68, 0.4); /* red vertical margin line */
      pointer-events: none;
    }

    .book-page.flipped {
      transform: rotateY(-180deg) translateZ(1px);
    }

    /* ── Retro Teacher's Report Card (Page 1) ── */
    .report-card-title {
      font-family: 'Fredericka the Great', cursive;
      color: #3e2723;
    }
    .report-card-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      color: #3e2723;
      margin-top: 10px;
    }
    .report-card-table th {
      border-bottom: 2px solid #5C4033;
      padding: 6px 2px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .report-card-table td {
      border-bottom: 1px dashed rgba(92, 64, 51, 0.25);
      padding: 9px 2px;
      font-family: 'Architects Daughter', cursive;
      font-weight: 600;
    }
    .award-stamp-btn {
      cursor: pointer;
      position: relative;
      transition: transform 0.2s;
    }
    .award-stamp-btn:hover {
      transform: scale(1.15);
    }
    
    /* Red Star/Grade Glossy stamp effect */
    .grade-stamp {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%) rotate(-12deg) scale(0);
      width: 32px;
      height: 32px;
      border: 2px double #EF4444;
      border-radius: 50%;
      color: #EF4444;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 11px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      text-shadow: 0 1px 1px rgba(0,0,0,0.05);
      pointer-events: none;
      background: rgba(254, 226, 226, 0.95);
      box-shadow: 0 2px 5px rgba(239, 68, 68, 0.15);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .grade-stamp.stamped {
      transform: translateY(-50%) rotate(-12deg) scale(1);
      opacity: 1;
    }

    /* Ruled journal writing */
    .notebook-journal-text {
      line-height: 24px; /* Matches the background line size */
      font-size: 13px;
      font-family: 'Lora', serif;
      background: transparent;
      padding-top: 4px;
    }

    /* School Bell Music controller */
    .school-bell-player {
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
      background: #5C4033;
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
      background: #3D2B1F;
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

    /* Corkboard gallery styles */
    .corkboard-bg {
      background-color: #D4B28C;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(92, 64, 51, 0.12) 0%, transparent 90%),
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 100% 100%, 8px 8px, 8px 8px;
      box-shadow: inset 0 0 30px rgba(0,0,0,0.18);
    }
    
    .corkboard-polaroid {
      background: white;
      border: 5px solid white;
      border-bottom: 20px solid white;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
      border-radius: 1px;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, z-index 0.6s;
      cursor: pointer;
    }
    
    /* Pushpin style */
    .pushpin {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      box-shadow: 
        0 2px 4px rgba(0,0,0,0.3),
        inset -1px -2px 3px rgba(0,0,0,0.4);
      z-index: 10;
    }
    .pushpin::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 6px;
      background: #718096;
    }
    .pushpin.red { background: #EF4444; border: 1px solid #B91C1C; }
    .pushpin.blue { background: #3B82F6; border: 1px solid #1D4ED8; }
    .pushpin.green { background: #10B981; border: 1px solid #047857; }

    /* ── Interactive Red Apple Gift (Page 4) ── */
    .apple-wrapper {
      position: relative;
      width: 120px;
      height: 110px;
      margin: 20px auto 10px;
      cursor: pointer;
    }
    
    /* Apple shapes */
    .apple-body {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 40% 30%, #FF5A5F 0%, #D1252D 70%, #8A0F15 100%);
      border-radius: 54px 54px 48px 48px;
      position: relative;
      box-shadow: 
        0 10px 20px rgba(138, 15, 21, 0.35),
        inset 0 -8px 15px rgba(0,0,0,0.18),
        inset 4px 6px 12px rgba(255,255,255,0.45);
      transition: transform 0.3s;
    }
    
    /* Top indentation */
    .apple-body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 20%;
      width: 60%;
      height: 12px;
      background: radial-gradient(ellipse at bottom, rgba(0,0,0,0.2) 0%, transparent 70%);
    }

    /* Apple stem & leaf */
    .apple-stem {
      position: absolute;
      top: -15px;
      left: 50%;
      width: 6px;
      height: 22px;
      background: #5C4033;
      border-radius: 3px;
      transform: translateX(-50%) rotate(15deg);
      transform-origin: bottom center;
      z-index: 2;
    }
    .apple-leaf {
      position: absolute;
      top: -18px;
      left: 52%;
      width: 28px;
      height: 14px;
      background: radial-gradient(circle at center, #86EFAC 0%, #22C55E 100%);
      border-radius: 14px 0 14px 0;
      transform: rotate(-10deg);
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      z-index: 1;
    }

    /* Sliding card note */
    #apple-card {
      position: absolute;
      width: 200px;
      height: 170px;
      background: #FFFDF9;
      border: 2px solid #C5A880;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(92, 64, 51, 0.22);
      padding: 14px;
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
    #apple-card.active {
      transform: translate(-50%, -150px) scale(1.05);
      opacity: 1;
      pointer-events: auto;
    }

    .apple-wrapper:hover .apple-body {
      transform: scale(1.05);
    }
  </style>
</head>
<body class="flex flex-col min-h-screen items-center justify-center p-4 relative" onclick="spawnChalkSparkle(event)">

  <!-- Falling glowing stars canvas -->
  <canvas id="star-canvas"></canvas>
  <div class="glow-overlay"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-[#FFFDF9] max-w-sm w-full rounded-[1.5rem] p-8 border-4 border-[#5C4033] shadow-2xl text-center relative overflow-hidden">
      <!-- wood grain style borders -->
      <div class="absolute inset-0 border border-[#D7CCC8] pointer-events-none"></div>
      
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#5C4033] mb-2 font-sans">DearNote • Keepsake</p>
      <h1 class="text-2xl font-bold font-playfair text-[#3E2723] mb-4">Ruled with Gratitude</h1>
      <p class="text-xs text-amber-900 leading-relaxed mb-6 font-sans">
        Keepsake Jurnal Guru dari <strong>${config.fromName}</strong> terkunci. Masukkan kode akses untuk membukanya.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Passkey" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#C5A880] rounded-xl text-center font-sans tracking-widest text-[#3E2723] focus:outline-none focus:border-[#5C4033] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#5C4033] hover:bg-[#3D2B1F] text-white font-bold rounded-xl transition-all shadow-md font-sans text-xs tracking-wider uppercase">
          Buka Jurnal
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah. Silakan coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: INTERACTIVE CHALKBOARD COVER ERASER GATE ── -->
  <div id="chalkboard-gate">
    <div class="wood-frame"></div>
    
    <!-- Chalk doodles -->
    <div class="chalk-doodle text-4xl" style="top: 15%; left: 15%; transform: rotate(-10deg);">✏️</div>
    <div class="chalk-doodle text-4xl" style="top: 20%; right: 18%; transform: rotate(15deg);">📐</div>
    <div class="chalk-doodle text-4xl" style="bottom: 22%; left: 16%; transform: rotate(5deg);">📚</div>
    <div class="chalk-doodle text-3xl font-handwriting" style="top: 48%; left: 8%;">a² + b² = c²</div>
    <div class="chalk-doodle text-3xl font-handwriting" style="bottom: 40%; right: 10%; transform: rotate(-5deg);">E = mc²</div>
    
    <div class="text-center z-10 max-w-xs px-6 select-none pointer-events-none">
      <span class="block text-xs uppercase tracking-[4px] text-zinc-300 font-bold mb-4 font-handwriting">Papan Tulis Guru</span>
      <h1 class="chalk-writing text-4xl md:text-5xl font-bold font-chalk leading-tight mb-8">Terima Kasih,<br>Guruku!</h1>
      
      <p class="text-xs text-zinc-200 font-semibold font-handwriting leading-relaxed opacity-90">
        Untuk: <span class="text-amber-200">${config.toName}</span><br>
        Dari: <span class="text-amber-200">${config.fromName}</span>
      </p>
    </div>

    <!-- Eraser instructions -->
    <div class="absolute bottom-16 text-center pointer-events-none z-20">
      <span class="text-[10px] text-zinc-300 uppercase tracking-widest font-bold font-sans animate-pulse">Sapu Papan Tulis dengan Penghapus &darr;</span>
    </div>

    <!-- The interactive eraser -->
    <div id="eraser" class="sponge-eraser" style="bottom: 100px; left: calc(50% - 40px);"></div>
  </div>

  <!-- ── VIEW 3: 3D CLASS NOTEBOOK BINDER CONTAINER ── -->
  <div class="book-wrapper">
    <div class="book-spine">
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
    </div>

    <!-- ── PAGE 1: TEACHER APPRECIATION REPORT CARD ── -->
    <div id="page-1" class="book-page flex flex-col justify-between" style="z-index: 40">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center border-b border-[#5C4033]/20 pb-2 mb-2 ml-4">
          <h2 class="report-card-title text-base font-bold text-[#3E2723]">Rapor Guru Terhebat</h2>
          <span class="block text-[7px] font-bold uppercase tracking-widest text-[#C5A880]">Teacher Appreciation card</span>
        </div>
        
        <p class="text-[9px] text-[#5C4033] leading-relaxed italic text-center px-2 mt-1 ml-4">
          Ketuk kolom penilaian untuk membubuhkan stempel penghargaan A+ emas!
        </p>

        <!-- Evaluation Grid table -->
        <div class="ml-4 overflow-y-auto max-h-[300px] mt-2 pr-1">
          <table class="report-card-table">
            <thead>
              <tr>
                <th style="width: 60%">Aspek Evaluasi</th>
                <th style="width: 40%; text-align: right; padding-right: 12px;">Predikat</th>
              </tr>
            </thead>
            <tbody>
              <tr class="award-stamp-btn" onclick="toggleAwardStamp(this)">
                <td>
                  <span class="block font-bold">1. Kesabaran (Patience)</span>
                  <span class="text-[8px] opacity-75 block font-sans">Selalu tenang mendengarkan.</span>
                </td>
                <td class="relative text-right pr-6">
                  <span class="text-xs text-amber-700">Excellent</span>
                  <div class="grade-stamp stamped">A+</div>
                </td>
              </tr>
              <tr class="award-stamp-btn" onclick="toggleAwardStamp(this)">
                <td>
                  <span class="block font-bold">2. Penjelasan (Clarity)</span>
                  <span class="text-[8px] opacity-75 block font-sans">Materi sulit jadi mudah dimengerti.</span>
                </td>
                <td class="relative text-right pr-6">
                  <span class="text-xs text-amber-700">Excellent</span>
                  <div class="grade-stamp stamped">A+</div>
                </td>
              </tr>
              <tr class="award-stamp-btn" onclick="toggleAwardStamp(this)">
                <td>
                  <span class="block font-bold">3. Inspirasi (Inspiration)</span>
                  <span class="text-[8px] opacity-75 block font-sans">Memotivasi kami meraih impian.</span>
                </td>
                <td class="relative text-right pr-6">
                  <span class="text-xs text-amber-700">Excellent</span>
                  <div class="grade-stamp stamped">A+</div>
                </td>
              </tr>
              <tr class="award-stamp-btn" onclick="toggleAwardStamp(this)">
                <td>
                  <span class="block font-bold">4. Kepedulian (Kindness)</span>
                  <span class="text-[8px] opacity-75 block font-sans">Selalu tersenyum & mendukung kami.</span>
                </td>
                <td class="relative text-right pr-6">
                  <span class="text-xs text-amber-700">Excellent</span>
                  <div class="grade-stamp stamped">A+</div>
                </td>
              </tr>
            </tbody>
          </table>
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
        <div class="border-b border-[#5C4033]/25 pb-2 mb-2 ml-4 text-center">
          <h2 class="text-[8px] font-bold text-[#C5A880] uppercase tracking-widest font-sans">Jurnal Terima Kasih</h2>
          <h1 class="font-playfair text-xs sm:text-sm font-bold text-[#3E2723] mt-0.5">${letterTitle}</h1>
        </div>

        <!-- clean lined-journal sheet -->
        <div class="notebook-journal-text ml-4 text-[#3E2723] flex-1 whitespace-pre-wrap break-words overflow-y-auto pr-1" id="typewriter-text" style="max-height: 290px;"></div>

        <!-- Voice greeting if any (Cassette Bell tape style) -->
        ${hasVoiceNote ? `
        <div class="school-bell-player ml-4 p-3 flex items-center gap-3 mt-3 flex-shrink-0">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-[#5C4033] hover:bg-[#3D2B1F] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-[9px] ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[6.5px] uppercase font-bold tracking-widest text-[#C5A880] font-sans mb-0.5">🎙️ Pesan Suara Khusus</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-[#D7CCC8] rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#5C4033] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[8px] font-semibold text-[#5C4033] font-sans flex-shrink-0">0:00</span>
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

    <!-- ── PAGE 3: CORKBOARD PHOTO ALBUM ── -->
    <div id="page-3" class="book-page corkboard-bg flex flex-col justify-between" style="z-index: 20">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center pb-2 border-b border-[#5c4033]/25 mb-4 ml-4">
          <h2 class="text-[8px] font-bold text-[#FFFDF9] uppercase tracking-widest font-sans">Mading Kelas</h2>
          <h1 class="font-playfair text-sm font-bold text-[#FFFDF9]">Dokumentasi Kenangan Kita</h1>
        </div>

        <!-- Polaroid Stack Deck Container -->
        <div class="flex-1 flex items-center justify-center relative min-h-[300px] overflow-hidden ml-4" id="gallery-container-node">
          ${config.photos && config.photos.length > 0 ? `
          <div class="relative w-full h-[280px] flex items-center justify-center" id="photo-deck">
            ${config.photos.map((photo, i) => {
              const pins = ["red", "blue", "green"];
              const selectedPin = pins[i % 3];
              return `
              <div class="corkboard-polaroid p-2 w-[210px] absolute transition-all duration-500" 
                id="pcard-${i}"
                onclick="cyclePhoto(${i})">
                <div class="pushpin ${selectedPin}"></div>
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-stone-50">
                  <img src="${photo.src}" alt="Scrapbook Photo" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-handwriting text-[16px] text-zinc-700 mt-2 px-2 leading-snug break-words">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
          ` : `
          <div class="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-white/50 rounded-2xl">
            <span class="text-2xl text-white/70">✏️</span>
            <p class="text-xs text-white/80 font-medium mt-2 text-center">Setiap bimbingan adalah bekal masa depan</p>
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

    <!-- ── PAGE 4: RED APPLE APPRECIATION KEEPSAKE ── -->
    <div id="page-4" class="book-page flex flex-col justify-between" style="z-index: 10">
      
      <div class="text-center pb-2 border-b border-[#5C4033]/25 mb-4 ml-4">
        <h2 class="text-[8px] font-bold text-[#C5A880] uppercase tracking-widest font-sans">Hadiah Kelulusan</h2>
        <h1 class="font-playfair text-sm font-bold text-[#3E2723]">Sebuah Apel Untuk Guru</h1>
      </div>

      <!-- Interactive red apple gift -->
      <div class="relative flex-1 flex flex-col items-center justify-center ml-4">
        <div class="apple-wrapper" onclick="toggleAppleNote()">
          <div class="apple-stem"></div>
          <div class="apple-leaf"></div>
          <div class="apple-body"></div>
        </div>

        <p class="text-[9px] text-[#5C4033] font-bold animate-pulse text-center uppercase tracking-wider mt-2">
          Ketuk Apel Merah
        </p>

        <!-- Slide Up Appreciation Memo Card -->
        <div id="apple-card">
          <p class="font-cursive text-sm text-[#8A0F15] font-bold border-b border-red-100 pb-1">Terima Kasih, Guru...</p>
          <div class="font-sans text-[10px] text-zinc-700 leading-relaxed italic flex-1 mt-2 overflow-y-auto pr-0.5">
            ${config.finalMessage || "Terima kasih telah menuntun langkahku, mendidikku dengan sabar, dan membukakan jendela dunia bagi masa depanku. Jasa bimbinganmu abadi dalam hatiku! 🌟"}
          </div>
          <p class="text-[7.5px] text-[#5C4033] text-right uppercase tracking-wider font-bold mt-1.5">— Muridmu yang Selalu Menghormatimu</p>
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
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-[#C5A880] shadow flex items-center justify-center font-bold text-[#5C4033] hover:bg-stone-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-handwriting text-xs text-zinc-700 mt-3 px-2"></p>
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

    // 1. Spawning falling glowing stars
    const canvas = $('star-canvas');
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
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1.5 - 0.75;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 50) * 0.2;
        this.angle += this.spin;
        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#FEF08A'; // soft yellow glow stars
        
        ctx.beginPath();
        // Drawing a small star shape
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size,
                     -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
          ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size/2),
                     -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size/2));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 15; i++) {
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

    // 2. Secret Code Lock
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

    // 3. Eraser Chalkboard Gate Drag-to-Erase Physics
    const chalkboardGate = $('chalkboard-gate');
    const eraser = $('eraser');
    let isDrawing = false;
    let eraseCount = 0;
    const requiredErase = 45; // Wiping threshold

    // Simple Drag & drop listener for Eraser
    eraser.addEventListener('mousedown', startEraserDrag);
    eraser.addEventListener('touchstart', startEraserDrag, {passive: true});

    document.addEventListener('mousemove', dragEraser);
    document.addEventListener('touchmove', dragEraser, {passive: false});

    document.addEventListener('mouseup', stopEraserDrag);
    document.addEventListener('touchend', stopEraserDrag);

    let dragStartX = 0;
    let dragStartY = 0;
    let eraserLeft = 0;
    let eraserTop = 0;

    function startEraserDrag(e) {
      isDrawing = true;
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX - eraser.offsetLeft;
      dragStartY = clientY - eraser.offsetTop;
      eraser.style.cursor = 'grabbing';
      
      playBgm();
    }

    function dragEraser(e) {
      if (!isDrawing) return;
      if (e.type === 'touchmove') e.preventDefault(); // disable screen scroll

      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      let x = clientX - dragStartX;
      let y = clientY - dragStartY;
      
      // Bounding box limits (keep eraser inside chalkboard frame)
      const maxW = chalkboardGate.clientWidth - eraser.clientWidth - 20;
      const maxH = chalkboardGate.clientHeight - eraser.clientHeight - 20;
      x = Math.max(20, Math.min(x, maxW));
      y = Math.max(20, Math.min(y, maxH));
      
      eraser.style.left = x + 'px';
      eraser.style.top = y + 'px';

      // Spawning chalk dust particles
      spawnChalkDust(x + eraser.clientWidth / 2, y + eraser.clientHeight / 2);
      
      eraseCount++;
      
      // Gradually fade out chalkboard gate writings
      if (eraseCount > 10) {
        const opacity = Math.max(0.05, 1 - (eraseCount / requiredErase));
        const elements = chalkboardGate.querySelectorAll('.chalk-writing, .chalk-doodle');
        elements.forEach(el => el.style.opacity = opacity);
      }

      if (eraseCount >= requiredErase) {
        completeEraserGate();
      }
    }

    function stopEraserDrag() {
      isDrawing = false;
      eraser.style.cursor = 'grab';
    }

    function spawnChalkDust(x, y) {
      for (let i = 0; i < 3; i++) {
        const dust = document.createElement('div');
        dust.className = 'chalk-dust';
        const size = Math.random() * 4 + 2;
        dust.style.width = size + 'px';
        dust.style.height = size + 'px';
        dust.style.left = (x + (Math.random() * 30 - 15)) + 'px';
        dust.style.top = (y + (Math.random() * 30 - 15)) + 'px';
        
        // Random direction for animation
        dust.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
        
        chalkboardGate.appendChild(dust);
        setTimeout(() => dust.remove(), 1000);
      }
    }

    function completeEraserGate() {
      // Unregister drag listeners
      document.removeEventListener('mousemove', dragEraser);
      document.removeEventListener('touchmove', dragEraser);
      isDrawing = false;
      
      // Lift blackboard gate
      chalkboardGate.classList.add('translate-y-[-100%]', 'opacity-0');
      setTimeout(() => {
        chalkboardGate.remove();
        triggerTypewriter();
      }, 1200);
    }

    // 4. Report Card award stamps interaction
    function toggleAwardStamp(row) {
      const stamp = row.querySelector('.grade-stamp');
      if (stamp) {
        stamp.classList.toggle('stamped');
        if (stamp.classList.contains('stamped')) {
          spawnRowSparkles(row);
        }
      }
    }

    function spawnRowSparkles(row) {
      const rect = row.getBoundingClientRect();
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle-float';
        sp.innerText = '⭐️';
        
        const rx = rect.left + (rect.width * 0.8) + (Math.random() * 40 - 20);
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

    // 7. Interactive red apple gift logic
    let appleCardActive = false;
    function toggleAppleNote() {
      const card = $('apple-card');
      appleCardActive = !appleCardActive;
      if (appleCardActive) {
        card.classList.add('active');
        spawnChalkSparkle({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 - 100 });
      } else {
        card.classList.remove('active');
      }
    }

    // 8. Polaroid cycling deck for Page 3 Corkboard
    let currentPhotoIndex = 0;
    const photoCount = CONFIG.photos ? CONFIG.photos.length : 0;
    
    function initPhotoDeck() {
      if (photoCount === 0) return;
      for (let i = 0; i < photoCount; i++) {
        const card = $('pcard-' + i);
        if (!card) continue;
        
        // Calculate relative position based on current active index
        let relativePos = (i - currentPhotoIndex + photoCount) % photoCount;
        
        card.style.opacity = '1';
        card.style.pointerEvents = relativePos === 0 ? 'auto' : 'none';
        
        if (relativePos === 0) {
          // Top Active Card
          card.style.zIndex = 30;
          card.style.transform = 'scale(1.0) rotate(-2deg) translateY(0px) translateX(0px)';
        } else if (relativePos === 1) {
          // Second Card
          card.style.zIndex = 20;
          card.style.transform = 'scale(0.94) rotate(4deg) translateY(6px) translateX(4px)';
        } else if (relativePos === 2) {
          // Third Card
          card.style.zIndex = 10;
          card.style.transform = 'scale(0.88) rotate(-6deg) translateY(12px) translateX(-4px)';
        } else {
          // Rest of cards are hidden
          card.style.zIndex = 5;
          card.style.transform = 'scale(0.82) rotate(0deg) translateY(18px)';
          card.style.opacity = '0';
        }
      }
    }
    
    // Run initial photo stack load
    setTimeout(initPhotoDeck, 100);

    function cyclePhoto(index) {
      if (photoCount <= 1) {
        // Zoom single photo directly
        zoomPhoto(CONFIG.photos[index].src, CONFIG.photos[index].caption || '');
        return;
      }
      
      if (index !== currentPhotoIndex) return; // only top card is clickable
      
      const topCard = $('pcard-' + index);
      if (!topCard) return;
      
      // Slide out to the side
      topCard.style.transform = 'translateX(130%) translateY(-20px) rotate(15deg) scale(0.95)';
      topCard.style.opacity = '0';
      
      setTimeout(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoCount;
        initPhotoDeck();
      }, 350);
    }

    // Modal view fallback
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

    // 9. Audio Player Interface (Vintage school bell style)
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

    // 11. Sparks on tap
    function spawnChalkSparkle(e) {
      for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'sparkle-float';
        star.innerText = ['✏️','✨','⭐️','🌟','💯','🍎'][Math.floor(Math.random() * 6)];
        
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
