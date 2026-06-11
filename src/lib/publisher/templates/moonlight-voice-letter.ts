import { PublishedConfig } from "../../schemas/card-draft";

export function generateMoonlightVoiceLetterHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Under the Moonlight";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Under the Moon - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            elegant: ['"Pinyon Script"', 'cursive'],
            serif: ['Lora', 'serif'],
            sans: ['Montserrat', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom CSS animations and styles */
    body {
      background: linear-gradient(to bottom, #03071e 0%, #0d1b2a 50%, #1b263b 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #e0e1dd;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(13, 27, 42, 0.5);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(224, 225, 221, 0.3);
      border-radius: 3px;
    }

    /* Twinkling Star background */
    .star {
      position: absolute;
      background: #ffffff;
      border-radius: 50%;
      pointer-events: none;
      animation: twinkle linear infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Glowing Moon style */
    .moon-button {
      position: relative;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e1dd 70%, #778da9 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 30px rgba(255,255,255,0.4),
        0 0 70px rgba(224,225,221,0.2),
        inset -10px -10px 20px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
    }
    .moon-button:hover {
      transform: scale(1.05);
      box-shadow: 
        0 0 45px rgba(255,255,255,0.6),
        0 0 100px rgba(224,225,221,0.3);
    }
    .moon-button.clicked {
      transform: scale(3);
      opacity: 0;
      pointer-events: none;
    }

    /* Moonlight glass card */
    .moonlight-card {
      background: rgba(13, 27, 42, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(224, 225, 221, 0.15);
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Twinkling Stars Container -->
  <div id="stars-container" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- SECTION 1: COSMETIC SECRET CODE -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md moonlight-card rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-yellow-100 text-3xl mb-4 shadow-inner">
        🌙
      </div>
      <h2 class="font-serif text-2xl font-semibold text-white mb-2">Moonlight Letter</h2>
      <p class="text-sm text-gray-400 font-sans">Ada surat berbisik dari <span class="font-semibold text-yellow-200">${config.fromName}</span> untuk <span class="font-semibold text-yellow-200">${config.toName}</span>. Masukkan sandi pembuka.</p>
    </div>
    
    <div class="space-y-4 font-sans">
      <input 
        type="password" 
        id="secret-code-input" 
        placeholder="Sandi Rahasia" 
        maxlength="12"
        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 uppercase tracking-widest placeholder:tracking-normal placeholder:font-normal"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-gradient-to-r from-yellow-200 to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg transition-all"
      >
        Buka Surat
      </button>
      <p id="code-error" class="text-xs text-yellow-200 opacity-0 transition-opacity font-medium">Sandi tidak cocok. Coba cek kodenya lagi.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: GLOWING MOON REVEAL -->
  <div id="moon-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex flex-col items-center justify-center z-10 transition-all duration-700">
    <div class="text-center mb-12">
      <h3 class="font-elegant text-5xl text-yellow-200 mb-1">Dear ${
        config.toName
      }</h3>
      <p class="font-sans text-[10px] uppercase tracking-widest opacity-80 text-yellow-100/60">Pesan senyap di bawah cahaya bulan</p>
    </div>
    
    <div id="moon" class="moon-button" onclick="openMoon()"></div>
    
    <div class="text-center mt-12">
      <span class="font-sans text-[10px] uppercase tracking-widest text-yellow-100/60 animate-pulse">Ketuk Bulan untuk Menerangi</span>
    </div>
  </div>

  <!-- SECTION 3: MOONLIGHT CONTENT -->
  <div id="content-section" class="hidden w-full max-w-2xl moonlight-card rounded-3xl p-6 sm:p-10 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    <!-- Letter Header -->
    <div class="text-center border-b border-white/10 pb-6 mb-8">
      <h1 class="font-serif text-3xl text-yellow-100 mb-2">${letterTitle}</h1>
      <div class="flex items-center justify-between text-xs font-semibold text-yellow-200/70 uppercase tracking-widest px-2 font-sans">
        <span>Untuk: ${config.toName}</span>
        <span>Dari: ${config.fromName}</span>
      </div>
    </div>

    <!-- Letter Body (Typewriter effect) -->
    <div class="font-serif text-gray-200 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[120px]" id="letter-body-content"></div>

    <!-- Photos Grid (Glowing borders) -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <h3 class="font-serif text-lg text-center text-yellow-200/80 mb-4">Galeri Sunyi</h3>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    </div>

    <!-- Voice Note Section (Primary Highlight) -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 transition-opacity duration-1000 opacity-0">
      <h4 class="font-serif text-sm text-yellow-200/80 mb-4 text-center flex items-center justify-center gap-2 font-sans">
        <span>🎙</span> Bisikan Suara Malam Ini
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4 font-sans">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-yellow-200 hover:bg-yellow-300 text-slate-950 flex items-center justify-center shadow-lg transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-white/10 rounded-full cursor-pointer" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-yellow-200 rounded-full w-0" id="audio-progress"></div>
          </div>
          <div class="flex justify-between text-xs text-yellow-200/60 mt-2 font-medium">
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
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t border-white/10 transition-opacity duration-1000 opacity-0">
      <p class="font-elegant text-5xl text-yellow-200 mb-2">${config.finalMessage}</p>
      <p class="text-[9px] font-semibold uppercase tracking-widest text-yellow-100/40 font-sans">Di Bawah Langit Malam Yang Sama</p>
    </div>
    `
        : ""
    }

    <!-- Footer branding -->
    <div class="text-center mt-10 text-[9px] font-semibold text-yellow-100/30 uppercase tracking-widest font-sans">
      Made with DearNote
    </div>
  </div>

  <script>
    const config = {
      secretCode: "${config.secretCode || ""}",
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote}
    };

    // 1. Generate Twinkling Stars
    const starsContainer = document.getElementById('stars-container');
    
    function createStar() {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 2 + 1;
      const top = Math.random() * window.innerHeight;
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 4;
      
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.top = top + 'px';
      star.style.left = left + 'px';
      star.style.animationDuration = duration + 's';
      star.style.animationDelay = delay + 's';
      
      starsContainer.appendChild(star);
    }
    
    // Create stars based on window size
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    for (let i = 0; i < starCount; i++) {
      createStar();
    }

    // 2. Code Validation
    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');
      
      if (input === actualCode) {
        const codeSection = document.getElementById('code-section');
        codeSection.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          codeSection.remove();
          const moonSection = document.getElementById('moon-section');
          moonSection.classList.remove('hidden');
          moonSection.classList.add('flex');
        }, 500);
      } else {
        errorMsg.classList.remove('opacity-0');
        const inputEl = document.getElementById('secret-code-input');
        inputEl.classList.add('border-yellow-400', 'animate-bounce');
        setTimeout(() => { inputEl.classList.remove('animate-bounce'); }, 500);
      }
    }

    // Enter key support for secret code
    if (document.getElementById('secret-code-input')) {
      document.getElementById('secret-code-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verifyCode();
      });
    }

    // 3. Moon Expand Reveal
    let isMoonOpened = false;
    function openMoon() {
      if (isMoonOpened) return;
      isMoonOpened = true;
      
      const moon = document.getElementById('moon');
      moon.classList.add('clicked');
      
      setTimeout(() => {
        const moonSection = document.getElementById('moon-section');
        moonSection.classList.add('opacity-0');
        
        setTimeout(() => {
          moonSection.remove();
          const contentSection = document.getElementById('content-section');
          contentSection.classList.remove('hidden');
          setTimeout(() => {
            contentSection.classList.remove('opacity-0', 'translate-y-10');
            startTypewriter();
          }, 50);
        }, 600);
      }, 500);
    }

    // 4. Elegant Typewriter effect
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 40; // Slightly slower for nighttime atmosphere
      
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

    // 5. Reveal Gallery & Audio with Glows
    function revealExtraSections() {
      // 1. Photos
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');
        
        config.photos.forEach(photo => {
          const item = document.createElement('div');
          item.className = 'flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-inner p-3 transform transition hover:scale-[1.02] duration-300 hover:border-yellow-200/20';
          
          // Image
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory';
          img.className = 'w-full h-48 object-cover rounded-xl mb-3 opacity-90 hover:opacity-100 transition';
          item.appendChild(img);
          
          // Caption
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-serif text-sm text-center text-slate-300 italic px-2';
            cap.innerText = photo.caption;
            item.appendChild(cap);
          }
          
          grid.appendChild(item);
        });
        
        gallery.classList.remove('hidden');
        setTimeout(() => { gallery.classList.add('opacity-100'); }, 100);
      }
      
      // 2. Voice note
      if (config.hasVoiceNote) {
        const voice = document.getElementById('voice-section');
        voice.classList.remove('hidden');
        setTimeout(() => { voice.classList.add('opacity-100'); }, 300);
      }
      
      // 3. Final message
      const finalMsg = document.getElementById('final-message-container');
      if (finalMsg) {
        finalMsg.classList.remove('hidden');
        setTimeout(() => { finalMsg.classList.add('opacity-100'); }, 500);
      }
    }

    // 6. Audio Player Logic
    let audio = null;
    let isPlaying = false;
    
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
      } else {
        player.play().catch(e => console.error("Audio error:", e));
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
