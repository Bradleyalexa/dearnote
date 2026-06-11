import { PublishedConfig } from "../../schemas/card-draft";

export function generatePolaroidMemoryNoteHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Our Story So Far";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Memory - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Montserrat:wght@400;500;600&family=Special+Elite&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            handwritten: ['Caveat', 'cursive'],
            typewriter: ['"Special Elite"', 'monospace'],
            sans: ['Montserrat', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom CSS animations and styles */
    body {
      background-color: #f5ebe0;
      background-image: radial-gradient(#e3d5ca 1px, transparent 1px);
      background-size: 20px 20px;
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
      background: rgba(213, 189, 175, 0.6);
      border-radius: 3px;
    }

    /* Polaroid card scatter */
    .polaroid {
      background: #ffffff;
      padding: 12px 12px 28px 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0,0,0,0.04);
      transform-style: preserve-3d;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .polaroid:hover {
      transform: scale(1.05) rotate(0deg) !important;
      box-shadow: 0 15px 30px rgba(0,0,0,0.15);
      z-index: 50;
    }

    /* Paper texture for main card */
    .scrapbook-paper {
      background-color: #fefae0;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(221, 190, 169, 0.2) 2px, transparent 2px);
      background-size: 100% 28px, 100% 100%;
      line-height: 28px !important;
      border: 1px solid #dda15e;
      box-shadow: 0 10px 30px rgba(96, 108, 56, 0.1);
    }

    /* Tape overlay */
    .tape {
      position: absolute;
      background: rgba(218, 165, 32, 0.3);
      backdrop-filter: blur(1px);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transform: rotate(-3deg);
    }

    /* Cover page folder */
    .scrapbook-cover {
      position: relative;
      width: 320px;
      height: 440px;
      background: linear-gradient(135deg, #d3a297, #b5838d);
      border-radius: 8px 24px 24px 8px;
      box-shadow: 10px 15px 35px rgba(0,0,0,0.18);
      cursor: pointer;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left center;
    }
    .scrapbook-cover:hover {
      transform: rotateY(-10deg) rotateX(2deg);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- SECTION 1: COSMETIC SECRET CODE -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md bg-white border border-[#dda15e]/30 rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100 shadow-xl">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f5ebe0] text-[#b5838d] text-3xl mb-4">
        🔑
      </div>
      <h2 class="font-typewriter text-xl font-bold text-gray-800 mb-2">Private Note</h2>
      <p class="text-sm text-gray-600 font-sans">Surat kenangan dari <span class="font-semibold text-[#b5838d]">${config.fromName}</span> untuk <span class="font-semibold text-[#b5838d]">${config.toName}</span>. Masukkan kode untuk membuka album.</p>
    </div>
    
    <div class="space-y-4 font-sans">
      <input 
        type="text" 
        id="secret-code-input" 
        placeholder="Kode Rahasia" 
        maxlength="12"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 text-center font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b5838d] uppercase tracking-widest"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-[#b5838d] hover:bg-[#a2727c] text-white font-semibold rounded-xl shadow-md transition-all"
      >
        Buka Album
      </button>
      <p id="code-error" class="text-xs text-red-500 opacity-0 transition-opacity font-medium">Kode salah, coba cek kembali kodenya.</p>
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
      <!-- Spine overlay -->
      <div class="absolute top-0 left-0 bottom-0 w-6 bg-black/10 rounded-l-lg"></div>
      
      <div class="self-end border-b border-white/20 pb-2 text-right">
        <span class="font-sans text-[10px] uppercase tracking-widest font-semibold opacity-80">Memory Scrapbook</span>
      </div>
      
      <div class="text-center my-auto">
        <h3 class="font-handwritten text-5xl font-bold mb-2">Dear ${
          config.toName
        }</h3>
        <p class="font-sans text-xs uppercase tracking-widest opacity-80">Kenangan Dari ${
          config.fromName
        }</p>
      </div>
      
      <div class="text-center border-t border-white/20 pt-4">
        <span class="font-sans text-[10px] uppercase tracking-widest font-bold animate-pulse">Ketuk Buku untuk Membuka</span>
      </div>
    </div>
  </div>

  <!-- SECTION 3: SCRAPBOOK CONTENT -->
  <div id="scrapbook-section" class="hidden w-full max-w-3xl my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10">
    
    <!-- Handwriting Letter Card -->
    <div class="scrapbook-paper rounded-2xl p-6 sm:p-10 mb-8 relative overflow-hidden">
      <!-- Tape Effect -->
      <div class="tape top-[-8px] left-[30%] w-24 h-6"></div>
      <div class="tape bottom-[-8px] right-[20%] w-20 h-6"></div>

      <!-- Letter Header -->
      <div class="border-b border-dashed border-[#dda15e] pb-4 mb-6 font-handwritten text-3xl text-gray-800">
        <div class="flex justify-between items-center">
          <span>Untuk: ${config.toName}</span>
          <span>Dari: ${config.fromName}</span>
        </div>
      </div>

      <!-- Typewriter / Handwriting content -->
      <div class="font-handwritten text-gray-800 text-2xl sm:text-3xl leading-loose min-h-[140px]" id="letter-body-content"></div>

      <!-- Final Message -->
      ${
        config.finalMessage
          ? `
      <div id="final-message-container" class="hidden font-handwritten text-3xl text-center text-[#b5838d] font-bold mt-10 pt-6 border-t border-dashed border-[#dda15e] transition-opacity duration-1000 opacity-0">
        "${config.finalMessage}"
      </div>
      `
          : ""
      }
    </div>

    <!-- Polaroid Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center relative py-4">
        <div class="tape top-0 left-[45%] w-16 h-5 opacity-70"></div>
        <h3 class="font-handwritten text-4xl font-bold text-gray-800">Album Foto Kenangan</h3>
      </div>
      <div id="polaroid-grid" class="flex flex-wrap items-center justify-center gap-8 py-6"></div>
    </div>

    <!-- Voice Note Section -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-white/70 border border-[#dda15e]/30 rounded-2xl p-4 sm:p-6 mb-8 shadow-md relative transition-opacity duration-1000 opacity-0">
      <!-- Tape effect -->
      <div class="tape top-[-6px] left-[10%] w-16 h-5"></div>
      
      <h4 class="font-handwritten text-2xl font-bold text-gray-800 mb-4 text-center">
        🔊 Dengar Pesan Suara Ini
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4 font-sans">
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-[#b5838d] hover:bg-[#a2727c] text-white flex items-center justify-center shadow-md transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-gray-200 rounded-full cursor-pointer" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-[#b5838d] rounded-full w-0" id="audio-progress"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 font-semibold mt-2">
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
    <div class="text-center mt-12 mb-6 text-xs font-semibold uppercase tracking-widest text-[#dda15e]">
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

    // 1. Code Validation
    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');
      
      if (input === actualCode) {
        const codeSection = document.getElementById('code-section');
        codeSection.classList.add('scale-95', 'opacity-0');
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
      
      const cover = document.getElementById('scrapbook-cover');
      // Flip open cover page effect
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
        }, 600);
      }, 700);
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

    // 4. Polaroid Scatter and Fades
    function revealExtraSections() {
      // 1. Photos (Polaroid layout)
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('polaroid-grid');
        
        // Define random rotations for polaroids to create scattered look
        const rotations = [-5, 4, -3, 5, -4];
        
        config.photos.forEach((photo, idx) => {
          const item = document.createElement('div');
          const rot = rotations[idx % rotations.length];
          item.className = 'polaroid w-64 max-w-full relative';
          item.style.transform = 'rotate(' + rot + 'deg)';
          
          // Random tiny tape effect on some polaroids
          if (Math.random() > 0.4) {
            const tape = document.createElement('div');
            tape.className = 'tape absolute w-16 h-5 opacity-80';
            tape.style.top = '-10px';
            tape.style.left = '35%';
            tape.style.transform = 'rotate(' + (Math.random() * 8 - 4) + 'deg)';
            item.appendChild(tape);
          }

          // Image
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory';
          img.className = 'w-full h-48 object-cover border border-gray-100';
          item.appendChild(img);
          
          // Caption
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-handwritten text-xl text-center text-gray-700 italic mt-3 leading-tight';
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

    // 5. Audio Player Logic
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
