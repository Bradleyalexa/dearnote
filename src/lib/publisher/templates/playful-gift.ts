import { PublishedConfig } from "../../schemas/card-draft";

export function generatePlayfulGiftHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Sweet Surprise for You!";
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
  <title>Cute Surprise - DearNote</title>
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
      background: linear-gradient(135deg, #FFE5EC 0%, #F0E6FF 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #3D2C47;
      font-family: 'Quicksand', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 182, 193, 0.2);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 182, 193, 0.6);
      border-radius: 3px;
    }

    /* Playful Wobble Idle Animation for the Box */
    .playful-box-container {
      position: relative;
      width: 220px;
      height: 220px;
      margin: 0 auto;
      z-index: 10;
    }

    .gift-box-playful {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
    }

    .gift-box-playful.idle {
      animation: boxBounceWobble 2.5s infinite ease-in-out;
    }

    @keyframes boxBounceWobble {
      0%, 100% {
        transform: translateY(0) scale(1) rotate(0deg);
      }
      30% {
        transform: translateY(-12px) scale(0.98, 1.04) rotate(-3deg);
      }
      50% {
        transform: translateY(0) scale(1.04, 0.96) rotate(3deg);
      }
      70% {
        transform: translateY(-4px) scale(0.99, 1.01) rotate(-1deg);
      }
    }

    /* Box Body (Strawberry Pink) */
    .gift-body {
      width: 170px;
      height: 140px;
      background: linear-gradient(135deg, #FF85A2 0%, #FF6B8B 100%);
      border: 4px solid #FFF;
      border-radius: 20px;
      box-shadow: 
        0 12px 25px rgba(255, 107, 139, 0.35),
        inset -6px -6px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      z-index: 5;
    }

    .body-ribbon {
      position: absolute;
      width: 28px;
      height: 100%;
      left: calc(50% - 14px);
      top: 0;
      background: #B3F5FC;
      border-left: 4px solid #FFF;
      border-right: 4px solid #FFF;
    }

    /* Box Lid */
    .gift-lid {
      width: 186px;
      height: 38px;
      background: linear-gradient(135deg, #FFA6C9 0%, #FF85A2 100%);
      border: 4px solid #FFF;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      position: absolute;
      bottom: 132px;
      z-index: 10;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
    }

    .lid-ribbon {
      position: absolute;
      width: 28px;
      height: 100%;
      left: calc(50% - 14px);
      top: 0;
      background: #B3F5FC;
      border-left: 4px solid #FFF;
      border-right: 4px solid #FFF;
    }

    /* Puffy Bow */
    .gift-bow {
      position: absolute;
      width: 90px;
      height: 50px;
      bottom: 166px;
      z-index: 15;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
    }

    .bow-loop-l, .bow-loop-r {
      position: absolute;
      width: 40px;
      height: 40px;
      background: #B3F5FC;
      border: 4px solid #FFF;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .bow-loop-l {
      left: 10px;
      border-radius: 50% 50% 0 50%;
      transform: rotate(-10deg);
    }

    .bow-loop-r {
      right: 10px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(10deg);
    }

    .bow-knot {
      position: absolute;
      width: 20px;
      height: 20px;
      left: calc(50% - 10px);
      top: 10px;
      background: #FFF;
      border: 4px solid #B3F5FC;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      z-index: 2;
    }

    /* Glow Effect inside box */
    .magic-glow {
      position: absolute;
      width: 140px;
      height: 140px;
      left: 15px;
      top: -10px;
      background: radial-gradient(circle, rgba(179,245,252,0.8) 0%, rgba(255,242,117,0.3) 50%, rgba(0,0,0,0) 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease, transform 0.5s ease;
      z-index: 4;
      border-radius: 50%;
    }

    /* Bouncy Opening States */
    .opening .gift-bow {
      transform: scale(0) translateY(-60px) rotate(-90deg);
      opacity: 0;
    }

    .opening .gift-lid {
      transform: translateY(-120px) rotate(25deg) scale(0.8);
      opacity: 0;
    }

    .opening .magic-glow {
      opacity: 1;
      transform: scale(1.5);
    }

    /* Content reveal layout */
    .playful-card {
      background: #FFFFFF;
      border: 6px solid #FFF;
      outline: 6px dashed #FFCCD5;
      color: #4A3E56;
      box-shadow: 
        0 20px 40px rgba(255, 182, 193, 0.4),
        0 4px 10px rgba(0,0,0,0.05);
    }

    /* Elastic slide-up for content */
    .bounce-up-enter {
      opacity: 0;
      transform: translateY(80px) scale(0.9);
    }

    .bounce-up-active {
      opacity: 1;
      transform: translateY(0) scale(1);
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  </style>
</head>
<body class="flex flex-col items-center justify-start py-8 px-4 relative min-h-screen">

  <!-- Cute Bubbles & Hearts Canvas -->
  <canvas id="playful-canvas" class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>

  ${hasBgMusic ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white border-2 border-[#FF85A2] shadow-md flex items-center justify-center text-[#FF85A2] hover:scale-105 transition-all" title="Toggle Music">
    <span id="bgm-icon" class="text-sm">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- Passcode Screen (If secret code is set) -->
  ${hasSecretCode ? `
  <div id="code-section" class="w-full max-w-md playful-card rounded-[2.5rem] p-8 text-center z-10 my-auto transition-all duration-700">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFE5EC] text-[#FF6B8B] text-2xl mb-4 border-2 border-white shadow-md animate-bounce">
        🎈
      </div>
      <h2 class="font-fredoka text-2xl font-bold text-[#FF6B8B] mb-2 tracking-wide">Unbox Your Gift!</h2>
      <p class="text-xs text-[#8A7799] font-medium px-2">Enter the secret access code to open your special gift.</p>
    </div>

    <div class="space-y-4">
      <input
        type="text"
        id="secret-code-input"
        placeholder="ACCESS CODE"
        maxlength="12"
        class="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCCD5] bg-[#FFF0F3] text-center font-fredoka font-bold text-[#FF6B8B] focus:outline-none focus:ring-4 focus:ring-[#FF85A2]/30 uppercase tracking-widest text-sm transition-all shadow-inner"
      >
      <button
        onclick="verifyCode()"
        class="w-full py-3.5 bg-gradient-to-r from-[#FF85A2] to-[#FF6B8B] hover:scale-[1.02] active:scale-[0.98] text-white font-fredoka font-bold rounded-2xl shadow-lg transition-all text-sm uppercase tracking-wider border-b-4 border-[#D94E6C]"
      >
        Open Now 🎉
      </button>
      <p id="code-error" class="text-xs text-red-500 opacity-0 transition-opacity font-bold">Incorrect code, please try again! 💕</p>
    </div>
  </div>
  ` : ""}

  <!-- Gift Box Opening Screen -->
  <div id="gift-box-section" class="${hasSecretCode ? 'hidden' : 'flex'} flex-col items-center justify-center z-10 my-auto transition-all duration-1000 w-full">
    <div class="text-center mb-8">
      <h3 class="font-script text-4xl text-[#FF6B8B] mb-1 font-bold">A special gift for:</h3>
      <h2 class="font-fredoka text-3xl font-bold text-[#3D2C47] tracking-wide mt-1">${config.toName} 💖</h2>
      <p class="text-[10px] text-[#FF85A2] font-bold uppercase tracking-widest mt-2 bg-white/70 px-4 py-1.5 rounded-full border border-[#FFCCD5]/50 shadow-sm animate-pulse">Tap the gift to open it!</p>
    </div>

    <!-- 2.5D Interactive Cute Gift Box -->
    <div class="playful-box-container" id="ribbon" onclick="openGiftBox()">
      <div class="gift-box-playful idle" id="gift-box">
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

    <button onclick="openGiftBox()" class="mt-10 px-6 py-3 bg-white hover:bg-[#FFF0F3] border-2 border-[#FFCCD5] rounded-full text-xs font-fredoka font-bold uppercase tracking-widest text-[#FF6B8B] transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95">
      <span>🎈</span> Click to Open Gift!
    </button>
  </div>

  <!-- Main Letter Content Screen (Hidden Initially) -->
  <div id="content-section" class="hidden w-full max-w-2xl playful-card rounded-[2.5rem] p-6 sm:p-10 my-8 z-10 bounce-up-enter">
    
    <!-- Header of the Card -->
    <div class="text-center border-b-2 border-dashed border-[#FFCCD5] pb-6 mb-8 relative">
      <div class="inline-block px-4 py-1.5 bg-[#FFF0F3] border border-[#FFCCD5] rounded-full mb-3 shadow-sm">
        <p class="text-xs font-fredoka font-bold text-[#FF6B8B] uppercase tracking-wider">From: ${config.fromName} ✨</p>
      </div>
      <h1 class="font-fredoka text-3xl sm:text-4xl font-bold text-[#3D2C47] tracking-tight leading-tight mt-1">${letterTitle}</h1>
    </div>

    <!-- Letter Body (Typewritten) -->
    <div class="font-quicksand text-[#5A4B69] font-medium leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[100px] border-b-2 border-dashed border-[#FFCCD5]/50 pb-8" id="letter-body-content"></div>

    <!-- Polaroid Gallery with Sticker Decorations -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 opacity-0">
      <div class="text-center pt-2 pb-4">
        <h3 class="font-fredoka text-2xl font-bold text-[#FF6B8B] tracking-wide">Memory Gallery</h3>
        <p class="text-[10px] text-[#8A7799] font-bold uppercase tracking-widest mt-0.5">📸 Sweet Memories Together</p>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    </div>

    <!-- Custom Voice Note Section (Cute Cassette/Bubble Style) -->
    ${hasVoiceNote ? `
    <div id="voice-section" class="hidden bg-[#FFF5F7] border-2 border-[#FFD6E0] rounded-3xl p-5 sm:p-6 mb-8 opacity-0 shadow-sm relative overflow-hidden">
      <!-- Decorative Cute Cassette Sticker -->
      <div class="absolute -right-2 -bottom-2 text-5xl opacity-10 select-none">📼</div>
      <h4 class="font-fredoka text-sm font-bold text-[#FF6B8B] mb-4 text-center flex items-center justify-center gap-2">
        <span>🎙️</span> Voice Message
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4 relative z-10">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF85A2] to-[#FF6B8B] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-all border-b-4 border-[#D94E6C]">
          <span id="play-icon" class="text-lg ml-0.5">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2.5 bg-[#FFE5EC] rounded-full cursor-pointer group" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-[#FF6B8B] rounded-full w-0 transition-all duration-75" id="audio-progress">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-3 border-[#FF6B8B] rounded-full shadow opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-[#8A7799] font-bold mt-2.5">
            <span id="current-time">0:00</span>
            <span id="duration">0:00</span>
          </div>
        </div>
        <audio id="audio-element" src="${voiceNoteSrc}" ontimeupdate="updateProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
    </div>
    ` : ""}

    <!-- Final Message (Cute script style) -->
    ${config.finalMessage ? `
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t-2 border-dashed border-[#FFCCD5] opacity-0">
      <p class="font-script text-4xl text-[#FF6B8B] font-bold mb-2">"${config.finalMessage}"</p>
      <p class="text-[9px] font-fredoka font-bold uppercase tracking-widest text-[#8A7799]">Sent with love from DearNote 💖</p>
    </div>
    ` : ""}

    <!-- Playful Footer -->
    <div class="text-center mt-8 text-[9px] font-fredoka font-bold text-[#B5A5C2] uppercase tracking-widest border-t border-[#FFF0F3] pt-4">
      DearNote Playful Surprise Card • Yay!
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

    // Bubbles, Hearts & Stars Particle Effect
    const canvas = document.getElementById('playful-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class PlayfulParticle {
      constructor(x, y, isExplosion = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || (isExplosion ? canvas.height * 0.48 : canvas.height + 20);
        this.size = Math.random() * 8 + 4;
        this.speedX = isExplosion ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 1.5;
        this.speedY = isExplosion ? (Math.random() - 0.8) * 10 : -Math.random() * 1.5 - 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
        
        // Randomly pick shape: 0 = bubble, 1 = heart emoji, 2 = star emoji
        this.type = Math.floor(Math.random() * 3);
        this.color = ['#FFC6FF', '#BDB2FF', '#CAFFBF', '#FDFFB6', '#FFADAD', '#9BF6FF'][Math.floor(Math.random() * 6)];
        this.life = isExplosion ? Math.random() * 60 + 30 : 9999;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 1) this.size -= 0.05;
        this.life--;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        if (this.type === 0) {
          // Soft colorful bubble
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 1) {
          // Heart Emoji or symbol
          ctx.font = \`\${this.size * 1.5}px Arial\`;
          ctx.fillStyle = '#FF6B8B';
          ctx.fillText('❤️', this.x, this.y);
        } else {
          // Star Emoji or symbol
          ctx.font = \`\${this.size * 1.5}px Arial\`;
          ctx.fillStyle = '#FDFFB6';
          ctx.fillText('⭐', this.x, this.y);
        }
        ctx.restore();
      }
    }

    function initParticles() {
      for (let i = 0; i < 30; i++) {
        particles.push(new PlayfulParticle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].y < -20 || particles[i].life <= 0 || particles[i].size <= 1) {
          particles.splice(i, 1);
          i--;
          if (particles.filter(p => p.life > 1000).length < 30) {
            particles.push(new PlayfulParticle());
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

      for (let i = 0; i < 120; i++) {
        particles.push(new PlayfulParticle(centerX, centerY, true));
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
      
      // Squash effect before popup
      boxContainer.style.transform = 'scale(1.15, 0.8)';
      
      setTimeout(() => {
        // Pop effect
        boxContainer.style.transform = 'scale(0.9, 1.15) translateY(-15px)';
        boxContainer.classList.add('opening');
        
        // Trigger bubbles/hearts explosion
        triggerBoxExplosion();
      }, 150);

      // Fade out and show content (snappier transition)
      setTimeout(() => {
        const giftSection = document.getElementById('gift-box-section');
        giftSection.style.transition = 'all 0.4s ease';
        giftSection.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
          giftSection.remove();
          const contentSection = document.getElementById('content-section');
          contentSection.classList.remove('hidden');
          
          setTimeout(() => {
            contentSection.classList.add('bounce-up-active');
            contentSection.classList.remove('bounce-up-enter');
            
            setTimeout(startTypewriter, 200);
          }, 50);
        }, 400);
      }, 700);
    }

    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 20; // Fast typewriter speed

      function type() {
        if (index < text.length) {
          container.innerHTML += text.charAt(index);
          index++;
          if (window.innerHeight + window.scrollY < document.body.offsetHeight - 50) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          setTimeout(type, speed);
        } else {
          revealExtraSections();
        }
      }
      type();
    }

    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');

        config.photos.forEach((photo, idx) => {
          const item = document.createElement('div');
          
          // Cute Playful Polaroid Style Frame with sticker overlays
          item.className = 'flex flex-col bg-white border-4 border-[#FFF] outline-2 outline-dashed outline-[#FFCCD5] rounded-3xl overflow-hidden shadow-md p-4 rotate-' + (idx % 2 === 0 ? '2' : '-2') + ' hover:rotate-0 hover:scale-[1.03] transition-all duration-300 relative';

          // Decorative Smiley / Star stickers
          const sticker = document.createElement('div');
          sticker.className = 'absolute top-2 right-2 text-2xl select-none transform rotate-12';
          sticker.innerText = ['🎀', '💖', '🍭', '🎉', '🌸'][idx % 5];
          item.appendChild(sticker);

          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memories';
          img.className = 'w-full aspect-[4/3] object-cover rounded-2xl';

          item.appendChild(img);

          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-fredoka text-sm text-center text-[#FF6B8B] mt-3 pt-1';
            cap.innerText = photo.caption;
            item.appendChild(cap);
          }
          grid.appendChild(item);
        });

        gallery.classList.remove('hidden');
        setTimeout(() => {
          gallery.style.transition = 'opacity 0.8s ease';
          gallery.classList.add('opacity-100');
        }, 100);
      }

      if (config.hasVoiceNote) {
        const voice = document.getElementById('voice-section');
        voice.classList.remove('hidden');
        setTimeout(() => {
          voice.style.transition = 'opacity 0.8s ease';
          voice.classList.add('opacity-100');
        }, 300);
      }

      const finalMsg = document.getElementById('final-message-container');
      if (finalMsg) {
        finalMsg.classList.remove('hidden');
        setTimeout(() => {
          finalMsg.style.transition = 'opacity 1s ease';
          finalMsg.classList.add('opacity-100');
        }, 600);
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
