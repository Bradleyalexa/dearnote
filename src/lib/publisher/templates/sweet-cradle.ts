import { PublishedConfig } from "../../schemas/card-draft";

export function generateSweetCradleHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Congratulations on Your Little Miracle!";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // Use a sweet Mixkit lullaby if no custom background music is uploaded
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-lullaby-by-the-sea-581.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sweet Cradle - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
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
    /* Styling & Custom Animations */
    body {
      background: linear-gradient(135deg, #FFF0F5 0%, #E0FFFF 50%, #FFFACD 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #5D504F;
      font-family: 'Quicksand', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 182, 193, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 182, 193, 0.4);
      border-radius: 3px;
    }

    /* ── Floating Baby Background Elements ── */
    .bg-bubble {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 192, 203, 0.2) 60%, rgba(224, 255, 255, 0) 100%);
      pointer-events: none;
      z-index: 1;
      animation: floatUp linear infinite;
    }
    @keyframes floatUp {
      0% {
        transform: translateY(110vh) translateX(0) scale(0.6);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(-10vh) translateX(30px) scale(1.1);
        opacity: 0;
      }
    }

    /* ── Passkey Lock Screen ── */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFF0F5 0%, #E0FFFF 50%, #FFFACD 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.8s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Envelope & Baby Footprint Wax Seal ── */
    .envelope-wrapper {
      position: relative;
      width: 340px;
      height: 220px;
      background-color: #FFFACD; /* Soft yellow envelope */
      border-radius: 0 0 16px 16px;
      box-shadow: 0 20px 40px rgba(93, 80, 79, 0.12);
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.5s ease;
      z-index: 10;
      border: 3px solid #FFF5B8;
    }
    .envelope-wrapper::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 167px solid transparent;
      border-right: 167px solid transparent;
      border-top: 110px solid #FFEFA6;
      transform-origin: top;
      transition: transform 0.8s ease;
      z-index: 30;
    }
    .envelope-wrapper::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 167px solid #FFF5B8;
      border-right: 167px solid #FFF5B8;
      border-bottom: 110px solid #FFF5B8;
      border-radius: 0 0 16px 16px;
      z-index: 25;
    }
    .envelope-wrapper.open::before {
      transform: rotateX(180deg);
      z-index: 5;
      transition-delay: 0.3s;
    }
    .envelope-card {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      background: #FFFDF8;
      border-radius: 12px;
      padding: 20px;
      z-index: 15;
      transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 -3px 10px rgba(0,0,0,0.02);
    }
    .envelope-wrapper.card-up .envelope-card {
      transform: translateY(-130px);
      z-index: 35;
    }

    /* 3D Baby Footprint Wax Seal */
    .wax-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 68px;
      height: 68px;
      transform: translate(-50%, -50%);
      z-index: 40;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .wax-seal-half {
      position: absolute;
      top: 0;
      width: 35px;
      height: 68px;
      background: radial-gradient(circle at center, #FFB6C1 0%, #FF99AA 60%, #E86B7E 100%);
      box-shadow: 
        0 4px 10px rgba(0, 0, 0, 0.15), 
        inset 0 1px 3px rgba(255, 255, 255, 0.5),
        inset -1px -2px 3px rgba(0, 0, 0, 0.2);
      transition: all 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      border: 1px solid #FF8EA0;
    }
    .wax-seal-half.left {
      left: 0;
      border-radius: 34px 0 0 34px;
      clip-path: polygon(0% 0%, 100% 0%, 80% 30%, 100% 50%, 80% 70%, 100% 100%, 0% 100%);
      border-right: none;
    }
    .wax-seal-half.right {
      right: 0;
      border-radius: 0 34px 34px 0;
      clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 70%, 20% 50%, 0% 30%);
      border-left: none;
    }
    .wax-seal-stamp {
      position: absolute;
      top: 0;
      left: 0;
      width: 68px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      pointer-events: none;
      z-index: 45;
      transition: all 0.5s ease;
    }
    .envelope-wrapper.open .wax-seal-half.left {
      transform: translateX(-40px) translateY(-5px) rotate(-30deg);
      opacity: 0;
    }
    .envelope-wrapper.open .wax-seal-half.right {
      transform: translateX(40px) translateY(5px) rotate(30deg);
      opacity: 0;
    }
    .envelope-wrapper.open .wax-seal-stamp {
      transform: scale(0.5);
      opacity: 0;
    }

    /* ── Interactive Cradle & Baby Mobile ── */
    .cradle-container {
      position: relative;
      width: 280px;
      height: 250px;
      margin: 0 auto;
      perspective: 1000px;
    }
    .cradle-mobile {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 70px;
      z-index: 9;
      transform-origin: top center;
      animation: gentleSpin 12s infinite linear;
    }
    .cradle-mobile.spin-fast {
      animation: spinFast 1.5s infinite linear !important;
    }
    @keyframes gentleSpin {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(360deg); }
    }
    @keyframes spinFast {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(360deg); }
    }

    .cradle-body-wrapper {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 120px;
      z-index: 10;
      transform-origin: bottom center;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .cradle-body-wrapper.rocking {
      animation: rockCradle 1.2s ease-in-out;
    }
    @keyframes rockCradle {
      0%, 100% { transform: translateX(-50%) rotate(0deg); }
      20% { transform: translateX(-50%) rotate(-12deg); }
      40% { transform: translateX(-50%) rotate(10deg); }
      60% { transform: translateX(-50%) rotate(-6deg); }
      80% { transform: translateX(-50%) rotate(4deg); }
    }

    /* Cradle Artwork */
    .cradle-wood {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #FFE4E1; /* Pastel wood rose */
      border-radius: 40px 40px 100px 100px;
      border: 4px solid #FFC0CB;
      box-shadow: 0 8px 16px rgba(255, 182, 193, 0.15);
      overflow: hidden;
    }
    .cradle-bars {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border-top: 3px dashed #FFB6C1;
      border-bottom: 3px dashed #FFB6C1;
      display: flex;
      justify-content: space-around;
    }
    .cradle-bar {
      width: 4px;
      height: 100%;
      background: #FFB6C1;
    }
    .cradle-baby {
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 70px;
      z-index: 12;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .baby-head {
      width: 44px;
      height: 44px;
      background: #FFE4C4; /* Peach skin */
      border-radius: 50%;
      position: relative;
      border: 2px solid #FFD39B;
    }
    .baby-cheeks {
      position: absolute;
      bottom: 8px;
      width: 36px;
      display: flex;
      justify-content: space-between;
      left: 4px;
    }
    .baby-cheek {
      width: 8px;
      height: 5px;
      background: #FFB6C1;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .baby-cheeks.blushing .baby-cheek {
      opacity: 0.85;
    }
    .baby-eyes {
      position: absolute;
      top: 16px;
      width: 28px;
      display: flex;
      justify-content: space-between;
      left: 8px;
    }
    .baby-eye {
      width: 6px;
      height: 3px;
      border-radius: 0 0 6px 6px;
      border: 2px solid #5D504F;
      border-top: none;
      transition: all 0.3s;
    }
    .baby-eye.smile {
      transform: scaleY(-1) translateY(-2px);
    }
    .baby-blanket {
      width: 80px;
      height: 45px;
      background: #E0FFFF; /* Baby blue blanket */
      border-radius: 20px 20px 0 0;
      margin-top: -16px;
      z-index: 13;
      border: 3px solid #B0E2FF;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Floating Sparkles for Petting/Interaction ── */
    .sparkle-float {
      position: absolute;
      color: #FFFACD;
      font-size: 1.5rem;
      pointer-events: none;
      animation: sparkleFloatAnim 1.2s forwards ease-out;
      z-index: 100;
    }
    @keyframes sparkleFloatAnim {
      0% { opacity: 0; transform: translate(0, 0) scale(0.5) rotate(0deg); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--dx), -100px) scale(1.3) rotate(180deg); }
    }

    /* ── Slide Up Letter Sheet ── */
    #letter-container {
      position: fixed;
      inset: 0;
      background: rgba(93, 80, 79, 0.25);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
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
      max-width: 520px;
      height: 85vh;
      background: #FFFDF9;
      border-radius: 2.5rem 2.5rem 0 0;
      box-shadow: 0 -15px 40px rgba(93,80,79,0.15);
      border-top: 6px solid #FFB6C1;
      display: flex;
      flex-direction: column;
      transform: translateY(100%);
      transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
      overflow: hidden;
    }
    #letter-container.open #letter-sheet {
      transform: translateY(0);
    }

    /* Custom layout styling */
    .letter-paper {
      background-image: 
        radial-gradient(#FFF0F5 10%, transparent 11%),
        radial-gradient(#FFFACD 10%, transparent 11%);
      background-size: 24px 24px;
      background-position: 0 0, 12px 12px;
      background-color: #FFFDF9;
    }

    /* Custom Polaroid Frame */
    .polaroid-frame {
      background: white;
      border: 4px solid white;
      border-bottom: 24px solid white;
      box-shadow: 0 8px 24px rgba(93, 80, 79, 0.08);
      border-radius: 4px;
      transition: all 0.4s ease;
      cursor: pointer;
    }
    .polaroid-frame:hover {
      transform: scale(1.02) rotate(0deg) !important;
    }

    /* Milk Bottle Voice Capsule UI */
    .milk-bottle-player {
      background: #FFF5EE;
      border: 3px dashed #FFD39B;
      border-radius: 20px;
    }

    /* BGM floating button */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #FFB6C1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 182, 193, 0.2);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }
  </style>
</head>
<body class="flex flex-col min-h-screen relative">

  <!-- Floating Background Bubbles -->
  <div id="bubble-canvas" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-white max-w-sm w-full rounded-[2rem] p-8 border-4 border-[#FFF0F5] shadow-xl text-center relative overflow-hidden">
      <!-- Decorative background baby motifs -->
      <div class="absolute top-2 left-2 text-[#FFD1DC]/40 text-xl">🧸</div>
      <div class="absolute bottom-2 right-2 text-[#FFE4C4]/40 text-xl">🍼</div>
      
      <p class="text-xs font-bold uppercase tracking-widest text-[#FF99AA] mb-2 font-fredoka">DearNote • Sweet Cradle</p>
      <h1 class="text-2xl font-bold font-fredoka text-[#5D504F] mb-4">A Sweet Surprise Awaits!</h1>
      <p class="text-xs text-[#8A7A79] leading-relaxed mb-6">
        A newborn congratulations letter from <strong>${config.fromName}</strong> is locked. Enter the passkey to open.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Enter code" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#FFD39B] rounded-2xl text-center font-fredoka tracking-widest text-[#5D504F] focus:outline-none focus:border-[#FF99AA]"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#FF99AA] hover:bg-[#E86B7E] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka">
          OPEN SURPRISE
        </button>
        <p id="code-err" class="text-xs text-red-400 font-bold opacity-0 transition-opacity duration-300">Incorrect code! Try again.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: INTERACTIVE CRADLE SCREEN ── -->
  <main id="main-ui" class="flex-1 flex flex-col items-center justify-center px-4 py-6 select-none ${hasSecretCode ? 'hidden' : ''} z-10">
    
    <div class="text-center mb-6">
      <h2 class="text-[#FF99AA] text-xs font-bold uppercase tracking-widest font-fredoka mb-1">Newborn Congratulations</h2>
      <h1 class="text-3xl font-bold font-fredoka text-[#5D504F] leading-tight">Welcome, Little One! 🍼</h1>
    </div>

    <!-- Interactive Speech Bubble -->
    <div id="speech-bubble" class="bg-white border-2 border-[#FFB6C1] rounded-2xl px-5 py-3 text-center text-sm font-bold max-w-[260px] shadow-sm mb-6 relative">
      <span>Zzz... The baby is sleeping sweetly. Tap the cradle to rock the baby!</span>
      <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-width-[10px_8px_0] border-style-solid border-color-[white_transparent] w-0"></div>
    </div>

    <!-- Cradle Box -->
    <div class="cradle-container" onclick="rockCradle(event)">
      <!-- Baby Mobile (Gantungan Kasur Bayi) -->
      <svg class="cradle-mobile" viewBox="0 0 100 50">
        <line x1="50" y1="0" x2="50" y2="25" stroke="#FFB6C1" stroke-width="2"/>
        <line x1="20" y1="25" x2="80" y2="25" stroke="#FFB6C1" stroke-width="2"/>
        <!-- Star left -->
        <polygon points="20,30 22,34 26,34 23,37 24,41 20,39 16,41 17,37 14,34 18,34" fill="#FFFACD" stroke="#FFD39B" stroke-width="0.5"/>
        <line x1="20" y1="25" x2="20" y2="30" stroke="#FFD39B" stroke-width="1"/>
        <!-- Moon right -->
        <path d="M 80,30 A 6,6 0 0,0 74,38 A 6,6 0 1,1 80,30" fill="#FFFACD" stroke="#FFD39B" stroke-width="0.5"/>
        <line x1="80" y1="25" x2="80" y2="30" stroke="#FFD39B" stroke-width="1"/>
        <!-- Cloud center -->
        <path d="M44,22 C42,22 41,24 42,25 C40,25 39,27 41,28 C41,29 49,29 49,28 C51,28 50,25 48,25 C48,24 46,22 44,22 Z" fill="white" stroke="#E0FFFF" stroke-width="0.5" transform="scale(1.2) translate(-13, -3)"/>
        <line x1="50" y1="25" x2="50" y2="28" stroke="#E0FFFF" stroke-width="1"/>
      </svg>

      <!-- Cradle Shell -->
      <div id="cradle-body" class="cradle-body-wrapper">
        <div class="cradle-wood">
          <div class="cradle-bars">
            <div class="cradle-bar"></div>
            <div class="cradle-bar"></div>
            <div class="cradle-bar"></div>
            <div class="cradle-bar"></div>
            <div class="cradle-bar"></div>
          </div>
        </div>
        <!-- Baby sleeping inside -->
        <div class="cradle-baby">
          <div class="baby-head">
            <div class="baby-eyes">
              <div class="baby-eye"></div>
              <div class="baby-eye"></div>
            </div>
            <div class="baby-cheeks" id="baby-blush">
              <div class="baby-cheek"></div>
              <div class="baby-cheek"></div>
            </div>
          </div>
          <div class="baby-blanket">
            <span class="text-xs">👶</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Read Letter CTA Button (bouncing when unlocked) -->
    <div id="letter-btn-container" class="mt-8 opacity-0 pointer-events-none transition-all duration-700 transform translate-y-4">
      <button onclick="openLetter()"
        class="px-8 py-4 bg-[#FF99AA] hover:bg-[#E86B7E] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl font-fredoka text-sm tracking-wider animate-bounce flex items-center gap-2">
        <span>💌</span> READ SWEET WISHES FROM ${config.fromName.toUpperCase()}
      </button>
    </div>

  </main>

  <!-- ── VIEW 3 & 4: LETTER CONTAINER (SLIDE UP) ── -->
  <div id="letter-container" onclick="closeLetter()">
    <div id="letter-sheet" class="letter-paper relative" onclick="event.stopPropagation()">
      
      <!-- Pull-down close bar -->
      <div class="h-6 w-full flex items-center justify-center cursor-pointer" onclick="closeLetter()">
        <div class="w-12 h-1 bg-[#E8DDCB] rounded-full mt-2"></div>
      </div>

      <!-- Scrollable Letter Area -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        <!-- Letter Title & Recipients -->
        <div class="text-center pb-4 border-b-2 border-dashed border-[#FFD39B]/40">
          <h2 class="text-xs font-fredoka text-[#FF99AA] uppercase tracking-widest mb-1">DearNote Cradle Letter</h2>
          <h1 class="text-2xl font-bold font-fredoka text-[#5D504F]">${letterTitle}</h1>
          <div class="flex items-center justify-center gap-1.5 text-xs text-[#8A7A79] mt-1">
            <span>To: <span class="font-bold text-[#E86B7E]">${config.toName}</span></span>
            <span>•</span>
            <span>From: <span class="font-bold text-[#FF99AA]">${config.fromName}</span></span>
          </div>
        </div>

        <!-- Handwritten Letter Body -->
        <div class="bg-white/60 border border-[#FFD39B]/30 rounded-2xl p-5 shadow-sm">
          <p id="typewriter-text" class="font-script text-xl leading-relaxed text-[#5D504F] min-h-[120px] whitespace-pre-wrap"></p>
        </div>

        <!-- Voice Message Section -->
        ${hasVoiceNote ? `
        <div class="milk-bottle-player p-4 flex items-center gap-4">
          <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-[#FF99AA] hover:bg-[#E86B7E] text-white flex items-center justify-center text-sm shadow-sm transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#FF99AA] font-fredoka mb-1">🍼 Voice Message for Baby</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-2.5 bg-[#FFF0F5] rounded-full cursor-pointer relative border border-[#FFD1DC]">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#FF99AA] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-xs font-bold text-[#8A7A79] font-fredoka flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}

        <!-- Polaroid Photo Grid -->
        ${config.photos && config.photos.length > 0 ? `
        <div class="space-y-6">
          <p class="text-xs font-bold uppercase tracking-widest text-[#FF99AA] font-fredoka text-center">🧸 Captured Memories 🧸</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${config.photos.map((photo, index) => {
              const rot = (index % 2 === 0) ? '-2deg' : '2deg';
              return `
              <div class="polaroid-frame p-3" style="transform: rotate(${rot});" onclick="openPhotoModal('${photo.src}', '${photo.caption || ''}')">
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-zinc-50 relative">
                  <!-- Cute clip decoration -->
                  <div class="absolute -top-1 left-1/2 -translate-x-1/2 text-base z-10">📎</div>
                  <img src="${photo.src}" alt="Memory" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-script text-lg text-[#5D504F] mt-3 px-1 leading-tight">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Final Message -->
        ${config.finalMessage ? `
        <div class="text-center py-6 border-t-2 border-dashed border-[#FFD39B]/40">
          <p class="font-script text-2xl text-[#E86B7E] italic">"${config.finalMessage}"</p>
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7A79] font-fredoka mt-2">— Warmest Congratulations</p>
        </div>
        ` : `
        <div class="text-center py-4 border-t-2 border-dashed border-[#FFD39B]/40">
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7A79] font-fredoka">— Best wishes, ${config.fromName} 🧸</p>
        </div>
        `}

      </div>

      <!-- Close Button -->
      <div class="p-4 bg-white border-t border-dashed border-[#FFD39B]/30">
        <button onclick="closeLetter()"
          class="w-full py-3 bg-[#FF99AA] hover:bg-[#E86B7E] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka text-sm">
          CLOSE LETTER
        </button>
      </div>

    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-md w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-zinc-200 shadow flex items-center justify-center font-bold text-zinc-600 hover:bg-zinc-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-script text-xl text-[#5D504F] mt-3 px-2"></p>
    </div>
  </div>

  <!-- Wax Seal Envelope Opening Animation Screen Overlay -->
  <div id="envelope-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF0F5] to-[#E0FFFF] p-4 transition-all duration-700 select-none ${hasSecretCode ? 'hidden' : ''}">
    <div class="text-center mb-8">
      <h3 class="font-fredoka text-2xl font-bold text-[#5D504F] mb-1">Sweet Baby Wishes</h3>
      <p class="text-[10px] font-bold text-[#FF99AA] uppercase tracking-widest">Open Envelope to Unboxing</p>
    </div>
    
    <div id="envelope-box" class="envelope-wrapper" onclick="openEnvelope()">
      <div class="wax-seal">
        <div class="wax-seal-half left"></div>
        <div class="wax-seal-half right"></div>
        <div class="wax-seal-stamp">👣</div>
      </div>
      <div class="envelope-card flex flex-col justify-between items-center text-center p-4">
        <div class="my-auto">
          <span class="block text-[10px] text-[#FF99AA] uppercase font-bold tracking-widest mb-1">For</span>
          <span class="font-fredoka text-lg font-bold text-[#5D504F]">${config.toName}</span>
        </div>
        <span class="text-[9px] uppercase font-bold tracking-widest text-[#FF99AA] animate-pulse">Tap to Break Seal</span>
      </div>
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

    // 1. Spawning floating bubbles and baby footprints
    const canvas = $('bubble-canvas');
    function createBubble() {
      const bubble = document.createElement('div');
      bubble.classList.add('bg-bubble');
      
      const size = Math.random() * 20 + 10; // 10px to 30px
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 8 + 6; // 6s to 14s
      const delay = Math.random() * 3;
      
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = left + 'px';
      bubble.style.animationDuration = duration + 's';
      bubble.style.animationDelay = delay + 's';
      
      canvas.appendChild(bubble);
      setTimeout(() => { bubble.remove(); }, (duration + delay) * 1000);
    }
    
    for(let i=0; i<15; i++) { createBubble(); }
    setInterval(createBubble, 1200);

    // 2. Secret Passkey Gate
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        const gate = $('code-gate');
        gate.style.opacity = '0';
        gate.style.transform = 'scale(0.95)';
        
        startBgm();
        setTimeout(() => {
          gate.remove();
          $('envelope-screen').classList.remove('hidden');
        }, 800);
      } else {
        const err = $('code-err');
        err.style.opacity = '1';
        $('code-input').classList.add('border-red-400', 'animate-shake');
        setTimeout(() => {
          err.style.opacity = '0';
          $('code-input').classList.remove('border-red-400', 'animate-shake');
        }, 2000);
      }
    }

    // 3. Envelope opening animation
    let isEnvOpened = false;
    function openEnvelope() {
      if (isEnvOpened) return;
      isEnvOpened = true;
      startBgm();
      
      const env = $('envelope-box');
      env.classList.add('open');
      
      setTimeout(() => { env.classList.add('card-up'); }, 1000);
      
      setTimeout(() => {
        const overlay = $('envelope-screen');
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          $('main-ui').classList.remove('hidden');
        }, 700);
      }, 2400);
    }

    // 4. Interactive Cradle Click Rocking
    let isRocking = false;
    let rockCount = 0;
    function rockCradle(event) {
      if (isRocking) return;
      isRocking = true;
      
      const cradle = $('cradle-body');
      const mobile = document.querySelector('.cradle-mobile');
      cradle.classList.add('rocking');
      
      // Fast spin mobile on rock
      if (mobile) mobile.classList.add('spin-fast');
      
      // Blush baby cheeks
      const cheeks = $('baby-blush');
      if (cheeks) cheeks.classList.add('blushing');
      
      // Change baby eyes to happy smile arches
      const eyes = document.querySelectorAll('.baby-eye');
      eyes.forEach(eye => eye.classList.add('smile'));

      // Spawn floating sparkles/hearts above clicked coordinate
      for (let i = 0; i < 6; i++) {
        spawnSparkle(event.clientX, event.clientY);
      }

      rockCount++;
      if (rockCount >= 2) {
        // Unlock reading wishes button
        const btn = $('letter-btn-container');
        btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        updateSpeech("Wow, baby is smiling! Read the sweet wishes from " + CONFIG.fromName + " now!");
      } else {
        updateSpeech("Ooh, rocking is comfy! Rock again to wake baby up with a smile!");
      }

      setTimeout(() => {
        cradle.classList.remove('rocking');
        if (mobile) mobile.classList.remove('spin-fast');
        if (cheeks) cheeks.classList.remove('blushing');
        eyes.forEach(eye => eye.classList.remove('smile'));
        isRocking = false;
      }, 1200);
    }

    function spawnSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-float';
      sparkle.innerText = ['✨', '⭐', '🎈', '🍼', '🧸'][Math.floor(Math.random() * 5)];
      
      const dx = (Math.random() * 120 - 60) + 'px';
      sparkle.style.setProperty('--dx', dx);
      sparkle.style.left = (x - 10) + 'px';
      sparkle.style.top = (y - 10) + 'px';
      
      document.body.appendChild(sparkle);
      setTimeout(() => { sparkle.remove(); }, 1200);
    }

    function updateSpeech(text) {
      document.querySelector('#speech-bubble span').innerText = text;
    }

    // 5. Slide open Letter & Typewriter
    let isLetterOpened = false;
    function openLetter() {
      if (isLetterOpened) return;
      isLetterOpened = true;
      
      $('letter-container').classList.add('open');
      setTimeout(startTypewriter, 600);
    }

    function closeLetter() {
      $('letter-container').classList.remove('open');
      isLetterOpened = false;
      // Pause audio if playing
      const player = $('audio-el');
      if (player && !player.paused) {
        toggleAudio();
      }
    }

    // 6. Typewriter Reveal
    let typewriterIndex = 0;
    function startTypewriter() {
      const target = $('typewriter-text');
      const text = CONFIG.letterBody;
      const speed = 25;
      
      const limit = text.length > 1000 ? 500 : text.length;
      if (typewriterIndex < limit) {
        target.innerHTML += text.charAt(typewriterIndex);
        typewriterIndex++;
        setTimeout(startTypewriter, speed);
      } else if (text.length > 1000) {
        const remaining = text.substring(typewriterIndex);
        const span = document.createElement('span');
        span.style.opacity = '0';
        span.style.transition = 'opacity 1.0s ease-in-out';
        span.innerHTML = remaining;
        target.appendChild(span);
        setTimeout(() => { span.style.opacity = '1'; }, 50);
        if (typeof revealExtraSections === 'function') {
          revealExtraSections();
        }
      } else {
        if (typeof revealExtraSections === 'function') {
          revealExtraSections();
        }
      }
    }

    // 7. Polaroid soft modal zoom
    function openPhotoModal(src, caption) {
      $('modal-img').src = src;
      $('modal-caption').innerText = caption;
      
      const modal = $('photo-modal');
      modal.classList.remove('opacity-0', 'pointer-events-none');
    }
    
    function closePhotoModal() {
      const modal = $('photo-modal');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }

    // 8. Custom Audio Voice Player & Background Lullaby Music
    let voiceAudio = null;
    let isVoicePlaying = false;

    let bgm = null;
    let isBgmPlaying = false;
    let isBgmMuted = false;

    function getBgm() {
      if (!bgm) bgm = $('bgm-audio');
      return bgm;
    }

    function startBgm() {
      const player = getBgm();
      if (player && !isBgmMuted && !isVoicePlaying) {
        player.play().catch(e => console.error("Autoplay blocked:", e));
        isBgmPlaying = true;
        $('bgm-icon').innerText = '🎵';
      }
    }

    function pauseBgm() {
      const player = getBgm();
      if (player && isBgmPlaying) {
        player.pause();
        isBgmPlaying = false;
      }
    }

    function toggleBgm() {
      const player = getBgm();
      if (!player) return;
      if (isBgmMuted) {
        isBgmMuted = false;
        $('bgm-icon').innerText = '🎵';
        if (!isVoicePlaying) {
          player.play().catch(e => console.error(e));
          isBgmPlaying = true;
        }
      } else {
        isBgmMuted = true;
        $('bgm-icon').innerText = '🔇';
        player.pause();
        isBgmPlaying = false;
      }
    }

    function getVoiceAudio() {
      if (!voiceAudio) voiceAudio = $('audio-el');
      return voiceAudio;
    }

    function initAudioMetadata() {
      const player = getVoiceAudio();
      const durationEl = $('audio-time');
      if (durationEl && player.duration) {
        durationEl.innerText = formatTime(player.duration);
      }
    }

    function toggleAudio() {
      const player = getVoiceAudio();
      const playIcon = $('play-icon');
      if (!player) return;

      if (isVoicePlaying) {
        player.pause();
        playIcon.innerText = '▶';
        isVoicePlaying = false;
        startBgm();
      } else {
        pauseBgm();
        player.play().catch(e => console.error(e));
        playIcon.innerText = '⏸';
        isVoicePlaying = true;
      }
    }

    function updateAudioProgress() {
      const player = getVoiceAudio();
      const bar = $('audio-progress');
      const timeEl = $('audio-time');
      
      if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        bar.style.width = percent + '%';
        timeEl.innerText = formatTime(player.currentTime);
      }
      
      if (player.ended) {
        $('play-icon').innerText = '▶';
        bar.style.width = '0%';
        isVoicePlaying = false;
        startBgm();
      }
    }

    function seekAudio(event) {
      const player = getVoiceAudio();
      const track = $('mini-timeline');
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
    });
  </script>
</body>
</html>`;
}
