import { PublishedConfig } from "../../schemas/card-draft";

export function generatePlayfulPoohHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Pesan Manis Untukmu!";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sweet Pooh Note - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            fredoka: ['Fredoka', 'sans-serif'],
            quicksand: ['Quicksand', 'sans-serif'],
            script: ['Caveat', 'cursive'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: linear-gradient(135deg, #FFFDE6 0%, #FFF5CC 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #5C4A37;
      font-family: 'Quicksand', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 203, 76, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 203, 76, 0.4);
      border-radius: 3px;
    }

    /* ── Passkey Screen ── */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFFDE6 0%, #FFF5CC 100%);
      padding: 2rem;
      z-index: 1000;
      clip-path: circle(150% at 50% 50%);
      transition: clip-path 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 1.2s ease, backdrop-filter 1.2s ease;
    }

    /* ── Animated CSS Pooh Bear ── */
    .pooh-wrapper {
      position: relative;
      width: 180px;
      height: 190px;
      margin: 0 auto;
      cursor: pointer;
    }

    /* Sleeping state breathing animation */
    .pooh-wrapper.sleeping {
      animation: poohBreathe 3.2s infinite ease-in-out;
    }
    .pooh-wrapper.sleeping .pooh-eye-l,
    .pooh-wrapper.sleeping .pooh-eye-r {
      height: 3px !important;
      border-radius: 0 0 10px 10px !important;
      background: transparent !important;
      border: 2px solid #5C4A37 !important;
      border-top: none !important;
      top: 42px !important;
    }
    .pooh-wrapper.sleeping .pooh-ear-l {
      transform: rotate(-10deg);
    }
    .pooh-wrapper.sleeping .pooh-ear-r {
      transform: rotate(10deg);
    }

    @keyframes poohBreathe {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.02) translateY(-3px); }
    }

    /* Pooh Head */
    .pooh-head {
      position: absolute;
      width: 100px;
      height: 92px;
      background: #FFCB4C; /* Golden Yellow */
      border-radius: 50% 50% 46% 46%;
      top: 30px;
      left: 40px;
      z-index: 10;
      box-shadow: 0 6px 12px rgba(92, 74, 55, 0.06);
      transition: all 0.3s ease;
    }
    .pooh-ear-l, .pooh-ear-r {
      position: absolute;
      width: 26px;
      height: 26px;
      background: #FFCB4C;
      border-radius: 50%;
      top: 18px;
      z-index: 9;
      transition: transform 0.3s ease;
    }
    .pooh-ear-l {
      left: 36px;
      transform-origin: bottom right;
    }
    .pooh-ear-r {
      right: 36px;
      transform-origin: bottom left;
    }

    .pooh-eye-l, .pooh-eye-r {
      position: absolute;
      width: 8px;
      height: 10px;
      background: #3B2E24;
      border-radius: 50%;
      top: 40px;
      transition: all 0.2s ease;
    }
    .pooh-eye-l { left: 26px; }
    .pooh-eye-r { right: 26px; }

    /* Happy/petting eyes */
    .pooh-wrapper.happy .pooh-eye-l,
    .pooh-wrapper.happy .pooh-eye-r {
      height: 4px !important;
      border-radius: 0 0 10px 10px !important;
      background: transparent !important;
      border: 3px solid #3B2E24 !important;
      border-top: none !important;
      top: 42px !important;
    }

    .pooh-blush {
      position: absolute;
      width: 14px;
      height: 8px;
      background: #FFA1A1;
      border-radius: 50%;
      opacity: 0.7;
      top: 52px;
      filter: blur(0.5px);
    }
    .pooh-blush.l { left: 14px; }
    .pooh-blush.r { right: 14px; }

    .pooh-snout {
      position: absolute;
      width: 38px;
      height: 28px;
      background: #FFD573;
      border-radius: 50%;
      bottom: 12px;
      left: 31px;
    }
    .pooh-nose {
      position: absolute;
      width: 12px;
      height: 8px;
      background: #3B2E24;
      border-radius: 5px;
      top: 4px;
      left: 13px;
    }
    .pooh-mouth {
      position: absolute;
      width: 14px;
      height: 6px;
      border: 2px solid #3B2E24;
      border-top: none;
      border-radius: 0 0 7px 7px;
      bottom: 6px;
      left: 12px;
    }
    .pooh-tongue {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FF708A;
      border-radius: 0 0 4px 4px;
      bottom: -4px;
      left: 15px;
      display: none;
      animation: lickAnim 0.3s infinite alternate;
    }
    @keyframes lickAnim {
      0% { transform: scaleY(1); }
      100% { transform: scaleY(1.3) rotate(3deg); }
    }

    /* Pooh Body wearing his classic RED shirt */
    .pooh-body {
      position: absolute;
      width: 90px;
      height: 95px;
      background: #FFCB4C;
      border-radius: 45px 45px 35px 35px;
      top: 85px;
      left: 45px;
      z-index: 8;
      overflow: hidden;
    }
    .pooh-shirt {
      position: absolute;
      width: 100%;
      height: 60%;
      background: #FF4D4D; /* Pooh's Red Shirt */
      top: 0;
      border-radius: 45px 45px 0 0;
    }

    .pooh-paw-l, .pooh-paw-r {
      position: absolute;
      width: 24px;
      height: 24px;
      background: #FFCB4C;
      border-radius: 50%;
      bottom: -8px;
      z-index: 11;
      box-shadow: 0 3px 6px rgba(0,0,0,0.03);
    }
    .pooh-paw-l { left: 18px; }
    .pooh-paw-r { right: 18px; }

    /* Floating bees and honeypots */
    .honey-bee {
      position: absolute;
      font-size: 1.25rem;
      pointer-events: none;
      z-index: 50;
      transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Snoring snores */
    .snore {
      position: absolute;
      font-family: 'Fredoka', sans-serif;
      font-weight: bold;
      color: #CBB99C;
      font-size: 1.1rem;
      opacity: 0;
      animation: snoreAnim 3s infinite;
      pointer-events: none;
    }
    .snore-1 { top: 12px; left: 125px; animation-delay: 0s; }
    .snore-2 { top: -8px; left: 145px; animation-delay: 1.2s; font-size: 1.35rem; }
    @keyframes snoreAnim {
      0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
      30% { opacity: 0.7; }
      70% { opacity: 0; }
      100% { opacity: 0; transform: translate(12px, -25px) scale(1.1); }
    }

    /* Hearts for petting */
    .heart-float {
      position: absolute;
      color: #FF708A;
      font-size: 1.35rem;
      pointer-events: none;
      animation: heartFloatAnim 1.2s forwards ease-out;
      z-index: 100;
    }

    /* Hunny Pot interactive toy */
    .toy-pot {
      position: absolute;
      width: 50px;
      height: 52px;
      background: #C48E58; /* brown pot */
      border-radius: 15px 15px 22px 22px;
      border: 3px solid #9C6C38;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 95;
    }
    .toy-pot::before {
      content: '';
      width: 42px;
      height: 8px;
      background: #9C6C38;
      border-radius: 4px;
      margin-top: -4px;
    }
    .toy-pot-dripping {
      width: 32px;
      height: 10px;
      background: #FFCB4C; /* Honey dripping */
      border-radius: 0 0 8px 8px;
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.05);
    }
    .toy-pot-label {
      font-family: 'Fredoka', sans-serif;
      font-size: 8px;
      font-weight: bold;
      color: #FFFDE6;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* ── Speech Bubble ── */
    .speech-bubble {
      position: relative;
      background: white;
      border: 3px solid #FFCB4C;
      border-radius: 1.25rem;
      padding: 0.75rem 1rem;
      box-shadow: 0 6px 20px rgba(255, 203, 76, 0.08);
      max-width: 260px;
      margin: 0 auto 1.5rem;
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    .speech-bubble.show {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    .speech-bubble::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 15px 12px 0;
      border-style: solid;
      border-color: white transparent;
      display: block;
      width: 0;
      z-index: 11;
    }
    .speech-bubble::before {
      content: '';
      position: absolute;
      bottom: -19px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 16px 13px 0;
      border-style: solid;
      border-color: #FFCB4C transparent;
      display: block;
      width: 0;
      z-index: 10;
    }

    /* ── Letter Sheet Slide Up with Honey Dripping ── */
    #letter-container {
      position: fixed;
      inset: 0;
      background: rgba(92, 74, 55, 0.3);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }
    #letter-container.open {
      opacity: 1;
      pointer-events: auto;
    }
    #letter-sheet {
      width: 100%;
      max-width: 500px;
      height: 82vh;
      background: #FFFDF9;
      border-radius: 2rem 2rem 0 0;
      box-shadow: 0 -10px 40px rgba(92, 74, 55, 0.15);
      border-top: 5px solid #FFCB4C;
      display: flex;
      flex-direction: column;
      transform: translateY(100%);
      transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
      overflow: hidden;
      position: relative;
    }
    #letter-container.open #letter-sheet {
      transform: translateY(0);
    }

    /* Honey dripping border SVG at the top of the letter sheet */
    .honey-drips {
      width: 100%;
      height: 24px;
      fill: #FFCB4C;
      margin-top: -1px;
    }

    /* Vintage scrapbook style letter background */
    .pooh-bg {
      background-image: 
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='%23FFF0C2' opacity='0.25'%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3C/svg%3E");
    }

    /* Typewriter cursor */
    .cursor-blink {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background: #B38E36;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 0.9s step-end infinite;
    }

    /* Photo wood frame */
    .pooh-photo-frame {
      background: #FCF7EE;
      border: 4px solid #E3CBB5;
      border-radius: 1rem;
      padding: 0.75rem;
      box-shadow: 0 6px 15px rgba(92, 74, 55, 0.05);
      position: relative;
    }
    .pooh-photo-frame::before {
      content: '🐝';
      position: absolute;
      top: -10px;
      right: 15px;
      font-size: 1.1rem;
      z-index: 10;
    }

    /* Voice Note capsule */
    .voice-capsule {
      background: #FFFBEB;
      border: 2px solid #FEF08A;
      border-radius: 1.25rem;
    }

    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #FDE047;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 203, 76, 0.15);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }
  </style>
</head>
<body class="flex flex-col min-h-screen">

  ${hasBgMusic ? `
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">♪</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- ── SECTION 1: SECRET CODE ── -->
  ${hasSecretCode ? `
  <div id="code-gate">
    <div class="gate-card bg-white max-w-sm w-full rounded-3xl p-8 border-4 border-[#FFF9CC] shadow-xl text-center relative overflow-hidden">
      <!-- Decorative bees in code gate -->
      <div class="absolute top-3 left-3 text-[#FFDF80] opacity-40 text-lg">🐝</div>
      <div class="absolute bottom-3 right-3 text-[#FFDF80] opacity-40 text-lg">🐝</div>
      
      <p class="text-xs font-bold uppercase tracking-widest text-[#B38E36] mb-2 font-fredoka">DearNote • Playful Pooh</p>
      <h1 class="text-2xl font-bold font-fredoka text-[#5C4A37] mb-4">Madu Manis & Surat Rahasia</h1>
      <p class="text-xs text-[#8A7C6E] leading-relaxed mb-6 font-quicksand">
        Pesan dari <strong>${config.fromName}</strong> dikunci kode akses. Masukkan kode untuk membuka gerbang madu ini.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Masukkan kode" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF7] border-2 border-[#FEF08A] rounded-2xl text-center font-fredoka tracking-widest text-[#5C4A37] focus:outline-none focus:border-[#FFCB4C]"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#FFCB4C] hover:bg-[#B38E36] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka">
          BUKA SURAT
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah! Coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── SECTION 2: INTERACTIVE POOH Bear ── -->
  <main id="main" class="flex-1 flex flex-col items-center justify-center px-4 py-6 select-none ${hasSecretCode ? 'hidden' : ''}">
    
    <div class="text-center mb-6">
      <h2 class="text-[#B38E36] text-xs font-bold uppercase tracking-widest font-fredoka mb-1">Interactive Keepsake</h2>
      <h1 class="text-3xl font-bold font-fredoka text-[#5C4A37] leading-tight">Pooh Bear & Madu Hangat 🍯</h1>
    </div>

    <!-- Speech bubble for interaction logs -->
    <div id="speech-bubble" class="speech-bubble show font-quicksand font-bold text-center text-sm">
      Zzz... (Pooh sedang tidur nyenyak memeluk pot kosong. Coba ketuk untuk membangunkannya!)
    </div>

    <!-- Pooh Canvas container -->
    <div class="relative w-full max-w-[280px] h-[220px] flex items-center justify-center mb-8">
      
      <!-- Interactive Bee -->
      <div id="honey-bee" class="honey-bee w-8 h-8 flex items-center justify-center pointer-events-none opacity-0" style="top: 80px; left: -40px;">
        🐝
      </div>

      <!-- Pooh's Honey Pot Toy (Drops/Revealed) -->
      <div id="toy-pot" class="toy-pot pointer-events-none opacity-0" style="top: 80px; left: -50px;">
        <div class="toy-pot-dripping"></div>
        <span class="toy-pot-label font-fredoka">HUNNY</span>
      </div>

      <!-- Cute CSS Pooh -->
      <div id="pooh-avatar" class="pooh-wrapper sleeping" onclick="triggerWakeup()">
        <!-- Snore Zzz -->
        <span class="snore snore-1">Z</span>
        <span class="snore snore-2">z</span>
        
        <div class="pooh-ear-l"></div>
        <div class="pooh-ear-r"></div>
        <div class="pooh-head">
          <div class="pooh-eye-l"></div>
          <div class="pooh-eye-r"></div>
          <div class="pooh-blush l"></div>
          <div class="pooh-blush r"></div>
          <div class="pooh-snout">
            <div class="pooh-nose"></div>
            <div class="pooh-mouth"></div>
            <div class="pooh-tongue" id="pooh-tongue"></div>
          </div>
        </div>
        <div class="pooh-body">
          <div class="pooh-shirt"></div>
          <div class="pooh-paw-l"></div>
          <div class="pooh-paw-r"></div>
        </div>
      </div>
    </div>

    <!-- Interactive buttons panel (revealed when awake) -->
    <div id="toys-panel" class="w-full max-w-sm grid grid-cols-3 gap-3 opacity-35 pointer-events-none transition-all duration-500">
      <button onclick="petPooh(event)" class="py-2.5 bg-white border-2 border-[#FEF08A] hover:bg-[#FFFBEB] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#B38E36] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">👋</span> Elus Kepala
      </button>
      <button onclick="feedHoney()" class="py-2.5 bg-white border-2 border-[#FEF08A] hover:bg-[#FFFBEB] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#B38E36] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">🍯</span> Beri Madu
      </button>
      <button onclick="playBee()" class="py-2.5 bg-white border-2 border-[#FEF08A] hover:bg-[#FFFBEB] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#B38E36] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">🐝</span> Main Lebah
      </button>
    </div>

    <!-- Read Letter Button (flashing / bounce when awake) -->
    <div id="letter-trigger-container" class="mt-8 opacity-0 pointer-events-none transition-all duration-700 transform translate-y-4">
      <button onclick="openLetterSheet()"
        class="px-8 py-4 bg-[#FFCB4C] hover:bg-[#B38E36] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl font-fredoka text-sm tracking-wider animate-bounce flex items-center gap-2">
        <span>🍯</span> BACA SURAT MANIS DARI ${config.fromName.toUpperCase()}
      </button>
    </div>

  </main>

  <!-- ── SECTION 3: LETTER SHEET DETAILS (SLIDE UP) ── -->
  <div id="letter-container" onclick="closeLetterSheet()">
    <div id="letter-sheet" class="pooh-bg relative" onclick="event.stopPropagation()">
      
      <!-- Honey Dripping SVG overlay -->
      <svg class="honey-drips" viewBox="0 0 100 8" preserveAspectRatio="none">
        <path d="M0 0 h100 v3 c-2 2 -4 0 -6 -2 c-2 -2 -3 3 -5 3 c-2 0 -3 -2 -5 -1 c-2 1 -4 4 -6 1 c-2 -3 -3 0 -5 1 c-2 1 -3 -1 -5 -2 c-2 -1 -3 3 -5 3 c-2 0 -4 -4 -6 -2 c-2 2 -3 3 -5 0 c-2 -3 -4 1 -6 1 c-2 0 -3 -3 -5 -1 c-2 2 -4 1 -6 -1 c-2 -2 -3 3 -5 2 c-2 -1 -3 -3 -5 -1 c-2 2 -4 0 -6 -2 z" />
      </svg>

      <!-- Close indicator -->
      <div class="h-6 w-full flex items-center justify-center cursor-pointer" onclick="closeLetterSheet()">
        <div class="w-12 h-1 bg-[#E3CBB5] rounded-full mt-1"></div>
      </div>

      <!-- Scroller layout -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        <!-- Header -->
        <div class="text-center pb-4 border-b-2 border-dashed border-[#F4E3D4]">
          <h2 class="text-xs font-fredoka text-[#B38E36] uppercase tracking-widest mb-1">Hunny Note</h2>
          <h1 class="text-2xl font-bold font-fredoka text-[#5C4A37]">${letterTitle}</h1>
          <p class="text-xs text-[#8A7C6E] mt-1 font-quicksand">Untuk: <span class="font-bold text-[#FFCB4C]">${config.toName}</span></p>
        </div>

        <!-- Handwritten body -->
        <div class="bg-white/60 border border-[#F4E3D4] rounded-2xl p-5 shadow-sm">
          <p id="typewriter-body" class="font-script text-xl leading-relaxed text-[#5C4A37] min-h-[120px] whitespace-pre-wrap"></p>
        </div>

        <!-- Voice Note Player (if present) -->
        ${hasVoiceNote ? `
        <div class="voice-capsule p-4 flex items-center gap-4">
          <button id="play-btn" onclick="toggleAudio()" class="w-11 h-11 rounded-full bg-[#FFCB4C] hover:bg-[#B38E36] text-white flex items-center justify-center text-sm shadow-sm transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#B38E36] font-fredoka mb-1">Pesan Suara</p>
            <div id="mini-track" onclick="seekAudio(event)" class="w-full h-2 bg-[#FEF08A] rounded-full cursor-pointer relative">
              <div id="audio-bar" class="absolute left-0 top-0 bottom-0 w-0 bg-[#FFCB4C] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="mini-time" class="text-xs font-bold text-[#8A7C6E] font-fredoka flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudio()" onloadedmetadata="initAudioMeta()"></audio>
        </div>
        ` : ""}

        <!-- Image Gallery (if present) -->
        ${config.photos && config.photos.length > 0 ? `
        <div class="space-y-6">
          <p class="text-xs font-bold uppercase tracking-widest text-[#B38E36] font-fredoka text-center">🍯 Potret Kenangan Manis 🍯</p>
          <div class="grid grid-cols-1 gap-6">
            ${config.photos.map((p) => `
              <div class="pooh-photo-frame">
                <div class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6EE]">
                  <img src="${p.src}" alt="${p.caption || 'Foto'}" class="w-full h-full object-cover" loading="lazy">
                </div>
                ${p.caption ? `
                  <p class="text-center font-script text-lg text-[#5C4A37] mt-3 px-2">${p.caption}</p>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Final Message -->
        ${config.finalMessage ? `
        <div class="text-center py-6 border-t-2 border-dashed border-[#F4E3D4]">
          <p class="font-script text-2xl text-[#B38E36] italic">"${config.finalMessage}"</p>
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7C6E] font-fredoka mt-2">— Dari ${config.fromName}</p>
        </div>
        ` : `
        <div class="text-center py-4 border-t-2 border-dashed border-[#F4E3D4]">
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7C6E] font-fredoka">— Pelukan hangat, ${config.fromName} 🍯</p>
        </div>
        `}

      </div>

      <!-- Close Letter Button -->
      <div class="p-4 bg-white border-t border-[#F4E3D4]">
        <button onclick="closeLetterSheet()"
          class="w-full py-3 bg-[#FFCB4C] hover:bg-[#B38E36] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka text-sm">
          TUTUP SURAT
        </button>
      </div>

    </div>
  </div>

  <!-- ── SCRIPT LOGIC ── -->
  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      fromName: ${JSON.stringify(config.fromName)},
      toName: ${JSON.stringify(config.toName)},
      letterTitle: ${JSON.stringify(letterTitle)},
      letterBody: ${escapedLetterBody},
      hasVoiceNote: ${hasVoiceNote},
      voiceNoteSrc: ${JSON.stringify(voiceNoteSrc)},
      hasBgMusic: ${hasBgMusic},
      bgMusicSrc: ${JSON.stringify(bgMusicSrc)}
    };

    function $(id) { return document.getElementById(id); }

    let isAwake = false;
    let isTransitioning = false;

    /* ── Secret Code Verification (circular ripple reveal) ── */
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        startBgm();

        const gate = $('code-gate');
        const card = document.querySelector('.gate-card');
        const btn = $('code-btn');
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (btn) {
          const rect = btn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }

        // Dissolve card
        if (card) {
          card.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.opacity = '0';
          card.style.filter = 'blur(12px)';
          card.style.transform = 'translateY(16px) scale(0.96)';
        }

        // Circular wipe reveal
        setTimeout(() => {
          gate.style.transition = 'clip-path 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 1.2s ease, backdrop-filter 1.2s ease';
          gate.style.backgroundColor = 'rgba(255, 253, 230, 0.2)';
          gate.style.backdropFilter = 'blur(0px)';
          gate.style.webkitBackdropFilter = 'blur(0px)';
          gate.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)';
        }, 100);

        // Show main element underneath
        $('main').classList.remove('hidden');

        setTimeout(() => {
          gate.remove();
        }, 1300);
      } else {
        const err = $('code-err');
        err.style.opacity = '1';
        $('code-input').style.borderColor = '#ef4444';
        setTimeout(() => {
          err.style.opacity = '0';
          $('code-input').style.borderColor = '#FEF08A';
        }, 2200);
      }
    }

    /* ── Trigger Wakeup ── */
    function triggerWakeup() {
      if (isAwake || isTransitioning) return;
      isTransitioning = true;

      const avatar = $('pooh-avatar');
      
      // Stop snoring snores
      const snores = document.querySelectorAll('.snore');
      snores.forEach(el => el.remove());

      // Perform wake animation
      avatar.classList.remove('sleeping');
      avatar.classList.add('awake');
      $('pooh-tongue').style.display = 'block';

      // Update Speech bubble
      updateSpeech("Menguap... Oh, hallo! Aku Pooh Bear. Aku suka madu manis! 🍯");

      // Celebrate with sparkles
      createConfetti();

      // Show panel & trigger letter buttons
      setTimeout(() => {
        isAwake = true;
        isTransitioning = false;
        
        const panel = $('toys-panel');
        panel.classList.remove('opacity-35', 'pointer-events-none');
        
        const trigger = $('letter-trigger-container');
        trigger.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');

        updateSpeech("Aku membawakan surat manis penuh madu dari " + CONFIG.fromName + " untukmu! Ketuk tombol di bawah untuk membacanya ya!");
      }, 1500);

      startBgm();
    }

    /* ── Speech Bubble manager ── */
    function updateSpeech(text) {
      const bubble = $('speech-bubble');
      bubble.classList.remove('show');
      setTimeout(() => {
        bubble.innerText = text;
        bubble.classList.add('show');
      }, 250);
    }

    /* ── Pet Pooh ── */
    function petPooh(e) {
      if (!isAwake || isTransitioning) return;
      
      const avatar = $('pooh-avatar');
      avatar.classList.add('happy');
      updateSpeech("Hehe, kepalaku hangat dielus-elus... Terima kasih teman baik! ❤️");

      // Spawn floating hearts
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnHeart(), i * 150);
      }

      setTimeout(() => {
        avatar.classList.remove('happy');
      }, 1500);
    }

    function spawnHeart() {
      const parent = $('pooh-avatar');
      const heart = document.createElement('div');
      heart.className = 'heart-float';
      heart.innerText = '❤️';
      heart.style.left = (Math.random() * 80 + 50) + 'px';
      heart.style.top = '30px';
      heart.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      parent.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }

    /* ── Feed Honey ── */
    function feedHoney() {
      if (!isAwake || isTransitioning) return;
      isTransitioning = true;
      
      const pot = $('toy-pot');
      const avatar = $('pooh-avatar');
      
      pot.style.opacity = '1';
      pot.style.left = '50px';
      pot.style.top = '10px';
      pot.style.transform = 'scale(1.2)';

      updateSpeech("Wah! Satu pot madu segar berlelehan! Nyam... 🍯");

      // Move pot to mouth
      setTimeout(() => {
        pot.style.left = '75px';
        pot.style.top = '60px';
        pot.style.transform = 'scale(0.85) rotate(12deg)';
      }, 400);

      // Eat happily
      setTimeout(() => {
        pot.style.opacity = '0';
        avatar.classList.add('happy');
        updateSpeech("Slurpp... Manis sekali! Perut gendutku senang sekarang. Terima kasih! 🍯✨");
      }, 1100);

      setTimeout(() => {
        avatar.classList.remove('happy');
        isTransitioning = false;
      }, 2300);
    }

    /* ── Play Bee ── */
    function playBee() {
      if (!isAwake || isTransitioning) return;
      isTransitioning = true;

      const bee = $('honey-bee');
      const avatar = $('pooh-avatar');

      bee.style.opacity = '1';
      bee.style.left = '-20px';
      bee.style.top = '50px';

      updateSpeech("Tengok... Ada lebah madu kecil berdengung! Bzzzz... 🐝");

      // Bee buzzes around Pooh
      setTimeout(() => {
        bee.style.left = '90px';
        bee.style.top = '15px';
      }, 400);

      setTimeout(() => {
        bee.style.left = '180px';
        bee.style.top = '90px';
        avatar.classList.add('happy');
        updateSpeech("Bzzz... Lebahnya terbang mengelilingiku dengan ceria! Lucu sekali! 🐝🎉");
      }, 1000);

      setTimeout(() => {
        bee.style.opacity = '0';
        avatar.classList.remove('happy');
        isTransitioning = false;
      }, 2200);
    }

    /* ── Celebration Sparkles ── */
    function createConfetti() {
      const container = document.body;
      const emojis = ['🍯', '✨', '❤️', '🐝', '🌼'];
      for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        item.style.position = 'fixed';
        item.style.zIndex = '99';
        item.style.left = '50vw';
        item.style.top = '45vh';
        item.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        item.style.pointerEvents = 'none';
        container.appendChild(item);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 110 + 70;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        item.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.5)', opacity: 0 }
        ], {
          duration: 1100 + Math.random() * 500,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
          fill: 'forwards'
        });

        setTimeout(() => item.remove(), 1600);
      }
    }

    /* ── Letter sheet control ── */
    let hasTyped = false;
    function openLetterSheet() {
      $('letter-container').classList.add('open');
      if (!hasTyped) {
        hasTyped = true;
        setTimeout(startTypewriter, 500);
      }
    }

    function closeLetterSheet() {
      $('letter-container').classList.remove('open');
    }

    /* ── Typewriter effect ── */
    function startTypewriter() {
      const el = $('typewriter-body');
      if (!el) return;
      const text = CONFIG.letterBody;
      let i = 0;
      
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      el.appendChild(cursor);

      function tick() {
        if (i < text.length) {
          cursor.before(document.createTextNode(text[i++]));
          setTimeout(tick, 25);
        } else {
          cursor.remove();
        }
      }
      tick();
    }

    /* ── Voice Note Audio player ── */
    let isAudioPlaying = false;
    function getAudio() { return $('audio-el'); }
    function initAudioMeta() {
      const a = getAudio(); const t = $('mini-time');
      if (a && t) t.innerText = fmt(a.duration);
    }
    function toggleAudio() {
      const a = getAudio(); if (!a) return;
      const icon = $('play-icon');
      if (isAudioPlaying) {
        a.pause(); icon.innerHTML = '▶'; isAudioPlaying = false; startBgm();
      } else {
        pauseBgm(); a.play(); icon.innerHTML = '❚❚'; isAudioPlaying = true;
      }
    }
    function updateAudio() {
      const a = getAudio(); if (!a || !a.duration) return;
      $('audio-bar').style.width = (a.currentTime / a.duration * 100) + '%';
      $('mini-time').innerText = fmt(a.currentTime);
      if (a.ended) { $('play-icon').innerHTML = '▶'; isAudioPlaying = false; startBgm(); }
    }
    function seekAudio(e) {
      const a = getAudio(); if (!a) return;
      const r = $('mini-track').getBoundingClientRect();
      if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    }
    function fmt(s) {
      if (!s || isNaN(s)) return '0:00';
      return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    /* ── Background Music (BGM) ── */
    let bgmEl = null, bgmOn = false, bgmMuted = false;
    function getBgm() { if (!bgmEl) bgmEl = $('bgm-audio'); return bgmEl; }
    function startBgm() {
      const b = getBgm();
      if (b && !bgmMuted && !isAudioPlaying) { b.play().catch(() => {}); bgmOn = true; }
    }
    function pauseBgm() {
      const b = getBgm();
      if (b && bgmOn) { b.pause(); bgmOn = false; }
    }
    function toggleBgm() {
      const b = getBgm(); if (!b) return;
      bgmMuted = !bgmMuted;
      $('bgm-icon').innerText = bgmMuted ? '♪̶' : '♪';
      bgmMuted ? b.pause() : (!isAudioPlaying && b.play().catch(() => {}));
      bgmOn = !bgmMuted;
    }
  </script>

</body>
</html>`;
}
