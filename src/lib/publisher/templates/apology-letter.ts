import { PublishedConfig } from "../../schemas/card-draft";

export function generateApologyLetterHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "A Sincere Apology";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Letter for You - DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Caveat:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ivory: #F8F4EE;
      --parchment: #EDE5D8;
      --parchment-dark: #DDD0BB;
      --ink: #2C2416;
      --ink-muted: #6B5B4B;
      --ink-faint: #A89880;
      --blush: #C9A99A;
      --blush-soft: #E8D5CD;
      --sage: #8A9E8C;
      --sage-soft: #D4DFD5;
      --shadow: rgba(44, 36, 22, 0.12);
    }

    html, body {
      min-height: 100vh;
      background: var(--ivory);
      color: var(--ink);
    }

    body {
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Lora', Georgia, serif;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--parchment); }
    ::-webkit-scrollbar-thumb { background: var(--blush); border-radius: 3px; }

    /* ─── BGM button ─── */
    #bgm-toggle-btn {
      position: fixed;
      top: 1rem; right: 1rem;
      width: 2.5rem; height: 2.5rem;
      border-radius: 50%;
      border: 1px solid var(--parchment-dark);
      background: var(--ivory);
      box-shadow: 0 2px 8px var(--shadow);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.9rem;
      z-index: 999;
      transition: transform 0.2s;
    }
    #bgm-toggle-btn:hover { transform: scale(1.1); }

    /* ─── Secret code screen ─── */
    #code-section {
      width: min(420px, 92vw);
      background: var(--ivory);
      border: 1px solid var(--parchment-dark);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 8px 40px var(--shadow);
    }
    #code-section h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      font-weight: 300;
      letter-spacing: 0.02em;
      color: var(--ink);
      margin-bottom: 0.4rem;
    }
    #code-section p {
      font-size: 0.78rem;
      color: var(--ink-faint);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    #secret-code-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--parchment-dark);
      border-radius: 0.75rem;
      background: var(--parchment);
      font-family: 'Lora', serif;
      font-size: 0.9rem;
      color: var(--ink);
      text-align: center;
      letter-spacing: 0.15em;
      outline: none;
      transition: border-color 0.2s;
    }
    #secret-code-input:focus { border-color: var(--blush); }
    #unlock-btn {
      width: 100%;
      margin-top: 0.75rem;
      padding: 0.8rem;
      background: var(--ink);
      color: var(--ivory);
      border: none;
      border-radius: 0.75rem;
      font-family: 'Lora', serif;
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    #unlock-btn:hover { background: var(--ink-muted); }
    #unlock-btn:active { transform: scale(0.98); }
    #code-error {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #b04040;
      opacity: 0;
      transition: opacity 0.3s;
    }

    /* ─── Envelope scene ─── */
    #envelope-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      min-height: 100vh;
      width: 100%;
      padding: 2rem 1rem;
    }

    .scene-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink-faint);
    }

    /* Envelope container */
    .env-wrap {
      position: relative;
      width: min(340px, 88vw);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    /* envelope hover lift is purely decorative — no click needed */
    .env-wrap:hover .env-body { box-shadow: 0 16px 50px rgba(44,36,22,0.15); }

    /* Envelope body */
    .env-body {
      width: 100%;
      aspect-ratio: 1.6 / 1;
      background: var(--parchment);
      border-radius: 0.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 40px var(--shadow);
      transition: box-shadow 0.4s;
    }

    /* Envelope diagonal fold lines */
    .env-body::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(135deg, var(--parchment-dark) 0%, transparent 50%),
        linear-gradient(225deg, var(--parchment-dark) 0%, transparent 50%);
      opacity: 0.5;
    }

    /* Bottom triangle flap */
    .env-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 55%;
      background: var(--parchment);
      clip-path: polygon(0 100%, 50% 0%, 100% 100%);
      border-top: 1px solid var(--parchment-dark);
    }

    /* Top flap — this flips open */
    .env-flap {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 55%;
      transform-origin: top center;
      transform-style: preserve-3d;
      transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 5;
    }
    .env-flap-front {
      position: absolute;
      inset: 0;
      background: var(--parchment);
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      backface-visibility: hidden;
    }
    .env-flap-shadow {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, var(--shadow) 0%, transparent 100%);
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      opacity: 0;
      transition: opacity 0.4s;
    }
    /* Remove hover shadow on flap — fully automatic now */
    .env-flap.opened { transform: perspective(600px) rotateX(-180deg); }

    /* Wax seal */
    .wax-seal {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 56px; height: 56px;
      z-index: 10;
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
    }
    .wax-seal.cracked {
      transform: translate(-50%, -50%) scale(0) rotate(30deg);
      opacity: 0;
    }
    .seal-circle {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #A0756A, #6B3F38 70%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 12px rgba(107,63,56,0.4), inset 0 1px 2px rgba(255,255,255,0.15);
      position: relative;
    }
    .seal-circle::after {
      content: 'DN';
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      color: rgba(255,255,255,0.75);
    }
    /* Crack lines on wax */
    .seal-crack {
      position: absolute;
      top: 50%; left: 50%;
      width: 200%;
      height: 1px;
      background: rgba(255,255,255,0.25);
      transform-origin: left center;
    }

    /* Letter peeking out of envelope */
    .letter-peek {
      position: absolute;
      bottom: -2px; left: 10%; right: 10%;
      height: 60%;
      background: var(--ivory);
      border-radius: 0.25rem 0.25rem 0 0;
      box-shadow: 0 -2px 8px var(--shadow);
      transform: translateY(100%);
      transition: transform 1s cubic-bezier(0.34, 1.2, 0.64, 1);
      z-index: 3;
    }
    .letter-peek.visible { transform: translateY(0%); }
    .letter-peek::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px dashed var(--parchment-dark);
      border-radius: 0.1rem;
      opacity: 0.5;
    }

    /* Tap instruction */
    .tap-hint {
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-faint);
      text-align: center;
      transition: opacity 0.5s;
    }
    .tap-hint.fade { opacity: 0; }

    /* ─── Envelope exit: slides up and fades away ─── */
    @keyframes envExit {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-80px) scale(0.96); }
    }
    #envelope-scene.exiting {
      animation: envExit 0.85s cubic-bezier(0.4, 0, 0.6, 1) forwards;
      pointer-events: none;
    }

    /* ─── Letter section entrance: rises from below ─── */
    @keyframes letterEnter {
      from { opacity: 0; transform: translateY(48px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #letter-section.entering {
      animation: letterEnter 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* ─── Letter section ─── */
    #letter-section {
      display: none;
      opacity: 0;
      width: min(680px, 95vw);
      margin: 0 auto;
      padding: 2rem 1rem 4rem;
    }

    /* Paper card */
    .letter-paper {
      background: var(--ivory);
      border: 1px solid var(--parchment-dark);
      border-radius: 0.25rem;
      padding: 3rem 2.5rem;
      position: relative;
      box-shadow:
        0 2px 4px var(--shadow),
        0 12px 40px rgba(44,36,22,0.07);
      /* Lined paper effect */
      background-image: linear-gradient(
        rgba(44, 36, 22, 0.045) 1px, transparent 1px
      );
      background-size: 100% 2rem;
      background-position: 0 3.5rem;
    }

    /* Paper fold corner */
    .letter-paper::after {
      content: '';
      position: absolute;
      bottom: 0; right: 0;
      width: 0; height: 0;
      border-style: solid;
      border-width: 0 0 32px 32px;
      border-color: transparent transparent var(--parchment) transparent;
      filter: drop-shadow(-1px -1px 2px var(--shadow));
    }

    /* Red margin line */
    .letter-paper::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: 2.75rem;
      width: 1px;
      background: rgba(201, 169, 154, 0.4);
    }

    .letter-overline {
      font-size: 0.6rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink-faint);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .letter-overline::before, .letter-overline::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--parchment-dark);
    }

    .letter-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.8rem, 5vw, 2.5rem);
      font-weight: 300;
      font-style: italic;
      color: var(--ink);
      text-align: center;
      line-height: 1.25;
      margin-bottom: 0.5rem;
    }

    .letter-meta {
      text-align: center;
      font-size: 0.72rem;
      color: var(--ink-faint);
      letter-spacing: 0.12em;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--parchment-dark);
    }

    .letter-body {
      font-family: 'Caveat', cursive;
      font-size: clamp(1.15rem, 3vw, 1.35rem);
      line-height: 2rem;
      color: var(--ink);
      min-height: 120px;
      white-space: pre-wrap;
    }

    /* Typing cursor */
    .cursor-blink {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background: var(--blush);
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 0.9s step-end infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    /* Final message */
    #final-message {
      display: none;
      opacity: 0;
      transition: opacity 1s ease;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--parchment-dark);
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem;
      font-style: italic;
      color: var(--ink-muted);
      text-align: center;
      line-height: 1.6;
    }
    #final-message.visible { opacity: 1; }

    /* Signature area */
    .letter-signature {
      margin-top: 2rem;
      text-align: right;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-style: italic;
      color: var(--ink-muted);
      display: none;
      opacity: 0;
      transition: opacity 0.8s;
    }
    .letter-signature.visible { opacity: 1; }

    /* ─── Photo gallery ─── */
    #gallery-section {
      display: none;
      opacity: 0;
      transition: opacity 0.8s;
      margin-top: 2.5rem;
    }
    #gallery-section.visible { opacity: 1; }
    .gallery-label {
      font-size: 0.62rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink-faint);
      text-align: center;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .gallery-label::before, .gallery-label::after {
      content: ''; flex: 1; height: 1px; background: var(--parchment-dark);
    }

    /* Editorial photo grid — 2 columns, full-bleed, no polaroid border */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    /* Single photo gets centred and capped */
    .gallery-grid.single { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }

    .editorial-photo {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      aspect-ratio: 4 / 3;
      background: var(--parchment);
      box-shadow: 0 4px 18px rgba(44, 36, 22, 0.10);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.35s ease;
    }
    .editorial-photo:hover {
      transform: translateY(-4px) scale(1.012);
      box-shadow: 0 10px 32px rgba(44, 36, 22, 0.16);
    }
    /* Wide photo spans both columns */
    .editorial-photo.wide { grid-column: 1 / -1; aspect-ratio: 16 / 9; }

    .editorial-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .editorial-photo:hover img { transform: scale(1.04); }

    /* Caption gradient overlay at the bottom */
    .editorial-caption {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 1.25rem 0.85rem 0.65rem;
      background: linear-gradient(to top, rgba(44, 36, 22, 0.55), transparent);
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.78rem;
      font-style: italic;
      color: rgba(255, 250, 244, 0.92);
      letter-spacing: 0.02em;
      line-height: 1.3;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .editorial-photo:hover .editorial-caption,
    .editorial-photo.has-caption .editorial-caption {
      opacity: 1;
      transform: translateY(0);
    }

    /* ─── Voice note player ─── */
    #voice-section {
      display: none;
      opacity: 0;
      transition: opacity 0.8s;
      margin-top: 2rem;
    }
    #voice-section.visible { opacity: 1; }
    .voice-player {
      background: var(--parchment);
      border: 1px solid var(--parchment-dark);
      border-radius: 0.5rem;
      padding: 1.25rem 1.5rem;
      max-width: 420px;
      margin: 0 auto;
    }
    .voice-label {
      font-size: 0.62rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--ink-faint);
      text-align: center;
      margin-bottom: 1rem;
    }
    .voice-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    #play-btn {
      width: 2.5rem; height: 2.5rem;
      border-radius: 50%;
      background: var(--ink);
      border: none;
      color: var(--ivory);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      font-size: 0.75rem;
      transition: background 0.2s, transform 0.15s;
    }
    #play-btn:hover { background: var(--ink-muted); }
    #play-btn:active { transform: scale(0.93); }
    .progress-track {
      flex: 1;
      height: 3px;
      background: var(--parchment-dark);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }
    #audio-progress {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 0%;
      background: var(--blush);
      border-radius: 2px;
      transition: width 0.1s linear;
    }
    .time-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: var(--ink-faint);
      margin-top: 0.5rem;
    }

    /* ─── Footer ─── */
    .letter-footer {
      text-align: center;
      margin-top: 3rem;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--ink-faint);
      opacity: 0.5;
    }

    /* Fade out animation helper */
    .fade-out {
      opacity: 0 !important;
      transform: scale(0.97) !important;
      transition: opacity 0.6s ease, transform 0.6s ease !important;
    }

    /* Entrance animation for envelope scene */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #envelope-scene > * {
      animation: fadeUp 0.7s ease both;
    }
    #envelope-scene > *:nth-child(1) { animation-delay: 0.1s; }
    #envelope-scene > *:nth-child(2) { animation-delay: 0.25s; }
    #envelope-scene > *:nth-child(3) { animation-delay: 0.4s; }
    #envelope-scene > *:nth-child(4) { animation-delay: 0.55s; }

    @media (max-width: 480px) {
      .letter-paper { padding: 2rem 1.25rem; }
      .photo-card { width: 150px; }
      .photo-card img { height: 115px; }
    }
  </style>
</head>
<body>

  ${hasBgMusic ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" title="Background Music">
    <span id="bgm-icon">♪</span>
  </button>
  <audio id="bgm-audio" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- ── SECTION 1: SECRET CODE ── -->
  ${hasSecretCode ? `
  <div id="code-section">
    <p class="scene-label" style="margin-bottom:1rem">DearNote</p>
    <h2>A Letter for You</h2>
    <p>A message from <strong>${config.fromName}</strong> for <strong>${config.toName}</strong>.<br>Enter the code to open the letter.</p>
    <input
      type="text"
      id="secret-code-input"
      placeholder="Access code"
      maxlength="12"
      onkeydown="if(event.key==='Enter')verifyCode()"
    >
    <button id="unlock-btn" onclick="verifyCode()">Open Letter</button>
    <p id="code-error">Incorrect code. Please try again.</p>
  </div>
  ` : ""}

  <!-- ── SECTION 2: ENVELOPE ── -->
  <div id="envelope-scene" ${hasSecretCode ? 'style="display:none"' : ""}>

    <p class="scene-label">A letter for you</p>

    <div class="env-wrap">
      <div class="env-body">
        <!-- bottom triangle -->
        <div class="env-bottom"></div>
        <!-- top flap -->
        <div class="env-flap" id="env-flap">
          <div class="env-flap-front"></div>
          <div class="env-flap-shadow"></div>
        </div>
        <!-- Wax seal -->
        <div class="wax-seal" id="wax-seal">
          <div class="seal-circle">
            <div class="seal-crack" style="transform: rotate(20deg) translateX(-50%)"></div>
            <div class="seal-crack" style="transform: rotate(-35deg) translateX(-50%)"></div>
          </div>
        </div>
        <!-- Letter peeking out -->
        <div class="letter-peek" id="letter-peek"></div>
      </div>
    </div>

  </div>

  <!-- ── SECTION 3: LETTER CONTENT ── -->
  <div id="letter-section">

    <div class="letter-paper">
      <div class="letter-overline">${config.fromName} to ${config.toName}</div>

      <h1 class="letter-title">${letterTitle}</h1>
      <p class="letter-meta">
        ${config.toName} &nbsp;·&nbsp; from ${config.fromName}
      </p>

      <div class="letter-body" id="letter-body"></div>

      ${config.finalMessage ? `
      <div id="final-message">"${config.finalMessage}"</div>
      ` : ""}

      <div class="letter-signature" id="letter-sig">
        — ${config.fromName}
      </div>
    </div>

    <!-- Voice note -->
    ${hasVoiceNote ? `
    <div id="voice-section">
      <div class="voice-player">
        <p class="voice-label">Voice Message</p>
        <div class="voice-controls">
          <button id="play-btn" onclick="toggleAudio()">
            <span id="play-icon">▶</span>
          </button>
          <div style="flex:1">
            <div class="progress-track" id="progress-track" onclick="seekAudio(event)">
              <div id="audio-progress"></div>
            </div>
            <div class="time-row">
              <span id="current-time">0:00</span>
              <span id="duration">0:00</span>
            </div>
          </div>
        </div>
        <audio id="audio-element" src="${voiceNoteSrc}"
          ontimeupdate="updateProgress()" onloadedmetadata="initMeta()"></audio>
      </div>
    </div>
    ` : ""}

    <!-- Photo gallery -->
    ${`
    <div id="gallery-section">
      <div class="gallery-label">Attached Photos</div>
      <div class="gallery-grid" id="gallery-grid"></div>
    </div>
    `}

    <div class="letter-footer">DearNote &nbsp;·&nbsp; Keepsake Letters</div>

  </div>

  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      letterBody: ${escapedLetterBody},
      photos: ${photosJson},
      hasVoiceNote: ${hasVoiceNote},
    };

    /* ─── Helpers ─── */
    function $(id) { return document.getElementById(id); }

    /* ─── Secret Code ─── */
    function verifyCode() {
      const val = $('secret-code-input').value.trim().toUpperCase();
      const code = CONFIG.secretCode.toUpperCase();
      if (val === code) {
        $('code-section').classList.add('fade-out');
        setTimeout(() => {
          $('code-section').remove();
          showEnvelope();
          startBgm();
        }, 600);
      } else {
        const err = $('code-error');
        err.style.opacity = '1';
        $('secret-code-input').style.borderColor = '#b04040';
        setTimeout(() => { err.style.opacity = '0'; $('secret-code-input').style.borderColor = ''; }, 2200);
      }
    }

    function showEnvelope() {
      const scene = $('envelope-scene');
      scene.style.display = 'flex';
      scene.style.flexDirection = 'column';
      scene.style.alignItems = 'center';
      scene.style.justifyContent = 'center';
      scene.style.minHeight = '100vh';
      scene.style.gap = '2rem';
      scene.style.padding = '2rem 1rem';
      // After showing envelope, kick off automatic sequence
      setTimeout(() => autoOpenEnvelope(), 300);
    }

    /* ─── Auto-play envelope opening sequence ─── */
    //  t=0ms   : envelope scene fades in (CSS animation on children)
    //  t=400ms : wax seal cracks
    //  t=900ms : flap opens
    //  t=1600ms: letter peeks out of envelope
    //  t=2600ms: envelope slides up+out, letter paper rises in
    function autoOpenEnvelope() {
      startBgm();

      // Step 1 — crack wax seal
      setTimeout(() => {
        $('wax-seal').classList.add('cracked');
      }, 400);

      // Step 2 — open flap
      setTimeout(() => {
        $('env-flap').classList.add('opened');
      }, 900);

      // Step 3 — letter peeks out
      setTimeout(() => {
        $('letter-peek').classList.add('visible');
      }, 1600);

      // Step 4 — cinematic transition
      setTimeout(() => {
        const scene = $('envelope-scene');
        scene.classList.add('exiting'); // slide up + fade out

        // Show letter section underneath while envelope exits
        const section = $('letter-section');
        section.style.display = 'block';
        requestAnimationFrame(() => {
          section.classList.add('entering'); // rise from below
        });

        // Remove envelope from DOM after animation completes
        setTimeout(() => {
          scene.remove();
        }, 900);

        // Start typewriter slightly after letter appears
        setTimeout(() => {
          startTypewriter();
        }, 500);
      }, 2600);
    }

    /* ─── Letter reveal (called from autoOpenEnvelope) ─── */
    function revealLetter() {
      // Kept for any future use; auto-flow now uses entering animation
      const section = $('letter-section');
      section.style.display = 'block';
      section.classList.add('entering');
      setTimeout(() => startTypewriter(), 400);
    }

    /* ─── Typewriter ─── */
    function startTypewriter() {
      const el = $('letter-body');
      const text = CONFIG.letterBody;
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      el.appendChild(cursor);

      function tick() {
        if (i < text.length) {
          cursor.before(document.createTextNode(text[i]));
          i++;
          const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60;
          if (!atBottom) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          setTimeout(tick, 28);
        } else {
          cursor.remove();
          afterTypewriter();
        }
      }
      tick();
    }

    function afterTypewriter() {
      // Show signature
      const sig = $('letter-sig');
      sig.style.display = 'block';
      requestAnimationFrame(() => sig.classList.add('visible'));

      // Show final message
      const fm = $('final-message');
      if (fm) {
        fm.style.display = 'block';
        setTimeout(() => fm.classList.add('visible'), 400);
      }

      // Show gallery
      if (CONFIG.photos && CONFIG.photos.length > 0) {
        buildGallery();
        setTimeout(() => {
          const gs = $('gallery-section');
          gs.style.display = 'block';
          requestAnimationFrame(() => gs.classList.add('visible'));
        }, 800);
      }

      // Show voice note
      if (CONFIG.hasVoiceNote) {
        setTimeout(() => {
          const vs = $('voice-section');
          vs.style.display = 'block';
          requestAnimationFrame(() => vs.classList.add('visible'));
        }, 1200);
      }
    }

    /* ─── Gallery (editorial grid, no polaroid) ─── */
    function buildGallery() {
      const grid = $('gallery-grid');
      const photos = CONFIG.photos;

      // If only one photo, add single-column class
      if (photos.length === 1) grid.classList.add('single');

      photos.forEach((photo, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'editorial-photo';

        // Make the first photo wide (spans full width) if there are 3+ photos
        if (i === 0 && photos.length >= 3) wrap.classList.add('wide');

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption || '';
        img.loading = 'lazy';
        wrap.appendChild(img);

        if (photo.caption) {
          const cap = document.createElement('div');
          cap.className = 'editorial-caption';
          cap.innerText = photo.caption;
          wrap.appendChild(cap);
          // Always show caption (not just on hover) so it’s readable
          wrap.classList.add('has-caption');
        }

        grid.appendChild(wrap);
      });
    }

    /* ─── Audio ─── */
    let isPlaying = false;
    let audioEl = null;

    function getAudio() {
      if (!audioEl) audioEl = $('audio-element');
      return audioEl;
    }
    function initMeta() {
      const d = $('duration');
      if (d) d.innerText = fmt(getAudio().duration);
    }
    function toggleAudio() {
      const a = getAudio();
      const icon = $('play-icon');
      if (isPlaying) {
        a.pause(); icon.innerText = '▶'; isPlaying = false; startBgm();
      } else {
        pauseBgm(); a.play(); icon.innerText = '⏸'; isPlaying = true;
      }
    }
    function updateProgress() {
      const a = getAudio();
      if (!a.duration) return;
      $('audio-progress').style.width = (a.currentTime / a.duration * 100) + '%';
      $('current-time').innerText = fmt(a.currentTime);
      if (a.ended) {
        $('play-icon').innerText = '▶';
        $('audio-progress').style.width = '0%';
        $('current-time').innerText = '0:00';
        isPlaying = false; startBgm();
      }
    }
    function seekAudio(e) {
      const a = getAudio();
      const r = $('progress-track').getBoundingClientRect();
      if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    }
    function fmt(s) {
      if (isNaN(s)) return '0:00';
      return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    /* ─── BGM ─── */
    let bgmEl = null, bgmPlaying = false, bgmMuted = false;
    function getBgm() {
      if (!bgmEl) bgmEl = $('bgm-audio');
      return bgmEl;
    }
    function startBgm() {
      const b = getBgm();
      if (b && !bgmMuted && !isPlaying) { b.play().catch(() => {}); bgmPlaying = true; }
    }
    function pauseBgm() {
      const b = getBgm();
      if (b && bgmPlaying) { b.pause(); bgmPlaying = false; }
    }
    function toggleBgm() {
      const b = getBgm();
      if (!b) return;
      const icon = $('bgm-icon');
      if (bgmMuted) {
        bgmMuted = false;
        if (icon) icon.innerText = '♪';
        if (!isPlaying) { b.play().catch(() => {}); bgmPlaying = true; }
      } else {
        bgmMuted = true;
        if (icon) icon.innerText = '♪̶';
        b.pause(); bgmPlaying = false;
      }
    }

    /* Init */
    window.addEventListener('load', () => {
      setTimeout(initMeta, 800);
      // If no secret code gate, start envelope sequence automatically
      if (!${hasSecretCode}) autoOpenEnvelope();
    });

  </script>

</body>
</html>`;
}
