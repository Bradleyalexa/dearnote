import { PublishedConfig } from "../../schemas/card-draft";

export function generateNocturnalJournalHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Nocturnal Log";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";

  // Background music check
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nocturnal Journal - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['Lora', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom CSS animations and styles */
    body {
      background: linear-gradient(to bottom, #09090b 0%, #18181b 50%, #27272a 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #f4f4f5;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(9, 9, 11, 0.5);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(244, 244, 245, 0.2);
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
      0%, 100% { opacity: 0.15; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.2); }
    }

    /* Glowing Moon style */
    .moon-button {
      position: relative;
      width: 130px;
      height: 130px;
      background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f4f4f5 70%, #a1a1aa 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 30px rgba(255,255,255,0.25),
        0 0 70px rgba(244,244,245,0.12),
        inset -10px -10px 20px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
    }
    .moon-button:hover {
      transform: scale(1.05);
      box-shadow: 
        0 0 45px rgba(255,255,255,0.4),
        0 0 100px rgba(244,244,245,0.2);
    }
    .moon-button.clicked {
      transform: scale(3);
      opacity: 0;
      pointer-events: none;
    }

    /* Moonlight glass card */
    .moonlight-card {
      background: rgba(24, 24, 27, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(244, 244, 245, 0.1);
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Floating BGM Toggle Button -->
  ${
    hasBgMusic
      ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center text-zinc-300 hover:bg-white/10 transition-all" title="Matikan Musik Latar">
    <span id="bgm-icon" class="text-sm">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  `
      : ""
  }

  <!-- Twinkling Stars Container -->
  <div id="stars-container" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- SECTION 1: CODE LOCK ACCESS SCREEN -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md moonlight-card rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-zinc-200 text-2xl mb-4 shadow-inner">
        🌙
      </div>
      <h2 class="font-serif text-2xl font-semibold text-white mb-2">Nocturnal Journal</h2>
      <p class="text-xs text-zinc-400 font-sans">Ada sebuah catatan jurnal dari <span class="font-semibold text-zinc-200">${config.fromName}</span> untuk <span class="font-semibold text-zinc-200">${config.toName}</span>. Masukkan kode akses.</p>
    </div>
    
    <div class="space-y-4 font-sans">
      <input 
        type="password" 
        id="secret-code-input" 
        placeholder="Kode Akses" 
        maxlength="12"
        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 uppercase tracking-widest text-sm"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-zinc-200 hover:bg-white text-zinc-900 font-bold rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
      >
        Buka Notes
      </button>
      <p id="code-error" class="text-xs text-zinc-400 opacity-0 transition-opacity font-semibold">Kode tidak cocok. Silakan coba kembali.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: GLOWING MOON REVEAL -->
  <div id="moon-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex flex-col items-center justify-center z-10 transition-all duration-700 px-4">
    <div class="text-center mb-12">
      <h3 class="font-serif text-3xl text-zinc-200 mb-2 break-words">Kepada: ${config.toName}</h3>
      <p class="font-sans text-[10px] uppercase tracking-widest opacity-80 text-zinc-400 break-words">Jurnal Kenangan Dari ${config.fromName}</p>
    </div>
    
    <div id="moon" class="moon-button" onclick="openMoon()"></div>
    
    <div class="text-center mt-12">
      <span class="font-sans text-[9px] uppercase tracking-widest text-zinc-500 animate-pulse">Ketuk Bulan untuk Membuka</span>
    </div>
  </div>

  <!-- SECTION 3: MOONLIGHT CONTENT -->
  <div id="content-section" class="hidden w-full max-w-2xl moonlight-card rounded-3xl p-6 sm:p-10 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    <!-- Letter Header -->
    <div class="text-center border-b border-white/10 pb-6 mb-8">
      <h1 class="font-serif text-3xl text-white mb-2">${letterTitle}</h1>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 font-sans text-center sm:text-left">
        <span class="break-all sm:break-normal">Untuk: ${config.toName}</span>
        <span class="break-all sm:break-normal">Dari: ${config.fromName}</span>
      </div>
    </div>

    <!-- Letter Body (Typewriter effect) -->
    <div class="font-serif text-zinc-200 leading-loose text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[120px]" id="letter-body-content"></div>

    <!-- Photos Grid (Glowing borders) -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center border-t border-white/10 pt-8 pb-4">
        <h3 class="font-serif text-lg text-white">Lampiran Foto Kenangan</h3>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    </div>

    <!-- Voice Note Section (Primary Highlight) -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 transition-opacity duration-1000 opacity-0">
      <h4 class="font-serif text-sm text-zinc-300 mb-4 text-center flex items-center justify-center gap-2 font-sans">
        <span>🎙</span> Jurnal Pesan Suara
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4 font-sans">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-zinc-200 hover:bg-white text-zinc-950 flex items-center justify-center shadow-lg transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-white/10 rounded-full cursor-pointer" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-zinc-200 rounded-full w-0" id="audio-progress"></div>
          </div>
          <div class="flex justify-between text-[10px] text-zinc-400 font-bold uppercase mt-2">
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
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t border-white/10 transition-opacity duration-1000 opacity-0 font-serif">
      <p class="text-2xl italic text-zinc-200 mb-2">"${config.finalMessage}"</p>
      <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-sans">Catatan Selesai</p>
    </div>
    `
        : ""
    }

    <!-- Footer branding -->
    <div class="text-center mt-10 text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-sans border-t border-white/5 pt-4">
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

    // 1. Generate Twinkling Stars
    const starsContainer = document.getElementById('stars-container');
    
    function createStar() {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 2 + 0.5;
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
    
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
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
        // Start BGM on user interaction
        playBgm();
        setTimeout(() => {
          codeSection.remove();
          const moonSection = document.getElementById('moon-section');
          moonSection.classList.remove('hidden');
          moonSection.classList.add('flex');
        }, 500);
      } else {
        errorMsg.classList.remove('opacity-0');
        const inputEl = document.getElementById('secret-code-input');
        inputEl.classList.add('border-red-400', 'animate-bounce');
        setTimeout(() => { inputEl.classList.remove('animate-bounce'); }, 500);
      }
    }

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
      
      // Start BGM on user interaction
      playBgm();
      
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

    // 5. Reveal Gallery & Audio
    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');
        
        config.photos.forEach(photo => {
          const item = document.createElement('div');
          item.className = 'flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-inner p-3 transform transition hover:scale-[1.01] duration-300 hover:border-zinc-500/20';
          
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory Photo';
          img.className = 'w-full h-48 object-cover rounded-xl mb-3 opacity-90';
          item.appendChild(img);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-sans text-xs text-center text-zinc-400 italic px-2';
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
