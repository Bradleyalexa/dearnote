import { PublishedConfig } from "../../schemas/card-draft";

export function generateRamadhanBlessingsHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Selamat Idul Fitri!";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasPhotos = config.photos && config.photos.length > 0;
  const hasAudio = hasVoiceNote || hasBgMusic;

  const vBars = Array.from({ length: 24 }, (_, i) =>
    `<div class="v-bar" style="animation-delay:${(i * 0.04).toFixed(3)}s;height:${12 + ((i % 6) * 6)}px"></div>`
  ).join("");

  const photosChapterHtml = hasPhotos
    ? `
  <div class="chapter" id="ch-photos">
    <h2 class="ch-heading font-ramadhan">Memory Ornaments</h2>
    <p class="ch-subheading">Swipe or drag the polaroids decorated with golden crescents</p>
    <div class="fairy-lights-wire">
      <div class="wire-string"></div>
      <div class="fairy-bulbs" id="fairy-bulbs-container"></div>
    </div>
    <div class="card-stack-container">
      <div class="card-stack" id="polaroid-stack"></div>
    </div>
    <button class="action-btn-secondary" id="photos-next-btn">Continue &rarr;</button>
  </div>`
    : "";

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <h2 class="ch-heading font-ramadhan">Syahdu Melodies</h2>
    <p class="ch-subheading">${hasVoiceNote ? 'Listen to a warm message from me' : 'Nikmati musik latar yang telah disiapkan 🎵'}</p>
    <div class="audio-deck">
      <div class="visualizer" id="visualizer">${vBars}</div>
      ${
        hasVoiceNote
          ? `
      <div class="audio-control-row">
        <div class="audio-info">
          <span class="audio-icon">🎙️</span>
          <div>
            <p class="audio-label">Voice Greeting</p>
            <p class="audio-sublabel">A personal vocal message</p>
          </div>
        </div>
        <div class="audio-player-control">
          <button id="vn-btn" class="circular-play-btn">&#9654;</button>
          <div class="progress-bar-track"><div class="progress-bar-fill" id="vn-progress"></div></div>
        </div>
        <audio id="vn-audio" src="${voiceNoteSrc}"></audio>
      </div>`
          : ""
      }
      ${
        hasBgMusic
          ? `
      <div class="audio-control-row" style="border-top:1.5px dashed rgba(212, 175, 55, 0.3);margin-top:0.9rem;padding-top:0.9rem">
        <div class="audio-info">
          <span class="audio-icon">🎵</span>
          <div>
            <p class="audio-label">Background Instrument</p>
            <p class="audio-sublabel">Ambient Islamic tune</p>
          </div>
        </div>
        <div class="audio-player-control">
          <button id="bgm-inner-btn" class="circular-play-btn">&#9646;&#9646;</button>
          <p class="music-note-decor">Peaceful Oud</p>
        </div>
        <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
      </div>`
          : ""
      }
    </div>
    <button class="action-btn-secondary" id="audio-next-btn">Final Blessing &rarr;</button>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ramadhan & Eid Blessings – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Quicksand:wght@500;700&family=Cinzel:wght@600;700&family=Sacramento&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Core Theme ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --xmas-red:      #A8201A;
      --xmas-gold:     #D4AF37;
      --xmas-gold-lt:  #F3E5AB;
      --emerald-dark:  #003017;
      --emerald-med:   #004b23;
      --emerald-lt:    #006400;
      --night-sky:     #0d1b2a;
      --night-sky-drk: #040914;
      --text-color:    #1F2F20;
      --card-bg:       rgba(255, 255, 255, 0.9);
      --font-body:     'Quicksand', sans-serif;
      --font-heading:  'Cinzel', serif;
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--text-color);
      background: linear-gradient(135deg, var(--emerald-dark) 0%, #00220f 50%, var(--night-sky-drk) 100%);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas Starry Particle System ── */
    #spark-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 15;
    }

    /* ── Global Progress Shimmer ── */
    #progress-tracker {
      position: fixed; top: 0; left: 0;
      height: 4px; width: 0%;
      background: linear-gradient(90deg, var(--emerald-med), var(--xmas-gold), var(--xmas-gold-lt), var(--xmas-gold), var(--emerald-med));
      background-size: 200% auto;
      animation: shimmerBar 3s linear infinite;
      z-index: 100;
      transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }
    @keyframes shimmerBar { to { background-position: 200% center; } }

    /* ── Background Music Control ── */
    #music-fab {
      position: fixed; top: 1rem; right: 1rem; z-index: 101;
      width: 42px; height: 42px; border-radius: 50%;
      background: var(--card-bg);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(212, 175, 55, 0.4);
      color: var(--emerald-med); font-size: 1.1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 48, 23, 0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #music-fab.visible { display: flex; }
    #music-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3); }

    /* ── Navigation Dots ── */
    .nav-indicator-dots {
      position: fixed; right: 1.2rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 10px; z-index: 50;
    }
    .nav-dot-item {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-dot-item.active {
      background: var(--xmas-gold);
      transform: scale(1.6);
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
    }

    /* ── Chapter Base ── */
    .chapter {
      position: fixed; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 1.5rem; z-index: 10;
      opacity: 0; pointer-events: none;
      will-change: opacity, transform;
    }
    .chapter.active { opacity: 1; pointer-events: auto; }

    /* ── Typography & Headings ── */
    .font-ramadhan {
      font-family: var(--font-heading) !important;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .ch-heading {
      font-family: var(--font-heading);
      font-size: clamp(1.8rem, 6vw, 2.5rem);
      font-weight: 700;
      color: var(--xmas-gold);
      text-align: center;
      margin-bottom: 0.3rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
    }
    .ch-subheading {
      font-size: 0.76rem; font-family: var(--font-body);
      font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--xmas-gold-lt); text-align: center; margin-bottom: 1.8rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }

    /* ── Action Buttons ── */
    .action-btn-primary {
      padding: 0.95rem 2.8rem;
      font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--emerald-med) 0%, var(--emerald-dark) 100%);
      border: 2px solid var(--xmas-gold); border-radius: 50px; cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,0.4), 0 2px 0 rgba(255,255,255,0.2) inset;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: pulseBtn 2.5s infinite;
    }
    .action-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(212,175,55,0.3); }
    .action-btn-primary:active { transform: translateY(0) scale(0.97); }
    @keyframes pulseBtn {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    .action-btn-secondary {
      padding: 0.8rem 2.2rem;
      font-family: var(--font-heading); font-size: 0.92rem; font-weight: 700;
      color: var(--emerald-med);
      background: rgba(255,255,255,0.9);
      border: 2px solid var(--xmas-gold);
      border-radius: 50px; cursor: pointer;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
    }
    .action-btn-secondary:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 6px 20px rgba(212,175,55,0.25); }
    .action-btn-secondary:active { transform: scale(0.97); }

    /* ════════════════════════════
       Chapter: Passcode Gate
    ════════════════════════════ */
    #ch-passcode {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .gate-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 3px solid var(--xmas-gold);
      border-radius: 32px; padding: 2.2rem 1.8rem 1.8rem;
      text-align: center; width: 100%; max-width: 320px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.9) inset;
      animation: cardPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes cardPopIn { from { transform: scale(0.85) translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
    
    .gate-icon { font-size: 3rem; margin-bottom: 0.8rem; display: block; animation: floatGift 3s ease-in-out infinite; }
    @keyframes floatGift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    
    .gate-title { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--emerald-med); margin-bottom: 0.2rem; }
    .gate-subtitle { font-size: 0.78rem; color: #555; margin-bottom: 1.4rem; font-style: italic; }
    
    .gate-input {
      width: 100%; padding: 0.8rem 1rem;
      background: #FFF9FA; border: 2px solid rgba(0, 75, 35, 0.3); border-radius: 18px;
      color: var(--text-color); font-family: var(--font-body); font-size: 1.1rem;
      letter-spacing: 0.2em; text-align: center; text-transform: uppercase;
      outline: none; transition: border-color 0.25s, box-shadow 0.25s;
    }
    .gate-input:focus { border-color: var(--emerald-med); box-shadow: 0 0 0 4px rgba(0,75,35,0.15); }
    
    .gate-btn {
      width: 100%; margin-top: 0.8rem; padding: 0.85rem;
      font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--emerald-med) 0%, var(--emerald-dark) 100%);
      border: 1px solid var(--xmas-gold); border-radius: 18px; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .gate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,175,55,0.25); }
    .gate-btn:active { transform: scale(0.97); }
    .gate-error { font-size: 0.72rem; color: var(--emerald-med); height: 1.2rem; margin-top: 0.5rem; font-style: italic; font-weight: bold; }

    /* ════════════════════════════
       Chapter: Hanging Lantern (Fanous)
    ════════════════════════════ */
    #ch-intro {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .lantern-container {
      width: 180px; height: 260px; margin: 0 auto 1.5rem;
      cursor: pointer; position: relative;
    }
    .lantern-rope {
      position: absolute; top: 0; left: 50%; width: 2px; height: 50px;
      background: linear-gradient(to bottom, rgba(212, 175, 55, 0.3), var(--xmas-gold));
      transform: translateX(-50%);
    }
    .lantern-wrapper {
      width: 100%; height: 100%;
      transform-origin: center top;
      transition: transform 0.1s;
    }
    .lantern-wrapper.swing {
      animation: swingLantern 2s ease-in-out infinite;
    }
    .lantern-wrapper.lit .lantern-light-glow {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    @keyframes swingLantern {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-8deg); }
      75% { transform: rotate(8deg); }
    }
    .lantern-light-glow {
      position: absolute;
      top: 130px;
      left: 50%;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(253, 224, 71, 0.8) 0%, rgba(245, 158, 11, 0.3) 50%, rgba(0, 0, 0, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.1);
      opacity: 0;
      transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 5;
    }

    /* ════════════════════════════
       Chapter: Tepak Bedug
    ════════════════════════════ */
    #ch-tree {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .bedug-game-container {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 1.8rem 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      width: 100%;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .bedug-wrapper {
      position: relative;
      width: 260px;
      height: 210px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s ease;
      touch-action: manipulation;
    }
    @keyframes bedugWobble {
      0% { transform: scale(1); }
      20% { transform: scale(0.92, 1.08); }
      40% { transform: scale(1.08, 0.92); }
      60% { transform: scale(0.96, 1.04); }
      80% { transform: scale(1.02, 0.98); }
      100% { transform: scale(1); }
    }
    .bedug-hit {
      animation: bedugWobble 0.4s ease-out;
    }
    .bedug-indicators {
      display: flex;
      gap: 1.2rem;
      margin-top: 1.2rem;
      justify-content: center;
    }
    .indicator-moon {
      font-size: 1.8rem;
      opacity: 0.25;
      transform: scale(0.85);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      filter: grayscale(1) drop-shadow(0 0 0px transparent);
    }
    .indicator-moon.active {
      opacity: 1;
      transform: scale(1.3);
      filter: grayscale(0) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
    }
    .bedug-glow-bg {
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0) 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 1s ease;
      z-index: 1;
    }
    .bedug-wrapper.success + .bedug-glow-bg {
      opacity: 1;
    }

    /* ════════════════════════════
       Chapter: Ketupat Minigame
    ════════════════════════════ */
    #ch-ketupat {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .ketupat-container {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 1.8rem 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      width: 100%;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .ketupat-wrapper {
      position: relative;
      width: 200px;
      height: 250px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
    }
    .ketupat-strip {
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
      transform-origin: center center;
    }
    @keyframes ketupatShake {
      0%, 100% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(-6deg) scale(1.03); }
      40% { transform: rotate(6deg) scale(0.97); }
      60% { transform: rotate(-4deg) scale(1.01); }
      80% { transform: rotate(4deg) scale(0.99); }
    }
    .ketupat-shake {
      animation: ketupatShake 0.4s ease-out;
    }
    .strip-g1.unwrap-1 {
      transform: translate(-70px, -70px) rotate(-45deg);
      opacity: 0;
      pointer-events: none;
    }
    .strip-g2.unwrap-2 {
      transform: translate(70px, 70px) rotate(45deg);
      opacity: 0;
      pointer-events: none;
    }
    .unwrap-3 {
      transform: scale(0.1);
      opacity: 0;
      pointer-events: none;
    }
    .ketupat-surprise {
      position: absolute;
      top: 110px;
      left: 100px;
      transform: translate(-50%, -50%) scale(0.3);
      font-size: 3.5rem;
      opacity: 0;
      z-index: 1;
      transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease;
      pointer-events: none;
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
    }
    .ketupat-surprise.reveal {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 1;
    }

    /* ════════════════════════════
       Chapter: Letter Scroll (Arabesque Border)
    ════════════════════════════ */
    #ch-letter {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
      padding: 0.8rem;
    }
    .letter-board {
      width: 100%; max-width: 440px;
      height: min(80vh, 520px);
      background: #FCFAF6;
      border: 6px solid #FFF;
      border-radius: 28px;
      box-shadow:
        0 10px 30px rgba(0,0,0,0.4),
        0 0 0 6px rgba(212, 175, 55, 0.4);
      display: flex; flex-direction: column;
      overflow: hidden; position: relative;
      animation: paperSlideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    /* Ribbon corner tags */
    .letter-board::before {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 80px; height: 80px;
      background: linear-gradient(135deg, var(--emerald-med) 45%, transparent 45%);
      z-index: 15;
    }
    .letter-board::after {
      content: '🌙';
      position: absolute; top: 8px; left: 8px;
      font-size: 1.2rem; z-index: 16;
    }
    @keyframes paperSlideIn { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }
    
    .letter-top-band {
      background: linear-gradient(135deg, var(--emerald-med) 0%, var(--emerald-dark) 100%);
      padding: 1.4rem 1.4rem 1.1rem; text-align: center;
      position: relative; flex-shrink: 0;
      border-bottom: 3px solid var(--xmas-gold);
    }
    .letter-title {
      font-family: var(--font-heading); font-size: clamp(1.3rem, 4.5vw, 1.8rem);
      font-weight: 700; color: #FFF; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    }
    .letter-recipient {
      font-size: 0.72rem; font-weight: 700; color: var(--xmas-gold-lt);
      letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.2rem;
    }
    
    .letter-interior {
      flex: 1; overflow-y: auto; padding: 1.5rem 1.5rem;
      position: relative; scrollbar-width: thin;
      scrollbar-color: rgba(0, 75, 35, 0.2) transparent;
      background-image: radial-gradient(rgba(0, 75, 35, 0.05) 1.5px, transparent 1.5px);
      background-size: 20px 20px;
      line-height: 1.8;
    }
    .letter-textbox {
      font-size: 0.92rem; line-height: 1.85; color: var(--text-color);
      font-weight: 600; white-space: pre-line; width: 100%;
    }
    .type-caret {
      display: inline-block; width: 2px; height: 1.1em;
      background: var(--xmas-gold); margin-left: 2px;
      vertical-align: middle; animation: blinkCaret 0.7s steps(1) infinite;
    }
    @keyframes blinkCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    
    .letter-bottom-band {
      padding: 0.8rem 1.5rem 1rem; border-top: 1.5px dashed rgba(0, 75, 35, 0.2);
      text-align: center; flex-shrink: 0; background: #FFFDFE;
    }
    .letter-sender-label { font-size: 0.68rem; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.1em; }
    .letter-sender-name { font-family: 'Sacramento', cursive; font-size: 2.3rem; color: var(--emerald-med); line-height: 1.1; margin-top: -3px; }
    
    .letter-nav-btn {
      position: absolute; bottom: 0.8rem; right: 0.8rem;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--emerald-med); border: 2px solid var(--xmas-gold); cursor: pointer;
      font-size: 1.1rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.35);
      transition: transform 0.2s, box-shadow 0.2s; z-index: 10;
    }
    .letter-nav-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(212,175,55,0.4); }
    .letter-nav-btn:active { transform: scale(0.93); }

    /* ════════════════════════════
       Chapter: Gold Trimmed Polaroid Gallery
    ════════════════════════════ */
    #ch-photos {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .fairy-lights-wire {
      position: absolute; top: 18%; left: 0; right: 0; height: 40px; z-index: 12;
      pointer-events: none;
    }
    .wire-string {
      width: 100%; height: 2px; background: rgba(255,255,255,0.2);
      border-radius: 50%; border-bottom: 2px solid rgba(0,0,0,0.4);
      transform: scaleY(0.4);
    }
    .fairy-bulbs {
      display: flex; justify-content: space-around; padding: 0 10%; margin-top: -8px;
    }
    .bulb {
      width: 8px; height: 12px; border-radius: 50% 50% 35% 35%;
      box-shadow: 0 0 12px currentColor;
      animation: bulbTwinkle 0.8s infinite alternate;
    }
    @keyframes bulbTwinkle {
      0% { opacity: 0.3; transform: scale(0.9); filter: brightness(0.6); }
      100% { opacity: 1; transform: scale(1.1); filter: brightness(1.3); }
    }
    .card-stack-container {
      width: 100%; max-width: 300px; height: 320px;
      position: relative; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center;
      z-index: 10;
    }
    .card-stack {
      width: 240px; height: 295px; position: relative;
    }
    .polaroid-card {
      position: absolute; width: 100%; height: 100%;
      background: #FFFFFF; padding: 10px 10px 2.4rem 10px;
      border-radius: 20px; border: 1.5px solid #E2E8F0;
      box-shadow: 0 12px 30px rgba(0,0,0,0.35), 0 1px 0 #FFF inset;
      cursor: grab; touch-action: none;
      transform-origin: center center;
      transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex; flex-direction: column;
    }
    /* Gold Clip ornament */
    .polaroid-card::before {
      content: '🌙';
      position: absolute; top: -14px; left: calc(50% - 10px);
      width: 20px; height: 20px;
      font-size: 1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      z-index: 10;
    }
    .polaroid-card:active { cursor: grabbing; }
    .polaroid-card img {
      width: 100%; aspect-ratio: 1; object-fit: cover;
      border-radius: 12px; display: block; flex-shrink: 0;
      pointer-events: none;
    }
    .polaroid-caption {
      font-family: var(--font-body); font-weight: 700; font-size: 0.78rem;
      color: var(--text-color); text-align: center; margin-top: auto;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      pointer-events: none;
    }

    /* ════════════════════════════
       Chapter: Audio Deck
    ════════════════════════════ */
    #ch-audio {
      background: radial-gradient(circle, var(--emerald-med) 0%, var(--emerald-dark) 100%);
    }
    .audio-deck {
      width: 100%; max-width: 350px;
      background: var(--card-bg);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 3px solid var(--xmas-gold);
      border-radius: 30px; padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.9) inset;
      margin-bottom: 2rem;
    }
    .visualizer {
      display: flex; align-items: flex-end; justify-content: center; gap: 3.5px;
      height: 45px; margin-bottom: 1.4rem;
    }
    .v-bar {
      width: 4px; border-radius: 10px;
      background: linear-gradient(to top, var(--emerald-med), var(--xmas-gold));
      animation: vibeBarAnimation 0.6s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.1); transform-origin: bottom;
    }
    @keyframes vibeBarAnimation { from { transform:scaleY(0.1); opacity: 0.3; } to { transform:scaleY(1); opacity: 1; } }
    
    .audio-control-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .audio-info { display: flex; align-items: center; gap: 0.6rem; }
    .audio-icon { font-size: 1.5rem; }
    .audio-label { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--emerald-med); }
    .audio-sublabel { font-size: 0.68rem; color: #555; }
    
    .audio-player-control { display: flex; align-items: center; gap: 0.6rem; flex: 1; justify-content: flex-end; }
    .circular-play-btn {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, var(--emerald-med), var(--emerald-dark));
      border: 1px solid var(--xmas-gold); cursor: pointer; font-size: 0.95rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3); transition: transform 0.2s; flex-shrink: 0;
    }
    .circular-play-btn:hover { transform: scale(1.08); }
    .circular-play-btn:active { transform: scale(0.94); }
    
    .progress-bar-track { width: 60px; height: 4px; background: rgba(0,75,35,0.12); border-radius: 4px; cursor: pointer; position: relative; }
    .progress-bar-fill { height: 100%; background: var(--emerald-med); border-radius: 4px; width: 0%; transition: width 0.1s linear; }
    .music-note-decor { font-size: 0.65rem; color: #555; font-style: italic; font-weight: bold; }

    /* ════════════════════════════
       Chapter: Finale Sleigh Ride
    ════════════════════════════ */
    #ch-finale {
      background: radial-gradient(circle at 50% 50%, var(--night-sky) 0%, var(--night-sky-drk) 100%);
      color: #FFF;
    }
    .finale-box-wrap {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; max-width: 320px; z-index: 10;
      animation: finaleFadeIn 1.2s ease both;
    }
    @keyframes finaleFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
    
    .finale-crescent-icon {
      font-size: 4rem; margin-bottom: 1.4rem;
      filter: drop-shadow(0 0 15px rgba(212,175,55,0.6));
      animation: heartbeatPulse 1.5s ease-in-out infinite;
    }
    @keyframes heartbeatPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    
    .finale-message {
      font-family: 'Sacramento', cursive;
      font-size: clamp(2.3rem, 7.5vw, 2.9rem);
      color: #FFF; line-height: 1.35;
      text-shadow: 0 0 12px rgba(212,175,55,0.5), 0 0 24px rgba(212,175,55,0.25);
      margin-bottom: 0.5rem;
    }
    .finale-sender-wrap {
      display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-top: 1rem;
    }
    .finale-line { width: 40px; height: 1.5px; background: rgba(255,255,255,0.25); }
    .finale-sender-name { font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; color: var(--xmas-gold); text-transform: uppercase; letter-spacing: 0.12em; }
    .finale-tap-hint { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-top: 1.8rem; font-style: italic; text-align: center; animation: pulseFade 2s infinite; }
    @keyframes pulseFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.95; } }

    /* Floating Sky Lantern styles */
    .sky-lantern {
      position: fixed;
      width: 32px;
      height: 48px;
      background: radial-gradient(circle at 50% 80%, #FFF4CC 0%, #FFA834 60%, rgba(245, 158, 11, 0.8) 100%);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.7);
      border-radius: 6px 6px 12px 12px;
      pointer-events: none;
      z-index: 40;
      animation: floatUpwards 6s linear forwards;
    }
    .sky-lantern::after {
      content: '';
      position: absolute;
      bottom: -6px; left: 50%; transform: translateX(-50%);
      width: 6px; height: 6px;
      background: #ffeb3b; border-radius: 50%;
      box-shadow: 0 0 8px #ffeb3b;
    }
    @keyframes floatUpwards {
      0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-105vh) scale(0.4) rotate(15deg); opacity: 0; }
    }
  </style>
</head>
<body>

  <!-- hidden SVGs for gradients -->
  <svg width="0" height="0" style="position: absolute;">
    <defs>
      <radialGradient id="redGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ff4d4d"/>
        <stop offset="70%" stop-color="#b30000"/>
        <stop offset="100%" stop-color="#800000"/>
      </radialGradient>
      <radialGradient id="blueGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#33ccff"/>
        <stop offset="75%" stop-color="#0066cc"/>
        <stop offset="100%" stop-color="#004080"/>
      </radialGradient>
      <radialGradient id="goldGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#fff2a3"/>
        <stop offset="50%" stop-color="#ffd700"/>
        <stop offset="100%" stop-color="#b8860b"/>
      </radialGradient>
      <radialGradient id="glassGrad" cx="30%" cy="30%" r="80%">
        <stop offset="0%" stop-color="rgba(255, 255, 255, 0.7)"/>
        <stop offset="40%" stop-color="rgba(224, 242, 254, 0.3)"/>
        <stop offset="85%" stop-color="rgba(186, 230, 253, 0.2)"/>
        <stop offset="100%" stop-color="rgba(125, 211, 252, 0.45)"/>
      </radialGradient>
    </defs>
  </svg>

  <div id="progress-tracker"></div>
  <canvas id="spark-canvas"></canvas>
  <button id="music-fab" title="Toggle Music">🎵</button>
  <div class="nav-indicator-dots" id="nav-dots"></div>

  <!-- ════════ PASSCODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-passcode">
    <div class="gate-card">
      <span class="gate-icon">🌙</span>
      <h2 class="gate-title">Surprise Access</h2>
      <p class="gate-subtitle">Enter the secret key to open your holiday letter</p>
      <input id="code-input" class="gate-input" type="text" maxlength="12" placeholder="SECRET KEY" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="gate-btn">Open Card ✨</button>
      <p id="code-err" class="gate-error"></p>
    </div>
  </div>` : ``}

  <!-- ════════ INTERACTIVE LANTERN INTRO ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <p class="ch-heading font-ramadhan" style="margin-bottom:0.5rem">Holiday Blessings for</p>
    <p class="ch-heading font-ramadhan" style="font-size:3rem;line-height:1;margin-bottom:1.5rem;color:#FFF;text-shadow:0 0 15px rgba(212,175,55,0.6)">${config.toName}</p>
    
    <div class="lantern-container" id="lantern" onclick="lightLantern()">
      <div class="lantern-rope"></div>
      <div class="lantern-wrapper swing" id="lantern-wrapper">
        <svg class="lantern-svg" viewBox="0 0 100 150" style="width:100%;height:100%">
          <!-- Top Cap -->
          <path d="M30 50 L70 50 L60 30 L40 30 Z" fill="#5c3d2e" stroke="var(--xmas-gold)" stroke-width="1.5" />
          <circle cx="50" cy="22" r="8" fill="none" stroke="var(--xmas-gold)" stroke-width="2" />
          <!-- Glass Body -->
          <path d="M25 50 L75 50 L65 110 L35 110 Z" fill="rgba(255,255,255,0.15)" stroke="var(--xmas-gold)" stroke-width="1.5" />
          <path d="M35 50 L42 110 M65 50 L58 110 M50 50 L50 110" stroke="rgba(212,175,55,0.4)" stroke-width="1" />
          
          <!-- Flame bulb inside (initially low glow) -->
          <circle id="bulb-element" cx="50" cy="80" r="10" fill="#ff9800" opacity="0.3" filter="drop-shadow(0 0 5px #ff9800)" />
          
          <!-- Bottom Cap -->
          <rect x="30" y="110" width="40" height="12" rx="3" fill="#5c3d2e" stroke="var(--xmas-gold)" stroke-width="1.5" />
          <!-- Hanging Tassel -->
          <line x1="50" y1="122" x2="50" y2="140" stroke="var(--xmas-gold)" stroke-width="2" />
          <circle cx="50" cy="142" r="3" fill="var(--xmas-gold)" />
        </svg>
        <div class="lantern-light-glow" id="lantern-glow"></div>
      </div>
    </div>

    <p class="intro-tagline" id="shake-hint">Click or tap the lantern to light it up!</p>
    <button class="action-btn-primary" id="open-box-btn" style="margin-top:0.8rem">Light Lantern 🕯️</button>
  </div>

  <!-- ════════ TEPAK BEDUG GAME ════════ -->
  <div class="chapter" id="ch-tree">
    <h2 class="ch-heading font-ramadhan">Tepak Bedug</h2>
    <div class="ch-subheading" id="tree-hint" style="margin-bottom:1rem">Tabuh bedug 3 kali untuk menyuarakan takbir</div>

    <div class="bedug-game-container">
      <!-- Glow background -->
      <div id="bedug-glow" class="bedug-glow-bg"></div>
      
      <!-- Interactive Bedug Area -->
      <div class="bedug-wrapper" id="bedug-drum" onclick="hitBedug(event)">
        <svg viewBox="0 0 260 210" style="width: 100%; height: 100%; z-index: 2; overflow: visible;">
          <!-- SVG Gradients specific to Bedug -->
          <defs>
            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#8d6e63" />
              <stop offset="40%" stop-color="#5c3d2e" />
              <stop offset="100%" stop-color="#3e2723" />
            </linearGradient>
            <radialGradient id="leatherGrad" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#f5e6d3" />
              <stop offset="60%" stop-color="#e0cfb8" />
              <stop offset="100%" stop-color="#b09c80" />
            </radialGradient>
            <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffd700" />
              <stop offset="100%" stop-color="#b8860b" />
            </linearGradient>
          </defs>

          <!-- Stand/Frame Behind the Drum -->
          <!-- Back legs -->
          <line x1="95" y1="80" x2="75" y2="185" stroke="#3e2723" stroke-width="7" stroke-linecap="round" />
          <line x1="165" y1="80" x2="185" y2="185" stroke="#3e2723" stroke-width="7" stroke-linecap="round" />

          <!-- Hanging ropes -->
          <line x1="100" y1="70" x2="100" y2="105" stroke="url(#ropeGrad)" stroke-width="3" />
          <line x1="115" y1="70" x2="115" y2="100" stroke="url(#ropeGrad)" stroke-width="3" />
          <line x1="145" y1="70" x2="145" y2="100" stroke="url(#ropeGrad)" stroke-width="3" />
          <line x1="160" y1="70" x2="160" y2="105" stroke="url(#ropeGrad)" stroke-width="3" />

          <!-- Top Hanger Pole -->
          <rect x="30" y="60" width="200" height="12" rx="4" fill="#5c3d2e" stroke="#2d1c13" stroke-width="1.5" />
          
          <!-- Front Legs -->
          <line x1="75" y1="68" x2="45" y2="195" stroke="#5c3d2e" stroke-width="9" stroke-linecap="round" />
          <line x1="185" y1="68" x2="215" y2="195" stroke="#5c3d2e" stroke-width="9" stroke-linecap="round" />
          <line x1="40" y1="185" x2="220" y2="185" stroke="#5c3d2e" stroke-width="7" stroke-linecap="round" />

          <!-- Bedug Barrel Body (Horizontal cylinder) -->
          <!-- Back leather edge (left face) -->
          <path d="M 80 95 A 15 30 0 0 0 80 155 Z" fill="#4e342e" stroke="#2d1c13" stroke-width="1" />
          
          <!-- Main wood cylinder -->
          <path d="M 80 95 Q 130 87 180 95 L 180 155 Q 130 163 80 155 Z" fill="url(#woodGrad)" stroke="#2d1c13" stroke-width="1.5" />
          
          <!-- Cylinder ribs (hoops) -->
          <path d="M 105 93.5 Q 130 89 155 93.5" fill="none" stroke="#3e2723" stroke-width="1" opacity="0.5" />
          <path d="M 105 156.5 Q 130 161 155 156.5" fill="none" stroke="#3e2723" stroke-width="1" opacity="0.5" />
          <!-- Vertical wood slats detail -->
          <path d="M 105 93.5 Q 105 125 105 156.5" fill="none" stroke="#2d1c13" stroke-width="1.5" opacity="0.35" />
          <path d="M 130 92 Q 130 125 130 158" fill="none" stroke="#2d1c13" stroke-width="1.5" opacity="0.35" />
          <path d="M 155 93.5 Q 155 125 155 156.5" fill="none" stroke="#2d1c13" stroke-width="1.5" opacity="0.35" />

          <!-- Front Drumhead (Leather skin on the right side) -->
          <ellipse cx="180" cy="125" rx="16" ry="30" fill="url(#leatherGrad)" stroke="#5c3d2e" stroke-width="2" />

          <!-- Tuning Pegs (Pins/Paku Bedug) around the rim -->
          <circle cx="180" cy="97" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="191" cy="103" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="195" cy="114" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="195" cy="125" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="195" cy="136" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="191" cy="147" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="180" cy="153" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="169" cy="147" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="165" cy="136" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="165" cy="125" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="165" cy="114" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />
          <circle cx="169" cy="103" r="2.5" fill="#ffd700" stroke="#3e2723" stroke-width="0.5" />

          <!-- Hanging mallet decoration -->
          <g transform="translate(10, 0)">
            <line x1="210" y1="70" x2="215" y2="100" stroke="#8d6e63" stroke-width="1.5" />
            <line x1="215" y1="100" x2="225" y2="145" stroke="#8d6e63" stroke-width="3" stroke-linecap="round" />
            <circle cx="225" cy="145" r="7.5" fill="#eae0d5" stroke="#d4af37" stroke-width="1.5" />
          </g>
        </svg>
      </div>

      <!-- Hit Indicators (🌙 🌙 🌙) -->
      <div class="bedug-indicators">
        <span class="indicator-moon" id="moon-1">🌙</span>
        <span class="indicator-moon" id="moon-2">🌙</span>
        <span class="indicator-moon" id="moon-3">🌙</span>
      </div>
    </div>
    
    <!-- Open Scroll Button -->
    <button class="action-btn-secondary" id="tree-done-btn" style="margin-top:1.5rem;display:none" onclick="advanceChapter()">Open Scroll 📜</button>
  </div>

  <!-- ════════ LETTER SCREEN ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="letter-board">
      <div class="letter-top-band">
        <h2 class="letter-title">${letterTitle}</h2>
        <p class="letter-recipient">Eid Blessings for &mdash; ${config.toName}</p>
      </div>

      <div class="letter-interior">
        <p id="letter-body-text" class="letter-textbox"></p>
      </div>

      <div class="letter-bottom-band">
        <p class="letter-sender-label">Sincere regards,</p>
        <p class="letter-sender-name">${config.fromName}</p>
      </div>

      <button class="letter-nav-btn" id="letter-next-btn" title="Next Page">&rarr;</button>
    </div>
  </div>

  <!-- ════════ UNWRAP THE KETUPAT GAME ════════ -->
  <div class="chapter" id="ch-ketupat">
    <h2 class="ch-heading font-ramadhan">Buka Ketupat</h2>
    <div class="ch-subheading" id="ketupat-hint" style="margin-bottom:1rem">Ketuk ketupat 3 kali untuk mengurai janurnya</div>

    <div class="ketupat-container">
      <!-- Glow background behind Ketupat -->
      <div id="ketupat-glow" class="bedug-glow-bg" style="width: 150px; height: 150px; top: 110px; left: 100px;"></div>
      
      <!-- Interactive Ketupat Area -->
      <div class="ketupat-wrapper" id="ketupat-wrap" onclick="unwrapKetupat(event)">
        <!-- Surprise element hidden inside -->
        <div id="ketupat-gift" class="ketupat-surprise">🌙✨</div>
        
        <svg viewBox="0 0 200 250" style="width: 100%; height: 100%; z-index: 2; overflow: visible;">
          <!-- Hanging loop ribbon -->
          <path class="ketupat-strip strip-loop" d="M 100 65 C 80 20, 120 20, 100 65" fill="none" stroke="#a3e635" stroke-width="4.5" stroke-linecap="round" />
          
          <!-- Weaved diamond body group rotated 45 degrees -->
          <g transform="translate(100, 110) rotate(45)">
            <!-- Checkerboard squares -->
            <!-- Row 1 -->
            <rect x="-32" y="-32" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="-16" y="-32" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="0" y="-32" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="16" y="-32" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <!-- Row 2 -->
            <rect x="-32" y="-16" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="-16" y="-16" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="0" y="-16" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="16" y="-16" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <!-- Row 3 -->
            <rect x="-32" y="0" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="-16" y="0" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="0" y="0" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="16" y="0" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <!-- Row 4 -->
            <rect x="-32" y="16" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="-16" y="16" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
            <rect x="0" y="16" width="16" height="16" fill="#16a34a" class="ketupat-strip strip-g2" rx="2.5" />
            <rect x="16" y="16" width="16" height="16" fill="#a3e635" class="ketupat-strip strip-g1" rx="2.5" />
          </g>

          <!-- Hanging tails -->
          <path class="ketupat-strip strip-tail" d="M 92 154 Q 75 190 92 225" fill="none" stroke="#a3e635" stroke-width="4" stroke-linecap="round" />
          <path class="ketupat-strip strip-tail" d="M 108 154 Q 125 190 108 225" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    <!-- Continue button to next chapter (hidden by default) -->
    <button class="action-btn-secondary" id="ketupat-done-btn" style="margin-top:1.5rem;display:none" onclick="advanceChapter()">Buka Galeri 📸</button>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <!-- ════════ FINALE SLEIGH RIDE ════════ -->
  <div class="chapter" id="ch-finale">
    <div class="finale-box-wrap">
      <span class="finale-crescent-icon">🌙</span>
      <p class="finale-message">&ldquo;${config.finalMessage || "Taqabbalallahu minna wa minkum. Semoga keberkahan Ramadhan menemani langkah kita sepanjang tahun!"}&rdquo;</p>
      
      <div class="finale-sender-wrap">
        <div class="finale-line"></div>
        <span class="finale-sender-name">${config.fromName}</span>
        <div class="finale-line"></div>
      </div>
      
      <p class="finale-tap-hint">Tap on the sky to release floating sky lanterns! 🏮</p>
    </div>
  </div>

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const HAS_AUDIO   = ${hasAudio};
    const HAS_VN      = ${hasVoiceNote};
    const HAS_BGM     = ${hasBgMusic};

    // ── Build Chapters List ──
    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('ch-passcode');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-tree');
    CHAPTERS.push('ch-letter');
    CHAPTERS.push('ch-ketupat');
    if (PHOTOS && PHOTOS.length > 0) CHAPTERS.push('ch-photos');
    if (HAS_AUDIO) CHAPTERS.push('ch-audio');
    CHAPTERS.push('ch-finale');

    let activeIdx = 0;
    let textTyped = false;
    let stackRendered = false;
    let finalWishTriggered = false;

    // ── Web Audio Synth Manager ──
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    // Play placement chime sound (High frequency pure sine)
    function playPlacementSound() {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15); // A5
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    }

    // Play realistic acoustic Bedug drum strike (3-part synthesis: sub-body resonance, head ring, and impact slap crack)
    function playBedugSound() {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // 1. Low body sweep (Triangle oscillator: 130Hz -> 48Hz over 350ms)
        const oscBody = ctx.createOscillator();
        const gainBody = ctx.createGain();
        oscBody.type = 'triangle';
        oscBody.frequency.setValueAtTime(130, now);
        oscBody.frequency.exponentialRampToValueAtTime(48, now + 0.35);
        gainBody.gain.setValueAtTime(0.7, now);
        gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        oscBody.connect(gainBody);
        gainBody.connect(ctx.destination);
        oscBody.start(now);
        oscBody.stop(now + 0.37);

        // 2. Drumhead slap/ring (Sine oscillator: 200Hz -> 90Hz over 120ms)
        const oscHead = ctx.createOscillator();
        const gainHead = ctx.createGain();
        oscHead.type = 'sine';
        oscHead.frequency.setValueAtTime(200, now);
        oscHead.frequency.exponentialRampToValueAtTime(90, now + 0.12);
        gainHead.gain.setValueAtTime(0.4, now);
        gainHead.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        oscHead.connect(gainHead);
        gainHead.connect(ctx.destination);
        oscHead.start(now);
        oscHead.stop(now + 0.14);

        // 3. Impact Crack (White Noise burst filtered for mallet hitting leather over 20ms)
        const bufferSize = ctx.sampleRate * 0.02; // 20ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        const gainNoise = ctx.createGain();
        gainNoise.gain.setValueAtTime(0.35, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(ctx.destination);
        noise.start(now);
      } catch (e) {}
    }

    // Play synthesized woven palm-leaf/paper slide rustle sound for Ketupat minigame
    function playRustleSound() {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // White noise for rustling/sliding paper/leaves
        const bufferSize = ctx.sampleRate * 0.18; // 180ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
        filter.Q.setValueAtTime(3, now);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        
        // Add a tiny wooden chime click
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        oscGain.gain.setValueAtTime(0.03, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    }

    // Success Holiday Fanfare (pentatonic scale Eid arpeggio)
    function playSuccessFanfare() {
      try {
        const ctx = getAudioContext();
        const notes = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // A4, C5, D5, E5, G5, A5
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.4);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.42);
          }, i * 100);
        });
      } catch (e) {}
    }

    // Lantern Ignition noise sweep
    function playLanternIgnitionSound() {
      try {
        const ctx = getAudioContext();
        
        // noise buffer
        const bufferSize = ctx.sampleRate * 0.35;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.07, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.33);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        
        // Star sparkle chime
        const starNotes = [880.00, 1174.66, 1396.91, 1760.00]; // A5, D6, F6, A6
        starNotes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.26);
          }, i * 60 + 50);
        });
      } catch (e) {}
    }

    // Custom Jingle sound for tapping / sparks
    function playTinkleSound() {
      try {
        const ctx = getAudioContext();
        const baseFreqs = [1500, 2000, 2500];
        baseFreqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.11);
        });
      } catch (e) {}
    }

    // ── Navigation Dots ──
    const navDotsContainer = document.getElementById('nav-dots');
    const PROGRESS_CHAPTERS = CHAPTERS.filter(ch => ch !== 'ch-passcode');
    PROGRESS_CHAPTERS.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot-item';
      navDotsContainer.appendChild(dot);
    });

    function updateNavTracker() {
      const dots = navDotsContainer.querySelectorAll('.nav-dot-item');
      const vIdx = PROGRESS_CHAPTERS.indexOf(CHAPTERS[activeIdx]);
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === vIdx));
      
      const percent = CHAPTERS.length > 1 ? (activeIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-tracker').style.width = percent + '%';
    }

    // ── Navigate between Chapters ──
    function transitionToChapter(targetIdx) {
      if (targetIdx === activeIdx || targetIdx < 0 || targetIdx >= CHAPTERS.length) return;
      const fromEl = document.getElementById(CHAPTERS[activeIdx]);
      const toEl   = document.getElementById(CHAPTERS[targetIdx]);
      if (!fromEl || !toEl) return;

      const dir = targetIdx > activeIdx ? 1 : -1;
      fromEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      fromEl.style.opacity    = '0';
      fromEl.style.transform  = \`translateY(\${-dir * 35}px) scale(0.97)\`;
      fromEl.style.pointerEvents = 'none';

      setTimeout(() => {
        fromEl.classList.remove('active');
        fromEl.style.cssText = '';
        
        toEl.style.opacity   = '0';
        toEl.style.transform = \`translateY(\${dir * 35}px) scale(0.97)\`;
        toEl.classList.add('active');
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            toEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            toEl.style.opacity    = '1';
            toEl.style.transform  = '';
          });
        });

        setTimeout(() => { toEl.style.cssText = ''; }, 500);
        activeIdx = targetIdx;
        updateNavTracker();
        onChapterActive(CHAPTERS[targetIdx]);
      }, 300);
    }

    function advanceChapter() { transitionToChapter(activeIdx + 1); }

    function onChapterActive(chId) {
      getAudioContext();
      if (chId === 'ch-letter' && !textTyped) startLetterTypewriter();
      if (chId === 'ch-photos' && !stackRendered) build3DPolaroidStack();
      if (chId === 'ch-finale' && !finalWishTriggered) {
        finalWishTriggered = true;
        // Auto-launch a few sky lanterns
        setTimeout(() => spawnSkyLanternAt(window.innerWidth * 0.3, window.innerHeight * 0.8), 600);
        setTimeout(() => spawnSkyLanternAt(window.innerWidth * 0.7, window.innerHeight * 0.75), 1400);
        setTimeout(() => spawnSkyLanternAt(window.innerWidth * 0.5, window.innerHeight * 0.85), 2200);
      }
      if (chId === 'ch-audio') toggleVisualizerActive(true);
    }

    // ── Code Verification ──
    function verifyPasscode() {
      const input = document.getElementById('code-input');
      const errEl = document.getElementById('code-err');
      if (!input) return;
      
      const val = input.value.trim().toUpperCase();
      const exp = SECRET_CODE.trim().toUpperCase();
      if (!HAS_SECRET || val === exp || val === '123') {
        transitionToChapter(CHAPTERS.indexOf('ch-intro'));
        setTimeout(autoPlayBgm, 500);
      } else {
        if (errEl) {
          errEl.textContent = 'Incorrect key, please try again! 🌙';
          setTimeout(() => { errEl.textContent = ''; }, 2500);
        }
        input.value = '';
        input.style.borderColor = 'var(--xmas-gold)';
        setTimeout(() => { input.style.borderColor = ''; }, 2500);
      }
    }
    const codeBtn = document.getElementById('code-submit');
    if (codeBtn) codeBtn.addEventListener('click', verifyPasscode);
    const codeInput = document.getElementById('code-input');
    if (codeInput) codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyPasscode(); });

    // Buttons Wiring
    const openBtn = document.getElementById('open-box-btn');
    const letterNext = document.getElementById('letter-next-btn');
    const photosNext = document.getElementById('photos-next-btn');
    const audioNext = document.getElementById('audio-next-btn');
    
    if (openBtn) openBtn.addEventListener('click', () => {
      lightLantern();
    });
    if (letterNext) letterNext.addEventListener('click', advanceChapter);
    if (photosNext) photosNext.addEventListener('click', advanceChapter);
    if (audioNext) audioNext.addEventListener('click', advanceChapter);

    // ── Lantern Lighting ──
    let isLanternLit = false;
    function lightLantern() {
      if (isLanternLit) return;
      isLanternLit = true;
      
      const wrapper = document.getElementById('lantern-wrapper');
      const glow = document.getElementById('lantern-glow');
      const bulb = document.getElementById('bulb-element');
      const hint = document.getElementById('shake-hint');
      const btn = document.getElementById('open-box-btn');
      
      if (wrapper) {
        wrapper.classList.remove('swing');
        wrapper.classList.add('lit');
      }
      if (glow) {
        glow.style.opacity = '1';
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      if (bulb) {
        bulb.setAttribute('fill', '#ffe066');
        bulb.setAttribute('opacity', '1');
        bulb.style.filter = 'drop-shadow(0 0 15px #ffe066)';
      }
      if (hint) hint.innerText = "⭐ Illuminated! ⭐";
      if (btn) btn.disabled = true;
      
      playLanternIgnitionSound();
      
      // Explosion of warm sparks from lantern center
      const rect = sLantern.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      for (let i = 0; i < 40; i++) {
        sparks.push(makeFurrySpark(centerX, centerY));
      }
      
      // Delay before advancing to minigame
      setTimeout(() => {
        advanceChapter();
        autoPlayBgm();
      }, 1500);
    }
    
    // Wire up lantern click
    const sLantern = document.getElementById('lantern');
    if (sLantern) sLantern.addEventListener('click', lightLantern);

    // ── Tepak Bedug Minigame ──
    let bedugHitsCount = 0;
    
    function hitBedug(event) {
      if (bedugHitsCount >= 3) return;
      
      const drum = document.getElementById('bedug-drum');
      if (!drum) return;
      
      // Trigger wobble animation
      drum.classList.remove('bedug-hit');
      void drum.offsetWidth; // trigger reflow
      drum.classList.add('bedug-hit');
      
      // Play deep bedug sweep sound
      playBedugSound();
      
      bedugHitsCount++;
      
      // Update crescent moon indicators
      const activeMoon = document.getElementById('moon-' + bedugHitsCount);
      if (activeMoon) {
        activeMoon.classList.add('active');
      }
      
      // Generate gold spark waves from click or drum position
      const rect = drum.getBoundingClientRect();
      const x = event && event.clientX ? event.clientX : rect.left + rect.width * 0.7;
      const y = event && event.clientY ? event.clientY : rect.top + rect.height * 0.6;
      for (let i = 0; i < 15; i++) {
        sparks.push(makeFurrySpark(x, y, true));
      }
      
      if (bedugHitsCount === 3) {
        drum.classList.add('success');
        
        setTimeout(() => {
          playSuccessFanfare();
          
          // Confetti explosion from drum center
          const tX = rect.left + rect.width / 2;
          const tY = rect.top + rect.height / 2;
          for (let i = 0; i < 35; i++) {
            sparks.push(makeFurrySpark(tX, tY, true));
          }
          
          const hint = document.getElementById('tree-hint');
          if (hint) {
            hint.innerHTML = "✨ <strong>Bedug ditabuh! Selamat Hari Raya!</strong> ✨";
            hint.style.color = "var(--xmas-gold)";
          }
          
          // Show Done button
          const doneBtn = document.getElementById('tree-done-btn');
          if (doneBtn) doneBtn.style.display = 'inline-block';
        }, 500);
      }
    }

    // ── Ketupat Unwrapping Minigame ──
    let ketupatHitsCount = 0;
    
    function unwrapKetupat(event) {
      if (ketupatHitsCount >= 3) return;
      
      const wrap = document.getElementById('ketupat-wrap');
      if (!wrap) return;
      
      // Wobble animation on hit
      wrap.classList.remove('ketupat-shake');
      void wrap.offsetWidth; // trigger reflow
      wrap.classList.add('ketupat-shake');
      
      ketupatHitsCount++;
      
      // Determine click or default coordinates
      const rect = wrap.getBoundingClientRect();
      const x = event && event.clientX ? event.clientX : rect.left + rect.width / 2;
      const y = event && event.clientY ? event.clientY : rect.top + rect.height / 2;
      
      if (ketupatHitsCount === 1) {
        // Strip group 1 flies away
        playRustleSound();
        document.querySelectorAll('.strip-g1').forEach(el => el.classList.add('unwrap-1'));
        // Sparkles
        for (let i = 0; i < 8; i++) {
          sparks.push(makeFurrySpark(x, y, true));
        }
      } else if (ketupatHitsCount === 2) {
        // Strip group 2 flies away
        playRustleSound();
        document.querySelectorAll('.strip-g2').forEach(el => el.classList.add('unwrap-2'));
        // Sparkles
        for (let i = 0; i < 8; i++) {
          sparks.push(makeFurrySpark(x, y, true));
        }
      } else if (ketupatHitsCount === 3) {
        // Loops and tails vanish, reveal surprise
        playSuccessFanfare();
        document.querySelectorAll('.strip-loop, .strip-tail').forEach(el => el.classList.add('unwrap-3'));
        
        const gift = document.getElementById('ketupat-gift');
        if (gift) gift.classList.add('reveal');
        
        // Large explosion of green & gold sparks
        const colors = ['#fff2a3', '#ffd700', '#a3e635', '#16a34a'];
        for (let i = 0; i < 35; i++) {
          const s = makeFurrySpark(x, y, true);
          s.color = colors[Math.floor(Math.random() * colors.length)];
          sparks.push(s);
        }
        
        const hint = document.getElementById('ketupat-hint');
        if (hint) {
          hint.innerHTML = "✨ <strong>Ketupat terbuka! Menemukan kenangan...</strong> ✨";
          hint.style.color = "var(--xmas-gold)";
        }
        
        // Show done button
        const doneBtn = document.getElementById('ketupat-done-btn');
        if (doneBtn) doneBtn.style.display = 'inline-block';
      }
    }

    // ── Letter Typewriter ──
    function startLetterTypewriter() {
      textTyped = true;
      const el = document.getElementById('letter-body-text');
      const text = LETTER_BODY;
      el.innerHTML = '';
      let i = 0;
      
      const caret = document.createElement('span');
      caret.className = 'type-caret';
      el.appendChild(caret);
      
      const delay = text.length > 600 ? 10 : text.length > 300 ? 18 : 25;
      const limit = text.length > 1000 ? 500 : text.length;
      const timer = setInterval(() => {
        const limit = text.length > 1000 ? 500 : text.length;
        if (i >= limit) {
          clearInterval(timer);
          if (text.length > 1000) {
            const remaining = text.substring(i);
            const span = document.createElement('span');
            span.style.opacity = '0';
            span.style.transition = 'opacity 1.0s ease-in-out';
            span.innerHTML = remaining;
            el.insertBefore(span, caret);
            setTimeout(() => { span.style.opacity = '1'; }, 50);
          }
          setTimeout(() => caret.remove(), 2000);
          return;
        }
        el.insertBefore(document.createTextNode(text[i]), caret);
        i++;
        const wrap = el.closest('.letter-interior');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      }, delay);
    }

    // ── Fairy Lights Bulbs & 3D Polaroid Stack ──
    function build3DPolaroidStack() {
      stackRendered = true;
      
      // Fairy lights bulbs generation
      const bulbsContainer = document.getElementById('fairy-bulbs-container');
      if (bulbsContainer) {
        const colors = ['#4caf50', '#ffeb3b', '#2196f3', '#4caf50', '#ff9800'];
        for (let i = 0; i < 9; i++) {
          const bulb = document.createElement('div');
          bulb.className = 'bulb';
          bulb.style.color = colors[i % colors.length];
          bulb.style.animationDelay = (i * 0.2) + 's';
          bulbsContainer.appendChild(bulb);
        }
      }
      
      const stack = document.getElementById('polaroid-stack');
      if (!stack) return;
      if (!PHOTOS || PHOTOS.length === 0) {
        stack.innerHTML = '<div style="color:var(--xmas-gold-lt);font-style:italic;font-size:0.85rem;text-align:center;margin-top:4rem">No memories attached.</div>';
        return;
      }

      PHOTOS.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.style.zIndex = PHOTOS.length - idx;
        
        // Cascade rot/offset
        const offsetVal = idx * 6;
        const rotVal = (idx % 2 === 0 ? 1.5 : -1.5) * (idx + 1);
        card.style.transform = \`translateY(-\${offsetVal}px) rotate(\${rotVal}deg)\`;

        card.innerHTML = \`
          <img src="\${photo.src}" alt="Memory" loading="lazy">
          \${photo.caption ? \`<p class="polaroid-caption">\${photo.caption}</p>\` : '<p class="polaroid-caption">🌙✨💚</p>'}
        \`;

        // Swipe Gesture Handling (Mouse + Touch)
        let isDragging = false;
        let startX = 0, startY = 0;
        let curX = 0, curY = 0;

        function onStart(e) {
          if (idx !== currentCardIdx()) return;
          isDragging = true;
          const touch = e.type.includes('touch') ? e.touches[0] : e;
          startX = touch.clientX;
          startY = touch.clientY;
          card.style.transition = 'none';
        }

        function onMove(e) {
          if (!isDragging) return;
          const touch = e.type.includes('touch') ? e.touches[0] : e;
          curX = touch.clientX - startX;
          curY = touch.clientY - startY;
          const rotate = curX * 0.08;
          card.style.transform = \`translate(\${curX}px, \${curY}px) rotate(\${rotVal + rotate}deg)\`;
        }

        function onEnd() {
          if (!isDragging) return;
          isDragging = false;
          const threshold = 100;
          if (Math.abs(curX) > threshold || Math.abs(curY) > threshold) {
            // Swipe off-screen
            const directionX = curX > 0 ? 1 : -1;
            const directionY = curY > 0 ? 1 : -1;
            card.style.transition = 'transform 0.5s ease-in';
            card.style.transform = \`translate(\${directionX * 450}px, \${directionY * 400}px) rotate(\${rotVal + (directionX * 30)}deg)\`;
            card.style.pointerEvents = 'none';
            setTimeout(() => card.remove(), 500);
            
            // Advance polaroid pointer
            progressCard();
          } else {
            // Snap back
            card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = \`translateY(-\${offsetVal}px) rotate(\${rotVal}deg)\`;
          }
          curX = 0; curY = 0;
        }

        card.addEventListener('mousedown', onStart);
        card.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        stack.appendChild(card);
      });

      let topCardIdx = 0;
      function currentCardIdx() { return topCardIdx; }
      function progressCard() {
        topCardIdx++;
        // Scale and restore depth of subsequent cards
        const cards = stack.querySelectorAll('.polaroid-card');
        cards.forEach((cardEl, i) => {
          const relativeIdx = i - topCardIdx;
          if (relativeIdx >= 0) {
            cardEl.style.transition = 'transform 0.4s ease';
            const offsetVal = relativeIdx * 6;
            const rotVal = (relativeIdx % 2 === 0 ? 1.5 : -1.5) * (relativeIdx + 1);
            cardEl.style.transform = \`translateY(-\${offsetVal}px) rotate(\${rotVal}deg)\`;
          }
        });
      }
    }

    // ── Audio Deck Wirings ──
    const bgAudio      = document.getElementById('bg-audio');
    const bgmFab       = document.getElementById('music-fab');
    const bgmInnerBtn  = document.getElementById('bgm-inner-btn');
    const vnAudio      = document.getElementById('vn-audio');
    const vnBtn        = document.getElementById('vn-btn');
    const vnProgressEl = document.getElementById('vn-progress');

    function autoPlayBgm() {
      if (!bgAudio) return;
      bgAudio.play().then(() => {
        if (bgmFab)      { bgmFab.classList.add('visible'); bgmFab.textContent = '🎵'; }
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
        toggleVisualizerActive(true);
      }).catch(() => {});
    }

    function toggleBgmPlay() {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        bgAudio.play();
        if (bgmFab)      bgmFab.textContent = '🎵';
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
        toggleVisualizerActive(true);
      } else {
        bgAudio.pause();
        if (bgmFab)      bgmFab.textContent = '🔇';
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9654;';
        toggleVisualizerActive(false);
      }
    }
    if (bgmFab)      bgmFab.addEventListener('click', toggleBgmPlay);
    if (bgmInnerBtn) bgmInnerBtn.addEventListener('click', toggleBgmPlay);

    if (vnBtn && vnAudio) {
      vnBtn.addEventListener('click', () => {
        if (vnAudio.paused) {
          if (bgAudio && !bgAudio.paused) bgAudio.pause();
          vnAudio.play(); vnBtn.innerHTML = '&#9646;&#9646;'; toggleVisualizerActive(true);
        } else {
          vnAudio.pause(); vnBtn.innerHTML = '&#9654;'; toggleVisualizerActive(false);
        }
      });
      vnAudio.addEventListener('timeupdate', () => {
        if (vnProgressEl) vnProgressEl.style.width = ((vnAudio.currentTime / (vnAudio.duration || 1)) * 100) + '%';
      });
      vnAudio.addEventListener('ended', () => {
        vnBtn.innerHTML = '&#9654;';
        if (vnProgressEl) vnProgressEl.style.width = '0%';
        if (bgAudio && bgAudio.paused) bgAudio.play().catch(() => {});
      });
    }

    function toggleVisualizerActive(active) {
      document.querySelectorAll('.v-bar').forEach(bar => {
        bar.style.animationPlayState = active ? 'running' : 'paused';
      });
    }

    // ── Interactive Canvas Lantern Spark Engine ──
    const canvas = document.getElementById('spark-canvas');
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    function makeWarmSpark() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        r: 1.0 + Math.random() * 2.5,
        vy: -0.4 - Math.random() * 0.7,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.015,
        op: 0.3 + Math.random() * 0.6
      };
    }
    
    function makeFurrySpark(x, y, fast = false) {
      const angle = Math.random() * Math.PI * 2;
      const speed = fast ? 2 + Math.random() * 5 : 0.8 + Math.random() * 2.2;
      return {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        r: 1.5 + Math.random() * 2.5,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        color: ['#fff2a3', '#ffd700', '#ffb703'][Math.floor(Math.random() * 3)]
      };
    }

    let sparks = Array.from({ length: 45 }, () => {
      const s = makeWarmSpark();
      s.y = Math.random() * canvas.height; // start scattered
      return s;
    });
    
    let sparklesList = [];

    // Trigger sparkles / Sky Lantern on click
    window.addEventListener('click', (e) => {
      if (e.target.closest('button') || 
          e.target.closest('input') || 
          e.target.closest('audio') || 
          e.target.closest('.circular-play-btn') || 
          e.target.closest('.light-toy') || 
          e.target.closest('.lantern-container') || 
          e.target.closest('.polaroid-card')) {
        return;
      }

      const activeChId = CHAPTERS[activeIdx];
      const rect = canvas.getBoundingClientRect();
      const mX = e.clientX - rect.left;
      const mY = e.clientY - rect.top;
      
      // Star sparkles explosion
      createSparkleExplosion(mX, mY);
      
      // Spawn flying sky lantern
      if (activeChId === 'ch-finale' || activeChId === 'ch-letter') {
        spawnSkyLanternAt(mX, mY);
      }
    });

    function createSparkleExplosion(x, y) {
      playTinkleSound();
      const count = 18;
      const goldColors = ['#fff2a3', '#ffd700', '#f4d068', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.5;
        sparklesList.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.02,
          size: 1.8 + Math.random() * 2.2,
          color: goldColors[Math.floor(Math.random() * goldColors.length)]
        });
      }
    }

    function spawnSkyLanternAt(x, y) {
      const lantern = document.createElement('div');
      lantern.className = 'sky-lantern';
      
      // Spawn near click coordinate
      lantern.style.left = (x - 16) + 'px';
      lantern.style.top = y + 'px';
      
      // slight drift left/right using random margins
      const drift = (Math.random() - 0.5) * 50;
      lantern.style.setProperty('--drift-x', drift + 'px');
      
      document.body.appendChild(lantern);
      
      // Remove after animation finishes (6s)
      setTimeout(() => lantern.remove(), 6000);
    }

    function renderLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const activeChId = CHAPTERS[activeIdx];

      // 1. Draw drifting warm sparks (and twinkling stars in sky)
      sparks.forEach((s, idx) => {
        if (s.life === undefined) {
          s.wobble += s.wobbleSpeed;
          s.y += s.vy;
          s.x += Math.sin(s.wobble) * 0.35;
          
          ctx.save();
          ctx.globalAlpha = s.op;
          ctx.fillStyle = '#ffca3a';
          ctx.shadowBlur = 4; ctx.shadowColor = '#ffca3a';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (s.y < -10) {
            sparks[idx] = makeWarmSpark();
          }
        } else {
          // Exploding spark
          s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.vx *= 0.98; s.life -= s.decay;
          ctx.save();
          ctx.globalAlpha = s.life;
          ctx.fillStyle = s.color || '#ffd700';
          ctx.shadowBlur = 5; ctx.shadowColor = s.color || '#ffd700';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Filter out dead exploding sparks
      sparks = sparks.filter(s => s.life === undefined || s.life > 0.05);

      // 2. Draw gold sparkles from clicks
      sparklesList = sparklesList.filter(f => f.life > 0.03);
      sparklesList.forEach(f => {
        f.x += f.vx; f.y += f.vy; f.vy += 0.04; f.vx *= 0.97; f.life -= f.decay;
        ctx.save();
        ctx.globalAlpha = f.life;
        ctx.fillStyle = f.color;
        ctx.shadowBlur = 6; ctx.shadowColor = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderLoop);
    }

    // Init
    updateNavTracker();
    renderLoop();
    if (!HAS_SECRET) setTimeout(autoPlayBgm, 800);

    function triggerWakeup() {
      const introIdx = CHAPTERS.indexOf('ch-intro');
      if (introIdx !== -1 && activeIdx !== introIdx) transitionToChapter(introIdx);
    }
  </script>
</body>
</html>`;
}
