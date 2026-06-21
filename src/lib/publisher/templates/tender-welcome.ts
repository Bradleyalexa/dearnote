import { PublishedConfig } from "../../schemas/card-draft";

export function generateTenderWelcomeHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Beautiful New Beginning";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // A tender sleepy piano lullaby, perfect for parents
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-tender-sleepy-lullaby-1577.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tender Welcome - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            playfair: ['"Playfair Display"', 'serif'],
            lora: ['Lora', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: linear-gradient(135deg, #F5EBE6 0%, #E8EFE9 50%, #DDD3C0 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #111827;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Ambient Warm Sunbeam Rays Overlay */
    .sunbeam-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 15% 15%, rgba(255, 235, 180, 0.22) 0%, rgba(255, 255, 255, 0) 80%);
      pointer-events: none;
      z-index: 1;
      transition: background 1.5s ease;
    }
    .sunbeam-overlay.warm {
      background: radial-gradient(circle at 20% 20%, rgba(255, 215, 100, 0.38) 0%, rgba(255, 255, 255, 0) 85%);
    }

    /* Floating Golden Sun Dust Motes */
    .dust-mote {
      position: absolute;
      background: radial-gradient(circle, rgba(255, 235, 180, 0.8) 0%, rgba(212, 175, 55, 0.2) 60%, transparent 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2;
      animation: riseSlowly linear infinite;
    }
    @keyframes riseSlowly {
      0% {
        transform: translateY(110vh) translateX(0) scale(0.6);
        opacity: 0;
      }
      15% { opacity: 0.8; }
      85% { opacity: 0.8; }
      100% {
        transform: translateY(-10vh) translateX(25px) scale(1.1);
        opacity: 0;
      }
    }

    /* ── Custom Scrollbar ── */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(138, 154, 132, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(138, 154, 132, 0.35);
      border-radius: 3px;
    }

    /* ── Passkey Lock Screen ── */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #F5EBE6 0%, #E8EFE9 50%, #DDD3C0 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Envelope & Sage Olive Branch Wax Seal ── */
    .envelope-wrapper {
      position: relative;
      width: 340px;
      height: 220px;
      background-color: #F5EBE6; /* Sand beige linen */
      border-radius: 0 0 12px 12px;
      box-shadow: 0 25px 50px rgba(93, 80, 79, 0.09);
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.5s ease;
      z-index: 10;
      border: 1px solid rgba(138, 154, 132, 0.15);
    }
    .envelope-wrapper::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 170px solid transparent;
      border-right: 170px solid transparent;
      border-top: 110px solid #ECE3DD;
      transform-origin: top;
      transition: transform 0.9s ease;
      z-index: 30;
    }
    .envelope-wrapper::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 170px solid #ECE3DD;
      border-right: 170px solid #ECE3DD;
      border-bottom: 110px solid #ECE3DD;
      border-radius: 0 0 12px 12px;
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
      border: 1px solid rgba(138, 154, 132, 0.1);
      border-radius: 8px;
      padding: 20px;
      z-index: 15;
      transition: transform 1.3s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 -3px 10px rgba(0,0,0,0.01);
    }
    .envelope-wrapper.card-up .envelope-card {
      transform: translateY(-130px);
      z-index: 35;
    }

    /* Sage/Olive Wax Seal */
    .wax-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 66px;
      height: 66px;
      transform: translate(-50%, -50%);
      z-index: 40;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .wax-seal-half {
      position: absolute;
      top: 0;
      width: 34px;
      height: 66px;
      background: radial-gradient(circle at center, #8A9A84 0%, #768770 60%, #5E6E59 100%);
      box-shadow: 
        0 6px 12px rgba(0, 0, 0, 0.18), 
        inset 0 1px 3px rgba(255, 255, 255, 0.4),
        inset -1px -2px 3px rgba(0, 0, 0, 0.3);
      transition: all 1.6s cubic-bezier(0.25, 1, 0.5, 1);
      border: 1px solid #768770;
    }
    .wax-seal-half.left {
      left: 0;
      border-radius: 33px 0 0 33px;
      clip-path: polygon(0% 0%, 100% 0%, 80% 30%, 100% 50%, 80% 70%, 100% 100%, 0% 100%);
      border-right: none;
    }
    .wax-seal-half.right {
      right: 0;
      border-radius: 0 33px 33px 0;
      clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 70%, 20% 50%, 0% 30%);
      border-left: none;
    }
    .wax-seal-stamp {
      position: absolute;
      top: 0;
      left: 0;
      width: 66px;
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      color: rgba(255, 255, 255, 0.9);
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

    /* ── Olive Branch Watercolor Wreath ── */
    .wreath-container {
      position: relative;
      width: 260px;
      height: 260px;
      margin: 0 auto;
      cursor: pointer;
    }
    .wreath-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 10px rgba(138, 154, 132, 0.15));
      transition: filter 0.8s ease, transform 0.5s ease;
    }
    .wreath-container:hover .wreath-svg {
      transform: scale(1.02);
    }
    .wreath-svg.glow {
      filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.85)) drop-shadow(0 4px 8px rgba(138, 154, 132, 0.2));
    }

    /* ── Slide Up Letter Sheet ── */
    #letter-container {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.25);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s ease;
    }
    #letter-container.open {
      opacity: 1;
      pointer-events: auto;
    }
    #letter-sheet {
      width: 100%;
      max-width: 540px;
      height: 85vh;
      background-color: #fdfcf8;
      background-image: 
        linear-gradient(90deg, rgba(138, 154, 132, 0.02) 1px, transparent 1px),
        linear-gradient(rgba(138, 154, 132, 0.02) 1px, transparent 1px);
      background-size: 8px 8px;
      border-radius: 2rem 2rem 0 0;
      box-shadow: 0 -15px 50px rgba(17, 24, 39, 0.12);
      border-top: 5px solid #8A9A84; /* Sage border */
      display: flex;
      flex-direction: column;
      transform: translateY(100%);
      transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
      overflow: hidden;
      position: relative;
    }
    #letter-sheet::after {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 1px solid rgba(138, 154, 132, 0.12);
      pointer-events: none;
      border-radius: 1.5rem;
    }
    #letter-container.open #letter-sheet {
      transform: translateY(0);
    }

    /* Polaroid Album Frame */
    .polaroid-frame {
      background: white;
      border: 6px solid white;
      border-bottom: 28px solid white;
      box-shadow: 0 10px 25px rgba(17, 24, 39, 0.05);
      border-radius: 2px;
      transition: transform 0.4s ease;
      cursor: pointer;
    }
    .polaroid-frame:hover {
      transform: translateY(-2px) !important;
    }

    /* Minimalist Brass Audio Player */
    .brass-player {
      background: #FAF6F0;
      border: 1px solid rgba(114, 91, 56, 0.18);
      border-radius: 16px;
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
      border: 1px solid #8A9A84;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(138, 154, 132, 0.15);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Floating Sparkles for Petting/Interaction */
    .sparkle-float {
      position: absolute;
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
  </style>
</head>
<body class="flex flex-col min-h-screen relative">

  <!-- Warm morning sunbeams rays -->
  <div id="sunbeams" class="sunbeam-overlay absolute inset-0 pointer-events-none z-0"></div>
  <!-- Floating slow sun dust particles -->
  <div id="dust-canvas" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-white max-w-sm w-full rounded-[1.5rem] p-8 border border-zinc-150 shadow-xl text-center relative overflow-hidden">
      <!-- Minimalist gold sprig overlay -->
      <div class="absolute top-2 left-2 text-[#8A9A84]/20 text-xl">🌿</div>
      <div class="absolute bottom-2 right-2 text-[#8A9A84]/20 text-xl">🌿</div>
      
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#8A9A84] mb-2 font-sans">DearNote • Nursery</p>
      <h1 class="text-2xl font-bold font-playfair text-[#111827] mb-4">A Quiet Chapter Begins</h1>
      <p class="text-xs text-zinc-500 leading-relaxed mb-6 font-sans">
        A newborn congratulations keepsake from <strong>${config.fromName}</strong> is locked. Enter the passkey to open.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Passkey" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border border-zinc-200 rounded-xl text-center font-sans tracking-widest text-[#111827] focus:outline-none focus:border-[#8A9A84] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#8A9A84] hover:bg-[#768770] text-white font-bold rounded-xl transition-all shadow-md font-sans text-xs tracking-wider uppercase">
          Unlock Keepsake
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Incorrect code. Please try again.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: INTERACTIVE SUNBEAM SCREEN ── -->
  <main id="main-ui" class="flex-1 flex flex-col items-center justify-center px-4 py-6 select-none ${hasSecretCode ? 'hidden' : ''} z-10">
    
    <div class="text-center mb-6">
      <h2 class="text-[#8A9A84] text-xs font-bold uppercase tracking-widest font-sans mb-1.5">Tender Welcome</h2>
      <h1 class="text-3xl font-bold font-playfair text-[#111827] leading-tight">Welcome, Sweet Baby</h1>
    </div>

    <!-- Soft Italicized Instruction -->
    <div id="speech-bubble" class="text-zinc-500 text-xs italic text-center max-w-[280px] mb-8 font-lora">
      <span>A new seed of life has sprouted. Tap the olive branch wreath to warm the nursery...</span>
    </div>

    <!-- Olive Wreath Container -->
    <div class="wreath-container" onclick="glowWreath(event)">
      <svg id="wreath" class="wreath-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Watercolor wreath circles -->
        <circle cx="50" cy="50" r="40" stroke="#8A9A84" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.3"/>
        <circle cx="50" cy="50" r="41.5" stroke="#8A9A84" stroke-width="0.2" opacity="0.2"/>
        
        <!-- Left Olive Branch -->
        <path d="M 50,90 C 25,85 10,65 10,48 C 10,32 28,15 48,12" stroke="#8A9A84" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Right Olive Branch -->
        <path d="M 50,90 C 75,85 90,65 90,48 C 90,32 72,15 52,12" stroke="#8A9A84" stroke-width="1.2" stroke-linecap="round"/>
        
        <!-- Leaves (Sage green path drawn) -->
        <!-- Left side leaves -->
        <path d="M12,70 C8,66 7,58 11,54 C13,52 17,55 17,62 C17,66 15,69 12,70 Z" fill="#8A9A84" opacity="0.8"/>
        <path d="M10,50 C5,45 6,36 12,32 C14,30 18,33 18,40 C18,45 15,49 10,50 Z" fill="#99A893" opacity="0.85"/>
        <path d="M18,30 C13,26 15,18 22,15 C24,14 27,18 26,24 C25,28 22,30 18,30 Z" fill="#8A9A84" opacity="0.8"/>
        <path d="M30,16 C26,12 30,5 37,5 C39,5 41,9 39,15 C38,19 35,18 30,16 Z" fill="#99A893" opacity="0.8"/>
        <!-- Right side leaves -->
        <path d="M88,70 C92,66 93,58 89,54 C87,52 83,55 83,62 C83,66 85,69 88,70 Z" fill="#8A9A84" opacity="0.8"/>
        <path d="M90,50 C95,45 94,36 88,32 C86,30 82,33 82,40 C82,45 85,49 90,50 Z" fill="#99A893" opacity="0.85"/>
        <path d="M82,30 C87,26 85,18 78,15 C76,14 73,18 74,24 C75,28 78,30 82,30 Z" fill="#8A9A84" opacity="0.8"/>
        <path d="M70,16 C74,12 70,5 63,5 C61,5 59,9 61,15 C62,19 65,18 70,16 Z" fill="#99A893" opacity="0.8"/>

        <!-- Little center heart -->
        <path d="M50,85 C48,83 45,80 45,78 C45,76 46.5,75 48,75 C49,75 49.5,75.5 50,76 C50.5,75.5 51,75 52,75 C53.5,75 55,76 55,78 C55,80 52,83 50,85 Z" fill="#725b38" opacity="0.5"/>
      </svg>
    </div>

    <!-- Read Letter CTA Button (revealed on click) -->
    <div id="letter-btn-container" class="mt-8 opacity-0 pointer-events-none transition-all duration-1000 transform translate-y-4">
      <button onclick="openLetter()"
        class="px-8 py-3.5 border border-[#725b38]/40 hover:bg-[#FAF6F0]/60 text-[#725b38] font-bold rounded-xl shadow-sm hover:shadow transition-all font-sans text-xs tracking-widest uppercase">
        Read Heartfelt Wishes
      </button>
    </div>

  </main>

  <!-- ── VIEW 3 & 4: LETTER CONTAINER (SLIDE UP) ── -->
  <div id="letter-container" onclick="closeLetter()">
    <div id="letter-sheet" onclick="event.stopPropagation()">
      
      <!-- Pull-down close bar -->
      <div class="h-6 w-full flex items-center justify-center cursor-pointer" onclick="closeLetter()">
        <div class="w-12 h-1 bg-zinc-250/70 rounded-full mt-2"></div>
      </div>

      <!-- Scrollable Letter Area -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-8">
        
        <!-- Letter Title & Recipients -->
        <div class="text-center pb-5 border-b border-zinc-200/60">
          <h2 class="text-[10px] font-bold text-[#8A9A84] uppercase tracking-widest mb-1.5 font-sans">DearNote Keepsake Journal</h2>
          <h1 class="text-3xl font-bold font-playfair text-[#111827] leading-snug">${letterTitle}</h1>
          <div class="flex flex-col gap-1 items-center justify-center text-xs text-zinc-550 mt-2 font-sans">
            <div class="flex items-center gap-1">
              <span class="text-zinc-400">For parents:</span>
              <span class="font-semibold text-[#111827]">${config.toName}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-zinc-400">Warmest wishes from:</span>
              <span class="font-semibold text-[#111827]">${config.fromName}</span>
            </div>
          </div>
        </div>

        <!-- Editorial Letter Body -->
        <div class="font-lora text-zinc-800 leading-relaxed text-base sm:text-lg mb-6 whitespace-pre-wrap min-h-[140px]" id="typewriter-text"></div>

        <!-- Voice Message Section -->
        ${hasVoiceNote ? `
        <div class="brass-player p-4 flex items-center gap-4">
          <button id="play-btn" onclick="toggleAudio()" class="w-11 h-11 rounded-full bg-gradient-to-br from-[#c5a880] to-[#725b38] hover:from-[#d8ba90] hover:to-[#836a46] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-xs ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[9px] uppercase font-bold tracking-widest text-[#725b38] font-sans mb-1.5">🎙️ Voice Note for the Parents</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1.5 bg-zinc-200 rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#725b38] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-xs font-semibold text-zinc-550 font-sans flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}

        <!-- Polaroid Photo Grid -->
        ${config.photos && config.photos.length > 0 ? `
        <div class="space-y-6">
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8A9A84] font-sans text-center">🌿 Cozy Memories 🌿</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${config.photos.map((photo) => {
              return `
              <div class="polaroid-frame p-3" onclick="openPhotoModal('${photo.src}', '${photo.caption || ''}')">
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-zinc-50 relative">
                  <img src="${photo.src}" alt="Keepsake" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-lora text-sm text-zinc-650 italic mt-3 px-1 leading-snug">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Final Message -->
        ${config.finalMessage ? `
        <div class="text-center py-6 border-t border-zinc-200/60 mt-8">
          <p class="font-playfair text-2xl italic text-[#725b38] mb-1">"${config.finalMessage}"</p>
          <p class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Warmest Hugs</p>
        </div>
        ` : `
        <div class="text-center py-4 border-t border-zinc-200/60 mt-8">
          <p class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">— Heartfelt Congratulations</p>
        </div>
        `}

      </div>

      <!-- Close Button -->
      <div class="p-4 bg-white border-t border-zinc-200/60 z-10">
        <button onclick="closeLetter()"
          class="w-full py-3 bg-[#8A9A84] hover:bg-[#768770] text-white font-bold rounded-xl transition-all shadow font-sans text-xs tracking-widest uppercase">
          Close Wishes
        </button>
      </div>

    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/55 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-450" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-sm w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-zinc-250 shadow flex items-center justify-center font-bold text-zinc-550 hover:bg-zinc-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-lora text-sm italic text-zinc-650 mt-3 px-2"></p>
    </div>
  </div>

  <!-- Wax Seal Envelope Opening Animation Screen Overlay -->
  <div id="envelope-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F5EBE6] to-[#E8EFE9] p-4 transition-all duration-800 select-none ${hasSecretCode ? 'hidden' : ''}">
    <div class="text-center mb-10">
      <h3 class="font-playfair text-2xl font-semibold text-[#111827] mb-1">A New Life Begins</h3>
      <p class="text-[9px] font-bold text-[#8A9A84] uppercase tracking-widest font-sans">Tap the Seal to Unfold Wishes</p>
    </div>
    
    <div id="envelope-box" class="envelope-wrapper" onclick="openEnvelope()">
      <div class="wax-seal">
        <div class="wax-seal-half left"></div>
        <div class="wax-seal-half right"></div>
        <div class="wax-seal-stamp">🌿</div>
      </div>
      <div class="envelope-card flex flex-col justify-between items-center text-center p-4">
        <div class="my-auto">
          <span class="block text-[9px] text-[#8A9A84] uppercase font-bold tracking-widest mb-1.5 font-sans">To the Parents</span>
          <span class="font-playfair text-lg font-semibold text-[#111827]">${config.toName}</span>
        </div>
        <span class="text-[8px] uppercase font-bold tracking-widest text-[#8A9A84]/70 animate-pulse font-sans">Break Seal</span>
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

    // 1. Spawning floating golden sun dust particles
    const canvas = $('dust-canvas');
    function createDustMote() {
      const mote = document.createElement('div');
      mote.classList.add('dust-mote');
      
      const size = Math.random() * 4 + 2; // 2px to 6px
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 10 + 8; // 8s to 18s
      const delay = Math.random() * 4;
      
      mote.style.width = size + 'px';
      mote.style.height = size + 'px';
      mote.style.left = left + 'px';
      mote.style.animationDuration = duration + 's';
      mote.style.animationDelay = delay + 's';
      
      canvas.appendChild(mote);
      setTimeout(() => { mote.remove(); }, (duration + delay) * 1000);
    }
    
    for(let i=0; i<12; i++) { createDustMote(); }
    setInterval(createDustMote, 1600);

    // 2. Secret Passkey Gate
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        const gate = $('code-gate');
        gate.style.opacity = '0';
        gate.style.transform = 'scale(0.97)';
        
        startBgm();
        setTimeout(() => {
          gate.remove();
          $('envelope-screen').classList.remove('hidden');
        }, 800);
      } else {
        const err = $('code-err');
        err.style.opacity = '1';
        $('code-input').classList.add('border-red-400');
        setTimeout(() => {
          err.style.opacity = '0';
          $('code-input').classList.remove('border-red-400');
        }, 2200);
      }
    }

    // 3. Envelope opening
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
        }, 800);
      }, 2500);
    }

    // 4. Interactive Olive Wreath Glow & Sunbeams Warming
    let isGlow = false;
    let clickWreathCount = 0;
    function glowWreath(event) {
      if (isGlow) return;
      isGlow = true;
      
      const wreath = $('wreath');
      const beams = $('sunbeams');
      
      wreath.classList.add('glow');
      beams.classList.add('warm');
      
      // Spawn slow golden sparkles rising
      for (let i = 0; i < 5; i++) {
        spawnGoldSparkle(event.clientX, event.clientY);
      }

      clickWreathCount++;
      if (clickWreathCount >= 2) {
        // Reveal CTA
        const btn = $('letter-btn-container');
        btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        updateSpeech("Wishes unlocked. Warm congratulations are waiting for you...");
      } else {
        updateSpeech("Tap the wreath once more to warm the room with golden light...");
      }

      setTimeout(() => {
        wreath.classList.remove('glow');
        beams.classList.remove('warm');
        isGlow = false;
      }, 1500);
    }

    function spawnGoldSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-float';
      sparkle.innerText = ['✨', '⭐', '🌿', '🍃'][Math.floor(Math.random() * 4)];
      
      const dx = (Math.random() * 100 - 50) + 'px';
      sparkle.style.setProperty('--dx', dx);
      sparkle.style.left = (x - 8) + 'px';
      sparkle.style.top = (y - 8) + 'px';
      
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
      setTimeout(startTypewriter, 700);
    }

    function closeLetter() {
      $('letter-container').classList.remove('open');
      isLetterOpened = false;
      
      const player = $('audio-el');
      if (player && !player.paused) {
        toggleAudio();
      }
    }

    // 6. Typewriter
    let typewriterIndex = 0;
    function startTypewriter() {
      const target = $('typewriter-text');
      const text = CONFIG.letterBody;
      const speed = 25;
      
      if (typewriterIndex < text.length) {
        target.innerHTML += text.charAt(typewriterIndex);
        typewriterIndex++;
        setTimeout(startTypewriter, speed);
      }
    }

    // 7. Lightbox modals
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

    // 8. Custom Audio Player
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
        player.play().catch(e => console.error(e));
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
