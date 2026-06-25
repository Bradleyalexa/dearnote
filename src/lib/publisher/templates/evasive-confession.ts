import { PublishedConfig } from "../../schemas/card-draft";

export function generateEvasiveConfessionHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Pesan Rahasia Untukmu 💖";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // Cute romantic music for couple confession
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";
  const openingGame = config.openingGame || "cat_paw";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evasive Confession – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,400&family=Architects+Daughter&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            fredoka: ['"Fredoka"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            handwriting: ['"Architects Daughter"', 'cursive'],
            lora: ['"Lora"', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* CSS Styles for Evasive Confession */
    body {
      background: radial-gradient(circle, #ffe5ec 0%, #ffccd5 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #4A5568;
      font-family: 'Fredoka', sans-serif;
      touch-action: manipulation;
    }

    /* Checkered retro background pattern */
    .retro-grid {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 182, 193, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 182, 193, 0.15) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 1;
    }

    #game-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 5;
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
      border: 2px solid #FF8E9E;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 142, 158, 0.2);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Code Gate Screen */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffe5ec 0%, #ffc2d1 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Game Gate Container ── */
    #game-gate {
      position: fixed;
      inset: 0;
      background: #fff0f3;
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 80px rgba(255, 182, 193, 0.25);
      transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1), opacity 1s ease;
      overflow-y: auto;
      padding: 1.5rem;
    }

    /* Win95 Retro Window Styling */
    .win95-window {
      background: #f3e1e4;
      border-top: 3px solid #ffffff;
      border-left: 3px solid #ffffff;
      border-bottom: 3px solid #7c686c;
      border-right: 3px solid #7c686c;
      box-shadow: 4px 4px 10px rgba(0,0,0,0.15);
      padding: 4px;
    }
    .win95-titlebar {
      background: linear-gradient(90deg, #ff6b8b, #ffb3c1);
      color: white;
      font-weight: bold;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    .win95-btn {
      background: #f3e1e4;
      border-top: 2px solid #ffffff;
      border-left: 2px solid #ffffff;
      border-bottom: 2px solid #7c686c;
      border-right: 2px solid #7c686c;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: bold;
      color: #5c3e44;
      cursor: pointer;
      outline: none;
      transition: transform 0.05s;
    }
    .win95-btn:active {
      border-top: 2px solid #7c686c;
      border-left: 2px solid #7c686c;
      border-bottom: 2px solid #ffffff;
      border-right: 2px solid #ffffff;
      padding: 7px 15px 5px 17px;
    }

    /* ── GAME 1: CAT PAW TAPPING 🐾 ── */
    .paw-container {
      width: 260px;
      height: 240px;
      position: relative;
      overflow: hidden;
      background: #faf0f2;
      border: 2px dashed #ffb5c5;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .cat-paw-arm {
      width: 80px;
      height: 140px;
      background: #fcd5dc;
      border-radius: 40px 40px 0 0;
      position: absolute;
      bottom: -60px;
      transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: inset -5px 0 10px rgba(0,0,0,0.05);
      z-index: 2;
    }
    /* Cat Paw Pads */
    .cat-paw-pad-main {
      width: 50px;
      height: 42px;
      background: #ff8ea6;
      border-radius: 50% 50% 45% 45%;
      position: absolute;
      top: 20px;
      left: 15px;
      box-shadow: inset 1px 1px 3px rgba(255,255,255,0.4);
    }
    .cat-paw-toe {
      width: 16px;
      height: 18px;
      background: #ff8ea6;
      border-radius: 50%;
      position: absolute;
      box-shadow: inset 1px 1px 3px rgba(255,255,255,0.4);
    }
    .cat-paw-toe.t1 { top: 6px; left: 8px; }
    .cat-paw-toe.t2 { top: 2px; left: 24px; }
    .cat-paw-toe.t3 { top: 2px; left: 40px; }
    .cat-paw-toe.t4 { top: 8px; left: 56px; }

    .cat-paw-arm.tap-animation {
      transform: translateY(-35px) scale(1.05);
    }

    /* ── GAME 2: CLAW MACHINE 🧸 ── */
    .claw-arcade {
      width: 250px;
      height: 280px;
      position: relative;
      background: #fbe6eb;
      border: 4px solid #ff8ea6;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: inset 0 0 20px rgba(255, 142, 166, 0.2);
    }
    .claw-crane-rope {
      width: 3px;
      height: 40px;
      background: #8e7a7e;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      transition: height 0.8s ease-in-out;
    }
    .claw-body {
      width: 24px;
      height: 12px;
      background: #bdabb0;
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 4px;
    }
    .claw-left-arm, .claw-right-arm {
      width: 12px;
      height: 20px;
      border: 3px solid #bdabb0;
      border-top: none;
      position: absolute;
      bottom: -22px;
      transition: transform 0.3s;
    }
    .claw-left-arm {
      left: -8px;
      border-radius: 0 0 0 10px;
      transform-origin: top right;
      transform: rotate(-25deg);
    }
    .claw-right-arm {
      right: -8px;
      border-radius: 0 0 10px 0;
      transform-origin: top left;
      transform: rotate(25deg);
    }
    /* Claw closed state */
    .claw-crane.grabbing .claw-left-arm { transform: rotate(10deg); }
    .claw-crane.grabbing .claw-right-arm { transform: rotate(-10deg); }
    
    @keyframes claw-shake {
      0%,100% { transform: translateX(-50%) rotate(0deg); }
      20% { transform: translateX(-50%) rotate(-6deg); }
      40% { transform: translateX(-50%) rotate(6deg); }
      60% { transform: translateX(-50%) rotate(-4deg); }
      80% { transform: translateX(-50%) rotate(4deg); }
    }
    .claw-crane.shaking {
      animation: claw-shake 0.4s ease-in-out;
    }
    @keyframes toy-bounce {
      0%,100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
      60% { transform: translateY(2px); }
    }
    .prize-toy.bouncing {
      animation: toy-bounce 0.5s ease-in-out;
    }
    @keyframes toy-panic {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.2) rotate(-10deg); }
      50% { transform: scale(0.9) rotate(10deg); }
      75% { transform: scale(1.1) rotate(-5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    .prize-toy.panicking {
      animation: toy-panic 0.5s ease-in-out;
    }

    .claw-crane {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 60px;
      z-index: 10;
      transition: left 0.8s ease-in-out;
    }

    .prize-toy {
      width: 40px;
      height: 40px;
      position: absolute;
      bottom: 12px;
      transition: all 0.8s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      line-height: 1;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
    }
    .prize-toy.heart {
      font-size: 28px;
    }

    .prize-chute {
      width: 50px;
      height: 40px;
      background: #5c4b4f;
      position: absolute;
      bottom: 0;
      left: 10px;
      border-radius: 6px 6px 0 0;
      border: 2px solid #ff8ea6;
      box-shadow: inset 0 4px 8px rgba(0,0,0,0.3);
    }

    /* ── GAME 3: WASHI TAPE PEELING 🎀 ── */
    .peeling-envelope-box {
      width: 260px;
      height: 200px;
      background: #fffdfc;
      border: 3px solid #ffb5c5;
      border-radius: 16px;
      position: relative;
      box-shadow: 0 10px 25px rgba(255, 181, 197, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .washi-tape-strip {
      position: absolute;
      width: 180px;
      height: 28px;
      background: rgba(255, 142, 166, 0.85);
      border: 1.5px dashed rgba(255,255,255,0.7);
      box-shadow: 0 4px 8px rgba(0,0,0,0.08);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: bold;
      z-index: 10;
      border-radius: 4px;
      user-select: none;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s;
    }
    .washi-tape-strip::after {
      content: " 🎀 SWIPE / TAP";
      font-size: 8px;
      opacity: 0.9;
      margin-left: 5px;
    }
    .washi-tape-strip.t1 {
      transform: rotate(-15deg);
      top: 40px;
      background: #ffa6c9;
    }
    .washi-tape-strip.t2 {
      transform: rotate(8deg);
      top: 85px;
      background: #ff8ea6;
    }
    .washi-tape-strip.t3 {
      transform: rotate(-5deg);
      top: 130px;
      background: #ff7096;
    }
    .washi-tape-strip.peeled {
      transform: translate(220px, -220px) rotate(45deg) scale(0.3) !important;
      opacity: 0 !important;
      pointer-events: none;
    }
    .envelope-heart-seal {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      cursor: pointer;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 5;
      filter: drop-shadow(0 4px 10px rgba(255, 51, 102, 0.4));
    }
    @keyframes pulse-seal {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }
    .envelope-heart-seal.revealed {
      opacity: 1;
      transform: scale(1);
      animation: pulse-seal 1.5s ease-in-out infinite;
    }

    /* ── GAME 4: CATCH HEARTS GAME 🧺 ── */
    .catch-game-box {
      width: 270px;
      height: 280px;
      background: #fbf0f2;
      border: 3px solid #ffccd5;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      touch-action: none;
    }
    .game-basket {
      width: 55px;
      height: 30px;
      background: #d37a8c;
      border-radius: 0 0 16px 16px;
      border: 3px solid #b15264;
      position: absolute;
      bottom: 10px;
      left: 110px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .game-basket::before {
      content: "🧺";
      font-size: 16px;
      margin-top: -6px;
    }

    /* Progress and indicators */
    .progress-bar-outer {
      width: 100%;
      height: 10px;
      background: #ffe3e8;
      border-radius: 5px;
      border: 1px solid #ffb5c5;
      overflow: hidden;
    }
    .progress-bar-inner {
      width: 0%;
      height: 100%;
      background: linear-gradient(to right, #ff8ea6, #ff4d6d);
      transition: width 0.3s ease;
    }

    /* ── Retro Confession Dialog Box ── */
    #confession-dialog {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 320px;
      z-index: 600;
      animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes bounceIn {
      0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1.0); opacity: 1; }
    }

    #no-btn {
      transition: all 0.15s ease-out;
      cursor: pointer;
    }
    #no-btn.evading {
      position: fixed;
      z-index: 10000;
    }

    /* ── Main Keepsake Screen (Revealed on YES) ── */
    #keepsake-screen {
      display: none;
      opacity: 0;
      transition: opacity 1s ease-in-out;
      z-index: 10;
    }

    /* Polaroid Scrapbook styles */
    .keepsake-notebook {
      background: #fffdfb;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(255, 142, 166, 0.15);
      border: 2px solid #ffe3e8;
    }
    .notebook-spine {
      background: repeating-linear-gradient(0deg, #ffccd5 0px, #ffccd5 10px, #ffb3c1 10px, #ffb3c1 20px);
      width: 16px;
      border-radius: 20px 0 0 20px;
    }

    .ruled-lines {
      background-image: linear-gradient(rgba(255, 182, 193, 0.2) 1px, transparent 1px);
      background-size: 100% 24px;
      line-height: 24px;
    }

    .polaroid-card {
      background: white;
      border: 5px solid white;
      border-bottom: 24px solid white;
      box-shadow: 0 8px 16px rgba(255, 117, 143, 0.12);
      border-radius: 1px;
      transition: transform 0.3s;
    }
    .polaroid-card:hover {
      transform: scale(1.03) rotate(0deg) !important;
      z-index: 40;
    }

    /* Sparkles */
    .sparkle-float {
      position: absolute;
      font-size: 1.5rem;
      pointer-events: none;
      animation: floatStar 1s forwards ease-out;
      z-index: 200;
    }
    @keyframes floatStar {
      0% { opacity: 0; transform: translate(0, 0) scale(0.6) rotate(0deg); }
      30% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--dx), -100px) scale(1.3) rotate(120deg); }
    }

    /* Voice Note cassette */
    .cassette-player {
      background: #fff0f3;
      border: 2px dashed #ffb5c5;
      border-radius: 16px;
    }

    /* Preview reset button styling */
    #reset-btn {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: #4a5568;
      color: white;
      font-size: 10px;
      padding: 6px 12px;
      border-radius: 20px;
      z-index: 100;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    #reset-btn:hover { opacity: 1; }
  </style>
</head>
<body class="flex flex-col min-h-screen items-center justify-center p-4 relative" onclick="spawnTapSparkle(event)">

  <div class="retro-grid"></div>
  <canvas id="game-canvas"></canvas>

  <!-- BGM Button -->
  <button id="bgm-btn" class="hidden" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── 1. SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate">
    <div class="bg-[#FFFDF9] max-w-sm w-full rounded-[1.5rem] p-8 border-4 border-[#ff8ea6] shadow-2xl text-center relative overflow-hidden">
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#ff5a79] mb-2 font-fredoka">DearNote • Confession</p>
      <h1 class="text-2xl font-bold font-fredoka text-[#ff5a79] mb-4">Pesan Terkunci</h1>
      <p class="text-xs text-stone-700 leading-relaxed mb-6 font-fredoka">
        Pesan rahasia dari <strong>${config.fromName}</strong> dilindungi kode akses.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Masukkan Kode" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#ffccd5] rounded-xl text-center font-fredoka tracking-widest text-[#ff5a79] focus:outline-none focus:border-[#ff8ea6] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#ff5a79] hover:bg-[#ff4064] text-white font-bold rounded-xl transition-all shadow-md font-fredoka text-xs tracking-wider uppercase">
          Buka Pesan
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah. Silakan coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── 2. OPENING GAME GATE ── -->
  <div id="game-gate" class="${hasSecretCode ? "hidden" : ""}">
    <div class="max-w-sm w-full flex flex-col items-center">
      
      <!-- Title -->
      <div class="text-center mb-6">
        <span class="text-xs uppercase tracking-[3px] text-pink-600 font-bold mb-2 block">Pesan Spesial Untukmu 💌</span>
        <h1 class="text-2xl font-bold font-fredoka text-pink-600 leading-tight">
          Selesaikan Game Pembuka untuk Membuka Surat
        </h1>
        <p class="text-xs text-stone-500 font-medium mt-1">
          Dari: <span class="text-pink-600 font-bold">${config.fromName}</span> • Untuk: <span class="text-pink-600 font-bold">${config.toName}</span>
        </p>
      </div>

      <!-- Game Viewport -->
      <div class="mb-6 flex justify-center w-full">
        
        <!-- Case A: Cat Paw Tapping 🐾 -->
        ${openingGame === "cat_paw" ? `
        <div class="paw-container" onclick="tapCatPaw()">
          <div id="cat-paw" class="cat-paw-arm">
            <div class="cat-paw-toe t1"></div>
            <div class="cat-paw-toe t2"></div>
            <div class="cat-paw-toe t3"></div>
            <div class="cat-paw-toe t4"></div>
            <div class="cat-paw-pad-main"></div>
          </div>
          
          <div class="absolute top-6 text-center select-none pointer-events-none px-4">
            <span class="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">Game Towel Cakar Kucing</span>
            <span class="text-stone-600 font-bold text-sm mt-1 block">Towel cakar kucing di bawah 5 kali!</span>
          </div>

          <div class="absolute bottom-6 bg-white/80 border border-pink-200 px-3 py-1.5 rounded-full text-xs font-bold text-pink-600 shadow-sm" id="paw-counter">
            🐾 Towel: 0/5
          </div>
        </div>
        ` : ""}

        <!-- Case B: Claw Machine 🧸 -->
        ${openingGame === "claw_machine" ? `
        <div class="claw-arcade flex flex-col items-center justify-between p-4">
          
          <!-- Machine screen -->
          <div class="relative w-full h-[180px] bg-rose-50/50 border-2 border-rose-200 rounded-lg overflow-hidden">
            <div class="absolute bottom-0 left-0 right-0 h-4 bg-rose-200/50 border-t border-rose-300"></div>
            
            <!-- Crane Claw -->
            <div id="claw-crane" class="claw-crane">
              <div id="claw-rope" class="claw-crane-rope">
                <div class="claw-body">
                  <div class="claw-left-arm"></div>
                  <div class="claw-right-arm"></div>
                </div>
              </div>
            </div>

            <!-- Target Love Toy -->
            <div id="love-toy" class="prize-toy heart" style="left: 110px;">🧸</div>

            <!-- Fake small background balls -->
            <div class="w-6 h-6 rounded-full bg-pink-300/60 absolute bottom-1.5 left-20"></div>
            <div class="w-6 h-6 rounded-full bg-purple-300/60 absolute bottom-1.5 left-28"></div>
            <div class="w-6 h-6 rounded-full bg-yellow-300/60 absolute bottom-1.5 left-15"></div>
            <div class="w-6 h-6 rounded-full bg-blue-300/60 absolute bottom-1.5 left-36"></div>

            <!-- Prize Drop Chute -->
            <div class="prize-chute"></div>
          </div>

          <!-- Bottom controls -->
          <div class="w-full flex flex-col items-center gap-1 mt-3 px-2">
            <span id="claw-status" class="text-[10px] font-bold text-pink-600 text-center min-h-[14px] transition-all duration-300">🧸 Bantu aku capit bonekanya!</span>
            <div class="flex items-center justify-between w-full">
              <span id="claw-attempts" class="text-[9px] text-pink-400">Percobaan: 0/3</span>
              <button id="claw-btn" onclick="startClawMachine()" class="win95-btn !py-1 !px-4 text-xs !bg-pink-100 hover:!bg-pink-200 !border-pink-300 text-pink-700">
                CAPIT! 🧸
              </button>
            </div>
          </div>
        </div>
        ` : ""}

        <!-- Case C: Washi Tape Peeling 🎀 -->
        ${openingGame === "tape_peeling" ? `
        <div class="peeling-envelope-box">
          <div id="tape-1" class="washi-tape-strip t1" onclick="peelTape(1)">Strip Selotip 1</div>
          <div id="tape-2" class="washi-tape-strip t2" onclick="peelTape(2)">Strip Selotip 2</div>
          <div id="tape-3" class="washi-tape-strip t3" onclick="peelTape(3)">Strip Selotip 3</div>
          
          <!-- Heart seal revealed after peeling -->
          <div id="envelope-seal" class="envelope-heart-seal" onclick="openTapeKeepsake()">❤️</div>

          <div class="absolute bottom-4 text-center pointer-events-none select-none">
            <span id="tape-instruction" class="text-[9px] text-pink-500 uppercase tracking-widest font-bold font-fredoka">Kupas 3 pita selotip di atas!</span>
          </div>
        </div>
        ` : ""}

        <!-- Case D: Catch Falling Hearts 🧺 -->
        ${openingGame === "catch_hearts" ? `
        <div class="catch-game-box" id="catch-container">
          <canvas id="catch-canvas" class="w-full h-full block bg-[#fff0f3]"></canvas>
          
          <div class="game-basket" id="catch-basket"></div>
          
          <div class="absolute top-2 left-2 right-2 bg-white/70 border border-pink-200 rounded-lg p-2 flex justify-between items-center z-20 pointer-events-none">
            <span class="text-[9px] font-bold text-pink-600">TANGKAP HATI: <span id="catch-score">0/5</span></span>
            <div class="w-24 progress-bar-outer">
              <div id="catch-progress" class="progress-bar-inner"></div>
            </div>
          </div>

          <!-- Touch/Drag helper area -->
          <div class="absolute inset-0 z-10 cursor-ew-resize" id="catch-touch-zone"></div>
          <div class="absolute bottom-1 right-2 pointer-events-none text-[8px] text-pink-400 font-bold">Seret Basket ke Kiri/Kanan &rarr;</div>
        </div>
        ` : ""}

      </div>

    </div>
  </div>

  <!-- ── 3. RETRO CONFESSION DIALOG WINDOW ── -->
  <div id="confession-dialog" class="win95-window">
    <div class="win95-titlebar select-none">
      <span>Pesan Penting Dari ${config.fromName} ❤️</span>
      <button class="w-4 h-4 bg-[#f3e1e4] border border-gray-600 text-stone-700 font-bold flex items-center justify-center text-[10px]" onclick="dialogCloseWiggle()">×</button>
    </div>
    
    <div class="p-6 text-center bg-[#fff0f3] mt-1 space-y-4">
      <span class="text-3xl block animate-bounce">💌</span>
      <h2 class="font-fredoka font-bold text-[#ff5a79] text-lg leading-snug">
        Untuk ${config.toName} 💕
      </h2>
      <p class="text-xs text-stone-700 leading-relaxed font-fredoka">
        Ada pesan penting dari <strong>${config.fromName}</strong>:
      </p>
      <div class="bg-white/80 border border-pink-200 rounded-lg p-3 text-sm font-bold text-pink-600 leading-normal inline-block max-w-full">
        ${config.letterTitle || "Kamu mau gak jadi pacarku? 🥺👉👈"}
      </div>

      <!-- Buttons Box -->
      <div id="btn-box" class="flex items-center justify-center gap-6 pt-4 relative w-full select-none">
        <button id="no-btn" class="win95-btn min-w-[80px]">
          Gak 🙈
        </button>
        <button id="yes-btn" onclick="acceptConfession()" class="win95-btn min-w-[80px]">
          Mau! 💕
        </button>
      </div>
    </div>
  </div>

  <!-- ── 4. KEEPSAKE SCREEN (Revealed on YES) ── -->
  <div id="keepsake-screen" class="max-w-lg w-full px-2 sm:px-4 py-8">
    <div class="keepsake-notebook flex shadow-2xl relative min-h-[500px]">
      <div class="notebook-spine flex-shrink-0"></div>
      
      <div class="flex-1 p-6 sm:p-8 flex flex-col justify-between">
        <div class="flex-1 flex flex-col min-h-0">
          
          <!-- Keepsake Header -->
          <div class="border-b-2 border-pink-100 pb-3 mb-4 text-center">
            <span class="text-[9px] font-bold text-pink-400 uppercase tracking-widest font-fredoka">Surat Catatan Cinta</span>
            <h1 class="font-fredoka text-xl font-bold text-[#ff5a79] mt-1">${letterTitle}</h1>
          </div>

          <!-- Rule paper journal text content -->
          <div class="ruled-lines text-stone-700 font-lora text-sm whitespace-pre-wrap break-words pr-1 mb-4" id="typewriter-text"></div>

          <!-- Polaroid Gallery Grid (Single active layout with stack cycle) -->
          <div class="my-4 flex items-center justify-center flex-col relative min-h-[260px]" id="gallery-container">
            ${config.photos && config.photos.length > 0 ? `
            <div class="relative w-full h-[220px] flex items-center justify-center" id="photo-deck">
              ${config.photos.map((photo, i) => {
                return `
                <div class="polaroid-card p-2 w-[180px] absolute transition-all duration-500 cursor-zoom-in" 
                  id="pcard-${i}"
                  onclick="zoomPhoto(CONFIG.photos[${i}].src, CONFIG.photos[${i}].caption || '')">
                  <div class="w-full aspect-[4/3] overflow-hidden rounded bg-stone-50">
                    <img src="${photo.src}" alt="Confession Photo" class="w-full h-full object-cover">
                  </div>
                  ${photo.caption ? `
                  <p class="text-center font-handwriting text-[13px] text-stone-600 mt-2 px-1 leading-snug break-words">${photo.caption}</p>
                  ` : ""}
                </div>
                `;
              }).join("")}
            </div>
            ${config.photos.length > 1 ? `
            <button type="button" onclick="cyclePhoto(currentPhotoIndex)" class="mt-2 text-xs font-semibold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-pink-200 shadow-sm cursor-pointer transition-all flex items-center gap-1.5 z-50">
              Foto Selanjutnya 🔄
            </button>
            ` : ""}
            ` : ""}
          </div>

          <!-- Voice Note Cassette Player -->
          ${hasVoiceNote ? `
          <div class="cassette-player p-4 flex items-center gap-4 my-2 flex-shrink-0">
            <button id="play-btn" onclick="toggleAudio()" class="w-10 h-10 rounded-full bg-[#ff758f] hover:bg-[#ff5c8a] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
              <span id="play-icon" class="text-xs ml-0.5">▶</span>
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-[9px] uppercase font-bold tracking-widest text-pink-500 font-fredoka mb-1">🎙️ Pesan Suara Pengakuan</p>
              <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-2 bg-pink-100 rounded-full cursor-pointer relative">
                <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#ff758f] rounded-full transition-all duration-100 ease-linear"></div>
              </div>
            </div>
            <span id="audio-time" class="text-xs font-semibold text-[#ff758f] font-fredoka flex-shrink-0">0:00</span>
            <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
          </div>
          ` : ""}

        </div>

        <!-- Keepsake Final Plaque Footer -->
        <div class="border-t border-pink-100 pt-4 mt-2 flex flex-col justify-end text-right">
          <p class="text-xs text-stone-500 italic">
            ${config.finalMessage || "Terima kasih sudah memilihku untuk menjadi kebahagiaanmu. I love you! ❤️"}
          </p>
          <span class="text-xs font-bold text-pink-600 tracking-wider uppercase mt-2 block">
            — Dari: ${config.fromName}
          </span>
        </div>

      </div>
    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-sm w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-[#ffb5c5] shadow flex items-center justify-center font-bold text-[#ff5a79] hover:bg-stone-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-handwriting text-xs text-stone-600 mt-3 px-2"></p>
    </div>
  </div>

  <!-- Reset Button (Preview isolation only) -->
  <button id="reset-btn" class="hidden" onclick="resetState()">Reset Game</button>

  <!-- Script Logic -->
  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      fromName: ${JSON.stringify(config.fromName)},
      toName: ${JSON.stringify(config.toName)},
      letterTitle: ${JSON.stringify(letterTitle)},
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote},
      openingGame: ${JSON.stringify(openingGame)}
    };

    function $(id) { return document.getElementById(id); }

    // Detect if we are in dearnote preview mode
    const isPreview = window.IS_DEARNOTE_PREVIEW || false;
    if (isPreview) {
      $('reset-btn').classList.remove('hidden');
    }

    // 1. Spawning floating falling hearts on canvas
    const canvas = $('game-canvas');
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
        this.size = Math.random() * 6 + 4;
        this.speedY = Math.random() * 0.7 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.1;
        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff8ea6';
        ctx.beginPath();
        // Heart drawing formula
        ctx.moveTo(0, -this.size / 4);
        ctx.bezierCurveTo(-this.size/2, -this.size, -this.size, -this.size/2, -this.size, 0);
        ctx.bezierCurveTo(-this.size, this.size/2, 0, this.size, 0, this.size * 1.2);
        ctx.bezierCurveTo(0, this.size, this.size, this.size/2, this.size, 0);
        ctx.bezierCurveTo(this.size, -this.size/2, this.size/2, -this.size, 0, -this.size/4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
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

    // 2. Secret Code Verification
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        $('code-gate').classList.add('translate-y-[-100%]', 'opacity-0');
        playBgm();
        setTimeout(() => {
          $('code-gate').remove();
          $('game-gate').classList.remove('hidden');
          // Start catch hearts canvas game if that's selected
          if (CONFIG.openingGame === 'catch_hearts') {
            initCatchHeartsGame();
          }
        }, 900);
      } else {
        $('code-err').classList.remove('opacity-0');
        $('code-input').classList.add('border-red-400', 'animate-shake');
        setTimeout(() => $('code-input').classList.remove('animate-shake'), 400);
      }
    }

    // Initialize catch hearts game if it's the opening game and no code gate
    if (CONFIG.openingGame === 'catch_hearts' && !CONFIG.secretCode) {
      window.addEventListener('load', () => {
        initCatchHeartsGame();
      });
    }

    // 3. Opening Game A: Cat Paw Tapping 🐾
    let pawTapCount = 0;
    const maxPawTaps = 5;
    function tapCatPaw() {
      if (pawTapCount >= maxPawTaps) return;
      
      const paw = $('cat-paw');
      paw.classList.add('tap-animation');
      playBgm();
      
      // Spawn small floating meow heart from claw pad
      spawnTapHearts(window.innerWidth / 2, window.innerHeight / 2 - 40);
      
      pawTapCount++;
      $('paw-counter').innerText = '🐾 Towel: ' + pawTapCount + '/' + maxPawTaps;
      
      setTimeout(() => {
        paw.classList.remove('tap-animation');
      }, 150);

      if (pawTapCount >= maxPawTaps) {
        setTimeout(() => {
          triggerConfession();
        }, 500);
      }
    }

    // 4. Opening Game B: Claw Machine 🧸 (3-attempt emotional arc)
    let clawInProgress = false;
    let clawAttempts = 0;
    
    // Dramatic narrative per attempt
    const clawNarrative = [
      // Attempt 1: SO CLOSE but slips
      {
        btnLabel: 'CAPIT LAGI! 😤',
        status: '😱 Hampir kena!! Tapi... lepas??',
        toyEscape: true,
        toyNewLeft: '60px',
        failMsg: ['💔','😩','Noo!'],
      },
      // Attempt 2: Grabs briefly, dramatic wiggle, drops again
      {
        btnLabel: 'SEKALI LAGI!! 😭',
        status: '😭 KeCapit tapi jatuh lagi huhu',
        toyEscape: true,
        toyNewLeft: '130px',
        failMsg: ['😭','💔','HUHU'],
      },
      // Attempt 3: SUCCESS
      {
        btnLabel: null, // no retry
        status: '🎉 YESSS!! Bonekanya berhasil dicapit!!',
        toyEscape: false,
        toyNewLeft: null,
        failMsg: null,
      },
    ];

    function setClawStatus(text) {
      const el = $('claw-status');
      if (el) {
        el.style.opacity = '0';
        setTimeout(() => { el.innerText = text; el.style.opacity = '1'; }, 200);
      }
    }

    function spawnClawFailParticles(x, y, msgs) {
      msgs.forEach((msg, i) => {
        setTimeout(() => {
          const p = document.createElement('div');
          p.className = 'sparkle-float';
          p.innerText = msg;
          p.style.left = (x + (Math.random() * 60 - 30)) + 'px';
          p.style.top = (y + (Math.random() * 30 - 15)) + 'px';
          p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
          p.style.fontSize = '14px';
          document.body.appendChild(p);
          setTimeout(() => p.remove(), 900);
        }, i * 120);
      });
    }

    function startClawMachine() {
      if (clawInProgress) return;
      clawInProgress = true;
      playBgm();

      const crane = $('claw-crane');
      const rope = $('claw-rope');
      const toy = $('love-toy');
      const btn = $('claw-btn');
      const attemptsEl = $('claw-attempts');

      clawAttempts++;
      const attempt = clawNarrative[clawAttempts - 1];
      if (attemptsEl) attemptsEl.innerText = 'Percobaan: ' + clawAttempts + '/3';

      btn.disabled = true;
      btn.innerText = 'MENCAPIT...';
      setClawStatus(clawAttempts === 1 ? '⚙️ Mesin bergerak...' : clawAttempts === 2 ? '⚙️ Sekali lagi pasti bisa!' : '⚙️ Kalau ga kecapit auto gagal');

      // Get current toy left for targeting
      const toyLeft = parseInt(toy.style.left) || 110;
      const craneTarget = (toyLeft + 10) + 'px';

      // Step 1: Move crane over toy
      crane.style.left = craneTarget;

      setTimeout(() => {
        // Step 2: Drop rope down
        rope.style.height = '120px';

        setTimeout(() => {
          // Step 3: Close claw (grab attempt)
          crane.classList.add('grabbing');

          setTimeout(() => {
            if (!attempt.toyEscape) {
              // === SUCCESS (attempt 3) ===
              // Lift toy up with claw
              toy.style.bottom = '100px';
              toy.style.left = craneTarget;
              rope.style.height = '40px';

              setTimeout(() => {
                // Move to prize chute
                crane.style.left = '32px';
                toy.style.left = '30px';

                setTimeout(() => {
                  // Drop toy in chute with celebration
                  crane.classList.remove('grabbing');
                  toy.style.bottom = '4px';
                  setClawStatus(attempt.status);

                  // Victory particles
                  const rect = toy.getBoundingClientRect();
                  for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                      const p = document.createElement('div');
                      p.className = 'sparkle-float';
                      p.innerText = ['🎉','⭐','💕','✨','🧸','🌸'][Math.floor(Math.random() * 6)];
                      p.style.left = (rect.left + Math.random() * 60 - 30) + 'px';
                      p.style.top = (rect.top - Math.random() * 40) + 'px';
                      p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
                      p.style.fontSize = '18px';
                      document.body.appendChild(p);
                      setTimeout(() => p.remove(), 1000);
                    }, i * 100);
                  }

                  setTimeout(() => triggerConfession(), 1200);
                }, 900);
              }, 900);

            } else {
              // === FAIL (attempt 1 or 2) ===
              // Claw closes and immediately shakes — grip fails
              crane.classList.add('shaking');
              toy.classList.add('panicking');

              setTimeout(() => {
                // Claw opens — toy escapes!
                crane.classList.remove('grabbing', 'shaking');
                toy.classList.remove('panicking');
                rope.style.height = '40px';

                // Toy slides to a new position
                toy.style.left = attempt.toyNewLeft;
                toy.classList.add('bouncing');
                setTimeout(() => toy.classList.remove('bouncing'), 600);

                // Spawn fail particles
                const rect = toy.getBoundingClientRect();
                spawnClawFailParticles(rect.left + rect.width / 2, rect.top, attempt.failMsg);

                setTimeout(() => {
                  setClawStatus(attempt.status);
                  // Reset crane to center
                  crane.style.left = '50%';

                  setTimeout(() => {
                    // Re-enable button for next attempt
                    btn.innerText = attempt.btnLabel;
                    btn.disabled = false;
                    clawInProgress = false;
                  }, 500);
                }, 300);
              }, 500);
            }
          }, 500);
        }, 800);
      }, 800);
    }

    // 5. Opening Game C: Washi Tape Peeling 🎀
    let peeledTapes = new Set();
    function peelTape(num) {
      const tape = $('tape-' + num);
      if (!tape || peeledTapes.has(num)) return;
      
      tape.classList.add('peeled');
      peeledTapes.add(num);
      playBgm();
      
      // Spawn small tape paper particles on peel
      const rect = tape.getBoundingClientRect();
      spawnTapHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);

      if (peeledTapes.size === 3) {
        $('tape-instruction').innerText = 'Ketuk Hati Untuk Buka Surat!';
        $('envelope-seal').classList.add('revealed');
      }
    }

    function openTapeKeepsake() {
      if (peeledTapes.size < 3) return;
      triggerConfession();
    }

    // 6. Opening Game D: Catch Falling Hearts 🧺
    let catchScore = 0;
    const maxCatch = 5;
    let catchGameInterval;
    let catchHeartsList = [];
    let basketX = 110;
    let isCatchGameOver = false;

    function initCatchHeartsGame() {
      const catchCanvas = $('catch-canvas');
      const catchCtx = catchCanvas.getContext('2d');
      const container = $('catch-container');
      const basket = $('catch-basket');
      const touchZone = $('catch-touch-zone');
      
      catchCanvas.width = 270;
      catchCanvas.height = 280;

      // Handle dragging basket via PointerEvents (smooth and supports touchscreen)
      touchZone.addEventListener('pointerdown', (e) => {
        moveBasket(e);
        touchZone.setPointerCapture(e.pointerId);
      });
      touchZone.addEventListener('pointermove', (e) => {
        moveBasket(e);
      });
      
      function moveBasket(e) {
        if (isCatchGameOver) return;
        const rect = catchCanvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        basketX = Math.max(0, Math.min(catchCanvas.width - 55, clientX - 27));
        basket.style.left = basketX + 'px';
      }

      class HeartToy {
        constructor() {
          this.x = Math.random() * (catchCanvas.width - 20) + 10;
          this.y = 0;
          this.speed = Math.random() * 1.5 + 1.2;
          this.size = 14;
        }
        update() {
          this.y += this.speed;
        }
        draw() {
          catchCtx.save();
          catchCtx.translate(this.x, this.y);
          catchCtx.fillStyle = '#ff4d6d';
          catchCtx.beginPath();
          catchCtx.moveTo(0, -this.size / 4);
          catchCtx.bezierCurveTo(-this.size/2, -this.size, -this.size, -this.size/2, -this.size, 0);
          catchCtx.bezierCurveTo(-this.size, this.size/2, 0, this.size, 0, this.size * 1.2);
          catchCtx.bezierCurveTo(0, this.size, this.size, this.size/2, this.size, 0);
          catchCtx.bezierCurveTo(this.size, -this.size/2, this.size/2, -this.size, 0, -this.size/4);
          catchCtx.closePath();
          catchCtx.fill();
          catchCtx.restore();
        }
      }

      function gameLoop() {
        if (isCatchGameOver) return;
        catchCtx.clearRect(0, 0, catchCanvas.width, catchCanvas.height);
        
        // Spawn hearts randomly
        if (Math.random() < 0.02 && catchHeartsList.length < 3) {
          catchHeartsList.push(new HeartToy());
        }

        catchHeartsList.forEach((h, idx) => {
          h.update();
          h.draw();

          // Check basket collision: Y is close to basket height (240px range)
          if (h.y >= 235 && h.y <= 255) {
            // X matches basket position
            if (h.x >= basketX - 10 && h.x <= basketX + 65) {
              catchScore++;
              $('catch-score').innerText = catchScore + '/' + maxCatch;
              $('catch-progress').style.width = (catchScore * 20) + '%';
              
              // Spawn meow spark
              spawnTapHearts(h.x + container.getBoundingClientRect().left, h.y + container.getBoundingClientRect().top);

              catchHeartsList.splice(idx, 1);
              playBgm();

              if (catchScore >= maxCatch) {
                isCatchGameOver = true;
                setTimeout(() => {
                  triggerConfession();
                }, 400);
              }
              return;
            }
          }

          // Offscreen filter
          if (h.y > catchCanvas.height + 20) {
            catchHeartsList.splice(idx, 1);
          }
        });

        requestAnimationFrame(gameLoop);
      }
      
      gameLoop();
    }

    // 7. Transition to Confession retro dialog box
    function triggerConfession() {
      $('game-gate').classList.add('translate-y-[-100%]', 'opacity-0');
      $('bgm-btn').classList.remove('hidden');
      setTimeout(() => {
        $('game-gate').remove();
        $('confession-dialog').style.display = 'block';
        initEvasiveNoButton();
      }, 800);
    }

    // 8. Evasive NO Button Logic
    function initEvasiveNoButton() {
      const noBtn = $('no-btn');
      let isEvading = false;
      
      function startEvading() {
        if (isEvading) return;
        isEvading = true;
        // Move button to body so it can roam freely (breaks out of transform containing block)
        document.body.appendChild(noBtn);
        noBtn.classList.add('evading');
        teleportNoButton();
      }
      
      function teleportNoButton() {
        const btnW = noBtn.offsetWidth || 80;
        const btnH = noBtn.offsetHeight || 36;
        
        // Use documentElement.clientWidth/Height to exclude scrollbars
        const vw = document.documentElement.clientWidth || window.innerWidth;
        const vh = document.documentElement.clientHeight || window.innerHeight;
        
        // Strict padding from edges
        const pad = 24;
        
        // Calculate safe range
        const minX = pad;
        const minY = pad;
        const maxX = vw - btnW - pad;
        const maxY = vh - btnH - pad;
        
        // Generate random position, then hard-clamp to be safe
        let randomX = minX + Math.random() * Math.max(0, maxX - minX);
        let randomY = minY + Math.random() * Math.max(0, maxY - minY);
        
        // Double-clamp: absolutely no escape
        randomX = Math.max(pad, Math.min(randomX, vw - btnW - pad));
        randomY = Math.max(pad, Math.min(randomY, vh - btnH - pad));
        
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        
        // Spawn small escape sparks
        spawnNoSparks();
      }

      // First interaction triggers evasion mode; subsequent ones teleport
      function onFirstInteraction(e) {
        if (e.type === 'touchstart') e.preventDefault();
        if (!isEvading) {
          startEvading();
        } else {
          teleportNoButton();
        }
      }
      
      noBtn.addEventListener('mouseover', onFirstInteraction);
      noBtn.addEventListener('pointerenter', onFirstInteraction);
      noBtn.addEventListener('touchstart', onFirstInteraction);
    }

    function spawnNoSparks() {
      const btn = $('no-btn');
      const rect = btn.getBoundingClientRect();
      const sp = document.createElement('div');
      sp.className = 'sparkle-float';
      sp.innerText = '💨';
      sp.style.left = (rect.left + rect.width / 2) + 'px';
      sp.style.top = (rect.top + rect.height / 2) + 'px';
      sp.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 800);
    }

    function dialogCloseWiggle() {
      const dialog = $('confession-dialog');
      dialog.classList.add('animate-shake', 'border-red-400');
      setTimeout(() => dialog.classList.remove('animate-shake', 'border-red-400'), 500);
    }

    // 9. Accept Confession (Click YES)
    function acceptConfession() {
      $('confession-dialog').classList.add('scale-70', 'opacity-0');
      
      // Hearts confetti explosion
      const rect = $('yes-btn').getBoundingClientRect();
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          spawnHeartParty(rect.left + Math.random() * 200 - 100, rect.top - Math.random() * 100);
        }, i * 20);
      }

      playBgm();

      setTimeout(() => {
        $('confession-dialog').remove();
        const noBtn = $('no-btn');
        if (noBtn) noBtn.remove();
        
        const keepsake = $('keepsake-screen');
        keepsake.style.display = 'block';
        setTimeout(() => {
          keepsake.style.opacity = '1';
          triggerTypewriter();
          initPhotoDeck();
        }, 100);
      }, 600);
    }

    function spawnHeartParty(x, y) {
      const heart = document.createElement('div');
      heart.className = 'sparkle-float';
      heart.innerText = ['❤️','💖','💕','✨','🌸'][Math.floor(Math.random() * 5)];
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.setProperty('--dx', (Math.random() * 140 - 70) + 'px');
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }

    // 10. Typewriter Letter Animation
    let typewriterStarted = false;
    function triggerTypewriter() {
      if (typewriterStarted) return;
      typewriterStarted = true;
      
      const container = $('typewriter-text');
      const text = CONFIG.letterBody;
      let index = 0;
      const speed = 25; // character delay

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

    // 11. Photo stack cycle deck
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
          card.style.transform = 'scale(0.88) rotate(-4deg) translateY(12px) translateX(-5px)';
        } else {
          card.style.zIndex = 5;
          card.style.transform = 'scale(0.82) rotate(0deg) translateY(18px)';
          card.style.opacity = '0';
        }
      }
    }

    function cyclePhoto(index) {
      if (photoCount <= 1) return;
      const topCard = $('pcard-' + index);
      if (!topCard) return;

      // Peel animation off to the right
      topCard.style.transform = 'translateX(130%) translateY(-25px) rotate(15deg) scale(0.9)';
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

    // 12. Voice Note Audio controller
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

    // 13. BGM Autoplay controller
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

    // 14. Particle clicks
    function spawnTapSparkle(e) {
      if (e.target.closest('button') || e.target.closest('.washi-tape-strip') || e.target.closest('.cat-paw-arm') || e.target.closest('.polaroid-card')) {
        return;
      }
      spawnTapHearts(e.clientX, e.clientY);
    }

    function spawnTapHearts(x, y) {
      for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'sparkle-float';
        star.innerText = ['❤️','✨','🌸','💕','👉','👈'][Math.floor(Math.random() * 6)];
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
      }
    }

    // 15. Preview Bypass & Reset (For Builder template picker preview isolation)
    window.bypassOpeningGame = function() {
      const cg = $('code-gate'); if (cg) cg.remove();
      const gg = $('game-gate'); if (gg) gg.remove();
      const dialog = $('confession-dialog');
      if (dialog) {
        dialog.style.display = 'block';
        initEvasiveNoButton();
      }
    };

    function resetState() {
      window.location.reload();
    }
  </script>
</body>
</html>`;
}
