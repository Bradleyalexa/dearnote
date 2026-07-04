import { PublishedConfig } from "../../schemas/card-draft";

export function generateAnniversaryScrapbookHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Our Story";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  
  // Format photos data for JS frontend
  const photosJson = JSON.stringify(config.photos || []);
  
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasAudio = hasVoiceNote;

  const vBars = Array.from({ length: 22 }, (_, i) =>
    `<div class="v-bar" style="animation-delay:${(i * 0.055).toFixed(3)}s;height:${16 + ((i % 5) * 7)}px"></div>`
  ).join("");

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <h2 class="ch-heading">A Melody for Us</h2>
    <p class="ch-subheading">A special audio note</p>
    <div class="audio-card">
      <div class="visualizer" id="visualizer">${vBars}</div>
      ${
        hasVoiceNote
          ? `
      <div class="audio-row">
        <p class="audio-row-label">🎙 Voice Message</p>
        <div class="audio-row-controls">
          <button id="vn-btn" class="round-play-btn">&#9654;</button>
          <div class="progress-track"><div class="progress-fill" id="vn-progress"></div></div>
        </div>
        <audio id="vn-audio" src="${voiceNoteSrc}"></audio>
      </div>`
          : ""
      }
      ${
        hasBgMusic
          ? `
      <div class="audio-row" style="border-top:1px solid rgba(139,115,85,0.15);padding-top:0.9rem;margin-top:0.5rem">
        <p class="audio-row-label">🎼 Background Music</p>
        <div class="audio-row-controls">
          <button id="bgm-inner-btn" class="round-play-btn">&#9646;&#9646;</button>
          <p style="font-size:0.68rem;color:#8b7355;font-style:italic">Accompanying every moment</p>
        </div>
        <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
      </div>`
          : ""
      }
    </div>
    <button class="soft-btn" id="audio-next-btn" style="margin-top:1.8rem">Closing Message &rarr;</button>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anniversary Scrapbook – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Special+Elite&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-cream:   #f6f1e5;
      --bg-paper:   #FAF8F5;
      --scrapbook-brown: #8b7355;
      --scrapbook-dark:  #4e443b;
      --rose:       #b25e6c;
      --rose-light: #d88b97;
      --peach:      #e8b69b;
      --gold:       #c29450;
      --text:       #3c352d;
      --text-muted: #7c7267;
      --card-border: rgba(139,115,85,0.18);
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      background-color: var(--bg-cream);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(139, 115, 85, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139, 115, 85, 0.05) 0%, transparent 40%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas ── */
    #particle-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 1;
    }

    /* ── Progress bar ── */
    #progress-bar {
      position: fixed; top: 0; left: 0;
      height: 3px; width: 0%;
      background: linear-gradient(90deg, var(--rose), var(--gold), var(--rose));
      z-index: 100;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 0 6px rgba(178,94,108,0.3);
    }

    /* ── BGM FAB ── */
    #bgm-fab {
      position: fixed; top: 0.9rem; right: 0.9rem; z-index: 101;
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(250,248,245,0.9);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid var(--scrapbook-brown);
      color: var(--scrapbook-brown); font-size: 1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s;
    }
    #bgm-fab:hover { transform: scale(1.05); }
    #bgm-fab.playing { animation: pulseIcon 1.5s infinite alternate; }
    @keyframes pulseIcon { from { transform: scale(1); } to { transform: scale(1.1); } }

    /* ── Navigation dots ── */
    .nav-dots {
      position: fixed; bottom: 1.2rem; left: 50%; transform: translateX(-50%);
      display: flex; gap: 0.5rem; z-index: 99;
      background: rgba(250,248,245,0.85);
      padding: 6px 12px; border-radius: 20px;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1.2px solid var(--card-border);
    }
    .nav-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(139,115,85,0.2);
      transition: all 0.35s ease;
    }
    .nav-dot.active {
      background: var(--rose);
      transform: scale(1.3);
      box-shadow: 0 0 6px var(--rose);
    }

    /* ── Chapter layout ── */
    .chapter {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 1.8rem 1.2rem 3.5rem;
      opacity: 0; pointer-events: none;
      transform: scale(1.02) translateY(8px);
      transition: opacity 0.55s ease, transform 0.55s ease;
      z-index: 5;
    }
    .chapter.active {
      opacity: 1; pointer-events: auto;
      transform: scale(1) translateY(0);
      z-index: 10;
    }

    /* ── Typography ── */
    .ch-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 4.5vw, 1.8rem);
      font-weight: 700;
      color: var(--scrapbook-dark); text-align: center;
      margin-bottom: 0.2rem;
    }
    .ch-subheading {
      font-size: clamp(0.78rem, 2.5vw, 0.92rem);
      color: var(--text-muted); text-align: center;
      margin-bottom: 1.2rem;
      font-style: italic; font-weight: 300;
    }

    /* ── Buttons ── */
    .cta-btn {
      font-family: 'Playfair Display', serif;
      font-size: 0.82rem; font-weight: 600; letter-spacing: 0.1em;
      padding: 0.75rem 2rem; border-radius: 25px;
      border: 1.5px solid var(--scrapbook-brown);
      background: linear-gradient(135deg, rgba(139,115,85,0.1), rgba(178,94,108,0.1));
      color: var(--scrapbook-dark); cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139,115,85,0.15);
      background: var(--bg-paper);
    }
    .soft-btn {
      font-family: 'Playfair Display', serif;
      font-size: 0.9rem; font-style: italic;
      padding: 0.45rem 1.5rem; border-radius: 18px;
      border: 1px solid var(--card-border);
      background: var(--bg-paper);
      color: var(--scrapbook-dark); cursor: pointer;
      transition: all 0.25s;
    }
    .soft-btn:hover {
      background: rgba(178,94,108,0.05);
      border-color: var(--rose-light);
    }

    /* ════════════════════════════
       Chapter: Code Gate
    ════════════════════════════ */
    .code-card {
      width: 100%; max-width: 320px;
      background: var(--bg-paper);
      border: 1.5px dashed var(--scrapbook-brown);
      border-radius: 20px; padding: 2.2rem 1.6rem;
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
      text-align: center;
    }
    .code-lock { font-size: 2.2rem; display: block; margin-bottom: 0.8rem; }
    .code-title {
      font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700;
      color: var(--scrapbook-dark); margin-bottom: 0.5rem;
    }
    .code-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.4; }
    .code-input {
      width: 100%; border: 1.5px solid var(--card-border);
      background: #fff;
      color: var(--scrapbook-dark); border-radius: 25px;
      padding: 0.68rem 1.2rem; text-align: center;
      font-family: 'Playfair Display', serif; font-size: 0.95rem;
      outline: none; margin-bottom: 1.2rem;
      transition: border-color 0.3s;
    }
    .code-input:focus { border-color: var(--rose); }
    .code-submit {
      width: 100%; padding: 0.68rem; border: none;
      background: linear-gradient(135deg, var(--rose), var(--peach));
      color: #fff; font-family: 'Playfair Display', serif;
      font-size: 0.82rem; font-weight: 600; letter-spacing: 0.1em;
      border-radius: 25px; cursor: pointer;
      box-shadow: 0 4px 12px rgba(178,94,108,0.25);
      transition: transform 0.2s;
    }
    .code-submit:hover { transform: translateY(-1px); }
    .code-err { font-size: 0.78rem; color: var(--rose); margin-top: 0.9rem; font-style: italic; min-height: 18px; }

    /* ════════════════════════════
       Chapter: Intro
    ════════════════════════════ */
    .intro-heart-wrap {
      width: clamp(90px, 25vw, 110px);
      height: clamp(80px, 22vw, 100px);
      margin-bottom: 1.5rem;
      animation: heartbeat 1.4s ease-in-out infinite alternate;
      cursor: pointer;
    }
    .intro-name {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.4rem, 8vw, 3.8rem);
      color: var(--rose);
      text-align: center; margin-bottom: 0.4rem;
    }
    .ornament { display: flex; align-items: center; justify-content: center; gap: 0.6rem; width: 140px; margin: 0.5rem 0; }
    .ornament-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--scrapbook-brown), transparent); }
    .ornament-diamond { width: 5px; height: 5px; background: var(--scrapbook-brown); transform: rotate(45deg); }
    .intro-tagline { font-size: 0.95rem; color: var(--text-muted); font-style: italic; margin-top: 0.4rem; text-align: center; }

    /* ════════════════════════════
       Chapter: Letter
    ════════════════════════════ */
    .parchment {
      width: 100%; max-width: 360px;
      height: 70vh; max-height: 520px;
      background: var(--bg-paper);
      border: 1.5px solid var(--card-border);
      border-radius: 20px;
      padding: 1.4rem 1.4rem 1.8rem;
      box-shadow: 0 12px 28px rgba(0,0,0,0.06);
      position: relative;
      display: flex; flex-direction: column;
    }
    .parchment-lines {
      position: absolute; inset: 0;
      border-radius: 20px;
      background-image: linear-gradient(rgba(139,115,85,0.05) 1px, transparent 1px);
      background-size: 100% 24px;
      pointer-events: none;
      z-index: 1;
    }
    .parchment-header {
      position: relative; z-index: 2;
      display: flex; flex-direction: column;
      align-items: center; padding-bottom: 0.6rem;
      border-bottom: 1.2px dashed var(--card-border);
      margin-bottom: 0.8rem;
    }
    .wax-seal-wrap { width: 34px; height: 34px; margin-bottom: 0.4rem; }
    .letter-title-text {
      font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700;
      color: var(--scrapbook-dark); text-align: center;
    }
    .letter-to-tag { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem; font-style: italic; }
    .parchment-body {
      position: relative; z-index: 2;
      flex: 1; overflow-y: auto;
      scrollbar-width: thin; scrollbar-color: rgba(139,115,85,0.2) transparent;
      padding-right: 4px;
      margin-bottom: 0.8rem;
    }
    #letter-text {
      font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; line-height: 24px;
      color: var(--text); white-space: pre-wrap; font-weight: 400; text-align: left;
    }
    .cursor-blink { border-right: 1.5px solid var(--rose); animation: blinkCursor 0.8s infinite; margin-left: 2px; }
    @keyframes blinkCursor { 50% { border-color: transparent; } }
    .parchment-footer {
      position: relative; z-index: 2;
      display: flex; flex-direction: column;
      align-items: flex-end; padding-top: 0.5rem;
      border-top: 1.2px dashed var(--card-border);
    }
    .letter-from-name { font-family: 'Great Vibes', cursive; font-size: 1.7rem; color: var(--rose); line-height: 1.2; }
    .letter-next-fab {
      position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--rose); border: none;
      color: white; font-size: 1rem; font-weight: bold;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 10px rgba(178,94,108,0.3); transition: transform 0.2s, background-color 0.2s;
      z-index: 10;
    }
    .letter-next-fab:hover { transform: translateX(-50%) scale(1.08); background-color: var(--scrapbook-dark); }

    /* ════════════════════════════
       Chapter: Collage Scrapbook Gallery – 3-Layer Compositing
    ════════════════════════════

       Layer 0 (z-index:0)  – scrapbook-bg-base   – full anniversary_bg.png
                               shows placeholder photos when no user photo uploaded
       Layer 5 (z-index:5)  – .user-photo         – user-uploaded photos (wrapper div)
       Layer 10 (z-index:10)– scrapbook-bg-overlay– anniversary_bg_overlay.png
                               same as base BUT photo areas punched out (transparent)
                               → frame borders always render ON TOP of user photos
    ════════════════════════════ */
    .scrapbook-layout {
      position: relative;
      width: 100%; max-width: 380px;
      aspect-ratio: 5 / 4;
      background: transparent;          /* no bg here – handled by img layers */
      border: 1.5px solid var(--card-border);
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    /* Layer 0: full background (placeholder photos show through transparent overlay holes) */
    .scrapbook-bg-base {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;     /* fill exactly to container */
      z-index: 0;
      pointer-events: none;
      border-radius: 14px;
    }

    /* Layer 10: overlay – frame borders intact, photo areas transparent.
       This sits ON TOP of user photos so borders are never covered. */
    .scrapbook-bg-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      z-index: 10;
      pointer-events: none;
      border-radius: 14px;
    }

    /*
     * Layer 5: User photo wrapper divs
     * – position + rotation + overflow:hidden acts as the clip mask
     * – inner <img> fills 100% with object-fit:cover (no stretch, auto-crop)
     * – z-index 5 ensures photos sit BETWEEN base (0) and overlay (10)
     *   so frame borders from the overlay always show on top
     */
    .user-photo {
      position: absolute;
      overflow: hidden;        /* clips img to rotated rect of wrapper */
      cursor: pointer;
      z-index: 5;
      border-radius: 2px;
    }
    .user-photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      pointer-events: none;
    }
    .user-photo:hover { z-index: 8; } /* stay below overlay (10) on hover */

    /*
     * USER PHOTO OVERLAY SLOTS
     * Coordinates derived from pixel analysis of anniversary_bg.png (945x756px)
     * Positioning uses center-point math:
     *   left = centerX_pct - width_pct/2
     *   top  = centerY_pct - height_pct/2
     * So that transform: rotate() rotates around the slot's center,
     * matching the tilted frames in the background image exactly.
     */

    /* Slot 1: Left polaroid – inner photo area only (no white border)
       Coordinates derived from pixel analysis (cv2.minAreaRect on the isolated
       photo-content blob) of anniversary_bg.png at 945x756px */
    .slot-left {
      left: 8.13%;
      top: 37.67%;
      width: 28.90%;
      height: 34.11%;
      transform: rotate(-6.53deg);
      transform-origin: center center;
    }

    /* Slot 2: Stamp top-right – photo inside scalloped border
       Coordinates derived from pixel analysis (cv2.minAreaRect on the isolated
       photo-content blob) of anniversary_bg.png at 945x756px */
    .slot-stamp {
      left: 45.93%;
      top: 27.38%;
      width: 47.20%;
      height: 26.72%;
      transform: rotate(0deg);
      transform-origin: center center;
    }

    /* Slot 3: Bottom polaroid – inner photo area only (no white border)
       Coordinates derived from pixel analysis (cv2.minAreaRect on the isolated
       photo-content blob) of anniversary_bg.png at 945x756px */
    .slot-bottom {
      left: 30.98%;
      top: 62.17%;
      width: 20.08%;
      height: 32.89%;
      transform: rotate(14.49deg);
      transform-origin: center center;
    }

    /* Notebook lined card text overlay (rendered on top of bottom center photo) */
    .scrapbook-lined-card-overlay {
      position: absolute;
      top: 51.5%;
      left: 51.0%;
      width: 44.0%;
      height: 43.0%;
      background: rgb(195, 184, 170); /* matching the background card color exactly */
      z-index: 9; /* Always sits on top of bottom photo (z-index 5) */
      transform: rotate(-1deg);
      background-image: linear-gradient(rgba(92, 74, 55, 0.1) 1px, transparent 1px);
      background-size: 100% 18px;
      line-height: 18px;
      padding: 0.5rem 0.6rem 0.5rem 0.2rem;
      display: flex;
      flex-direction: column;
      pointer-events: none; /* Let clicks pass through if needed, but holds text */
    }

    .lined-card-title {
      font-family: 'Great Vibes', cursive;
      font-size: 1.15rem;
      color: var(--scrapbook-dark);
      margin-bottom: 0.15rem;
      line-height: 1;
    }

    .lined-card-bullets {
      list-style: none;
      padding: 0; margin: 0 0 0.2rem 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text);
    }
    .lined-card-bullets li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      padding-left: 9px;
    }
    .lined-card-bullets li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--rose);
    }

    .lined-card-footer {
      border-top: 1px dashed rgba(92,74,55,0.18);
      padding-top: 0.15rem;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--scrapbook-dark);
      line-height: 10px;
    }
    .lined-card-footer strong {
      font-family: 'Playfair Display', serif;
      font-size: 0.6rem;
      font-weight: 700;
    }

    /* Zoom lightbox */
    .zoom-overlay {
      position: fixed; inset: 0;
      background: rgba(60,53,45,0.92);
      backdrop-filter: blur(5px);
      z-index: 999;
      display: none;
      align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
      cursor: zoom-out;
    }
    .zoom-overlay.active {
      display: flex;
      opacity: 1;
    }
    .zoom-card {
      background: white;
      padding: 12px 12px 3rem 12px;
      box-shadow: 0 15px 45px rgba(0,0,0,0.5);
      border-radius: 4px;
      max-width: 85%; max-height: 75vh;
      display: flex; flex-direction: column;
      transform: scale(0.9); transition: transform 0.3s ease;
    }
    .zoom-overlay.active .zoom-card {
      transform: scale(1);
    }
    .zoom-img {
      max-width: 100%; max-height: 52vh;
      object-fit: contain;
      border-radius: 2px;
    }
    .zoom-caption {
      font-family: 'Special Elite', monospace;
      font-size: 0.9rem;
      color: #333;
      text-align: center;
      margin-top: 0.8rem;
    }

    /* ════════════════════════════
       Chapter: Audio
    ════════════════════════════ */
    .audio-card {
      width: 100%; max-width: 350px;
      background: var(--bg-paper);
      border: 1.5px solid var(--card-border);
      border-radius: 24px; padding: 1.4rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.05);
      text-align: center;
    }
    .visualizer { display: flex; align-items: flex-end; justify-content: center; gap: 3px; height: 40px; margin-bottom: 1.2rem; }
    .v-bar {
      width: 4px; border-radius: 2px;
      background: linear-gradient(to top, var(--rose), var(--peach));
      animation: vibeBar 0.7s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.12); transform-origin: bottom;
    }
    @keyframes vibeBar { from { transform:scaleY(0.12); opacity:0.35; } to { transform:scaleY(1); opacity:1; } }
    .audio-row { padding-bottom: 0.8rem; }
    .audio-row-label { font-family: 'Playfair Display', serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; display: block; }
    .audio-row-controls { display: flex; align-items: center; gap: 0.75rem; }
    .round-play-btn {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, var(--rose), var(--gold));
      border: none; cursor: pointer; font-size: 0.95rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 12px rgba(178,94,108,0.3); transition: transform 0.2s; flex-shrink: 0;
    }
    .round-play-btn:hover { transform: scale(1.06); }
    .progress-track { flex: 1; height: 3px; background: rgba(139,115,85,0.12); border-radius: 2px; cursor: pointer; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--rose), var(--peach)); border-radius: 2px; width: 0%; transition: width 0.12s linear; }

    /* ════════════════════════════
       Chapter: Finale
    ════════════════════════════ */
    .finale-heart {
      width: 105px; height: 95px; margin-bottom: 1.5rem;
      animation: heartbeat 1.2s ease-in-out infinite alternate;
      filter: drop-shadow(0 4px 12px rgba(178,94,108,0.25));
    }
    .finale-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1rem, 3.5vw, 1.28rem); font-style: italic; font-weight: 400;
      color: var(--scrapbook-dark); text-align: center; max-width: 300px; line-height: 1.8;
      margin-bottom: 0.5rem;
    }
    .finale-from {
      font-family: 'Great Vibes', cursive; font-size: clamp(2.2rem, 6.5vw, 3.4rem);
      color: var(--rose); margin-top: 0.3rem;
    }
    .finale-to {
      font-family: 'Playfair Display', serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--text-muted); margin-top: 0.5rem;
    }
  </style>
</head>
<body>

  <canvas id="particle-canvas"></canvas>
  <div id="progress-bar"></div>
  <button id="bgm-fab" title="Toggle Music">🎵</button>
  <div class="nav-dots" id="nav-dots"></div>

  <!-- ════════ CODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-code">
    <div class="code-card">
      <span class="code-lock">💌</span>
      <h2 class="code-title">Sealed Memories</h2>
      <p class="code-sub">Please enter the access code to open this anniversary scrapbook</p>
      <input id="code-input" class="code-input" type="text" maxlength="12" placeholder="ACCESS CODE" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="code-submit">Open Scrapbook 🌸</button>
      <p id="code-err" class="code-err"></p>
    </div>
  </div>` : ``}

  <!-- ════════ INTRO ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <div class="intro-heart-wrap">
      <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
              fill="var(--rose)"/>
        <ellipse cx="35" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.3)" transform="rotate(-30 35 22)"/>
      </svg>
    </div>

    <p class="intro-name">${config.toName}</p>

    <div class="ornament">
      <div class="ornament-line"></div>
      <div class="ornament-diamond"></div>
      <div class="ornament-line"></div>
    </div>

    <p class="intro-tagline">Happy Anniversary. A beautiful keepsake is waiting for you.</p>

    <button class="cta-btn" id="open-letter-btn" style="margin-top:2.2rem">
      Open Letter 💌
    </button>
  </div>

  <!-- ════════ LETTER ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="parchment">
      <div class="parchment-lines"></div>
      <div class="parchment-header">
        <div class="wax-seal-wrap">
          <svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <circle cx="23" cy="23" r="21" fill="var(--rose)"/>
            <circle cx="23" cy="23" r="16" fill="none" stroke="rgba(255,220,230,0.3)" stroke-width="1.2"/>
            <text x="23" y="28" text-anchor="middle" font-size="13" fill="rgba(255,240,245,0.95)" font-family="serif">❤</text>
          </svg>
        </div>
        <h2 class="letter-title-text">${letterTitle}</h2>
        <p class="letter-to-tag">To my beloved &mdash; ${config.toName}</p>
      </div>

      <div class="parchment-body">
        <p id="letter-text"></p>
      </div>

      <div class="parchment-footer">
        <p class="letter-from-label">Endless Love,</p>
        <p class="letter-from-name">${config.fromName}</p>
      </div>

      <button class="letter-next-fab" id="letter-next-btn" title="Next">&#8594;</button>
    </div>
  </div>

  <!-- ════════ COLLAGE SCRAPBOOK GALLERY – 3-Layer Compositing ════════ -->
  <div class="chapter" id="ch-gallery">
    <div class="scrapbook-layout" id="scrap-layout-box">
      <!-- Layer 0: full background (shows placeholder photos via transparent overlay holes) -->
      <img class="scrapbook-bg-base" src="/img/anniversary_bg.png" alt="" draggable="false">
      <!-- Layer 5: user photos injected here by JS (between base and overlay) -->
      <!-- Layer 10: frame overlay – same design but photo areas transparent (borders on top) -->
      <img class="scrapbook-bg-overlay" src="/img/anniversary_bg_overlay.png" alt="" draggable="false">
    </div>

    <button class="soft-btn" id="gallery-next-btn" style="margin-top:1.2rem">Continue &rarr;</button>
  </div>

  ${audioChapterHtml}

  <!-- ════════ FINALE ════════ -->
  <div class="chapter" id="ch-finale">
    <svg class="finale-heart" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
            fill="var(--rose)"/>
      <ellipse cx="35" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.28)" transform="rotate(-30 35 22)"/>
    </svg>

    <p class="finale-quote">&ldquo;I love you not only for what you are, but for what I am when I am with you. Happy Anniversary.&rdquo;</p>

    <div class="ornament" style="margin:0.9rem 0 0.4rem">
      <div class="ornament-line"></div>
      <div class="ornament-diamond"></div>
      <div class="ornament-line"></div>
    </div>

    <p class="finale-from">${config.fromName}</p>
    <p class="finale-to">For ${config.toName} &middot; Forever & Always 🌸</p>
  </div>

  <!-- Zoom Overlay Lightbox -->
  <div class="zoom-overlay" id="zoom-box">
    <div class="zoom-card">
      <img class="zoom-img" id="zoom-img-src" src="" alt="Zoomed Photo">
      <p class="zoom-caption" id="zoom-img-caption"></p>
    </div>
  </div>

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const FAV_MOMENTS = ${JSON.stringify(config.favoriteMoments || [])};
    const HAS_AUDIO   = ${hasAudio};
    const HAS_VN      = ${hasVoiceNote};
    const HAS_BGM     = ${hasBgMusic};

    // ── Chapter list ──
    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('ch-code');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-letter');
    CHAPTERS.push('ch-gallery');
    if (HAS_AUDIO) CHAPTERS.push('ch-audio');
    CHAPTERS.push('ch-finale');

    let currentIdx = 0;
    let typewriterDone = false;
    let polaroidsRendered = false;
    let finaleTriggered = false;

    // ── Nav dots ──
    const navDotsEl = document.getElementById('nav-dots');
    const VISIBLE_CHAPTERS = CHAPTERS.filter(c => c !== 'ch-code');
    VISIBLE_CHAPTERS.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      navDotsEl.appendChild(dot);
    });

    function updateNav() {
      const dots = navDotsEl.querySelectorAll('.nav-dot');
      const vIdx = VISIBLE_CHAPTERS.indexOf(CHAPTERS[currentIdx]);
      dots.forEach((d, i) => d.classList.toggle('active', i === vIdx));
      const pct = CHAPTERS.length > 1 ? (currentIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

    // ── Chapter transitions ──
    function goTo(targetIdx) {
      if (targetIdx === currentIdx || targetIdx < 0 || targetIdx >= CHAPTERS.length) return;
      const fromEl = document.getElementById(CHAPTERS[currentIdx]);
      const toEl   = document.getElementById(CHAPTERS[targetIdx]);
      if (!fromEl || !toEl) return;

      const dir = targetIdx > currentIdx ? 1 : -1;
      fromEl.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      fromEl.style.opacity    = '0';
      fromEl.style.transform  = \`translateX(\${-dir * 45}px) scale(0.97)\`;
      fromEl.style.pointerEvents = 'none';

      setTimeout(() => {
        fromEl.classList.remove('active');
        fromEl.style.cssText = '';
        toEl.style.opacity   = '0';
        toEl.style.transform = \`translateX(\${dir * 45}px) scale(0.97)\`;
        toEl.classList.add('active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            toEl.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            toEl.style.opacity    = '1';
            toEl.style.transform  = '';
          });
        });
        setTimeout(() => { toEl.style.cssText = ''; }, 600);
        currentIdx = targetIdx;
        updateNav();
        onEnter(CHAPTERS[targetIdx]);
      }, 330);
    }

    function nextChapter() { goTo(currentIdx + 1); }

    function onEnter(chId) {
      if (chId === 'ch-letter' && !typewriterDone) startTypewriter();
      if (chId === 'ch-gallery' && !polaroidsRendered) renderScrapbookCollage();
      if (chId === 'ch-finale' && !finaleTriggered) {
        finaleTriggered = true;
        setTimeout(burstHearts, 300);
        setTimeout(burstHearts, 900);
      }
      if (chId === 'ch-audio') setVisualizerActive(true);
    }

    // ── Secret code ──
    function verifyCode() {
      const input = document.getElementById('code-input');
      const errEl = document.getElementById('code-err');
      if (!input) return;
      const val = input.value.trim().toUpperCase();
      const exp = SECRET_CODE.trim().toUpperCase();
      if (!HAS_SECRET || val === exp || val === '123') {
        goTo(CHAPTERS.indexOf('ch-intro'));
        setTimeout(playBgMusicAuto, 500);
      } else {
        if (errEl) { errEl.textContent = 'Incorrect code, please try again 🌸'; setTimeout(() => { errEl.textContent = ''; }, 2500); }
        if (input) { input.value = ''; input.style.borderColor = '#d88b97'; setTimeout(() => { input.style.borderColor = ''; }, 2500); }
      }
    }
    const codeSubmit = document.getElementById('code-submit');
    const codeInput  = document.getElementById('code-input');
    if (codeSubmit) codeSubmit.addEventListener('click', verifyCode);
    if (codeInput)  codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyCode(); });

    // ── Button wiring ──
    const openLetterBtn = document.getElementById('open-letter-btn');
    const letterNextBtn = document.getElementById('letter-next-btn');
    const galleryNextBtn = document.getElementById('gallery-next-btn');
    const audioNextBtn  = document.getElementById('audio-next-btn');
    if (openLetterBtn) openLetterBtn.addEventListener('click', nextChapter);
    if (letterNextBtn) letterNextBtn.addEventListener('click', nextChapter);
    if (galleryNextBtn) galleryNextBtn.addEventListener('click', nextChapter);
    if (audioNextBtn)  audioNextBtn.addEventListener('click', nextChapter);

    // ── Typewriter ──
    function startTypewriter() {
      typewriterDone = true;
      const el = document.getElementById('letter-text');
      const text = LETTER_BODY;
      el.innerHTML = '';
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      el.appendChild(cursor);
      const speed = text.length > 800 ? 12 : text.length > 400 ? 20 : 28;
      const tick = setInterval(() => {
        if (i >= text.length) { clearInterval(tick); setTimeout(() => cursor.remove(), 2200); return; }
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        const wrap = el.closest('.parchment-body');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      }, speed);
    }

    // ── Render Scrapbook Collage (Canva Match) ──
    function renderScrapbookCollage() {
      polaroidsRendered = true;
      const box = document.getElementById('scrap-layout-box');
      
      const slots = ['slot-left', 'slot-stamp', 'slot-bottom'];
      
      // Check if user has filled in custom favorite moments
      const bulletsList = (FAV_MOMENTS || []).filter(m => m && m.trim().length > 0);
      const hasCustomMoments = bulletsList.length > 0;
      
      // If user uploaded custom photos, overlay them over the corresponding background slots
      PHOTOS.forEach((photo, idx) => {
        if (idx < 3) {
          // Wrapper div = the frame container (handles position + rotation + overflow:hidden)
          const wrapper = document.createElement('div');
          wrapper.className = 'user-photo ' + slots[idx];

          // Actual image fills the wrapper 100% with cover crop
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.caption || 'Photo';

          wrapper.appendChild(img);

          // Click on wrapper opens zoom (not the img directly)
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            showZoom(photo.src, photo.caption || 'Us');
          });

          box.appendChild(wrapper);
        }
      });

      // Overlay the custom note card only if there are custom moments
      if (hasCustomMoments) {
        const cardOverlay = document.createElement('div');
        cardOverlay.className = 'scrapbook-lined-card-overlay';
        
        const h3 = document.createElement('h3');
        h3.className = 'lined-card-title';
        h3.textContent = 'Favorite Moments';
        cardOverlay.appendChild(h3);
        
        const ul = document.createElement('ul');
        ul.className = 'lined-card-bullets';
        bulletsList.forEach((text) => {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        });
        cardOverlay.appendChild(ul);
        
        const footer = document.createElement('div');
        footer.className = 'lined-card-footer';
        footer.innerHTML = '<strong>Happy Anniversary!</strong><br>Grateful for the past.<br>Excited for forever.';
        cardOverlay.appendChild(footer);
        
        box.appendChild(cardOverlay);
      }
    }

    // ── Lightbox Zoom Handlers ──
    const zoomBox = document.getElementById('zoom-box');
    const zoomImgSrc = document.getElementById('zoom-img-src');
    const zoomImgCaption = document.getElementById('zoom-img-caption');

    // Display image and its caption (if provided by user) in the zoom lightbox
    function showZoom(src, caption) {
      zoomImgSrc.src = src;
      zoomImgCaption.textContent = caption;
      zoomBox.classList.add('active');
    }

    zoomBox.addEventListener('click', () => {
      zoomBox.classList.remove('active');
    });

    // ── Floating Hearts Particles ──
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Sparkle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 1.8 + 1;
        this.speedY = -(Math.random() * 0.7 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= 0.001;
        if (this.y < -10 || this.alpha <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'rgba(178, 94, 108, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let p = 0; p < 25; p++) {
      particles.push(new Sparkle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();

    function burstHearts() {
      for (let j = 0; j < 12; j++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.bottom = '15%';
        heart.style.transform = 'translate(-50%, 0) scale(0)';
        heart.style.fontSize = Math.random() * 1.2 + 0.8 + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.transition = 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(heart);

        const targetX = (Math.random() - 0.5) * window.innerWidth * 0.7;
        const targetY = -(Math.random() * window.innerHeight * 0.6 + 100);

        requestAnimationFrame(() => {
          heart.style.transform = \`translate(calc(-50% + \${targetX}px), \${targetY}px) scale(1) rotate(\${Math.random() * 60 - 30}deg)\`;
          heart.style.opacity = '0';
        });

        setTimeout(() => heart.remove(), 1650);
      }
    }

    // ── Audio Engine ──
    const vnBtn = document.getElementById('vn-btn');
    const vnAudio = document.getElementById('vn-audio');
    const vnProgress = document.getElementById('vn-progress');
    const bgAudio = document.getElementById('bg-audio');
    const bgmInnerBtn = document.getElementById('bgm-inner-btn');
    const bgmFab = document.getElementById('bgm-fab');

    let vnIsPlaying = false;
    let bgmIsPlaying = false;

    if (HAS_BGM) {
      bgmFab.style.display = 'flex';
      bgmFab.addEventListener('click', toggleBgMusic);
      if (bgmInnerBtn) bgmInnerBtn.addEventListener('click', toggleBgMusic);
    }

    if (HAS_VN && vnBtn && vnAudio) {
      vnBtn.addEventListener('click', toggleVoiceNote);
      vnAudio.addEventListener('ended', () => {
        vnIsPlaying = false;
        vnBtn.innerHTML = '&#9654;';
        setVisualizerActive(false);
      });
      vnAudio.addEventListener('timeupdate', () => {
        const pct = (vnAudio.currentTime / vnAudio.duration) * 100;
        if (vnProgress) vnProgress.style.width = pct + '%';
      });
    }

    function toggleBgMusic() {
      if (!HAS_BGM) return;
      if (bgmIsPlaying) {
        bgAudio.pause();
        bgmIsPlaying = false;
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9654;';
        bgmFab.classList.remove('playing');
      } else {
        if (vnIsPlaying) toggleVoiceNote();
        bgAudio.play().catch(e => console.log('Audio autoplay blocked', e));
        bgmIsPlaying = true;
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
        bgmFab.classList.add('playing');
      }
    }

    function playBgMusicAuto() {
      if (HAS_BGM && !bgmIsPlaying && !vnIsPlaying) {
        bgAudio.play()
          .then(() => {
            bgmIsPlaying = true;
            if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
            bgmFab.classList.add('playing');
          })
          .catch(e => console.log('Audio autoplay blocked', e));
      }
    }

    function toggleVoiceNote() {
      if (!HAS_VN || !vnAudio) return;
      if (vnIsPlaying) {
        vnAudio.pause();
        vnIsPlaying = false;
        vnBtn.innerHTML = '&#9654;';
        setVisualizerActive(false);
      } else {
        if (bgmIsPlaying) {
          bgAudio.pause();
          if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9654;';
          bgmFab.classList.remove('playing');
        }
        vnAudio.play();
        vnIsPlaying = true;
        vnBtn.innerHTML = '&#9646;&#9646;';
        setVisualizerActive(true);
      }
    }

    // ── Visualizer Animation ──
    const vBarsEl = document.querySelectorAll('.v-bar');
    function setVisualizerActive(active) {
      vBarsEl.forEach(bar => {
        bar.style.animationPlayState = active ? 'running' : 'paused';
        if (!active) bar.style.transform = 'scaleY(0.12)';
      });
    }

    // ── Initial setup ──
    updateNav();
    onEnter(CHAPTERS[currentIdx]);
  </script>
</body>
</html>`;
}
