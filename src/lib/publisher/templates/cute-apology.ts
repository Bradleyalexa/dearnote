import { PublishedConfig } from "../../schemas/card-draft";

export function generateCuteApologyHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Maafin Aku Ya? 🥺";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // A sweet acoustic music track for couples apologizing
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cute Apology Keepsake – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600;700&family=Architects+Daughter&family=Lora:ital,wght@0,500;0,600;1,400&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            cursive: ['"Dancing Script"', 'cursive'],
            playfair: ['"Playfair Display"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            fredoka: ['"Fredoka"', 'sans-serif'],
            handwriting: ['"Architects Daughter"', 'cursive'],
            lora: ['"Lora"', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle, #fff0f3 0%, #ffe5ec 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #4A5568;
      font-family: 'Fredoka', sans-serif;
    }

    /* Falling hearts canvas */
    #heart-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    .glow-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 25%, rgba(255, 182, 193, 0.15) 0%, rgba(255, 255, 255, 0) 80%);
      pointer-events: none;
      z-index: 1;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 182, 193, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 182, 193, 0.4);
      border-radius: 3px;
    }

    /* Code Gate Screen */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffe5ec 0%, #ffc2d1 100%);
      padding: 2rem;
      z-index: 1000;
      transition: all 0.9s cubic-bezier(0.1, 0.8, 0.2, 1);
    }

    /* ── Pink Band-aid Gate ── */
    #bandaid-gate {
      position: fixed;
      inset: 0;
      background: #ffe3e8;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 80%),
        repeating-linear-gradient(0deg, rgba(255,182,193,0.15) 0px, rgba(255,182,193,0.15) 2px, transparent 2px, transparent 8px);
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 80px rgba(255,182,193,0.3);
      transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.2s ease;
      touch-action: none;
    }

    .bandaid-stitching {
      position: absolute;
      inset: 20px;
      border: 2px dashed #ffb5c5;
      pointer-events: none;
      z-index: 510;
      opacity: 0.7;
    }

    .bandaid-strap {
      width: 140px;
      height: 50px;
      background: #ffb5c5;
      border-radius: 25px;
      border: 3px solid #ff9ebb;
      box-shadow: 0 6px 12px rgba(255, 158, 187, 0.3);
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-10deg);
      cursor: pointer;
      z-index: 520;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .bandaid-strap::before {
      content: "";
      width: 40px;
      height: 40px;
      background: #ffd3db;
      border-radius: 4px;
      border: 1.5px dashed #ff9ebb;
    }
    .bandaid-strap::after {
      content: "••••";
      font-size: 8px;
      color: #ff9ebb;
      letter-spacing: 2px;
      position: absolute;
    }
    .bandaid-strap.peeled {
      transform: translate(150px, -220px) rotate(45deg) scale(0.2);
      opacity: 0;
    }

    /* ── 3D Book Container & Pages ── */
    .book-wrapper {
      position: relative;
      width: 320px;
      height: 520px;
      perspective: 1500px;
      z-index: 10;
      transform-style: preserve-3d;
    }

    /* Ring binder spine */
    .book-spine {
      position: absolute;
      left: -8px;
      top: 2%;
      width: 20px;
      height: 96%;
      background: linear-gradient(to right, #ffb3c1, #ffccd5, #ff8ea6);
      border-radius: 4px 0 0 4px;
      box-shadow: -5px 5px 15px rgba(255,182,193,0.3);
      z-index: 60;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0;
    }
    .binder-ring {
      width: 24px;
      height: 10px;
      background: linear-gradient(to bottom, #FFF0F2, #ffccd5, #ff8ea6);
      border-radius: 10px;
      transform: translateX(-4px);
      box-shadow: 0 3px 6px rgba(255,182,193,0.25);
    }

    /* Book Pages */
    .book-page {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #FFFDFB;
      background-image: 
        linear-gradient(90deg, rgba(255, 230, 235, 0.4) 1px, transparent 1px),
        linear-gradient(rgba(255, 230, 235, 0.3) 1px, transparent 1px);
      background-size: 100% 100%, 100% 24px;
      border-radius: 0 12px 12px 0;
      box-shadow: 
        inset 5px 0 15px rgba(255, 182, 193, 0.05), 
        inset 0 0 30px rgba(255, 182, 193, 0.04),
        5px 10px 30px rgba(255, 182, 193, 0.15);
      transform-origin: left center;
      transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), z-index 1.5s;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
      border: 1px solid #FFE3E8;
      padding: 24px;
    }
    
    /* Notebook margin line */
    .book-page::before {
      content: "";
      position: absolute;
      left: 32px;
      top: 0;
      bottom: 0;
      width: 1.5px;
      background: rgba(239, 68, 68, 0.25); /* red vertical margin line */
      pointer-events: none;
    }

    .book-page.flipped {
      transform: rotateY(-180deg) translateZ(1px);
    }

    /* ── Forgiveness Offer Meter Board (Page 1) ── */
    .offering-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 15px;
    }
    .offering-card {
      background: #FFFDF9;
      border: 2px solid #FFE3E8;
      border-radius: 12px;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s, border-color 0.2s;
      box-shadow: 0 2px 6px rgba(255,182,193,0.05);
    }
    .offering-card:hover {
      transform: translateY(-2px) scale(1.02);
      border-color: #ffb5c5;
    }
    .offering-stamp {
      position: absolute;
      inset: 0;
      background: rgba(255, 240, 243, 0.95);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff5a79;
      font-weight: 700;
      font-size: 10px;
      opacity: 0;
      transform: scale(0.6) rotate(-15deg);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      border: 2px dashed #ffb5c5;
    }
    .offering-card.active .offering-stamp {
      opacity: 1;
      transform: scale(1) rotate(-8deg);
    }

    .progress-heart-outer {
      width: 100%;
      height: 14px;
      background: #FFE5EC;
      border-radius: 7px;
      border: 1px solid #ffb5c5;
      overflow: hidden;
      position: relative;
    }
    .progress-heart-inner {
      width: 0%;
      height: 100%;
      background: linear-gradient(to right, #ff8da1, #ff5a79);
      transition: width 0.4s ease;
    }

    /* Ruled journal writing */
    .notebook-journal-text {
      line-height: 24px;
      font-size: 13px;
      font-family: 'Lora', serif;
      background: transparent;
      padding-top: 4px;
    }

    /* Cute Audio Player */
    .cute-audio-player {
      background: #FFFDF9;
      border: 2px dashed #FFB5C5;
      border-radius: 14px;
      box-shadow: 0 4px 10px rgba(255, 182, 193, 0.08);
    }
    
    /* Floating BGM Button */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 1px solid #FFB5C5;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 182, 193, 0.2);
      z-index: 150;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Book bookmarks navigation */
    .nav-bookmark {
      position: absolute;
      bottom: 16px;
      padding: 6px 12px;
      background: #ff758f;
      color: #FFFDF9;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(255, 117, 143, 0.15);
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      z-index: 45;
      font-family: 'Fredoka', sans-serif;
    }
    .nav-bookmark:hover {
      background: #ff5c8a;
      transform: translateY(-1px);
    }
    .nav-bookmark.prev { left: 40px; }
    .nav-bookmark.next { right: 20px; }

    /* Sparkles */
    .sparkle-float {
      position: absolute;
      font-size: 1.3rem;
      pointer-events: none;
      animation: floatStar 1s forwards ease-out;
      z-index: 100;
    }
    @keyframes floatStar {
      0% { opacity: 0; transform: translate(0, 0) scale(0.6) rotate(0deg); }
      30% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--dx), -80px) scale(1.2) rotate(120deg); }
    }

    /* Cute check background gallery */
    .check-bg {
      background-color: #fff0f3;
      background-image: 
        linear-gradient(rgba(255, 182, 193, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 182, 193, 0.15) 1px, transparent 1px);
      background-size: 18px 18px;
      box-shadow: inset 0 0 30px rgba(255, 182, 193, 0.2);
    }
    
    .washi-polaroid {
      background: white;
      border: 5px solid white;
      border-bottom: 22px solid white;
      box-shadow: 0 8px 16px rgba(255, 117, 143, 0.15);
      border-radius: 1px;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, z-index 0.6s;
      cursor: pointer;
    }
    
    /* Washi tape style */
    .washi-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%) rotate(-3deg);
      width: 75px;
      height: 18px;
      background: rgba(255, 182, 193, 0.85);
      border: 1px dashed rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      z-index: 10;
    }
    .washi-tape::before {
      content: "💖 💖 💖";
      font-size: 7px;
      color: white;
      display: block;
      text-align: center;
      line-height: 18px;
    }

    /* ── Interactive Teddy Bear (Page 4) ── */
    .bear-wrapper {
      position: relative;
      width: 130px;
      height: 130px;
      margin: 20px auto 10px;
      cursor: pointer;
      z-index: 5;
    }
    .bear-head {
      width: 100px;
      height: 85px;
      background: #dfbda7;
      border-radius: 50% 50% 45% 45%;
      position: absolute;
      bottom: 25px;
      left: 15px;
      box-shadow: 0 4px 10px rgba(139, 90, 43, 0.15), inset 2px 2px 5px rgba(255,255,255,0.45);
      z-index: 2;
    }
    .bear-ear {
      width: 32px;
      height: 32px;
      background: #dfbda7;
      border-radius: 50%;
      position: absolute;
      top: 10px;
      box-shadow: inset 0 0 0 6px #ffccd5;
      z-index: 1;
    }
    .bear-ear.left { left: 12px; }
    .bear-ear.right { right: 12px; }
    .bear-eye {
      width: 8px;
      height: 8px;
      background: #3e2723;
      border-radius: 50%;
      position: absolute;
      top: 38px;
      transition: all 0.3s;
    }
    .bear-eye.left { left: 26px; }
    .bear-eye.right { right: 26px; }
    .bear-blush {
      width: 14px;
      height: 8px;
      background: rgba(255, 137, 161, 0.6);
      border-radius: 50%;
      position: absolute;
      top: 48px;
    }
    .bear-blush.left { left: 16px; }
    .bear-blush.right { right: 16px; }
    .bear-snout {
      width: 32px;
      height: 24px;
      background: #faf6f0;
      border-radius: 50%;
      position: absolute;
      bottom: 12px;
      left: 34px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .bear-nose {
      width: 10px;
      height: 6px;
      background: #3e2723;
      border-radius: 5px 5px 3px 3px;
    }
    .bear-mouth {
      width: 8px;
      height: 4px;
      border: 1.5px solid #3e2723;
      border-top: none;
      border-radius: 0 0 4px 4px;
      margin-top: 1px;
      transition: all 0.3s;
    }
    .bear-heart {
      width: 60px;
      height: 52px;
      background: #ff5c8a;
      position: absolute;
      bottom: 0;
      left: 35px;
      z-index: 3;
      box-shadow: 0 4px 8px rgba(255, 92, 138, 0.3);
      border-radius: 50% 50% 0 0;
      transition: transform 0.3s, background-color 0.3s;
    }
    .bear-heart::before, .bear-heart::after {
      content: "";
      position: absolute;
      width: 30px;
      height: 48px;
      background: #ff5c8a;
      border-radius: 15px 15px 0 0;
      transition: background-color 0.3s;
    }
    .bear-heart::before {
      left: 30px;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
    }
    .bear-heart::after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }
    .heart-text {
      position: absolute;
      width: 100%;
      text-align: center;
      font-size: 7.5px;
      font-weight: 800;
      color: white;
      top: 14px;
      z-index: 10;
      letter-spacing: 0.5px;
    }
    .heart-patch {
      position: absolute;
      width: 14px;
      height: 6px;
      background: #ffccd5;
      border-radius: 2px;
      transform: rotate(-25deg);
      top: 25px;
      left: 12px;
      z-index: 11;
      opacity: 0.8;
      border: 0.5px solid #ff9ebb;
    }

    .bear-wrapper.active .bear-eye {
      height: 4px;
      border-radius: 4px 4px 0 0;
      background: #ff5c8a;
    }
    .bear-wrapper.active .bear-mouth {
      border: 1.5px solid #ff5c8a;
      border-top: none;
      border-radius: 0 0 5px 5px;
      height: 6px;
    }
    .bear-wrapper.active .bear-heart {
      background: #ff2a63;
      transform: scale(1.08);
    }
    .bear-wrapper.active .bear-heart::before, .bear-wrapper.active .bear-heart::after {
      background: #ff2a63;
    }

    /* Sliding gold plaque note */
    #apology-paper {
      position: absolute;
      width: 210px;
      height: 170px;
      background: #fffdfc;
      border: 2.5px solid #ff5a79;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(255, 117, 143, 0.2);
      padding: 16px;
      z-index: 10;
      transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.7s;
      transform: translate(-50%, 40px) scale(0.6);
      left: 50%;
      opacity: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    #apology-paper.active {
      transform: translate(-50%, -150px) scale(1.05);
      opacity: 1;
      pointer-events: auto;
    }
  </style>
</head>
<body class="flex flex-col min-h-screen items-center justify-center p-4 relative" onclick="spawnHeartSparkle(event)">

  <!-- Falling hearts canvas -->
  <canvas id="heart-canvas"></canvas>
  <div class="glow-overlay"></div>

  <!-- Music toggle button -->
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">🎵</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>

  <!-- ── VIEW 1: SECRET CODE GATE ── -->
  ${hasSecretCode ? `
  <div id="code-gate" class="z-[1000]">
    <div class="bg-[#FFFDF9] max-w-sm w-full rounded-[1.5rem] p-8 border-4 border-[#ffb5c5] shadow-2xl text-center relative overflow-hidden">
      <div class="absolute inset-0 border border-pink-100 pointer-events-none"></div>
      
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#ff5a79] mb-2 font-fredoka">DearNote • Couple</p>
      <h1 class="text-2xl font-bold font-fredoka text-[#ff5a79] mb-4">Peace & Love</h1>
      <p class="text-xs text-stone-700 leading-relaxed mb-6 font-fredoka">
        Surat Permintaan Maaf dari <strong>${config.fromName}</strong> terkunci. Masukkan kode akses.
      </p>
      
      <div class="space-y-4">
        <input id="code-input" type="text" placeholder="Passkey" maxlength="12"
          class="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#ffb5c5] rounded-xl text-center font-fredoka tracking-widest text-[#ff5a79] focus:outline-none focus:border-[#ff758f] uppercase"
          onkeydown="if(event.key==='Enter')verifyCode()">
        <button id="code-btn" onclick="verifyCode()"
          class="w-full py-3 bg-[#ff758f] hover:bg-[#ff5c8a] text-white font-bold rounded-xl transition-all shadow-md font-fredoka text-xs tracking-wider uppercase">
          Buka Surat
        </button>
        <p id="code-err" class="text-xs text-red-500 font-bold opacity-0 transition-opacity duration-300">Kode salah. Silakan coba lagi.</p>
      </div>
    </div>
  </div>
  ` : ""}

  <!-- ── VIEW 2: INTERACTIVE BANDAID COVER GATE ── -->
  <div id="bandaid-gate">
    <div class="bandaid-stitching"></div>
    
    <div class="text-center z-10 max-w-xs px-6 select-none pointer-events-none mb-12">
      <span class="block text-xs uppercase tracking-[4px] text-pink-600 font-bold mb-4 font-fredoka">Surat Maaf 🥺</span>
      <h1 class="text-[#ff5a79] text-3xl font-bold font-fredoka leading-tight mb-8">Maafin Aku Ya,<br>Sayang?</h1>
      
      <p class="text-xs text-stone-600 font-semibold font-handwriting leading-relaxed opacity-90">
        Untuk: <span class="text-pink-600 font-bold">${config.toName}</span><br>
        Dari: <span class="text-pink-600 font-bold">${config.fromName}</span>
      </p>
    </div>

    <!-- The Band-aid Peel -->
    <div id="bandaid" class="bandaid-strap" onclick="completeBandaidGate()"></div>

    <div class="absolute bottom-16 text-center pointer-events-none z-20">
      <span class="text-[9px] text-pink-600 uppercase tracking-widest font-bold font-fredoka animate-pulse">Ketuk Plester Luka untuk Membuka &darr;</span>
    </div>
  </div>

  <!-- ── VIEW 3: 3D LEATHER BOOK CONTAINER ── -->
  <div class="book-wrapper">
    <div class="book-spine">
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
      <div class="binder-ring"></div>
    </div>

    <!-- ── PAGE 1: FORGIVENESS OFFER METER ── -->
    <div id="page-1" class="book-page flex flex-col justify-between" style="z-index: 40">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center border-b border-pink-100 pb-2 mb-2 ml-4">
          <h2 class="font-fredoka text-base font-bold text-[#ff5a79]">Sesajen Maaf Untukmu</h2>
          <span class="block text-[7px] font-bold uppercase tracking-widest text-pink-400">Forgiveness Offering Game</span>
        </div>
        
        <p class="text-[9px] text-stone-500 leading-relaxed italic text-center px-2 mt-1 ml-4">
          Ketuk sesajen boba/pelukan di bawah untuk menaikkan indikator hati!
        </p>

        <!-- offerings grid -->
        <div class="ml-4 overflow-y-auto max-h-[300px] mt-2 pr-1">
          <div class="offering-grid">
            <div class="offering-card" onclick="toggleOffering(this)">
              <span class="text-2xl block mb-1">🧋</span>
              <span class="text-[10px] font-bold block text-stone-700">Boba Milk Tea</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Pereda amarah instan.</span>
              <div class="offering-stamp">💕 DITERIMA</div>
            </div>
            <div class="offering-card" onclick="toggleOffering(this)">
              <span class="text-2xl block mb-1">🍫</span>
              <span class="text-[10px] font-bold block text-stone-700">Cokelat Manis</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Peningkat hormon bahagia.</span>
              <div class="offering-stamp">💕 DITERIMA</div>
            </div>
            <div class="offering-card" onclick="toggleOffering(this)">
              <span class="text-2xl block mb-1">🧸</span>
              <span class="text-[10px] font-bold block text-stone-700">Pelukan Erat</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Pelukan hangat penenang.</span>
              <div class="offering-stamp">💕 DITERIMA</div>
            </div>
            <div class="offering-card" onclick="toggleOffering(this)">
              <span class="text-2xl block mb-1">🌹</span>
              <span class="text-[10px] font-bold block text-stone-700">Bunga Cantik</span>
              <span class="text-[7.5px] opacity-75 block text-stone-500 font-sans">Simbol ketulusan hatiku.</span>
              <div class="offering-stamp">💕 DITERIMA</div>
            </div>
          </div>
          
          <!-- Heart indicator meter -->
          <div class="mt-4 px-2 space-y-1">
            <div class="flex justify-between text-[8px] font-bold text-pink-500 uppercase tracking-wider">
              <span>Indikator Maaf:</span>
              <span id="meter-score">0%</span>
            </div>
            <div class="progress-heart-outer">
              <div id="heart-meter" class="progress-heart-inner"></div>
            </div>
            <p id="forgive-alert" class="text-[7px] text-center text-green-500 font-bold pt-1 opacity-0 transition-opacity">Maaf terkumpul! Silakan buka halaman selanjutnya 💕</p>
          </div>
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-1 relative flex items-center justify-end">
        <button class="nav-bookmark next" id="page-1-next" onclick="turnPage(1, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 2: LINED PASTEL MEMO ── -->
    <div id="page-2" class="book-page flex flex-col justify-between" style="z-index: 30">
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Letter header -->
        <div class="border-b border-pink-100 pb-2 mb-2 ml-4 text-center">
          <h2 class="text-[8px] font-bold text-pink-400 uppercase tracking-widest font-fredoka">Surat Maafku</h2>
          <h1 class="font-fredoka text-xs sm:text-sm font-bold text-[#ff5a79] mt-0.5">${letterTitle}</h1>
        </div>

        <!-- memo pad text sheet -->
        <div class="notebook-journal-text ml-4 text-stone-700 flex-1 whitespace-pre-wrap break-words overflow-y-auto pr-1" id="typewriter-text" style="max-height: 290px;"></div>

        <!-- Voice note Cassette tape -->
        ${hasVoiceNote ? `
        <div class="cute-audio-player ml-4 p-3 flex items-center gap-3 mt-3 flex-shrink-0">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-[#ff758f] hover:bg-[#ff5c8a] text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-[9px] ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[6.5px] uppercase font-bold tracking-widest text-pink-400 font-fredoka mb-0.5">🎙️ Pesan Suara Maaf</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-pink-100 rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-[#ff758f] rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[8px] font-semibold text-[#ff758f] font-fredoka flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-2 relative">
        <button class="nav-bookmark prev" onclick="turnPage(2, false)">&larr; Prev</button>
        <button class="nav-bookmark next" onclick="turnPage(2, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 3: COUPLE WASHI TAPE SCRAPBOOK ── -->
    <div id="page-3" class="book-page check-bg flex flex-col justify-between" style="z-index: 20">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="text-center pb-2 border-b border-pink-150 mb-4 ml-4">
          <h2 class="text-[8px] font-bold text-pink-500 uppercase tracking-widest font-fredoka">my apologies</h2>
          <h1 class="font-fredoka text-sm font-bold text-pink-600">galeri sorryyy</h1>
        </div>

        <!-- Polaroid Stack -->
        <div class="flex-1 flex items-center justify-center relative min-h-[300px] overflow-hidden ml-4" id="gallery-container-node">
          ${config.photos && config.photos.length > 0 ? `
          <div class="relative w-full h-[280px] flex items-center justify-center" id="photo-deck">
            ${config.photos.map((photo, i) => {
              return `
              <div class="washi-polaroid p-2 w-[240px] absolute transition-all duration-500" 
                id="pcard-${i}"
                onclick="cyclePhoto(${i})">
                <div class="washi-tape"></div>
                <div class="w-full aspect-[4/3] overflow-hidden rounded bg-stone-50">
                  <img src="${photo.src}" alt="Apology Photo" class="w-full h-full object-cover">
                </div>
                ${photo.caption ? `
                <p class="text-center font-handwriting text-[16px] text-stone-600 mt-2 px-2 leading-snug break-words">${photo.caption}</p>
                ` : ""}
              </div>
              `;
            }).join("")}
          </div>
          ` : `
          <div class="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-pink-300 rounded-2xl">
            <span class="text-2xl text-pink-400">🧸</span>
            <p class="text-xs text-pink-500 font-medium mt-2 text-center">Jangan marah lama-lama ya...</p>
          </div>
          `}
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 mt-2 relative">
        <button class="nav-bookmark prev" onclick="turnPage(3, false)">&larr; Prev</button>
        <button class="nav-bookmark next" onclick="turnPage(3, true)">Next &rarr;</button>
      </div>
    </div>

    <!-- ── PAGE 4: INTERACTIVE TEDDY BEAR ── -->
    <div id="page-4" class="book-page flex flex-col justify-between" style="z-index: 10">
      
      <div class="text-center pb-2 border-b border-pink-100 mb-4 ml-4">
        <h2 class="text-[8px] font-bold text-pink-400 uppercase tracking-widest font-fredoka">Penyembuh Hati</h2>
        <h1 class="font-fredoka text-sm font-bold text-[#ff5a79]">Ketuk Teddy Bear</h1>
      </div>

      <!-- Teddy Bear -->
      <div class="relative flex-1 flex flex-col items-center justify-center ml-4">
        <div class="bear-wrapper" onclick="toggleBearNote()">
          <div class="bear-ear left"></div>
          <div class="bear-ear right"></div>
          <div class="bear-head">
            <div class="bear-eye left"></div>
            <div class="bear-eye right"></div>
            <div class="bear-blush left"></div>
            <div class="bear-blush right"></div>
            <div class="bear-snout">
              <div class="bear-nose"></div>
              <div class="bear-mouth"></div>
            </div>
          </div>
          <div class="bear-heart">
            <span class="heart-text">SORRY</span>
            <div class="heart-patch"></div>
          </div>
        </div>

        <p class="text-[9px] text-[#ff5a79] font-bold animate-pulse text-center uppercase tracking-wider mt-2">
          Ketuk Boneka Beruang
        </p>

        <!-- Apology Paper -->
        <div id="apology-paper">
          <p class="font-cursive text-sm text-[#ff5a79] font-bold border-b border-pink-100 pb-1">Aku Minta Maaf...</p>
          <div class="font-sans text-[10px] text-stone-600 leading-relaxed italic flex-1 mt-2 overflow-y-auto pr-0.5">
            ${config.finalMessage || "Aku tahu aku salah. Tolong maafkan aku ya? Aku janji bakal dengerin kamu lebih baik lagi ke depannya. Love you so much! ❤️"}
          </div>
          <p class="text-[7.5px] text-[#ff5a79] text-right uppercase tracking-wider font-bold mt-1.5">— Dari Kekasihmu yang Menyesal</p>
        </div>
      </div>

      <!-- Nav controls -->
      <div class="h-10 relative flex items-center justify-start">
        <button class="nav-bookmark prev" onclick="turnPage(4, false)">&larr; Prev</button>
      </div>
    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3 rounded-2xl max-w-sm w-full shadow-2xl relative" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-[#ffb5c5] shadow flex items-center justify-center font-bold text-[#ff5a79] hover:bg-stone-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl" src="" alt="Zoomed Photo">
      <p id="modal-caption" class="text-center font-handwriting text-xs text-stone-600 mt-3 px-2"></p>
    </div>
  </div>

  <!-- Script Logic -->
  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      fromName: ${JSON.stringify(config.fromName)},
      toName: ${JSON.stringify(config.toName)},
      letterTitle: ${JSON.stringify(letterTitle)},
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote}
    };

    function $(id) { return document.getElementById(id); }

    // 1. Spawning falling hearts
    const canvas = $('heart-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -20 - 20;
        this.size = Math.random() * 5 + 3;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.1;
        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff758f';
        ctx.beginPath();
        // Draw a heart shape
        ctx.moveTo(0, -this.size / 4);
        ctx.bezierCurveTo(-this.size/2, -this.size, -this.size, -this.size/2, -this.size, 0);
        ctx.bezierCurveTo(-this.size, this.size/2, 0, this.size, 0, this.size * 1.2);
        ctx.bezierCurveTo(0, this.size, this.size, this.size/2, this.size, 0);
        ctx.bezierCurveTo(this.size, -this.size/2, this.size/2, -this.size, 0, -this.size/4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 15; i++) {
      stars.push(new Star());
      stars[i].y = Math.random() * canvas.height;
    }

    function animateStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();

    // 2. Secret Code Gate
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        $('code-gate').classList.add('translate-y-[-100%]', 'opacity-0');
        playBgm();
        setTimeout(() => {
          $('code-gate').remove();
        }, 900);
      } else {
        $('code-err').classList.remove('opacity-0');
        $('code-input').classList.add('border-red-400', 'animate-shake');
        setTimeout(() => $('code-input').classList.remove('animate-shake'), 400);
      }
    }

    // 3. Peeling band-aid to complete gate
    function completeBandaidGate() {
      const bandaid = $('bandaid');
      const gate = $('bandaid-gate');
      if (!bandaid || !gate) return;
      
      bandaid.classList.add('peeled');
      playBgm();
      
      setTimeout(() => {
        gate.classList.add('translate-y-[-100%]', 'opacity-0');
        setTimeout(() => {
          gate.remove();
          triggerTypewriter();
        }, 1200);
      }, 500);
    }

    // 4. Forgiveness offering game
    let offeringsSelected = 0;
    function toggleOffering(card) {
      card.classList.toggle('active');
      const hasStamp = card.classList.contains('active');
      
      offeringsSelected += hasStamp ? 1 : -1;
      offeringsSelected = Math.max(0, Math.min(4, offeringsSelected));
      
      const pct = offeringsSelected * 25;
      $('heart-meter').style.width = pct + '%';
      $('meter-score').innerText = pct + '%';
      
      if (hasStamp) {
        spawnRowSparkles(card);
      }
      
      const alertEl = $('forgive-alert');
      if (offeringsSelected === 4) {
        alertEl.classList.remove('opacity-0');
      } else {
        alertEl.classList.add('opacity-0');
      }
    }

    function spawnRowSparkles(card) {
      const rect = card.getBoundingClientRect();
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle-float';
        sp.innerText = '💖';
        
        const rx = rect.left + (rect.width * 0.5) + (Math.random() * 40 - 20);
        const ry = rect.top + (rect.height / 2) + (Math.random() * 20 - 10);
        
        sp.style.left = rx + 'px';
        sp.style.top = ry + 'px';
        sp.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
        
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 1000);
      }
    }

    // 5. 3D Book Navigation flip logic
    let currentPageIndex = 0;
    const pages = [
      $('page-1'),
      $('page-2'),
      $('page-3'),
      $('page-4')
    ];

    function updateZIndices() {
      pages.forEach((p, idx) => {
        if (!p) return;
        if (p.classList.contains('flipped')) {
          p.style.zIndex = idx + 1; // Flipped layers sit on bottom
        } else {
          p.style.zIndex = 40 - idx * 10; // Unflipped layers stack on top
        }
      });
    }
    updateZIndices();

    function turnPage(pageIndex, goNext) {
      if (goNext) {
        // Enforce forgiveness board completed before continuing
        if (pageIndex === 1 && offeringsSelected < 4) {
          alert('Tolong kumpulkan semua Sesajen Maaf dulu ya agar hatiku reda... 🥺');
          return;
        }
        pages[pageIndex - 1].classList.add('flipped');
        currentPageIndex = pageIndex;
      } else {
        pages[pageIndex - 2].classList.remove('flipped');
        currentPageIndex = pageIndex - 1;
      }
      updateZIndices();
    }

    // 6. Typewriter engine for Page 2 Letter
    let typewriterStarted = false;
    function triggerTypewriter() {
      if (typewriterStarted) return;
      typewriterStarted = true;
      
      const container = $('typewriter-text');
      const text = CONFIG.letterBody;
      let index = 0;
      const speed = 25; // ms per character

      function type() {
        if (index < text.length) {
          container.innerHTML += text.charAt(index);
          index++;
          container.scrollTop = container.scrollHeight;
          setTimeout(type, speed);
        }
      }
      setTimeout(type, 500);
    }

    // 7. Interactive Teddy Bear logic
    let bearActive = false;
    function toggleBearNote() {
      const wrapper = document.querySelector('.bear-wrapper');
      const card = $('apology-paper');
      bearActive = !bearActive;
      if (bearActive) {
        wrapper.classList.add('active');
        card.classList.add('active');
        spawnHeartSparkle({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 - 100 });
      } else {
        wrapper.classList.remove('active');
        card.classList.remove('active');
      }
    }

    // 8. Polaroid cycling deck for Page 3 Scrapbook
    let currentPhotoIndex = 0;
    const photoCount = CONFIG.photos ? CONFIG.photos.length : 0;
    
    function initPhotoDeck() {
      if (photoCount === 0) return;
      for (let i = 0; i < photoCount; i++) {
        const card = $('pcard-' + i);
        if (!card) continue;
        
        let relativePos = (i - currentPhotoIndex + photoCount) % photoCount;
        
        card.style.opacity = '1';
        card.style.pointerEvents = relativePos === 0 ? 'auto' : 'none';
        
        if (relativePos === 0) {
          card.style.zIndex = 30;
          card.style.transform = 'scale(1.0) rotate(-2deg) translateY(0px) translateX(0px)';
        } else if (relativePos === 1) {
          card.style.zIndex = 20;
          card.style.transform = 'scale(0.94) rotate(4deg) translateY(6px) translateX(4px)';
        } else if (relativePos === 2) {
          card.style.zIndex = 10;
          card.style.transform = 'scale(0.88) rotate(-5deg) translateY(12px) translateX(-4px)';
        } else {
          card.style.zIndex = 5;
          card.style.transform = 'scale(0.82) rotate(0deg) translateY(18px)';
          card.style.opacity = '0';
        }
      }
    }
    
    setTimeout(initPhotoDeck, 100);

    function cyclePhoto(index) {
      if (photoCount <= 1) {
        zoomPhoto(CONFIG.photos[index].src, CONFIG.photos[index].caption || '');
        return;
      }
      
      if (index !== currentPhotoIndex) return;
      
      const topCard = $('pcard-' + index);
      if (!topCard) return;
      
      topCard.style.transform = 'translateX(130%) translateY(-20px) rotate(15deg) scale(0.95)';
      topCard.style.opacity = '0';
      
      setTimeout(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoCount;
        initPhotoDeck();
      }, 350);
    }

    function zoomPhoto(src, caption) {
      $('modal-img').src = src;
      $('modal-caption').innerText = caption || "";
      const modal = $('photo-modal');
      modal.classList.remove('opacity-0', 'pointer-events-none');
    }
    function closePhotoModal() {
      const modal = $('photo-modal');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }

    // 9. Audio Player Interface
    let isPlaying = false;
    let audio = $('audio-el');

    function initAudioMetadata() {
      const durationEl = $('audio-time');
      if (audio && audio.duration) {
        durationEl.innerText = formatTime(audio.duration);
      }
    }

    function toggleAudio() {
      const playIcon = $('play-icon');
      if (isPlaying) {
        audio.pause();
        playIcon.innerText = '▶';
        isPlaying = false;
        playBgm();
      } else {
        pauseBgm();
        audio.play().catch(err => console.error(err));
        playIcon.innerText = '⏸';
        isPlaying = true;
      }
    }

    function updateAudioProgress() {
      const progress = $('audio-progress');
      const timeDisplay = $('audio-time');
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = pct + '%';
        timeDisplay.innerText = formatTime(audio.currentTime);
      }
      if (audio.ended) {
        $('play-icon').innerText = '▶';
        progress.style.width = '0%';
        isPlaying = false;
        playBgm();
      }
    }

    function seekAudio(e) {
      const bar = $('mini-timeline');
      const rect = bar.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (audio.duration) {
        audio.currentTime = clickPos * audio.duration;
      }
    }

    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // 10. Background Music (BGM)
    const bgm = $('bgm-audio');
    let isBgmPlaying = false;
    let isBgmMuted = false;

    function playBgm() {
      if (bgm && !isBgmPlaying && !isBgmMuted && !isPlaying) {
        bgm.play().catch(e => console.log('BGM blocked:', e));
        isBgmPlaying = true;
        $('bgm-icon').innerText = '🎵';
      }
    }

    // Stop playback
    function pauseBgm() {
      if (bgm && isBgmPlaying) {
        bgm.pause();
        isBgmPlaying = false;
      }
    }

    function toggleBgm() {
      if (isBgmMuted) {
        isBgmMuted = false;
        $('bgm-icon').innerText = '🎵';
        if (!isPlaying) {
          bgm.play().catch(e => console.log(e));
          isBgmPlaying = true;
        }
      } else {
        isBgmMuted = true;
        $('bgm-icon').innerText = '🔇';
        bgm.pause();
        isBgmPlaying = false;
      }
    }

    // 11. Sparks on tap
    function spawnHeartSparkle(e) {
      // Don't spawn when clicking buttons or cards
      if (e.target.closest('button') || e.target.closest('.offering-card') || e.target.closest('.washi-polaroid')) {
        return;
      }
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'sparkle-float';
        star.innerText = ['❤️','✨','🧸','🍪','💕','🥺'][Math.floor(Math.random() * 6)];
        
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        
        star.style.setProperty('--dx', (Math.random() * 100 - 50) + 'px');
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
      }
    }
  </script>
</body>
</html>`;
}
