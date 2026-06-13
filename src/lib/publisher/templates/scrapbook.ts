import { PublishedConfig } from "../../schemas/card-draft";

export function generateScrapbookHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Memory Log";
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
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Special+Elite&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            handwritten: ['Caveat', 'cursive'],
            typewriter: ['"Special Elite"', 'monospace'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom CSS animations and styles */
    body {
      background-color: #F5EBE0;
      background-image: radial-gradient(#E3D5CA 1.5px, transparent 1.5px);
      background-size: 24px 24px;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(227, 213, 202, 0.2);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(213, 189, 175, 0.7);
      border-radius: 3px;
    }

    /* Polaroid card scatter & drag styling */
    .polaroid {
      background: #FFFFFF;
      padding: 12px 12px 24px 12px;
      box-shadow: 
        0 8px 25px rgba(0, 0, 0, 0.08),
        0 2px 6px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0,0,0,0.02);
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
      background-image: radial-gradient(rgba(0, 0, 0, 0.1) 0.5px, transparent 0.5px);
      background-size: 3px 3px;
      opacity: 0.15;
      pointer-events: none;
    }

    /* Paper texture for scrapbook paper */
    .scrapbook-paper {
      background-color: #FEFAE0;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(221, 190, 169, 0.12) 2.5px, transparent 2.5px);
      background-size: 100% 28px, 100% 100%;
      line-height: 28px !important;
      border: 1px solid #e1b37f;
      box-shadow: 
        0 15px 40px rgba(96, 108, 56, 0.08),
        inset 0 0 30px rgba(221, 190, 169, 0.15);
    }

    /* Tactile torn paper Washi Tape */
    .tape {
      position: absolute;
      background-color: rgba(221, 190, 169, 0.65);
      background-image: 
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 2px, transparent 2px, transparent 10px),
        linear-gradient(to right, rgba(0,0,0,0.02), rgba(255,255,255,0.05));
      backdrop-filter: blur(1.5px);
      -webkit-backdrop-filter: blur(1.5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      /* Jagged torn edges */
      clip-path: polygon(
        0% 8%, 10% 2%, 25% 9%, 40% 1%, 55% 8%, 70% 3%, 85% 9%, 100% 4%,
        98% 50%, 100% 92%, 88% 97%, 72% 91%, 58% 99%, 42% 93%, 28% 98%, 12% 90%, 0% 96%
      );
      transform: rotate(-3deg);
      pointer-events: none;
      z-index: 20;
    }
    .tape-floral {
      background-color: rgba(180, 195, 160, 0.65); /* Sage green floral style B */
      background-image: 
        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 2px, transparent 3px),
        radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25) 3px, transparent 4px);
    }
    .tape-amber {
      background-color: rgba(222, 171, 108, 0.65);
    }

    /* Cover page folder */
    .scrapbook-cover {
      position: relative;
      width: 320px;
      height: 440px;
      background: #8b7d6b;
      background-image: 
        radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
        linear-gradient(135deg, #a39684 0%, #756756 100%);
      background-size: 4px 4px, 100% 100%;
      border-radius: 8px 24px 24px 8px;
      box-shadow: 
        15px 20px 45px rgba(0,0,0,0.25),
        inset 3px 0 10px rgba(255,255,255,0.15),
        inset -5px -5px 15px rgba(0,0,0,0.2);
      transition: transform 2.0s cubic-bezier(0.4, 0, 0.2, 1), opacity 2.0s ease;
      transform-origin: left center;
      border: 1px solid #635647;
    }
    .scrapbook-cover:hover {
      transform: perspective(1000px) rotateY(-12deg) rotateX(2deg);
    }

    /* Scrapbook Cover Leather Spine */
    .scrapbook-spine {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 42px;
      background: linear-gradient(to right, #403427 0%, #5c4c3b 70%, #403427 100%);
      box-shadow: 
        inset -1px 0 5px rgba(0,0,0,0.3),
        3px 0 10px rgba(0,0,0,0.2);
      border-radius: 8px 0 0 8px;
      border-right: 2px dashed rgba(255, 255, 255, 0.15);
      z-index: 12;
    }
    .scrapbook-spine::after {
      content: "";
      position: absolute;
      top: 0;
      left: 14px;
      bottom: 0;
      width: 14px;
      background: repeating-linear-gradient(rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 15px);
    }
    
    /* Scrapbook Cover Stitching */
    .scrapbook-stitching {
      position: absolute;
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 52px;
      border: 1.5px dashed rgba(255, 255, 255, 0.18);
      border-radius: 0 18px 18px 0;
      pointer-events: none;
      z-index: 11;
    }

    /* Brass Corners */
    .brass-corner {
      position: absolute;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #dfba73 0%, #b88e3d 50%, #8c651b 100%);
      box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
      z-index: 15;
    }
    .corner-tr {
      top: 0;
      right: 0;
      border-radius: 0 24px 0 0;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
    }
    .corner-br {
      bottom: 0;
      right: 0;
      border-radius: 0 0 24px 0;
      clip-path: polygon(0 100%, 100% 0, 100% 100%, 0 100%);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Floating BGM Toggle Button -->
  ${
    hasBgMusic
      ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-[#E5D3C0]/85 backdrop-blur-sm border border-[#D5C2B0] shadow-md flex items-center justify-center text-zinc-700 hover:bg-[#D8C4B0] transition-all" title="Mute Background Music">
    <span id="bgm-icon" class="text-sm">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  `
      : ""
  }

  <!-- SECTION 1: CODE LOCK ACCESS SCREEN -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md bg-white border border-[#DDA15E]/30 rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100 shadow-xl">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5EBE0] text-[#7C7267] text-2xl mb-4 shadow-sm border border-[#D5C2B0]/30">
        🔒
      </div>
      <h2 class="font-typewriter text-xl font-bold text-gray-800 mb-2">Access Journal</h2>
      <p class="text-xs text-gray-500 font-sans">A memory log from <span class="font-semibold text-[#7C7267]">${config.fromName}</span> to <span class="font-semibold text-[#7C7267]">${config.toName}</span>. Enter the code to open it.</p>
    </div>
    
    <div class="space-y-4 font-sans">
      <input 
        type="text" 
        id="secret-code-input" 
        placeholder="Access Code" 
        maxlength="12"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 text-center font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C7267] uppercase tracking-widest text-sm"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-[#7C7267] hover:bg-[#6A6056] text-white font-semibold rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
      >
        Open Scrapbook
      </button>
      <p id="code-error" class="text-xs text-red-500 opacity-0 transition-opacity font-semibold">Incorrect code, please try again.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: SCRAPBOOK COVER OPENING -->
  <div id="cover-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex-col items-center justify-center z-10 transition-all duration-500">
    <div id="scrapbook-cover" class="scrapbook-cover flex flex-col justify-between p-8 text-white relative" onclick="openScrapbook()">
      <!-- spine details -->
      <div class="scrapbook-spine"></div>
      <div class="scrapbook-stitching"></div>
      <div class="brass-corner corner-tr"></div>
      <div class="brass-corner corner-br"></div>
      
      <div class="self-end border-b border-white/20 pb-2 text-right z-10 pl-12">
        <span class="font-sans text-[10px] uppercase tracking-widest font-bold opacity-80">Memory Scrapbook</span>
      </div>
      
      <div class="text-center my-auto px-4 z-10 pl-12">
        <h3 class="font-handwritten text-4xl sm:text-5xl font-bold mb-2 break-words">For: ${config.toName}</h3>
        <p class="font-sans text-xs uppercase tracking-widest opacity-80 break-words">A memory keepsake from ${config.fromName}</p>
      </div>
      
      <div class="text-center border-t border-white/20 pt-4 z-10 pl-12">
        <span class="font-sans text-[9px] uppercase tracking-widest font-bold animate-pulse">Tap Journal to Open</span>
      </div>
    </div>
  </div>

  <!-- SECTION 3: SCRAPBOOK CONTENT -->
  <div id="scrapbook-section" class="hidden w-full max-w-3xl my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    
    <!-- Handwriting Letter Card -->
    <div class="scrapbook-paper rounded-2xl p-6 sm:p-10 mb-8 relative overflow-hidden">
      <!-- Tape Effect -->
      <div class="tape tape-floral top-[-8px] left-[30%] w-24 h-6"></div>
      <div class="tape tape-amber bottom-[-8px] right-[20%] w-20 h-6"></div>

      <!-- Letter Header -->
      <div class="border-b border-dashed border-[#DDA15E]/60 pb-6 mb-6 font-handwritten text-3xl text-gray-800">
        <div class="flex flex-col gap-2.5 items-center justify-center text-center">
          <div class="flex flex-col sm:flex-row items-center gap-1.5 justify-center">
            <span class="text-gray-500/70 text-lg sm:text-xl font-normal">For:</span>
            <span class="font-bold break-words max-w-[240px] sm:max-w-md">${config.toName}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-1.5 justify-center">
            <span class="text-gray-500/70 text-lg sm:text-xl font-normal">From:</span>
            <span class="font-bold break-words max-w-[240px] sm:max-w-md">${config.fromName}</span>
          </div>
        </div>
      </div>

      <!-- Typewriter / Handwriting content -->
      <div class="font-handwritten text-gray-800 text-2xl sm:text-3xl leading-loose min-h-[140px]" id="letter-body-content"></div>

      <!-- Final Message -->
      ${
        config.finalMessage
          ? `
      <div id="final-message-container" class="hidden font-handwritten text-3xl text-center text-[#7C7267] font-bold mt-10 pt-6 border-t border-dashed border-[#DDA15E]/60 transition-opacity duration-1000 opacity-0">
        "${config.finalMessage}"
      </div>
      `
          : ""
      }
    </div>

    <!-- Polaroid Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center relative py-4 mb-2">
        <div class="tape top-0 left-[45%] w-16 h-5 opacity-70"></div>
        <h3 class="font-handwritten text-4xl font-bold text-gray-800">Captured Memories</h3>
        <p class="font-sans text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-2">Tap & drag photos to rearrange them</p>
      </div>
      <!-- Drag & Toss Workspace -->
      <div id="polaroid-grid" class="flex flex-wrap items-center justify-center gap-8 py-8 min-h-[300px] relative"></div>
    </div>

    <!-- Voice Note Section -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-white/70 border border-[#DDA15E]/30 rounded-2xl p-4 sm:p-6 mb-8 shadow-md relative transition-opacity duration-1000 opacity-0">
      <!-- Tape effect -->
      <div class="tape top-[-6px] left-[10%] w-16 h-5"></div>
      
      <h4 class="font-handwritten text-2xl font-bold text-gray-800 mb-4 text-center">
        🔊 Play Voice Message
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4 font-sans">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-[#7C7267] hover:bg-[#6A6056] text-white flex items-center justify-center shadow-md transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-gray-200 rounded-full cursor-pointer" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-[#7C7267] rounded-full w-0" id="audio-progress"></div>
          </div>
          <div class="flex justify-between text-xs text-zinc-400 font-semibold mt-2">
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
    <div class="text-center mt-12 mb-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
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

    // 2. Open Scrapbook Animation
    let isCoverOpened = false;
    function openScrapbook() {
      if (isCoverOpened) return;
      isCoverOpened = true;
      
      // Start BGM on user interaction
      playBgm();
      
      const cover = document.getElementById('scrapbook-cover');
      cover.style.transform = 'perspective(1000px) rotateY(-150deg)';
      cover.style.opacity = '0';
      
      setTimeout(() => {
        const coverSection = document.getElementById('cover-section');
        coverSection.classList.add('opacity-0');
        
        setTimeout(() => {
          coverSection.remove();
          const scrapbookSection = document.getElementById('scrapbook-section');
          scrapbookSection.classList.remove('hidden');
          setTimeout(() => {
            scrapbookSection.classList.remove('opacity-0', 'translate-y-10');
            startTypewriter();
          }, 50);
        }, 1000);
      }, 1800);
    }

    // 3. Handwritten Typewriter effect
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 30;
      
      function type() {
        if (index < text.length) {
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

      function dragEnd() {
        if (!active) return;
        active = false;
        element.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15)";
        element.style.transform = "translate3d(" + xOffset + "px, " + yOffset + "px, 0px) rotate(" + initialRotation + "deg)";
        element.style.zIndex = "40"; // remain stacked above un-dragged cards
      }

      window.addEventListener("mousemove", dragMove, { passive: false });
      window.addEventListener("touchmove", dragMove, { passive: false });
      window.addEventListener("mouseup", dragEnd);
      window.addEventListener("touchend", dragEnd);
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
          const tapeClasses = ['tape-floral', 'tape-amber', ''];
          const tapeClass = tapeClasses[idx % tapeClasses.length];
          const tape = document.createElement('div');
          tape.className = "tape " + tapeClass + " absolute w-16 h-5 opacity-80";
          tape.style.top = '-10px';
          tape.style.left = '35%';
          tape.style.transform = 'rotate(' + (Math.random() * 8 - 4) + 'deg)';
          item.appendChild(tape);

          const imgContainer = document.createElement('div');
          imgContainer.className = 'polaroid-img-container w-full h-48 overflow-hidden rounded border border-gray-100';

          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory';
          img.className = 'w-full h-full object-cover transition duration-300 hover:scale-105';
          
          imgContainer.appendChild(img);
          item.appendChild(imgContainer);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-handwritten text-2xl text-center text-gray-700 italic mt-3 leading-tight px-1';
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
      
      if (isPlaying) {
        player.pause();
        playIcon.innerText = '▶';
        isPlaying = false;
        playBgm();
      } else {
        pauseBgm();
        player.play().catch(e => console.error(e));
        playIcon.innerText = '⏸';
        isPlaying = true;
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