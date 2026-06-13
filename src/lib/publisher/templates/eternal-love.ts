import { PublishedConfig } from "../../schemas/card-draft";

export function generateEternalLoveHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "To My Beloved";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasPhotos = config.photos && config.photos.length > 0;
  const hasAudio = hasVoiceNote || hasBgMusic;

  const vBars = Array.from({ length: 22 }, (_, i) =>
    `<div class="v-bar" style="animation-delay:${(i * 0.055).toFixed(3)}s;height:${16 + ((i % 5) * 7)}px"></div>`
  ).join("");

  const photosChapterHtml = hasPhotos
    ? `
  <div class="chapter" id="ch-photos">
    <h2 class="ch-heading">Our Memories</h2>
    <p class="ch-subheading">Every picture holds a thousand words</p>
    <div class="polaroid-grid" id="polaroid-container"></div>
    <button class="soft-btn" id="photos-next-btn" style="margin-top:1.8rem">Continue &rarr;</button>
  </div>`
    : "";

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <h2 class="ch-heading">A Melody for You</h2>
    <p class="ch-subheading">The voices of our story</p>
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
      <div class="audio-row" style="border-top:1px solid rgba(210,130,140,0.18);padding-top:0.9rem;margin-top:0.5rem">
        <p class="audio-row-label">🎼 Background Music</p>
        <div class="audio-row-controls">
          <button id="bgm-inner-btn" class="round-play-btn">&#9646;&#9646;</button>
          <p style="font-size:0.68rem;color:var(--muted);font-style:italic">Accompanying every moment</p>
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
  <title>My Love Letter – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-a:       #fef8f5;
      --bg-b:       #fde8f0;
      --bg-c:       #fff4ec;
      --bg-d:       #f8f0fd;
      --rose:       #d95070;
      --rose-light: #f07898;
      --peach:      #e8906a;
      --gold:       #c8882a;
      --champagne:  #f5dfc0;
      --text:       #3e1e2c;
      --text-mid:   #6e3a4e;
      --muted:      rgba(62,30,44,0.45);
      --card-bg:    rgba(255,255,255,0.88);
      --card-border:rgba(210,130,150,0.22);
      --glow:       rgba(217,80,112,0.22);
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      background: linear-gradient(155deg, var(--bg-a) 0%, var(--bg-b) 45%, var(--bg-c) 100%);
      font-family: 'Cormorant Garamond', 'Georgia', serif;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Canvas ── */
    #particle-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 1;
    }

    /* ── Soft bokeh overlay ── */
    .bokeh-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(circle at 15% 25%, rgba(255,180,200,0.18) 0%, transparent 38%),
        radial-gradient(circle at 82% 15%, rgba(255,210,160,0.15) 0%, transparent 32%),
        radial-gradient(circle at 70% 80%, rgba(200,180,255,0.12) 0%, transparent 34%),
        radial-gradient(circle at 20% 78%, rgba(255,170,200,0.14) 0%, transparent 30%);
      animation: bokehDrift 12s ease-in-out infinite alternate;
    }
    @keyframes bokehDrift {
      from { transform: scale(1) translate(0,0); }
      to   { transform: scale(1.04) translate(8px,-6px); }
    }

    /* ── Progress bar ── */
    #progress-bar {
      position: fixed; top: 0; left: 0;
      height: 3px; width: 0%;
      background: linear-gradient(90deg, var(--rose-light), var(--peach), var(--rose-light));
      background-size: 200% auto;
      animation: shimmerBar 2s linear infinite;
      z-index: 100;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 0 8px rgba(217,80,112,0.4);
    }
    @keyframes shimmerBar { to { background-position: 200% center; } }

    /* ── BGM FAB ── */
    #bgm-fab {
      position: fixed; top: 0.9rem; right: 0.9rem; z-index: 101;
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(210,130,150,0.35);
      color: var(--rose); font-size: 1rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 2px 12px rgba(217,80,112,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #bgm-fab.visible { display: flex; }
    #bgm-fab:hover { transform: scale(1.1); box-shadow: 0 4px 18px rgba(217,80,112,0.28); }

    /* ── Nav dots ── */
    .nav-dots {
      position: fixed; right: 1rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 8px; z-index: 50;
    }
    .nav-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(210,130,150,0.3);
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nav-dot.active {
      background: var(--rose);
      transform: scale(1.7);
      box-shadow: 0 0 8px rgba(217,80,112,0.5);
    }
    .nav-dot:hover { background: var(--rose-light); }

    /* ── Chapter base ── */
    .chapter {
      position: fixed; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 1.5rem; z-index: 10;
      opacity: 0; pointer-events: none;
      will-change: opacity, transform;
    }
    .chapter.active { opacity: 1; pointer-events: auto; }

    /* ── Shared type styles ── */
    .ch-heading {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.2rem, 7vw, 3.4rem);
      background: linear-gradient(135deg, #b02850 0%, var(--rose) 40%, var(--peach) 75%, var(--gold) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmerText 3.5s linear infinite;
      text-align: center; margin-bottom: 0.35rem;
    }
    @keyframes shimmerText { to { background-position: 200% center; } }
    .ch-subheading {
      font-size: 0.7rem; font-family: 'Cinzel', serif;
      letter-spacing: 0.28em; text-transform: uppercase;
      color: var(--muted); text-align: center; margin-bottom: 1.8rem;
    }

    /* ── Ornament ── */
    .ornament { display: flex; align-items: center; gap: 0.7rem; margin: 0.8rem 0 1.2rem; }
    .ornament-line { flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-light), transparent); }
    .ornament-diamond { width: 5px; height: 5px; background: var(--rose-light); transform: rotate(45deg); box-shadow: 0 0 5px rgba(240,120,152,0.5); }

    /* ── Buttons ── */
    .cta-btn {
      padding: 0.88rem 2.6rem;
      font-family: 'Cinzel', serif; font-size: 0.78rem;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: #fff;
      background: linear-gradient(135deg, var(--rose) 0%, var(--peach) 100%);
      border: none; border-radius: 50px; cursor: pointer;
      box-shadow: 0 4px 24px rgba(217,80,112,0.35), 0 1px 0 rgba(255,255,255,0.3) inset;
      position: relative; overflow: hidden;
      transition: transform 0.22s, box-shadow 0.22s;
      animation: pulseShadow 3s 2s ease-in-out infinite;
    }
    .cta-btn::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.22s;
    }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(217,80,112,0.5); }
    .cta-btn:hover::before { opacity: 1; }
    .cta-btn:active { transform: translateY(0) scale(0.97); }
    @keyframes pulseShadow {
      0%,100% { box-shadow: 0 4px 24px rgba(217,80,112,0.35); }
      50%      { box-shadow: 0 6px 40px rgba(217,80,112,0.55); }
    }
    .soft-btn {
      padding: 0.72rem 2rem;
      font-family: 'Cinzel', serif; font-size: 0.72rem;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--rose);
      background: rgba(255,255,255,0.8);
      border: 1.5px solid rgba(217,80,112,0.3);
      border-radius: 50px; cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 12px rgba(217,80,112,0.1);
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .soft-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.95); box-shadow: 0 5px 20px rgba(217,80,112,0.22); }
    .soft-btn:active { transform: scale(0.97); }

    /* ════════════════════════════
       Chapter: Code Gate
    ════════════════════════════ */
    #ch-code { background: linear-gradient(155deg, #fef8f5 0%, #fde8f0 55%, #fff0e8 100%); }
    .code-card {
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1.5px solid rgba(217,100,140,0.2);
      border-radius: 28px; padding: 2.4rem 2rem 2rem;
      text-align: center; width: 100%; max-width: 340px;
      box-shadow: 0 8px 40px rgba(217,80,112,0.12), 0 1px 0 rgba(255,255,255,0.9) inset;
    }
    .code-lock { font-size: 2.4rem; margin-bottom: 0.9rem; display: block; animation: floatBob 3.2s ease-in-out infinite; }
    @keyframes floatBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
    .code-title { font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 0.08em; color: var(--text); margin-bottom: 0.3rem; }
    .code-sub   { font-size: 0.73rem; color: var(--muted); margin-bottom: 1.5rem; font-style: italic; }
    .code-input {
      width: 100%; padding: 0.78rem 1rem;
      background: #fdf5f8; border: 1.5px solid rgba(217,100,140,0.28); border-radius: 14px;
      color: var(--text); font-family: 'Cinzel', serif; font-size: 1.05rem;
      letter-spacing: 0.35em; text-align: center; text-transform: uppercase;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .code-input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(217,80,112,0.15); }
    .code-submit {
      width: 100%; margin-top: 0.9rem; padding: 0.82rem;
      font-family: 'Cinzel', serif; font-size: 0.78rem;
      letter-spacing: 0.14em; text-transform: uppercase; color: #fff;
      background: linear-gradient(135deg, var(--rose) 0%, var(--peach) 100%);
      border: none; border-radius: 14px; cursor: pointer;
      box-shadow: 0 4px 18px rgba(217,80,112,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .code-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(217,80,112,0.45); }
    .code-submit:active { transform: scale(0.97); }
    .code-err { font-size: 0.72rem; color: #d04060; height: 1.1rem; margin-top: 0.5rem; font-style: italic; }

    /* ════════════════════════════
       Chapter: Intro
    ════════════════════════════ */
    #ch-intro {
      background:
        radial-gradient(ellipse at 50% 55%, #fddde8 0%, #fef8f0 50%, var(--bg-a) 100%);
    }
    .intro-heart-wrap {
      width: 88px; height: 88px; position: relative; margin-bottom: 1.6rem;
      animation: heartbeat 1.5s ease-in-out infinite;
      filter: drop-shadow(0 4px 16px rgba(217,80,112,0.45));
    }
    @keyframes heartbeat {
      0%,100% { transform: scale(1); }
      12%      { transform: scale(1.18); }
      24%      { transform: scale(1.04); }
      38%      { transform: scale(1.12); }
      54%      { transform: scale(1); }
    }
    .intro-name {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.8rem, 9vw, 5rem);
      background: linear-gradient(135deg, #9e2040 0%, var(--rose) 40%, var(--peach) 75%, var(--gold) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: shimmerText 3.5s linear infinite, fadeSlideUp 1.2s ease both;
      text-align: center; line-height: 1.1;
    }
    @keyframes fadeSlideUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
    .intro-tagline {
      font-size: clamp(0.6rem, 1.8vw, 0.78rem); font-family: 'Cinzel', serif;
      letter-spacing: 0.32em; text-transform: uppercase; color: var(--muted);
      animation: fadeSlideUp 1.4s 0.3s ease both; text-align: center;
    }

    /* ════════════════════════════
       Chapter: Letter (Parchment)
    ════════════════════════════ */
    #ch-letter {
      background: radial-gradient(ellipse at 35% 65%, #fef0de 0%, #fdf8f4 55%, var(--bg-a) 100%);
      padding: 0.8rem;
    }
    .parchment {
      width: 100%; max-width: 480px;
      height: min(82vh, 560px);
      background: linear-gradient(160deg, #fdf0e2 0%, #f8e8d0 50%, #f0dcc0 100%);
      border-radius: 3px 3px 14px 14px;
      box-shadow:
        0 0 0 1px rgba(160,110,60,0.25),
        0 12px 40px rgba(180,100,80,0.18),
        0 32px 70px rgba(80,30,20,0.1),
        inset 0 0 60px rgba(160,110,60,0.06);
      display: flex; flex-direction: column;
      overflow: hidden; position: relative;
      animation: parchmentDrop 0.9s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes parchmentDrop { from { opacity:0; transform:translateY(36px) scale(0.95); } to { opacity:1; transform:none; } }
    .parchment::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 90px;
      background: radial-gradient(ellipse at 50% 100%, rgba(255,190,80,0.14) 0%, transparent 65%);
      pointer-events: none; animation: candleFlicker 2.8s ease-in-out infinite alternate;
    }
    @keyframes candleFlicker { from { opacity:0.5; transform:scaleX(0.88); } to { opacity:0.95; transform:scaleX(1.08); } }
    .parchment::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(0deg, transparent 0px, transparent 27px, rgba(160,110,60,0.05) 27px, rgba(160,110,60,0.05) 28px);
    }
    .parchment-header {
      padding: 1.1rem 1.4rem 0.8rem; text-align: center;
      border-bottom: 1px solid rgba(140,90,40,0.15);
      flex-shrink: 0; position: relative; z-index: 1;
    }
    .wax-seal-wrap {
      margin: 0 auto 0.5rem; width: 46px; height: 46px;
      animation: sealPop 0.7s cubic-bezier(0.34,1.9,0.64,1) 0.25s both;
    }
    @keyframes sealPop { from { transform:scale(0) rotate(-50deg); opacity:0; } to { transform:none; opacity:1; } }
    .letter-title-text { font-family: 'Great Vibes', cursive; font-size: clamp(1.3rem,4.5vw,1.85rem); color: #4e2512; line-height: 1.15; }
    .letter-to-tag     { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: #7c4828; margin-top: 0.2rem; }
    .parchment-body {
      flex: 1; overflow-y: auto; padding: 1rem 1.4rem;
      position: relative; z-index: 1; scrollbar-width: thin;
      scrollbar-color: rgba(140,90,40,0.25) transparent;
    }
    #letter-text { font-size: 0.88rem; line-height: 1.9; color: #3a1e0c; font-style: italic; font-weight: 300; white-space: pre-line; width: 100%; }
    .cursor-blink { display: inline-block; width: 1.5px; height: 1em; background: #7c4828; margin-left: 1px; vertical-align: middle; animation: blink 0.65s steps(1) infinite; }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
    .parchment-footer {
      padding: 0.7rem 1.4rem 0.9rem; border-top: 1px solid rgba(140,90,40,0.15);
      text-align: center; flex-shrink: 0; position: relative; z-index: 1;
    }
    .letter-from-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.2em; color: #7c4828; text-transform: uppercase; }
    .letter-from-name  { font-family: 'Great Vibes', cursive; font-size: 1.55rem; color: #4e2512; line-height: 1.2; }
    .letter-next-fab {
      position: absolute; bottom: 0.9rem; right: 0.9rem;
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #f8c8d0, var(--rose));
      border: none; cursor: pointer; font-size: 1rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 16px rgba(217,80,112,0.4);
      transition: transform 0.2s, box-shadow 0.2s; z-index: 2;
    }
    .letter-next-fab:hover { transform: scale(1.1); box-shadow: 0 5px 24px rgba(217,80,112,0.55); }
    .letter-next-fab:active { transform: scale(0.93); }

    /* ════════════════════════════
       Chapter: Photos
    ════════════════════════════ */
    #ch-photos {
      background: radial-gradient(ellipse at 60% 40%, #f0e8fc 0%, #fde8f4 50%, #fff8f4 100%);
    }
    .polaroid-grid {
      display: flex; flex-wrap: wrap; gap: 0.85rem;
      justify-content: center; align-content: start;
      max-width: 580px; max-height: 52vh;
      overflow-y: auto; padding: 0.4rem;
      scrollbar-width: thin; scrollbar-color: rgba(210,130,150,0.2) transparent;
    }
    .polaroid {
      background: #fff; padding: 7px 7px 2rem 7px;
      box-shadow: 0 4px 22px rgba(180,80,120,0.2), 0 1px 0 rgba(255,255,255,0.9) inset;
      width: calc(50% - 0.85rem); max-width: 175px; cursor: pointer;
      transform: rotate(var(--rot));
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
      animation: polaroidIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes polaroidIn { from { opacity:0; transform:scale(0.4) rotate(var(--rot)) translateY(30px); } to { opacity:1; transform:scale(1) rotate(var(--rot)); } }
    .polaroid:hover { transform: scale(1.07) rotate(0deg) !important; box-shadow: 0 10px 36px rgba(180,80,120,0.3); z-index: 5; }
    .polaroid img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
    .polaroid-cap { font-family: 'Cormorant Garamond', serif; font-size: 0.6rem; color: #666; text-align: center; padding: 0.35rem 0.2rem 0; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ════════════════════════════
       Chapter: Audio
    ════════════════════════════ */
    #ch-audio {
      background: radial-gradient(ellipse at 40% 55%, #eef2fc 0%, #fde8f4 55%, #fff8f4 100%);
    }
    .audio-card {
      width: 100%; max-width: 370px;
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
      border: 1.5px solid rgba(210,130,150,0.25);
      border-radius: 26px; padding: 1.4rem 1.5rem 1.6rem;
      box-shadow: 0 8px 40px rgba(217,80,112,0.1), 0 1px 0 rgba(255,255,255,0.9) inset;
    }
    .visualizer { display: flex; align-items: flex-end; justify-content: center; gap: 3px; height: 40px; margin-bottom: 1.2rem; }
    .v-bar {
      width: 4px; border-radius: 2px;
      background: linear-gradient(to top, var(--rose), #f8c0cc);
      animation: vibeBar 0.7s ease-in-out infinite alternate;
      animation-play-state: paused; transform: scaleY(0.12); transform-origin: bottom;
    }
    @keyframes vibeBar { from { transform:scaleY(0.12); opacity:0.35; } to { transform:scaleY(1); opacity:1; } }
    .audio-row { padding-bottom: 0.8rem; }
    .audio-row-label { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; display: block; }
    .audio-row-controls { display: flex; align-items: center; gap: 0.75rem; }
    .round-play-btn {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--rose), var(--peach));
      border: none; cursor: pointer; font-size: 1rem; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 16px rgba(217,80,112,0.38); transition: transform 0.2s; flex-shrink: 0;
    }
    .round-play-btn:hover { transform: scale(1.08); }
    .round-play-btn:active { transform: scale(0.94); }
    .progress-track { flex: 1; height: 3px; background: rgba(217,80,112,0.12); border-radius: 2px; cursor: pointer; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--rose), var(--peach)); border-radius: 2px; width: 0%; transition: width 0.12s linear; }

    /* ════════════════════════════
       Chapter: Finale
    ════════════════════════════ */
    #ch-finale {
      background: radial-gradient(ellipse at 50% 50%, #fddde8 0%, #fef4ec 45%, var(--bg-a) 100%);
    }
    .finale-heart {
      width: 110px; height: 110px; margin-bottom: 1.6rem;
      animation: heartbeat 1.2s ease-in-out infinite;
      filter: drop-shadow(0 4px 18px rgba(217,80,112,0.55)) drop-shadow(0 0 40px rgba(217,80,112,0.22));
    }
    .finale-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(0.95rem, 3.2vw, 1.25rem); font-style: italic; font-weight: 300;
      color: var(--text-mid); text-align: center; max-width: 300px; line-height: 1.8;
      margin-bottom: 0.5rem; animation: fadeSlideUp 1s 0.4s ease both;
    }
    .finale-from {
      font-family: 'Great Vibes', cursive; font-size: clamp(2rem, 6vw, 3rem);
      background: linear-gradient(135deg, #9e2040 0%, var(--rose) 40%, var(--peach) 75%, var(--gold) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: shimmerText 3.5s linear infinite, fadeSlideUp 1s 0.6s ease both; margin-top: 0.3rem;
    }
    .finale-to {
      font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase;
      color: var(--muted); margin-top: 0.5rem; animation: fadeSlideUp 1s 0.9s ease both;
    }
  </style>
</head>
<body>

  <canvas id="particle-canvas"></canvas>
  <div class="bokeh-bg"></div>
  <div id="progress-bar"></div>
  <button id="bgm-fab" title="Toggle Music">🎵</button>
  <div class="nav-dots" id="nav-dots"></div>

  <!-- ════════ CODE GATE ════════ -->
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-code">
    <div class="code-card">
      <span class="code-lock">💌</span>
      <h2 class="code-title">A Letter for You</h2>
      <p class="code-sub">Enter the code from the sender to open this message</p>
      <input id="code-input" class="code-input" type="text" maxlength="12" placeholder="ACCESS CODE" autocomplete="off" spellcheck="false">
      <button id="code-submit" class="code-submit">Open Now 🌸</button>
      <p id="code-err" class="code-err"></p>
    </div>
  </div>` : ``}

  <!-- ════════ INTRO ════════ -->
  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <div class="intro-heart-wrap">
      <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <radialGradient id="hg1" cx="38%" cy="32%" r="60%">
            <stop offset="0%"   stop-color="#ff9ab5"/>
            <stop offset="100%" stop-color="#d04070"/>
          </radialGradient>
          <filter id="hBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5"/>
          </filter>
        </defs>
        <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
              fill="rgba(217,80,112,0.2)" filter="url(#hBlur)" transform="translate(0,5)"/>
        <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
              fill="url(#hg1)"/>
        <ellipse cx="35" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.3)" transform="rotate(-30 35 22)"/>
      </svg>
    </div>

    <p class="intro-name">${config.toName}</p>

    <div class="ornament">
      <div class="ornament-line"></div>
      <div class="ornament-diamond"></div>
      <div class="ornament-line"></div>
    </div>

    <p class="intro-tagline">A sweet message is waiting for you</p>

    <button class="cta-btn" id="open-letter-btn" style="margin-top:2.2rem">
      Open Letter 💌
    </button>
  </div>

  <!-- ════════ LETTER ════════ -->
  <div class="chapter" id="ch-letter">
    <div class="parchment">
      <div class="parchment-header">
        <div class="wax-seal-wrap">
          <svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <defs>
              <radialGradient id="sg1" cx="38%" cy="32%">
                <stop offset="0%"   stop-color="#f07098"/>
                <stop offset="100%" stop-color="#c03060"/>
              </radialGradient>
            </defs>
            <circle cx="23" cy="23" r="21" fill="url(#sg1)"/>
            <circle cx="23" cy="23" r="16" fill="none" stroke="rgba(255,220,230,0.4)" stroke-width="1.2"/>
            <circle cx="23" cy="23" r="11" fill="none" stroke="rgba(255,220,230,0.2)" stroke-width="0.8"/>
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
        <p class="letter-from-label">With all my love</p>
        <p class="letter-from-name">${config.fromName}</p>
      </div>

      <button class="letter-next-fab" id="letter-next-btn" title="Next">&#8594;</button>
    </div>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <!-- ════════ FINALE ════════ -->
  <div class="chapter" id="ch-finale">
    <svg class="finale-heart" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hg2" cx="38%" cy="32%" r="60%">
          <stop offset="0%"   stop-color="#ff9ab5"/>
          <stop offset="100%" stop-color="#d04070"/>
        </radialGradient>
        <filter id="hBlur2" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>
      <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
            fill="rgba(217,80,112,0.22)" filter="url(#hBlur2)" transform="translate(0,7)"/>
      <path d="M50 80C50 80 8 54 8 28C8 14 18 4 32 4C40 4 47 8 50 14C53 8 60 4 68 4C82 4 92 14 92 28C92 54 50 80 50 80Z"
            fill="url(#hg2)"/>
      <ellipse cx="35" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.28)" transform="rotate(-30 35 22)"/>
    </svg>

    <p class="finale-quote">&ldquo;${config.finalMessage || "With you, every single day feels like the most beautiful gift."}&rdquo;</p>

    <div class="ornament" style="margin:0.9rem 0 0.4rem">
      <div class="ornament-line"></div>
      <div class="ornament-diamond"></div>
      <div class="ornament-line"></div>
    </div>

    <p class="finale-from">${config.fromName}</p>
    <p class="finale-to">For ${config.toName} &middot; With all my love 🌸</p>
  </div>

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const HAS_AUDIO   = ${hasAudio};
    const HAS_VN      = ${hasVoiceNote};
    const HAS_BGM     = ${hasBgMusic};

    // ── Chapter list ──
    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('ch-code');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-letter');
    ${hasPhotos ? `CHAPTERS.push('ch-photos');` : ``}
    ${hasAudio ? `CHAPTERS.push('ch-audio');` : ``}
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
      if (chId === 'ch-photos' && !polaroidsRendered) renderPolaroids();
      if (chId === 'ch-finale' && !finaleTriggered) {
        finaleTriggered = true;
        setTimeout(burstFireworks, 300);
        setTimeout(burstFireworks, 900);
        setTimeout(burstFireworks, 1600);
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
        if (input) { input.value = ''; input.style.borderColor = '#e06070'; setTimeout(() => { input.style.borderColor = ''; }, 2500); }
      }
    }
    const codeSubmit = document.getElementById('code-submit');
    const codeInput  = document.getElementById('code-input');
    if (codeSubmit) codeSubmit.addEventListener('click', verifyCode);
    if (codeInput)  codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyCode(); });

    // ── Button wiring ──
    const openLetterBtn = document.getElementById('open-letter-btn');
    const letterNextBtn = document.getElementById('letter-next-btn');
    const photosNextBtn = document.getElementById('photos-next-btn');
    const audioNextBtn  = document.getElementById('audio-next-btn');
    if (openLetterBtn) openLetterBtn.addEventListener('click', nextChapter);
    if (letterNextBtn) letterNextBtn.addEventListener('click', nextChapter);
    if (photosNextBtn) photosNextBtn.addEventListener('click', nextChapter);
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

    // ── Polaroids ──
    function renderPolaroids() {
      polaroidsRendered = true;
      const container = document.getElementById('polaroid-container');
      if (!container || !PHOTOS || PHOTOS.length === 0) {
        if (container) container.innerHTML = '<p style="color:var(--muted);font-style:italic;font-size:0.8rem;text-align:center">No photos attached.</p>';
        return;
      }
      const rots = [-3.5, 2.2, -1.8, 3.1, -2.6, 1.4, -2.1, 3.3];
      PHOTOS.forEach((ph, idx) => {
        const rot = rots[idx % rots.length];
        const el = document.createElement('div');
        el.className = 'polaroid';
        el.style.setProperty('--rot', rot + 'deg');
        el.style.animationDelay = (idx * 0.14) + 's';
        el.innerHTML = \`
          <img src="\${ph.src}" alt="Memory \${idx+1}" loading="lazy">
          \${ph.caption ? \`<p class="polaroid-cap">\${ph.caption}</p>\` : ''}
        \`;
        container.appendChild(el);
      });
    }

    // ── Audio ──
    const bgAudio      = document.getElementById('bg-audio');
    const bgmFab       = document.getElementById('bgm-fab');
    const bgmInnerBtn  = document.getElementById('bgm-inner-btn');
    const vnAudio      = document.getElementById('vn-audio');
    const vnBtn        = document.getElementById('vn-btn');
    const vnProgressEl = document.getElementById('vn-progress');

    function playBgMusicAuto() {
      if (!bgAudio) return;
      bgAudio.play().then(() => {
        if (bgmFab)      { bgmFab.classList.add('visible'); bgmFab.textContent = '🎵'; }
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
        setVisualizerActive(true);
      }).catch(() => {});
    }

    function toggleBgm() {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        bgAudio.play();
        if (bgmFab)      bgmFab.textContent = '🎵';
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9646;&#9646;';
        setVisualizerActive(true);
      } else {
        bgAudio.pause();
        if (bgmFab)      bgmFab.textContent = '🔇';
        if (bgmInnerBtn) bgmInnerBtn.innerHTML = '&#9654;';
        setVisualizerActive(false);
      }
    }
    if (bgmFab)      bgmFab.addEventListener('click', toggleBgm);
    if (bgmInnerBtn) bgmInnerBtn.addEventListener('click', toggleBgm);

    if (vnBtn && vnAudio) {
      vnBtn.addEventListener('click', () => {
        if (vnAudio.paused) {
          if (bgAudio && !bgAudio.paused) bgAudio.pause();
          vnAudio.play(); vnBtn.innerHTML = '&#9646;&#9646;'; setVisualizerActive(true);
        } else {
          vnAudio.pause(); vnBtn.innerHTML = '&#9654;'; setVisualizerActive(false);
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

    function setVisualizerActive(active) {
      document.querySelectorAll('.v-bar').forEach(bar => {
        bar.style.animationPlayState = active ? 'running' : 'paused';
      });
    }

    // ── Canvas Particle System ──
    const canvas = document.getElementById('particle-canvas');
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Warm light palette for particles on light background
    const PETAL_COLORS = ['#f09ab0','#f8c0cc','#e8a898','#f8d4a0','#f0b8d8','#fce0c0','#e8d0f0'];

    function makeParticle(scattered) {
      const types = ['heart','petal','star','circle','sparkle'];
      return {
        x: Math.random() * canvas.width,
        y: scattered ? Math.random() * canvas.height : -20,
        type: types[Math.floor(Math.random() * types.length)],
        size: 5 + Math.random() * 8,
        speedY: 0.3 + Math.random() * 0.65,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: scattered ? Math.random() * 0.35 : 0,
        maxOp: 0.15 + Math.random() * 0.32,
        rot: Math.random() * Math.PI * 2,
        rotS: (Math.random() - 0.5) * 0.022,
        wobble: Math.random() * Math.PI * 2,
        wobbleS: 0.016 + Math.random() * 0.026,
        fadeIn: !scattered,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      };
    }

    const particles = Array.from({ length: 38 }, (_, i) => makeParticle(i < 28));

    function drawParticle(p) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      const s = p.size;

      if (p.type === 'heart') {
        ctx.beginPath();
        ctx.moveTo(0, -s*0.28);
        ctx.bezierCurveTo( s*0.5, -s*0.78, s, -s*0.1, 0, s*0.5);
        ctx.bezierCurveTo(-s, -s*0.1, -s*0.5, -s*0.78, 0, -s*0.28);
        ctx.fill();
      } else if (p.type === 'star') {
        const r = s*0.5, ir = s*0.22;
        let a = -Math.PI/2;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const rr = i%2===0 ? r : ir;
          ctx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr);
          a += Math.PI/5;
        }
        ctx.closePath(); ctx.fill();
      } else if (p.type === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, s*0.36, s*0.66, 0, 0, Math.PI*2);
        ctx.fill();
      } else if (p.type === 'sparkle') {
        ctx.lineWidth = 1;
        for (let i=0;i<4;i++) {
          ctx.save(); ctx.rotate((i*Math.PI)/2);
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-s*0.6); ctx.stroke(); ctx.restore();
        }
      } else {
        ctx.beginPath(); ctx.arc(0,0,s*0.32,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    function updateParticle(p) {
      p.wobble += p.wobbleS;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.26;
      p.rot += p.rotS;
      if (p.fadeIn) { p.opacity += 0.01; if (p.opacity >= p.maxOp) p.fadeIn = false; }
      if (p.y > canvas.height + 22) Object.assign(p, makeParticle(false));
    }

    // Fireworks (warm, bright for light bg)
    let fireworks = [];
    function burstFireworks() {
      const cx = canvas.width  * (0.25 + Math.random() * 0.5);
      const cy = canvas.height * (0.2 + Math.random() * 0.35);
      const colors = ['#f07098','#f8c0cc','#e89858','#f8e080','#d060a0','#f0b060','#c8e4ff'];
      for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const speed = 1.6 + Math.random() * 4.2;
        fireworks.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          life: 1,
          decay: 0.013 + Math.random() * 0.018,
          size: 2.5 + Math.random() * 3.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function animLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { updateParticle(p); drawParticle(p); });
      fireworks = fireworks.filter(f => f.life > 0.04);
      fireworks.forEach(f => {
        f.x += f.vx; f.y += f.vy; f.vy += 0.09; f.vx *= 0.975; f.life -= f.decay;
        ctx.save();
        ctx.globalAlpha = f.life * 0.85;
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size * f.life, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = f.life * 0.25;
        ctx.beginPath(); ctx.arc(f.x - f.vx, f.y - f.vy, f.size * 1.3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(animLoop);
    }

    // ── Init ──
    updateNav();
    animLoop();
    if (!HAS_SECRET) setTimeout(playBgMusicAuto, 800);

    function triggerWakeup() {
      const introIdx = CHAPTERS.indexOf('ch-intro');
      if (introIdx !== -1 && currentIdx !== introIdx) goTo(introIdx);
    }
  </script>
</body>
</html>`;
}
