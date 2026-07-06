import { PublishedConfig } from "../../schemas/card-draft";

export function generateGiftBoxRevealHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Gift For You";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gift Box - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            script: ['Caveat', 'cursive'],
            serif: ['"Playfair Display"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle at center, #1E1214 0%, #0F090A 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #FAF5F0;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(212, 175, 55, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(212, 175, 55, 0.3);
      border-radius: 3px;
    }

    /* Floating Gold Sparkles */
    .sparkle {
      position: absolute;
      pointer-events: none;
      background: radial-gradient(circle, rgba(255,223,128,1) 0%, rgba(212,175,55,0.4) 60%, rgba(0,0,0,0) 100%);
      border-radius: 50%;
      animation: floatUp 6s infinite ease-in-out;
      z-index: 1;
    }

    @keyframes floatUp {
      0% {
        transform: translateY(105vh) translateX(0) scale(0.6);
        opacity: 0;
      }
      20% {
        opacity: 0.8;
      }
      80% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-10vh) translateX(20px) scale(1);
        opacity: 0;
      }
    }

    /* Gift Box Container */
    .gift-box-wrapper {
      position: relative;
      width: 240px;
      height: 240px;
      margin: 0 auto;
      z-index: 10;
    }

    .gift-box-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    /* Idle animation for the box */
    .gift-box-container.idle {
      animation: boxFloat 3s infinite ease-in-out;
    }

    @keyframes boxFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-8px) scale(1.02); }
    }

    /* Box Body */
    .gift-body {
      width: 200px;
      height: 170px;
      background: linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 0 0 16px 16px;
      box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.6), 
        inset 0 0 20px rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 5;
    }

    .body-ribbon {
      position: absolute;
      width: 32px;
      height: 100%;
      left: calc(50% - 16px);
      top: 0;
      background: linear-gradient(90deg, #D4AF37 0%, #F3E5AB 35%, #D4AF37 65%, #AA7C11 100%);
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.2);
    }

    /* Box Lid */
    .gift-lid {
      width: 216px;
      height: 42px;
      background: linear-gradient(135deg, #991B1B 0%, #5E0F0F 100%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 8px 8px 4px 4px;
      box-shadow: 
        0 4px 10px rgba(0, 0, 0, 0.3),
        inset 0 0 10px rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 164px;
      z-index: 10;
      transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease;
    }

    .lid-ribbon {
      position: absolute;
      width: 32px;
      height: 100%;
      left: calc(50% - 16px);
      top: 0;
      background: linear-gradient(90deg, #D4AF37 0%, #F3E5AB 35%, #D4AF37 65%, #AA7C11 100%);
    }

    /* Bow on top */
    .gift-bow {
      position: absolute;
      width: 100px;
      height: 50px;
      bottom: 202px;
      z-index: 15;
      transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
      cursor: pointer;
    }

    .bow-loop-l, .bow-loop-r {
      position: absolute;
      width: 44px;
      height: 44px;
      background: radial-gradient(circle, #F3E5AB 0%, #D4AF37 70%, #AA7C11 100%);
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .bow-loop-l {
      left: 12px;
      border-radius: 50% 50% 0 50%;
      transform: rotate(-15deg);
    }

    .bow-loop-r {
      right: 12px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(15deg);
    }

    .bow-knot {
      position: absolute;
      width: 22px;
      height: 22px;
      left: calc(50% - 11px);
      top: 11px;
      background: radial-gradient(circle, #FFF 0%, #D4AF37 80%, #AA7C11 100%);
      border-radius: 50%;
      box-shadow: 0 3px 6px rgba(0,0,0,0.4);
      z-index: 2;
    }

    /* Glow Effect inside box */
    .magic-glow {
      position: absolute;
      width: 180px;
      height: 180px;
      left: 10px;
      top: -10px;
      background: radial-gradient(circle, rgba(253,224,71,0.8) 0%, rgba(234,88,12,0.3) 50%, rgba(0,0,0,0) 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.8s ease, transform 0.8s ease;
      z-index: 4;
      border-radius: 50%;
    }

    /* Untying / Opening states */
    .opening .gift-bow {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }

    .opening .gift-lid {
      transform: translateY(-100px) rotate(-12deg) scale(0.9);
      opacity: 0;
    }

    .opening .magic-glow {
      opacity: 1;
      transform: scale(1.4);
      animation: pulseGlow 1.5s infinite alternate;
    }

    @keyframes pulseGlow {
      0% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1.5); opacity: 1; }
    }

    /* Content reveal animation */
    .letter-card {
      background: linear-gradient(180deg, #FCFBF7 0%, #FAF6EE 100%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      color: #27272A !important; /* High contrast text color */
      box-shadow: 
        0 25px 55px rgba(0,0,0,0.5),
        0 0 0 1px rgba(212, 175, 55, 0.1) inset;
    }

    .letter-card h1, .letter-card p, .letter-card h3, .letter-card div {
      color: #27272A !important;
    }

    .fade-up-enter {
      opacity: 0;
      transform: translateY(50px) scale(0.96);
    }

    .fade-up-active {
      opacity: 1;
      transform: translateY(0) scale(1);
      transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    }
  </style>
</head>
<body class="flex flex-col items-center justify-start py-8 px-4 relative min-h-screen">

  <!-- Sparkle Particle Canvas -->
  <canvas id="sparkle-canvas" class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>

  ${hasBgMusic ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-yellow-500/30 shadow-lg flex items-center justify-center text-yellow-400 hover:bg-white/20 transition-all" title="Toggle Music">
    <span id="bgm-icon" class="text-sm">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- Passcode Screen (If secret code is set) -->
  ${hasSecretCode ? `
  <div id="code-section" class="w-full max-w-md letter-card rounded-2xl p-8 text-center z-10 my-auto transition-all duration-700">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-2xl mb-4 shadow-lg">
        🎁
      </div>
      <h2 class="font-serif text-2xl font-bold text-zinc-900 mb-2 tracking-wide">Enter Secret Code</h2>
      <p class="text-xs text-zinc-500 font-medium">This gift box is locked with a special code. Enter it to open.</p>
    </div>

    <div class="space-y-4">
      <input
        type="text"
        id="secret-code-input"
        placeholder="ACCESS CODE"
        maxlength="12"
        class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-center font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 uppercase tracking-widest text-sm transition-all shadow-inner"
      >
      <button
        onclick="verifyCode()"
        class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider border border-yellow-500/20"
      >
        Unlock Gift
      </button>
      <p id="code-error" class="text-xs text-red-500 opacity-0 transition-opacity font-semibold">Incorrect code. Please try again.</p>
    </div>
  </div>
  ` : ""}

  <!-- Gift Box Opening Screen -->
  <div id="gift-box-section" class="${hasSecretCode ? 'hidden' : 'flex'} flex-col items-center justify-center z-10 my-auto transition-all duration-1000 w-full">
    <div class="text-center mb-8">
      <h3 class="font-script text-4xl text-yellow-300 mb-1 drop-shadow-md">Especially for You:</h3>
      <h2 class="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-wide">${config.toName}</h2>
      <p class="text-[10px] text-yellow-500/60 font-bold uppercase tracking-widest mt-1">Touch the gift to open your message</p>
    </div>

    <!-- 2.5D Interactive Gift Box -->
    <div class="gift-box-wrapper" id="ribbon" onclick="openGiftBox()">
      <div class="gift-box-container idle" id="gift-box">
        <!-- Bow on top -->
        <div class="gift-bow">
          <div class="bow-loop-l"></div>
          <div class="bow-loop-r"></div>
          <div class="bow-knot"></div>
        </div>

        <!-- Box Lid -->
        <div class="gift-lid">
          <div class="lid-ribbon"></div>
        </div>

        <!-- Box Body -->
        <div class="gift-body">
          <div class="body-ribbon"></div>
          
          <!-- Magic Golden Glow Rays inside -->
          <div class="magic-glow"></div>
        </div>
      </div>
    </div>

    <button onclick="openGiftBox()" class="mt-10 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-yellow-500/30 rounded-full text-xs font-semibold uppercase tracking-widest text-yellow-300 transition-all flex items-center gap-2 shadow-lg animate-pulse">
      <span>🎁</span> Open Keepsake Box
    </button>
  </div>

  <!-- Main Letter Content Screen (Hidden Initially) -->
  <div id="content-section" class="hidden w-full max-w-2xl letter-card rounded-[2rem] p-6 sm:p-10 my-8 z-10 fade-up-enter">
    
    <!-- Header of the Card -->
    <div class="text-center border-b border-zinc-200 pb-6 mb-8 relative">
      <div class="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-3 shadow-sm">
        <p class="text-xs font-bold text-yellow-850 uppercase tracking-wider">From: ${config.fromName}</p>
      </div>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">${letterTitle}</h1>
      <div class="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-16 h-[1px] bg-yellow-600/40"></div>
    </div>

    <!-- Letter Body (Typewritten) -->
    <div class="font-serif text-zinc-800 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[100px] border-b border-dashed border-zinc-200 pb-8" id="letter-body-content"></div>

    <!-- Polaroid Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 opacity-0">
      <div class="text-center pt-2 pb-4">
        <h3 class="font-serif text-xl font-bold text-zinc-800 tracking-wide">Memory Gallery</h3>
        <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Moments We Shared</p>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    </div>

    <!-- Custom Voice Note Section -->
    ${hasVoiceNote ? `
    <div id="voice-section" class="hidden bg-yellow-50/70 border border-yellow-500/20 rounded-2xl p-5 sm:p-6 mb-8 opacity-0 shadow-sm">
      <h4 class="font-serif text-sm font-semibold text-yellow-900 mb-4 text-center flex items-center justify-center gap-2">
        <span>🎙️</span> Voice Message
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white flex items-center justify-center shadow-md transition-all">
          <span id="play-icon" class="text-lg ml-0.5">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-yellow-950/10 rounded-full cursor-pointer group" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full w-0 transition-all duration-75" id="audio-progress">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-yellow-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-yellow-950/50 font-bold mt-2.5">
            <span id="current-time">0:00</span>
            <span id="duration">0:00</span>
          </div>
        </div>
        <audio id="audio-element" src="${voiceNoteSrc}" ontimeupdate="updateProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
    </div>
    ` : ""}

    <!-- Final Message (Handwritten Script style) -->
    ${config.finalMessage ? `
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t border-zinc-200 opacity-0">
      <p class="font-script text-3xl sm:text-4xl text-yellow-800 mb-2 drop-shadow-sm">"${config.finalMessage}"</p>
      <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Created with Love on DearNote</p>
    </div>
    ` : ""}

    <!-- Elegant Signature Footer -->
    <div class="text-center mt-8 text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-t border-zinc-150 pt-4">
      DearNote Gift Box • Signature Series
    </div>
  </div>

  <script>
    const config = {
      secretCode: "${config.secretCode || ""}",
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote}
    };

    let bgmAudio = null;
    let isBgmPlaying = false;
    let isBgmMuted = false;

    // Sparkle Particle Effect
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class SparkleParticle {
      constructor(x, y, isExplosion = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || (isExplosion ? canvas.height * 0.45 : canvas.height + 20);
        this.size = Math.random() * 3 + 1;
        this.speedX = isExplosion ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
        this.speedY = isExplosion ? (Math.random() - 0.8) * 8 : -Math.random() * 1.5 - 0.8;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.color = ['#FFF', '#F3E5AB', '#D4AF37', '#FFD700', '#F59E0B'][Math.floor(Math.random() * 5)];
        this.life = isExplosion ? Math.random() * 60 + 40 : 9999;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.01;
        this.life--;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      for (let i = 0; i < 40; i++) {
        particles.push(new SparkleParticle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove dead explosion particles or out-of-screen regular particles
        if (particles[i].y < -20 || particles[i].life <= 0 || particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
          // Replenish ambient particles
          if (particles.filter(p => p.life > 1000).length < 40) {
            particles.push(new SparkleParticle());
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function triggerBoxExplosion() {
      const box = document.getElementById('gift-box');
      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 150; i++) {
        particles.push(new SparkleParticle(centerX, centerY, true));
      }
    }

    function getBgmAudio() {
      if (!bgmAudio) bgmAudio = document.getElementById('bgm-audio-element');
      return bgmAudio;
    }

    function playBgm() {
      const player = getBgmAudio();
      if (player && !isBgmMuted) {
        player.play().catch(e => console.error("BGM blocked:", e));
        isBgmPlaying = true;
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
        player.play().catch(e => console.error(e));
        isBgmPlaying = true;
      } else {
        isBgmMuted = true;
        if (icon) icon.innerText = '🔇';
        player.pause();
        isBgmPlaying = false;
      }
    }

    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');

      if (input === actualCode) {
        const codeSection = document.getElementById('code-section');
        codeSection.classList.add('scale-95', 'opacity-0');
        playBgm();
        setTimeout(() => {
          codeSection.remove();
          const giftSection = document.getElementById('gift-box-section');
          giftSection.classList.remove('hidden');
          giftSection.classList.add('flex');
        }, 600);
      } else {
        errorMsg.classList.remove('opacity-0');
        const inputEl = document.getElementById('secret-code-input');
        inputEl.classList.add('border-red-400', 'animate-shake');
        setTimeout(() => inputEl.classList.remove('animate-shake'), 500);
      }
    }

    if (document.getElementById('secret-code-input')) {
      document.getElementById('secret-code-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verifyCode();
      });
    }

    let isOpened = false;
    function openGiftBox() {
      if (isOpened) return;
      isOpened = true;

      // Start BGM
      playBgm();

      const boxContainer = document.getElementById('gift-box');
      boxContainer.classList.remove('idle');
      boxContainer.classList.add('opening');

      // Trigger sparkling particles explosion
      setTimeout(() => {
        triggerBoxExplosion();
      }, 300);

      // Fade out the gift box section and slide in content
      setTimeout(() => {
        const giftSection = document.getElementById('gift-box-section');
        giftSection.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
          giftSection.remove();
          const contentSection = document.getElementById('content-section');
          contentSection.classList.remove('hidden');
          
          // Smooth slide and fade up
          setTimeout(() => {
            contentSection.classList.add('fade-up-active');
            contentSection.classList.remove('fade-up-enter');
            
            // Start typewriter reveal
            setTimeout(startTypewriter, 500);
          }, 50);
        }, 800);
      }, 2000);
    }

    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 25; // Slower, premium speed

      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (index < limit) {
          container.innerHTML += text.charAt(index);
          index++;
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

    function revealExtraSections() {
      // 1. Reveal Photos
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');

        config.photos.forEach((photo, idx) => {
          const item = document.createElement('div');
          // Premium Polaroid Style Photo Frame
          item.className = 'flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-md p-4 rotate-' + (idx % 2 === 0 ? '1' : '-1') + ' hover:rotate-0 hover:scale-[1.02] transition-all duration-500';

          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memories';
          img.className = 'w-full aspect-[4/3] object-cover rounded-lg shadow-inner';

          item.appendChild(img);

          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-serif text-sm text-center text-zinc-650 italic mt-3 pt-1 border-t border-zinc-100';
            cap.innerText = photo.caption;
            item.appendChild(cap);
          }
          grid.appendChild(item);
        });

        gallery.classList.remove('hidden');
        setTimeout(() => {
          gallery.style.transition = 'opacity 1s ease';
          gallery.classList.add('opacity-100');
        }, 100);
      }

      // 2. Reveal Voice Note
      if (config.hasVoiceNote) {
        const voice = document.getElementById('voice-section');
        voice.classList.remove('hidden');
        setTimeout(() => {
          voice.style.transition = 'opacity 1s ease';
          voice.classList.add('opacity-100');
        }, 400);
      }

      // 3. Reveal Final Handwritten Message
      const finalMsg = document.getElementById('final-message-container');
      if (finalMsg) {
        finalMsg.classList.remove('hidden');
        setTimeout(() => {
          finalMsg.style.transition = 'opacity 1.2s ease';
          finalMsg.classList.add('opacity-100');
        }, 700);
      }
    }

    // Custom Audio Player Implementation
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
