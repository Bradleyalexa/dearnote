import { PublishedConfig } from "../../schemas/card-draft";

export function generatePlayfulCatHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Catatan Spesial untuk Kucing Favoritku! 🐾";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  // Cozy and cute background music
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lullaby-1581.mp3";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cozy Cat Letter - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            fredoka: ['"Fredoka"', 'sans-serif'],
            quicksand: ['"Quicksand"', 'sans-serif'],
            script: ['"Caveat"', 'cursive'],
          }
        }
      }
    }
  </script>
  <style>
    /* Cozy Room Colors and Styling */
    body {
      background: linear-gradient(135deg, #FFF5EB 0%, #FFEBE6 50%, #FFE3D8 100%);
      min-height: 100vh;
      overflow-x: hidden;
      color: #5D4037;
      font-family: 'Quicksand', sans-serif;
      touch-action: manipulation;
    }

    /* Cozy wallpaper stripes overlay */
    .room-overlay {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(90deg, rgba(230, 185, 168, 0.08) 1px, transparent 1px);
      background-size: 20px 100%;
      pointer-events: none;
      z-index: 1;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(230, 185, 168, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(213, 142, 116, 0.4);
      border-radius: 3px;
    }

    /* --- Floating BGM Button --- */
    #bgm-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #FFB299;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(213, 142, 116, 0.2);
      z-index: 150;
      cursor: pointer;
      font-size: 1.25rem;
      transition: transform 0.2s, background-color 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }
    #bgm-btn.muted {
      background: #FFEBE6;
      border-color: #D3C2BC;
      color: #9C857E;
    }

    /* --- Code Gate Screen --- */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFF2E6 0%, #FFE0D3 100%);
      padding: 2rem;
      z-index: 1000;
      transition: clip-path 1.2s cubic-bezier(0.7, 0, 0.3, 1);
      clip-path: circle(150% at 50% 50%);
    }

    /* Cozy Cardboard Box */
    .box-container {
      width: 220px;
      height: 220px;
      position: relative;
      cursor: pointer;
      margin-bottom: 2rem;
      transform-style: preserve-3d;
      perspective: 1000px;
      transition: transform 0.3s ease;
    }
    .box-container:hover {
      transform: scale(1.03);
    }
    .box-container.shake {
      animation: boxShake 0.6s ease-in-out;
    }

    @keyframes boxShake {
      0%, 100% { transform: rotate(0deg); }
      15%, 45%, 75% { transform: rotate(-8deg) scale(1.02); }
      30%, 60%, 90% { transform: rotate(8deg) scale(1.02); }
    }

    .box-body {
      position: absolute;
      width: 100%;
      height: 150px;
      bottom: 0;
      background: #C68B59; /* Kraft Cardboard Color */
      border: 3px solid #784E29;
      border-radius: 4px;
      box-shadow: 0 12px 24px rgba(120, 78, 41, 0.15);
      z-index: 2;
      overflow: hidden;
    }
    /* Shadow inside box */
    .box-body::after {
      content: '';
      position: absolute;
      inset: 0;
      box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.1);
      pointer-events: none;
    }
    /* Cute Stamp / Label */
    .box-label {
      position: absolute;
      top: 40px;
      left: 30px;
      width: 80px;
      height: 50px;
      background: #FFF9F3;
      border: 2px dashed #9C7E6C;
      border-radius: 4px;
      transform: rotate(-5deg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: #9C7E6C;
      font-family: 'Fredoka', sans-serif;
    }
    .box-flap-l, .box-flap-r {
      position: absolute;
      width: 112px;
      height: 50px;
      background: #D9A066;
      border: 3px solid #784E29;
      top: 23px;
      z-index: 3;
      transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2);
    }
    .box-flap-l {
      left: -2px;
      border-radius: 4px 0 0 4px;
      transform-origin: left bottom;
    }
    .box-flap-r {
      right: -2px;
      border-radius: 0 4px 4px 0;
      transform-origin: right bottom;
    }
    .box-container.opened .box-flap-l {
      transform: rotate(-130deg);
    }
    .box-container.opened .box-flap-r {
      transform: rotate(130deg);
    }

    /* --- Interactive CSS Cat --- */
    .cat-wrapper {
      position: relative;
      width: 240px;
      height: 240px;
      margin: 0 auto;
      cursor: pointer;
    }
    .cat-body-container {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
    }

    /* Head */
    .cat-head {
      position: absolute;
      width: 140px;
      height: 115px;
      background: #F4A261; /* Rich Ginger Cat Orange */
      border: 4px solid #5D4037;
      border-radius: 50% 50% 45% 45%;
      top: 50px;
      left: 50px;
      z-index: 10;
      box-shadow: 0 8px 16px rgba(93, 64, 55, 0.1);
      transition: transform 0.15s ease-out;
    }
    /* Stripes on head */
    .cat-stripe-c {
      position: absolute;
      top: 0;
      left: 62px;
      width: 12px;
      height: 25px;
      background: #E76F51;
      border-radius: 0 0 6px 6px;
    }
    .cat-stripe-l {
      position: absolute;
      top: 5px;
      left: 35px;
      width: 10px;
      height: 20px;
      background: #E76F51;
      border-radius: 0 0 5px 5px;
      transform: rotate(15deg);
    }
    .cat-stripe-r {
      position: absolute;
      top: 5px;
      right: 35px;
      width: 10px;
      height: 20px;
      background: #E76F51;
      border-radius: 0 0 5px 5px;
      transform: rotate(-15deg);
    }

    /* Ears */
    .cat-ear-l, .cat-ear-r {
      position: absolute;
      width: 45px;
      height: 55px;
      background: #F4A261;
      border: 4px solid #5D4037;
      top: 15px;
      z-index: 9;
      transform-origin: bottom center;
      transition: transform 0.2s ease;
    }
    .cat-ear-l {
      left: 55px;
      border-radius: 40% 100% 0 30%;
      transform: rotate(-12deg);
    }
    .cat-ear-l::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 30px;
      background: #F4A261;
      border-left: 4px solid #5D4037;
      border-bottom: 4px solid #5D4037;
      border-radius: 0 0 0 100%;
      bottom: 2px;
      left: 2px;
      transform: rotate(10deg);
      background: #FFCDBC;
    }
    .cat-ear-r {
      right: 55px;
      border-radius: 100% 40% 30% 0;
      transform: rotate(12deg);
    }
    .cat-ear-r::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 30px;
      background: #F4A261;
      border-right: 4px solid #5D4037;
      border-bottom: 4px solid #5D4037;
      border-radius: 0 0 100% 0;
      bottom: 2px;
      right: 2px;
      transform: rotate(-10deg);
      background: #FFCDBC;
    }

    /* Eyes */
    .cat-eye-l, .cat-eye-r {
      position: absolute;
      width: 24px;
      height: 24px;
      background: #FFF;
      border: 3px solid #5D4037;
      border-radius: 50%;
      top: 45px;
      overflow: hidden;
      transition: height 0.1s ease, top 0.1s ease;
    }
    .cat-eye-l { left: 24px; }
    .cat-eye-r { right: 24px; }

    .cat-pupil {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #5D4037;
      border-radius: 50%;
      top: 4px;
      left: 4px;
      transition: transform 0.15s ease-out;
    }

    /* Whiskers */
    .cat-whiskers-l, .cat-whiskers-r {
      position: absolute;
      top: 65px;
      z-index: 11;
    }
    .cat-whiskers-l { left: -15px; }
    .cat-whiskers-r { right: -15px; }
    .whisker {
      width: 30px;
      height: 3px;
      background: #5D4037;
      margin-bottom: 6px;
      border-radius: 2px;
    }
    .cat-whiskers-l .whisker:nth-child(1) { transform: rotate(8deg); }
    .cat-whiskers-l .whisker:nth-child(2) { transform: rotate(0deg); }
    .cat-whiskers-l .whisker:nth-child(3) { transform: rotate(-8deg); }
    .cat-whiskers-r .whisker:nth-child(1) { transform: rotate(-8deg); }
    .cat-whiskers-r .whisker:nth-child(2) { transform: rotate(0deg); }
    .cat-whiskers-r .whisker:nth-child(3) { transform: rotate(8deg); }

    /* Muzzle & Nose */
    .cat-muzzle {
      position: absolute;
      width: 44px;
      height: 24px;
      background: #FFF9F3;
      border: 3px solid #5D4037;
      border-radius: 12px;
      top: 65px;
      left: 45px;
      z-index: 12;
    }
    .cat-nose {
      position: absolute;
      width: 12px;
      height: 8px;
      background: #E76F51;
      border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
      top: -3px;
      left: 13px;
    }

    /* Sleeping/Happy closed eyes (curves) */
    .cat-eye-closed-l, .cat-eye-closed-r {
      position: absolute;
      width: 24px;
      height: 10px;
      border-bottom: 4px solid #5D4037;
      border-radius: 0 0 12px 12px;
      top: 50px;
      display: none;
    }
    .cat-eye-closed-l { left: 24px; }
    .cat-eye-closed-r { right: 24px; }

    /* Cat Body */
    .cat-body {
      position: absolute;
      width: 130px;
      height: 100px;
      background: #F4A261;
      border: 4px solid #5D4037;
      border-radius: 80px 80px 40px 40px;
      bottom: 15px;
      left: 55px;
      z-index: 8;
    }
    .cat-chest {
      position: absolute;
      width: 60px;
      height: 60px;
      background: #FFF9F3;
      border-radius: 50%;
      top: -5px;
      left: 31px;
    }

    /* Paws */
    .cat-paw-l, .cat-paw-r {
      position: absolute;
      width: 32px;
      height: 32px;
      background: #FFF9F3;
      border: 4px solid #5D4037;
      border-radius: 50%;
      bottom: 5px;
      z-index: 15;
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .cat-paw-l { left: 70px; }
    .cat-paw-r { right: 70px; }

    /* Tail */
    .cat-tail {
      position: absolute;
      width: 22px;
      height: 90px;
      background: #F4A261;
      border: 4px solid #5D4037;
      border-radius: 12px;
      bottom: 30px;
      left: 45px;
      transform-origin: bottom center;
      z-index: 7;
      animation: swayTail 2.5s infinite ease-in-out;
    }
    .cat-tail::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 25px;
      background: #FFF9F3;
      border-radius: 6px;
      top: -1px;
      left: 0px;
    }

    @keyframes swayTail {
      0%, 100% { transform: rotate(-25deg); }
      50% { transform: rotate(15deg); }
    }

    /* Animations States */
    .cat-wrapper.sleeping .cat-eye-l,
    .cat-wrapper.sleeping .cat-eye-r {
      display: none;
    }
    .cat-wrapper.sleeping .cat-eye-closed-l,
    .cat-wrapper.sleeping .cat-eye-closed-r {
      display: block;
    }
    .cat-wrapper.sleeping .cat-ear-l { transform: rotate(-22deg); }
    .cat-wrapper.sleeping .cat-ear-r { transform: rotate(22deg); }

    .cat-wrapper.happy .cat-eye-l,
    .cat-wrapper.happy .cat-eye-r {
      display: none;
    }
    .cat-wrapper.happy .cat-eye-closed-l,
    .cat-wrapper.happy .cat-eye-closed-r {
      display: block;
      transform: scaleY(-1); /* Happy smile eyes */
      top: 54px;
    }
    .cat-wrapper.happy .cat-tail {
      animation: swayTailFast 0.8s infinite ease-in-out;
    }

    @keyframes swayTailFast {
      0%, 100% { transform: rotate(-35deg); }
      50% { transform: rotate(35deg); }
    }

    /* Laser Red Dot */
    #red-laser {
      position: absolute;
      width: 14px;
      height: 14px;
      background: #FF3366;
      border-radius: 50%;
      box-shadow: 0 0 10px 4px #FF3366, 0 0 4px 1px #FFF;
      pointer-events: none;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.2s;
    }

    /* Interactive Toy Buttons */
    .toy-btn {
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .toy-btn:hover {
      transform: translateY(-2px);
    }
    .toy-btn.active {
      background-color: #FF7E5F;
      color: white;
      border-color: #FF5E36;
      box-shadow: 0 4px 12px rgba(255, 126, 95, 0.3);
    }

    /* Love Meter Heart Beats */
    .heart-indicator {
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .heart-indicator.filled {
      color: #E76F51;
      transform: scale(1.2);
    }

    /* Claw Scratch Marks */
    .scratch-mark {
      position: absolute;
      width: 50px;
      height: 40px;
      background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, #C68B59 8px, #C68B59 10px);
      transform: rotate(-15deg);
      opacity: 0.7;
      pointer-events: none;
      z-index: 5;
      animation: fadeScratch 0.8s forwards;
    }
    @keyframes fadeScratch {
      0% { opacity: 0.8; transform: rotate(-15deg) scale(0.9); }
      100% { opacity: 0; transform: rotate(-20deg) scale(1.1); }
    }

    /* Fish cookie feed animation */
    .fish-treat-item {
      position: absolute;
      font-size: 28px;
      pointer-events: none;
      z-index: 80;
      transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* --- Yarn Unrolling Reveal Effect --- */
    #yarn-unroll-container {
      position: fixed;
      inset: 0;
      z-index: 400;
      display: none;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .yarn-line {
      position: absolute;
      stroke: #FF7E5F;
      stroke-width: 6;
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      fill: none;
    }
    .yarn-ball-roll {
      position: absolute;
      width: 70px;
      height: 70px;
      background: radial-gradient(circle at 30% 30%, #FFA893, #FF7E5F);
      border: 3px solid #5D4037;
      border-radius: 50%;
      z-index: 405;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      display: none;
    }

    /* --- The Letter Container --- */
    #letter-container {
      position: fixed;
      inset: 0;
      z-index: 300;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow-y: auto;
      padding: 2rem 1.25rem;
      background: linear-gradient(180deg, rgba(255, 245, 235, 0.95) 0%, rgba(255, 235, 230, 0.98) 100%);
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    #letter-container.show {
      display: flex;
      opacity: 1;
    }

    .letter-board {
      background: #FFFDFB;
      border: 4px solid #5D4037;
      border-radius: 28px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 16px 32px rgba(93, 64, 55, 0.12);
      padding: 2rem 1.5rem;
      position: relative;
      background-image: 
        radial-gradient(rgba(213, 142, 116, 0.1) 1.5px, transparent 1.5px);
      background-size: 16px 16px;
    }

    /* Yarn clothesline for Polaroid photos */
    .clothesline-container {
      position: relative;
      width: 100%;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .clothesline-container::-webkit-scrollbar {
      display: none;
    }
    .clothesline-string {
      position: absolute;
      top: 20px;
      left: 0;
      width: 3000px;
      height: 0;
      border-bottom: 3.5px dashed #C68B59;
      z-index: 1;
      pointer-events: none;
    }
    .clothesline-track {
      display: flex;
      gap: 1.25rem;
      padding: 1.5rem 1rem;
      width: max-content;
      min-width: 100%;
      justify-content: center;
      position: relative;
      z-index: 10;
    }
    .hanging-polaroid {
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0.1s;
      cursor: zoom-in;
    }
    .hanging-polaroid:hover {
      transform: scale(1.05) rotate(0deg) !important;
      z-index: 50;
    }


    /* Polaroid photo look */
    .polaroid-card {
      background: white;
      padding: 10px 10px 24px 10px;
      border: 3px solid #5D4037;
      box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    }

    /* Small decorative clothesline clip */
    .clothesline-clip {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 24px;
      background: #B68963;
      border: 2px solid #5D4037;
      border-radius: 3px;
      z-index: 10;
    }
    .clothesline-clip::after {
      content: '🐾';
      font-size: 8px;
      position: absolute;
      top: 4px;
      left: 1px;
    }

    /* Custom audio player shaped like a collar bell */
    .bell-audio-container {
      background: #FFEBE5;
      border: 3px solid #5D4037;
      border-radius: 20px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    .bell-icon-wrapper {
      width: 44px;
      height: 44px;
      background: #FFD54F; /* Golden collar bell */
      border: 3px solid #5D4037;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .bell-icon-wrapper:hover {
      transform: rotate(15deg) scale(1.05);
    }
    .bell-icon-wrapper.ringing {
      animation: bellRing 0.5s infinite ease-in-out;
    }
    @keyframes bellRing {
      0%, 100% { transform: rotate(0); }
      25% { transform: rotate(-15deg); }
      75% { transform: rotate(15deg); }
    }

    /* Speech Bubble */
    .speech-bubble {
      position: relative;
      background: #FFF9F3;
      border: 3px solid #5D4037;
      border-radius: 16px;
      padding: 0.75rem 1rem;
      max-width: 250px;
      text-align: center;
      box-shadow: 0 6px 12px rgba(93, 64, 55, 0.06);
      font-weight: 600;
      font-size: 13px;
    }
    .speech-bubble::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 12px 10px 0;
      border-style: solid;
      border-color: #5D4037 transparent;
      display: block;
      width: 0;
    }
    .speech-bubble::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px 8px 0;
      border-style: solid;
      border-color: #FFF9F3 transparent;
      display: block;
      width: 0;
      z-index: 1;
    }
  </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen relative p-4">
  <div class="room-overlay"></div>

  <!-- Background Music Element -->
  ${hasBgMusic ? `<audio id="bgm-audio" loop src="${bgMusicSrc}"></audio>` : ""}

  <!-- Floating BGM Button -->
  ${hasBgMusic ? `
  <div id="bgm-btn" onclick="toggleBgm()" title="Musik Latar">
    <span id="bgm-icon">♪</span>
  </div>
  ` : ""}

  <!-- ================= CODE GATE / BOX OPENING SCREEN ================= -->
  <div id="code-gate">
    <!-- Speech bubble for gate opening -->
    <div class="speech-bubble mb-6 scale-95" id="gate-bubble">
      Ada paket misterius untukmu! 📦 Ketuk untuk membukanya...
    </div>

    <!-- Taped Cardboard Box -->
    <div class="box-container" id="parcel-box" onclick="openDeliveryBox()">
      <div class="box-flap-l"></div>
      <div class="box-flap-r"></div>
      <div class="box-body">
        <div class="box-label">
          <span>DEARNOTE</span>
          <span class="text-[8px] mt-1">EXPRESS 🐾</span>
        </div>
      </div>
    </div>

    <!-- Passcode Gate (only visible if secret code configured) -->
    ${hasSecretCode ? `
    <div class="w-full max-w-xs bg-white border-4 border-dashed border-[#FFB299] p-5 rounded-2xl shadow-xl z-20 flex flex-col items-center">
      <span class="text-xs font-bold uppercase tracking-wider text-[#FF7E5F] mb-2 block">Masukkan Kode Akses</span>
      <div class="flex gap-2 mb-4 justify-center">
        <input type="text" id="secret-code-input" maxlength="12" placeholder="Ketik sandi..." 
               class="px-4 py-2 border-2 border-[#5D4037] rounded-xl text-center font-bold text-sm tracking-widest focus:outline-none focus:border-[#FF7E5F] w-48 text-[#5D4037]">
      </div>
      <button onclick="verifyCode()" class="px-5 py-2 bg-[#FF7E5F] hover:bg-[#FF6B4A] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all border-2 border-[#5D4037]">
        Buka Paket 🔑
      </button>
      <p id="gate-error" class="text-xs text-red-500 font-bold mt-2 hidden">Kode salah! Coba lagi ya 🐾</p>
    </div>
    ` : ""}
  </div>

  <!-- ================= PLAYGROUND SCREEN ================= -->
  <div id="playground-screen" class="hidden flex flex-col items-center w-full max-w-sm z-10 px-4">
    <!-- speech bubble -->
    <div class="speech-bubble mb-4 scale-95" id="cat-speech">
      Nyaaa~ Halo! Aku manis sekali kan? Ayo bermain denganku! 🐾
    </div>

    <!-- Love Meter / Affection Progress -->
    <div class="w-full max-w-[280px] bg-white border-3 border-[#5D4037] rounded-full p-2.5 flex items-center justify-between mb-8 shadow-md">
      <span class="text-xs font-bold text-[#5D4037] ml-2">Meter Kasih Sayang:</span>
      <div class="flex gap-1.5 mr-2">
        <span class="heart-indicator text-lg" id="heart-1">🤍</span>
        <span class="heart-indicator text-lg" id="heart-2">🤍</span>
        <span class="heart-indicator text-lg" id="heart-3">🤍</span>
      </div>
    </div>

    <!-- Cat Interactive Canvas / Wrapper -->
    <div class="relative w-full h-[260px] flex items-center justify-center select-none" id="cat-playground">
      <!-- The laser dot -->
      <div id="red-laser"></div>

      <!-- Custom CSS Ginger Cat -->
      <div class="cat-wrapper" id="cat-avatar">
        <div class="cat-body-container">
          <!-- Ears -->
          <div class="cat-ear-l"></div>
          <div class="cat-ear-r"></div>

          <!-- Body parts -->
          <div class="cat-tail"></div>
          <div class="cat-body">
            <div class="cat-chest"></div>
          </div>

          <!-- Head -->
          <div class="cat-head" id="cat-head-el">
            <div class="cat-stripe-c"></div>
            <div class="cat-stripe-l"></div>
            <div class="cat-stripe-r"></div>

            <!-- Eyes -->
            <div class="cat-eye-l" id="eye-left-el">
              <div class="cat-pupil" id="pupil-left-el"></div>
            </div>
            <div class="cat-eye-r" id="eye-right-el">
              <div class="cat-pupil" id="pupil-right-el"></div>
            </div>
            <!-- Closed/Happy Eyes -->
            <div class="cat-eye-closed-l"></div>
            <div class="cat-eye-closed-r"></div>

            <!-- Whiskers -->
            <div class="cat-whiskers-l">
              <div class="whisker"></div>
              <div class="whisker"></div>
              <div class="whisker"></div>
            </div>
            <div class="cat-whiskers-r">
              <div class="whisker"></div>
              <div class="whisker"></div>
              <div class="whisker"></div>
            </div>

            <!-- Muzzle & Nose -->
            <div class="cat-muzzle">
              <div class="cat-nose"></div>
            </div>
          </div>

          <!-- Paws -->
          <div class="cat-paw-l" id="cat-paw-l-el"></div>
          <div class="cat-paw-r" id="cat-paw-r-el"></div>
        </div>
      </div>
    </div>

    <!-- Toy & Care Dashboard -->
    <div class="w-full grid grid-cols-3 gap-3 mt-6">
      <button onclick="selectToy('laser')" id="btn-laser" class="toy-btn bg-white border-3 border-[#5D4037] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm font-bold text-xs">
        <span class="text-xl">🔴</span>
        <span>Main Laser</span>
      </button>
      <button onclick="feedFishCookie()" id="btn-fish" class="toy-btn bg-white border-3 border-[#5D4037] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm font-bold text-xs">
        <span class="text-xl">🐟</span>
        <span>Beri Ikan</span>
      </button>
      <button onclick="selectToy('pet')" id="btn-pet" class="toy-btn bg-white border-3 border-[#5D4037] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm font-bold text-xs">
        <span class="text-xl">🌾</span>
        <span>Manjakan</span>
      </button>
    </div>
  </div>

  <!-- ================= YARN BALL CONFETTI / UNROLLING ================= -->
  <div id="yarn-unroll-container">
    <svg class="w-full h-full absolute inset-0">
      <path id="yarn-draw-path" class="yarn-line" d=""></path>
    </svg>
    <div class="yarn-ball-roll" id="yarn-rolling-ball"></div>
  </div>

  <!-- ================= THE MESSAGE LETTERBOARD SCREEN ================= -->
  <div id="letter-container">
    <div class="letter-board flex flex-col">
      <!-- Title -->
      <h1 class="font-fredoka text-2xl font-bold text-center text-[#5D4037] mb-6 leading-tight">
        ${letterTitle}
      </h1>

      <!-- Clothesline Photo Gallery (if photos exist) -->
      <div id="photos-rack" class="hidden clothesline-container">
        <div class="clothesline-string"></div>
        <div class="clothesline-track" id="polaroids-grid">
          <!-- Dynamically populated -->
        </div>
      </div>

      <!-- Handwritten Letter Body -->
      <div class="bg-[#FFFDF3] border-3 border-[#D3C2BC] rounded-2xl p-5 mb-6 shadow-inner relative overflow-hidden font-script text-xl text-[#5D4037] leading-relaxed min-h-[150px]">
        <div class="absolute -right-4 -bottom-4 opacity-10 text-6xl select-none">🐾</div>
        <div id="letter-body-content"></div>
      </div>

      <!-- Voice Note Player (if exists) -->
      ${hasVoiceNote ? `
      <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudio()"></audio>
      <div class="mb-6">
        <span class="text-xs font-bold text-[#8C6D62] mb-2 block text-center">Pesan Suara Dari ${config.fromName} 🎧</span>
        <div class="bell-audio-container">
          <div class="bell-icon-wrapper" id="bell-player" onclick="toggleAudio()">
            <span id="play-icon">▶</span>
          </div>
          <div class="flex-1">
            <div class="relative w-full h-2.5 bg-[#E4D1CA] rounded-full cursor-pointer overflow-hidden border border-[#5D4037]/20" id="mini-track" onclick="seekAudio(event)">
              <div class="absolute top-0 left-0 h-full bg-[#FF7E5F] rounded-full" id="audio-bar" style="width: 0%"></div>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span class="text-[10px] font-bold text-[#8C6D62] uppercase tracking-wider">Durasi</span>
              <span class="text-[10px] font-bold text-[#8C6D62]" id="mini-time">0:00</span>
            </div>
          </div>
        </div>
      </div>
      ` : ""}

      <!-- Final Message / Footer -->
      ${config.finalMessage ? `
      <div class="text-center font-fredoka font-semibold text-sm text-[#FF7E5F] mb-6 tracking-wide px-4">
        💖 ${config.finalMessage}
      </div>
      ` : ""}

      <div class="border-t border-[#E8DFDB] pt-4 text-center">
        <p class="text-[10px] font-bold uppercase tracking-wider text-[#9C857E]">
          Dari: <span class="text-[#FF7E5F]">${config.fromName}</span> • Untuk: <span class="text-[#FF7E5F]">${config.toName}</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Soft Photo Zoom Modal -->
  <div id="photo-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300" onclick="closePhotoModal()">
    <div class="bg-white p-3.5 rounded-2xl max-w-xs w-full shadow-2xl relative border-4 border-[#5D4037]" onclick="event.stopPropagation()">
      <button class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-3 border-[#5D4037] shadow flex items-center justify-center font-bold text-[#5D4037] hover:bg-stone-50" onclick="closePhotoModal()">×</button>
      <img id="modal-img" class="w-full aspect-[4/3] object-cover rounded-xl border-2 border-[#5D4037] cursor-zoom-out" src="" alt="Zoomed Photo" onclick="closePhotoModal()">
      <p id="modal-caption" class="text-center font-script text-lg text-[#5D4037] mt-3 px-2"></p>
    </div>
  </div>

  <!-- JavaScript and Interactions -->
  <script>
    const CONFIG = {
      hasSecretCode: ${hasSecretCode},
      secretCode: "${config.secretCode || ""}",
      letterBody: ${escapedLetterBody},
      photos: ${photosJson}
    };

    function \$(id) { return document.getElementById(id); }

    // Check if secret code is set
    window.addEventListener('load', () => {
      if (!CONFIG.hasSecretCode) {
        // No code, box triggers open directly when clicked
      }
    });

    /* --- Password Verification --- */
    function verifyCode() {
      const codeInput = \$('secret-code-input');
      const errorMsg = \$('gate-error');
      if (codeInput.value.trim().toLowerCase() === CONFIG.secretCode.toLowerCase()) {
        errorMsg.classList.add('hidden');
        openBoxSequence();
      } else {
        errorMsg.classList.remove('hidden');
        // Shake the card-gate input box
        codeInput.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300 });
      }
    }

    /* --- Box Opening Sequence --- */
    let boxOpened = false;
    function openDeliveryBox() {
      if (boxOpened) return;
      
      // If code is required, prompt user first (if not entered)
      if (CONFIG.hasSecretCode) {
        const input = \$('secret-code-input');
        if (input && input.value.trim() === "") {
          \$('gate-bubble').innerText = "Masukkan kode akses di bawah dulu ya! 🐾";
          input.focus();
          return;
        }
        verifyCode();
        return;
      }
      openBoxSequence();
    }

    function openBoxSequence() {
      boxOpened = true;
      const box = \$('parcel-box');
      box.classList.add('shake');

      // Start BGM on user interaction
      startBgm();

      setTimeout(() => {
        box.classList.remove('shake');
        box.classList.add('opened');
        \$('gate-bubble').innerText = "Nyaaa~ 🐱🐾";
      }, 600);

      // Transition to playground
      setTimeout(() => {
        \$('code-gate').style.clipPath = 'circle(0% at 50% 50%)';
        setTimeout(() => {
          const gate = \$('code-gate');
          if (gate) {
            gate.style.display = 'none';
            gate.classList.add('hidden');
          }
          \$('playground-screen').classList.remove('hidden');
          initPlayground();
        }, 800);
      }, 1500);
    }

    /* --- Playground Games & Logic --- */
    let currentToy = null;
    let completedInteractions = new Set();
    let affectionLevel = 0;
    const catAvatar = \$('cat-avatar');
    const speech = \$('cat-speech');

    function initPlayground() {
      const playground = \$('cat-playground');
      
      // Eye Tracking variables
      const head = \$('cat-head-el');
      const pupils = [\$('pupil-left-el'), \$('pupil-right-el')];

      // Laser dot movement
      const laser = \$('red-laser');

      playground.addEventListener('mousemove', (e) => {
        if (currentToy !== 'laser') return;
        const rect = playground.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateLaserPosition(x, y);
      });

      playground.addEventListener('touchmove', (e) => {
        if (currentToy !== 'laser') return;
        const rect = playground.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        updateLaserPosition(x, y);
      });

      // Pet/Manjakan dragging/tickling
      playground.addEventListener('mousemove', (e) => {
        if (currentToy !== 'pet') return;
        const headRect = head.getBoundingClientRect();
        if (e.clientX >= headRect.left && e.clientX <= headRect.right &&
            e.clientY >= headRect.top && e.clientY <= headRect.bottom) {
          triggerPetTickle();
        }
      });
      playground.addEventListener('touchmove', (e) => {
        if (currentToy !== 'pet') return;
        const touch = e.touches[0];
        const headRect = head.getBoundingClientRect();
        if (touch.clientX >= headRect.left && touch.clientX <= headRect.right &&
            touch.clientY >= headRect.top && touch.clientY <= headRect.bottom) {
          triggerPetTickle();
        }
      });

      // Tap on playground trigger swipe paw in laser mode
      playground.addEventListener('click', (e) => {
        if (currentToy === 'laser') {
          triggerLaserScratch(e);
        }
      });
    }

    // Direct Preview Bypass helper
    window.openDeliveryBoxDirect = function() {
      if (boxOpened) return;
      boxOpened = true;
      const gate = \$('code-gate');
      if (gate) gate.style.display = 'none';
      const screen = \$('playground-screen');
      if (screen) screen.classList.remove('hidden');
      initPlayground();
    };

    function selectToy(toy) {
      currentToy = (currentToy === toy) ? null : toy;

      // Reset styles
      \$('btn-laser').classList.remove('active');
      \$('btn-pet').classList.remove('active');
      \$('red-laser').style.opacity = '0';
      document.body.style.cursor = 'default';

      if (currentToy === 'laser') {
        \$('btn-laser').classList.add('active');
        \$('red-laser').style.opacity = '1';
        document.body.style.cursor = 'none';
        speech.innerText = "Wah, ada bintik merah! Tangkap dia! 🔴🐾";
      } else if (currentToy === 'pet') {
        \$('btn-pet').classList.add('active');
        speech.innerText = "Usap kepala ku pelan-pelan ya... Meow~ 🥰";
      } else {
        speech.innerText = "Ayo main denganku lagi! Meow~ 🐾";
      }
    }

    /* --- Laser Tracking --- */
    function updateLaserPosition(x, y) {
      const laser = \$('red-laser');
      laser.style.left = (x - 7) + 'px';
      laser.style.top = (y - 7) + 'px';

      // Eye Tracking
      const head = \$('cat-head-el');
      const headRect = head.getBoundingClientRect();
      const playRect = \$('cat-playground').getBoundingClientRect();
      
      const headCenterX = headRect.left + headRect.width / 2 - playRect.left;
      const headCenterY = headRect.top + headRect.height / 2 - playRect.top;

      const dx = x - headCenterX;
      const dy = y - headCenterY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      const maxPupilMove = 6;
      const moveX = (dx / (distance || 1)) * maxPupilMove;
      const moveY = (dy / (distance || 1)) * maxPupilMove;

      \$('pupil-left-el').style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      \$('pupil-right-el').style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
    }

    function triggerLaserScratch(e) {
      const pawL = \$('cat-paw-l-el');
      const pawR = \$('cat-paw-r-el');
      const play = \$('cat-playground');
      const rect = play.getBoundingClientRect();

      const tapX = e.clientX - rect.left;
      const tapY = e.clientY - rect.top;

      // Scratch Overlay Mark
      const scratch = document.createElement('div');
      scratch.className = 'scratch-mark';
      scratch.style.left = (tapX - 25) + 'px';
      scratch.style.top = (tapY - 20) + 'px';
      play.appendChild(scratch);
      setTimeout(() => scratch.remove(), 800);

      // Animate paw swiping
      if (tapX < rect.width / 2) {
        pawL.style.transform = 'translate(' + (tapX - 90) + 'px, ' + (tapY - 180) + 'px) scale(1.2)';
        setTimeout(() => pawL.style.transform = 'translate(0,0)', 300);
      } else {
        pawR.style.transform = 'translate(' + (tapX - 150) + 'px, ' + (tapY - 180) + 'px) scale(1.2)';
        setTimeout(() => pawR.style.transform = 'translate(0,0)', 300);
      }

      // Add Progress
      if (!completedInteractions.has('laser')) {
        completedInteractions.add('laser');
        addAffection();
      }
      speech.innerText = "Kena kau! Hahaha cakaranku cepat kan? 😼✨";
    }

    /* --- Feeding Treat --- */
    let feedingActive = false;
    function feedFishCookie() {
      if (feedingActive) return;
      feedingActive = true;
      selectToy(null); // deselect others

      const play = \$('cat-playground');
      const treat = document.createElement('div');
      treat.className = 'fish-treat-item';
      treat.innerHTML = '🐟';
      treat.style.left = '160px';
      treat.style.top = '220px';
      play.appendChild(treat);

      speech.innerText = "Ayam? Daging? Bukan, ini biskuit ikan kesukaanku! 🐟✨";

      // Fly to mouth
      setTimeout(() => {
        treat.style.left = '110px';
        treat.style.top = '115px';
        treat.style.transform = 'scale(0.7) rotate(25deg)';
      }, 100);

      // Eat crunch
      setTimeout(() => {
        treat.remove();
        catAvatar.classList.add('happy');
        speech.innerText = "Nyam nyam crunch... Enak sekali! Meow~ Purr~ 🍽️🥰";
        
        if (!completedInteractions.has('feed')) {
          completedInteractions.add('feed');
          addAffection();
        }
      }, 800);

      setTimeout(() => {
        catAvatar.classList.remove('happy');
        feedingActive = false;
      }, 2000);
    }

    /* --- Petting Wand --- */
    let pettingTimer = null;
    let pettingAccumulator = 0;
    function triggerPetTickle() {
      if (pettingTimer) return;

      catAvatar.classList.add('happy');
      speech.innerText = "Purrr... Nyaman sekali... Usap lagi kepala ku... 🥰";

      // Heart ripples
      const play = \$('cat-playground');
      const heart = document.createElement('div');
      heart.innerText = '❤️';
      heart.style.position = 'absolute';
      heart.style.left = (100 + Math.random() * 40) + 'px';
      heart.style.top = '60px';
      heart.style.fontSize = '14px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '50';
      play.appendChild(heart);

      heart.animate([
        { transform: 'translateY(0) scale(0.8)', opacity: 1 },
        { transform: 'translateY(-40px) scale(1.2)', opacity: 0 }
      ], { duration: 1000, fill: 'forwards' });
      setTimeout(() => heart.remove(), 1000);

      pettingAccumulator++;
      if (pettingAccumulator >= 12 && !completedInteractions.has('pet')) {
        completedInteractions.add('pet');
        addAffection();
      }

      pettingTimer = setTimeout(() => {
        catAvatar.classList.remove('happy');
        pettingTimer = null;
      }, 500);
    }

    /* --- Love Meter Progress --- */
    function addAffection() {
      affectionLevel++;
      const heart = \$('heart-' + affectionLevel);
      if (heart) {
        heart.innerText = '💖';
        heart.classList.add('filled');
      }

      if (affectionLevel >= 3) {
        // Unlock Letter Board
        setTimeout(triggerUnlockSequence, 1200);
      }
    }

    /* --- Transition & Yarn Unrolling Animation --- */
    function triggerUnlockSequence() {
      selectToy(null);
      speech.innerText = "Wah, aku sayang kamu! Ini pesan rahasia terindah... 🧶🎉";
      catAvatar.classList.add('happy');
      
      createPlaygroundConfetti();

      // Start Roll out
      setTimeout(() => {
        \$('playground-screen').style.opacity = '0';
        \$('playground-screen').style.transition = 'opacity 0.6s';
        
        setTimeout(() => {
          \$('playground-screen').classList.add('hidden');
          startCanvasYarnDraw();
        }, 600);
      }, 1500);
    }

    function createPlaygroundConfetti() {
      const container = document.body;
      const emojis = ['🐾', '🐟', '🧶', '✨', '❤️', '💖'];
      for (let i = 0; i < 30; i++) {
        const item = document.createElement('div');
        item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        item.style.position = 'fixed';
        item.style.zIndex = '250';
        item.style.left = '50vw';
        item.style.top = '45vh';
        item.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
        item.style.pointerEvents = 'none';
        container.appendChild(item);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 160 + 100;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        item.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.5)', opacity: 0 }
        ], {
          duration: 1200 + Math.random() * 600,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
          fill: 'forwards'
        });

        setTimeout(() => item.remove(), 2000);
      }
    }

    function startCanvasYarnDraw() {
      const container = \$('yarn-unroll-container');
      const ball = \$('yarn-rolling-ball');
      const path = \$('yarn-draw-path');
      
      container.style.display = 'flex';
      ball.style.display = 'block';

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Define path for unrolling yarn (spiral or loop)
      const dPath = 'M ' + (w/2) + ' ' + (h/2) + 
                    ' Q ' + (w/2 - 60) + ' ' + (h/2 - 100) + ', ' + (w/2 - 100) + ' ' + (h/2) + 
                    ' T ' + (w/2 + 100) + ' ' + (h/2) + 
                    ' T ' + (w/2) + ' ' + (h/2 + 100) + 
                    ' C ' + (w/2 - 150) + ' ' + (h/2 + 200) + ', ' + (w/2 + 150) + ' ' + (h + 100) + ', ' + (w/2) + ' ' + (h + 150);

      path.setAttribute('d', dPath);

      // Animate Ball along path (approximate screen coordinates)
      ball.animate([
        { left: (w/2 - 35) + 'px', top: (h/2 - 35) + 'px', transform: 'rotate(0deg)' },
        { left: (w/2 - 135) + 'px', top: (h/2 - 35) + 'px', transform: 'rotate(-90deg)' },
        { left: (w/2 + 65) + 'px', top: (h/2 - 35) + 'px', transform: 'rotate(180deg)' },
        { left: (w/2 - 35) + 'px', top: (h/2 + 65) + 'px', transform: 'rotate(360deg)' },
        { left: (w/2 - 35) + 'px', top: (h + 100) + 'px', transform: 'rotate(720deg)' }
      ], {
        duration: 1800,
        easing: 'ease-in-out',
        fill: 'forwards'
      });

      // Animate Line path unroll
      path.animate([
        { strokeDashoffset: 1000 },
        { strokeDashoffset: 0 }
      ], {
        duration: 1800,
        easing: 'ease-in-out',
        fill: 'forwards'
      });

      setTimeout(() => {
        container.style.display = 'none';
        
        // Show letter screen
        const letter = \$('letter-container');
        letter.classList.add('show');
        
        // Populate letter elements
        populateLetterContent();
      }, 1900);
    }

    /* --- Populate Letterboard Content --- */
    function populateLetterContent() {
      // 1. Photos clothesline
      const photos = CONFIG.photos;
      if (photos && photos.length > 0) {
        $('photos-rack').classList.remove('hidden');
        const grid = $('polaroids-grid');
        grid.innerHTML = '';
        
        if (photos.length > 2) {
          grid.style.justifyContent = 'flex-start';
        } else {
          grid.style.justifyContent = 'center';
        }
        
        photos.forEach((photo, idx) => {
          const col = document.createElement('div');
          col.className = 'hanging-polaroid relative flex-shrink-0';
          
          const tiltDeg = (idx % 2 === 0) ? -3 - (idx % 3) : 3 + (idx % 3);
          col.style.transform = 'rotate(' + tiltDeg + 'deg)';
          col.onclick = function() { openPhotoModal(photo.src, photo.caption || ""); };
          
          col.innerHTML = \`
            <div class="clothesline-clip"></div>
            <div class="polaroid-card">
              <img src="\${photo.src}" alt="Foto Kenangan" class="w-[130px] h-[130px] object-cover border-2 border-[#5D4037]">
              \${photo.caption ? \`<p class="font-script text-center text-sm text-[#5D4037] mt-3 w-[130px] polaroid-caption">\${photo.caption}</p>\` : ''}
            </div>
          \`;
          grid.appendChild(col);
        });
      }

      // 2. Body Text Typewriter
      startLetterTypewriter();
    }

    function openPhotoModal(src, caption) {
      $('modal-img').src = src;
      $('modal-caption').innerText = caption || '';
      const modal = $('photo-modal');
      if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
      }
    }

    function closePhotoModal() {
      const modal = $('photo-modal');
      if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
      }
    }

    function startLetterTypewriter() {
      const text = CONFIG.letterBody;
      const el = \$('letter-body-content');
      el.innerHTML = '';
      
      let idx = 0;
      const cursor = document.createElement('span');
      cursor.className = 'w-1 h-5 bg-[#FF7E5F] inline-block animate-pulse ml-0.5 align-middle';
      el.appendChild(cursor);

      function type() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (idx < limit) {
          cursor.before(document.createTextNode(text[idx++]));
          setTimeout(type, 30);
        } else if (text.length > 1000) {
          const remaining = text.substring(idx);
          const span = document.createElement('span');
          span.style.opacity = '0';
          span.style.transition = 'opacity 1.0s ease-in-out';
          span.innerHTML = remaining;
          cursor.before(span);
          setTimeout(() => { span.style.opacity = '1'; }, 50);
          cursor.remove();
        } else {
          cursor.remove();
        }
      }
      type();
    }

    /* --- Voice Note Player --- */
    let audioPlaying = false;
    function getAudio() { return \$('audio-el'); }
    
    function toggleAudio() {
      const a = getAudio();
      if (!a) return;
      const bell = \$('bell-player');
      const icon = \$('play-icon');

      if (audioPlaying) {
        a.pause();
        bell.classList.remove('ringing');
        icon.innerText = '▶';
        audioPlaying = false;
        startBgm();
      } else {
        pauseBgm();
        a.play().catch(err => console.log('Audio blocked:', err));
        bell.classList.add('ringing');
        icon.innerText = '❚❚';
        audioPlaying = true;
      }
    }

    function updateAudio() {
      const a = getAudio();
      if (!a || !a.duration) return;
      \$('audio-bar').style.width = (a.currentTime / a.duration * 100) + '%';
      \$('mini-time').innerText = fmt(a.currentTime);
      if (a.ended) {
        \$('play-icon').innerText = '▶';
        \$('bell-player').classList.remove('ringing');
        audioPlaying = false;
        startBgm();
      }
    }

    function seekAudio(e) {
      const a = getAudio();
      if (!a) return;
      const r = \$('mini-track').getBoundingClientRect();
      if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    }

    function fmt(s) {
      if (!s || isNaN(s)) return '0:00';
      return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    /* --- Background Music (BGM) --- */
    let bgmOn = false;
    let bgmMuted = false;
    function getBgm() { return \$('bgm-audio'); }
    
    function startBgm() {
      const b = getBgm();
      if (b && !bgmMuted && !audioPlaying && !bgmOn) {
        b.play().catch(e => console.log('BGM Autoplay blocked:', e));
        bgmOn = true;
      }
    }

    function pauseBgm() {
      const b = getBgm();
      if (b && bgmOn) {
        b.pause();
        bgmOn = false;
      }
    }

    function toggleBgm() {
      const b = getBgm();
      if (!b) return;
      bgmMuted = !bgmMuted;
      
      const btn = \$('bgm-btn');
      const icon = \$('bgm-icon');
      
      if (bgmMuted) {
        b.pause();
        btn.classList.add('muted');
        icon.innerText = '♪̶';
        bgmOn = false;
      } else {
        btn.classList.remove('muted');
        icon.innerText = '♪';
        if (!audioPlaying) {
          b.play().catch(() => {});
          bgmOn = true;
        }
      }
    }
  </script>
</body>
</html>`;
}
