import { PublishedConfig } from "../../schemas/card-draft";

export function generateGraduationMemoryLaneHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Memory Lane";
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";

  // Dynamic Photo mapping (Limit: 5 photos)
  const photos = config.photos || [];
  const mainPhoto = photos.length > 0 ? photos[0] : null;

  let galleryPhotos: typeof config.photos = [];
  let psPhoto: typeof config.photos[0] | null = null;

  if (photos.length === 5) {
    galleryPhotos = photos.slice(1, 4); // photos[1], photos[2], photos[3]
    psPhoto = photos[4];
  } else if (photos.length === 4) {
    galleryPhotos = photos.slice(1, 3); // photos[1], photos[2]
    psPhoto = photos[3];
  } else if (photos.length === 3) {
    galleryPhotos = [photos[1]];
    psPhoto = photos[2];
  } else if (photos.length === 2) {
    galleryPhotos = [];
    psPhoto = photos[1];
  } else if (photos.length === 1) {
    galleryPhotos = [];
    psPhoto = null;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memory Lane – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* ══════════════════════════════════════
       GRADUATION MEMORY LANE - STYLING
       Core Theme & Setup
    ══════════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy:          #0F1C3F;
      --navy-light:    #1B2B4D;
      --gold:          #D4AF37;
      --gold-light:    #F4E5C2;
      --gold-bright:   #FFD700;
      --cream:         #FAF7F0;
      --white:         #FFFFFF;
      --text-dark:     #1A1A2E;
      --text-light:    #6B7785;
      --pink-bg:       #FDF0F2;
      --pink-border:   #F5D6DA;
      --pink-text:     #5C2830;
      --shadow-sm:     rgba(15, 28, 63, 0.06);
      --shadow-md:     rgba(15, 28, 63, 0.12);
      --shadow-lg:     rgba(15, 28, 63, 0.18);
      --font-serif:    'Cinzel', serif;
      --font-body:     'EB Garamond', serif;
      --font-sans:     'Montserrat', sans-serif;
      --font-script:   'Caveat', cursive;
    }

    html, body {
      min-height: 100%;
      width: 100%;
      font-family: var(--font-body);
      color: var(--text-dark);
      background:
        radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(253, 240, 242, 0.5) 0%, transparent 50%),
        linear-gradient(135deg, #FAF7F0 0%, #F5ECD4 50%, #EFE1C0 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Floating Sparkles */
    .sparkle {
      position: fixed;
      width: 6px;
      height: 6px;
      background: var(--gold-bright);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      box-shadow: 0 0 8px var(--gold-bright), 0 0 16px var(--gold-bright);
      animation: pulseSparkle 6s infinite;
      z-index: 1;
    }
    @keyframes pulseSparkle {
      0%, 100% { opacity: 0; transform: scale(0.5) translateY(0); }
      50% { opacity: 0.8; transform: scale(1.2) translateY(-20px); }
    }

    /* ─── Background Music Button ─── */
    #bgm-toggle-btn {
      position: fixed;
      top: 1.5rem; right: 1.5rem;
      width: 46px; height: 46px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px var(--shadow-md);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      color: var(--navy);
      z-index: 999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bgm-toggle-btn:hover {
      transform: scale(1.1);
      border-color: var(--gold-bright);
      box-shadow: 0 6px 16px var(--shadow-lg);
    }

    /* ─── Passcode Gate ─── */
    #gate-screen {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #FAF7F0 0%, #F5ECD4 100%);
      z-index: 1000;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    #gate-screen.hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.96);
    }

    .gate-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 3px solid var(--gold);
      border-radius: 24px;
      padding: 3rem 2rem 2.5rem;
      text-align: center;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 20px 50px var(--shadow-lg), 0 0 30px rgba(212, 175, 55, 0.15);
      position: relative;
    }
    .cap-icon {
      font-size: 3.5rem;
      display: block;
      margin-bottom: 1.25rem;
      filter: drop-shadow(0 6px 12px var(--shadow-md));
      animation: capFloat 3s ease-in-out infinite;
    }
    @keyframes capFloat {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    .gate-title {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.5rem;
    }
    .gate-subtitle {
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 2rem;
    }
    .gate-input {
      width: 100%;
      padding: 0.9rem 1.25rem;
      background: rgba(250, 247, 240, 0.8);
      border: 2px solid var(--gold);
      border-radius: 14px;
      color: var(--navy);
      font-family: var(--font-sans);
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-align: center;
      text-transform: uppercase;
      outline: none;
      transition: all 0.3s;
    }
    .gate-input:focus {
      border-color: var(--gold-bright);
      background: var(--white);
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15);
    }
    .gate-btn {
      width: 100%;
      margin-top: 1rem;
      padding: 0.95rem;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--white);
      background: linear-gradient(135deg, var(--navy), var(--navy-light));
      border: 2px solid var(--gold);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 6px 20px var(--shadow-md);
    }
    .gate-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px var(--shadow-lg);
    }
    .gate-error {
      font-size: 0.8rem;
      color: #E74C3C;
      margin-top: 0.75rem;
      height: 1.2rem;
      font-weight: 600;
    }

    /* ─── Scroll Container ─── */
    .scroll-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 3rem 1.25rem 5rem;
      display: flex;
      flex-direction: column;
      gap: 2.25rem;
      position: relative;
      z-index: 5;
    }

    /* ─── Header ─── */
    .main-header {
      text-align: center;
      margin-bottom: 0.5rem;
      animation: fadeInDown 1s ease-out;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .header-title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 6vw, 2.75rem);
      font-weight: 700;
      color: var(--navy);
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .header-subtitle {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--gold);
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    /* ─── Cards Common ─── */
    .card {
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid var(--gold-light);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 10px 30px var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      transition: all 0.4s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px var(--shadow-md);
    }

    .card-content {
      width: 100%;
      min-width: 0;
    }

    @media (min-width: 520px) {
      .card-row {
        flex-direction: row;
        align-items: stretch;
      }
      .card-row .card-content {
        flex: 1.2;
        min-width: 0;
      }
      .card-row .card-photo-side {
        flex: 0.9;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    /* Card 1: Main Card with Lined Paper Style */
    .card-main {
      border-color: var(--gold-light);
      background: #FFFDF5;
      background-image: linear-gradient(rgba(212, 175, 55, 0.07) 1px, transparent 1px);
      background-size: 100% 2.2rem;
      background-position: 0 1.5rem;
      position: relative;
      padding-left: 2.75rem;
    }
    .card-main:hover {
      border-color: var(--gold);
    }
    .card-main::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: 2.1rem;
      width: 1px;
      background: rgba(212, 175, 55, 0.3);
    }
    .letter-body {
      font-size: 1.05rem;
      line-height: 2.2rem;
      color: var(--text-dark);
      white-space: pre-line;
    }
    .signature {
      font-family: var(--font-script);
      font-size: 2.2rem;
      color: var(--navy);
      margin-top: 1.5rem;
      line-height: 1.2;
    }
    .photo-frame {
      width: 100%;
      height: 100%;
      min-height: 260px;
      max-height: 400px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(15, 28, 63, 0.1);
    }
    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: zoom-in;
    }

    /* ─── Gallery Grid ─── */
    .gallery-section {
      width: 100%;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      width: 100%;
    }
    .gallery-grid.single {
      grid-template-columns: 1fr;
      max-width: 320px;
      margin: 0 auto;
    }
    .gallery-grid.double {
      grid-template-columns: repeat(2, 1fr);
    }
    .gallery-item {
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 6px 18px var(--shadow-sm);
      position: relative;
      border: 1px solid var(--gold-light);
    }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: zoom-in;
      transition: transform 0.6s cubic-bezier(0.2, 1, 0.2, 1);
    }
    .gallery-item:hover img {
      transform: scale(1.1);
    }
    .caption-overlay {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 0.75rem 0.5rem 0.5rem;
      background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
      color: var(--white);
      font-size: 0.65rem;
      text-align: center;
      pointer-events: none;
    }

    /* Card 2: Audio Card */
    .card-audio {
      background: #FFFDF5;
      text-align: center;
      align-items: center;
    }
    .card-audio:hover {
      border-color: var(--gold);
    }
    .audio-heading {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--navy-light);
      margin-bottom: 0.5rem;
    }
    .audio-deck {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 440px;
      background: var(--white);
      border: 1.5px solid var(--gold-light);
      border-radius: 50px;
      padding: 0.5rem 1.25rem 0.5rem 0.5rem;
      box-shadow: inset 0 2px 4px rgba(15, 28, 63, 0.03);
      gap: 1rem;
    }
    .audio-play-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), #B59325);
      border: none;
      color: var(--white);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      transition: all 0.3s;
      flex-shrink: 0;
    }
    .audio-play-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
    .audio-play-btn:active {
      transform: scale(0.96);
    }

    /* Waveform visualizer */
    .audio-visualizer {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 30px;
      flex: 1;
      justify-content: center;
    }
    .audio-visualizer .bar {
      width: 3px;
      height: 15%;
      background: #D4AF3740;
      border-radius: 2px;
      transition: height 0.15s ease, background-color 0.3s;
    }
    .audio-visualizer.playing .bar {
      background: var(--gold);
      animation: bounceWave 0.8s ease-in-out infinite alternate;
    }
    @keyframes bounceWave {
      0% { height: 15%; }
      100% { height: 95%; }
    }
    /* Staggered delay for each bar */
    .audio-visualizer.playing .bar:nth-child(3n) { animation-delay: 0.15s; }
    .audio-visualizer.playing .bar:nth-child(3n+1) { animation-delay: 0.35s; }
    .audio-visualizer.playing .bar:nth-child(3n+2) { animation-delay: 0.55s; }

    .audio-time {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-light);
      min-width: 35px;
      text-align: right;
    }
    .audio-caption {
      font-size: 0.8rem;
      color: var(--text-light);
      font-style: italic;
    }

    /* Card 3: P.S. Card with Lined Pink Paper Style */
    .card-ps {
      background: var(--pink-bg);
      border-color: var(--pink-border);
      color: var(--pink-text);
      background-image: linear-gradient(rgba(210, 125, 140, 0.07) 1px, transparent 1px);
      background-size: 100% 2.2rem;
      background-position: 0 1.5rem;
      position: relative;
      padding-left: 2.75rem;
      box-shadow: 0 10px 30px rgba(210, 125, 140, 0.1);
    }
    .card-ps:hover {
      border-color: #E8A2AE;
      box-shadow: 0 16px 40px rgba(210, 125, 140, 0.18);
    }
    .card-ps::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: 2.1rem;
      width: 1px;
      background: rgba(210, 125, 140, 0.3);
    }
    .ps-heading {
      font-family: var(--font-serif);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--pink-text);
      margin-bottom: 0.5rem;
    }
    .ps-body {
      font-family: var(--font-script);
      font-size: 1.6rem;
      line-height: 2.2rem;
      color: var(--pink-text);
      white-space: pre-wrap;
      word-break: break-word;
    }
    .ps-signature {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 700;
      color: #D27D8C;
      letter-spacing: 0.05em;
      margin-top: 1rem;
    }
    .ps-photo-frame {
      width: 100%;
      height: 100%;
      min-height: 220px;
      max-height: 320px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(210, 125, 140, 0.15);
    }
    .ps-photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: zoom-in;
    }

    /* ─── Lightbox Modal Viewer ─── */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(15, 28, 63, 0.75); /* Softer, slightly transparent backdrop */
      backdrop-filter: blur(12px); /* Beautifully blurred backdrop */
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      padding: 1.5rem;
    }
    .lightbox.active {
      opacity: 1;
      pointer-events: auto;
    }
    .lightbox-content {
      position: relative;
      width: 100%;
      max-width: 440px; /* Cozy, elegant width to prevent screen flooding */
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      transform: scale(0.96) translateY(10px); /* Smooth entrance scaling and sliding */
      opacity: 0;
      transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
    }
    .lightbox.active .lightbox-content {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    .lightbox-content img {
      width: 100%;
      max-height: 55vh; /* Comfortable height proportion */
      border-radius: 16px;
      border: 4px solid var(--white);
      box-shadow: 0 12px 36px rgba(0,0,0,0.35);
      object-fit: contain;
    }
    .lightbox-caption {
      color: var(--white);
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 500;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0,0,0,0.6);
      padding: 0 1rem;
    }
    .lightbox-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      color: var(--white);
      font-size: 2.5rem;
      font-weight: 300;
      cursor: pointer;
      transition: transform 0.2s;
      z-index: 2001;
      user-select: none;
    }
    .lightbox-close:hover {
      transform: scale(1.1);
    }

    /* Footer Credits */
    .page-footer {
      text-align: center;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-light);
      opacity: 0.6;
      margin-top: 1rem;
    }
  </style>
</head>
<body>

  ${hasBgMusic ? `
  <button id="bgm-toggle-btn" onclick="toggleBgm()" title="Background Music">
    <span id="bgm-icon">🎵</span>
  </button>
  <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
  ` : ""}

  <!-- ── SECTION 1: PASSCODE GATE ── -->
  ${hasSecretCode ? `
  <div id="gate-screen">
    <div class="gate-card">
      <span class="cap-icon">🎓</span>
      <h2 class="gate-title">Unlock Note</h2>
      <p class="gate-subtitle">A message from <strong>${config.fromName}</strong> for <strong>${config.toName}</strong>.<br>Enter passcode to unlock.</p>
      <input
        type="text"
        id="gate-input-el"
        class="gate-input"
        placeholder="Passcode"
        maxlength="12"
        onkeydown="if(event.key==='Enter')verifyGateCode()"
      >
      <button class="gate-btn" onclick="verifyGateCode()">Unlock Memory</button>
      <div id="gate-error-el" class="gate-error"></div>
    </div>
  </div>
  ` : ""}

  <!-- ── SECTION 2: SCROLLABLE ALBUM CONTENT ── -->
  <div id="main-content" class="scroll-container" ${hasSecretCode ? 'style="display:none"' : ""}>
    <!-- Header -->
    <header class="main-header">
      <h1 class="header-title">${letterTitle}</h1>
      <p class="header-subtitle">A celebration for ${config.toName} 🎓</p>
    </header>

    <!-- Card 1: Main Letter -->
    <div class="card card-row card-main">
      <div class="card-content">
        <div class="letter-body">${config.letterBody}</div>
        <p class="signature">— ${config.fromName}</p>
      </div>
      ${mainPhoto ? `
      <div class="card-photo-side">
        <div class="photo-frame">
          <img src="${mainPhoto.src}" alt="Main Photo" onclick="openLightbox('${mainPhoto.src}', ${JSON.stringify(mainPhoto.caption || '').replace(/"/g, '&quot;')})">
        </div>
      </div>
      ` : ""}
    </div>

    <!-- Gallery Grid -->
    ${galleryPhotos.length > 0 ? `
    <div class="gallery-section">
      <div class="gallery-grid ${galleryPhotos.length === 1 ? 'single' : galleryPhotos.length === 2 ? 'double' : ''}">
        ${galleryPhotos.map((p, idx) => `
        <div class="gallery-item">
          <img src="${p.src}" alt="Gallery ${idx + 1}" onclick="openLightbox('${p.src}', ${JSON.stringify(p.caption || '').replace(/"/g, '&quot;')})">
          ${p.caption ? `<div class="caption-overlay">${p.caption}</div>` : ""}
        </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Card 2: Voice Note -->
    ${hasVoiceNote ? `
    <div class="card card-audio">
      <h3 class="audio-heading">A message for your ears 🎧</h3>
      <div class="audio-deck">
        <button id="audio-play-btn" class="audio-play-btn" onclick="toggleVoiceNote()">
          <span id="play-icon">▶</span>
        </button>
        <div class="audio-visualizer" id="waveform">
          ${Array(24).fill(0).map(() => `<div class="bar"></div>`).join("")}
        </div>
        <span class="audio-time" id="audio-time">0:00</span>
      </div>
      <audio id="voice-note-audio" src="${voiceNoteSrc}"></audio>
      <p class="audio-caption">(Tap play to listen to a message from ${config.fromName})</p>
    </div>
    ` : ""}

    <!-- Card 3: P.S. Notes -->
    ${config.finalMessage ? `
    <div class="card card-row card-ps">
      <div class="card-content">
        <h3 class="ps-heading">P.S.</h3>
        <p class="ps-body">${config.finalMessage}</p>
        <p class="ps-signature">From ${config.fromName} with love ❤️</p>
      </div>
      ${psPhoto ? `
      <div class="card-photo-side">
        <div class="ps-photo-frame">
          <img src="${psPhoto.src}" alt="P.S. Photo" onclick="openLightbox('${psPhoto.src}', ${JSON.stringify(psPhoto.caption || '').replace(/"/g, '&quot;')})">
        </div>
      </div>
      ` : ""}
    </div>
    ` : ""}

    <div class="page-footer">
      DearNote &nbsp;·&nbsp; Keepsake Journals
    </div>
  </div>

  <!-- Lightbox Modal Viewer -->
  <div id="lightbox-modal" class="lightbox" onclick="closeLightbox()">
    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
    <div class="lightbox-content" onclick="event.stopPropagation()">
      <img id="lightbox-img" src="" alt="Enlarged View">
      <p id="lightbox-caption" class="lightbox-caption"></p>
    </div>
  </div>

  <script>
    const CONFIG = {
      secretCode: ${JSON.stringify(config.secretCode || "")},
      hasVoiceNote: ${hasVoiceNote},
      hasBgMusic: ${hasBgMusic}
    };

    /* ─── Sparkle Generator ─── */
    function createSparkles() {
      const colors = ['#FFF', '#FFD700', '#FDF0F2'];
      for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.animationDelay = Math.random() * 5 + 's';
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(sparkle);
      }
    }
    window.addEventListener('load', createSparkles);

    /* ─── Lightbox Viewer ─── */
    function openLightbox(src, caption) {
      const lightbox = document.getElementById('lightbox-modal');
      const img = document.getElementById('lightbox-img');
      const cap = document.getElementById('lightbox-caption');
      img.src = src;
      img.onload = () => {
        cap.innerText = caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      };
    }
    function closeLightbox() {
      const lightbox = document.getElementById('lightbox-modal');
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    /* ─── Passcode Gate ─── */
    function verifyGateCode() {
      const input = document.getElementById('gate-input-el').value.trim().toUpperCase();
      const code = CONFIG.secretCode.toUpperCase();
      if (input === code) {
        document.getElementById('gate-screen').classList.add('hidden');
        const main = document.getElementById('main-content');
        main.style.display = 'flex';
        setTimeout(() => {
          document.getElementById('gate-screen').remove();
          startBgm();
        }, 600);
      } else {
        const err = document.getElementById('gate-error-el');
        err.innerText = "Incorrect passcode. Please try again.";
        document.getElementById('gate-input-el').style.borderColor = '#E74C3C';
        setTimeout(() => {
          err.innerText = "";
          document.getElementById('gate-input-el').style.borderColor = '';
        }, 3000);
      }
    }

    /* ─── Background Music (BGM) ─── */
    let bgmAudio = null;
    let bgmPlaying = false;

    window.addEventListener('load', () => {
      if (CONFIG.hasBgMusic) {
        bgmAudio = document.getElementById('bg-audio');
      }
      // If no passcode gate, auto-attempt play bgm (browsers may block until user interaction)
      if (!CONFIG.secretCode) {
        document.body.addEventListener('click', startBgm, { once: true });
        document.body.addEventListener('touchstart', startBgm, { once: true });
      }
    });

    function startBgm() {
      if (!bgmAudio) return;
      bgmAudio.play()
        .then(() => {
          bgmPlaying = true;
          document.getElementById('bgm-icon').innerText = '🎵';
        })
        .catch(err => {
          console.log("Autoplay blocked by browser. Music will start on user interaction.");
        });
    }

    function toggleBgm() {
      if (!bgmAudio) return;
      if (bgmPlaying) {
        bgmAudio.pause();
        bgmPlaying = false;
        document.getElementById('bgm-icon').innerText = '🔇';
      } else {
        bgmAudio.play();
        bgmPlaying = true;
        document.getElementById('bgm-icon').innerText = '🎵';
      }
    }

    /* ─── Voice Note Player ─── */
    let vnAudio = null;
    let vnPlaying = false;

    if (CONFIG.hasVoiceNote) {
      window.addEventListener('load', () => {
        vnAudio = document.getElementById('voice-note-audio');
        vnAudio.addEventListener('timeupdate', updateAudioProgress);
        vnAudio.addEventListener('ended', () => {
          vnPlaying = false;
          document.getElementById('play-icon').innerText = '▶';
          document.getElementById('waveform').classList.remove('playing');
        });
      });
    }

    function toggleVoiceNote() {
      if (!vnAudio) return;
      
      // Pause background music temporarily while listening to voice note
      if (bgmAudio && bgmPlaying) {
        bgmAudio.pause();
      }

      if (vnPlaying) {
        vnAudio.pause();
        vnPlaying = false;
        document.getElementById('play-icon').innerText = '▶';
        document.getElementById('waveform').classList.remove('playing');
        
        // Resume background music if it was playing
        if (bgmAudio && bgmPlaying) {
          bgmAudio.play();
        }
      } else {
        vnAudio.play();
        vnPlaying = true;
        document.getElementById('play-icon').innerText = '⏸';
        document.getElementById('waveform').classList.add('playing');
      }
    }

    function updateAudioProgress() {
      if (!vnAudio) return;
      const current = vnAudio.currentTime;
      const total = vnAudio.duration || 0;
      
      // Format time MM:SS
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      document.getElementById('audio-time').innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

      // Adjust heights dynamically slightly if playing (simulated visualizer)
      if (vnPlaying) {
        const bars = document.querySelectorAll('#waveform .bar');
        bars.forEach(bar => {
          // Add extra jitter to bar heights
          const baseHeight = 25 + Math.random() * 70;
          bar.style.height = baseHeight + '%';
        });
      }
    }
  </script>
</body>
</html>
`;
}
