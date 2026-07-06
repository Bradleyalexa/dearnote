import { PublishedConfig } from "../../schemas/card-draft";

export function generateMothersDayHtml(config: PublishedConfig): string {
  const appUrl = typeof window !== "undefined"
    ? window.location.origin
    : (process.env.APP_URL || "https://dearnote.asia");

  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Selamat Hari Ibu, Mama Tercinta";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // A beautiful emotional piano tune for mothers
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mother's Day Herbarium – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            cursive: ['"Dancing Script"', 'cursive'],
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
      background: linear-gradient(135deg, #FFF0F2 0%, #FFE2E7 50%, #FFCCD7 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #2D3748;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Falling Botanical Petals Canvas */
    #petal-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Warm light glow */
    .glow-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 25%, rgba(255, 192, 203, 0.22) 0%, rgba(255, 255, 255, 0) 80%);
      pointer-events: none;
      z-index: 1;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 105, 135, 0.03);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 105, 135, 0.3);
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
      background: linear-gradient(135deg, #FFF0F2 0%, #FFE2E7 50%, #FFCCD7 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
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

    /* Spine element */
    .book-spine {
      position: absolute;
      left: -4px;
      top: 2%;
      width: 14px;
      height: 96%;
      background: linear-gradient(to right, #CC5A71, #B3485D, #99374C);
      border-radius: 4px 0 0 4px;
      box-shadow: -5px 5px 15px rgba(0,0,0,0.15);
      z-index: 60;
    }

    /* Aged Paper Style (Yellowed parchment book pages) */
    .book-page {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: radial-gradient(circle, #FCF7ED 50%, #EFE1CB 100%);
      border-radius: 0 12px 12px 0;
      box-shadow: inset 0 0 35px rgba(139, 90, 43, 0.18), 5px 10px 30px rgba(180, 100, 120, 0.18);
      transform-origin: left center;
      transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1), z-index 1.6s;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
      border: 1px solid #E4D8C4;
    }

    /* Cover Page Custom Styles (Linen texture & Gold Foil) */
    .book-cover {
      background: radial-gradient(circle at center, #FF8EA6 0%, #E65C78 100%);
      border: 6px double #FFFDFB;
      box-shadow: inset 0 0 40px rgba(0,0,0,0.15), 5px 10px 25px rgba(180, 100, 120, 0.25);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 30px 20px;
      cursor: pointer;
      z-index: 100; /* Start at top */
    }

    /* Embossed Gold foil text effect */
    .gold-embossed {
      background: linear-gradient(135deg, #FFE082 0%, #D4AF37 50%, #996515 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0px 1px 1px rgba(0,0,0,0.2));
      font-weight: bold;
    }

    /* Page flips */
    .book-page.flipped {
      transform: rotateY(-180deg) translateZ(1px); /* Slight translateZ to prevent backface clipping */
    }

    /* Botanical Pressing Styles (translucent tape) */
    .washi-tape {
      position: absolute;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(2px);
      border: 1px dashed rgba(255, 105, 135, 0.2);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      transform: rotate(-12deg);
      font-size: 7px;
      color: rgba(255, 105, 135, 0.7);
      font-family: monospace;
      padding: 2px 8px;
      pointer-events: none;
      user-select: none;
      z-index: 5;
    }

    /* Clean writing typography - line height 1.6 */
    .lined-journal-area {
      line-height: 1.6;
      font-size: 14px;
    }

    /* Polaroid card deck - enlarged sizes */
    .polaroid-card {
      background: white;
      border: 6px solid white;
      border-bottom: 24px solid white;
      box-shadow: 0 10px 25px rgba(180, 100, 120, 0.15);
      border-radius: 2px;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, z-index 0.6s;
      cursor: pointer;
    }

    /* Rose gold media player */
    .rosegold-player {
      background: #FFF5F6;
      border: 1px solid rgba(255, 105, 135, 0.2);
      border-radius: 12px;
    }

    /* Music button */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 1px solid #FF8EA6;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 105, 135, 0.15);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Navigation bookmarks */
    .nav-bookmark {
      position: absolute;
      bottom: 20px;
      padding: 6px 14px;
      background: #FF8EA6;
      color: white;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(255,105,135,0.25);
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      z-index: 45;
    }
    .nav-bookmark:hover {
      background: #E65C78;
      transform: translateY(-1px);
    }
    .nav-bookmark.prev {
      left: 20px;
    }
    .nav-bookmark.next {
      right: 20px;
    }

    /* Sparkles */
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

    /* Small flower button picker styles */
    .flower-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(255, 105, 135, 0.2);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .flower-btn:hover {
      transform: scale(1.15);
    }
    .flower-btn.active {
      border-color: #E65C78;
      background: #FFF0F2;
      box-shadow: 0 0 8px rgba(255, 105, 135, 0.3);
      transform: scale(1.1);
    }

    /* ── Herbarium Canvas Layout ── */
    #herbarium-canvas {
      position: relative;
      width: 280px;
      height: 320px;
      background-color: #FCF9F2;
      border: 2px dashed #DFD3BE;
      border-radius: 12px;
      box-shadow: inset 0 0 20px rgba(139, 90, 43, 0.08);
      overflow: hidden;
      touch-action: none; /* disables default panning/scrolling during drag */
    }

    /* Interactive flower elements inside canvas */
    .canvas-flower {
      position: absolute;
      transform-origin: center center;
      z-index: 10;
      transition: box-shadow 0.2s;
    }
    .canvas-flower.selected-flower {
      z-index: 40;
    }

    /* Rotate & Scale & Delete handles visual styling */
    .rotate-handle {
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      border: 1px solid #B3485D;
    }
    .scale-handle {
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      border: 1px solid #2B6CB0;
    }
    .delete-btn {
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body class="flex flex-col min-h-screen items-center justify-center p-4 relative" onclick="spawnHeartSparkle(event)">

  <!-- Falling botanical petals canvas -->
  <canvas id="petal-canvas"></canvas>
  <div class="glow-overlay"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-white max-w-sm w-full rounded-[1.5rem] p-8 border border-pink-100 shadow-xl text-center relative overflow-hidden">
      <div class="absolute top-2 left-2 text-[#FF8EA6]/20 text-xl">🌸</div>
      <div class="absolute bottom-2 right-2 text-[#FF8EA6]/20 text-xl">🌸</div>
      
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#FF8EA6] mb-2 font-sans">DearNote • Herbarium</p>
      <h1 class="text-2xl font-bold font-playfair text-[#111827] mb-4">Lined with Memories</h1>
      <p class="text-xs text-pink-500 leading-relaxed mb-6 font-sans">
        A sweet herbarium book from <strong>${config.fromName}</strong> is locked. Enter the passkey to open.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Passkey" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border border-pink-250 rounded-xl text-center font-sans tracking-widest text-[#111827] focus:outline-none focus:border-[#FF8EA6] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#FF8EA6] hover:bg-[#E65C78] text-white font-bold rounded-xl transition-all shadow-md font-sans text-xs tracking-wider uppercase">
          Open Book
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Incorrect code. Please try again.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: 3D HERBARIUM BOOK CONTAINER ── -->
  <div class="book-wrapper">
    <div class="book-spine"></div>

    <!-- ── PAGE 0: BOOK COVER ── -->
    <div id="page-cover" class="book-page book-cover" onclick="turnPage(0, true)">
      <div class="text-center mt-6">
        <span class="block text-[8px] tracking-[4px] uppercase text-[#FFFDFB]/80 font-semibold mb-2">Herbarium Memori</span>
        <h1 class="text-3xl font-playfair font-bold text-white leading-tight">Untuk Ibu<br>Tercinta</h1>
      </div>

      <!-- Embossed Pressed Flower illustration -->
      <div class="w-36 h-36 flex items-center justify-center bg-white/10 rounded-full border border-white/20 relative">
        <svg class="w-24 h-24 text-white" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 C 45 60, 55 40, 50 15 C 48 30, 40 38, 30 38 C 45 42, 48 58, 48 85 Z" opacity="0.9"/>
          <circle cx="50" cy="18" r="6" fill="#FFFDFB"/>
          <circle cx="40" cy="28" r="5" fill="#FFFDFB"/>
          <circle cx="62" cy="24" r="5" fill="#FFFDFB"/>
          <path d="M52 48 Q 68 45 60 38 Q 52 44 52 48 Z" fill="#FFE082"/>
          <path d="M47 62 Q 30 63 38 70 Q 47 68 47 62 Z" fill="#FFE082"/>
        </svg>
        <div class="absolute inset-0 rounded-full border-2 border-dashed border-[#FFE082]/30 animate-spin" style="animation-duration: 20s"></div>
      </div>

      <div class="text-center mb-6">
        <span class="text-[8px] uppercase tracking-widest text-[#FFFDFB]/70 font-semibold block mb-2">Dari: ${config.fromName}</span>
        <span class="text-[9px] uppercase tracking-[2.5px] text-[#FFE082] font-bold animate-pulse">Ketuk untuk Membuka &rarr;</span>
      </div>
    </div>

    <!-- ── PAGE 1: INTERACTIVE HERBARIUM CANVAS ── -->
    <div id="page-1" class="book-page p-5 flex flex-col justify-between" style="z-index: 40">
      
      <!-- Labeled Canvas Container -->
      <div class="flex flex-col items-center">
        <span class="text-xs sm:text-sm tracking-wider uppercase text-pink-500 font-bold block mb-2 self-start">Flowers for you</span>
        
        <!-- Interactive Drawing Canvas -->
        <div id="herbarium-canvas">
          <!-- Small initial guidelines inside canvas -->
          <div id="canvas-hint" class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[10px] text-zinc-400 pointer-events-none select-none">
            <span>🌸 Flower for you!</span>
            <span class="mt-1">Drag bunga untuk memindahkan, putar gagang ↻, perbesar ⤢, atau lepas di luar kotak untuk menghapus.</span>
          </div>
        </div>
      </div>

      <!-- Flower Select Buttons Deck -->
      <div class="mt-3" id="flower-select-deck">
        <div class="flex justify-around px-2">
          <button class="flower-btn" onclick="spawnFlower(0)" title="Lavender">🪻</button>
          <button class="flower-btn" onclick="spawnFlower(1)" title="Rose">🌹</button>
          <button class="flower-btn" onclick="spawnFlower(2)" title="Carnation">🌺</button>
          <button class="flower-btn" onclick="spawnFlower(3)" title="Daisy">🌼</button>
          <button class="flower-btn" onclick="spawnFlower(4)" title="Orchid">🌸</button>
          <button class="flower-btn" onclick="spawnFlower(5)" title="Flower">🌷</button>
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-1 relative flex items-center justify-end">
        <button class="nav-bookmark next" onclick="turnPage(1, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 2: LINED JOURNAL LETTER ── -->
    <div id="page-2" class="book-page p-5 flex flex-col justify-between" style="z-index: 30">
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Letter header -->
        <div class="border-b border-pink-100 pb-2 mb-3 text-center">
          <h2 class="text-[10px] font-bold text-[#FF8EA6] uppercase tracking-widest font-sans">Dear Mama</h2>
          <h1 class="font-playfair text-base font-bold text-[#111827] mt-0.5">${letterTitle}</h1>
        </div>

        <!-- clean text sheet with typewriter -->
        <div class="lined-journal-area font-lora text-xs sm:text-sm text-zinc-800 flex-1 whitespace-pre-wrap break-words overflow-y-auto pr-1" id="typewriter-text" style="max-height: 290px;"></div>

        <!-- Voice greeting if any -->
        ${hasVoiceNote ? `
        <div class="rosegold-player p-3 flex items-center gap-3 mt-3 flex-shrink-0">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8EA6] to-[#E65C78] hover:from-[#FFA5AB] hover:to-[#FF6584] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-[10px] ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[7px] uppercase font-bold tracking-widest text-[#E65C78] font-sans mb-0.5">🎙️ Voice Note untuk Mama</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-pink-100 rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#E65C78] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[9px] font-semibold text-pink-500 font-sans flex-shrink-0">0:00</span>
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

    <!-- ── PAGE 3: PHOTO ALBUM ── -->
    <div id="page-3" class="book-page p-5 flex flex-col justify-between" style="z-index: 20">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center pb-2 border-b border-pink-100 mb-4">
          <h2 class="text-[10px] font-bold text-[#FF8EA6] uppercase tracking-widest font-sans">Cozy Scrapbook</h2>
          <h1 class="font-playfair text-lg font-bold text-[#111827]">Galeri Cinta Mama</h1>
        </div>

        <!-- Polaroid Stack Deck Container - Enlarged photo layout -->
        <div class="flex-1 flex items-center justify-center relative min-h-[300px] overflow-hidden" id="gallery-container-node">
          ${config.photos && config.photos.length > 0 ? `
          <div class="relative w-full h-[280px] flex items-center justify-center" id="photo-deck">
            ${config.photos.map((photo, i) => {
              return `
              <div class="polaroid-card p-2 w-[240px] absolute transition-all duration-500" 
                id="pcard-${i}"
                onclick="cyclePhoto(${i})">
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-pink-50/10">
                  <img src="${photo.src}" alt="Scrapbook Photo" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-lora text-[13px] text-pink-900 italic mt-2 px-2 leading-snug break-words">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
          ` : `
          <div class="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-pink-100 rounded-2xl">
            <span class="text-2xl text-pink-300">🌸</span>
            <p class="text-xs text-pink-400 font-medium mt-2 text-center">Mama adalah taman bunga terindah kami</p>
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

    <!-- ── PAGE 4: FINALE & CLOSING (Secret Envelope Pocket Layout) ── -->
    <div id="page-4" class="book-page p-5 flex flex-col justify-between" style="z-index: 10">
      
      <div class="text-center pb-2 border-b border-pink-100 mb-6">
        <h2 class="text-[10px] font-bold text-[#FF8EA6] uppercase tracking-widest font-sans">Herbarium Keepsake</h2>
        <h1 class="font-playfair text-lg font-bold text-[#111827]">Pesan Terakhir</h1>
      </div>

      <!-- Interactive Secret Love Letter Pocket -->
      <div class="relative w-[210px] h-[150px] mx-auto mt-6 flex items-center justify-center cursor-pointer" onclick="toggleSecretPocket(this)">
        <!-- Washi tape at pocket corner -->
        <div class="washi-tape top-[-8px] left-[-16px] w-20 h-4 rotate-[-12deg] text-center">🌸 MEMORIES</div>
        
        <!-- Pocket Cover Face -->
        <div class="absolute inset-0 bg-[#EADCC6] border border-[#D1BEA4] rounded-b-xl shadow-md z-20 flex flex-col justify-end p-3 text-center">
          <div class="absolute top-0 left-0 right-0 h-4 bg-[#D1BEA4]/30 rounded-t-sm"></div>
          <p class="text-[8px] uppercase tracking-widest text-[#7C6C57] font-bold mb-1">Kantong Surat Mama</p>
          <span class="text-[8px] text-[#9A866D] font-extrabold animate-pulse uppercase tracking-wider">Ketuk Amplop</span>
        </div>

        <!-- Slide Up Memo Card -->
        <div id="secret-memo-card" class="absolute w-[190px] h-[160px] bg-white border border-[#EAD6DA] rounded-lg shadow-lg p-3 z-10 transition-transform duration-700 ease-out transform translate-y-[25px] flex flex-col justify-between">
          <p class="font-cursive text-xs text-pink-700 font-bold border-b border-pink-100 pb-1">P.S. Untuk Mama...</p>
          <div class="font-lora text-[11px] text-zinc-700 leading-relaxed italic flex-1 mt-2 overflow-y-auto pr-0.5">
            ${config.finalMessage || "Terima kasih sudah mencintaiku tanpa syarat dan merawatku dengan penuh kesabaran, Ma. Selamat Hari Ibu! ❤️"}
          </div>
          <p class="text-[7px] text-zinc-400 text-right uppercase tracking-wider font-bold mt-1">— Dari buah hati tercinta</p>
        </div>
      </div>

      <!-- Small visual cue speech text -->
      <div class="text-center my-4">
        <p class="text-[10px] text-zinc-500 italic font-sans">Ketuk kantong surat di atas untuk membaca pesan rahasia...</p>
      </div>

      <!-- Nav controls -->
      <div class="h-10 relative flex items-center justify-start">
        <button class="nav-bookmark prev" onclick="turnPage(4, false)">&larr; Prev</button>
      </div>
    </div>
  </div>

  <!-- Soft Photo Zoom Modal (Fallback click if needed) -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-sm w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-pink-100 shadow flex items-center justify-center font-bold text-pink-500 hover:bg-pink-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-lora text-sm italic text-pink-900 mt-3 px-2"></p>
    </div>
  </div>

  <!-- Script Logic -->
  <script>
    window.PREV_FLOWERS_STATE = ${JSON.stringify(config.flowers || [])};
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

    // 1. Spawning falling botanical petals
    const canvas = $('petal-canvas');
    const ctx = canvas.getContext('2d');
    
    let petals = [];
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -20 - 20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.9 + 0.6;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.4 + 0.4;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1.2 - 0.6;
        this.color = ['#FFC0CB', '#FFB3C1', '#D4C5E2', '#E1BEE7'][Math.floor(Math.random() * 4)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.3;
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
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
        ctx.fill();
        
        ctx.restore();
      }
    }

    for (let i = 0; i < 20; i++) {
      petals.push(new Petal());
      petals[i].y = Math.random() * canvas.height;
    }

    function animatePetals() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();

    // 2. Secret Code Lock
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        const gate = $('code-gate');
        gate.style.opacity = '0';
        gate.style.transform = 'scale(0.97)';
        
        startBgm();
        setTimeout(() => {
          gate.remove();
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

    // Dynamic z-index values on flipping to avoid overlaps
    const pages = [
      $('page-cover'),
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
          p.style.zIndex = 100 - idx; // Unflipped layers stack on top
        }
      });
    }
    updateZIndices();

    // 3. Page turns
    let currentPage = 0;
    function turnPage(pageIdx, isNext) {
      startBgm();
      if (isNext) {
        if (pageIdx === 0) {
          $('page-cover').classList.add('flipped');
          currentPage = 1;
        } else if (pageIdx === 1) {
          $('page-1').classList.add('flipped');
          currentPage = 2;
          setTimeout(startTypewriter, 600); // trigger writing on page 2
        } else if (pageIdx === 2) {
          $('page-2').classList.add('flipped');
          currentPage = 3;
        } else if (pageIdx === 3) {
          $('page-3').classList.add('flipped');
          currentPage = 4;
        }
      } else {
        if (pageIdx === 1) {
          $('page-cover').classList.remove('flipped');
          currentPage = 0;
        } else if (pageIdx === 2) {
          $('page-1').classList.remove('flipped');
          currentPage = 1;
        } else if (pageIdx === 3) {
          $('page-2').classList.remove('flipped');
          currentPage = 2;
        } else if (pageIdx === 4) {
          $('page-3').classList.remove('flipped');
          currentPage = 3;
        }
      }
      updateZIndices();
    }

    // Builder preview auto-open hook
    function openEnvelope() {
      startBgm();
      $('page-cover').classList.add('flipped');
      $('page-1').classList.add('flipped');
      currentPage = 2;
      updateZIndices();
      setTimeout(startTypewriter, 300);
    }
    
    // Also support alternate bypass handles
    function openBook() { openEnvelope(); }
    function openGiftBox() { openEnvelope(); }

    // 4. Typewriter letters
    let typewriterIndex = 0;
    let typewriterStarted = false;
    function startTypewriter() {
      if (typewriterStarted) return;
      typewriterStarted = true;
      const target = $('typewriter-text');
      const text = CONFIG.letterBody;
      const speed = 25;
      
      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (typewriterIndex < limit) {
          target.innerHTML += text.charAt(typewriterIndex);
          typewriterIndex++;
          setTimeout(type, speed);
        } else if (text.length > 1000) {
          const remaining = text.substring(typewriterIndex);
          const span = document.createElement('span');
          span.style.opacity = '0';
          span.style.transition = 'opacity 1.0s ease-in-out';
          span.innerHTML = remaining;
          target.appendChild(span);
          setTimeout(() => { span.style.opacity = '1'; }, 50);
        }
      }
      type();
    }

    // 5. 5-Flower Bouquet choices (using user assets path)
    const flowerDetails = [
      { name: "Lavender", src: "${appUrl}/img/herbarium/lavender.png" },
      { name: "Rose", src: "${appUrl}/img/herbarium/rose.png" },
      { name: "Carnation", src: "${appUrl}/img/herbarium/carnation.png" },
      { name: "Daisy", src: "${appUrl}/img/herbarium/daisy.png" },
      { name: "Orchid", src: "${appUrl}/img/herbarium/orchid.png" },
      { name: "Flower", src: "${appUrl}/img/herbarium/flower.png" }
    ];

    const isPreview = !!window.IS_DEARNOTE_PREVIEW;
    if (!isPreview) {
      const deck = $('flower-select-deck');
      if (deck) deck.remove();
    }

    // ── Interactive Flower Arranger Engine (Drag, Drop, Rotate, Scale & Delete) ──
    const herbariumCanvas = $('herbarium-canvas');
    let selectedFlower = null;
    let isPinching = false;

    // Deselect flower when clicking outside on canvas
    if (isPreview) {
      herbariumCanvas.addEventListener('pointerdown', (e) => {
        if (e.target === herbariumCanvas || e.target.id === 'canvas-hint') {
          selectFlowerEl(null);
        }
      });
    }

    function selectFlowerEl(el) {
      if (selectedFlower) {
        selectedFlower.classList.remove('selected-flower');
        selectedFlower.querySelector('.selection-box').style.display = 'none';
        selectedFlower.querySelector('.delete-btn').style.display = 'none';
        selectedFlower.querySelector('.rotate-handle').style.display = 'none';
        selectedFlower.querySelector('.scale-handle').style.display = 'none';
      }
      selectedFlower = el;
      if (selectedFlower) {
        selectedFlower.classList.add('selected-flower');
        selectedFlower.querySelector('.selection-box').style.display = 'block';
        selectedFlower.querySelector('.delete-btn').style.display = 'flex';
        selectedFlower.querySelector('.rotate-handle').style.display = 'flex';
        selectedFlower.querySelector('.scale-handle').style.display = 'flex';
      }
    }

    function saveFlowerState() {
      const flowers = [];
      herbariumCanvas.querySelectorAll('.canvas-flower').forEach(el => {
        flowers.push({
          idx: parseInt(el.dataset.idx),
          x: parseFloat(el.dataset.x || '0'),
          y: parseFloat(el.dataset.y || '0'),
          rotation: parseFloat(el.dataset.rotation || '0'),
          scale: parseFloat(el.dataset.scale || '1.0')
        });
      });
      window.parent.postMessage({ type: 'save_flowers', flowers: flowers }, '*');
    }

    function spawnFlower(idx) {
      // Hide hint text on first spawn
      const hint = $('canvas-hint');
      if (hint) hint.style.display = 'none';

      const flower = document.createElement('div');
      flower.className = 'canvas-flower absolute select-none';
      
      // Default positioning: stack with a slight scatter at center
      const scatterX = Math.random() * 30 - 15;
      const scatterY = Math.random() * 30 - 15;
      const startXVal = (herbariumCanvas.clientWidth - 160) / 2 + scatterX;
      const startYVal = (herbariumCanvas.clientHeight - 260) / 2 + scatterY;
      
      flower.style.width = '160px';
      flower.style.height = '260px';
      flower.style.left = '0px';
      flower.style.top = '0px';
      
      // Custom geometry properties
      flower.dataset.idx = idx;
      flower.dataset.x = startXVal;
      flower.dataset.y = startYVal;
      flower.dataset.rotation = Math.random() * 20 - 10;
      flower.dataset.scale = 1.0;
      
      updateFlowerTransform(flower);

      flower.innerHTML = \`
        <img src="\${flowerDetails[idx].src}" class="w-full h-full object-contain pointer-events-none">
        <div class="selection-box absolute inset-[-4px] border-2 border-dashed border-pink-400 rounded pointer-events-none" style="display:none"></div>
        <button class="delete-btn absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center" style="display:none; z-index:100">×</button>
        <div class="rotate-handle absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-500 text-white rounded-full text-xs flex items-center justify-center cursor-alias" style="display:none; z-index:100">↻</div>
        <div class="scale-handle absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 text-white rounded-full text-[9px] flex items-center justify-center cursor-se-resize" style="display:none; z-index:100">⤢</div>
      \`;

      // Attach Delete click event and interaction listeners only in preview
      if (isPreview) {
        flower.querySelector('.delete-btn').addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          flower.remove();
          if (selectedFlower === flower) selectedFlower = null;
          saveFlowerState();
        });

        // Drag event binding
        flower.addEventListener('pointerdown', (e) => startDrag(e, flower));

        // Rotate handle event binding
        const rotateHandle = flower.querySelector('.rotate-handle');
        rotateHandle.addEventListener('pointerdown', (e) => startRotate(e, flower));

        // Scale handle event binding
        const scaleHandle = flower.querySelector('.scale-handle');
        scaleHandle.addEventListener('pointerdown', (e) => startScale(e, flower));
      }

      // Touch pinch-to-zoom event listeners for mobile/touchscreen
      let initialPinchDistance = 0;
      let flowerStartScale = 1.0;

      flower.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          isPinching = true;
          selectFlowerEl(flower);
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          initialPinchDistance = dist;
          flowerStartScale = parseFloat(flower.dataset.scale || '1.0');
          flower.style.transition = 'none';
        }
      }, { passive: false });

      flower.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialPinchDistance > 0) {
          e.preventDefault();
          const currentDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          let newScale = flowerStartScale * (currentDist / initialPinchDistance);
          newScale = Math.max(0.4, Math.min(2.0, newScale));
          flower.dataset.scale = newScale;
          updateFlowerTransform(flower);
        }
      }, { passive: false });

      flower.addEventListener('touchend', (e) => {
        if (initialPinchDistance > 0) {
          flower.style.transition = '';
          initialPinchDistance = 0;
          isPinching = false;
          saveFlowerState();
        }
      });

      herbariumCanvas.appendChild(flower);
      selectFlowerEl(flower);
      saveFlowerState();

      // Spawn sound trigger or sparkle
      const rect = flower.getBoundingClientRect();
      for (let i = 0; i < 4; i++) {
        spawnHeartSparkleAt(rect.left + 40, rect.top + 65, '✨');
      }
    }

    function updateFlowerTransform(el) {
      const x = parseFloat(el.dataset.x);
      const y = parseFloat(el.dataset.y);
      const rot = parseFloat(el.dataset.rotation);
      const sc = parseFloat(el.dataset.scale || 1.0);
      el.style.transform = \`translate(\${x}px, \${y}px) rotate(\${rot}deg) scale(\${sc})\`;
    }

    function startDrag(e, el) {
      if (
        e.target.closest('.delete-btn') || 
        e.target.closest('.rotate-handle') || 
        e.target.closest('.scale-handle')
      ) return;
      e.preventDefault();
      selectFlowerEl(el);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const flowerStartX = parseFloat(el.dataset.x || '0');
      const flowerStartY = parseFloat(el.dataset.y || '0');

      // Temporarily bypass transition for snap dragging
      el.style.transition = 'none';

      function onDrag(moveEvent) {
        if (isPinching) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        
        el.dataset.x = flowerStartX + dx;
        el.dataset.y = flowerStartY + dy;
        updateFlowerTransform(el);
      }

      function endDrag() {
        el.style.transition = '';
        saveFlowerState();

        document.removeEventListener('pointermove', onDrag);
        document.removeEventListener('pointerup', endDrag);
        document.removeEventListener('pointercancel', endDrag);
      }

      document.addEventListener('pointermove', onDrag);
      document.addEventListener('pointerup', endDrag);
      document.addEventListener('pointercancel', endDrag);
    }

    function startRotate(e, el) {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const flowerCenterX = rect.left + rect.width / 2;
      const flowerCenterY = rect.top + rect.height / 2;

      const startAngle = Math.atan2(e.clientY - flowerCenterY, e.clientX - flowerCenterX) * 180 / Math.PI;
      const flowerStartRotation = parseFloat(el.dataset.rotation || '0');

      el.style.transition = 'none';

      function onRotate(moveEvent) {
        const angle = Math.atan2(moveEvent.clientY - flowerCenterY, moveEvent.clientX - flowerCenterX) * 180 / Math.PI;
        const diff = angle - startAngle;
        
        el.dataset.rotation = flowerStartRotation + diff;
        updateFlowerTransform(el);
      }

      function endRotate() {
        el.style.transition = '';
        saveFlowerState();
        
        document.removeEventListener('pointermove', onRotate);
        document.removeEventListener('pointerup', endRotate);
        document.removeEventListener('pointercancel', endRotate);
      }

      document.addEventListener('pointermove', onRotate);
      document.addEventListener('pointerup', endRotate);
      document.addEventListener('pointercancel', endRotate);
    }

    function startScale(e, el) {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const flowerCenterX = rect.left + rect.width / 2;
      const flowerCenterY = rect.top + rect.height / 2;

      const startDistance = Math.hypot(e.clientY - flowerCenterY, e.clientX - flowerCenterX);
      const flowerStartScale = parseFloat(el.dataset.scale || '1.0');

      el.style.transition = 'none';

      function onScale(moveEvent) {
        const currentDistance = Math.hypot(moveEvent.clientY - flowerCenterY, moveEvent.clientX - flowerCenterX);
        let newScale = flowerStartScale * (currentDistance / startDistance);
        
        // Clamp scale value between 0.4 and 2.0
        newScale = Math.max(0.4, Math.min(2.0, newScale));
        
        el.dataset.scale = newScale;
        updateFlowerTransform(el);
      }

      function endScale() {
        el.style.transition = '';
        saveFlowerState();

        document.removeEventListener('pointermove', onScale);
        document.removeEventListener('pointerup', endScale);
        document.removeEventListener('pointercancel', endScale);
      }

      document.addEventListener('pointermove', onScale);
      document.addEventListener('pointerup', endScale);
      document.addEventListener('pointercancel', endScale);
    }

    // Auto-spawn a gorgeous initial bouquet arrangement on load
    function initDefaultBouquet() {
      // Clear canvas
      herbariumCanvas.querySelectorAll('.canvas-flower').forEach(f => f.remove());
      
      const width = herbariumCanvas.clientWidth || 280;
      const height = herbariumCanvas.clientHeight || 320;

      if (window.PREV_FLOWERS_STATE && window.PREV_FLOWERS_STATE.length > 0) {
        const hint = $('canvas-hint');
        if (hint) hint.style.display = 'none';

        window.PREV_FLOWERS_STATE.forEach(flowerState => {
          const idx = flowerState.idx;
          const flower = document.createElement('div');
          flower.className = 'canvas-flower absolute select-none';
          
          flower.style.width = '160px';
          flower.style.height = '260px';
          flower.style.left = '0px';
          flower.style.top = '0px';
          
          flower.dataset.idx = idx;
          flower.dataset.x = flowerState.x;
          flower.dataset.y = flowerState.y;
          flower.dataset.rotation = flowerState.rotation;
          flower.dataset.scale = flowerState.scale;
          
          updateFlowerTransform(flower);

          flower.innerHTML = \`
            <img src="\${flowerDetails[idx].src}" class="w-full h-full object-contain pointer-events-none">
            <div class="selection-box absolute inset-[-4px] border-2 border-dashed border-pink-400 rounded pointer-events-none" style="display:none"></div>
            <button class="delete-btn absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center" style="display:none; z-index:100">×</button>
            <div class="rotate-handle absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-500 text-white rounded-full text-xs flex items-center justify-center cursor-alias" style="display:none; z-index:100">↻</div>
            <div class="scale-handle absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 text-white rounded-full text-[9px] flex items-center justify-center cursor-se-resize" style="display:none; z-index:100">⤢</div>
          \`;

          // Attach Delete click event and interaction listeners only in preview
          if (isPreview) {
            flower.querySelector('.delete-btn').addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              flower.remove();
              if (selectedFlower === flower) selectedFlower = null;
              saveFlowerState();
            });

            // Drag event binding
            flower.addEventListener('pointerdown', (e) => startDrag(e, flower));

            // Rotate handle event binding
            const rotateHandle = flower.querySelector('.rotate-handle');
            rotateHandle.addEventListener('pointerdown', (e) => startRotate(e, flower));

            // Scale handle event binding
            const scaleHandle = flower.querySelector('.scale-handle');
            scaleHandle.addEventListener('pointerdown', (e) => startScale(e, flower));
          }

          // Touch pinch-to-zoom event listeners for mobile/touchscreen
          let initialPinchDistance = 0;
          let flowerStartScale = 1.0;

          flower.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
              e.preventDefault();
              isPinching = true;
              selectFlowerEl(flower);
              const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
              );
              initialPinchDistance = dist;
              flowerStartScale = parseFloat(flower.dataset.scale || '1.0');
              flower.style.transition = 'none';
            }
          }, { passive: false });

          flower.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinchDistance > 0) {
              e.preventDefault();
              const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
              );
              let newScale = flowerStartScale * (currentDist / initialPinchDistance);
              newScale = Math.max(0.4, Math.min(2.0, newScale));
              flower.dataset.scale = newScale;
              updateFlowerTransform(flower);
            }
          }, { passive: false });

          flower.addEventListener('touchend', (e) => {
            if (initialPinchDistance > 0) {
              flower.style.transition = '';
              initialPinchDistance = 0;
              isPinching = false;
              saveFlowerState();
            }
          });

          herbariumCanvas.appendChild(flower);
        });
        selectFlowerEl(null);
        return;
      }

      // Spawn Lavender (left-slanted)
      spawnFlower(0);
      const f0 = herbariumCanvas.querySelectorAll('.canvas-flower')[0];
      if (f0) {
        f0.dataset.x = (width - 160) / 2 - 30;
        f0.dataset.y = (height - 260) / 2 + 20;
        f0.dataset.rotation = -12;
        f0.dataset.scale = 0.95;
        updateFlowerTransform(f0);
      }

      // Spawn Rose (centered)
      spawnFlower(1);
      const f1 = herbariumCanvas.querySelectorAll('.canvas-flower')[1];
      if (f1) {
        f1.dataset.x = (width - 160) / 2;
        f1.dataset.y = (height - 260) / 2 - 5;
        f1.dataset.rotation = 0;
        f1.dataset.scale = 1.05;
        updateFlowerTransform(f1);
      }

      // Spawn Carnation (right-slanted)
      spawnFlower(2);
      const f2 = herbariumCanvas.querySelectorAll('.canvas-flower')[2];
      if (f2) {
        f2.dataset.x = (width - 160) / 2 + 30;
        f2.dataset.y = (height - 260) / 2 + 20;
        f2.dataset.rotation = 12;
        f2.dataset.scale = 0.95;
        updateFlowerTransform(f2);
      }

      // Clear selection so it looks clean initially
      selectFlowerEl(null);
    }

    // Initialize layout after rendering complete
    setTimeout(initDefaultBouquet, 200);

    // 6. Polaroid stack deck layout & cycle mechanism (Slide out -> move to back -> slide under)
    let activePhotoIndex = 0;
    const totalPhotos = CONFIG.photos.length;

    function renderPhotoStack() {
      if (totalPhotos === 0) return;
      
      for (let idx = 0; idx < totalPhotos; idx++) {
        const card = $('pcard-' + idx);
        if (!card) continue;

        // Reset transforms first
        card.style.transform = '';
        card.style.opacity = '1';

        // Calculate stacked order relative to current active index
        let relativePos = (idx - activePhotoIndex + totalPhotos) % totalPhotos;

        if (relativePos === 0) {
          // Top Active Card - centered on page
          card.style.zIndex = 30;
          card.style.transform = 'scale(1.0) rotate(0deg) translateY(0px) translateX(0px)';
          card.style.pointerEvents = 'auto';
        } else if (relativePos === 1) {
          // Second Card - slightly offset behind
          card.style.zIndex = 20;
          card.style.transform = 'scale(0.94) rotate(4deg) translateY(6px) translateX(4px)';
          card.style.pointerEvents = 'none';
        } else if (relativePos === 2) {
          // Third Card - further offset behind
          card.style.zIndex = 10;
          card.style.transform = 'scale(0.88) rotate(-4deg) translateY(12px) translateX(-4px)';
          card.style.pointerEvents = 'none';
        } else {
          // Rest of cards are hidden below/back
          card.style.zIndex = 5;
          card.style.transform = 'scale(0.8) rotate(0deg) translateY(18px)';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
        }
      }
    }

    function cyclePhoto(idx) {
      if (totalPhotos <= 1) {
        // Zoom single photo directly
        openPhotoModal(CONFIG.photos[idx].src, CONFIG.photos[idx].caption || '');
        return;
      }

      if (idx !== activePhotoIndex) return;

      const card = $('pcard-' + idx);
      if (!card) return;

      // Slide out to the side
      card.style.transform = 'translateX(135%) rotate(12deg) scale(0.95)';
      card.style.opacity = '0';

      setTimeout(() => {
        // Change active index
        activePhotoIndex = (activePhotoIndex + 1) % totalPhotos;
        renderPhotoStack();
      }, 350);
    }

    // Run initial photo stack load
    setTimeout(renderPhotoStack, 100);

    function closePhotoModal() {
      const modal = $('photo-modal');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }

    // 7. Interactive Secret Love Letter Pocket toggle
    let isPocketOpened = false;
    function toggleSecretPocket(pocketEl) {
      const card = $('secret-memo-card');
      if (isPocketOpened) {
        isPocketOpened = false;
        card.style.transform = 'translateY(25px)';
      } else {
        isPocketOpened = true;
        card.style.transform = 'translateY(-110px) rotate(-3deg)';
        
        // Spawn pretty hearts sparkles from pocket opening
        const rect = pocketEl.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
          spawnHeartSparkleAt(rect.left + rect.width / 2, rect.top + 20, '💖');
        }
      }
    }

    // 8. Audio and Music Controllers
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

    // Stop playback functions
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
      if (isBgmPlaying) {
        player.pause();
        isBgmPlaying = false;
        isBgmMuted = true;
        $('bgm-icon').innerText = '🔇';
      } else {
        isBgmMuted = false;
        player.play().catch(e => console.error(e));
        isBgmPlaying = true;
        $('bgm-icon').innerText = '🎵';
      }
    }

    function getVoiceAudio() {
      if (!voiceAudio) voiceAudio = $('audio-el');
      return voiceAudio;
    }

    function toggleAudio() {
      const player = getVoiceAudio();
      if (!player) return;
      
      const icon = $('play-icon');
      if (player.paused) {
        pauseBgm();
        player.play().catch(e => console.error(e));
        isVoicePlaying = true;
        icon.innerText = '⏸';
      } else {
        player.pause();
        isVoicePlaying = false;
        icon.innerText = '▶';
        startBgm();
      }
    }

    function initAudioMetadata() {
      const player = getVoiceAudio();
      if (player) {
        $('audio-time').innerText = formatTime(player.duration || 0);
      }
    }

    function updateAudioProgress() {
      const player = getVoiceAudio();
      if (!player) return;

      const progress = $('audio-progress');
      const time = $('audio-time');

      const pct = (player.currentTime / player.duration) * 100;
      progress.style.width = pct + '%';
      
      time.innerText = formatTime(player.currentTime);

      if (player.ended) {
        $('play-icon').innerText = '▶';
        isVoicePlaying = false;
        progress.style.width = '0%';
        startBgm();
      }
    }

    function seekAudio(e) {
      const player = getVoiceAudio();
      if (!player) return;
      const timeline = $('mini-timeline');
      const rect = timeline.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      player.currentTime = pct * player.duration;
    }

    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // 9. Interactive Floating Hearts/Sparkles
    function spawnHeartSparkle(event) {
      if (
        event.target.closest('button') || 
        event.target.closest('input') || 
        event.target.closest('.polaroid-card') || 
        event.target.closest('.canvas-flower')
      ) {
        return;
      }
      const char = ['❤', '🌸', '✨', '💕'][Math.floor(Math.random() * 4)];
      spawnHeartSparkleAt(event.clientX, event.clientY, char);
    }

    function spawnHeartSparkleAt(x, y, char) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-float';
      sparkle.innerText = char;
      
      const dx = (Math.random() * 100 - 50) + 'px';
      sparkle.style.setProperty('--dx', dx);
      sparkle.style.left = (x - 12) + 'px';
      sparkle.style.top = (y - 12) + 'px';
      
      const hue = Math.floor(Math.random() * 30) + 330; // warm pinks
      sparkle.style.color = 'hsl(' + hue + ', 95%, 65%)';
      
      document.body.appendChild(sparkle);
      setTimeout(() => { sparkle.remove(); }, 1200);
    }
  </script>
</body>
</html>`;
}
