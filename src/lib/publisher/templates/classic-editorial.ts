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

  return `<!DOCTYPE html>
<html lang="id">
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
      background-color: #FAF9F6;
      background-image: radial-gradient(rgba(197, 168, 128, 0.05) 1px, transparent 0);
      background-size: 24px 24px;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(24, 24, 27, 0.03);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(197, 168, 128, 0.3);
      border-radius: 3px;
    }
    
    /* Elegant dust particles */
    .dust {
      position: absolute;
      background: rgba(197, 168, 128, 0.15);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      animation: drift linear infinite;
    }
    @keyframes drift {
      0% {
        transform: translate(0, -10px) rotate(0deg) scale(0.8);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translate(80px, 105vh) rotate(180deg) scale(0.4);
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
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
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
      transition: transform 0.4s ease 0.4s;
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
      transition: transform 0.6s ease;
      transform: translateY(0);
      box-shadow: 0 -5px 15px rgba(0,0,0,0.03);
    }
    .envelope-wrapper.open .envelope-card {
      transform: translateY(-120px);
      z-index: 35;
    }
    
    /* Wax seal pulse */
    .wax-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 54px;
      height: 54px;
      background: radial-gradient(circle, #C5A880, #B0926A); /* warm bronze */
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 6px 14px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.3);
      z-index: 40;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #FFF;
    }
    .wax-seal::after {
      content: '✉'; /* Clean envelope icon */
    }
    .envelope-wrapper.open .wax-seal {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
    }
    .wax-seal:hover {
      transform: translate(-50%, -50%) scale(1.08);
      box-shadow: 0 8px 18px rgba(0,0,0,0.25);
    }
    
    /* Keepsake Card */
    .keepsake-card {
      background: #FFFFFF;
      border: 1px solid rgba(197, 168, 128, 0.25);
      box-shadow: 0 16px 40px rgba(28, 25, 23, 0.05);
    }
    .accent-border {
      border: 1px solid rgba(197, 168, 128, 0.3);
    }
  </style>
</head>
<body class="flex items-center justify-center p-4 relative min-h-screen">

  <!-- Floating Dust Container -->
  <div id="dust-container" class="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <!-- SECTION 1: CODE LOCK ACCESS SCREEN -->
  ${
    hasSecretCode
      ? `
  <div id="code-section" class="w-full max-w-md keepsake-card rounded-2xl p-8 text-center z-10 transition-all duration-500 transform scale-100 border border-zinc-100">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-50 text-zinc-500 border border-zinc-100 text-2xl mb-4">
        🔒
      </div>
      <h2 class="font-lora text-2xl font-semibold text-zinc-800 mb-2">Masukkan Kode Akses</h2>
      <p class="text-xs text-zinc-400 font-medium">Ada sebuah catatan khusus untuk Anda. Silakan masukkan kode akses untuk membacanya.</p>
    </div>
    
    <div class="space-y-4">
      <input 
        type="text" 
        id="secret-code-input" 
        placeholder="Kode Akses Keamanan" 
        maxlength="12"
        class="w-full px-4 py-3 rounded-xl border border-zinc-200 text-center font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 uppercase tracking-widest placeholder:tracking-normal placeholder:font-normal text-sm"
      >
      <button 
        onclick="verifyCode()"
        class="w-full py-3 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
      >
        Buka Catatan
      </button>
      <p id="code-error" class="text-xs text-red-500 opacity-0 transition-opacity font-semibold">Kode tidak cocok. Silakan coba kembali.</p>
    </div>
  </div>
  `
      : ""
  }

  <!-- SECTION 2: ENVELOPE OPENING UX -->
  <div id="envelope-section" class="${
    hasSecretCode ? "hidden" : ""
  } flex-col items-center justify-center z-10 transition-all duration-500">
    <div class="text-center mb-8">
      <h3 class="font-lora text-2xl font-semibold text-zinc-700 mb-1">Kepada: ${config.toName}</h3>
      <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Sebuah Catatan Kenangan Untukmu</p>
    </div>
    
    <div id="envelope" class="envelope-wrapper" onclick="openEnvelope()">
      <div class="wax-seal"></div>
      <div class="envelope-card flex flex-col justify-between items-center text-center">
        <span class="font-lora text-xl font-medium text-zinc-600">Dari: ${config.fromName}</span>
        <span class="text-[9px] uppercase font-bold tracking-widest text-amber-600/80">Ketuk untuk Membuka</span>
      </div>
    </div>
  </div>

  <!-- SECTION 3: MAIN LETTER CONTENT -->
  <div id="letter-section" class="hidden w-full max-w-2xl keepsake-card rounded-3xl p-6 sm:p-10 my-8 z-10 opacity-0 transition-all duration-1000 transform translate-y-10 border border-zinc-100">
    
    <!-- Letter Header -->
    <div class="text-center border-b border-zinc-100 pb-6 mb-8">
      <h1 class="font-lora text-3xl font-semibold text-zinc-800 mb-3">${letterTitle}</h1>
      <div class="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">
        <span>Untuk: ${config.toName}</span>
        <span>Dari: ${config.fromName}</span>
      </div>
    </div>

    <!-- Letter Body (Typewriter effect container) -->
    <div class="font-lora text-zinc-700 leading-loose text-base sm:text-lg mb-8 whitespace-pre-wrap min-h-[120px]" id="letter-body-content"></div>

    <!-- Photos Gallery -->
    <div id="gallery-container" class="hidden space-y-6 mb-8 transition-opacity duration-1000 opacity-0">
      <div class="text-center border-t border-zinc-100 pt-8 pb-4">
        <h3 class="font-lora text-xl font-semibold text-zinc-800">Lampiran Foto Kenangan</h3>
        <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Dokumentasi Momen Bersama</p>
      </div>
      <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
    </div>

    <!-- Voice Note Section -->
    ${
      hasVoiceNote
        ? `
    <div id="voice-section" class="hidden bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 sm:p-6 mb-8 transition-opacity duration-1000 opacity-0">
      <h4 class="font-lora text-sm font-semibold text-zinc-700 mb-3 text-center flex items-center justify-center gap-2">
        <span>🎙</span> Lampiran Pesan Suara
      </h4>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Custom Audio Player UI -->
        <button id="play-btn" onclick="toggleAudio()" class="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-900 text-white flex items-center justify-center shadow-sm transition-all">
          <span id="play-icon" class="text-lg">▶</span>
        </button>
        <div class="flex-1 w-full">
          <div class="relative h-2 bg-zinc-200 rounded-full cursor-pointer" id="progress-bar-container" onclick="seekAudio(event)">
            <div class="absolute top-0 left-0 h-full bg-zinc-800 rounded-full w-0" id="audio-progress"></div>
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
    <div id="final-message-container" class="hidden text-center mt-10 pt-8 border-t border-zinc-100 transition-opacity duration-1000 opacity-0">
      <p class="font-lora text-2xl italic text-zinc-800 mb-2">"${config.finalMessage}"</p>
      <p class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Salam Hangat</p>
    </div>
    `
        : ""
    }

    <!-- Footer branding -->
    <div class="text-center mt-8 text-[9px] font-bold text-zinc-300 uppercase tracking-widest border-t border-zinc-50 pt-4">
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

    // 1. Generate Floating Dust Particles
    const dustContainer = document.getElementById('dust-container');
    
    function createDustParticle() {
      const particle = document.createElement('div');
      particle.classList.add('dust');
      
      const size = Math.random() * 4 + 2;
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 10 + 6;
      const delay = Math.random() * 4;
      
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = left + 'px';
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = delay + 's';
      
      dustContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    }
    
    for (let i = 0; i < 15; i++) {
      createDustParticle();
    }
    setInterval(createDustParticle, 800);

    // 2. Secret Code Validation
    function verifyCode() {
      const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
      const actualCode = config.secretCode.toUpperCase();
      const errorMsg = document.getElementById('code-error');
      
      if (input === actualCode) {
        const codeSection = document.getElementById('code-section');
        codeSection.classList.add('scale-95', 'opacity-0');
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
      
      const envelope = document.getElementById('envelope');
      envelope.classList.add('open');
      
      setTimeout(() => {
        const envSection = document.getElementById('envelope-section');
        envSection.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
          envSection.remove();
          const letterSection = document.getElementById('letter-section');
          letterSection.classList.remove('hidden');
          setTimeout(() => {
            letterSection.classList.remove('opacity-0', 'translate-y-10');
            startTypewriter();
          }, 50);
        }, 600);
      }, 1500);
    }

    // 4. Typewriter Animation
    function startTypewriter() {
      const container = document.getElementById('letter-body-content');
      const text = config.letterBody;
      let index = 0;
      const speed = 25;
      
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

    // 5. Reveal Extra Sections
    function revealExtraSections() {
      if (config.photos && config.photos.length > 0) {
        const gallery = document.getElementById('gallery-container');
        const grid = document.getElementById('photos-grid');
        
        config.photos.forEach(photo => {
          const item = document.createElement('div');
          item.className = 'flex flex-col bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden shadow-sm p-3 transform transition hover:scale-[1.01] duration-300';
          
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Memory Photo';
          img.className = 'w-full h-48 sm:h-60 object-cover rounded-lg mb-2';
          
          item.appendChild(img);
          
          if (photo.caption) {
            const cap = document.createElement('p');
            cap.className = 'font-sans text-xs text-center text-zinc-500 italic px-2 py-1';
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
      } else {
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
