import { PublishedConfig } from "../../schemas/card-draft";

export function generateFarewellKeepsakeHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Farewell";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // Soft, nostalgic piano music as the default BGM
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-tender-sleepy-lullaby-1577.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sincere Farewell - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
      background: linear-gradient(135deg, #1E1B18 0%, #12100E 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #2D2722;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(138, 110, 85, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(197, 168, 128, 0.3);
      border-radius: 3px;
    }

    /* Envelope textured linen */
    .envelope-box {
      background-color: #E5DFD6;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%),
        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.01) 0px, rgba(0, 0, 0, 0.01) 2px, transparent 2px, transparent 4px);
      box-shadow: 
        0 30px 70px rgba(0, 0, 0, 0.55),
        inset 0 0 40px rgba(115, 104, 92, 0.1);
      border: 1px solid rgba(197, 189, 176, 0.4);
    }

    /* Ivory textured card */
    .letter-paper {
      background-color: #FAF6EE;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(240, 230, 215, 0.2) 100%);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.45),
        inset 0 0 50px rgba(138, 110, 85, 0.05);
      border: 1px solid rgba(138, 110, 85, 0.18);
    }

    /* Corner border decorations */
    .corner-decor {
      position: absolute;
      width: 24px;
      height: 24px;
      border: 1.5px solid rgba(138, 110, 85, 0.25);
      pointer-events: none;
    }
    .corner-tl { top: 16px; left: 16px; border-right: none; border-bottom: none; }
    .corner-tr { top: 16px; right: 16px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 16px; left: 16px; border-right: none; border-top: none; }
    .corner-br { bottom: 16px; right: 16px; border-left: none; border-top: none; }

    /* Photo Frame bronze border */
    .photo-frame {
      background: #FDFBF7;
      border: 1px solid rgba(138, 110, 85, 0.25);
      padding: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .photo-frame:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    /* Glassmorphic voice note player */
    .glass-audio-player {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 
        0 8px 32px rgba(138, 110, 85, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border-radius: 16px;
    }

    /* Quote card styling */
    .final-quote-card {
      background: linear-gradient(135deg, #FAF6EE 0%, #FFFDF9 100%);
      border: 1px solid rgba(197, 168, 128, 0.4);
      box-shadow: 
        0 10px 30px rgba(138, 110, 85, 0.05),
        inset 0 0 20px rgba(197, 168, 128, 0.08);
      border-radius: 12px;
      position: relative;
    }
    .final-quote-card::before {
      content: "";
      position: absolute;
      top: 6px; left: 6px; right: 6px; bottom: 6px;
      border: 1px solid rgba(197, 168, 128, 0.2);
      border-radius: 8px;
      pointer-events: none;
    }

    /* Typewriter Cursor */
    .caret {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background-color: #8A6D56;
      margin-left: 2px;
      vertical-align: middle;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink {
      from, to { background-color: transparent }
      50% { background-color: #8A6D56 }
    }
  </style>
</head>
<body class="flex flex-col items-center justify-center p-4 min-h-screen relative">

  <!-- Floating BGM Toggle Button -->
  ${hasBgMusic ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#8A6D56]/20 shadow-md flex items-center justify-center text-zinc-800/70 hover:bg-white hover:text-zinc-900 transition-all" title="Mute Background Music">
    <span id="bgm-icon" class="text-sm">🎵</span>
  </button>
  <audio id="bgm-audio-element" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- SECTION 1: ACCESS CODE LOCK GATE -->
  ${hasSecretCode ? `
  <div id="code-gate" class="fixed inset-0 flex flex-col items-center justify-center p-4 z-50 transition-all duration-500" style="background: linear-gradient(135deg, #1E1B18 0%, #12100E 100%);">
    <div class="max-w-sm w-full envelope-box rounded-2xl p-8 text-center relative overflow-hidden">
      <!-- subtle linen texture overlay -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, #000 10%, transparent 11%), radial-gradient(circle, #000 10%, transparent 11%); background-size: 4px 4px; background-position: 0 0, 2px 2px;"></div>
      
      <div class="mb-6 z-10 relative">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#73685C]/10 text-[#73685C] text-xl mb-4">
          🔒
        </div>
        <h2 class="font-playfair text-2xl text-[#3D332A] font-bold">Pesan Terkunci</h2>
        <p class="text-xs text-[#73685C] mt-2">Silakan masukkan kode akses untuk membaca pesan perpisahan ini.</p>
      </div>
      
      <div class="space-y-4 z-10 relative">
        <input 
          type="text" 
          id="secret-code-input" 
          placeholder="KODE AKSES" 
          maxlength="12"
          class="w-full px-4 py-3 rounded-xl border border-[#C5BDB0] bg-[#F3EFE9] text-center font-bold text-[#3D332A] focus:outline-none focus:ring-2 focus:ring-[#8A6D56] uppercase tracking-widest placeholder:tracking-normal placeholder:font-normal text-sm"
        >
        <button 
          onclick="verifyCode()"
          class="w-full py-3 bg-[#8A6D56] hover:bg-[#735A46] text-[#FDFBF7] font-semibold rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
        >
          Buka Pesan
        </button>
        <p id="code-error" class="text-xs text-red-650 opacity-0 transition-opacity font-semibold">Kode salah. Silakan coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- SECTION 2: ENVELOPE GATE -->
  <div id="seal-gate" class="${hasSecretCode ? "hidden" : "flex"} fixed inset-0 flex-col items-center justify-center p-4 z-40 transition-all duration-[1200ms] ease-in-out" style="background: linear-gradient(135deg, #1E1B18 0%, #12100E 100%);">
    <div class="envelope-box max-w-sm w-full rounded-2xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[360px]">
      <!-- subtle linen texture overlay -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, #000 10%, transparent 11%), radial-gradient(circle, #000 10%, transparent 11%); background-size: 4px 4px; background-position: 0 0, 2px 2px;"></div>
      
      <div class="mb-6 z-10">
        <span class="block text-[10px] tracking-[0.2em] uppercase text-[#73685C] font-semibold mb-2">A Sincere Farewell</span>
        <h2 class="font-playfair text-2xl text-[#3D332A] font-bold">Untuk: ${config.toName}</h2>
      </div>

      <!-- Wax Seal -->
      <div class="relative w-28 h-28 my-4 flex items-center justify-center cursor-pointer group z-10" onclick="breakSeal()">
        <!-- Copper Wax Seal Backdrop -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#B56F57] to-[#753924] shadow-[0_8px_20px_rgba(117,57,36,0.35)] transition-transform duration-300 group-hover:scale-105" id="wax-seal-bg"></div>
        <div class="absolute w-24 h-24 rounded-full border border-dashed border-[#E5957C]/40 flex items-center justify-center" style="box-shadow: inset 0 0 12px rgba(0,0,0,0.2);">
          <div class="flex flex-col items-center justify-center text-center px-2">
            <span class="font-playfair text-[11px] font-bold text-[#F8EFEA] tracking-wider uppercase leading-none">Thank</span>
            <span class="font-playfair text-[11px] font-bold text-[#F8EFEA] tracking-wider uppercase leading-none mt-0.5">You</span>
          </div>
        </div>
        <!-- Little ribbon details -->
        <div class="absolute -bottom-6 w-3 h-12 bg-[#8C3A27] rounded-b opacity-80" style="clip-path: polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%); transform: rotate(-5deg); z-index: -1;"></div>
        <div class="absolute -bottom-6 w-3 h-14 bg-[#B55A43] rounded-b opacity-90" style="clip-path: polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%); transform: rotate(8deg); z-index: -2;"></div>
      </div>

      <div class="mt-6 z-10">
        <p class="text-xs text-[#73685C]/80 italic animate-pulse">Ketuk segel untuk membuka</p>
        <p class="text-[9px] uppercase tracking-widest text-[#B56F57] font-semibold mt-3">Dari: ${config.fromName}</p>
      </div>
    </div>
  </div>

  <!-- SECTION 3: EDITORIAL LETTER CONTENT -->
  <div id="letter-section" class="hidden w-full max-w-2xl letter-paper rounded-3xl p-6 sm:p-12 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    
    <!-- Decorative Corners -->
    <div class="corner-decor corner-tl"></div>
    <div class="corner-decor corner-tr"></div>
    <div class="corner-decor corner-bl"></div>
    <div class="corner-decor corner-br"></div>

    <!-- Letter Header -->
    <div class="text-center border-b border-[#8A6D56]/15 pb-8 mb-8">
      <h1 class="font-playfair text-3xl sm:text-4xl font-semibold text-[#3D332A] tracking-tight mb-2">${letterTitle}</h1>
      <p class="font-playfair text-3xl sm:text-4xl italic text-[#8A6D56] font-medium tracking-wide mt-3">dear, ${config.toName}</p>
    </div>

    <!-- Letter Body (with Typewriter) -->
    <div class="font-lora text-[#3D332A] leading-relaxed text-base sm:text-lg mb-10 whitespace-pre-wrap min-h-[140px]" id="letter-body-content"></div>

    <!-- Photos Grid Section -->
    <div id="gallery-container" class="hidden space-y-6 mb-10 transition-opacity duration-1000 opacity-0">
      <div class="text-center border-t border-[#8A6D56]/15 pt-8 pb-4">
        <h3 class="font-playfair text-xl font-semibold text-[#3D332A]">Galeri Kenangan</h3>
        <p class="text-[9px] text-[#8A6D56]/60 font-bold uppercase tracking-widest mt-1">Momen Indah yang Kita Lalui Bersama</p>
      </div>
      <div id="photos-grid" class="grid gap-6"></div>
    </div>

    <!-- Voice Note Section -->
    ${hasVoiceNote ? `
    <div id="voice-section" class="hidden glass-audio-player p-5 sm:p-6 mb-10 shadow-sm transition-opacity duration-1000 opacity-0 max-w-xl mx-auto">
      <h4 class="font-playfair text-sm font-semibold text-[#544335] mb-4 text-center tracking-wider flex items-center justify-center gap-2">
        <span class="text-[#8A6D56]">🎙️</span> Pesan Suara Terakhir
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-gradient-to-br from-[#8A6D56] to-[#735A46] hover:from-[#9D8069] hover:to-[#836954] text-[#FDFBF7] flex items-center justify-center shadow-md hover:shadow-lg transform active:scale-95 transition-all focus:outline-none">
          <span id="play-icon" class="text-lg ml-0.5">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-[#EADCC9]/55 rounded-full cursor-pointer group" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8A6D56] to-[#735A46] rounded-full w-0 transition-all duration-75 relative" id="audio-progress">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FDFBF7] border-2 border-[#8A6D56] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-[#73685C] font-semibold tracking-wider mt-2.5">
            <span id="current-time">0:00</span>
            <span id="duration">0:00</span>
          </div>
        </div>
        <audio id="audio-element" src="${voiceNoteSrc}" ontimeupdate="updateProgress()" onloadedmetadata="initAudioMetadata()"></audio>
      </div>
    </div>
    ` : ""}

    <!-- Final Quote Card -->
    ${config.finalMessage ? `
    <div id="final-message-container" class="hidden final-quote-card p-6 sm:p-8 text-center mt-12 transition-opacity duration-1000 opacity-0 max-w-xl mx-auto">
      <span class="block text-2xl text-[#C5A880] mb-2 font-serif">“</span>
      <p class="font-playfair text-xl sm:text-2xl italic text-[#3D332A] leading-relaxed px-4">"${config.finalMessage}"</p>
      <span class="block text-2xl text-[#C5A880] mt-2 font-serif">”</span>
      <div class="w-12 h-[1px] bg-[#C5A880]/30 mx-auto my-4"></div>
      <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A6D56]">Salam Hangat & Sukses Selalu</p>
    </div>
    ` : ""}

    <!-- Footer -->
    <div class="text-center mt-12 text-[9px] font-bold text-[#8A6D56]/40 uppercase tracking-widest border-t border-[#8A6D56]/10 pt-4">
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

    // 1. Verify access code
    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');
      
      if (input === actualCode) {
        const codeGate = document.getElementById('code-gate');
        codeGate.classList.add('scale-95', 'opacity-0');
        playBgm();
        setTimeout(() => {
          codeGate.remove();
          const sealGate = document.getElementById('seal-gate');
          if (sealGate) {
            sealGate.classList.remove('hidden');
            // Force layout reflow
            void sealGate.offsetWidth;
            sealGate.classList.add('flex');
          }
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

    // 2. Open wax seal envelope cover
    let isEnvelopeOpened = false;
    function breakSeal() {
      if (isEnvelopeOpened) return;
      isEnvelopeOpened = true;
      
      playBgm();
      
      const waxBg = document.getElementById('wax-seal-bg');
      const sealGate = document.getElementById('seal-gate');
      
      if (waxBg) {
        waxBg.style.transform = 'scale(0.9) rotate(5deg)';
        waxBg.style.opacity = '0';
        waxBg.style.transition = 'transform 0.8s, opacity 0.8s';
      }
      
      setTimeout(() => {
        if (sealGate) {
          sealGate.classList.add('scale-105', 'opacity-0', 'pointer-events-none');
          
          setTimeout(() => {
            sealGate.remove();
            const letterSection = document.getElementById('letter-section');
            if (letterSection) {
              letterSection.classList.remove('hidden');
              void letterSection.offsetWidth;
              letterSection.classList.remove('opacity-0', 'translate-y-10');
              startTypewriter();
            }
          }, 1200);
        }
      }, 500);
    }

    // 3. Typewriter implementation
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 20;
      
      const caret = document.createElement('span');
      caret.className = 'caret';
      container.appendChild(caret);
      
      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (index < limit) {
          caret.before(text.charAt(index));
          index++;
          if (window.innerHeight + window.scrollY < document.body.scrollHeight) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          setTimeout(type, speed);
        } else {
          caret.remove();
          revealExtraSections();
        }
      }
      type();
    }

    // 4. Reveal photo gallery and voice player
    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');
        
        const count = config.photos.length;
        if (count === 1) {
          grid.className = 'grid grid-cols-1 max-w-md mx-auto gap-6';
        } else if (count === 2) {
          grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-6';
        } else if (count === 3) {
          grid.className = 'grid grid-cols-1 sm:grid-cols-3 gap-6';
        } else {
          grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-6';
        }
        
        config.photos.forEach(photo => {
          const frame = document.createElement('div');
          frame.className = 'photo-frame flex flex-col rounded-lg';
          
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Kenangan Indah';
          img.className = 'w-full aspect-[4/3] object-cover rounded-md';
          
          frame.appendChild(img);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-lora text-xs sm:text-sm text-center text-[#73685C] italic mt-3 px-2 leading-relaxed';
            cap.innerText = photo.caption;
            frame.appendChild(cap);
          }
          grid.appendChild(frame);
        });
        
        gallery.classList.remove('hidden');
        setTimeout(() => { gallery.classList.add('opacity-100'); }, 100);
      }
      
      if (config.hasVoiceNote) {
        const voice = document.getElementById('voice-section');
        if (voice) {
          voice.classList.remove('hidden');
          setTimeout(() => { voice.classList.add('opacity-100'); }, 300);
        }
      }
      
      const finalMsg = document.getElementById('final-message-container');
      if (finalMsg) {
        finalMsg.classList.remove('hidden');
        setTimeout(() => { finalMsg.classList.add('opacity-100'); }, 600);
      }
    }

    // 5. Audio Player controls (BGM & Voice Note)
    let audio = null;
    let isPlaying = false;
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
      if (durationEl && player && player.duration) {
        durationEl.innerText = formatTime(player.duration);
      }
    }

    function toggleAudio() {
      const player = getAudioElement();
      const playIcon = document.getElementById('play-icon');
      if (!player) return;
      
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
      if (!player) return;
      
      if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        if (progress) progress.style.width = percent + '%';
        if (current) current.innerText = formatTime(player.currentTime);
      }
      
      if (player.ended) {
        document.getElementById('play-icon').innerText = '▶';
        if (progress) progress.style.width = '0%';
        if (current) current.innerText = '0:00';
        isPlaying = false;
        playBgm();
      }
    }

    function seekAudio(event) {
      const player = getAudioElement();
      const bar = document.getElementById('progress-bar-container');
      if (!player || !bar) return;
      
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
