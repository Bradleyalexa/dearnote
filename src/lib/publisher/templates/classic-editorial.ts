import { PublishedConfig } from "../../schemas/card-draft";

export function generateClassicEditorialHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Special Note For You";
  
  // Format the letter body to preserve line breaks
  const escapedLetterBody = JSON.stringify(config.letterBody);
  
  // Photo items rendering
  const photosJson = JSON.stringify(config.photos);
  
  // Voice note check
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
  <title>A Keepsake Note - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            lora: ['Lora', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom CSS animations and styles */
    body {
      background-color: #f7f4eb; /* Warm cream linen base */
      background-image: 
        linear-gradient(90deg, rgba(139, 115, 85, 0.03) 1px, transparent 1px),
        linear-gradient(rgba(139, 115, 85, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
        linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px);
      background-size: 8px 8px, 8px 8px, 3px 3px, 3px 3px;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(24, 24, 27, 0.02);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(197, 168, 128, 0.45);
      border-radius: 3px;
    }
    
    /* Elegant glowing embers */
    .ember {
      position: absolute;
      background: radial-gradient(circle, rgba(245, 190, 100, 0.9) 0%, rgba(212, 175, 55, 0.35) 50%, rgba(139, 115, 85, 0) 100%);
      box-shadow: 0 0 8px rgba(245, 190, 100, 0.6), 0 0 16px rgba(212, 175, 55, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      animation: riseAndFlicker linear infinite;
    }
    @keyframes riseAndFlicker {
      0% {
        transform: translateY(110vh) translateX(0) scale(0.5);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      50% {
        transform: translateY(50vh) translateX(15px) scale(1.1);
        opacity: 0.9;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-10vh) translateX(-15px) scale(0.6);
        opacity: 0;
      }
    }
    
    /* Envelope styling */
    .envelope-wrapper {
      position: relative;
      width: 340px;
      height: 220px;
      background-color: #52525B; /* zinc-600 */
      border-radius: 0 0 8px 8px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.5s ease;
      z-index: 10;
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
      border-top: 110px solid #3F3F46; /* zinc-700 */
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
      border-left: 170px solid #71717A; /* zinc-500 */
      border-right: 170px solid #71717A;
      border-bottom: 110px solid #71717A;
      border-radius: 0 0 8px 8px;
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
      background: #FAF9F6;
      border: 1px solid rgba(197, 168, 128, 0.2);
      border-radius: 4px;
      padding: 20px;
      z-index: 15;
      transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      transform: translateY(0);
      box-shadow: 0 -5px 15px rgba(0,0,0,0.03);
    }
    .envelope-wrapper.card-up .envelope-card {
      transform: translateY(-130px);
      z-index: 35;
    }
    
    /* Wax seal 3D realistic styling & breaking effect */
    .wax-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 64px;
      height: 64px;
      transform: translate(-50%, -50%);
      z-index: 40;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.3s ease;
    }
    .wax-seal:hover {
      transform: translate(-50%, -50%) scale(1.08);
    }
    .wax-seal-half {
      position: absolute;
      top: 0;
      width: 33px;
      height: 64px;
      background: radial-gradient(circle at center, #e2c28a 0%, #aa820a 60%, #755502 100%);
      box-shadow: 
        0 6px 14px rgba(0, 0, 0, 0.3), 
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset -1px -2px 4px rgba(0, 0, 0, 0.4);
      transition: all 1.8s cubic-bezier(0.25, 1, 0.5, 1);
      border: 1px solid #aa820a;
    }
    .wax-seal-half.left {
      left: 0;
      border-radius: 32px 0 0 32px;
      clip-path: polygon(0% 0%, 100% 0%, 85% 30%, 100% 50%, 80% 70%, 100% 100%, 0% 100%);
      border-right: none;
    }
    .wax-seal-half.right {
      right: 0;
      border-radius: 0 32px 32px 0;
      clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 70%, 20% 50%, 0% 30%);
      border-left: none;
      box-shadow: 
        0 6px 14px rgba(0, 0, 0, 0.3), 
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset 2px -2px 4px rgba(0, 0, 0, 0.4);
    }
    .wax-seal-stamp {
      position: absolute;
      top: 0;
      left: 0;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 0 2px 4px rgba(0,0,0,0.6);
      pointer-events: none;
      z-index: 45;
      transition: all 0.5s ease;
    }
    /* Splitting effect */
    .envelope-wrapper.open .wax-seal-half.left {
      transform: translateX(-40px) translateY(-10px) rotate(-35deg);
      opacity: 0;
    }
    .envelope-wrapper.open .wax-seal-half.right {
      transform: translateX(40px) translateY(10px) rotate(35deg);
      opacity: 0;
    }
    .envelope-wrapper.open .wax-seal-stamp {
      transform: scale(0.5);
      opacity: 0;
    }
    
    /* Keepsake Card - Textured Cardstock & Gold Double Frame */
    .keepsake-card {
      background-color: #fffdf9;
      background-image: 
        linear-gradient(90deg, rgba(197, 168, 128, 0.02) 1px, transparent 1px),
        linear-gradient(rgba(197, 168, 128, 0.02) 1px, transparent 1px);
      background-size: 4px 4px;
      box-shadow: 
        0 30px 70px rgba(27, 23, 19, 0.08), 
        0 10px 30px rgba(27, 23, 19, 0.04),
        inset 0 0 40px rgba(197, 168, 128, 0.05);
      border: 1px solid rgba(197, 168, 128, 0.25);
      position: relative;
    }
    .keepsake-card::after {
      content: "";
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      bottom: 12px;
      border: 3px double #c5a880; /* Burnished gold-leaf double border */
      pointer-events: none;
      border-radius: 20px;
      box-shadow: inset 0 0 10px rgba(197, 168, 128, 0.15);
    }
    .accent-border {
      border: 1px solid rgba(197, 168, 128, 0.3);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Floating Dust Container -->
  <div id="dust-container" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- Floating BGM Toggle Button -->
  ${
    hasBgMusic
      ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#c5a880]/30 shadow-md flex items-center justify-center text-amber-900/70 hover:bg-white hover:text-amber-900 transition-all" title="Mute Background Music">
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
  <div id="code-section" class="w-full max-w-md keepsake-card rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100 border border-[#c5a880]/20">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-2xl mb-4 shadow-sm">
        🔒
      </div>
      <h2 class="font-lora text-2xl font-semibold text-amber-950 mb-2">Enter Access Code</h2>
      <p class="text-xs text-amber-800/70 font-medium">A special note awaits you. Please enter the access code to open it.</p>
    </div>
    
    <div class="space-y-4">
      <input 
        type="text" 
        id="secret-code-input" 
        placeholder="Passkey" 
        maxlength="12"
        class="w-full px-4 py-3 rounded-xl border border-amber-200/60 bg-[#fffdf9] text-center font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase tracking-widest placeholder:tracking-normal placeholder:font-normal text-sm"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider"
      >
        Unlock Note
      </button>
      <p id="code-error" class="text-xs text-red-650 opacity-0 transition-opacity font-semibold">Incorrect code. Please try again.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: ENVELOPE OPENING UX -->
  <div id="envelope-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex-col items-center justify-center z-10 transition-all duration-500 px-4">
    <div class="text-center mb-8">
      <h3 class="font-lora text-2xl font-semibold text-amber-950 mb-1.5 break-words px-4">For: ${config.toName}</h3>
      <p class="text-[10px] text-amber-800/60 font-bold uppercase tracking-widest">A Keepsake Note</p>
    </div>
    
    <div id="envelope" class="envelope-wrapper" onclick="openEnvelope()">
      <div class="wax-seal">
        <div class="wax-seal-half left"></div>
        <div class="wax-seal-half right"></div>
        <div class="wax-seal-stamp">⚜️</div>
      </div>
      <div class="envelope-card flex flex-col justify-between items-center text-center p-4">
        <div class="my-auto">
          <span class="block text-[10px] text-amber-800/60 uppercase font-bold tracking-widest mb-1.5">From</span>
          <span class="font-lora text-lg font-medium text-zinc-750 break-words w-full px-2 block leading-relaxed">${config.fromName}</span>
        </div>
        <span class="text-[9px] uppercase font-bold tracking-widest text-amber-650/80 animate-pulse">Tap to Open</span>
      </div>
    </div>
  </div>

  <!-- SECTION 3: MAIN LETTER CONTENT -->
  <div id="letter-section" class="hidden w-full max-w-2xl keepsake-card rounded-3xl p-6 sm:p-10 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10 border border-zinc-100">
    
    <!-- Letter Header -->
    <div class="text-center border-b border-amber-850/10 pb-6 mb-8">
      <h1 class="font-lora text-3xl sm:text-4xl font-semibold text-amber-950 tracking-tight mb-4">${letterTitle}</h1>
      <div class="flex flex-col gap-1.5 items-center justify-center text-[10px] font-bold text-amber-900/60 uppercase tracking-widest px-2">
        <div class="flex flex-wrap items-center justify-center gap-1">
          <span class="text-amber-800/50 font-medium">For:</span>
          <span class="text-amber-950 font-bold break-words max-w-[240px] sm:max-w-md">${config.toName}</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-1">
          <span class="text-amber-800/50 font-medium">From:</span>
          <span class="text-amber-950 font-bold break-words max-w-[240px] sm:max-w-md">${config.fromName}</span>
        </div>
      </div>
    </div>

    <!-- Letter Body (Typewriter effect container) -->
    <div class="font-lora text-zinc-850 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[120px]" id="letter-body-content"></div>

    <!-- Photos Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center border-t border-amber-850/10 pt-8 pb-4">
        <h3 class="font-lora text-xl font-semibold text-amber-950">Captured Memories</h3>
        <p class="text-[9px] text-amber-800/50 font-bold uppercase tracking-widest mt-1">Our Story in Pictures</p>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
    </div>

    <!-- Voice Note Section -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-[#fdfcf7] border border-[#d4af37]/35 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm transition-opacity duration-1000 opacity-0">
      <h4 class="font-lora text-sm font-semibold text-amber-900/95 mb-4 text-center flex items-center justify-center gap-2">
        <span class="text-amber-700">🎙️</span> Voice Message
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Custom Audio Player UI with Gold Accent -->
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa820a] hover:from-[#e5c158] hover:to-[#c59b27] text-white flex items-center justify-center shadow-md hover:shadow-lg transform active:scale-95 transition-all focus:outline-none">
          <span id="play-icon" class="text-lg ml-0.5">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-zinc-200/75 rounded-full cursor-pointer group" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] rounded-full w-0 transition-all duration-75 relative" id="audio-progress">
              <!-- Dot on end of progress -->
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#d4af37] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-amber-900/60 font-bold uppercase tracking-wider mt-2.5 font-sans">
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

    <!-- Final Message -->
    ${
      config.finalMessage
        ? `
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t border-amber-850/10 transition-opacity duration-1000 opacity-0">
      <p class="font-lora text-2xl italic text-amber-950 mb-2">"${config.finalMessage}"</p>
      <p class="text-[9px] font-bold uppercase tracking-wider text-amber-800/50">Warmest Regards</p>
    </div>
    `
        : ""
    }

    <!-- Footer branding -->
    <div class="text-center mt-8 text-[9px] font-bold text-amber-800/40 uppercase tracking-widest border-t border-amber-850/5 pt-4">
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

    // 1. Generate Floating Golden Embers
    const dustContainer = document.getElementById('dust-container');
    
    function createEmber() {
      const ember = document.createElement('div');
      ember.classList.add('ember');
      
      const size = Math.random() * 5 + 3; // 3px to 8px
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 12 + 8; // Slower rise: 8s to 20s
      const delay = Math.random() * 5;
      
      ember.style.width = size + 'px';
      ember.style.height = size + 'px';
      ember.style.left = left + 'px';
      ember.style.animationDuration = duration + 's';
      ember.style.animationDelay = delay + 's';
      
      dustContainer.appendChild(ember);
      
      setTimeout(() => {
        ember.remove();
      }, (duration + delay) * 1000);
    }
    
    // Spawn initial embers
    for (let i = 0; i < 20; i++) {
      createEmber();
    }
    setInterval(createEmber, 600);

    // 2. Secret Code Validation
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
          const envSection = document.getElementById('envelope-section');
          envSection.classList.remove('hidden');
          envSection.classList.add('flex');
        }, 500);
      } else {
        errorMsg.classList.remove('opacity-0');
        const inputEl = document.getElementById('secret-code-input');
        inputEl.classList.add('border-red-400', 'animate-bounce');
        setTimeout(() => {
          inputEl.classList.remove('animate-bounce');
        }, 500);
      }
    }

    if (document.getElementById('secret-code-input')) {
      document.getElementById('secret-code-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          verifyCode();
        }
      });
    }

    // 3. Envelope Unfolding Animation
    let isEnvelopeOpened = false;
    function openEnvelope() {
      if (isEnvelopeOpened) return;
      isEnvelopeOpened = true;
      
      // Start BGM on user interaction
      playBgm();
      
      const envelope = document.getElementById('envelope');
      // Step 1: Open wax seal and flap
      envelope.classList.add('open');
      
      // Step 2: Pull card up
      setTimeout(() => {
        envelope.classList.add('card-up');
      }, 1000);
      
      // Step 3: Transition to main letter
      setTimeout(() => {
        const envSection = document.getElementById('envelope-section');
        envSection.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
          envSection.remove();
          const letterSection = document.getElementById('letter-section');
          letterSection.classList.remove('hidden');
          setTimeout(() => {
            letterSection.classList.remove('opacity-0', 'translate-y-10');
            // Start typewriter right as the section begins to fade in
            startTypewriter();
          }, 50);
        }, 1000);
      }, 2600);
    }

    // 4. Typewriter Animation
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 25;
      
      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (index < limit) {
          container.innerHTML += text.charAt(index);
          index++;
          if (index % 4 === 0 && window.innerHeight + window.scrollY < document.body.offsetHeight - 50) {
            window.scrollTo(0, document.body.scrollHeight);
          }
          setTimeout(type, speed);
        } else if (text.length > 1000) {
          const remaining = text.substring(index);
          const span = document.createElement('span');
          span.style.opacity = '0';
          span.style.transition = 'opacity 1.0s ease-in-out';
          span.innerHTML = remaining;
          container.appendChild(span);
          setTimeout(() => { span.style.opacity = '1'; }, 50);
          revealExtraSections();
        } else {
          revealExtraSections();
        }
      }
      type();
    }

    // 5. Reveal Extra Sections
    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');
        
        config.photos.forEach(photo => {
          const item = document.createElement('div');
          item.className = 'flex flex-col bg-[#fffdfa] border border-[#c5a880]/20 rounded-xl overflow-hidden shadow-sm p-3 transform transition hover:scale-[1.01] duration-300';
          
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory Photo';
          img.className = 'w-full h-48 sm:h-60 object-cover rounded-lg mb-2';
          
          item.appendChild(img);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-sans text-xs text-center text-amber-900/60 italic px-2 py-1';
            cap.innerText = photo.caption;
            item.appendChild(cap);
          }
          grid.appendChild(item);
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
        setTimeout(() => { finalMsg.classList.add('opacity-100'); }, 600);
      }
    }

    // 6. Custom Audio Player
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
      if (!audio) {
        audio = document.getElementById('audio-element');
      }
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

