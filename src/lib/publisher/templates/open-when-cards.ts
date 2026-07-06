import { PublishedConfig } from "../../schemas/card-draft";

export function generateOpenWhenCardsHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "For You";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasFinalMessage = !!config.finalMessage;
  const finalMessage = config.finalMessage || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open When — ${config.toName}</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Caveat:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream: #FAF6F0;
      --paper: #F2EBE0;
      --paper-dark: #DDD0BC;
      --ink: #2A1F14;
      --ink-muted: #6A5643;
      --ink-faint: #A8927A;
      --shadow: rgba(42, 31, 20, 0.12);

      /* Card accent palette — cycles through cards */
      --c0: #FDEEE8; /* blush */
      --c1: #EEF1F8; /* lavender */
      --c2: #EBF4ED; /* sage */
      --c3: #FDF5E4; /* honey */
      --c4: #F4EBF5; /* mauve */
      --c5: #E8F4F2; /* teal-grey */

      --r0: #E8B4A0;
      --r1: #9AAAD0;
      --r2: #8FBFA0;
      --r3: #D4B870;
      --r4: #C09EC8;
      --r5: #70B8B0;
    }

    html, body {
      min-height: 100vh;
      background: var(--cream);
      color: var(--ink);
      font-family: 'Lora', Georgia, serif;
      overflow-x: hidden;
    }

    body {
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--paper); }
    ::-webkit-scrollbar-thumb { background: var(--paper-dark); border-radius: 2px; }

    /* ── BGM button ── */
    #bgm-btn {
      position: fixed; top: 1rem; right: 1rem;
      width: 2.25rem; height: 2.25rem;
      border-radius: 50%;
      border: 1px solid var(--paper-dark);
      background: var(--cream);
      box-shadow: 0 2px 8px var(--shadow);
      cursor: pointer;
      font-size: 0.8rem;
      display: flex; align-items: center; justify-content: center;
      z-index: 999;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* ── Code gate ── */
    #code-gate {
      position: fixed;
      inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: var(--cream);
      padding: 2rem;
      z-index: 1000;
      clip-path: circle(150% at 50% 50%);
      transition: clip-path 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 1.2s ease, backdrop-filter 1.2s ease;
    }
    .gate-card {
      width: min(400px, 92vw);
      background: white;
      border: 1px solid var(--paper-dark);
      border-radius: 1.25rem;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 8px 40px var(--shadow);
    }
    .gate-label {
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--ink-faint);
      margin-bottom: 1.5rem;
    }
    .gate-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.9rem;
      font-weight: 300;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.4rem;
    }
    .gate-sub {
      font-size: 0.75rem;
      color: var(--ink-faint);
      margin-bottom: 1.75rem;
      line-height: 1.6;
    }
    #code-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--paper-dark);
      border-radius: 0.75rem;
      background: var(--paper);
      font-family: 'Lora', serif;
      font-size: 0.9rem;
      text-align: center;
      letter-spacing: 0.2em;
      color: var(--ink);
      outline: none;
      transition: border-color 0.2s;
    }
    #code-input:focus { border-color: var(--ink-muted); }
    #code-btn {
      width: 100%;
      margin-top: 0.75rem;
      padding: 0.8rem;
      background: var(--ink);
      color: var(--cream);
      border: none;
      border-radius: 0.75rem;
      font-family: 'Lora', serif;
      font-size: 0.78rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    #code-btn:hover { background: var(--ink-muted); }
    #code-btn:active { transform: scale(0.98); }
    #code-err {
      margin-top: 0.5rem;
      font-size: 0.72rem;
      color: #b03030;
      opacity: 0;
      transition: opacity 0.3s;
    }

    /* ── Main wrapper ── */
    #main {
      display: none;
      max-width: 780px;
      margin: 0 auto;
      padding: 3rem 1.25rem 5rem;
    }
    #main.visible { display: block; }

    /* Header */
    .ow-header {
      text-align: center;
      margin-bottom: 3rem;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.8s, transform 0.8s;
    }
    .ow-header.visible { opacity: 1; transform: translateY(0); }

    .ow-eyebrow {
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--ink-faint);
      margin-bottom: 0.75rem;
    }
    .ow-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 6vw, 3rem);
      font-weight: 300;
      font-style: italic;
      color: var(--ink);
      line-height: 1.15;
      margin-bottom: 0.5rem;
    }
    .ow-meta {
      font-size: 0.72rem;
      color: var(--ink-faint);
      letter-spacing: 0.1em;
    }
    .ow-divider {
      width: 3rem;
      height: 1px;
      background: var(--paper-dark);
      margin: 1rem auto;
    }
    .ow-instruction {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-faint);
    }

    /* ── Cards grid ── */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    @media (min-width: 540px) {
      .cards-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    }

    /* ── Flip card ── */
    .owc {
      perspective: 900px;
      aspect-ratio: 3 / 4;
      cursor: pointer;
      opacity: 0;
      transform: translateY(24px) scale(0.96);
      transition: opacity 0.5s, transform 0.5s;
    }
    .owc.visible { opacity: 1; transform: translateY(0) scale(1); }

    .owc-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
    }
    .owc.opened .owc-inner { transform: rotateY(180deg); }

    .owc-front, .owc-back {
      position: absolute; inset: 0;
      border-radius: 0.85rem;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
    }

    /* FRONT face */
    .owc-front {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1rem;
      border: 1px solid rgba(0,0,0,0.07);
      box-shadow: 0 4px 20px var(--shadow);
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .owc:hover:not(.opened) .owc-front {
      box-shadow: 0 10px 36px rgba(42,31,20,0.18);
      transform: translateY(-3px);
    }

    /* Ribbon seal at top of front */
    .card-ribbon {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .card-ribbon svg { width: 22px; height: 22px; }

    /* "OPEN WHEN" label */
    .card-when-label {
      font-size: 0.52rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--ink-faint);
      text-align: center;
    }

    /* Prompt text */
    .card-prompt {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(0.9rem, 2.8vw, 1.05rem);
      font-style: italic;
      font-weight: 400;
      color: var(--ink);
      text-align: center;
      line-height: 1.35;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0;
    }

    /* Tap indicator */
    .card-tap {
      font-size: 0.5rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-faint);
      opacity: 0.7;
    }

    /* BACK face */
    .owc-back {
      transform: rotateY(180deg);
      background: white;
      border: 1px solid var(--paper-dark);
      box-shadow: 0 4px 20px var(--shadow);
      display: flex;
      flex-direction: column;
    }

    /* Back — text letter content */
    .back-letter {
      flex: 1;
      padding: 1.1rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .back-letter-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      font-style: italic;
      font-weight: 300;
      color: var(--ink-muted);
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--paper-dark);
    }
    .back-letter-body {
      font-family: 'Caveat', cursive;
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--ink);
      white-space: pre-wrap;
    }
    .cursor-blink {
      display: inline-block;
      width: 2px; height: 0.9em;
      background: var(--ink-faint);
      margin-left: 1px;
      vertical-align: text-bottom;
      animation: blink 0.9s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* Back — photo content */
    .back-photo {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    .back-photo img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    .back-photo-caption {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 1.5rem 0.85rem 0.65rem;
      background: linear-gradient(to top, rgba(42,31,20,0.6), transparent);
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.78rem;
      font-style: italic;
      color: rgba(255,252,248,0.92);
      line-height: 1.3;
    }

    /* Back — quote/final message content */
    .back-quote {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1.1rem;
      text-align: center;
    }
    .back-quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem;
      line-height: 0.5;
      color: var(--paper-dark);
      margin-bottom: 0.75rem;
    }
    .back-quote-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(0.85rem, 2.5vw, 1rem);
      font-style: italic;
      font-weight: 300;
      color: var(--ink);
      line-height: 1.55;
    }
    .back-quote-from {
      margin-top: 1rem;
      font-size: 0.62rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-faint);
    }

    /* Back — close button */
    .back-close {
      padding: 0.55rem;
      text-align: center;
      border-top: 1px solid var(--paper);
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--ink-faint);
      background: var(--cream);
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .back-close:hover { background: var(--paper); }

    /* Voice note (inside letter back) */
    .mini-voice {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.75rem;
      background: var(--paper);
      border-radius: 0.5rem;
      margin-top: 0.75rem;
      flex-shrink: 0;
    }
    #play-btn {
      width: 2rem; height: 2rem;
      border-radius: 50%;
      background: var(--ink);
      border: none;
      color: var(--cream);
      cursor: pointer;
      font-size: 0.65rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    #play-btn:hover { background: var(--ink-muted); }
    .mini-track {
      flex: 1;
      height: 2px;
      background: var(--paper-dark);
      border-radius: 1px;
      cursor: pointer;
      position: relative;
    }
    #audio-bar {
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 0;
      background: var(--ink-faint);
      border-radius: 1px;
      transition: width 0.1s linear;
    }
    .mini-time {
      font-size: 0.58rem;
      color: var(--ink-faint);
      flex-shrink: 0;
    }

    /* ── Footer ── */
    .ow-footer {
      text-align: center;
      margin-top: 4rem;
      font-size: 0.55rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink-faint);
      opacity: 0.45;
    }

    /* entrance / fade helpers */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-out {
      opacity: 0 !important;
      transform: scale(0.97) translateY(-8px) !important;
      transition: opacity 0.5s ease, transform 0.5s ease !important;
    }
  </style>
</head>
<body>

  ${hasBgMusic ? `
  <button id="bgm-btn" onclick="toggleBgm()"><span id="bgm-icon">♪</span></button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- ── SECTION 1: SECRET CODE ── -->
  ${hasSecretCode ? `
  <div id="code-gate">
    <div class="gate-card">
      <p class="gate-label">DearNote · Open When</p>
      <h1 class="gate-title">A message for you</h1>
      <p class="gate-sub">
        From <strong>${config.fromName}</strong> for <strong>${config.toName}</strong>.<br>
        Enter the code to open this letter collection.
      </p>
      <input id="code-input" type="text" placeholder="Access code" maxlength="12"
        onkeydown="if(event.key==='Enter')verifyCode()">
      <button id="code-btn" onclick="verifyCode()">Open</button>
      <p id="code-err">Incorrect code. Try again.</p>
    </div>
  </div>
  ` : ""}

  <!-- ── SECTION 2: CARDS ── -->
  <div id="main" ${!hasSecretCode ? 'class="visible"' : ""}>

    <header class="ow-header" id="ow-header">
      <p class="ow-eyebrow">DearNote · Open When</p>
      <h1 class="ow-title">${letterTitle}</h1>
      <p class="ow-meta">from ${config.fromName} &nbsp;·&nbsp; for ${config.toName}</p>
      <div class="ow-divider"></div>
      <p class="ow-instruction">Tap a card to open</p>
    </header>

    <div class="cards-grid" id="cards-grid"></div>

    <footer class="ow-footer">DearNote &nbsp;·&nbsp; Open When Letters</footer>

  </div>

  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      letterTitle: ${JSON.stringify(letterTitle)},
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote},
      voiceNoteSrc: ${JSON.stringify(voiceNoteSrc)},
      hasFinalMessage: ${hasFinalMessage},
      finalMessage: ${JSON.stringify(finalMessage)},
      fromName: ${JSON.stringify(config.fromName)},
      toName: ${JSON.stringify(config.toName)},
    };

    function $(id) { return document.getElementById(id); }

    /* ── Palette: card accent colors cycling ── */
    const ACCENTS = [
      { bg: '#FDEEE8', ribbon: '#E8B4A0', svg: 'heart' },
      { bg: '#EEF1F8', ribbon: '#9AAAD0', svg: 'star' },
      { bg: '#EBF4ED', ribbon: '#8FBFA0', svg: 'leaf' },
      { bg: '#FDF5E4', ribbon: '#D4B870', svg: 'sun' },
      { bg: '#F4EBF5', ribbon: '#C09EC8', svg: 'flower' },
      { bg: '#E8F4F2', ribbon: '#70B8B0', svg: 'moon' },
    ];

    const SVG_ICONS = {
      heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
      star:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      leaf:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2-4.03 0-7.5 3.47-7.5 7.5 0 2.16.91 4.1 2.36 5.5L8 18l-1.5-1.5C5.25 15.25 4 12.75 4 10c0-6 5-9 12-9-2.5 2.5-3 5-3 7z"/></svg>',
      sun:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>',
      flower:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-1.65 0-2.825-1.175T8 18q0-.575.15-1.1L6.5 15.25Q5.65 15.7 4.675 15.85T2.75 15.6q-.95-.5-1.35-1.5t-.05-2q.35-.975 1.2-1.55T4.5 10q.425 0 .825.1L7 8.45Q6.5 7.75 6.275 6.925T6.25 5.2q.45-.975 1.375-1.55T9.75 3.1q1 .05 1.85.625T12.9 5.35q.15.45.125.9T12.85 7.1L14.5 8.35q.75-.5 1.6-.7T17.8 7.5q1.05.3 1.775 1.15T20.3 10.8q-.05 1.075-.75 1.9t-1.8 1.125L17.6 15.4q.25.5.35 1.025T18 17.5q0 1.875-1.325 3.187T13.5 22H12zm0-2q1.025 0 1.763-.737T14.5 17.5q0-.45-.175-.875t-.5-.75l-1.25 1.25q-.3.3-.7.3t-.7-.3q-.3-.3-.3-.7t.3-.7l1.3-1.3q-.15-.075-.312-.112T12 15.25q-1.025 0-1.762.738T9.5 17.75q0 .95.675 1.6T12 20zm.05-8.5q.45 0 .9-.188t.75-.512l1.8-1.8q-.025-.275-.1-.525T15.1 8l-2.1 2.1q-.3.3-.7.3t-.7-.3L9.5 7.95q-.175.225-.287.488T9.1 9.1q-.025.325.075.625L11 11.55q.3.25.637.375t.413.075zM9.65 6.9q.225.15.475.237t.525.113l.8-.8L10.4 5.4q-.45.15-.775.5t-.35.75q-.025.175 0 .325t.375.925z"/></svg>',
      moon:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>',
    };

    /* Default "Open when…" prompts for photo cards with no short caption */
    const DEFAULT_PROMPTS = [
      'When you miss me…',
      'When you need a smile…',
      'When you need to remember…',
      'When you feel tired…',
      'When you need strength…',
      'When you want to reminisce…',
    ];

    /* ── Build all card data ── */
    function buildCardData() {
      const cards = [];
      let promptIdx = 0;

      // Card 0: Letter card
      cards.push({
        type: 'letter',
        prompt: CONFIG.letterTitle,
        accent: ACCENTS[0],
      });

      // Photo cards
      CONFIG.photos.forEach((photo, i) => {
        const acc = ACCENTS[(i + 1) % ACCENTS.length];
        // Use caption as front prompt only if it's short enough
        const prompt = (photo.caption && photo.caption.length <= 55)
          ? photo.caption
          : DEFAULT_PROMPTS[promptIdx++ % DEFAULT_PROMPTS.length];
        cards.push({ type: 'photo', prompt, photo, accent: acc });
      });

      // Final message card (if present)
      if (CONFIG.hasFinalMessage) {
        cards.push({
          type: 'quote',
          prompt: 'One last word…',
          accent: ACCENTS[cards.length % ACCENTS.length],
        });
      }

      return cards;
    }

    /* ── Render a card ── */
    function renderCard(data, idx) {
      const acc = data.accent;
      const owc = document.createElement('div');
      owc.className = 'owc';
      owc.dataset.idx = String(idx);
      owc.dataset.type = data.type;

      // ── FRONT ──
      const front = document.createElement('div');
      front.className = 'owc-front';
      front.style.background = acc.bg;

      const ribbon = document.createElement('div');
      ribbon.className = 'card-ribbon';
      ribbon.style.background = acc.ribbon + '30';
      ribbon.style.color = acc.ribbon;
      ribbon.innerHTML = SVG_ICONS[acc.svg] || SVG_ICONS.star;
      front.appendChild(ribbon);

      const whenLabel = document.createElement('p');
      whenLabel.className = 'card-when-label';
      whenLabel.innerText = 'Open when';
      front.appendChild(whenLabel);

      const prompt = document.createElement('p');
      prompt.className = 'card-prompt';
      prompt.innerText = data.prompt;
      front.appendChild(prompt);

      const tap = document.createElement('p');
      tap.className = 'card-tap';
      tap.innerText = 'Tap to open';
      front.appendChild(tap);

      // ── BACK ──
      const back = document.createElement('div');
      back.className = 'owc-back';

      if (data.type === 'letter') {
        const letterWrap = document.createElement('div');
        letterWrap.className = 'back-letter';

        const titleEl = document.createElement('p');
        titleEl.className = 'back-letter-title';
        titleEl.innerText = CONFIG.letterTitle;
        letterWrap.appendChild(titleEl);

        const bodyEl = document.createElement('div');
        bodyEl.className = 'back-letter-body';
        bodyEl.id = 'letter-body-el';
        letterWrap.appendChild(bodyEl);

        // Voice note inside letter card
        if (CONFIG.hasVoiceNote) {
          const miniVoice = document.createElement('div');
          miniVoice.className = 'mini-voice';
          miniVoice.innerHTML = \`
            <button id="play-btn" onclick="event.stopPropagation(); toggleAudio()">
              <span id="play-icon">&#9654;</span>
            </button>
            <div style="flex:1">
              <div class="mini-track" id="mini-track" onclick="event.stopPropagation(); seekAudio(event)">
                <div id="audio-bar"></div>
              </div>
            </div>
            <span class="mini-time" id="mini-time">0:00</span>
            <audio id="audio-el" src="\${CONFIG.voiceNoteSrc}"
              ontimeupdate="updateAudio()" onloadedmetadata="initAudioMeta()"></audio>
          \`;
          letterWrap.appendChild(miniVoice);
        }

        back.appendChild(letterWrap);

      } else if (data.type === 'photo') {
        const photoWrap = document.createElement('div');
        photoWrap.className = 'back-photo';

        const img = document.createElement('img');
        img.src = data.photo.src;
        img.alt = data.photo.caption || '';
        img.loading = 'lazy';
        photoWrap.appendChild(img);

        if (data.photo.caption) {
          const cap = document.createElement('div');
          cap.className = 'back-photo-caption';
          cap.innerText = data.photo.caption;
          photoWrap.appendChild(cap);
        }
        back.appendChild(photoWrap);

      } else if (data.type === 'quote') {
        const quoteWrap = document.createElement('div');
        quoteWrap.className = 'back-quote';
        quoteWrap.innerHTML = \`
          <div class="back-quote-mark">&ldquo;</div>
          <p class="back-quote-text">\${escHtml(CONFIG.finalMessage)}</p>
          <p class="back-quote-from">— \${escHtml(CONFIG.fromName)}</p>
        \`;
        back.appendChild(quoteWrap);
      }

      // Close strip at the bottom of back
      const closeBar = document.createElement('div');
      closeBar.className = 'back-close';
      closeBar.innerText = 'Close';
      closeBar.addEventListener('click', (e) => {
        e.stopPropagation();
        owc.classList.remove('opened');
      });
      back.appendChild(closeBar);

      // ── Assemble ──
      const inner = document.createElement('div');
      inner.className = 'owc-inner';
      inner.appendChild(front);
      inner.appendChild(back);
      owc.appendChild(inner);

      // Flip on card click
      owc.addEventListener('click', () => {
        const opening = !owc.classList.contains('opened');
        owc.classList.toggle('opened');
        if (opening && data.type === 'letter' && !letterTyped) {
          // Delay typewriter until card fully flipped
          letterTyped = true;
          setTimeout(() => startTypewriter(), 400);
        }
        if (opening) startBgm();
      });

      return owc;
    }

    /* ── Typewriter for letter card ── */
    let letterTyped = false;
    function startTypewriter() {
      const el = $('letter-body-el');
      if (!el) return;
      const text = CONFIG.letterBody;
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      el.appendChild(cursor);
      function tick() {
        const limit = text.length > 1000 ? 500 : text.length;
        if (i < limit) {
          cursor.before(document.createTextNode(text[i++]));
          setTimeout(tick, 22);
        } else if (text.length > 1000) {
          const remaining = text.substring(i);
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
      tick();
    }

    /* ── Staggered card entrance ── */
    function mountCards() {
      const grid = $('cards-grid');
      const cards = buildCardData();
      cards.forEach((data, i) => {
        const el = renderCard(data, i);
        grid.appendChild(el);
        setTimeout(() => el.classList.add('visible'), 120 + i * 90);
      });
    }

    /* ── Audio ── */
    let isAudioPlaying = false;
    function getAudio() { return $('audio-el'); }
    function initAudioMeta() {
      const a = getAudio(); const t = $('mini-time');
      if (a && t) t.innerText = fmt(a.duration);
    }
    function toggleAudio() {
      const a = getAudio(); if (!a) return;
      const icon = $('play-icon');
      if (isAudioPlaying) {
        a.pause(); icon.innerHTML = '&#9654;'; isAudioPlaying = false; startBgm();
      } else {
        pauseBgm(); a.play(); icon.innerHTML = '&#9646;&#9646;'; isAudioPlaying = true;
      }
    }
    function updateAudio() {
      const a = getAudio(); if (!a || !a.duration) return;
      $('audio-bar').style.width = (a.currentTime / a.duration * 100) + '%';
      $('mini-time').innerText = fmt(a.currentTime);
      if (a.ended) { $('play-icon').innerHTML = '&#9654;'; isAudioPlaying = false; startBgm(); }
    }
    function seekAudio(e) {
      const a = getAudio(); if (!a) return;
      const r = $('mini-track').getBoundingClientRect();
      if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    }
    function fmt(s) {
      if (!s || isNaN(s)) return '0:00';
      return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    /* ── BGM ── */
    let bgmEl = null, bgmOn = false, bgmMuted = false;
    function getBgm() { if (!bgmEl) bgmEl = $('bgm-audio'); return bgmEl; }
    function startBgm() {
      const b = getBgm();
      if (b && !bgmMuted && !isAudioPlaying) { b.play().catch(() => {}); bgmOn = true; }
    }
    function pauseBgm() {
      const b = getBgm();
      if (b && bgmOn) { b.pause(); bgmOn = false; }
    }
    function toggleBgm() {
      const b = getBgm(); if (!b) return;
      bgmMuted = !bgmMuted;
      $('bgm-icon').innerText = bgmMuted ? '♪̶' : '♪';
      bgmMuted ? b.pause() : (!isAudioPlaying && b.play().catch(() => {}));
      bgmOn = !bgmMuted;
    }

    /* ── Escape HTML ── */
    function escHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ── Secret code ── */
    function verifyCode() {
      const val = $('code-input').value.trim().toUpperCase();
      if (val === CONFIG.secretCode.toUpperCase()) {
        startBgm();
        revealMain();

        const gate = $('code-gate');
        const card = document.querySelector('.gate-card');
        const btn = $('code-btn');
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (btn) {
          const rect = btn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }

        // Dissolve card with smooth blur, fade and slight translation/scale
        if (card) {
          card.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.opacity = '0';
          card.style.filter = 'blur(12px)';
          card.style.transform = 'translateY(16px) scale(0.96)';
        }

        // Dissolve gate background: clip-path circular reveal starting from the button
        setTimeout(() => {
          gate.style.transition = 'clip-path 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 1.2s ease, backdrop-filter 1.2s ease';
          gate.style.backgroundColor = 'rgba(250, 246, 240, 0.2)';
          gate.style.backdropFilter = 'blur(0px)';
          gate.style.webkitBackdropFilter = 'blur(0px)';
          gate.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)';
        }, 100);

        setTimeout(() => {
          gate.remove();
        }, 1300);
      } else {
        const err = $('code-err');
        err.style.opacity = '1';
        $('code-input').style.borderColor = '#b03030';
        setTimeout(() => { err.style.opacity = '0'; $('code-input').style.borderColor = ''; }, 2200);
      }
    }

    function revealMain() {
      const main = $('main');
      main.classList.add('visible');
      setTimeout(() => $('ow-header').classList.add('visible'), 100);
      setTimeout(mountCards, 350);
    }

    /* ── Init ── */
    window.addEventListener('load', () => {
      setTimeout(initAudioMeta, 800);
      if (${!hasSecretCode}) {
        setTimeout(() => $('ow-header').classList.add('visible'), 200);
        setTimeout(mountCards, 450);
        setTimeout(startBgm, 600);
      }
    });
  </script>

</body>
</html>`;
}
