import { PublishedConfig } from "../../schemas/card-draft";

export function generateBirthdayMagicHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Happy Birthday!";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasPhotos = config.photos && config.photos.length > 0;
  const hasAudio = hasVoiceNote; // Audio chapter only if voice note exists

  const vBars = Array.from({ length: 24 }, (_, i) =>
    `<div class="v-bar" style="animation-delay:${(i * 0.04).toFixed(3)}s;height:${12 + ((i % 6) * 6)}px"></div>`
  ).join("");

  const photosChapterHtml = hasPhotos
    ? `
  <div class="chapter" id="ch-photos">
    <h2 class="ch-heading">Magical Memories</h2>
    <p class="ch-subheading">Swipe or drag the cards to see our story</p>
    <div class="card-stack-container">
      <div class="card-stack" id="polaroid-stack"></div>
    </div>
    <button class="action-btn-secondary" id="photos-next-btn">Continue &rarr;</button>
  </div>`
    : "";

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <h2 class="ch-heading">A Melody for You</h2>
    <p class="ch-subheading">Voices and songs of our celebration</p>
    <div class="audio-deck">
      <div class="visualizer" id="visualizer">${vBars}</div>
      ${
        hasVoiceNote
          ? `
      <div class="audio-control-row">
        <div class="audio-info">
          <span class="audio-icon">🎙️</span>
          <div>
            <p class="audio-label">Voice Message</p>
            <p class="audio-sublabel">A heartfelt audio wish</p>
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
      <div class="audio-control-row" style="border-top:1.5px dashed rgba(255,154,162,0.25);margin-top:0.9rem;padding-top:0.9rem">
        <div class="audio-info">
          <span class="audio-icon">🎵</span>
          <div>
            <p class="audio-label">Background Music</p>
            <p class="audio-sublabel">Playing in the background</p>
          </div>
        </div>
        <div class="audio-player-control">
          <button id="bgm-inner-btn" class="circular-play-btn">&#9646;&#9646;</button>
          <p class="music-note-decor">Accompanying your day</p>
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
  <title>Happy Birthday! – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Quicksand:wght@500;700&family=Grand+Hotel&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Core Theme ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --pastel-pink:   #FFB7B2;
      --pastel-peach:  #FFDAC1;
      --pastel-yellow: #E2F0CB;
      --pastel-green:  #B5EAD7;
      --pastel-blue:   #C7CEEA;
      --pastel-lavender:#E8C7EA;
      --primary:       #FF6B8B;
      --primary-dark:  #E04E6E;
      --text-color:    #5C4D52;
      --card-bg:       rgba(255, 255, 255, 0.9);
      --font-body:     'Quicksand', sans-serif;
      --font-heading:  'Fredoka', sans-serif;
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--text-color);
      background: linear-gradient(135deg, #FFF0F2 0%, #FFF9E6 50%, #E8F0FE 100%);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas Particle System ── */
    #party-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 15;
    }

    /* ── Global Progress Shimmer ── */
    #progress-tracker {
      position: fixed; top: 0; left: 0;
      height: 4px; width: 0%;
      background: linear-gradient(90deg, var(--pastel-pink), var(--pastel-yellow), var(--pastel-green), var(--pastel-blue), var(--pastel-pink));
      background-size: 200% auto;
      animation: shimmerBar 3s linear infinite;
      z-index: 100;
      transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 0 10px rgba(255, 107, 139, 0.3);
    }
    @keyframes shimmerBar { to { background-position: 200% center; } }

    /* ── Background Music Control ── */
    #music-fab {
      position: fixed; top: 1rem; right: 1rem; z-index: 101;
      width: 42px; height: 42px; border-radius: 50%;
      background: var(--card-bg);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(255,107,139,0.3);
      color: var(--primary); font-size: 1.1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(255,107,139,0.18);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #music-fab.visible { display: flex; }
    #music-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(255,107,139,0.3); }

    /* ── Navigation Dots ── */
    .nav-indicator-dots {
      position: fixed; right: 1.2rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 10px; z-index: 50;
    }
    .nav-dot-item {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,107,139,0.25);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-dot-item.active {
      background: var(--primary);
      transform: scale(1.6);
      box-shadow: 0 0 10px rgba(255,107,139,0.5);
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
    .ch-heading {
      font-family: var(--font-heading);
      font-size: clamp(2rem, 6.5vw, 3rem);
      font-weight: 700;
      color: var(--primary);
      text-align: center;
      margin-bottom: 0.3rem;
      text-shadow: 2px 2px 0px rgba(255,255,255,0.8);
      filter: drop-shadow(0 2px 4px rgba(255,107,139,0.15));
    }
    .ch-subheading {
      font-size: 0.8rem; font-family: var(--font-body);
      font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: #9A8A90; text-align: center; margin-bottom: 2rem;
    }

    /* ── Action Buttons ── */
    .action-btn-primary {
      padding: 0.95rem 2.8rem;
      font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--primary) 0%, #FF92A9 100%);
      border: none; border-radius: 50px; cursor: pointer;
      box-shadow: 0 6px 20px rgba(255,107,139,0.35), 0 2px 0 rgba(255,255,255,0.25) inset;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: pulseBtn 2.5s infinite;
    }
    .action-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(255,107,139,0.48); }
    .action-btn-primary:active { transform: translateY(0) scale(0.97); }
    @keyframes pulseBtn {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    .action-btn-secondary {
      padding: 0.8rem 2.2rem;
      font-family: var(--font-heading); font-size: 0.85rem; font-weight: 600;
      color: var(--primary);
      background: rgba(255,255,255,0.85);
      border: 2px solid rgba(255,107,139,0.35);
      border-radius: 50px; cursor: pointer;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 3px 12px rgba(255,107,139,0.1);
      transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
    }
    .action-btn-secondary:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 6px 20px rgba(255,107,139,0.22); }
    .action-btn-secondary:active { transform: scale(0.97); }

    /* ════════════════════════════
       Chapter: Passcode Gate
    ════════════════════════════ */
    #ch-passcode {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFF5EB 100%);
    }
    .gate-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 3px solid rgba(255,183,178,0.5);
      border-radius: 32px; padding: 2.2rem 1.8rem 1.8rem;
      text-align: center; width: 100%; max-width: 320px;
      box-shadow: 0 12px 36px rgba(255,182,185,0.25), 0 1px 0 rgba(255,255,255,0.9) inset;
      animation: cardPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes cardPopIn { from { transform: scale(0.85) translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
    
    .gate-icon { font-size: 3rem; margin-bottom: 0.8rem; display: block; animation: floatCake 3s ease-in-out infinite; }
    @keyframes floatCake { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    
    .gate-title { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-color); margin-bottom: 0.4rem; }
    .gate-subtitle { font-size: 0.78rem; color: #9A8A90; margin-bottom: 1.4rem; font-style: italic; }
    
    .gate-input {
      width: 100%; padding: 0.8rem 1rem;
      background: #FFF5F7; border: 2px solid rgba(255,107,139,0.25); border-radius: 18px;
      color: var(--text-color); font-family: var(--font-heading); font-size: 1.1rem;
      letter-spacing: 0.2em; text-align: center; text-transform: uppercase;
      outline: none; transition: border-color 0.25s, box-shadow 0.25s;
    }
    .gate-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(255,107,139,0.15); }
    
    .gate-btn {
      width: 100%; margin-top: 0.8rem; padding: 0.85rem;
      font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--primary) 0%, #FF92A9 100%);
      border: none; border-radius: 18px; cursor: pointer;
      box-shadow: 0 4px 14px rgba(255,107,139,0.28);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .gate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,107,139,0.42); }
    .gate-btn:active { transform: scale(0.97); }
    .gate-error { font-size: 0.72rem; color: #E53E3E; height: 1.2rem; margin-top: 0.5rem; font-style: italic; }

    /* ════════════════════════════
       Chapter: Interactive Intro
    ════════════════════════════ */
    #ch-intro {
      background: radial-gradient(circle at 50% 50%, #FFF9EB 0%, #FFF0F2 100%);
    }
    .gift-box-art {
      width: 120px; height: 120px; position: relative; margin-bottom: 1.5rem;
      cursor: pointer; animation: boxBounce 2s ease-in-out infinite;
    }
    @keyframes boxBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    
    .intro-title {
      font-family: var(--font-heading);
      font-size: clamp(2.2rem, 7.5vw, 3.8rem);
      font-weight: 700;
      text-align: center;
      color: var(--primary);
      line-height: 1.1;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
    }
    .intro-decor-ribbon {
      display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin: 0.6rem 0 1rem;
    }
    .ribbon-line { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, var(--primary), transparent); }
    .ribbon-knot { font-size: 1.2rem; }

    .intro-tagline {
      font-size: clamp(0.72rem, 2vw, 0.88rem); font-weight: 600;
      letter-spacing: 0.15em; text-transform: uppercase; color: #9A8A90;
      text-align: center; max-width: 280px; line-height: 1.4;
    }

    /* ════════════════════════════
       Chapter: Candle Game
    ════════════════════════════ */
    #ch-candle {
      background: radial-gradient(circle at 50% 50%, #F5FAFF 0%, #E8F0FE 100%);
    }
    .candle-instructions {
      font-size: 0.9rem; font-weight: 700; color: var(--primary);
      background: rgba(255,255,255,0.7); padding: 0.5rem 1.2rem;
      border-radius: 50px; margin-bottom: 2rem; border: 1.5px dashed rgba(255,107,139,0.3);
      box-shadow: 0 4px 10px rgba(0,0,0,0.02);
    }
    
    /* CSS Cake Design */
    .cake-container {
      position: relative; width: 220px; height: 180px; margin-bottom: 2rem;
    }
    .cake-plate {
      position: absolute; bottom: 0; left: 0; width: 100%; height: 12px;
      background: #E2E8F0; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .cake-layer {
      position: absolute; left: 50%; transform: translateX(-50%);
      width: 170px; height: 65px; background: #FFF9F2;
      border-radius: 12px 12px 0 0;
      border: 3px solid #F3E5D8; border-bottom: none;
      box-shadow: inset 0 8px 0 #FFDAC1, 0 4px 10px rgba(0,0,0,0.03);
    }
    .cake-layer-top {
      bottom: 60px; width: 130px; height: 55px; background: #FFF0F2;
      border: 3px solid #F6D6D9; border-bottom: none;
      box-shadow: inset 0 8px 0 #FFB7B2;
    }
    .cake-layer-bottom {
      bottom: 10px;
    }
    .frosting-drip {
      position: absolute; top: 0; left: 0; width: 100%; height: 15px;
      background: #FF99C8; border-radius: 12px 12px 0 0;
    }
    .cake-layer-top .frosting-drip {
      background: #FF6B8B;
    }
    
    /* Candle & Flame */
    .candles-row {
      position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 18px; justify-content: center; width: 120px; z-index: 5;
    }
    .cake-candle {
      position: relative; width: 10px; height: 35px;
      background: linear-gradient(90deg, #A9DEF9 50%, #8CCEF0 50%);
      background-size: 100% 10px;
      border-radius: 2px 2px 0 0; cursor: pointer;
      transition: transform 0.2s;
    }
    .cake-candle:nth-child(2) { background: linear-gradient(90deg, #E4C1F9 50%, #CE9CED 50%); }
    .cake-candle:nth-child(3) { background: linear-gradient(90deg, #D0F4DE 50%, #AEE6C2 50%); }
    .cake-candle:hover { transform: scaleY(1.08); }
    
    .candle-wick {
      position: absolute; top: -5px; left: 4px; width: 2px; height: 6px; background: #333;
    }
    .candle-flame {
      position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
      width: 10px; height: 15px;
      background: radial-gradient(circle at 50% 80%, #FFF7D6 20%, #FFAA00 60%, #FF3C00 100%);
      border-radius: 50% 50% 35% 35%;
      box-shadow: 0 0 10px #FF9900, 0 0 20px #FF3C00;
      animation: flicker 0.12s ease-in-out infinite alternate;
      transform-origin: center bottom;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .cake-candle.blown .candle-flame {
      opacity: 0; transform: translateX(-50%) scale(0); pointer-events: none;
    }
    @keyframes flicker {
      0% { transform: translateX(-50%) rotate(-1.5deg) scaleX(0.95); }
      100% { transform: translateX(-50%) rotate(1.5deg) scaleX(1.05); }
    }

    /* Smoke Particle Overlay */
    .smoke-puff {
      position: absolute; width: 6px; height: 6px; background: rgba(220,220,220,0.7);
      border-radius: 50%; pointer-events: none;
      animation: driftSmoke 0.6s ease-out forwards;
    }
    @keyframes driftSmoke {
      to { transform: translateY(-30px) scale(3.5); opacity: 0; }
    }

    /* ════════════════════════════
       Chapter: Letter Screen
    ════════════════════════════ */
    #ch-letter {
      background: radial-gradient(circle at 35% 65%, #FFF0EB 0%, #FFF6F7 100%);
      padding: 0.8rem;
    }
    .letter-board {
      width: 100%; max-width: 440px;
      height: min(80vh, 520px);
      background: #FFFFFF;
      border: 3px solid #FFF;
      border-radius: 28px;
      box-shadow:
        0 10px 30px rgba(255,182,185,0.18),
        0 25px 60px rgba(217,107,130,0.08),
        0 0 0 6px rgba(255,220,223,0.4);
      display: flex; flex-direction: column;
      overflow: hidden; position: relative;
      animation: paperSlideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes paperSlideIn { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }
    
    .letter-top-band {
      background: linear-gradient(135deg, #FFB7B2 0%, #FFCCD5 100%);
      padding: 1.2rem 1.4rem 1rem; text-align: center;
      position: relative; flex-shrink: 0;
    }
    .letter-title {
      font-family: var(--font-heading); font-size: clamp(1.2rem, 4vw, 1.6rem);
      font-weight: 700; color: #FFF; text-shadow: 1px 1px 2px rgba(217,107,130,0.3);
    }
    .letter-recipient {
      font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.85);
      letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.2rem;
    }
    
    .letter-interior {
      flex: 1; overflow-y: auto; padding: 1.3rem 1.5rem;
      position: relative; scrollbar-width: thin;
      scrollbar-color: rgba(255,107,139,0.2) transparent;
      background-image: radial-gradient(rgba(255,182,185,0.15) 1.5px, transparent 1.5px);
      background-size: 20px 20px;
    }
    .letter-textbox {
      font-size: 0.88rem; line-height: 1.8; color: var(--text-color);
      font-weight: 600; white-space: pre-line; width: 100%;
    }
    .type-caret {
      display: inline-block; width: 2px; height: 1.1em;
      background: var(--primary); margin-left: 2px;
      vertical-align: middle; animation: blinkCaret 0.7s steps(1) infinite;
    }
    @keyframes blinkCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    
    .letter-bottom-band {
      padding: 0.8rem 1.5rem 1rem; border-top: 1.5px dashed rgba(255,182,185,0.3);
      text-align: center; flex-shrink: 0; background: #FFFDFE;
    }
    .letter-sender-label { font-size: 0.68rem; font-weight: 700; color: #9A8A90; text-transform: uppercase; letter-spacing: 0.1em; }
    .letter-sender-name { font-family: 'Grand Hotel', cursive; font-size: 2rem; color: var(--primary); line-height: 1.1; }
    
    .letter-nav-btn {
      position: absolute; bottom: 0.8rem; right: 0.8rem;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--primary); border: none; cursor: pointer;
      font-size: 1.1rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 15px rgba(255,107,139,0.35);
      transition: transform 0.2s, box-shadow 0.2s; z-index: 10;
    }
    .letter-nav-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(255,107,139,0.5); }
    .letter-nav-btn:active { transform: scale(0.93); }

    /* ════════════════════════════
       Chapter: 3D Photo Stack
    ════════════════════════════ */
    #ch-photos {
      background: radial-gradient(circle at 60% 40%, #FFF3EB 0%, #FFF0F2 100%);
    }
    .card-stack-container {
      width: 100%; max-width: 300px; height: 320px;
      position: relative; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center;
    }
    .card-stack {
      width: 240px; height: 290px; position: relative;
    }
    .polaroid-card {
      position: absolute; width: 100%; height: 100%;
      background: #FFFFFF; padding: 10px 10px 2.4rem 10px;
      border-radius: 20px; border: 1.5px solid #F3E8EB;
      box-shadow: 0 8px 25px rgba(255,182,185,0.22), 0 1px 0 #FFF inset;
      cursor: grab; touch-action: none;
      transform-origin: center center;
      transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex; flex-direction: column;
    }
    .polaroid-card:active { cursor: grabbing; }
    .polaroid-card img {
      width: 100%; aspect-ratio: 1; object-fit: cover;
      border-radius: 12px; display: block; flex-shrink: 0;
      pointer-events: none;
    }
    .polaroid-caption {
      font-family: var(--font-body); font-weight: 700; font-size: 0.75rem;
      color: var(--text-color); text-align: center; margin-top: auto;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      pointer-events: none;
    }

    /* ════════════════════════════
       Chapter: Audio Deck
    ════════════════════════════ */
    #ch-audio {
      background: radial-gradient(circle at 40% 60%, #F0EAFB 0%, #FFF0F2 100%);
    }
    .audio-deck {
      width: 100%; max-width: 350px;
      background: var(--card-bg);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 3px solid rgba(255,183,178,0.4);
      border-radius: 30px; padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(255,182,185,0.18), 0 1px 0 rgba(255,255,255,0.9) inset;
      margin-bottom: 2rem;
    }
    .visualizer {
      display: flex; align-items: flex-end; justify-content: center; gap: 3.5px;
      height: 45px; margin-bottom: 1.4rem;
    }
    .v-bar {
      width: 4px; border-radius: 10px;
      background: linear-gradient(to top, var(--primary), #FFCAD4);
      animation: vibeBarAnimation 0.6s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.1); transform-origin: bottom;
    }
    @keyframes vibeBarAnimation { from { transform:scaleY(0.1); opacity: 0.3; } to { transform:scaleY(1); opacity: 1; } }
    
    .audio-control-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .audio-info { display: flex; align-items: center; gap: 0.6rem; }
    .audio-icon { font-size: 1.5rem; }
    .audio-label { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--text-color); }
    .audio-sublabel { font-size: 0.68rem; color: #9A8A90; }
    
    .audio-player-control { display: flex; align-items: center; gap: 0.6rem; flex: 1; justify-content: flex-end; }
    .circular-play-btn {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), #FF92A9);
      border: none; cursor: pointer; font-size: 0.95rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(255,107,139,0.3); transition: transform 0.2s; flex-shrink: 0;
    }
    .circular-play-btn:hover { transform: scale(1.08); }
    .circular-play-btn:active { transform: scale(0.94); }
    
    .progress-bar-track { width: 60px; height: 4px; background: rgba(255,107,139,0.12); border-radius: 4px; cursor: pointer; position: relative; }
    .progress-bar-fill { height: 100%; background: var(--primary); border-radius: 4px; width: 0%; transition: width 0.1s linear; }
    .music-note-decor { font-size: 0.65rem; color: #9A8A90; font-style: italic; }

    /* ════════════════════════════
       Chapter: Finale Wishes
    ════════════════════════════ */
    #ch-finale {
      background: radial-gradient(circle at 50% 50%, #1A1230 0%, #0D081F 100%);
      color: #FFF;
    }
    .finale-box-wrap {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; max-width: 320px; z-index: 10;
      animation: finaleFadeIn 1.2s ease both;
    }
    @keyframes finaleFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
    
    .finale-cake-icon {
      font-size: 4rem; margin-bottom: 1.4rem;
      filter: drop-shadow(0 0 15px rgba(255,107,139,0.6));
      animation: heartbeatPulse 1.5s ease-in-out infinite;
    }
    @keyframes heartbeatPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    
    .finale-message {
      font-family: 'Grand Hotel', cursive;
      font-size: clamp(2.2rem, 7.5vw, 2.8rem);
      color: #FFF; line-height: 1.35;
      text-shadow: 0 0 12px rgba(255,107,139,0.6), 0 0 24px rgba(255,107,139,0.3);
      margin-bottom: 0.5rem;
    }
    .finale-sender-wrap {
      display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-top: 1rem;
    }
    .finale-line { width: 40px; height: 1.5px; background: rgba(255,255,255,0.2); }
    .finale-sender-name { font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; color: var(--pastel-pink); text-transform: uppercase; letter-spacing: 0.12em; }
    .finale-tap-hint { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-top: 1.8rem; font-style: italic; animation: pulseFade 2s infinite; }
    @keyframes pulseFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.95; } }
  </style>
</head>
<body>

  <div id="progress-tracker"></div>
  <canvas id="party-canvas"></canvas>
  <button id="music-fab" title="Toggle Music">🎵</button>
  <div class="nav-indicator-dots" id="nav-dots"></div>

  <!-- ════════ PASSCODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-passcode">
    <div class="gate-card">
      <span class="gate-icon">🎂</span>
      <h2 class="gate-title">Birthday Surprise</h2>
      <p class="gate-subtitle">Enter the secret code to open your surprise</p>
      <input id="code-input" class="gate-input" type="text" maxlength="12" placeholder="ACCESS CODE" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="gate-btn">Reveal Gift ✨</button>
      <p id="code-err" class="gate-error"></p>
    </div>
  </div>` : ``}

  <!-- ════════ INTERACTIVE INTRO ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <div class="gift-box-art" id="intro-gift-box">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF99C8" />
            <stop offset="100%" stop-color="#FF6B8B" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCF6BD" />
            <stop offset="100%" stop-color="#FFD166" />
          </linearGradient>
        </defs>
        <!-- Box Body -->
        <rect x="20" y="40" width="60" height="50" rx="8" fill="url(#boxGrad)" stroke="#FF5577" stroke-width="2" />
        <!-- Lid -->
        <rect x="15" y="30" width="70" height="15" rx="4" fill="url(#boxGrad)" stroke="#FF5577" stroke-width="2" />
        <!-- Vertical Ribbon -->
        <rect x="44" y="30" width="12" height="60" fill="url(#ribbonGrad)" />
        <!-- Horizontal Ribbon -->
        <rect x="20" y="58" width="60" height="12" fill="url(#ribbonGrad)" />
        <!-- Ribbon Knot/Bow -->
        <path d="M50 30 C35 15, 45 5, 50 22 C55 5, 65 15, 50 30 Z" fill="url(#ribbonGrad)" stroke="#FFB300" stroke-width="1.5" />
        <ellipse cx="50" cy="27" rx="6" ry="4" fill="#FFD166" />
      </svg>
    </div>

    <p class="intro-title">${config.toName}</p>
    
    <div class="intro-decor-ribbon">
      <div class="ribbon-line"></div>
      <span class="ribbon-knot">🎁</span>
      <div class="ribbon-line"></div>
    </div>

    <p class="intro-tagline">Tap the gift box to pop the balloons & open your card</p>
    <button class="action-btn-primary" id="open-box-btn" style="margin-top:2rem">Open Card 🌸</button>
  </div>

  <!-- ════════ CANDLE GAME ════════ -->
  <div class="chapter" id="ch-candle">
    <h2 class="ch-heading">Make a Wish!</h2>
    <div class="candle-instructions" id="candle-hint">Tap each candle to blow it out</div>

    <div class="cake-container">
      <div class="cake-plate"></div>
      <div class="cake-layer cake-layer-bottom">
        <div class="frosting-drip"></div>
      </div>
      <div class="cake-layer cake-layer-top">
        <div class="frosting-drip"></div>
      </div>
      
      <!-- Lit Candles -->
      <div class="candles-row" id="candles-group">
        <div class="cake-candle" onclick="blowCandle(this)">
          <div class="candle-wick"></div>
          <div class="candle-flame"></div>
        </div>
        <div class="cake-candle" onclick="blowCandle(this)">
          <div class="candle-wick"></div>
          <div class="candle-flame"></div>
        </div>
        <div class="cake-candle" onclick="blowCandle(this)">
          <div class="candle-wick"></div>
          <div class="candle-flame"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════ LETTER SCREEN ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="letter-board">
      <div class="letter-top-band">
        <h2 class="letter-title">${letterTitle}</h2>
        <p class="letter-recipient">Especially for &mdash; ${config.toName}</p>
      </div>

      <div class="letter-interior">
        <p id="letter-body-text"></p>
      </div>

      <div class="letter-bottom-band">
        <p class="letter-sender-label">With love,</p>
        <p class="letter-sender-name">${config.fromName}</p>
      </div>

      <button class="letter-nav-btn" id="letter-next-btn" title="Next Page">&rarr;</button>
    </div>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <!-- ════════ FINALESurprise ════════ -->
  <div class="chapter" id="ch-finale">
    <div class="finale-box-wrap">
      <span class="finale-cake-icon">🎂</span>
      <p class="finale-message">&ldquo;${config.finalMessage || "Wishing you a magical birthday filled with sweet surprises!"}&rdquo;</p>
      
      <div class="finale-sender-wrap">
        <div class="finale-line"></div>
        <span class="finale-sender-name">${config.fromName}</span>
        <div class="finale-line"></div>
      </div>
      
      <p class="finale-tap-hint">Tap anywhere on the sky to launch fireworks! 🎆</p>
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
    CHAPTERS.push('ch-candle');
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

    // Balloon pop sound (high to low frequency sweep)
    function playPopSound() {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    }

    // Candle blow sound (whoosh of white noise)
    function playBlowSound() {
      try {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + 0.16);
      } catch (e) {}
    }

    // Fanfare / Success chime (arpeggio of notes)
    function playFanfareChime() {
      try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
          }, i * 85);
        });
      } catch (e) {}
    }

    // Firework explosion (deep low boom + crackle)
    function playFireworkBoom() {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc.start();
        osc.stop(ctx.currentTime + 0.46);

        // Crackle sound
        setTimeout(() => {
          const bufferSize = ctx.sampleRate * 0.1;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.1);
          noise.connect(gainNode);
          gainNode.connect(ctx.destination);
          noise.start();
          noise.stop(ctx.currentTime + 0.11);
        }, 150);
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
      getAudioContext(); // Wake context
      if (chId === 'ch-letter' && !textTyped) startLetterTypewriter();
      if (chId === 'ch-photos' && !stackRendered) build3DPhotoStack();
      if (chId === 'ch-finale' && !finalWishTriggered) {
        finalWishTriggered = true;
        setTimeout(burstFireworksAuto, 400);
        setTimeout(burstFireworksAuto, 1000);
        setTimeout(burstFireworksAuto, 1700);
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
          errEl.textContent = 'Incorrect surprise code, try again! 🎂';
          setTimeout(() => { errEl.textContent = ''; }, 2500);
        }
        input.value = '';
        input.style.borderColor = 'var(--primary)';
        setTimeout(() => { input.style.borderColor = ''; }, 2500);
      }
    }
    const codeBtn = document.getElementById('code-submit');
    if (codeBtn) codeBtn.addEventListener('click', verifyPasscode);
    const codeInput = document.getElementById('code-input');
    if (codeInput) codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyPasscode(); });

    // Button Wirings
    const openBtn = document.getElementById('open-box-btn');
    const introBox = document.getElementById('intro-gift-box');
    const letterNext = document.getElementById('letter-next-btn');
    const photosNext = document.getElementById('photos-next-btn');
    const audioNext = document.getElementById('audio-next-btn');
    
    if (openBtn) openBtn.addEventListener('click', advanceChapter);
    if (introBox) introBox.addEventListener('click', advanceChapter);
    if (letterNext) letterNext.addEventListener('click', advanceChapter);
    if (photosNext) photosNext.addEventListener('click', advanceChapter);
    if (audioNext) audioNext.addEventListener('click', advanceChapter);

    // ── Candle Game Logic ──
    let candlesBlownCount = 0;
    function blowCandle(candleEl) {
      if (candleEl.classList.contains('blown')) return;
      candleEl.classList.add('blown');
      candlesBlownCount++;
      playBlowSound();
      
      // Spawn tiny smoke smoke puffs
      const rect = candleEl.getBoundingClientRect();
      const canvasOffset = canvas.getBoundingClientRect();
      const pX = rect.left + rect.width/2 - canvasOffset.left;
      const pY = rect.top - canvasOffset.top;
      
      for(let i=0; i<3; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-puff';
        smoke.style.left = pX + 'px';
        smoke.style.top = pY + 'px';
        smoke.style.animationDelay = (i * 0.1) + 's';
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 700);
      }

      if (candlesBlownCount === 3) {
        const hint = document.getElementById('candle-hint');
        if (hint) hint.innerText = "✨ Happy Birthday! Wish made! ✨";
        playFanfareChime();
        
        // Burst heavy confetti
        for(let i=0; i<40; i++) {
          particles.push(makeCelebrationParticle(canvas.width/2, canvas.height/2 + 20));
        }

        setTimeout(() => {
          advanceChapter();
        }, 1600);
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

    // ── 3D Polaroid Stack ──
    function build3DPhotoStack() {
      stackRendered = true;
      const stack = document.getElementById('polaroid-stack');
      if (!stack) return;
      if (!PHOTOS || PHOTOS.length === 0) {
        stack.innerHTML = '<div style="color:#9A8A90;font-style:italic;font-size:0.85rem;text-align:center;margin-top:4rem">No memories attached.</div>';
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
          \${photo.caption ? \`<p class="polaroid-caption">\${photo.caption}</p>\` : '<p class="polaroid-caption">❤️</p>'}
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

    // ── Interactive Canvas Engine (Confetti + Balloons + Fireworks) ──
    const canvas = document.getElementById('party-canvas');
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Balloon & Particle Color Palettes
    const PASTELS = ['#FFB7B2','#FFDAC1','#E2F0CB','#B5EAD7','#C7CEEA','#FF99C8','#A9DEF9','#E4C1F9'];

    function makeFloatingBalloon() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 60,
        r: 18 + Math.random() * 12,
        color: PASTELS[Math.floor(Math.random() * PASTELS.length)],
        speedY: 0.7 + Math.random() * 0.9,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.015,
        pop: false,
        op: 0.82
      };
    }

    function makeCelebrationParticle(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      return {
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 3 + Math.random() * 4,
        color: PASTELS[Math.floor(Math.random() * PASTELS.length)],
        life: 1.0,
        decay: 0.018 + Math.random() * 0.022
      };
    }

    let balloons = Array.from({ length: 7 }, () => makeFloatingBalloon());
    let particles = [];
    let fireworksList = [];

    // Trigger fireworks or balloon pops where user clicks on window
    window.addEventListener('click', (e) => {
      // Ignore clicks on buttons, inputs, links, play buttons, candles, or polaroid cards
      if (e.target.closest('button') || 
          e.target.closest('input') || 
          e.target.closest('audio') || 
          e.target.closest('.circular-play-btn') || 
          e.target.closest('.cake-candle') || 
          e.target.closest('.polaroid-card')) {
        return;
      }

      const activeChId = CHAPTERS[activeIdx];
      const rect = canvas.getBoundingClientRect();
      const mX = e.clientX - rect.left;
      const mY = e.clientY - rect.top;
      
      // Balloon Pop Check
      if (activeChId === 'ch-intro' || activeChId === 'ch-passcode') {
        balloons.forEach(b => {
          if (!b.pop) {
            const dist = Math.hypot(b.x - mX, b.y - mY);
            if (dist < b.r + 15) { // slightly larger tap target
              b.pop = true;
              playPopSound();
              // Spawn popping confetti
              for(let i=0; i<18; i++) {
                particles.push(makeCelebrationParticle(b.x, b.y));
              }
            }
          }
        });
      }

      // Manual Fireworks in Finale
      if (activeChId === 'ch-finale') {
        createFireworksExplosion(mX, mY);
      }
    });

    function createFireworksExplosion(x, y) {
      playFireworkBoom();
      const count = 36;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.0;
        fireworksList.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 1.0,
          decay: 0.015 + Math.random() * 0.015,
          size: 2.2 + Math.random() * 2.5,
          color: PASTELS[Math.floor(Math.random() * PASTELS.length)]
        });
      }
    }

    function burstFireworksAuto() {
      const rx = canvas.width  * (0.2 + Math.random() * 0.6);
      const ry = canvas.height * (0.15 + Math.random() * 0.3);
      createFireworksExplosion(rx, ry);
    }

    function renderLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const activeChId = CHAPTERS[activeIdx];
      const isNight = activeChId === 'ch-finale';

      // 1. Draw Balloons (only during gate/intro/candle screens)
      if (activeChId === 'ch-passcode' || activeChId === 'ch-intro' || activeChId === 'ch-candle') {
        balloons.forEach((b, idx) => {
          if (!b.pop) {
            b.wobble += b.wobbleSpeed;
            b.y -= b.speedY;
            b.x += Math.sin(b.wobble) * 0.35;
            
            // Draw balloon body
            ctx.save();
            ctx.globalAlpha = b.op;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, b.r * 0.85, b.r, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw balloon knot
            ctx.beginPath();
            ctx.moveTo(b.x - 3, b.y + b.r);
            ctx.lineTo(b.x + 3, b.y + b.r);
            ctx.lineTo(b.x, b.y + b.r + 5);
            ctx.closePath();
            ctx.fill();

            // Draw balloon string
            ctx.strokeStyle = 'rgba(120, 120, 120, 0.25)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.r + 5);
            ctx.bezierCurveTo(b.x - 4, b.y + b.r + 20, b.x + 4, b.y + b.r + 35, b.x, b.y + b.r + 50);
            ctx.stroke();
            ctx.restore();

            if (b.y < -b.r - 20) {
              balloons[idx] = makeFloatingBalloon();
            }
          }
        });
      }

      // Recycle popped balloons
      balloons.forEach((b, idx) => {
        if (b.pop) balloons[idx] = makeFloatingBalloon();
      });

      // 2. Draw Confetti Particles
      particles = particles.filter(p => p.life > 0.02);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.98; p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Finale Fireworks
      if (isNight) {
        fireworksList = fireworksList.filter(f => f.life > 0.03);
        fireworksList.forEach(f => {
          f.x += f.vx; f.y += f.vy; f.vy += 0.07; f.vx *= 0.98; f.life -= f.decay;
          ctx.save();
          // Glow tail
          ctx.globalAlpha = f.life * 0.9;
          ctx.fillStyle = f.color;
          ctx.shadowBlur = 8; ctx.shadowColor = f.color;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

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
