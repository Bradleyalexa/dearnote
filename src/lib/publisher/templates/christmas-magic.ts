import { PublishedConfig } from "../../schemas/card-draft";

export function generateChristmasMagicHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Merry Christmas!";
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
    <h2 class="ch-heading font-christmas">Memory Ornaments</h2>
    <p class="ch-subheading">Swipe or drag the polaroids hanging on our fairy lights</p>
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
    <h2 class="ch-heading font-christmas">Holiday Melodies</h2>
    <p class="ch-subheading">${hasVoiceNote ? 'Listen to a warm message from me' : 'Enjoy the holiday background music 🎵'}</p>
    <div class="audio-deck">
      <div class="visualizer" id="visualizer">${vBars}</div>
      ${
        hasVoiceNote
          ? `
      <div class="audio-control-row">
        <div class="audio-info">
          <span class="audio-icon">🎙️</span>
          <div>
            <p class="audio-label">Voice Wish</p>
            <p class="audio-sublabel">A personal voice greeting</p>
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
            <p class="audio-label">Carol Player</p>
            <p class="audio-sublabel">Ambient holiday tune</p>
          </div>
        </div>
        <div class="audio-player-control">
          <button id="bgm-inner-btn" class="circular-play-btn">&#9646;&#9646;</button>
          <p class="music-note-decor">Carol of the Bells</p>
        </div>
        <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
      </div>`
          : ""
      }
    </div>
    <button class="action-btn-secondary" id="audio-next-btn">Final Wish &rarr;</button>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merry Christmas! – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&family=Quicksand:wght@500;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Sacramento&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Core Theme ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --xmas-red:      #A8201A;
      --xmas-red-dark: #800F2F;
      --xmas-green:    #143601;
      --xmas-green-lt: #1A4301;
      --xmas-gold:     #D4AF37;
      --xmas-gold-lt:  #F3E5AB;
      --xmas-snow:     #F4F9F9;
      --text-color:    #2B3E2C;
      --card-bg:       rgba(255, 255, 255, 0.9);
      --font-body:     'Quicksand', sans-serif;
      --font-heading:  'Playfair Display', serif;
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--text-color);
      background: linear-gradient(135deg, #143601 0%, #1a4301 50%, #0c2000 100%);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas Snowfall System ── */
    #snow-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 15;
    }

    /* ── Global Progress Shimmer ── */
    #progress-tracker {
      position: fixed; top: 0; left: 0;
      height: 4px; width: 0%;
      background: linear-gradient(90deg, var(--xmas-red), var(--xmas-gold), var(--xmas-snow), var(--xmas-gold), var(--xmas-red));
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
      color: var(--xmas-red); font-size: 1.1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(20, 54, 1, 0.15);
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
    .font-christmas {
      font-family: 'Mountains of Christmas', cursive !important;
      font-weight: 700;
    }
    .ch-heading {
      font-family: var(--font-heading);
      font-size: clamp(2rem, 6.5vw, 2.8rem);
      font-weight: 700;
      color: var(--xmas-gold);
      text-align: center;
      margin-bottom: 0.3rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
    }
    .ch-subheading {
      font-size: 0.78rem; font-family: var(--font-body);
      font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--xmas-gold-lt); text-align: center; margin-bottom: 1.8rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }

    /* ── Action Buttons ── */
    .action-btn-primary {
      padding: 0.95rem 2.8rem;
      font-family: 'Mountains of Christmas', cursive; font-size: 1.3rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--xmas-red) 0%, var(--xmas-red-dark) 100%);
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
      font-family: 'Mountains of Christmas', cursive; font-size: 1.15rem; font-weight: 700;
      color: var(--xmas-red);
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
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
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
    
    .gate-title { font-family: 'Mountains of Christmas', cursive; font-size: 1.7rem; font-weight: 700; color: var(--xmas-red); margin-bottom: 0.2rem; }
    .gate-subtitle { font-size: 0.78rem; color: #555; margin-bottom: 1.4rem; font-style: italic; }
    
    .gate-input {
      width: 100%; padding: 0.8rem 1rem;
      background: #FFF9FA; border: 2px solid rgba(168, 32, 26, 0.3); border-radius: 18px;
      color: var(--text-color); font-family: var(--font-body); font-size: 1.1rem;
      letter-spacing: 0.2em; text-align: center; text-transform: uppercase;
      outline: none; transition: border-color 0.25s, box-shadow 0.25s;
    }
    .gate-input:focus { border-color: var(--xmas-red); box-shadow: 0 0 0 4px rgba(168,32,26,0.15); }
    
    .gate-btn {
      width: 100%; margin-top: 0.8rem; padding: 0.85rem;
      font-family: 'Mountains of Christmas', cursive; font-size: 1.2rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--xmas-red) 0%, var(--xmas-red-dark) 100%);
      border: 1px solid var(--xmas-gold); border-radius: 18px; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .gate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,175,55,0.25); }
    .gate-btn:active { transform: scale(0.97); }
    .gate-error { font-size: 0.72rem; color: var(--xmas-red); height: 1.2rem; margin-top: 0.5rem; font-style: italic; font-weight: bold; }

    /* ════════════════════════════
       Chapter: Snow Globe Shake
    ════════════════════════════ */
    #ch-intro {
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
    }
    .snowglobe-container {
      width: 200px; height: 220px; margin: 0 auto 1.5rem;
      cursor: pointer; position: relative;
    }
    .snowglobe-wrapper {
      width: 100%; height: 100%;
      transition: transform 0.1s;
    }
    .snowglobe-wrapper.shake {
      animation: shakeGlobe 0.8s ease-in-out;
    }
    @keyframes shakeGlobe {
      0%, 100% { transform: rotate(0deg); }
      15% { transform: rotate(-10deg) translateY(-6px); }
      30% { transform: rotate(10deg) translateY(-3px); }
      45% { transform: rotate(-8deg) translateY(-4px); }
      60% { transform: rotate(8deg) translateY(-2px); }
      75% { transform: rotate(-4deg); }
      90% { transform: rotate(4deg); }
    }

    /* ════════════════════════════
       Chapter: Decorate the Tree
    ════════════════════════════ */
    #ch-tree {
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
    }
    .tree-game-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 28px;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      width: 100%;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .tree-game-area {
      position: relative;
      width: 280px;
      height: 250px;
      margin-bottom: 0.5rem;
    }
    .tree-svg {
      position: absolute;
      left: 40px;
      top: 15px;
      width: 200px;
      height: 230px;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
    }
    .tree-svg polygon {
      transition: filter 0.5s ease;
    }
    .tree-svg.lit polygon {
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)) saturate(1.4);
    }
    
    /* Target Dots on Tree */
    .target-slot {
      position: absolute;
      width: 24px;
      height: 24px;
      border: 2px dashed rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-12px, -12px);
      animation: pulseTarget 1.5s infinite;
      z-index: 10;
      transition: opacity 0.3s;
    }
    @keyframes pulseTarget {
      0%, 100% { opacity: 0.4; transform: translate(-12px, -12px) scale(1); }
      50% { opacity: 0.9; transform: translate(-12px, -12px) scale(1.15); }
    }

    /* Ornament Toys inside deck/tree */
    .ornament-toy {
      position: absolute;
      width: 28px;
      height: 28px;
      cursor: pointer;
      z-index: 20;
      transition: left 0.8s cubic-bezier(0.25, 1, 0.5, 1), top 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ornament-toy svg {
      width: 100%; height: 100%;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    .ornament-toy:hover:not(.placed) {
      transform: scale(1.25) rotate(15deg);
    }
    .ornament-toy.placed {
      pointer-events: none;
      cursor: default;
      transform: translate(-14px, -14px);
    }
    
    /* Twinkle Lights Overlay on Tree */
    .tree-lights {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 8;
      opacity: 0;
      transition: opacity 0.8s ease;
    }
    .tree-svg.lit + .tree-lights {
      opacity: 1;
    }
    .light-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
      animation: twinkle 1s infinite alternate;
    }
    @keyframes twinkle {
      0% { opacity: 0.2; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1.2); }
    }

    /* Toys Deck Shelf at the bottom of game card */
    .toys-deck {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      width: 100%;
      background: rgba(255, 255, 255, 0.15);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 10px 15px 35px 15px; /* bottom padding for text space */
      position: relative;
    }
    .deck-shelf-label {
      position: absolute;
      bottom: 6px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.65rem;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: bold;
      pointer-events: none;
    }

    /* ════════════════════════════
       Chapter: Letter Scroll
    ════════════════════════════ */
    #ch-letter {
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
      padding: 0.8rem;
    }
    .letter-board {
      width: 100%; max-width: 440px;
      height: min(80vh, 520px);
      background: #FAF8F5; /* Warm vintage paper */
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
      background: linear-gradient(135deg, var(--xmas-red) 45%, transparent 45%);
      z-index: 15;
    }
    .letter-board::after {
      content: '🎄';
      position: absolute; top: 8px; left: 8px;
      font-size: 1.2rem; z-index: 16;
    }
    @keyframes paperSlideIn { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }
    
    .letter-top-band {
      background: linear-gradient(135deg, var(--xmas-red) 0%, var(--xmas-red-dark) 100%);
      padding: 1.4rem 1.4rem 1.1rem; text-align: center;
      position: relative; flex-shrink: 0;
      border-bottom: 3px solid var(--xmas-gold);
    }
    .letter-title {
      font-family: 'Mountains of Christmas', cursive; font-size: clamp(1.4rem, 4.5vw, 1.9rem);
      font-weight: 700; color: #FFF; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    }
    .letter-recipient {
      font-size: 0.72rem; font-weight: 700; color: var(--xmas-gold-lt);
      letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.2rem;
    }
    
    .letter-interior {
      flex: 1; overflow-y: auto; padding: 1.5rem 1.5rem;
      position: relative; scrollbar-width: thin;
      scrollbar-color: rgba(20,54,1,0.2) transparent;
      background-image: radial-gradient(rgba(20,54,1,0.06) 1.5px, transparent 1.5px);
      background-size: 20px 20px;
      line-height: 1.8;
    }
    .letter-textbox {
      font-size: 0.92rem; line-height: 1.85; color: var(--text-color);
      font-weight: 600; white-space: pre-line; width: 100%;
    }
    .type-caret {
      display: inline-block; width: 2px; height: 1.1em;
      background: var(--xmas-red); margin-left: 2px;
      vertical-align: middle; animation: blinkCaret 0.7s steps(1) infinite;
    }
    @keyframes blinkCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    
    .letter-bottom-band {
      padding: 0.8rem 1.5rem 1rem; border-top: 1.5px dashed rgba(20,54,1,0.2);
      text-align: center; flex-shrink: 0; background: #FFFDFE;
    }
    .letter-sender-label { font-size: 0.68rem; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.1em; }
    .letter-sender-name { font-family: 'Sacramento', cursive; font-size: 2.3rem; color: var(--xmas-red); line-height: 1.1; margin-top: -3px; }
    
    .letter-nav-btn {
      position: absolute; bottom: 0.8rem; right: 0.8rem;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--xmas-red); border: 2px solid var(--xmas-gold); cursor: pointer;
      font-size: 1.1rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.35);
      transition: transform 0.2s, box-shadow 0.2s; z-index: 10;
    }
    .letter-nav-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(212,175,55,0.4); }
    .letter-nav-btn:active { transform: scale(0.93); }

    /* ════════════════════════════
       Chapter: Fairy Lights & Polaroid Gallery
    ════════════════════════════ */
    #ch-photos {
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
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
    /* Peg overlay */
    .polaroid-card::before {
      content: '';
      position: absolute; top: -14px; left: calc(50% - 7px);
      width: 14px; height: 26px;
      background: #d2b48c; border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
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
      background: radial-gradient(circle, #1a4301 0%, #0c2000 100%);
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
      background: linear-gradient(to top, var(--xmas-red), var(--xmas-gold));
      animation: vibeBarAnimation 0.6s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.1); transform-origin: bottom;
    }
    @keyframes vibeBarAnimation { from { transform:scaleY(0.1); opacity: 0.3; } to { transform:scaleY(1); opacity: 1; } }
    
    .audio-control-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .audio-info { display: flex; align-items: center; gap: 0.6rem; }
    .audio-icon { font-size: 1.5rem; }
    .audio-label { font-family: 'Mountains of Christmas', cursive; font-size: 1.1rem; font-weight: 700; color: var(--xmas-red); }
    .audio-sublabel { font-size: 0.68rem; color: #555; }
    
    .audio-player-control { display: flex; align-items: center; gap: 0.6rem; flex: 1; justify-content: flex-end; }
    .circular-play-btn {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, var(--xmas-red), var(--xmas-red-dark));
      border: 1px solid var(--xmas-gold); cursor: pointer; font-size: 0.95rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3); transition: transform 0.2s; flex-shrink: 0;
    }
    .circular-play-btn:hover { transform: scale(1.08); }
    .circular-play-btn:active { transform: scale(0.94); }
    
    .progress-bar-track { width: 60px; height: 4px; background: rgba(168,32,26,0.12); border-radius: 4px; cursor: pointer; position: relative; }
    .progress-bar-fill { height: 100%; background: var(--xmas-red); border-radius: 4px; width: 0%; transition: width 0.1s linear; }
    .music-note-decor { font-size: 0.65rem; color: #555; font-style: italic; font-weight: bold; }

    /* ════════════════════════════
       Chapter: Finale Sleigh Ride
    ════════════════════════════ */
    #ch-finale {
      background: radial-gradient(circle at 50% 50%, #08112b 0%, #03081a 100%);
      color: #FFF;
    }
    .finale-box-wrap {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; max-width: 320px; z-index: 10;
      animation: finaleFadeIn 1.2s ease both;
    }
    @keyframes finaleFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
    
    .finale-bell-icon {
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
    .finale-sender-name { font-family: 'Mountains of Christmas', cursive; font-size: 1.1rem; font-weight: 700; color: var(--xmas-gold); text-transform: uppercase; letter-spacing: 0.12em; }
    .finale-tap-hint { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-top: 1.8rem; font-style: italic; text-align: center; animation: pulseFade 2s infinite; }
    @keyframes pulseFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.95; } }

    /* ── Santa Sleigh Flying Animation ── */
    #santa-sleigh {
      position: fixed;
      top: 30%;
      left: -200px;
      font-size: 3rem;
      pointer-events: none;
      z-index: 40;
      transform: scaleX(-1);
    }
    .fly-santa {
      animation: santaFlight 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    @keyframes santaFlight {
      0% { left: -150px; top: 40%; transform: scale(0.6) scaleX(-1) rotate(-10deg); }
      50% { top: 20%; transform: scale(1) scaleX(-1) rotate(5deg); }
      100% { left: calc(100vw + 150px); top: 35%; transform: scale(0.7) scaleX(-1) rotate(-5deg); }
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
  <canvas id="snow-canvas"></canvas>
  <button id="music-fab" title="Toggle Music">🎵</button>
  <div class="nav-indicator-dots" id="nav-dots"></div>

  <!-- Santa Flight Sleigh Element -->
  <div id="santa-sleigh">🎅🛷🦌🦌</div>

  <!-- ════════ PASSCODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-passcode">
    <div class="gate-card">
      <span class="gate-icon">🎁</span>
      <h2 class="gate-title">Surprise Access</h2>
      <p class="gate-subtitle">Enter the secret key to open your holiday letter</p>
      <input id="code-input" class="gate-input" type="text" maxlength="12" placeholder="SECRET KEY" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="gate-btn">Open Card ✨</button>
      <p id="code-err" class="gate-error"></p>
    </div>
  </div>` : ``}

  <!-- ════════ INTERACTIVE SNOW GLOBE INTRO ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <p class="ch-heading font-christmas" style="margin-bottom:0.5rem">A Holiday Wish for</p>
    <p class="ch-heading font-christmas" style="font-size:3.5rem;line-height:1;margin-bottom:1.5rem;color:#FFF;text-shadow:0 0 15px rgba(212,175,55,0.6)">${config.toName}</p>
    
    <div class="snowglobe-container" id="snowglobe" onclick="shakeSnowGlobe()">
      <div class="snowglobe-wrapper" id="globe-wrapper">
        <svg class="snowglobe-svg" viewBox="0 0 200 220" style="width:100%;height:100%">
          <!-- Globe Glass base -->
          <circle cx="100" cy="100" r="80" fill="url(#glassGrad)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="2" />
          
          <!-- Snow inside Globe -->
          <path d="M26 126 C 60 115, 140 115, 174 126 A 80 80 0 0 1 26 126 Z" fill="#ffffff" />
          
          <!-- Snowman Inside -->
          <circle cx="85" cy="115" r="14" fill="#ffffff" stroke="#eee" stroke-width="0.5" />
          <circle cx="85" cy="94" r="10" fill="#ffffff" stroke="#eee" stroke-width="0.5" />
          <circle cx="82" cy="92" r="1.2" fill="#333" />
          <circle cx="88" cy="92" r="1.2" fill="#333" />
          <polygon points="85,94 92,95 85,97" fill="#ff7a00" />
          <rect x="77" y="81" width="16" height="3" fill="#333" rx="1" />
          <rect x="80" y="73" width="10" height="9" fill="#333" />
          <rect x="81" y="79" width="8" height="2" fill="#a8201a" />
          <path d="M80 98 C 83 101, 87 101, 90 98 L 89 105 L 85 102 Z" fill="#a8201a" />

          <!-- Christmas Tree Inside -->
          <rect x="122" y="112" width="6" height="10" fill="#5c3d2e" />
          <polygon points="125,75 112,100 138,100" fill="#143601" />
          <polygon points="125,90 106,115 144,115" fill="#1a4301" />
          <circle cx="125" cy="74" r="2.5" fill="#ffd700" />
          
          <!-- Glass highlight -->
          <path d="M40 45 A 70 70 0 0 1 150 45 A 74 74 0 0 0 40 45 Z" fill="rgba(255, 255, 255, 0.35)" />
          
          <!-- Wood Base -->
          <path d="M35 170 L 165 170 L 155 195 L 45 195 Z" fill="#5c3d2e" />
          <rect x="40" y="195" width="120" height="10" fill="#40281e" rx="3" />
          <!-- Plaque -->
          <rect x="70" y="177" width="60" height="13" fill="url(#goldGrad)" rx="2" stroke="#b8860b" stroke-width="0.5" />
          <text x="100" y="186" font-family="'Mountains of Christmas', cursive" font-size="8" font-weight="bold" fill="#5c3d2e" text-anchor="middle">SHAKE ME</text>
        </svg>
      </div>
    </div>

    <p class="intro-tagline" id="shake-hint">Click or tap the snow globe to shake it!</p>
    <button class="action-btn-primary" id="open-box-btn" style="margin-top:0.8rem">Shake Globe ❄️</button>
  </div>

  <!-- ════════ DECORATE THE TREE GAME ════════ -->
  <div class="chapter" id="ch-tree">
    <h2 class="ch-heading font-christmas">Decorate the Tree</h2>
    <div class="ch-subheading" id="tree-hint" style="margin-bottom:1rem">Place all the decorations to light up the tree</div>

    <div class="tree-game-container">
      <div class="tree-game-area" id="tree-area">
        <!-- SVG Tree -->
        <svg id="svg-tree" class="tree-svg" viewBox="0 0 200 230">
          <!-- Trunk -->
          <rect x="91" y="190" width="18" height="28" rx="2" fill="#5c3d2e" />
          <!-- Pine layers -->
          <polygon points="100,25 45,95 155,95" fill="#143601" />
          <polygon points="100,70 30,150 170,150" fill="#1a4301" />
          <polygon points="100,115 15,200 185,200" fill="#245501" />
        </svg>
        
        <!-- Twinkle Lights Overlay -->
        <div class="tree-lights">
          <!-- Lights generated by JS -->
        </div>
        
        <!-- Target slots on the tree -->
        <div id="target-star" class="target-slot" style="left: 140px; top: 38px;"></div>
        <div id="target-red" class="target-slot" style="left: 140px; top: 120px;"></div>
        <div id="target-bell" class="target-slot" style="left: 165px; top: 165px;"></div>
        <div id="target-blue" class="target-slot" style="left: 110px; top: 175px;"></div>

        <!-- Toys (Initial layout position matching the deck below) -->
        <div id="toy-star" class="ornament-toy star-toy" style="left: 20px; top: 260px;" onclick="tapOrnament('star')">
          <svg viewBox="0 0 24 24"><path fill="url(#goldGrad)" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
        </div>
        <div id="toy-red" class="ornament-toy red-toy" style="left: 85px; top: 260px;" onclick="tapOrnament('red')">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="url(#redGrad)"/><rect x="11" y="3" width="2" height="3" fill="#ccc"/><circle cx="12" cy="3" r="2" fill="none" stroke="#ccc" stroke-width="1.5"/></svg>
        </div>
        <div id="toy-bell" class="ornament-toy bell-toy" style="left: 150px; top: 260px;" onclick="tapOrnament('bell')">
          <svg viewBox="0 0 24 24"><path fill="url(#goldGrad)" d="M12,2A2,2 0 0,0 10,4A2,2 0 0,0 10,4.29C7.12,5.14 5,7.82 5,11V17L3,19V20H21V19L19,17V11C19,7.82 16.88,5.14 14,4.29A2,2 0 0,0 14,4A2,2 0 0,0 12,2M10,21A2,2 0 0,0 12,23A2,2 0 0,0 14,21H10Z"/></svg>
        </div>
        <div id="toy-blue" class="ornament-toy blue-toy" style="left: 215px; top: 260px;" onclick="tapOrnament('blue')">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="url(#blueGrad)"/><rect x="11" y="3" width="2" height="3" fill="#ccc"/><circle cx="12" cy="3" r="2" fill="none" stroke="#ccc" stroke-width="1.5"/></svg>
        </div>
      </div>

      <!-- Wooden Deck Shelves -->
      <div class="toys-deck" id="xmas-deck">
        <span class="deck-shelf-label">Tap decorations to hang</span>
      </div>
    </div>
    <button class="action-btn-secondary" id="tree-done-btn" style="margin-top:1.2rem;display:none" onclick="advanceChapter()">Open Letter 🎄</button>
  </div>

  <!-- ════════ LETTER SCREEN ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="letter-board">
      <div class="letter-top-band">
        <h2 class="letter-title">${letterTitle}</h2>
        <p class="letter-recipient">Cozy Greetings for &mdash; ${config.toName}</p>
      </div>

      <div class="letter-interior">
        <p id="letter-body-text" class="letter-textbox"></p>
      </div>

      <div class="letter-bottom-band">
        <p class="letter-sender-label">Warm wishes,</p>
        <p class="letter-sender-name">${config.fromName}</p>
      </div>

      <button class="letter-nav-btn" id="letter-next-btn" title="Next Page">&rarr;</button>
    </div>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <!-- ════════ FINALE SLEIGH RIDE ════════ -->
  <div class="chapter" id="ch-finale">
    <div class="finale-box-wrap">
      <span class="finale-bell-icon">🔔</span>
      <p class="finale-message">&ldquo;${config.finalMessage || "Wishing you a warm, cozy Christmas and a beautiful New Year filled with magic!"}&rdquo;</p>
      
      <div class="finale-sender-wrap">
        <div class="finale-line"></div>
        <span class="finale-sender-name">${config.fromName}</span>
        <div class="finale-line"></div>
      </div>
      
      <p class="finale-tap-hint">Tap on the sky to launch sparkling stars! 🌟</p>
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
    if (PHOTOS && PHOTOS.length > 0) CHAPTERS.push('ch-photos');
    if (HAS_AUDIO) CHAPTERS.push('ch-audio');
    CHAPTERS.push('ch-finale');

    let activeIdx = 0;
    let textTyped = false;
    let stackRendered = false;
    let finalWishTriggered = false;

    // ── Web Audio Synth Manager (Self-Contained Sounds!) ──
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
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    }

    // Success Holiday Fanfare / Tree Lights chime arpeggio
    function playSuccessFanfare() {
      try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
          }, i * 90);
        });
      } catch (e) {}
    }

    // Shake sound (whoosh + bell tinkles)
    function playShakeSound() {
      try {
        const ctx = getAudioContext();
        
        // noise buffer
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.38);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        
        // Bell tinkles
        const bellNotes = [987.77, 1318.51, 1567.98, 1975.53]; // B5, E6, G6, B6
        bellNotes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 20, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.21);
          }, i * 60 + 50);
        });
      } catch (e) {}
    }

    // Custom Jingle Bells (high frequency metallic strike)
    function playJingleBell() {
      try {
        const ctx = getAudioContext();
        const baseFreqs = [1200, 1500, 1800, 2400];
        baseFreqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.13);
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
        setTimeout(triggerSantaFlight, 800);
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
          errEl.textContent = 'Incorrect key, please try again! ❄️';
          setTimeout(() => { errEl.textContent = ''; }, 2500);
        }
        input.value = '';
        input.style.borderColor = 'var(--xmas-red)';
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
      // Shakes the globe first, then advances
      openSnowGlobe();
    });
    if (letterNext) letterNext.addEventListener('click', advanceChapter);
    if (photosNext) photosNext.addEventListener('click', advanceChapter);
    if (audioNext) audioNext.addEventListener('click', advanceChapter);

    // ── Snow Globe Shaking ──
    let isGlobeShaken = false;
    function openSnowGlobe() {
      if (isGlobeShaken) return;
      isGlobeShaken = true;
      
      const wrapper = document.getElementById('globe-wrapper');
      const hint = document.getElementById('shake-hint');
      const btn = document.getElementById('open-box-btn');
      
      if (wrapper) wrapper.classList.add('shake');
      if (hint) hint.innerText = "⭐ Snow Swirling! ⭐";
      if (btn) btn.disabled = true;
      
      playShakeSound();
      
      // Trigger a mini explosion of snow particles inside canvas center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.45;
      for (let i = 0; i < 40; i++) {
        snowflakes.push(makeFurrySnowflake(centerX, centerY));
      }
      
      // Delay before advancing to minigame
      setTimeout(() => {
        advanceChapter();
        autoPlayBgm();
      }, 1500);
    }
    
    // Wire up snow globe click
    const sGlobe = document.getElementById('snowglobe');
    if (sGlobe) sGlobe.addEventListener('click', openSnowGlobe);

    // ── Decorate Tree Minigame ──
    let ornamentsPlaced = 0;
    const treeLights = document.querySelector('.tree-lights');
    const treeSvg = document.getElementById('svg-tree');
    
    // Create random fairy lights positions on tree
    const lightPositions = [
      {left: '42%', top: '35%', color: '#ff4d4d'},
      {left: '58%', top: '35%', color: '#ffeb3b'},
      {left: '35%', top: '55%', color: '#2196f3'},
      {left: '65%', top: '55%', color: '#e91e63'},
      {left: '50%', top: '50%', color: '#4caf50'},
      {left: '48%', top: '70%', color: '#ff9800'},
      {left: '28%', top: '72%', color: '#ffeb3b'},
      {left: '72%', top: '72%', color: '#00ffff'},
      {left: '50%', top: '20%', color: '#ffffff'}
    ];
    
    lightPositions.forEach(pos => {
      const dot = document.createElement('div');
      dot.className = 'light-dot';
      dot.style.left = pos.left;
      dot.style.top = pos.top;
      dot.style.color = pos.color;
      dot.style.animationDelay = (Math.random() * 0.8) + 's';
      if (treeLights) treeLights.appendChild(dot);
    });

    function tapOrnament(type) {
      const toy = document.getElementById('toy-' + type);
      const target = document.getElementById('target-' + type);
      if (!toy || toy.classList.contains('placed')) return;
      
      toy.classList.add('placed');
      if (target) target.style.opacity = '0';
      playPlacementSound();
      
      // Move to correct slot
      if (type === 'star') {
        toy.style.left = '140px';
        toy.style.top = '38px';
      } else if (type === 'red') {
        toy.style.left = '140px';
        toy.style.top = '120px';
      } else if (type === 'bell') {
        toy.style.left = '165px';
        toy.style.top = '165px';
      } else if (type === 'blue') {
        toy.style.left = '110px';
        toy.style.top = '175px';
      }
      
      ornamentsPlaced++;
      
      if (ornamentsPlaced === 4) {
        // Trigger completion
        setTimeout(() => {
          if (treeSvg) treeSvg.classList.add('lit');
          playSuccessFanfare();
          
          // Confetti-like snow explosion on tree
          const rect = treeSvg.getBoundingClientRect();
          const tX = rect.left + rect.width / 2;
          const tY = rect.top + rect.height / 2;
          for (let i = 0; i < 35; i++) {
            snowflakes.push(makeFurrySnowflake(tX, tY, true));
          }
          
          const hint = document.getElementById('tree-hint');
          if (hint) {
            hint.innerHTML = "✨ <strong>Tree lit up! Merry Christmas!</strong> ✨";
            hint.style.color = "var(--xmas-gold)";
          }
          
          // Hide deck
          const deck = document.getElementById('xmas-deck');
          if (deck) deck.style.display = 'none';
          
          // Show Done button
          const doneBtn = document.getElementById('tree-done-btn');
          if (doneBtn) doneBtn.style.display = 'inline-block';
        }, 800);
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
      const timer = setInterval(() => {
        if (i >= text.length) {
          clearInterval(timer);
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
        const colors = ['#f44336', '#ffeb3b', '#2196f3', '#4caf50', '#ff9800'];
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
          \${photo.caption ? \`<p class="polaroid-caption">\${photo.caption}</p>\` : '<p class="polaroid-caption">🎄❤️🎄</p>'}
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

    // ── Interactive Canvas Snowfall Engine ──
    const canvas = document.getElementById('snow-canvas');
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    function makeSnowflake() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        r: 1.5 + Math.random() * 3.5,
        d: 0.3 + Math.random() * 0.8, // density/speed
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.01
      };
    }
    
    function makeFurrySnowflake(x, y, fast = false) {
      const angle = Math.random() * Math.PI * 2;
      const speed = fast ? 2 + Math.random() * 5 : 0.8 + Math.random() * 2.2;
      return {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        r: 2 + Math.random() * 3.5,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02
      };
    }

    let snowflakes = Array.from({ length: 70 }, () => {
      const s = makeSnowflake();
      s.y = Math.random() * canvas.height; // start scattered
      return s;
    });
    
    let sparklesList = [];

    // Trigger sparkles / Santa sleigh flying on click
    window.addEventListener('click', (e) => {
      // Ignore clicks on interactive items
      if (e.target.closest('button') || 
          e.target.closest('input') || 
          e.target.closest('audio') || 
          e.target.closest('.circular-play-btn') || 
          e.target.closest('.ornament-toy') || 
          e.target.closest('.snowglobe-container') || 
          e.target.closest('.polaroid-card')) {
        return;
      }

      const activeChId = CHAPTERS[activeIdx];
      const rect = canvas.getBoundingClientRect();
      const mX = e.clientX - rect.left;
      const mY = e.clientY - rect.top;
      
      // Star sparkles explosion
      createSparkleExplosion(mX, mY);
      
      // If in Finale chapter, allow Santa flight trigger on tap
      if (activeChId === 'ch-finale') {
        triggerSantaFlight();
      }
    });

    function createSparkleExplosion(x, y) {
      playJingleBell();
      const count = 24;
      const goldColors = ['#fff2a3', '#ffd700', '#f4d068', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.0 + Math.random() * 3.0;
        sparklesList.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          life: 1.0,
          decay: 0.018 + Math.random() * 0.02,
          size: 2.0 + Math.random() * 2.5,
          color: goldColors[Math.floor(Math.random() * goldColors.length)]
        });
      }
    }

    // Santa sleigh trigger
    let isSantaFlying = false;
    function triggerSantaFlight() {
      if (isSantaFlying) return;
      isSantaFlying = true;
      
      const santa = document.getElementById('santa-sleigh');
      if (santa) {
        santa.classList.add('fly-santa');
        // Synthesize jingle sound during flight
        let bellsCount = 0;
        const interval = setInterval(() => {
          if (bellsCount >= 10) {
            clearInterval(interval);
            return;
          }
          playJingleBell();
          bellsCount++;
        }, 350);
        
        setTimeout(() => {
          santa.classList.remove('fly-santa');
          isSantaFlying = false;
        }, 4100);
      }
    }

    function renderLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const activeChId = CHAPTERS[activeIdx];
      const isNight = activeChId === 'ch-finale';

      // 1. Draw drifting snowflakes
      snowflakes.forEach((s, idx) => {
        if (s.life === undefined) {
          // Regular falling snow
          s.wobble += s.wobbleSpeed;
          s.y += s.d * 1.5;
          s.x += Math.sin(s.wobble) * 0.4;
          
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (s.y > canvas.height + 10) {
            snowflakes[idx] = makeSnowflake();
          }
        } else {
          // Exploding furry snowflake
          s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.vx *= 0.98; s.life -= s.decay;
          ctx.save();
          ctx.globalAlpha = s.life;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Filter out dead furry snowflakes
      snowflakes = snowflakes.filter(s => s.life === undefined || s.life > 0.05);

      // 2. Draw gold sparkles
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
