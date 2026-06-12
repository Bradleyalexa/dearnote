import { PublishedConfig } from "../../schemas/card-draft";

export function generatePlayfulDogHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Pesan Spesial Untukmu!";
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
  <title>Cute Dog Note - DearNote</title>
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
      background: linear-gradient(135deg, #FFF9E6 0%, #FFEBE6 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #4A3E3D;
      font-family: 'Quicksand', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(232, 158, 88, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(232, 158, 88, 0.4);
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
      background: linear-gradient(135deg, #FFF9E6 0%, #FFEBE6 100%);
      padding: 2rem;
      z-index: 1000;
      clip-path: circle(150% at 50% 50%);
      transition: clip-path 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 1.2s ease, backdrop-filter 1.2s ease;
    }

    /* ── Animated CSS Dog ── */
    .dog-wrapper {
      position: relative;
      width: 200px;
      height: 180px;
      margin: 0 auto;
      cursor: pointer;
    }

    /* Sleeping state breathing animation */
    .dog-wrapper.sleeping {
      animation: dogBreathe 3s infinite ease-in-out;
    }
    .dog-wrapper.sleeping .dog-eye-l,
    .dog-wrapper.sleeping .dog-eye-r {
      height: 3px !important;
      border-radius: 0 0 10px 10px !important;
      background: transparent !important;
      border: 2px solid #4A3E3D !important;
      border-top: none !important;
      top: 38px !important;
    }
    .dog-wrapper.sleeping .dog-ear-l {
      transform: rotate(-15deg);
    }
    .dog-wrapper.sleeping .dog-ear-r {
      transform: rotate(15deg);
    }
    .dog-wrapper.sleeping .dog-tail {
      transform: rotate(0deg);
      animation: none;
    }

    @keyframes dogBreathe {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.02) translateY(-4px); }
    }

    /* Dog Body Parts */
    .dog-head {
      position: absolute;
      width: 100px;
      height: 90px;
      background: #E89E58; /* Shiba Orange */
      border-radius: 50% 50% 45% 45%;
      top: 30px;
      left: 50px;
      z-index: 10;
      box-shadow: 0 6px 12px rgba(74, 62, 61, 0.08);
      transition: all 0.3s ease;
    }
    .dog-ear-l, .dog-ear-r {
      position: absolute;
      width: 30px;
      height: 42px;
      background: #C47936;
      border-radius: 60% 40% 0% 0%;
      top: 15px;
      z-index: 9;
      transition: transform 0.3s ease;
    }
    .dog-ear-l {
      left: 48px;
      transform: rotate(-25deg);
      transform-origin: bottom right;
    }
    .dog-ear-r {
      right: 48px;
      transform: rotate(25deg);
      transform-origin: bottom left;
      border-radius: 40% 60% 0% 0%;
    }
    .dog-eye-l, .dog-eye-r {
      position: absolute;
      width: 14px;
      height: 14px;
      background: #231F20;
      border-radius: 50%;
      top: 36px;
      transition: all 0.2s ease;
    }
    .dog-eye-l { left: 24px; }
    .dog-eye-r { right: 24px; }
    .dog-eye-l::after, .dog-eye-r::after {
      content: '';
      position: absolute;
      width: 5px;
      height: 5px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
    }
    
    /* Happy closed eyes for petting */
    .dog-wrapper.happy .dog-eye-l,
    .dog-wrapper.happy .dog-eye-r {
      height: 4px !important;
      border-radius: 0 0 10px 10px !important;
      background: transparent !important;
      border: 3px solid #231F20 !important;
      border-top: none !important;
      top: 38px !important;
    }
    .dog-wrapper.happy .dog-ear-l {
      transform: rotate(-35deg);
    }
    .dog-wrapper.happy .dog-ear-r {
      transform: rotate(35deg);
    }

    .dog-blush {
      position: absolute;
      width: 16px;
      height: 10px;
      background: #FFB3B3;
      border-radius: 50%;
      opacity: 0.8;
      top: 48px;
    }
    .dog-blush.l { left: 14px; }
    .dog-blush.r { right: 14px; }

    .dog-snout {
      position: absolute;
      width: 40px;
      height: 32px;
      background: white;
      border-radius: 50%;
      bottom: 10px;
      left: 30px;
    }
    .dog-nose {
      position: absolute;
      width: 12px;
      height: 8px;
      background: #231F20;
      border-radius: 5px;
      top: 5px;
      left: 14px;
    }
    .dog-mouth {
      position: absolute;
      width: 16px;
      height: 8px;
      border: 2px solid #231F20;
      border-top: none;
      border-radius: 0 0 8px 8px;
      bottom: 8px;
      left: 12px;
    }
    .dog-tongue {
      position: absolute;
      width: 10px;
      height: 12px;
      background: #FF5E7E;
      border-radius: 0 0 5px 5px;
      bottom: -6px;
      left: 15px;
      display: none;
      animation: panting 0.3s infinite alternate;
      transform-origin: top center;
    }
    @keyframes panting {
      0% { transform: scale(1); }
      100% { transform: scale(1.1) rotate(5deg); }
    }

    .dog-body {
      position: absolute;
      width: 80px;
      height: 90px;
      background: #E89E58;
      border-radius: 40px 40px 30px 30px;
      top: 80px;
      left: 60px;
      z-index: 8;
    }
    .dog-chest {
      position: absolute;
      width: 50px;
      height: 60px;
      background: white;
      border-radius: 50%;
      top: 5px;
      left: 15px;
    }

    .dog-paw-l, .dog-paw-r {
      position: absolute;
      width: 22px;
      height: 25px;
      background: white;
      border-radius: 50%;
      bottom: -10px;
      z-index: 11;
      box-shadow: 0 3px 6px rgba(0,0,0,0.05);
    }
    .dog-paw-l { left: 12px; }
    .dog-paw-r { right: 12px; }

    .dog-tail {
      position: absolute;
      width: 25px;
      height: 50px;
      background: #C47936;
      border-radius: 15px;
      top: 100px;
      right: 45px;
      transform-origin: top center;
      z-index: 7;
      transition: all 0.3s ease;
    }
    .dog-wrapper.awake .dog-tail {
      animation: tailWag 0.6s infinite alternate ease-in-out;
    }
    .dog-wrapper.happy .dog-tail {
      animation: tailWagFast 0.2s infinite alternate ease-in-out !important;
    }
    @keyframes tailWag {
      0% { transform: rotate(-10deg); }
      100% { transform: rotate(35deg); }
    }
    @keyframes tailWagFast {
      0% { transform: rotate(-20deg); }
      100% { transform: rotate(50deg); }
    }

    /* Snoring effect */
    .snore {
      position: absolute;
      font-family: 'Fredoka', sans-serif;
      font-weight: bold;
      color: #9C8EB9;
      font-size: 1.25rem;
      opacity: 0;
      animation: snoreAnim 3s infinite;
      pointer-events: none;
    }
    .snore-1 { top: 10px; left: 130px; animation-delay: 0s; }
    .snore-2 { top: -10px; left: 150px; animation-delay: 1s; font-size: 1.5rem; }
    @keyframes snoreAnim {
      0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
      30% { opacity: 0.8; }
      70% { opacity: 0; }
      100% { opacity: 0; transform: translate(15px, -30px) scale(1.2); }
    }

    /* Hearts for petting */
    .heart-float {
      position: absolute;
      color: #FF5E7E;
      font-size: 1.5rem;
      pointer-events: none;
      animation: heartFloatAnim 1s forwards ease-out;
      z-index: 100;
    }
    @keyframes heartFloatAnim {
      0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--dx), -80px) scale(1.2); }
    }

    /* Bone and Ball toys styles */
    .toy-bone {
      position: absolute;
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .toy-ball {
      position: absolute;
      transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    }

    /* ── Interactive Speech Bubble ── */
    .speech-bubble {
      position: relative;
      background: white;
      border: 3px solid #E89E58;
      border-radius: 1.25rem;
      padding: 0.75rem 1rem;
      box-shadow: 0 8px 24px rgba(232, 158, 88, 0.1);
      max-width: 250px;
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
      border-color: #E89E58 transparent;
      display: block;
      width: 0;
      z-index: 10;
    }

    /* ── Letter Sheet Slide Up ── */
    #letter-container {
      position: fixed;
      inset: 0;
      background: rgba(74, 62, 61, 0.3);
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
      background: #FFFBF7;
      border-radius: 2rem 2rem 0 0;
      box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
      border-top: 5px solid #E89E58;
      display: flex;
      flex-direction: column;
      transform: translateY(100%);
      transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
      overflow: hidden;
    }
    #letter-container.open #letter-sheet {
      transform: translateY(0);
    }

    /* Cute paw print background for letter sheet */
    .paw-bg {
      background-image: 
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23F6EDE4' opacity='0.5'%3E%3Cpath d='M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 4.5 1-1 3-2.5 3-4.5 0-1.66-1.34-3-3-3zm-4-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6.5-4C8.67 7 8 7.67 8 8.5S8.67 10 9.5 10 11 9.33 11 8.5 10.33 7 9.5 7zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z'/%3E%3C/svg%3E");
    }

    /* Typewriter blink */
    .cursor-blink {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background: #C47936;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 0.9s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* Custom photo polaroid or memo style */
    .dog-photo-frame {
      background: white;
      border: 3px solid #F6EDE4;
      border-radius: 1.25rem;
      padding: 0.75rem;
      box-shadow: 0 8px 20px rgba(74, 62, 61, 0.05);
      position: relative;
    }
    .dog-photo-frame::before {
      content: '🐾';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
      z-index: 10;
    }

    /* Sound note styling */
    .voice-capsule {
      background: #FFF3EB;
      border: 2px solid #FCD3B6;
      border-radius: 1.25rem;
    }
    
    /* Music control */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #FCD3B6;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(232,158,88,0.15);
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
    <div class="gate-card bg-white max-w-sm w-full rounded-3xl p-8 border-4 border-[#FFF0E0] shadow-xl text-center relative overflow-hidden">
      <!-- Decorative paw prints in code gate -->
      <div class="absolute top-2 left-2 text-[#FFE3D1] opacity-40 text-xl">🐾</div>
      <div class="absolute bottom-2 right-2 text-[#FFE3D1] opacity-40 text-xl">🐾</div>
      
      <p class="text-xs font-bold uppercase tracking-widest text-[#C47936] mb-2 font-fredoka">DearNote • Playful Dog</p>
      <h1 class="text-2xl font-bold font-fredoka text-[#4A3E3D] mb-4">Ada anjing lucu membawa surat!</h1>
      <p class="text-xs text-[#8A7978] leading-relaxed mb-6 font-quicksand">
        Surat dari <strong>${config.fromName}</strong> dilindungi kode akses. Masukkan kode untuk membukanya.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Masukkan kode" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFBF7] border-2 border-[#FCD3B6] rounded-2xl text-center font-fredoka tracking-widest text-[#4A3E3D] focus:outline-none focus:border-[#E89E58]"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#E89E58] hover:bg-[#C47936] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka">
          BUKA SURAT
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah! Coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── SECTION 2: INTERACTIVE DOG SCREEN ── -->
  <main id="main" class="flex-1 flex flex-col items-center justify-center px-4 py-6 select-none ${hasSecretCode ? 'hidden' : ''}">
    
    <div class="text-center mb-6">
      <h2 class="text-[#C47936] text-xs font-bold uppercase tracking-widest font-fredoka mb-1">Interactive Keepsake</h2>
      <h1 class="text-3xl font-bold font-fredoka text-[#4A3E3D] leading-tight">Temui Shiba Lucu! 🐾</h1>
    </div>

    <!-- Speech bubble for interaction logs -->
    <div id="speech-bubble" class="speech-bubble show font-quicksand font-bold text-center text-sm">
      Zzz... (Anjing sedang tidur nyenyak. Coba ketuk untuk membangunkannya!)
    </div>

    <!-- Dog Canvas container -->
    <div class="relative w-full max-w-[280px] h-[220px] flex items-center justify-center mb-8">
      
      <!-- Interactive Toy Ball -->
      <div id="toy-ball" class="toy-ball w-10 h-10 bg-[#FFD15C] rounded-full border-2 border-[#E0A83A] flex items-center justify-center text-lg shadow-md pointer-events-none opacity-0" style="top: 100px; left: -40px;">
        🎾
      </div>

      <!-- Interactive Toy Bone -->
      <div id="toy-bone" class="toy-bone w-12 h-6 bg-[#F5EDE6] border-2 border-[#D7CBC0] rounded-full flex items-center justify-center text-xs shadow-sm pointer-events-none opacity-0" style="top: 80px; left: -40px;">
        🦴
      </div>

      <!-- Cute CSS Shiba -->
      <div id="dog-avatar" class="dog-wrapper sleeping" onclick="triggerWakeup()">
        <!-- Snore Zzz -->
        <span class="snore snore-1">Z</span>
        <span class="snore snore-2">z</span>
        
        <div class="dog-ear-l"></div>
        <div class="dog-ear-r"></div>
        <div class="dog-head">
          <div class="dog-eye-l"></div>
          <div class="dog-eye-r"></div>
          <div class="dog-blush l"></div>
          <div class="dog-blush.r dog-blush r"></div>
          <div class="dog-snout">
            <div class="dog-nose"></div>
            <div class="dog-mouth"></div>
            <div class="dog-tongue" id="dog-tongue"></div>
          </div>
        </div>
        <div class="dog-body">
          <div class="dog-chest"></div>
          <div class="dog-paw-l"></div>
          <div class="dog-paw-r"></div>
        </div>
        <div class="dog-tail"></div>
      </div>
    </div>

    <!-- Interactive buttons panel (revealed when awake) -->
    <div id="toys-panel" class="w-full max-w-sm grid grid-cols-3 gap-3 opacity-35 pointer-events-none transition-all duration-500">
      <button onclick="petDog(event)" class="py-2.5 bg-white border-2 border-[#FCD3B6] hover:bg-[#FFF5EE] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#C47936] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">👋</span> Elus Kepala
      </button>
      <button onclick="feedBone()" class="py-2.5 bg-white border-2 border-[#FCD3B6] hover:bg-[#FFF5EE] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#C47936] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">🦴</span> Beri Tulang
      </button>
      <button onclick="playBall()" class="py-2.5 bg-white border-2 border-[#FCD3B6] hover:bg-[#FFF5EE] rounded-2xl flex flex-col items-center justify-center text-xs font-fredoka text-[#C47936] shadow-sm active:scale-95 transition-all">
        <span class="text-xl mb-1">🎾</span> Main Bola
      </button>
    </div>

    <!-- Read Letter Button (flashing / bounce when awake) -->
    <div id="letter-trigger-container" class="mt-8 opacity-0 pointer-events-none transition-all duration-700 transform translate-y-4">
      <button onclick="openLetterSheet()"
        class="px-8 py-4 bg-[#E89E58] hover:bg-[#C47936] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl font-fredoka text-sm tracking-wider animate-bounce flex items-center gap-2">
        <span>💌</span> BACA SURAT DARI ${config.fromName.toUpperCase()}
      </button>
    </div>

  </main>

  <!-- ── SECTION 3: LETTER SHEET DETAILS (SLIDE UP) ── -->
  <div id="letter-container" onclick="closeLetterSheet()">
    <div id="letter-sheet" class="paw-bg relative" onclick="event.stopPropagation()">
      
      <!-- Top header drag bar / close indicator -->
      <div class="h-6 w-full flex items-center justify-center cursor-pointer" onclick="closeLetterSheet()">
        <div class="w-12 h-1 bg-[#D7CBC0] rounded-full mt-2"></div>
      </div>

      <!-- Scroller layout -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        <!-- Header -->
        <div class="text-center pb-4 border-b-2 border-dashed border-[#F0E6DD]">
          <h2 class="text-xs font-fredoka text-[#C47936] uppercase tracking-widest mb-1">DearNote Letter</h2>
          <h1 class="text-2xl font-bold font-fredoka text-[#4A3E3D]">${letterTitle}</h1>
          <p class="text-xs text-[#8A7978] mt-1 font-quicksand">Untuk: <span class="font-bold text-[#E89E58]">${config.toName}</span></p>
        </div>

        <!-- Handwritten body -->
        <div class="bg-white/60 border border-[#F0E6DD] rounded-2xl p-5 shadow-sm">
          <p id="typewriter-body" class="font-script text-xl leading-relaxed text-[#4A3E3D] min-h-[120px] whitespace-pre-wrap"></p>
        </div>

        <!-- Voice Note Player (if present) -->
        ${hasVoiceNote ? `
        <div class="voice-capsule p-4 flex items-center gap-4">
          <button id="play-btn" onclick="toggleAudio()" class="w-11 h-11 rounded-full bg-[#E89E58] hover:bg-[#C47936] text-white flex items-center justify-center text-sm shadow-sm transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#C47936] font-fredoka mb-1">Pesan Suara</p>
            <div id="mini-track" onclick="seekAudio(event)" class="w-full h-2 bg-[#FCD3B6] rounded-full cursor-pointer relative">
              <div id="audio-bar" class="absolute left-0 top-0 bottom-0 w-0 bg-[#E89E58] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="mini-time" class="text-xs font-bold text-[#8A7978] font-fredoka flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudio()" onloadedmetadata="initAudioMeta()"></audio>
        </div>
        ` : ""}

        <!-- Image Gallery (if present) -->
        ${config.photos && config.photos.length > 0 ? `
        <div class="space-y-6">
          <p class="text-xs font-bold uppercase tracking-widest text-[#C47936] font-fredoka text-center">🐾 Galeri Kenangan 🐾</p>
          <div class="grid grid-cols-1 gap-6">
            ${config.photos.map((p, idx) => `
              <div class="dog-photo-frame">
                <div class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
                  <img src="${p.src}" alt="${p.caption || 'Foto'}" class="w-full h-full object-cover" loading="lazy">
                </div>
                ${p.caption ? `
                  <p class="text-center font-script text-lg text-[#4A3E3D] mt-3 px-2">${p.caption}</p>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Final Message -->
        ${config.finalMessage ? `
        <div class="text-center py-6 border-t-2 border-dashed border-[#F0E6DD]">
          <p class="font-script text-2xl text-[#E89E58] italic">"${config.finalMessage}"</p>
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7978] font-fredoka mt-2">— Dari ${config.fromName}</p>
        </div>
        ` : `
        <div class="text-center py-4 border-t-2 border-dashed border-[#F0E6DD]">
          <p class="text-xs font-bold uppercase tracking-widest text-[#8A7978] font-fredoka">— Salam manis, ${config.fromName} 🐾</p>
        </div>
        `}

      </div>

      <!-- Close Letter Button -->
      <div class="p-4 bg-white border-t border-[#F0E6DD]">
        <button onclick="closeLetterSheet()"
          class="w-full py-3 bg-[#E89E58] hover:bg-[#C47936] text-white font-bold rounded-2xl transition-all shadow-md font-fredoka text-sm">
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
          gate.style.backgroundColor = 'rgba(255, 249, 230, 0.2)';
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
          $('code-input').style.borderColor = '#FCD3B6';
        }, 2200);
      }
    }

    /* ── Trigger Wakeup ── */
    function triggerWakeup() {
      if (isAwake || isTransitioning) return;
      isTransitioning = true;

      // Play soft bark sound / flash effect
      const avatar = $('dog-avatar');
      
      // Stop snoring snores
      const snores = document.querySelectorAll('.snore');
      snores.forEach(el => el.remove());

      // Perform wake animation
      avatar.classList.remove('sleeping');
      avatar.classList.add('awake');
      $('dog-tongue').style.display = 'block';

      // Update Speech bubble
      updateSpeech("Woof! Guk! Halo! Aku Shiba. Senang sekali bertemu kamu! 🐾");

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

        updateSpeech("Aku membawakan surat rahasia dari " + CONFIG.fromName + " untukmu! Ketuk tombol di bawah untuk membacanya ya!");
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

    /* ── Pet Head ── */
    function petDog(e) {
      if (!isAwake || isTransitioning) return;
      
      const avatar = $('dog-avatar');
      avatar.classList.add('happy');
      updateSpeech("Hehe, geli! Enak sekali dielus-elus... Woof! ❤️");

      // Spawn floating hearts
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnHeart(), i * 150);
      }

      setTimeout(() => {
        avatar.classList.remove('happy');
      }, 1500);
    }

    function spawnHeart() {
      const parent = $('dog-avatar');
      const heart = document.createElement('div');
      heart.className = 'heart-float';
      heart.innerText = '❤️';
      heart.style.left = (Math.random() * 80 + 60) + 'px';
      heart.style.top = '30px';
      heart.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      parent.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }

    /* ── Feed Bone ── */
    function feedBone() {
      if (!isAwake || isTransitioning) return;
      isTransitioning = true;
      
      const bone = $('toy-bone');
      const avatar = $('dog-avatar');
      
      bone.style.opacity = '1';
      bone.style.left = '60px';
      bone.style.top = '0px';
      bone.style.transform = 'scale(1.2)';

      updateSpeech("Nyam! Ada tulang lezat! Nyam nyam... 🦴");

      // Move bone to mouth
      setTimeout(() => {
        bone.style.left = '90px';
        bone.style.top = '50px';
        bone.style.transform = 'scale(0.8) rotate(15deg)';
      }, 400);

      // Crunch crunch
      setTimeout(() => {
        bone.style.opacity = '0';
        avatar.classList.add('happy');
        updateSpeech("Yummy! Terima kasih banyak! Aku kenyang sekali sekarang. Guk! 🐾");
      }, 1000);

      setTimeout(() => {
        avatar.classList.remove('happy');
        isTransitioning = false;
      }, 2200);
    }

    /* ── Play Ball ── */
    function playBall() {
      if (!isAwake || isTransitioning) return;
      isTransitioning = true;

      const ball = $('toy-ball');
      const avatar = $('dog-avatar');

      ball.style.opacity = '1';
      ball.style.left = '-20px';
      ball.style.top = '60px';

      updateSpeech("Wah, bola tenis kuning kesukaanku! Lempar dong! 🎾");

      // Make ball bounce
      setTimeout(() => {
        ball.style.left = '120px';
        ball.style.top = '30px';
      }, 400);

      setTimeout(() => {
        ball.style.left = '200px';
        ball.style.top = '100px';
        avatar.classList.add('happy');
        updateSpeech("Hore! Kena! Aku berhasil menangkap bolanya! Guk guk! 🎉");
      }, 1000);

      setTimeout(() => {
        ball.style.opacity = '0';
        avatar.classList.remove('happy');
        isTransitioning = false;
      }, 2200);
    }

    /* ── Celebration Sparkles ── */
    function createConfetti() {
      const container = document.body;
      const emojis = ['🐾', '✨', '❤️', '🌟', '🐶'];
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
        const velocity = Math.random() * 120 + 80;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        item.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.5)', opacity: 0 }
        ], {
          duration: 1000 + Math.random() * 600,
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

    /* ── Typewriter effect for handwritten letter ── */
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
