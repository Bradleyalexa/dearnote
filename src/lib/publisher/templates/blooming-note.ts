import { PublishedConfig } from "../../schemas/card-draft";

export function generateBloomingNoteHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Blooming Message";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasPhotos = config.photos && config.photos.length > 0;
  const hasAudio = hasVoiceNote; // Audio chapter only if voice note exists

  const vBars = Array.from({ length: 24 }, (_, i) =>
    `<div class="v-bar" style="animation-delay:${(i * 0.05).toFixed(3)}s;height:${10 + ((i % 5) * 5)}px"></div>`
  ).join("");

  const photosChapterHtml = hasPhotos
    ? `
  <div class="chapter" id="ch-photos">
    <h2 class="ch-heading">Bloomed Moments</h2>
    <p class="ch-subheading">Swipe or drag the polaroids to browse</p>
    <div class="card-stack-container">
      <div class="card-stack" id="polaroid-stack"></div>
    </div>
    <button class="action-btn-secondary" id="photos-next-btn">Continue &rarr;</button>
  </div>`
    : "";

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <h2 class="ch-heading">A Sound Garden</h2>
    <p class="ch-subheading">Listen to the voices of our story</p>
    <div class="audio-garden">
      <div class="visualizer" id="visualizer">${vBars}</div>
      ${
        hasVoiceNote
          ? `
      <div class="audio-panel-row">
        <div class="audio-info">
          <span class="audio-symbol">🌸</span>
          <div>
            <p class="audio-label">Voice Note</p>
            <p class="audio-sublabel">A message recorded for you</p>
          </div>
        </div>
        <div class="audio-controls">
          <button id="vn-btn" class="flower-play-btn">&#9654;</button>
          <div class="progress-track"><div class="progress-fill" id="vn-progress"></div></div>
        </div>
        <audio id="vn-audio" src="${voiceNoteSrc}"></audio>
      </div>`
          : ""
      }
      ${
        hasBgMusic
          ? `
      <div class="audio-panel-row" style="border-top:1px dashed rgba(232,199,234,0.4);margin-top:0.9rem;padding-top:0.9rem">
        <div class="audio-info">
          <span class="audio-symbol">🎵</span>
          <div>
            <p class="audio-label">Background Music</p>
            <p class="audio-sublabel">Soft background melody</p>
          </div>
        </div>
        <div class="audio-controls">
          <button id="bgm-inner-btn" class="flower-play-btn">&#9646;&#9646;</button>
          <p class="music-tag">Gentle ambience</p>
        </div>
        <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
      </div>`
          : ""
      }
    </div>
    <button class="action-btn-secondary" id="audio-next-btn">Closing Wishes &rarr;</button>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Blooming Note – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Alex+Brush&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Core Theme ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --rose-light:    #FFCCD5;
      --rose-dark:     #FF4D6D;
      --lavender:      #E8C7EA;
      --mint:          #D8F3DC;
      --cream:         #FAF6F0;
      --text:          #4E3D42;
      --primary:       #FF5D73;
      --primary-hover: #E04B60;
      --card-bg:       rgba(255, 255, 255, 0.82);
      --card-border:   rgba(255, 204, 213, 0.4);
      --font-body:     'Fredoka', sans-serif;
      --font-serif:    'Playfair Display', serif;
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--text);
      background: linear-gradient(135deg, #FAF0F2 0%, #FAF6F0 50%, #E8FAF4 100%);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas Particle & Bloom Engine ── */
    #bloom-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 15;
    }

    /* ── Progress Shimmer Tracker ── */
    #progress-tracker {
      position: fixed; top: 0; left: 0;
      height: 4px; width: 0%;
      background: linear-gradient(90deg, var(--rose-light), var(--lavender), var(--mint), var(--rose-light));
      background-size: 200% auto;
      animation: shimmerBar 3.5s linear infinite;
      z-index: 100;
      transition: width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 0 8px rgba(255, 93, 115, 0.25);
    }
    @keyframes shimmerBar { to { background-position: 200% center; } }

    /* ── Background Music Control ── */
    #music-fab {
      position: fixed; top: 1.2rem; right: 1.2rem; z-index: 101;
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--card-bg);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid var(--card-border);
      color: var(--primary); font-size: 1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(255,93,115,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #music-fab.visible { display: flex; }
    #music-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(255,93,115,0.25); }

    /* ── Navigation Dots ── */
    .nav-indicator-dots {
      position: fixed; right: 1.2rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 10px; z-index: 50;
    }
    .nav-dot-item {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,93,115,0.2);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-dot-item.active {
      background: var(--primary);
      transform: scale(1.6);
      box-shadow: 0 0 8px rgba(255,93,115,0.4);
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

    /* ── Headings & Subheadings ── */
    .ch-heading {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 6vw, 2.6rem);
      font-weight: 700;
      color: var(--primary);
      text-align: center;
      margin-bottom: 0.4rem;
      filter: drop-shadow(0 1px 2px rgba(255,93,115,0.1));
    }
    .ch-subheading {
      font-size: 0.75rem; font-family: var(--font-body);
      font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #A49397; text-align: center; margin-bottom: 1.8rem;
    }

    /* ── Action Buttons ── */
    .action-btn-primary {
      padding: 0.9rem 2.6rem;
      font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--primary) 0%, #FF8FA3 100%);
      border: none; border-radius: 50px; cursor: pointer;
      box-shadow: 0 4px 18px rgba(255,93,115,0.3), 0 2px 0 rgba(255,255,255,0.2) inset;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .action-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,93,115,0.45); }
    .action-btn-primary:active { transform: translateY(0) scale(0.97); }

    .action-btn-secondary {
      padding: 0.78rem 2rem;
      font-family: var(--font-body); font-size: 0.8rem; font-weight: 600;
      color: var(--primary);
      background: rgba(255,255,255,0.85);
      border: 1.5px solid rgba(255,93,115,0.3);
      border-radius: 50px; cursor: pointer;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 2px 10px rgba(255,93,115,0.08);
      transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
    }
    .action-btn-secondary:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 5px 18px rgba(255,93,115,0.2); }
    .action-btn-secondary:active { transform: scale(0.97); }

    /* ════════════════════════════
       Chapter: Passcode Gate
    ════════════════════════════ */
    #ch-passcode {
      background: linear-gradient(135deg, #FFF0F2 0%, #FAF6F0 100%);
    }
    .gate-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 2px solid rgba(255,204,213,0.5);
      border-radius: 28px; padding: 2.2rem 1.6rem 1.6rem;
      text-align: center; width: 100%; max-width: 320px;
      box-shadow: 0 10px 30px rgba(255,182,185,0.2), 0 1px 0 rgba(255,255,255,0.9) inset;
      animation: cardPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes cardPopIn { from { transform: scale(0.88) translateY(15px); opacity: 0; } to { transform: none; opacity: 1; } }
    
    .gate-icon { font-size: 2.8rem; margin-bottom: 0.6rem; display: block; animation: floatEnvelope 3.5s ease-in-out infinite; }
    @keyframes floatEnvelope { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    
    .gate-title { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
    .gate-subtitle { font-size: 0.78rem; color: #A49397; margin-bottom: 1.4rem; font-style: italic; }
    
    .gate-input {
      width: 100%; padding: 0.78rem 1rem;
      background: #FFF5F6; border: 2px solid rgba(255,93,115,0.2); border-radius: 16px;
      color: var(--text); font-family: var(--font-body); font-size: 1rem;
      letter-spacing: 0.25em; text-align: center; text-transform: uppercase;
      outline: none; transition: border-color 0.25s, box-shadow 0.25s;
    }
    .gate-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(255,93,115,0.12); }
    
    .gate-btn {
      width: 100%; margin-top: 0.8rem; padding: 0.8rem;
      font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
      letter-spacing: 0.05em; color: #fff;
      background: linear-gradient(135deg, var(--primary) 0%, #FF8FA3 100%);
      border: none; border-radius: 16px; cursor: pointer;
      box-shadow: 0 4px 12px rgba(255,93,115,0.25);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .gate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,93,115,0.35); }
    .gate-btn:active { transform: scale(0.97); }
    .gate-error { font-size: 0.72rem; color: #E53E3E; height: 1.2rem; margin-top: 0.5rem; font-style: italic; }

    /* ════════════════════════════
       Chapter: Sealed Envelope
    ════════════════════════════ */
    #ch-intro {
      background: radial-gradient(circle at 50% 50%, #FAF6F0 0%, #FAF0F2 100%);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    /* Elegant wax-sealed envelope */
    .envelope-container {
      width: 280px; height: 190px; position: relative; margin-bottom: 2rem;
      perspective: 800px; cursor: pointer;
    }
    .envelope-shadow {
      position: absolute; bottom: -15px; left: 10%; width: 80%; height: 10px;
      background: rgba(78, 61, 66, 0.1); border-radius: 50%;
      filter: blur(6px); animation: shadowPulse 3.5s ease-in-out infinite;
    }
    @keyframes shadowPulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(0.9); opacity: 0.5; } }
    
    .envelope {
      width: 100%; height: 100%; position: absolute;
      background: #E8D3C9; border-radius: 8px;
      box-shadow: 0 8px 25px rgba(78, 61, 66, 0.15);
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
      animation: envelopeFloat 3.5s ease-in-out infinite;
    }
    @keyframes envelopeFloat { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
    
    /* Flap */
    .envelope-flap {
      position: absolute; top: 0; left: 0; width: 0; height: 0;
      border-left: 140px solid transparent;
      border-right: 140px solid transparent;
      border-top: 95px solid #D6BCB0;
      transform-origin: top center;
      transition: transform 0.5s ease 0.25s;
      z-index: 4;
    }
    .envelope.open .envelope-flap {
      transform: rotateX(180deg);
      border-top-color: #E8D3C9;
      z-index: 1;
    }
    
    /* Pockets */
    .envelope-pocket-left {
      position: absolute; bottom: 0; left: 0; width: 0; height: 0;
      border-left: 140px solid #E8D3C9;
      border-top: 95px solid transparent;
      border-bottom: 95px solid #D6BCB0;
      border-radius: 0 0 0 8px;
      z-index: 3;
    }
    .envelope-pocket-right {
      position: absolute; bottom: 0; right: 0; width: 0; height: 0;
      border-right: 140px solid #E8D3C9;
      border-top: 95px solid transparent;
      border-bottom: 95px solid #D6BCB0;
      border-radius: 0 0 8px 0;
      z-index: 3;
    }
    .envelope-pocket-bottom {
      position: absolute; bottom: 0; left: 0; width: 0; height: 0;
      border-left: 140px solid transparent;
      border-right: 140px solid transparent;
      border-bottom: 95px solid #CBAE9F;
      border-radius: 0 0 8px 8px;
      z-index: 3;
    }

    /* Wax Seal */
    .wax-seal {
      position: absolute; top: 80px; left: 125px; width: 32px; height: 32px;
      background: radial-gradient(circle at 40% 40%, #FF6B8B 0%, #D93B58 100%);
      border-radius: 50%; z-index: 5;
      box-shadow: 0 3px 8px rgba(217,59,88,0.4);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
    }
    .wax-seal::after {
      content: '🌸'; font-size: 14px;
    }
    .wax-seal:hover { transform: scale(1.15) rotate(10deg); }
    .envelope.open .wax-seal {
      transform: scale(0); opacity: 0; pointer-events: none;
    }

    /* ── Glassmorphic Letter Screen ── */
    #ch-letter {
      padding: 0.8rem;
    }
    .glass-card {
      width: 100%; max-width: 440px;
      height: min(80vh, 520px);
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1.5px solid rgba(255, 255, 255, 0.6);
      border-radius: 32px;
      box-shadow:
        0 15px 35px rgba(255,182,185,0.12),
        0 25px 70px rgba(78,61,66,0.05),
        0 0 0 1px rgba(255, 255, 255, 0.25) inset;
      display: flex; flex-direction: column;
      overflow: hidden; position: relative;
      animation: cardFadeScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes cardFadeScale { from { opacity: 0; transform: scale(0.93) translateY(20px); } to { opacity: 1; transform: none; } }
    
    .card-header-band {
      border-bottom: 1px solid rgba(255,204,213,0.3);
      padding: 1.3rem 1.6rem 1rem; text-align: center;
      position: relative; flex-shrink: 0;
    }
    .card-title-text {
      font-family: var(--font-serif); font-size: clamp(1.2rem, 4.2vw, 1.6rem);
      font-weight: 700; color: var(--primary);
    }
    .card-recipient-tag {
      font-size: 0.7rem; font-weight: 700; color: #A49397;
      letter-spacing: 0.15em; text-transform: uppercase; margin-top: 0.3rem;
    }
    
    .card-interior-body {
      flex: 1; overflow-y: auto; padding: 1.3rem 1.6rem;
      position: relative; scrollbar-width: thin;
      scrollbar-color: rgba(255,93,115,0.2) transparent;
    }
    .card-letter-text {
      font-size: 0.88rem; line-height: 1.85; color: var(--text);
      font-weight: 500; white-space: pre-line; width: 100%;
    }
    .type-caret-symbol {
      display: inline-block; width: 2px; height: 1.1em;
      background: var(--primary); margin-left: 2px;
      vertical-align: middle; animation: blinkCaret 0.75s steps(1) infinite;
    }
    @keyframes blinkCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    
    .card-footer-band {
      padding: 0.8rem 1.6rem 1.1rem; border-top: 1px dashed rgba(255,204,213,0.3);
      text-align: center; flex-shrink: 0; background: rgba(255,255,255,0.3);
    }
    .card-sender-label { font-size: 0.65rem; font-weight: 700; color: #A49397; text-transform: uppercase; letter-spacing: 0.12em; }
    .card-sender-name { font-family: 'Alex Brush', cursive; font-size: 2.2rem; color: var(--primary); line-height: 1; margin-top: 0.1rem; }
    
    .card-nav-fab {
      position: absolute; bottom: 0.8rem; right: 0.8rem;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--primary); border: none; cursor: pointer;
      font-size: 1.15rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 15px rgba(255,93,115,0.3);
      transition: transform 0.2s, box-shadow 0.2s; z-index: 10;
    }
    .card-nav-fab:hover { transform: scale(1.08); box-shadow: 0 6px 18px rgba(255,93,115,0.45); }
    .card-nav-fab:active { transform: scale(0.94); }

    /* ════════════════════════════
       Chapter: 3D Photo Stack
    ════════════════════════════ */
    #ch-photos {
      background: transparent;
    }
    .card-stack-container {
      width: 100%; max-width: 300px; height: 320px;
      position: relative; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center;
    }
    .card-stack {
      width: 230px; height: 280px; position: relative;
    }
    .polaroid-card {
      position: absolute; width: 100%; height: 100%;
      background: #FFFFFF; padding: 10px 10px 2.2rem 10px;
      border-radius: 24px; border: 1.5px solid rgba(255, 204, 213, 0.3);
      box-shadow: 0 10px 25px rgba(78,61,66,0.08), 0 1px 0 #FFF inset;
      cursor: grab; touch-action: none;
      transform-origin: center center;
      transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex; flex-direction: column;
    }
    .polaroid-card:active { cursor: grabbing; }
    .polaroid-card img {
      width: 100%; aspect-ratio: 1; object-fit: cover;
      border-radius: 16px; display: block; flex-shrink: 0;
      pointer-events: none;
    }
    .polaroid-caption {
      font-family: var(--font-body); font-weight: 600; font-size: 0.75rem;
      color: var(--text); text-align: center; margin-top: auto;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      pointer-events: none;
    }

    /* ════════════════════════════
       Chapter: Audio Garden
    ════════════════════════════ */
    #ch-audio {
      background: transparent;
    }
    .audio-garden {
      width: 100%; max-width: 340px;
      background: var(--card-bg);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 2px solid var(--card-border);
      border-radius: 28px; padding: 1.5rem;
      box-shadow: 0 12px 32px rgba(255,182,185,0.15), 0 1px 0 rgba(255,255,255,0.9) inset;
      margin-bottom: 2rem;
    }
    .visualizer {
      display: flex; align-items: flex-end; justify-content: center; gap: 3.5px;
      height: 40px; margin-bottom: 1.2rem;
    }
    .v-bar {
      width: 4.5px; border-radius: 10px;
      background: linear-gradient(to top, var(--primary), var(--lavender));
      animation: vibeBarAnim 0.65s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.12); transform-origin: bottom;
    }
    @keyframes vibeBarAnim { from { transform:scaleY(0.12); opacity: 0.3; } to { transform:scaleY(1); opacity: 1; } }
    
    .audio-panel-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .audio-info { display: flex; align-items: center; gap: 0.6rem; }
    .audio-symbol { font-size: 1.4rem; }
    .audio-label { font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: var(--text); }
    .audio-sublabel { font-size: 0.68rem; color: #A49397; }
    
    .audio-controls { display: flex; align-items: center; gap: 0.6rem; flex: 1; justify-content: flex-end; }
    .flower-play-btn {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), #FF8FA3);
      border: none; cursor: pointer; font-size: 0.9rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(255,93,115,0.25); transition: transform 0.2s; flex-shrink: 0;
    }
    .flower-play-btn:hover { transform: scale(1.08); }
    .flower-play-btn:active { transform: scale(0.94); }
    
    .progress-track { width: 60px; height: 4px; background: rgba(255,93,115,0.1); border-radius: 4px; cursor: pointer; position: relative; }
    .progress-fill { height: 100%; background: var(--primary); border-radius: 4px; width: 0%; transition: width 0.1s linear; }
    .music-tag { font-size: 0.65rem; color: #A49397; font-style: italic; }

    /* ════════════════════════════
       Chapter: Finale Garden
    ════════════════════════════ */
    #ch-finale {
      background: transparent;
    }
    .finale-message-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; width: 100%; max-width: 340px; z-index: 20;
      background: rgba(255, 255, 255, 0.78);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1.5px solid rgba(255, 255, 255, 0.6);
      border-radius: 28px;
      padding: 2.2rem 1.8rem;
      box-shadow: 0 10px 30px rgba(78, 61, 66, 0.05), 0 1px 0 rgba(255,255,255,0.9) inset;
      animation: finaleFadeScale 1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes finaleFadeScale { from { opacity: 0; transform: scale(0.93) translateY(-10px); } to { opacity: 1; transform: translateY(-140px); } }
    
    .finale-sprout-icon {
      font-size: 3.5rem; margin-bottom: 1.2rem;
      filter: drop-shadow(0 0 10px rgba(255,93,115,0.4));
      animation: gentleShake 3s ease-in-out infinite;
    }
    @keyframes gentleShake { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
    
    .finale-quote {
      font-family: var(--font-serif);
      font-size: clamp(1.2rem, 4.5vw, 1.6rem); font-style: italic;
      color: var(--text); line-height: 1.6;
      margin-bottom: 0.6rem;
    }
    .finale-sender-line {
      display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-top: 1rem;
    }
    .line-decor { width: 30px; height: 1px; background: rgba(78,61,66,0.25); }
    .sender-name { font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.15em; }
    
    .finale-click-hint { font-size: 0.72rem; color: #A49397; margin-top: 2rem; font-style: italic; animation: pulseOpacity 2.2s infinite; }
    @keyframes pulseOpacity { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.95; } }

    /* ── Floating Hint Modal ── */
    #hint-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 200;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 2px solid rgba(255, 93, 115, 0.3);
      border-radius: 24px;
      padding: 1.8rem 2.2rem;
      box-shadow: 0 15px 40px rgba(255, 93, 115, 0.25), 0 1px 0 rgba(255,255,255,0.9) inset;
      text-align: center;
      max-width: 280px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }
    #hint-modal.visible {
      opacity: 1;
      pointer-events: auto;
      animation: hintBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #hint-modal.fade-out {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    @keyframes hintBounce {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.85) translateY(20px); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    .hint-icon {
      font-size: 2.5rem;
      margin-bottom: 0.8rem;
      display: block;
      animation: gentleFloat 2.5s ease-in-out infinite;
    }
    @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

    .hint-text {
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.5;
    }
    .hint-subtext {
      font-size: 0.7rem;
      color: #A49397;
      margin-top: 0.5rem;
      font-style: italic;
    }
  </style>
</head>
<body>

  <div id="progress-tracker"></div>
  <canvas id="party-canvas"></canvas> <!-- Swirling/drifting petals layer -->
  <canvas id="bloom-canvas"></canvas> <!-- Procedural vines & flowers transition layer -->
  <button id="music-fab" title="Toggle Music">🎵</button>
  <div class="nav-indicator-dots" id="nav-dots"></div>

  <!-- ════════ HINT MODAL ════════ -->
  <div id="hint-modal">
    <span class="hint-icon">🌸</span>
    <p class="hint-text">Tap anywhere to plant magical flowers!</p>
    <p class="hint-subtext">Click to dismiss</p>
  </div>

  <!-- ════════ PASSCODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-passcode">
    <div class="gate-card">
      <span class="gate-icon">💌</span>
      <h2 class="gate-title">Blooming Secret</h2>
      <p class="gate-subtitle">Enter code from sender to watch the message bloom</p>
      <input id="code-input" class="gate-input" type="text" maxlength="12" placeholder="ACCESS CODE" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="gate-btn">Unlock Flower ✨</button>
      <p id="code-err" class="gate-error"></p>
    </div>
  </div>` : ``}

  <!-- ════════ SEALED ENVELOPE (INTRO) ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <div class="envelope-container" id="wax-envelope-wrap" onclick="openEnvelopeTrigger()">
      <div class="envelope-shadow"></div>
      <div class="envelope" id="envelope-body">
        <div class="envelope-flap"></div>
        <div class="envelope-pocket-left"></div>
        <div class="envelope-pocket-right"></div>
        <div class="envelope-pocket-bottom"></div>
        <div class="wax-seal" id="envelope-seal"></div>
      </div>
    </div>

    <p class="intro-title" style="font-family: var(--font-serif); font-size: clamp(2rem, 7vw, 3.2rem);">${config.toName}</p>
    
    <div class="finale-sender-line" style="margin: 0.5rem 0 1rem">
      <div class="line-decor"></div>
      <span style="font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #A49397; font-weight: 600;">Flower Garden awaits</span>
      <div class="line-decor"></div>
    </div>

    <p class="ch-subheading" style="margin-bottom:0">Tap the wax seal to watch it bloom</p>
  </div>

  <!-- ════════ GLASSMORPHIC LETTER ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="glass-card">
      <div class="card-header-band">
        <h2 class="card-title-text">${letterTitle}</h2>
        <p class="card-recipient-tag">Written for &mdash; ${config.toName}</p>
      </div>

      <div class="card-interior-body">
        <p id="letter-body-content"></p>
      </div>

      <div class="card-footer-band">
        <p class="card-sender-label">With warmest thoughts,</p>
        <p class="card-sender-name">${config.fromName}</p>
      </div>

      <button class="card-nav-fab" id="letter-next-btn" title="Next Screen">&rarr;</button>
    </div>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <!-- ════════ FINALE GARDEN ════════ -->
  <div class="chapter" id="ch-finale">
    <div class="finale-message-container">
      <p class="finale-quote">&ldquo;${config.finalMessage || "May your life keep blooming beautifully, day by day."}&rdquo;</p>

      <div class="finale-sender-line">
        <div class="line-decor"></div>
        <span class="sender-name">${config.fromName}</span>
        <div class="line-decor"></div>
      </div>
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

    // ── Chapters Mapping ──
    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('ch-passcode');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-letter');
    if (PHOTOS && PHOTOS.length > 0) CHAPTERS.push('ch-photos');
    if (HAS_AUDIO) CHAPTERS.push('ch-audio');
    CHAPTERS.push('ch-finale');

    let activeIdx = 0;
    let isBloomingTransitionActive = false;
    let transitionCompleted = false;
    let letterTyped = false;
    let photoStackRendered = false;

    // ── Web Audio Sound Synthesizer ──
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

    // Envelope tear sound (whoosh of white noise + low frequency crinkle)
    function playEnvelopeOpenSound() {
      try {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.25;
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
        filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + 0.26);
      } catch (e) {}
    }

    // Sweeping magic chime sound when flower sprouts on click
    function playSproutChime() {
      try {
        const ctx = getAudioContext();
        const baseTime = ctx.currentTime;
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatonic: C5, D5, E5, G5, A5, C6
        const randNoteIndex = Math.floor(Math.random() * (scale.length - 2));
        
        for (let i = 0; i < 3; i++) {
          const freq = scale[randNoteIndex + i];
          const delay = i * 0.08;
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.31);
          }, delay * 1000);
        }
      } catch (e) {}
    }

    // Growing chime sound for procedural branches
    function playGrowWhoosh() {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 1.25);

        osc.start();
        osc.stop(ctx.currentTime + 1.26);
      } catch (e) {}
    }

    // ── Navigation Tracker ──
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

    // ── Transition to Chapter ──
    function transitionToChapter(targetIdx) {
      if (targetIdx === activeIdx || targetIdx < 0 || targetIdx >= CHAPTERS.length) return;
      const fromEl = document.getElementById(CHAPTERS[activeIdx]);
      const toEl   = document.getElementById(CHAPTERS[targetIdx]);
      if (!fromEl || !toEl) return;

      const dir = targetIdx > activeIdx ? 1 : -1;
      fromEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      fromEl.style.opacity    = '0';
      fromEl.style.transform  = \`translateY(\${-dir * 35}px) scale(0.96)\`;
      fromEl.style.pointerEvents = 'none';

      setTimeout(() => {
        fromEl.classList.remove('active');
        fromEl.style.cssText = '';
        
        toEl.style.opacity   = '0';
        toEl.style.transform = \`translateY(\${dir * 35}px) scale(0.96)\`;
        toEl.classList.add('active');
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            toEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            toEl.style.opacity    = '1';
            toEl.style.transform  = '';
          });
        });

        setTimeout(() => { toEl.style.cssText = ''; }, 600);
        activeIdx = targetIdx;
        updateNavTracker();
        onChapterActive(CHAPTERS[targetIdx]);
      }, 350);
    }

    function advanceChapter() { transitionToChapter(activeIdx + 1); }

    function onChapterActive(chId) {
      getAudioContext();
      if (chId === 'ch-letter' && !letterTyped) startLetterTypewriter();
      if (chId === 'ch-photos' && !photoStackRendered) build3DPhotoStack();
      if (chId === 'ch-audio') toggleVisualizerActive(true);
      if (chId === 'ch-finale') {
        startTreeGrowth();
        showHintModal();
      }
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
          errEl.textContent = 'Incorrect passcode, try again 🌸';
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

    // Buttons wirings
    const letterNext = document.getElementById('letter-next-btn');
    const photosNext = document.getElementById('photos-next-btn');
    const audioNext = document.getElementById('audio-next-btn');
    
    if (letterNext) letterNext.addEventListener('click', advanceChapter);
    if (photosNext) photosNext.addEventListener('click', advanceChapter);
    if (audioNext) audioNext.addEventListener('click', advanceChapter);

    // ── Envelope Opening & Blooming Transition ──
    function openEnvelopeTrigger() {
      if (isBloomingTransitionActive) return;
      isBloomingTransitionActive = true;

      playEnvelopeOpenSound();
      
      const envelope = document.getElementById('envelope-body');
      envelope.classList.add('open');

      // Envelope open delay, then start blooming transition snowfall
      setTimeout(() => {
        startFlowerCascade();
      }, 600);
    }

    // ── Letter Typewriter ──
    function startLetterTypewriter() {
      letterTyped = true;
      const el = document.getElementById('letter-body-content');
      const text = LETTER_BODY;
      el.innerHTML = '';
      let i = 0;
      
      const caret = document.createElement('span');
      caret.className = 'type-caret-symbol';
      el.appendChild(caret);
      
      const speed = text.length > 700 ? 10 : text.length > 350 ? 16 : 24;
      const timer = setInterval(() => {
        if (i >= text.length) {
          clearInterval(timer);
          setTimeout(() => caret.remove(), 2000);
          return;
        }
        el.insertBefore(document.createTextNode(text[i]), caret);
        i++;
        const wrap = el.closest('.card-interior-body');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      }, speed);
    }

    // ── 3D Polaroid Stack ──
    function build3DPhotoStack() {
      photoStackRendered = true;
      const stack = document.getElementById('polaroid-stack');
      if (!stack) return;
      if (!PHOTOS || PHOTOS.length === 0) {
        stack.innerHTML = '<div style="color:#A49397;font-style:italic;font-size:0.85rem;text-align:center;margin-top:4.5rem">No photos attached.</div>';
        return;
      }

      PHOTOS.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.style.zIndex = PHOTOS.length - idx;
        
        const offsetVal = idx * 6;
        const rotVal = (idx % 2 === 0 ? 1.5 : -1.5) * (idx + 1);
        card.style.transform = \`translateY(-\${offsetVal}px) rotate(\${rotVal}deg)\`;

        card.innerHTML = \`
          <img src="\${photo.src}" alt="Captured moment" loading="lazy">
          \${photo.caption ? \`<p class="polaroid-caption">\${photo.caption}</p>\` : '<p class="polaroid-caption">🌸</p>'}
        \`;

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
            const directionX = curX > 0 ? 1 : -1;
            const directionY = curY > 0 ? 1 : -1;
            card.style.transition = 'transform 0.5s ease-in';
            card.style.transform = \`translate(\${directionX * 450}px, \${directionY * 400}px) rotate(\${rotVal + (directionX * 30)}deg)\`;
            card.style.pointerEvents = 'none';
            setTimeout(() => card.remove(), 500);
            
            progressCard();
          } else {
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

    // ── Audio Deck Controls ──
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

    function toggleBgm() {
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
    if (bgmFab)      bgmFab.addEventListener('click', toggleBgm);
    if (bgmInnerBtn) bgmInnerBtn.addEventListener('click', toggleBgm);

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

    // ── Procedural Canvas Bloom Engine ──
    const bloomCanvas = document.getElementById('bloom-canvas');
    const bloomCtx = bloomCanvas.getContext('2d');
    const partyCanvas = document.getElementById('party-canvas');
    const partyCtx = partyCanvas.getContext('2d');

    function resizeCanvas() {
      bloomCanvas.width = window.innerWidth; bloomCanvas.height = window.innerHeight;
      partyCanvas.width = window.innerWidth; partyCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const flowerSvgTexts = {
      cherryBlossom: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="cb-petal" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#FFEBF0" />
            <stop offset="60%" stop-color="#FF99B4" />
            <stop offset="100%" stop-color="#FF4D6D" />
          </radialGradient>
          <radialGradient id="cb-center" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stop-color="#FFEFA6" />
            <stop offset="60%" stop-color="#FF8E00" />
            <stop offset="100%" stop-color="transparent" stop-opacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(50,50)">
          <path d="M 0,0 C -15,-30 -25,-40 0,-48 C 25,-40 15,-30 0,0" fill="url(#cb-petal)" />
          <path d="M 0,0 C -15,-30 -25,-40 0,-48 C 25,-40 15,-30 0,0" fill="url(#cb-petal)" transform="rotate(72)" />
          <path d="M 0,0 C -15,-30 -25,-40 0,-48 C 25,-40 15,-30 0,0" fill="url(#cb-petal)" transform="rotate(144)" />
          <path d="M 0,0 C -15,-30 -25,-40 0,-48 C 25,-40 15,-30 0,0" fill="url(#cb-petal)" transform="rotate(216)" />
          <path d="M 0,0 C -15,-30 -25,-40 0,-48 C 25,-40 15,-30 0,0" fill="url(#cb-petal)" transform="rotate(288)" />
          
          <line x1="0" y1="0" x2="-6" y2="-10" stroke="#FF4D6D" stroke-width="1.2" />
          <circle cx="-6" cy="-10" r="1.5" fill="#FFEFA6" />
          <line x1="0" y1="0" x2="6" y2="-10" stroke="#FF4D6D" stroke-width="1.2" />
          <circle cx="6" cy="-10" r="1.5" fill="#FFEFA6" />
          <line x1="0" y1="0" x2="10" y2="4" stroke="#FF4D6D" stroke-width="1.2" />
          <circle cx="10" cy="4" r="1.5" fill="#FFEFA6" />
          <line x1="0" y1="0" x2="-10" y2="4" stroke="#FF4D6D" stroke-width="1.2" />
          <circle cx="-10" cy="4" r="1.5" fill="#FFEFA6" />
          <line x1="0" y1="0" x2="0" y2="12" stroke="#FF4D6D" stroke-width="1.2" />
          <circle cx="0" cy="12" r="1.5" fill="#FFEFA6" />
          
          <circle cx="0" cy="0" r="8" fill="url(#cb-center)" />
        </g>
      </svg>\`,
      
      rose: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="rose-outer" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FF5A78" />
            <stop offset="70%" stop-color="#E6002B" />
            <stop offset="100%" stop-color="#8F0014" />
          </radialGradient>
          <radialGradient id="rose-mid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FF3358" />
            <stop offset="80%" stop-color="#C2001F" />
            <stop offset="100%" stop-color="#6E000F" />
          </radialGradient>
          <radialGradient id="rose-inner" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stop-color="#FFA4B7" />
            <stop offset="50%" stop-color="#FF244B" />
            <stop offset="100%" stop-color="#400007" />
          </radialGradient>
        </defs>
        <g transform="translate(50,50)">
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" />
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" transform="rotate(60)" />
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" transform="rotate(120)" />
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" transform="rotate(180)" />
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" transform="rotate(240)" />
          <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-outer)" transform="rotate(300)" />
          
          <g transform="scale(0.8) rotate(30)">
            <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-mid)" />
            <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-mid)" transform="rotate(72)" />
            <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-mid)" transform="rotate(144)" />
            <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-mid)" transform="rotate(216)" />
            <path d="M 0,0 C -22,-32 -38,-22 -38,0 C -38,22 -22,32 0,0" fill="url(#rose-mid)" transform="rotate(288)" />
          </g>
          
          <g transform="scale(0.55) rotate(15)">
            <path d="M 0,0 C -18,-26 -28,-18 -28,0 C -28,18 -18,26 0,0" fill="url(#rose-inner)" />
            <path d="M 0,0 C -18,-26 -28,-18 -28,0 C -28,18 -18,26 0,0" fill="url(#rose-inner)" transform="rotate(90)" />
            <path d="M 0,0 C -18,-26 -28,-18 -28,0 C -28,18 -18,26 0,0" fill="url(#rose-inner)" transform="rotate(180)" />
            <path d="M 0,0 C -18,-26 -28,-18 -28,0 C -28,18 -18,26 0,0" fill="url(#rose-inner)" transform="rotate(270)" />
          </g>
          
          <circle cx="0" cy="0" r="5" fill="#400007" />
        </g>
      </svg>\`,
      
      sunflower: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="sf-petal" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#FFE57F" />
            <stop offset="70%" stop-color="#FFB300" />
            <stop offset="100%" stop-color="#E65100" />
          </radialGradient>
          <radialGradient id="sf-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2D1500" />
            <stop offset="85%" stop-color="#4E2700" />
            <stop offset="100%" stop-color="#1A0900" />
          </radialGradient>
        </defs>
        <g transform="translate(50,50)">
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(30)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(60)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(90)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(120)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(150)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(180)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(210)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(240)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(270)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(300)" />
          <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(330)" />
          
          <g transform="scale(0.82) rotate(15)">
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(30)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(60)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(90)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(120)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(150)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(180)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(210)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(240)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(270)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(300)" />
            <path d="M 0,0 C -7,-24 -11,-36 0,-42 C 11,-36 7,-24 0,0" fill="url(#sf-petal)" transform="rotate(330)" />
          </g>
          
          <circle cx="0" cy="0" r="14" fill="url(#sf-center)" stroke="#F57C00" stroke-width="1.2" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-dasharray="2,2" />
        </g>
      </svg>\`
    };

    const images = {};
    Object.entries(flowerSvgTexts).forEach(([key, svgText]) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgText);
      images[key] = img;
    });

    class TransitionFlower {
      constructor(x, y, size, speedY, speedX, rotSpeed, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedY = speedY;
        this.speedX = speedX;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = rotSpeed;
        this.type = type;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.01 + Math.random() * 0.02;
      }

      update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.6;
        this.rot += this.rotSpeed;
      }

      draw(ctx) {
        const img = images[this.type];
        if (!img) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    class PlantedFlower {
      constructor(x, y, maxSize) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = maxSize;
        const types = ['cherryBlossom', 'rose', 'sunflower'];
        this.type = types[Math.floor(Math.random() * types.length)];
        this.rot = Math.random() * Math.PI * 2;
        this.growSpeed = 0.8 + Math.random() * 0.8;
        this.pulse = 0;
      }

      update() {
        if (this.size < this.maxSize) {
          this.size += this.growSpeed;
        }
        this.pulse = Math.sin(Date.now() * 0.0025 + this.x) * 0.04;
      }

      draw(ctx) {
        const img = images[this.type];
        if (!img) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot + this.pulse * 0.5);
        const drawSize = this.size * (1 + this.pulse);
        ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }
    }

    class TreeBranch {
      constructor(startX, startY, angle, length, width, depth) {
        this.startX = startX;
        this.startY = startY;
        this.angle = angle;
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.currentLength = 0;
        this.growing = false;
        this.grown = false;
        this.endX = startX + Math.cos(angle) * length;
        this.endY = startY + Math.sin(angle) * length;
        this.children = [];
      }

      update() {
        if (this.grown) {
          this.children.forEach(c => c.update());
          return;
        }
        if (!this.growing) return;

        const speed = this.length * 0.045;
        this.currentLength += speed;
        if (this.currentLength >= this.length) {
          this.currentLength = this.length;
          this.grown = true;

          if (this.depth > 0) {
            const numSplits = 2;
            for (let i = 0; i < numSplits; i++) {
              const factor = i === 0 ? -1 : 1;
              const angleOffset = factor * (0.28 + Math.random() * 0.3);
              const childAngle = this.angle + angleOffset;
              const childLength = this.length * (0.65 + Math.random() * 0.15);
              const childWidth = this.width * 0.65;

              const child = new TreeBranch(this.endX, this.endY, childAngle, childLength, childWidth, this.depth - 1);
              child.growing = true;
              this.children.push(child);
            }
          }
        }
      }

      draw(ctx) {
        const curEndX = this.startX + Math.cos(this.angle) * this.currentLength;
        const curEndY = this.startY + Math.sin(this.angle) * this.currentLength;

        ctx.save();
        ctx.strokeStyle = '#6D5959'; // Warm woody brown
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(curEndX, curEndY);
        ctx.stroke();
        ctx.restore();

        this.children.forEach(c => c.draw(ctx));
      }
    }

    let treeRoot = null;
    let treeGrowing = false;
    let cascadeFlowers = [];
    let cascadeActive = false;
    let transitionTriggered = false;
    let bloomFinished = false;
    let plantedFlowers = [];

    function startTreeGrowth() {
      if (treeRoot) return;
      const startX = bloomCanvas.width / 2;
      const startY = bloomCanvas.height;
      const angle = -Math.PI / 2;
      const length = Math.min(bloomCanvas.height * 0.22, 160);
      const width = 12;
      const depth = 4;
      
      treeRoot = new TreeBranch(startX, startY, angle, length, width, depth);
      treeRoot.growing = true;
      treeGrowing = true;
      playGrowWhoosh();
    }

    function drawGround(ctx) {
      ctx.save();
      const grad = ctx.createLinearGradient(0, bloomCanvas.height - 35, 0, bloomCanvas.height);
      grad.addColorStop(0, '#8A6F60');
      grad.addColorStop(1, '#503D33');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(bloomCanvas.width / 2, bloomCanvas.height + 40, bloomCanvas.width * 0.65, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function startFlowerCascade() {
      cascadeActive = true;
      playGrowWhoosh();

      const numFlowers = 120;
      const types = ['cherryBlossom', 'rose', 'sunflower'];
      for (let i = 0; i < numFlowers; i++) {
        const x = Math.random() * bloomCanvas.width;
        // Distribute y coordinates widely above the screen to fall in a gorgeous dense curtain
        const y = -60 - Math.random() * 1000;
        const size = 30 + Math.random() * 45;
        const speedY = 3.5 + Math.random() * 4;
        const speedX = -1 + Math.random() * 2;
        const rotSpeed = (Math.random() - 0.5) * 0.04;
        const type = types[Math.floor(Math.random() * types.length)];
        
        cascadeFlowers.push(new TransitionFlower(x, y, size, speedY, speedX, rotSpeed, type));
      }
    }

    function triggerScreenTransition() {
      if (transitionTriggered) return;
      transitionTriggered = true;
      
      const intro = document.getElementById('ch-intro');
      if (intro) {
        intro.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        intro.style.opacity = '0';
        intro.style.transform = 'scale(1.05) translateY(20px)';
        intro.style.pointerEvents = 'none';
      }

      setTimeout(() => {
        if (intro) intro.remove();

        const letterCh = document.getElementById('ch-letter');
        if (letterCh) {
          letterCh.style.opacity = '0';
          letterCh.style.transform = 'scale(0.9) translateY(20px)';
          letterCh.classList.add('active');
          
          setTimeout(() => {
            letterCh.style.transition = 'opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
            letterCh.style.opacity = '1';
            letterCh.style.transform = 'none';
            onChapterActive('ch-letter');
          }, 50);
        }
        
        activeIdx = CHAPTERS.indexOf('ch-letter');
        updateNavTracker();
      }, 300);
    }

    // ── Petals & Floating Sparks Idle Animation Engine ──
    const PETALS_COLORS = ['#FFCCD5','#FFB7B2','#E8C7EA','#FFF0F5','#FFF9E6'];
    class IdlePetal {
      constructor(scattered) {
        this.x = Math.random() * partyCanvas.width;
        this.y = scattered ? Math.random() * partyCanvas.height : -30;
        this.size = 8 + Math.random() * 10;
        this.speedY = 0.6 + Math.random() * 0.8;
        this.speedX = 0.2 + Math.random() * 0.6;
        this.color = PETALS_COLORS[Math.floor(Math.random() * PETALS_COLORS.length)];
        this.op = 0.2 + Math.random() * 0.45;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleS = 0.01 + Math.random() * 0.015;
        this.rot = Math.random() * Math.PI * 2;
        this.rotS = (Math.random() - 0.5) * 0.02;
        
        // 25% chance of being a whole flower blossom, 75% chance of being a petal
        this.isFlower = Math.random() < 0.25;
        const types = ['cherryBlossom', 'rose', 'sunflower'];
        this.type = types[Math.floor(Math.random() * types.length)];
      }

      update() {
        this.wobble += this.wobbleS;
        this.rot += this.rotS;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        
        if (this.y > partyCanvas.height + 30) {
          Object.assign(this, new IdlePetal(false));
        }
      }

      draw() {
        partyCtx.save();
        partyCtx.globalAlpha = this.op;
        partyCtx.translate(this.x, this.y);
        partyCtx.rotate(this.rot);
        
        if (this.isFlower) {
          const img = images[this.type];
          if (img) {
            partyCtx.drawImage(img, -this.size / 2, -this.size / 2, this.size, this.size);
          }
        } else {
          partyCtx.fillStyle = this.color;
          partyCtx.beginPath();
          partyCtx.ellipse(0, 0, this.size * 0.45, this.size * 0.75, 0, 0, Math.PI * 2);
          partyCtx.fill();
        }
        
        partyCtx.restore();
      }
    }

    const idlePetalsList = Array.from({ length: 24 }, (_, i) => new IdlePetal(i < 18));

    // ── Hint Modal Control ──
    let hintModalShown = false;
    function showHintModal() {
      if (hintModalShown) return;
      hintModalShown = true;

      const modal = document.getElementById('hint-modal');
      if (!modal) return;

      setTimeout(() => {
        modal.classList.add('visible');
      }, 500);
    }

    function hideHintModal() {
      const modal = document.getElementById('hint-modal');
      if (!modal) return;

      modal.classList.remove('visible');
      modal.classList.add('fade-out');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 500);
    }

    // Handle clicks on window to plant flowers on Finale screen
    window.addEventListener('click', (e) => {
      // Check if hint modal is visible and hide it first
      const modal = document.getElementById('hint-modal');
      if (modal && modal.classList.contains('visible')) {
        hideHintModal();
        return;
      }

      // Ignore click on buttons / interactive controls
      if (e.target.closest('button') ||
          e.target.closest('input') ||
          e.target.closest('audio') ||
          e.target.closest('.flower-play-btn') ||
          e.target.closest('.polaroid-card') ||
          e.target.closest('.envelope-container')) {
        return;
      }

      const activeChId = CHAPTERS[activeIdx];
      if (activeChId === 'ch-finale') {
        const rect = bloomCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Spawn organic procedurally growing flower where clicked!
        plantedFlowers.push(new PlantedFlower(clickX, clickY, 24 + Math.random() * 18));
        playSproutChime();
      }
    });

    function renderPartyLoop() {
      partyCtx.clearRect(0, 0, partyCanvas.width, partyCanvas.height);
      
      // Update and draw floating wind petals/flowers
      idlePetalsList.forEach(p => {
        p.update();
        p.draw();
      });

      // Update and draw cascade or planted flowers on bloomCanvas
      bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);

      if (cascadeActive) {
        let allBelowScreen = true;
        let visibleCount = 0;

        cascadeFlowers.forEach(f => {
          f.update();
          f.draw(bloomCtx);

          if (f.y < bloomCanvas.height + f.size) {
            allBelowScreen = false;
          }
          if (f.y > 0 && f.y < bloomCanvas.height) {
            visibleCount++;
          }
        });

        if (visibleCount > 35 && !transitionTriggered) {
          triggerScreenTransition();
        }

        if (allBelowScreen && cascadeFlowers.length > 0) {
          cascadeActive = false;
          bloomFinished = true;
        }
      }

      // Draw ground/soil if tree is growing or grown
      if (treeRoot) {
        drawGround(bloomCtx);
        if (treeGrowing) {
          treeRoot.update();
        }
        treeRoot.draw(bloomCtx);
      }

      // Draw planted flowers (sprouted on click)
      plantedFlowers.forEach(f => {
        f.update();
        f.draw(bloomCtx);
      });

      requestAnimationFrame(renderPartyLoop);
    }

    // Init
    updateNavTracker();
    renderPartyLoop();
    if (!HAS_SECRET) setTimeout(autoPlayBgm, 800);

    function triggerWakeup() {
      const introIdx = CHAPTERS.indexOf('ch-intro');
      if (introIdx !== -1 && activeIdx !== introIdx) transitionToChapter(introIdx);
    }
  </script>
</body>
</html>`;
}
