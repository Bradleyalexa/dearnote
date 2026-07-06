import { PublishedConfig } from "../../schemas/card-draft";

export function generatePinkBookFoldsHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Memory Scrapbook";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";

  // Background music check
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memory Scrapbook - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Fredoka:wght@400;500;600;700&family=Special+Elite&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            handwritten: ['Caveat', 'cursive'],
            typewriter: ['"Special Elite"', 'monospace'],
            sans: ['"Fredoka"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #FFFDF9;
      background-image: 
        radial-gradient(#FFCAD4 1.5px, transparent 1.5px),
        radial-gradient(#FFE5D9 1.5px, transparent 1.5px);
      background-size: 30px 30px;
      background-position: 0 0, 15px 15px;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #FFFDF9;
    }
    ::-webkit-scrollbar-thumb {
      background: #FFCAD4;
      border-radius: 4px;
    }

    /* 3D Book Container */
    .book-perspective {
      perspective: 1500px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    
    .book-wrap {
      position: relative;
      width: 320px;
      height: 440px;
      transform-style: preserve-3d;
      cursor: pointer;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .book-wrap:hover {
      transform: rotateY(-10deg) rotateX(4deg);
    }
    
    .book-page {
      position: absolute;
      inset: 0;
      transform-origin: left center;
      transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      transform-style: preserve-3d;
      border-radius: 8px 24px 24px 8px;
    }
    
    .page-front, .page-back {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      border-radius: 8px 24px 24px 8px;
      box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .page-back {
      transform: rotateY(180deg);
    }
    
    .page-front::before, .page-back::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 16px;
      background: linear-gradient(to right, rgba(0,0,0,0.05), transparent);
      border-radius: 8px 0 0 8px;
      pointer-events: none;
    }

    /* Binder Rings (Front cover edge) */
    .binder-rings {
      position: absolute;
      left: -12px;
      top: 24px;
      bottom: 24px;
      width: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      z-index: 50;
      pointer-events: none;
    }
    .ring {
      width: 22px;
      height: 12px;
      border: 3px solid #FFCAD4;
      border-radius: 6px;
      background: #FFF;
      box-shadow: 1px 2px 4px rgba(0,0,0,0.1);
    }

    /* Flipping Page Classes */
    #book-cover.flipped {
      transform: rotateY(-155deg);
    }
    #leaf-1.flipped {
      transform: rotateY(-147deg);
    }
    #leaf-2.flipped {
      transform: rotateY(-139deg);
    }

    /* Notebook Binder Sheet (Opened scrapbook page) */
    .notebook-sheet {
      background-color: #FFFDF7;
      background-image: 
        linear-gradient(rgba(255, 174, 188, 0.12) 1.5px, transparent 1.5px),
        linear-gradient(90deg, rgba(255, 174, 188, 0.12) 1.5px, transparent 1.5px);
      background-size: 20px 20px;
      border: 4px dashed #FFCAD4;
      box-shadow: 
        0 20px 50px rgba(255, 174, 188, 0.15),
        inset 0 0 30px rgba(255, 255, 255, 0.5);
    }

    /* Binder Rings on the Left of Opened Page */
    .binder-rings-left {
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      pointer-events: none;
      opacity: 0.9;
      z-index: 10;
    }
    .ring-hole {
      width: 14px;
      height: 14px;
      background: #E5E5E5;
      border-radius: 50%;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.2);
      border: 2.5px solid #C0C0C0;
      position: relative;
    }
    .ring-hole::after {
      content: '';
      position: absolute;
      left: -8px;
      top: 3px;
      width: 20px;
      height: 8px;
      border: 2.5px solid #FF9EAA;
      border-radius: 4px;
      background: transparent;
    }

    /* Polaroid card scatter & drag styling */
    .polaroid {
      background: #FFFFFF;
      padding: 12px 12px 28px 12px;
      box-shadow: 
        0 12px 28px rgba(255, 174, 188, 0.14),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 2.5px solid #FFCAD4;
      border-radius: 16px;
      transform-style: preserve-3d;
      cursor: grab;
      user-select: none;
      touch-action: none; /* absolute control over dragging on mobile */
      position: relative;
    }
    .polaroid:active {
      cursor: grabbing;
    }

    /* Tactile image film grain overlay */
    .polaroid-img-container {
      position: relative;
      overflow: hidden;
    }
    .polaroid-img-container::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(rgba(0, 0, 0, 0.08) 0.5px, transparent 0.5px);
      background-size: 3px 3px;
      opacity: 0.12;
      pointer-events: none;
    }

    /* Washi Tape Styles */
    .tape {
      position: absolute;
      background-color: rgba(255, 182, 193, 0.65);
      backdrop-filter: blur(1.5px);
      -webkit-backdrop-filter: blur(1.5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
      clip-path: polygon(
        0% 8%, 10% 2%, 25% 9%, 40% 1%, 55% 8%, 70% 3%, 85% 9%, 100% 4%,
        98% 50%, 100% 92%, 88% 97%, 72% 91%, 58% 99%, 42% 93%, 28% 98%, 12% 90%, 0% 96%
      );
      transform: rotate(-3deg);
      pointer-events: none;
      z-index: 20;
    }
    .tape-heart {
      background-color: rgba(255, 202, 212, 0.75);
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.45) 20%, transparent 20%),
                        radial-gradient(circle, rgba(255, 255, 255, 0.45) 20%, transparent 20%);
      background-size: 8px 8px;
      background-position: 0 0, 4px 4px;
    }
    .tape-yellow {
      background-color: rgba(254, 243, 199, 0.75);
      background-image: repeating-linear-gradient(90deg, rgba(252, 211, 77, 0.2) 0px, rgba(252, 211, 77, 0.2) 4px, transparent 4px, transparent 8px);
    }
    .tape-green {
      background-color: rgba(209, 250, 229, 0.75);
    }

    /* Cassette reels spin */
    .cassette-reel {
      width: 32px;
      height: 32px;
      border: 4px dashed #FFE5D9;
      border-radius: 50%;
      background: #FFCAD4;
      transition: transform 0.1s linear;
    }
    .cassette-reel.playing {
      animation: spin-reel 2.5s linear infinite;
    }
    @keyframes spin-reel {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Floating BGM Toggle Button -->
  ${
    hasBgMusic
      ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-[#FFCAD4]/90 border-2 border-white shadow-md flex items-center justify-center text-lg hover:scale-105 active:scale-95 transition-all" title="Mute Background Music">
    <span id="bgm-icon">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  `
      : ""
  }

  <!-- SECTION 1: CODE LOCK ACCESS SCREEN -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md bg-[#FFFDF7] border-4 border-dashed border-[#FFCAD4] rounded-3xl p-8 text-center z-10 transition-all duration-500 transform scale-100 shadow-xl relative">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFE5D9] text-3xl mb-4 shadow-sm">
        🧸
      </div>
      <h2 class="font-sans text-2xl font-bold text-[#8A7A6E] mb-2">Access Journal</h2>
      <p class="text-xs text-zinc-500 font-sans">A memory log from <span class="font-bold text-[#FF9EAA]">${config.fromName}</span> to <span class="font-bold text-[#FF9EAA]">${config.toName}</span>. Enter the code to open it.</p>
    </div>
    
    <div class="space-y-4 font-sans">
      <input 
        type="text" 
        id="secret-code-input" 
        placeholder="Access Code" 
        maxlength="12"
        class="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCAD4] text-center font-bold text-[#8A7A6E] focus:outline-none focus:ring-2 focus:ring-[#FF9EAA] uppercase tracking-widest text-sm bg-white"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-[#FF9EAA] hover:bg-[#FF8093] active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-sm uppercase tracking-wider hover:rotate-1"
      >
        Open Journal Pages
      </button>
      <p id="code-error" class="text-xs text-red-400 opacity-0 transition-opacity font-bold">Incorrect code, please try again.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: 3D BINDER / SCRAPBOOK COVER WITH PAGE FLIPPING -->
  <div id="cover-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex flex-col items-center justify-center z-10 py-10">
    <div class="book-perspective">
      <div id="scrapbook-book" class="book-wrap" onclick="flipNextPage()">
        
        <!-- Spine / Binder Rings (on the left edge, stay visible) -->
        <div class="binder-rings">
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
        </div>

        <!-- Page Base (the final inside page, shows a sneak peek/base) -->
        <div class="book-page bg-[#FFFDF0] z-[1]">
          <div class="p-6 h-full flex flex-col justify-between items-center text-center">
            <div class="w-full border-b-2 border-dashed border-[#FFCAD4] pb-4">
              <span class="text-xs font-bold text-[#FF9EAA]">MEMORIES</span>
            </div>
            <div class="text-[#FF9EAA] animate-bounce my-auto">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <span class="text-[10px] uppercase tracking-wider text-[#FF9EAA] font-bold">Opening pages...</span>
          </div>
        </div>

        <!-- Leaf Page 2 (flips second) -->
        <div id="leaf-2" class="book-page bg-[#F0F7F4] border-l border-[#D8E2DC] z-[2]">
          <!-- Front Side of Leaf 2 -->
          <div class="page-front p-6 flex flex-col justify-between h-full bg-[#F0F7F4]">
            <div class="flex justify-between items-start">
              <span class="text-xl">✨</span>
              <div class="w-8 h-8 rounded-full bg-[#FFE5D9] flex items-center justify-center text-xs">🌸</div>
            </div>
            <div class="text-center font-handwritten text-xl text-[#8A7A6E]">
              Every moment with you is a beautiful story...
            </div>
            <div class="text-right text-xs text-zinc-400 font-sans">Memory Journal 📖</div>
          </div>
          <!-- Back Side of Leaf 2 (visible after flip) -->
          <div class="page-back p-6 flex flex-col justify-between h-full bg-[#FAF0D7]">
            <div class="flex justify-between items-start">
              <span class="text-xl">⭐</span>
              <span class="text-xl">🎈</span>
            </div>
            <div class="text-center font-handwritten text-xl text-[#8A7A6E]">
              Kept with all my love...
            </div>
            <div class="text-left text-xs text-zinc-400 font-sans">DearNote ✨</div>
          </div>
        </div>

        <!-- Leaf Page 1 (flips first) -->
        <div id="leaf-1" class="book-page bg-[#FFE5D9] border-l border-[#FFCAD4] z-[3]">
          <!-- Front Side of Leaf 1 -->
          <div class="page-front p-6 flex flex-col justify-between h-full bg-[#FFE5D9]">
            <div class="flex justify-between items-start">
              <span class="text-xl">📸</span>
              <span class="text-xl">💖</span>
            </div>
            <div class="text-center font-handwritten text-2xl text-[#8A7A6E] font-bold">
              Open & Discover the Secret...
            </div>
            <div class="text-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">
              Tap to Open
            </div>
          </div>
          <!-- Back Side of Leaf 1 (visible after flip) -->
          <div class="page-back p-6 flex flex-col justify-between h-full bg-[#E8F0FE]">
            <div class="flex justify-between items-start">
              <span class="text-xl">🍀</span>
              <span class="text-xl">🎨</span>
            </div>
            <div class="text-center font-handwritten text-xl text-[#8A7A6E]">
              Our shared memories...
            </div>
            <div class="text-left text-xs text-zinc-400 font-sans">Memories 📝</div>
          </div>
        </div>

        <!-- Cover Page (flips first of all) -->
        <div id="book-cover" class="book-page bg-[#FFCAD4] border-l border-[#FFAEBC] z-[4]">
          <!-- Front Side of Cover -->
          <div class="page-front p-6 flex flex-col justify-between h-full bg-[#FFCAD4] relative">
            <!-- cute tape top-right -->
            <div class="absolute top-2 right-6 bg-yellow-200/70 border border-dashed border-yellow-300 w-16 h-5 rotate-12 text-[8px] flex items-center justify-center font-bold text-yellow-800 font-sans">CUTE!</div>
            
            <div class="flex justify-between items-center">
              <span class="text-2xl">🧸</span>
              <span class="text-xs font-sans font-bold tracking-widest text-[#FF9EAA]">DEARNOTE</span>
            </div>

            <div class="my-auto bg-white/80 backdrop-blur-sm border-2 border-dashed border-[#FF9EAA] p-4 rounded-2xl shadow-sm text-center">
              <h3 class="font-handwritten text-3xl font-bold text-[#8A7A6E] mb-1">To: ${config.toName}</h3>
              <div class="w-12 h-[2px] bg-[#FF9EAA] mx-auto my-2"></div>
              <p class="font-sans text-[10px] uppercase tracking-widest font-bold text-[#8A7A6E]/80">From: ${config.fromName}</p>
            </div>

            <div class="text-center">
              <span id="flip-hint" class="inline-block px-3 py-1 bg-[#FF9EAA] text-white text-[9px] font-bold uppercase tracking-widest rounded-full animate-pulse font-sans">
                Tap to open the first page
              </span>
            </div>
          </div>
          <!-- Back Side of Cover (visible after flip) -->
          <div class="page-back p-6 flex flex-col justify-between h-full bg-[#FFE5D9]">
            <div class="flex justify-between items-center">
              <span class="text-2xl">🐱</span>
              <span class="text-2xl">🐶</span>
            </div>
            <div class="text-center font-handwritten text-2xl text-[#8A7A6E] font-bold">
              Let's look at our story...
            </div>
            <div class="text-right text-[10px] text-zinc-400 font-bold uppercase font-sans">PAGE 01</div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- SECTION 3: SCRAPBOOK CONTENT -->
  <div id="scrapbook-section" class="hidden w-full max-w-3xl my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10 px-4">
    
    <!-- Opened Notebook Page Card -->
    <div class="relative notebook-sheet rounded-3xl p-6 sm:p-12 pl-12 sm:pl-16 overflow-hidden">
      <!-- Notebook spiral binder rings -->
      <div class="binder-rings-left">
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
        <div class="ring-hole"></div>
      </div>

      <!-- Cute Decorative Cloud Sticker -->
      <div class="absolute top-4 right-4 pointer-events-none opacity-80">
        <svg viewBox="0 0 100 100" class="w-12 h-10 drop-shadow-sm">
          <path d="M20,60 C20,45 35,35 50,40 C55,30 70,30 80,45 C90,45 95,55 90,65 C85,75 75,75 20,75 C10,72 10,60 20,60 Z" fill="#E8F0FE" />
          <circle cx="35" cy="62" r="4" fill="#FFB7B2" />
          <circle cx="65" cy="62" r="4" fill="#FFB7B2" />
          <circle cx="43" cy="55" r="3" fill="#4A3B32" />
          <circle cx="57" cy="55" r="3" fill="#4A3B32" />
          <path d="M48,60 Q50,63 52,60" stroke="#4A3B32" stroke-width="1.5" fill="none" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Handwriting Letter -->
      <div class="border-b-2 border-dashed border-[#FFCAD4] pb-6 mb-6 font-sans">
        <div class="flex flex-col gap-2.5 items-center justify-center text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE5D9] rounded-full text-xs font-bold text-[#FF9EAA]">
            <span>💌 Letter for You</span>
          </div>
          <h2 class="font-handwritten text-4xl font-bold text-[#8A7A6E] mt-2">${letterTitle}</h2>
          <div class="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
            For: <span class="text-[#FF9EAA]">${config.toName}</span> • From: <span class="text-[#FF9EAA]">${config.fromName}</span>
          </div>
        </div>
      </div>

      <!-- Handwriting Content -->
      <div class="font-handwritten text-[#4A3B32] text-2xl sm:text-3xl leading-relaxed whitespace-pre-wrap min-h-[160px] px-2" id="letter-body-content"></div>

      <!-- Final Message -->
      ${
        config.finalMessage
          ? `
      <div id="final-message-container" class="hidden font-handwritten text-3xl text-center text-[#FF9EAA] font-bold mt-10 pt-6 border-t-2 border-dashed border-[#FFCAD4] transition-opacity duration-1000 opacity-0 relative">
        ✨ "${config.finalMessage}" ✨
        <!-- Sparkle Star Sticker -->
        <div class="absolute bottom-[-10px] right-2 pointer-events-none animate-bounce" style="animation-duration: 2.5s;">
          <svg viewBox="0 0 100 100" class="w-8 h-8 drop-shadow-sm">
            <path d="M50,10 L62,38 L90,50 L62,62 L50,90 L38,62 L10,50 L38,38 Z" fill="#FFF2CC" stroke="#FFD166" stroke-width="3" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      `
          : ""
      }
    </div>

    <!-- Polaroid Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mt-10 mb-8 transition-opacity duration-1000 opacity-0 relative">
      <!-- Flower Sticker -->
      <div class="absolute top-[-10px] left-2 pointer-events-none">
        <svg viewBox="0 0 100 100" class="w-10 h-10 drop-shadow-sm animate-pulse">
          <circle cx="50" cy="25" r="14" fill="#FFB7B2" />
          <circle cx="50" cy="75" r="14" fill="#FFB7B2" />
          <circle cx="25" cy="50" r="14" fill="#FFB7B2" />
          <circle cx="75" cy="50" r="14" fill="#FFB7B2" />
          <circle cx="32" cy="32" r="14" fill="#FFB7B2" />
          <circle cx="68" cy="32" r="14" fill="#FFB7B2" />
          <circle cx="32" cy="68" r="14" fill="#FFB7B2" />
          <circle cx="68" cy="68" r="14" fill="#FFB7B2" />
          <circle cx="50" cy="50" r="16" fill="#FFF2CC" />
        </svg>
      </div>

      <div class="text-center relative py-4 mb-2">
        <div class="tape tape-yellow top-0 left-[42%] w-20 h-5 opacity-80"></div>
        <h3 class="font-handwritten text-4xl font-bold text-[#8A7A6E]">💖 Captured Memories</h3>
        <p class="font-sans text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-2">Tap & drag photos to rearrange them</p>
      </div>
      <!-- Drag & Toss Workspace -->
      <div id="polaroid-grid" class="flex flex-wrap items-center justify-center gap-8 py-8 min-h-[300px] relative"></div>
    </div>

    <!-- Voice Note Section (Cute Cassette Tape) -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-[#FFFDF0] border-4 border-dashed border-[#FFCAD4] rounded-3xl p-6 mb-8 shadow-md relative transition-opacity duration-1000 opacity-0 max-w-md mx-auto">
      <!-- Tape effect -->
      <div class="tape tape-heart top-[-10px] left-[15%] w-20 h-6"></div>
      
      <h4 class="font-sans text-xs uppercase tracking-widest font-bold text-[#FF9EAA] mb-4 text-center">
        📟 Voice Message
      </h4>
      
      <!-- Cassette Outer Case -->
      <div class="bg-[#FF9EAA] p-4 rounded-2xl border-4 border-[#FFAEBC] shadow-inner flex flex-col gap-4 relative overflow-hidden">
        <!-- Cassette Top Label -->
        <div class="bg-white/95 rounded-xl p-3 border-2 border-dashed border-[#FF9EAA] flex flex-col items-center">
          <span class="font-handwritten text-xl font-bold text-[#8A7A6E]">Voice Message for You</span>
          <div class="flex items-center gap-1.5 mt-1 text-[9px] text-[#FFAEBC] font-sans font-bold">
            <span>SIDE A</span>
            <span>•</span>
            <span>STEREO</span>
          </div>
        </div>
        
        <!-- Cassette Tape Window & Reels -->
        <div class="bg-[#4A3B32] h-14 rounded-xl border-4 border-[#5A4B42] flex items-center justify-around relative px-6">
          <!-- Left Reel -->
          <div class="cassette-reel reel-left flex items-center justify-center">
            <div class="w-3 h-3 bg-[#4A3B32] rounded-full"></div>
          </div>
          <!-- Center window glass (showing brown tape) -->
          <div class="w-16 h-6 bg-[#8C6D58]/40 border border-[#8C6D58]/20 rounded-md"></div>
          <!-- Right Reel -->
          <div class="cassette-reel reel-right flex items-center justify-center">
            <div class="w-3 h-3 bg-[#4A3B32] rounded-full"></div>
          </div>
        </div>
        
        <!-- Cassette Bottom Details -->
        <div class="flex justify-between items-center px-4 text-[9px] font-sans font-bold text-[#FFFDF0]">
          <span>C-60</span>
          <span>DOLBY SYSTEM</span>
        </div>
      </div>

      <!-- Playback Controls -->
      <div class="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-[#FF9EAA] hover:bg-[#FF8093] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full font-sans">
          <div class="relative h-2.5 bg-pink-100/80 rounded-full cursor-pointer border border-[#FFCAD4]" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-[#FF9EAA] rounded-full w-0" id="audio-progress"></div>
          </div>
          <div class="flex justify-between text-[10px] text-pink-400 font-bold mt-2">
            <span id="current-time">0:00</span>
            <span id="duration">0:00</span>
          </div>
        </div>
        <audio id="audio-element" src="${voiceNoteSrc}" ontimeupdate="updateProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
    </div>
    `
        : ""
    }

    <!-- Footer branding -->
    <div class="text-center mt-12 mb-6 text-[10px] font-bold uppercase tracking-widest text-[#FF9EAA]/60 font-sans">
      DearNote Keepsake Journal
    </div>
  </div>

  <script>
    const config = {
      secretCode: "${config.secretCode || ""}",
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote}
    };

    // 1. Code Validation
    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');
      
      if (input === actualCode) {
        const codeSection = document.getElementById('code-section');
        codeSection.classList.add('scale-95', 'opacity-0');
        // Start BGM on user interaction
        playBgm();
        setTimeout(() => {
          codeSection.remove();
          const coverSection = document.getElementById('cover-section');
          coverSection.classList.remove('hidden');
          coverSection.classList.add('flex');
        }, 500);
      } else {
        errorMsg.classList.remove('opacity-0');
        const inputEl = document.getElementById('secret-code-input');
        inputEl.classList.add('border-red-400', 'animate-bounce');
        setTimeout(() => { inputEl.classList.remove('animate-bounce'); }, 500);
      }
    }

    // 2. Click-per-page folding state machine
    //    Pages flip one-by-one on each click:
    //    Click 1 → cover flips
    //    Click 2 → leaf-1 flips
    //    Click 3 → leaf-2 flips → transition to content
    let pageStep = 0; // 0=idle, 1=cover flipped, 2=leaf1 flipped, 3=leaf2 flipped (done)
    let isFlipping = false; // debounce: prevent double-click during animation

    function updateHint(text) {
      const hint = document.getElementById('flip-hint');
      if (!hint) return;
      hint.classList.remove('animate-pulse');
      hint.style.opacity = '0';
      setTimeout(() => {
        hint.innerText = text;
        hint.style.opacity = '1';
        hint.style.transition = 'opacity 0.4s ease';
        // re-add pulse only for non-final hints
        if (pageStep < 3) hint.classList.add('animate-pulse');
      }, 300);
    }

    function transitionToContent() {
      const coverSection = document.getElementById('cover-section');
      coverSection.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      coverSection.style.opacity = '0';
      coverSection.style.transform = 'scale(1.04)';
      setTimeout(() => {
        coverSection.remove();
        const scrapbookSection = document.getElementById('scrapbook-section');
        scrapbookSection.classList.remove('hidden');
        setTimeout(() => {
          scrapbookSection.classList.remove('opacity-0', 'translate-y-10');
          startTypewriter();
        }, 50);
      }, 700);
    }

    function flipNextPage() {
      if (isFlipping) return;

      if (pageStep === 0) {
        // First click → start BGM + flip cover
        playBgm();
        isFlipping = true;
        const cover = document.getElementById('book-cover');
        cover.classList.add('flipped');
        pageStep = 1;
        setTimeout(() => {
          isFlipping = false;
          updateHint('Continue — tap the next page');
        }, 900); // wait for CSS transition (1.5s but we show hint after 0.9s)

      } else if (pageStep === 1) {
        // Second click → flip leaf-1
        isFlipping = true;
        const leaf1 = document.getElementById('leaf-1');
        leaf1.classList.add('flipped');
        pageStep = 2;
        setTimeout(() => {
          isFlipping = false;
          updateHint('One more — open the last page');
        }, 900);

      } else if (pageStep === 2) {
        // Third click → flip leaf-2 then transition
        isFlipping = true;
        const leaf2 = document.getElementById('leaf-2');
        leaf2.classList.add('flipped');
        pageStep = 3;
        updateHint('Opening journal...');
        setTimeout(() => {
          transitionToContent();
        }, 1400);
      }
      // pageStep === 3: all done, ignore extra clicks
    }

    // 3. Handwritten Typewriter effect
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 30;
      
      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (index < limit) {
          container.innerHTML += text.charAt(index);
          index++;
          
          if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          setTimeout(type, speed);
        } else {
          revealExtraSections();
        }
      }
      type();
    }

    // 4. Drag and Drop Interaction for Polaroid Cards
    function makeDraggable(element, initialRotation) {
      let currentX = 0;
      let currentY = 0;
      let initialX = 0;
      let initialY = 0;
      let xOffset = 0;
      let yOffset = 0;
      let active = false;
      
      // Set initial state
      element.style.transform = "translate3d(0px, 0px, 0px) rotate(" + initialRotation + "deg)";

      element.addEventListener("mousedown", dragStart, { passive: false });
      element.addEventListener("touchstart", dragStart, { passive: false });

      function dragStart(e) {
        // Bring active card to the front
        document.querySelectorAll('.polaroid').forEach(p => p.style.zIndex = "10");
        element.style.zIndex = "100";
        element.style.transition = "none";

        if (e.type === "touchstart") {
          initialX = e.touches[0].clientX - xOffset;
          initialY = e.touches[0].clientY - yOffset;
        } else {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
        }
        
        // Prevent drag on sub-links or buttons
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
          active = true;
        }
      }

      function dragMove(e) {
        if (active) {
          e.preventDefault(); // Prevent touch scroll when dragging
          
          if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
          } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
          }

          xOffset = currentX;
          yOffset = currentY;

          element.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0px) rotate(" + initialRotation + "deg) scale(1.05)";
        }
      }

      document.addEventListener("mousemove", dragMove, { passive: false });
      document.addEventListener("touchmove", dragMove, { passive: false });
      
      function dragEnd() {
        if (!active) return;
        active = false;
        element.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15)";
        element.style.transform = "translate3d(" + xOffset + "px, " + yOffset + "px, 0px) rotate(" + initialRotation + "deg)";
        element.style.zIndex = "40"; // remain stacked above un-dragged cards
      }

      document.addEventListener("mouseup", dragEnd);
      document.addEventListener("touchend", dragEnd);
    }

    // 5. Polaroid Scatter and Fades
    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('polaroid-grid');
        const rotations = [-5, 4, -3, 5, -4];
        
        config.photos.forEach((photo, idx) => {
          const item = document.createElement('div');
          const rot = rotations[idx % rotations.length];
          item.className = 'polaroid w-64 max-w-full relative';
          
          // tape styling
          const tapeClasses = ['tape-heart', 'tape-yellow', 'tape-green'];
          const tapeClass = tapeClasses[idx % tapeClasses.length];
          const tape = document.createElement('div');
          tape.className = "tape " + tapeClass + " absolute w-16 h-5 opacity-80";
          tape.style.top = '-10px';
          tape.style.left = '35%';
          tape.style.transform = 'rotate(' + (Math.random() * 8 - 4) + 'deg)';
          item.appendChild(tape);

          const imgContainer = document.createElement('div');
          imgContainer.className = 'polaroid-img-container w-full h-48 overflow-hidden rounded-lg border border-pink-100';

          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory';
          img.className = 'w-full h-full object-cover transition duration-300 hover:scale-105';
          
          imgContainer.appendChild(img);
          item.appendChild(imgContainer);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-handwritten text-2xl text-center text-[#4A3B32] italic mt-3 leading-tight px-1';
            cap.innerText = photo.caption;
            item.appendChild(cap);
          }
          grid.appendChild(item);

          // Apply drag capability
          makeDraggable(item, rot);
        });
        
        gallery.classList.remove('hidden');
        setTimeout(() => { gallery.classList.add('opacity-100'); }, 100);
      }
      
      if (config.hasVoiceNote) {
        const voice = document.getElementById('voice-section');
        voice.classList.remove('hidden');
        setTimeout(() => { voice.classList.add('opacity-100'); }, 300);
      }
      
      const finalMsg = document.getElementById('final-message-container');
      if (finalMsg) {
        finalMsg.classList.remove('hidden');
        setTimeout(() => { finalMsg.classList.add('opacity-100'); }, 500);
      }
    }

    // 6. Audio Player Logic
    let audio = null;
    let isPlaying = false;
    
    // Background Music (BGM) Logic
    let bgmAudio = null;
    let isBgmPlaying = false;
    let isBgmMuted = false;

    function getBgmAudio() {
      if (!bgmAudio) {
        bgmAudio = document.getElementById('bgm-audio-element');
      }
      return bgmAudio;
    }

    function playBgm() {
      const player = getBgmAudio();
      if (player && !isBgmMuted && !isPlaying) {
        player.play().catch(e => console.error("BGM Autoplay blocked:", e));
        isBgmPlaying = true;
        const icon = document.getElementById('bgm-icon');
        if (icon) icon.innerText = '🎵';
      }
    }

    function pauseBgm() {
      const player = getBgmAudio();
      if (player && isBgmPlaying) {
        player.pause();
        isBgmPlaying = false;
      }
    }

    function toggleBgm() {
      const player = getBgmAudio();
      const icon = document.getElementById('bgm-icon');
      if (!player) return;
      if (isBgmMuted) {
        isBgmMuted = false;
        if (icon) icon.innerText = '🎵';
        if (!isPlaying) {
          player.play().catch(e => console.error(e));
          isBgmPlaying = true;
        }
      } else {
        isBgmMuted = true;
        if (icon) icon.innerText = '🔇';
        player.pause();
        isBgmPlaying = false;
      }
    }

    function getAudioElement() {
      if (!audio) audio = document.getElementById('audio-element');
      return audio;
    }

    function initAudioMetadata() {
      const player = getAudioElement();
      const durationEl = document.getElementById('duration');
      if (durationEl && player.duration) {
        durationEl.innerText = formatTime(player.duration);
      }
    }

    function toggleAudio() {
      const player = getAudioElement();
      const playIcon = document.getElementById('play-icon');
      const reels = document.querySelectorAll('.cassette-reel');
      
      if (isPlaying) {
        player.pause();
        playIcon.innerText = '▶';
        isPlaying = false;
        reels.forEach(r => r.classList.remove('playing'));
        playBgm();
      } else {
        pauseBgm();
        player.play().catch(e => console.error(e));
        playIcon.innerText = '⏸';
        isPlaying = true;
        reels.forEach(r => r.classList.add('playing'));
      }
    }

    function updateProgress() {
      const player = getAudioElement();
      const progress = document.getElementById('audio-progress');
      const current = document.getElementById('current-time');
      
      if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        progress.style.width = percent + '%';
        current.innerText = formatTime(player.currentTime);
      }
      
      if (player.ended) {
        document.getElementById('play-icon').innerText = '▶';
        progress.style.width = '0%';
        current.innerText = '0:00';
        isPlaying = false;
        document.querySelectorAll('.cassette-reel').forEach(r => r.classList.remove('playing'));
        playBgm();
      }
    }

    function seekAudio(event) {
      const player = getAudioElement();
      const bar = document.getElementById('progress-bar-container');
      const rect = bar.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      
      if (player.duration) {
        player.currentTime = clickPosition * player.duration;
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
