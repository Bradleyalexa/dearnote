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
      background: linear-gradient(to bottom, #050508 0%, #0d0d12 40%, #151520 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #f4f4f5;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(5, 5, 8, 0.5);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(244, 244, 245, 0.2);
      border-radius: 3px;
    }

    /* Orbit System around moon cover */
    .moon-system {
      position: relative;
      width: 260px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .orbit-ring {
      position: absolute;
      border: 1px dashed rgba(255, 255, 255, 0.12);
      border-radius: 50%;
      pointer-events: none;
      animation: rotateRing linear infinite;
    }
    .orbit-ring-1 {
      width: 170px;
      height: 170px;
      animation-duration: 25s;
    }
    .orbit-ring-2 {
      width: 210px;
      height: 210px;
      border: 1px dashed rgba(244, 210, 160, 0.1);
      animation-duration: 40s;
      animation-direction: reverse;
    }
    .orbit-ring-3 {
      width: 250px;
      height: 250px;
      animation-duration: 60s;
    }
    @keyframes rotateRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Glowing Moon style */
    .moon-button {
      width: 120px;
      height: 120px;
      background: radial-gradient(circle at 35% 35%, #ffffff 0%, #eaeaea 40%, #c8c8cb 75%, #8e8e93 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 40px rgba(255, 255, 255, 0.4), 
        0 0 80px rgba(255, 255, 255, 0.15),
        inset -12px -12px 25px rgba(0, 0, 0, 0.25),
        inset 4px 4px 10px rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 2.0s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 15;
    }
    .moon-button:hover {
      transform: scale(1.08);
      box-shadow: 
        0 0 55px rgba(255,255,255,0.6),
        0 0 110px rgba(244, 210, 160, 0.25),
        inset -8px -8px 20px rgba(0, 0, 0, 0.2);
    }
    .moon-button.clicked {
      transform: scale(3.5);
      opacity: 0;
      pointer-events: none;
    }

    /* Moonlight glass card */
    .moonlight-card {
      background: rgba(12, 12, 16, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.6), 
        inset 0 1px 1px rgba(255, 255, 255, 0.1),
        0 0 80px rgba(99, 102, 241, 0.04);
    }
    .moonlight-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), rgba(244, 210, 160, 0.4), transparent);
      z-index: 10;
    }

    /* Equalizer Soundwave bars */
    .bar {
      display: inline-block;
      width: 3px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.35);
      border-radius: 2px;
      transition: height 0.1s ease, background-color 0.2s ease;
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

  <!-- Twinkling Starry Canvas Background -->
  <canvas id="starry-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>

  <!-- SECTION 1: CODE LOCK ACCESS SCREEN -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md moonlight-card rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-zinc-200 text-2xl mb-4 shadow-inner border border-white/5">
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
    <div class="text-center mb-6">
      <h3 class="font-serif text-3xl text-zinc-200 mb-2 break-words">Kepada: ${config.toName}</h3>
      <p class="font-sans text-[10px] uppercase tracking-widest opacity-80 text-zinc-400 break-words">Jurnal Kenangan Dari ${config.fromName}</p>
    </div>
    
    <!-- Moon and its concentric orbits -->
    <div class="moon-system">
      <div class="orbit-ring orbit-ring-1"></div>
      <div class="orbit-ring orbit-ring-2"></div>
      <div class="orbit-ring orbit-ring-3"></div>
      <div id="moon" class="moon-button" onclick="openMoon()"></div>
    </div>
    
    <div class="text-center mt-6">
      <span class="font-sans text-[9px] uppercase tracking-widest text-zinc-500 animate-pulse">Ketuk Bulan untuk Membuka</span>
    </div>
  </div>

  <!-- SECTION 3: MOONLIGHT CONTENT -->
  <div id="content-section" class="hidden w-full max-w-2xl moonlight-card rounded-3xl p-6 sm:p-10 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    <!-- Letter Header -->
    <div class="text-center border-b border-white/15 pb-6 mb-8">
      <h1 class="font-serif text-3xl sm:text-4xl text-white tracking-tight mb-4">${letterTitle}</h1>
      <div class="flex flex-col gap-1.5 items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 font-sans">
        <div class="flex flex-wrap items-center justify-center gap-1">
          <span class="text-zinc-500 font-medium">Spesial Untuk:</span>
          <span class="text-white font-semibold break-words max-w-[240px] sm:max-w-md">${config.toName}</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-1">
          <span class="text-zinc-500 font-medium">Jurnal Dari:</span>
          <span class="text-white font-semibold break-words max-w-[240px] sm:max-w-md">${config.fromName}</span>
        </div>
      </div>
    </div>

    <!-- Letter Body (Typewriter effect) -->
    <div class="font-serif text-zinc-200 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[120px]" id="letter-body-content"></div>

    <!-- Photos Grid (Glowing borders) -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center border-t border-white/10 pt-8 pb-4">
        <h3 class="font-serif text-lg text-white">Lampiran Foto Kenangan</h3>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    </div>

    <!-- Voice Note Section -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 transition-opacity duration-1000 opacity-0">
      <h4 class="font-serif text-sm text-zinc-350 mb-4 text-center flex items-center justify-center gap-2 font-sans">
        <span>🎙️</span> Jurnal Pesan Suara
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-5 font-sans">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center shadow-lg transition-all focus:outline-none transform active:scale-95">
          <span id="play-icon" class="text-lg ml-0.5">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-white/10 rounded-full cursor-pointer group" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-zinc-200 to-white rounded-full w-0 transition-all duration-75 relative" id="audio-progress">
              <!-- Glow indicator -->
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-zinc-400 font-bold uppercase mt-2.5 tracking-wider">
            <span id="current-time">0:00</span>
            <span id="duration">0:00</span>
          </div>
        </div>
        <!-- Glowing soundwave equalizer -->
        <div class="flex items-center gap-1 h-8 px-3 py-1 bg-white/5 rounded-lg border border-white/5" id="equalizer">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
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

    // 1. Starry Canvas Background & Interactive Constellations
    const canvas = document.getElementById('starry-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let mouse = { x: null, y: null, radius: 90 };
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }
    
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.alpha = Math.random();
        this.dir = Math.random() > 0.5 ? 1 : -1;
      }
      
      update() {
        this.alpha += this.twinkleSpeed * this.dir;
        if (this.alpha > 0.95) {
          this.alpha = 0.95;
          this.dir = -1;
        } else if (this.alpha < 0.1) {
          this.alpha = 0.1;
          this.dir = 1;
        }
      }
      
      draw() {
        ctx.fillStyle = \`rgba(255, 255, 255, \${this.alpha})\`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    function initStars() {
      stars = [];
      const density = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < density; i++) {
        stars.push(new Star());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw constellations (lines connecting close stars)
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
        
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 70) {
            ctx.strokeStyle = \`rgba(226, 232, 240, \${0.08 * (1 - dist / 70)})\`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
        
        // Interactive golden threads to cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = stars[i].x - mouse.x;
          const dy = stars[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.strokeStyle = \`rgba(244, 210, 160, \${0.15 * (1 - dist / mouse.radius)})\`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    });
    window.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    resizeCanvas();
    animate();

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
        }, 1000);
      }, 1500);
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

    // 6. Audio Player & Equalizer Logic
    let audio = null;
    let isPlaying = false;
    let eqInterval = null;

    function startEqualizer() {
      const bars = document.querySelectorAll('.bar');
      eqInterval = setInterval(() => {
        bars.forEach(bar => {
          const height = Math.floor(Math.random() * 24) + 4; // random 4px to 28px
          bar.style.height = height + 'px';
          bar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          bar.style.boxShadow = '0 0 8px rgba(255,255,255,0.4)';
        });
      }, 100);
    }

    function stopEqualizer() {
      if (eqInterval) {
        clearInterval(eqInterval);
        eqInterval = null;
      }
      const bars = document.querySelectorAll('.bar');
      bars.forEach(bar => {
        bar.style.height = '4px';
        bar.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
        bar.style.boxShadow = 'none';
      });
    }
    
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
        stopEqualizer();
        playBgm();
      } else {
        pauseBgm();
        player.play().catch(e => console.error(e));
        playIcon.innerText = '⏸';
        isPlaying = true;
        startEqualizer();
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
        stopEqualizer();
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
