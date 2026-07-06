import { PublishedConfig } from "../../schemas/card-draft";

export function generateGraduationNoteHtml(config: PublishedConfig): string {
  const hasSecretCode = !!config.secretCode;
  const letterTitle = config.letterTitle || "Congratulations Graduate!";
  const escapedLetterBody = JSON.stringify(config.letterBody);
  const photosJson = JSON.stringify(config.photos);
  const hasVoiceNote = !!config.voiceNote;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "";
  const hasPhotos = config.photos && config.photos.length > 0;
  const hasAudio = hasVoiceNote; // Audio chapter only if voice note exists

  const photosChapterHtml = hasPhotos
    ? `
  <div class="chapter" id="ch-photos">
    <div class="chapter-content-wrapper">
      <h2 class="ch-heading">Memory Lane</h2>
      <p class="ch-subheading">Your journey captured in moments</p>
      <div class="yearbook-grid" id="yearbook-grid"></div>
      <button class="action-btn-secondary" id="photos-next-btn">Continue Journey &rarr;</button>
    </div>
  </div>`
    : "";

  const audioChapterHtml = hasAudio
    ? `
  <div class="chapter" id="ch-audio">
    <div class="chapter-content-wrapper">
      ${hasVoiceNote ? `
      <h2 class="ch-heading">Voice of Pride</h2>
      <p class="ch-subheading">A message from the heart</p>
      ` : `
      <h2 class="ch-heading">Celebration Soundtrack</h2>
      <p class="ch-subheading">Music for your special moment</p>
      `}
      <div class="audio-deck">
        ${
          hasVoiceNote
            ? `
        <div class="audio-card">
          <div class="audio-icon">🎓</div>
          <div class="audio-info">
            <p class="audio-title">Voice Message</p>
            <p class="audio-subtitle">A personal congratulations</p>
          </div>
          <div class="audio-controls">
            <button id="vn-btn" class="play-btn">▶</button>
            <div class="progress-bar"><div class="progress-fill" id="vn-progress"></div></div>
            <span class="time-display" id="vn-time">0:00</span>
          </div>
          <audio id="vn-audio" src="${voiceNoteSrc}"></audio>
        </div>`
            : ""
        }
        ${
          hasBgMusic
            ? `
        <div class="audio-card">
          <div class="audio-icon">🎵</div>
          <div class="audio-info">
            <p class="audio-title">Background Music</p>
            <p class="audio-subtitle">Celebration soundtrack</p>
          </div>
          <div class="audio-controls">
            <button id="bgm-inner-btn" class="play-btn">⏸</button>
            <span class="music-label">Playing</span>
          </div>
          <audio id="bg-audio" src="${bgMusicSrc}" loop></audio>
        </div>`
            : ""
        }
      </div>
      <button class="action-btn-secondary" id="audio-next-btn">Final Words &rarr;</button>
    </div>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Graduation Celebration – DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&family=Alex+Brush&display=swap" rel="stylesheet">
  <style>
    /* ══════════════════════════════════════
       GRADUATION NOTE - PREMIUM DESIGN
       Core Theme & Reset
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
      --accent-blue:   #4A90E2;
      --success:       #27AE60;
      --shadow-sm:     rgba(15, 28, 63, 0.08);
      --shadow-md:     rgba(15, 28, 63, 0.15);
      --shadow-lg:     rgba(15, 28, 63, 0.25);
      --shadow-xl:     rgba(15, 28, 63, 0.35);
      --gold-glow:     rgba(212, 175, 55, 0.4);
      --font-serif:    'Cinzel', serif;
      --font-body:     'EB Garamond', serif;
      --font-sans:     'Montserrat', sans-serif;
      --font-script:   'Alex Brush', cursive;
    }

    html, body {
      height: 100%; width: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--text-dark);
      background:
        radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(74, 144, 226, 0.06) 0%, transparent 50%),
        linear-gradient(135deg, #FAF7F0 0%, #F4E5C2 50%, #E8DCC0 100%);
      -webkit-font-smoothing: antialiased;
    }

    /* ══════════════════════════════════════
       Progress & Navigation
    ══════════════════════════════════════ */
    #progress-tracker {
      position: fixed; top: 0; left: 0; right: 0;
      height: 4px; width: 0%;
      background: linear-gradient(90deg, var(--gold), var(--gold-bright), var(--accent-blue), var(--gold-bright), var(--gold));
      background-size: 300% auto;
      animation: shimmerProgress 3s linear infinite;
      z-index: 1000;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 20px var(--gold-glow), 0 4px 12px rgba(212, 175, 55, 0.2);
    }
    @keyframes shimmerProgress {
      to { background-position: 300% center; }
    }

    #confetti-canvas {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 500;
    }

    #music-fab {
      position: fixed; top: 1.5rem; right: 1.5rem; z-index: 999;
      width: 52px; height: 52px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 2px solid var(--gold);
      color: var(--navy); font-size: 1.25rem;
      cursor: pointer; display: none;
      align-items: center; justify-content: center;
      box-shadow: 0 8px 24px var(--shadow-md), 0 0 0 0 var(--gold-glow);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fabPulse 3s ease-in-out infinite;
    }
    @keyframes fabPulse {
      0%, 100% { box-shadow: 0 8px 24px var(--shadow-md), 0 0 0 0 var(--gold-glow); }
      50% { box-shadow: 0 8px 32px var(--shadow-lg), 0 0 20px var(--gold-glow); }
    }
    #music-fab.visible { display: flex; }
    #music-fab:hover {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 12px 32px var(--shadow-lg), 0 0 30px var(--gold-glow);
      border-color: var(--gold-bright);
    }

    .nav-indicator-dots {
      position: fixed; right: 1.5rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 14px; z-index: 100;
    }
    .nav-dot-item {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--gold);
      opacity: 0.25;
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .nav-dot-item::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      opacity: 0;
      transition: opacity 0.5s;
    }
    .nav-dot-item.active {
      opacity: 1;
      transform: scale(1.8);
      box-shadow: 0 0 16px var(--gold-glow), 0 4px 12px rgba(212, 175, 55, 0.3);
    }
    .nav-dot-item.active::before {
      opacity: 0.4;
    }
    .nav-dot-item:hover:not(.active) {
      opacity: 0.6;
      transform: scale(1.3);
    }

    /* ══════════════════════════════════════
       Chapter System
    ══════════════════════════════════════ */
    .chapter {
      position: fixed; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: flex-start;
      padding: 2rem; z-index: 10;
      opacity: 0; pointer-events: none;
      transition: opacity 0.6s ease, transform 0.6s ease;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .chapter.active { opacity: 1; pointer-events: auto; }

    /* Center content when it doesn't overflow */
    .chapter::before {
      content: '';
      flex: 1;
      min-height: 0;
    }
    .chapter::after {
      content: '';
      flex: 1;
      min-height: 0;
    }

    .ch-heading {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 6vw, 3rem);
      font-weight: 700;
      color: var(--navy);
      text-align: center;
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
    }
    .ch-subheading {
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-light);
      text-align: center;
      margin-bottom: 2.5rem;
    }

    /* Wrapper untuk center content */
    .chapter-content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    /* ══════════════════════════════════════
       Buttons
    ══════════════════════════════════════ */
    .action-btn-primary {
      padding: 1.1rem 3.5rem;
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--white);
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 50%, #2C4A7C 100%);
      border: 2.5px solid var(--gold);
      border-radius: 50px;
      cursor: pointer;
      box-shadow:
        0 12px 32px var(--shadow-md),
        0 0 20px var(--gold-glow),
        inset 0 2px 0 rgba(255,255,255,0.15);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .action-btn-primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      transition: left 0.6s;
    }
    .action-btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50px;
      background: linear-gradient(135deg, var(--gold-bright), var(--gold));
      opacity: 0;
      transition: opacity 0.4s;
      z-index: -1;
    }
    .action-btn-primary:hover::before { left: 100%; }
    .action-btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 18px 48px var(--shadow-lg),
        0 0 40px var(--gold-glow),
        inset 0 2px 0 rgba(255,255,255,0.2);
      border-color: var(--gold-bright);
    }
    .action-btn-primary:active {
      transform: translateY(-1px) scale(0.98);
    }

    .action-btn-secondary {
      padding: 1rem 2.8rem;
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--navy);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 2px solid var(--gold);
      border-radius: 50px;
      cursor: pointer;
      box-shadow:
        0 6px 20px var(--shadow-sm),
        inset 0 1px 0 rgba(255,255,255,0.8);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .action-btn-secondary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--gold-light), var(--gold));
      opacity: 0;
      transition: opacity 0.4s;
      border-radius: 50px;
    }
    .action-btn-secondary:hover::before {
      opacity: 0.15;
    }
    .action-btn-secondary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 10px 28px var(--shadow-md),
        0 0 20px rgba(212, 175, 55, 0.2),
        inset 0 1px 0 rgba(255,255,255,0.9);
      border-color: var(--gold-bright);
    }
    .action-btn-secondary:active { transform: translateY(-1px) scale(0.98); }

    /* ══════════════════════════════════════
       Passcode Gate
    ══════════════════════════════════════ */
    .gate-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 3px solid var(--gold);
      border-radius: 28px;
      padding: 3.5rem 3rem 3rem;
      text-align: center;
      width: 100%;
      max-width: 400px;
      box-shadow:
        0 25px 70px var(--shadow-lg),
        0 0 60px rgba(212, 175, 55, 0.15),
        inset 0 1px 0 rgba(255,255,255,0.9);
      animation: gatePopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }
    .gate-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 28px;
      padding: 2px;
      background: linear-gradient(135deg, var(--gold), var(--gold-bright), var(--gold));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      animation: borderShimmer 3s linear infinite;
    }
    @keyframes gatePopIn {
      from { opacity: 0; transform: scale(0.88) translateY(40px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes borderShimmer {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }

    .cap-icon {
      font-size: 4.5rem;
      display: block;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 8px 16px var(--shadow-md));
      animation: capFloat 3.5s ease-in-out infinite;
    }
    @keyframes capFloat {
      0%, 100% { transform: translateY(0) rotate(-3deg); }
      50% { transform: translateY(-15px) rotate(3deg); }
    }

    .gate-title {
      font-family: var(--font-serif);
      font-size: 2rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
      background: linear-gradient(135deg, var(--navy), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gate-subtitle {
      font-size: 0.95rem;
      color: var(--text-light);
      margin-bottom: 2.5rem;
      font-weight: 500;
    }

    .gate-input {
      width: 100%;
      padding: 1.1rem 1.5rem;
      background: rgba(250, 247, 240, 0.8);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 2.5px solid var(--gold);
      border-radius: 18px;
      color: var(--navy);
      font-family: var(--font-sans);
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-align: center;
      text-transform: uppercase;
      outline: none;
      transition: all 0.4s;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
    }
    .gate-input:focus {
      border-color: var(--gold-bright);
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.15), 0 8px 24px rgba(212, 175, 55, 0.2);
      transform: translateY(-2px);
    }

    .gate-btn {
      width: 100%;
      margin-top: 1.2rem;
      padding: 1.1rem;
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--white);
      background: linear-gradient(135deg, var(--navy), var(--navy-light), #2C4A7C);
      border: 2.5px solid var(--gold);
      border-radius: 18px;
      cursor: pointer;
      transition: all 0.4s;
      box-shadow:
        0 8px 24px var(--shadow-md),
        0 0 20px rgba(212, 175, 55, 0.2);
      position: relative;
      overflow: hidden;
    }
    .gate-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.6s;
    }
    .gate-btn:hover::before { left: 100%; }
    .gate-btn:hover {
      transform: translateY(-3px);
      box-shadow:
        0 12px 32px var(--shadow-lg),
        0 0 35px var(--gold-glow);
      border-color: var(--gold-bright);
    }
    .gate-error {
      font-size: 0.85rem;
      color: #E74C3C;
      height: 1.5rem;
      margin-top: 0.85rem;
      font-weight: 600;
    }

    /* ══════════════════════════════════════
       Intro - Diploma Scroll
    ══════════════════════════════════════ */
    .diploma-container {
      width: 340px;
      height: 220px;
      position: relative;
      margin-bottom: 3.5rem;
      perspective: 1400px;
    }

    .diploma-scroll {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(250, 247, 240, 0.98) 0%, rgba(244, 229, 194, 0.98) 100%);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 4px solid var(--gold);
      border-radius: 16px;
      box-shadow:
        0 20px 50px var(--shadow-lg),
        0 0 40px rgba(212, 175, 55, 0.2),
        inset 0 2px 0 rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      animation: diplomaFloat 4.5s ease-in-out infinite;
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .diploma-scroll:hover {
      transform: scale(1.08) rotateY(8deg) rotateX(-3deg);
      box-shadow:
        0 28px 70px var(--shadow-xl),
        0 0 60px var(--gold-glow),
        inset 0 2px 0 rgba(255,255,255,0.9);
    }

    @keyframes diplomaFloat {
      0%, 100% { transform: translateY(0) rotateX(2deg) rotateY(-2deg); }
      50% { transform: translateY(-18px) rotateX(-2deg) rotateY(2deg); }
    }

    .diploma-scroll::before,
    .diploma-scroll::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      background: radial-gradient(circle, var(--gold-bright), var(--gold));
      border-radius: 50%;
      box-shadow: 0 3px 10px var(--shadow-md), 0 0 15px rgba(212, 175, 55, 0.4);
    }
    .diploma-scroll::before { top: 22px; left: 22px; }
    .diploma-scroll::after { top: 22px; right: 22px; }

    .diploma-seal {
      font-size: 5.5rem;
      filter: drop-shadow(0 6px 16px var(--shadow-md)) drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
      animation: sealPulse 2.5s ease-in-out infinite;
    }
    @keyframes sealPulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.12) rotate(5deg); }
    }

    .intro-title {
      font-family: var(--font-serif);
      font-size: clamp(2.8rem, 8vw, 5rem);
      font-weight: 700;
      color: var(--navy);
      text-align: center;
      margin-bottom: 1.2rem;
      letter-spacing: 0.03em;
      background: linear-gradient(135deg, var(--navy), var(--accent-blue), var(--navy));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 20px rgba(15, 28, 63, 0.1);
      animation: titleShimmer 3s ease-in-out infinite;
    }
    @keyframes titleShimmer {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.15); }
    }

    .intro-subtitle {
      font-size: 1.15rem;
      color: var(--text-light);
      text-align: center;
      margin-bottom: 3rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* ══════════════════════════════════════
       Letter Card
    ══════════════════════════════════════ */
    .letter-card {
      width: 100%;
      max-width: 520px;
      max-height: 85vh;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 3px solid var(--gold);
      border-radius: 32px;
      box-shadow:
        0 25px 70px var(--shadow-xl),
        0 0 50px rgba(212, 175, 55, 0.15),
        inset 0 1px 0 rgba(255,255,255,0.9);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      animation: cardSlideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .letter-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 32px;
      padding: 2px;
      background: linear-gradient(135deg, var(--gold), var(--gold-bright), var(--gold));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      animation: cardBorderShimmer 4s linear infinite;
    }
    @keyframes cardSlideIn {
      from { opacity: 0; transform: scale(0.92) translateY(50px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes cardBorderShimmer {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.5; }
    }

    .card-header {
      padding: 2.5rem 2.5rem 2rem;
      background: linear-gradient(135deg, rgba(250, 247, 240, 0.9), rgba(244, 229, 194, 0.9));
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 2px solid var(--gold);
      text-align: center;
      position: relative;
    }
    .card-header::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold-bright), transparent);
      box-shadow: 0 0 15px var(--gold-glow);
    }

    .gold-accent-line {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--gold-bright), var(--gold), var(--gold-bright), transparent);
      margin: 0 auto 1.5rem;
      box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
    }

    .card-title {
      font-family: var(--font-serif);
      font-size: clamp(1.6rem, 5vw, 2.2rem);
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.75rem;
      letter-spacing: 0.02em;
      text-shadow: 0 2px 12px rgba(15, 28, 63, 0.08);
    }

    .card-subtitle {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-light);
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .card-body {
      flex: 1;
      overflow-y: auto;
      padding: 2.5rem 3rem;
      scrollbar-width: thin;
      scrollbar-color: var(--gold) transparent;
      position: relative;
    }
    .card-body::-webkit-scrollbar {
      width: 6px;
    }
    .card-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .card-body::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--gold), var(--gold-bright));
      border-radius: 10px;
    }

    .letter-text {
      font-size: 1.05rem;
      line-height: 2;
      color: var(--text-dark);
      white-space: pre-line;
      font-weight: 400;
      font-family: var(--font-body);
    }

    .type-caret {
      display: inline-block;
      width: 2px;
      height: 1.3em;
      background: var(--navy);
      margin-left: 3px;
      vertical-align: middle;
      animation: blinkCaret 0.85s steps(1) infinite;
      box-shadow: 0 0 4px var(--navy);
    }
    @keyframes blinkCaret {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .card-footer {
      padding: 2rem 3rem 4rem; /* Increased bottom padding to prevent next button from overlapping signature */
      border-top: 2px solid rgba(212, 175, 55, 0.2);
      text-align: center;
      background: linear-gradient(to top, rgba(250, 247, 240, 0.6), rgba(255,255,255,0.4));
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      position: relative;
    }
    .card-footer::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold-bright), transparent);
      box-shadow: 0 0 12px var(--gold-glow);
    }

    .signature-line {
      width: 120px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), var(--gold-bright), var(--gold), transparent);
      margin: 0 auto 1rem;
      box-shadow: 0 2px 6px rgba(212, 175, 55, 0.2);
    }

    .signature-label {
      font-size: 0.85rem;
      color: var(--text-light);
      margin-bottom: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .signature-name {
      font-family: var(--font-script);
      font-size: 2.8rem;
      color: var(--navy);
      line-height: 1;
      filter: drop-shadow(0 2px 8px rgba(15, 28, 63, 0.1));
    }

    .card-next-fab {
      position: absolute;
      bottom: 0.8rem; /* Moved lower to avoid overlapping signature text */
      right: 1.2rem; /* Adjusted right positioning */
      width: 48px; /* Slightly more compact size */
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--navy-light), var(--accent-blue));
      border: 2.5px solid var(--gold);
      color: var(--white);
      font-size: 1.4rem; /* Adjusted arrow font size slightly */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 8px 24px var(--shadow-md),
        0 0 20px rgba(212, 175, 55, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
    }
    .card-next-fab:hover {
      transform: scale(1.15) rotate(5deg);
      box-shadow:
        0 12px 32px var(--shadow-lg),
        0 0 35px var(--gold-glow);
      border-color: var(--gold-bright);
    }
    .card-next-fab:active { transform: scale(0.95) rotate(0deg); }

    /* ══════════════════════════════════════
       Photos - Yearbook Grid
    ══════════════════════════════════════ */
    .yearbook-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
      width: 100%;
      max-width: 750px;
      margin-bottom: 3rem;
      padding: 1.5rem;
    }

    .yearbook-photo {
      position: relative;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 3px solid var(--gold);
      border-radius: 20px;
      padding: 14px;
      box-shadow:
        0 12px 32px var(--shadow-sm),
        0 0 20px rgba(212, 175, 55, 0.1);
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      animation: photoFadeIn 0.8s ease backwards;
    }
    .yearbook-photo::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 20px;
      padding: 2px;
      background: linear-gradient(135deg, var(--gold), var(--gold-bright), var(--gold));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .yearbook-photo:hover::before {
      opacity: 0.6;
    }
    .yearbook-photo:hover {
      transform: translateY(-12px) rotate(3deg) scale(1.03);
      box-shadow:
        0 20px 50px var(--shadow-md),
        0 0 40px var(--gold-glow);
      border-color: var(--gold-bright);
    }

    @keyframes photoFadeIn {
      from { opacity: 0; transform: scale(0.88) translateY(30px); }
      to { opacity: 1; transform: none; }
    }

    .yearbook-photo img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 12px;
      display: block;
      box-shadow: 0 4px 12px rgba(15, 28, 63, 0.08);
    }

    .yearbook-caption {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--navy);
      text-align: center;
      margin-top: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.02em;
    }

    /* ══════════════════════════════════════
       Photo Modal
    ══════════════════════════════════════ */
    .photo-modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 28, 63, 0.95);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 2rem;
      cursor: pointer;
      animation: modalFadeIn 0.3s ease;
    }
    .photo-modal.active {
      display: flex;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      cursor: default;
      animation: modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes modalZoomIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-image-wrapper {
      position: relative;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 4px solid var(--gold);
      border-radius: 24px;
      padding: 20px;
      box-shadow:
        0 30px 80px var(--shadow-xl),
        0 0 60px var(--gold-glow);
      max-width: 100%;
      max-height: calc(90vh - 100px);
      overflow: hidden;
    }

    .modal-image {
      display: block;
      max-width: 100%;
      max-height: calc(90vh - 140px);
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 16px;
    }

    .modal-caption {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--white);
      text-align: center;
      max-width: 600px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
      letter-spacing: 0.02em;
    }

    .modal-close-btn {
      position: fixed;
      top: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 2px solid var(--gold);
      color: var(--navy);
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px var(--shadow-md);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2001;
    }
    .modal-close-btn:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: 0 12px 32px var(--shadow-lg);
      border-color: var(--gold-bright);
    }

    /* ══════════════════════════════════════
       Audio Deck
    ══════════════════════════════════════ */
    .audio-deck {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .audio-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 2.5px solid var(--gold);
      border-radius: 24px;
      padding: 2.25rem;
      box-shadow:
        0 12px 32px var(--shadow-sm),
        0 0 30px rgba(212, 175, 55, 0.08);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .audio-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
      opacity: 0;
      transition: opacity 0.4s;
    }
    .audio-card:hover::before {
      opacity: 1;
    }
    .audio-card:hover {
      box-shadow:
        0 18px 48px var(--shadow-md),
        0 0 45px rgba(212, 175, 55, 0.15);
      transform: translateY(-6px);
      border-color: var(--gold-bright);
    }

    .audio-icon {
      font-size: 2.8rem;
      text-align: center;
      filter: drop-shadow(0 4px 12px var(--shadow-sm));
      animation: iconFloat 3s ease-in-out infinite;
    }
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .audio-info {
      text-align: center;
    }

    .audio-title {
      font-family: var(--font-serif);
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.4rem;
      letter-spacing: 0.02em;
    }

    .audio-subtitle {
      font-size: 0.9rem;
      color: var(--text-light);
      font-weight: 500;
    }

    .audio-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
    }

    .play-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--navy-light), var(--accent-blue));
      border: 2.5px solid var(--gold);
      color: var(--white);
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 6px 18px var(--shadow-sm),
        0 0 20px rgba(212, 175, 55, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .play-btn:hover {
      transform: scale(1.15);
      box-shadow:
        0 8px 24px var(--shadow-md),
        0 0 30px var(--gold-glow);
      border-color: var(--gold-bright);
    }
    .play-btn:active { transform: scale(0.95); }

    .progress-bar {
      flex: 1;
      height: 7px;
      background: rgba(212, 175, 55, 0.15);
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(15, 28, 63, 0.05);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--gold), var(--gold-bright), var(--accent-blue));
      border-radius: 10px;
      width: 0%;
      transition: width 0.1s linear;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
    }

    .time-display {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-light);
      min-width: 48px;
      text-align: right;
      letter-spacing: 0.05em;
    }

    .music-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-light);
      font-style: italic;
      letter-spacing: 0.03em;
    }

    /* ══════════════════════════════════════
       Finale Card
    ══════════════════════════════════════ */
    .finale-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 4px solid var(--gold);
      border-radius: 36px;
      padding: 3.5rem 3rem;
      text-align: center;
      width: 100%;
      max-width: 550px;
      box-shadow:
        0 30px 80px var(--shadow-xl),
        0 0 60px rgba(212, 175, 55, 0.2),
        inset 0 2px 0 rgba(255,255,255,0.9);
      position: relative;
      z-index: 100;
      animation: finaleEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .finale-card::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 36px;
      padding: 3px;
      background: linear-gradient(135deg, var(--gold), var(--gold-bright), var(--accent-blue), var(--gold-bright), var(--gold));
      background-size: 200% 200%;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.5;
      animation: finaleBorderFlow 4s ease-in-out infinite;
    }
    @keyframes finaleEntrance {
      from { opacity: 0; transform: scale(0.88) translateY(60px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes finaleBorderFlow {
      0%, 100% { background-position: 0% 50%; opacity: 0.3; }
      50% { background-position: 100% 50%; opacity: 0.6; }
    }

    .trophy-icon {
      font-size: 5.5rem;
      margin-bottom: 2rem;
      display: block;
      filter: drop-shadow(0 8px 20px var(--shadow-md)) drop-shadow(0 0 30px var(--gold-glow));
      animation: trophyBounce 2.5s ease-in-out infinite;
    }
    @keyframes trophyBounce {
      0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
      50% { transform: translateY(-18px) scale(1.08) rotate(5deg); }
    }

    .finale-quote {
      font-family: var(--font-serif);
      font-size: clamp(1.5rem, 5vw, 2.1rem);
      font-weight: 700;
      font-style: italic;
      color: var(--navy);
      line-height: 1.7;
      margin-bottom: 2.5rem;
      letter-spacing: 0.01em;
      text-shadow: 0 2px 15px rgba(15, 28, 63, 0.08);
      background: linear-gradient(135deg, var(--navy), var(--accent-blue), var(--navy));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: quoteShimmer 4s ease-in-out infinite;
    }
    @keyframes quoteShimmer {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    .finale-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .divider-line {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold-bright), var(--gold), var(--gold-bright), transparent);
      max-width: 100px;
      box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
      position: relative;
    }
    .divider-line::after {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(90deg, transparent, var(--gold-glow), transparent);
      opacity: 0.5;
      animation: lineGlow 2s ease-in-out infinite;
    }
    @keyframes lineGlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }

    .finale-sender {
      font-family: var(--font-sans);
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--navy);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--navy), var(--gold), var(--navy));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 8px rgba(15, 28, 63, 0.1);
    }

    .finale-hint {
      font-size: 1rem;
      color: var(--text-light);
      font-weight: 600;
      font-style: italic;
      letter-spacing: 0.02em;
      animation: pulseHint 2.5s ease-in-out infinite;
      text-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    @keyframes pulseHint {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
  </style>
</head>
<body>
  <div id="progress-tracker"></div>
  <canvas id="confetti-canvas"></canvas>
  <button id="music-fab" title="Toggle Music">🎵</button>
  <div class="nav-indicator-dots" id="nav-dots"></div>

  <!-- Photo Modal -->
  <div class="photo-modal" id="photo-modal">
    <button class="modal-close-btn" id="modal-close-btn">&times;</button>
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-image-wrapper">
        <img class="modal-image" id="modal-image" src="" alt="Full size photo">
      </div>
      <p class="modal-caption" id="modal-caption"></p>
    </div>
  </div>

  PLACEHOLDER_BODY

  <script>
    const HAS_SECRET  = ${hasSecretCode};
    const SECRET_CODE = ${JSON.stringify(config.secretCode || "")};
    const LETTER_BODY = ${escapedLetterBody};
    const PHOTOS      = ${photosJson};
    const HAS_AUDIO   = ${hasAudio};
    const HAS_VN      = ${hasVoiceNote};
    const HAS_BGM     = ${hasBgMusic};

    // ══════════════════════════════════════
    // Chapter System
    // ══════════════════════════════════════
    const CHAPTERS = [];
    if (HAS_SECRET) CHAPTERS.push('ch-passcode');
    CHAPTERS.push('ch-intro');
    CHAPTERS.push('ch-letter');
    if (PHOTOS && PHOTOS.length > 0) CHAPTERS.push('ch-photos');
    if (HAS_AUDIO) CHAPTERS.push('ch-audio');
    CHAPTERS.push('ch-finale');

    let activeIdx = 0;
    let letterTyped = false;
    let photosRendered = false;

    // ══════════════════════════════════════
    // Web Audio Context
    // ══════════════════════════════════════
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

    function playSuccessChime() {
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
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.41);
          }, i * 100);
        });
      } catch (e) {}
    }

    function playClickSound() {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } catch (e) {}
    }

    // ══════════════════════════════════════
    // Navigation & Progress
    // ══════════════════════════════════════
    const navDotsContainer = document.getElementById('nav-dots');
    const PROGRESS_CHAPTERS = CHAPTERS.filter(ch => ch !== 'ch-passcode');
    PROGRESS_CHAPTERS.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot-item';
      navDotsContainer.appendChild(dot);
    });

    function updateProgress() {
      const dots = navDotsContainer.querySelectorAll('.nav-dot-item');
      const vIdx = PROGRESS_CHAPTERS.indexOf(CHAPTERS[activeIdx]);
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === vIdx));

      const percent = CHAPTERS.length > 1 ? (activeIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-tracker').style.width = percent + '%';
    }

    function transitionToChapter(targetIdx) {
      if (targetIdx === activeIdx || targetIdx < 0 || targetIdx >= CHAPTERS.length) return;
      const fromEl = document.getElementById(CHAPTERS[activeIdx]);
      const toEl = document.getElementById(CHAPTERS[targetIdx]);
      if (!fromEl || !toEl) return;

      const dir = targetIdx > activeIdx ? 1 : -1;
      fromEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      fromEl.style.opacity = '0';
      fromEl.style.transform = \`translateY(\${-dir * 40}px)\`;
      fromEl.style.pointerEvents = 'none';

      setTimeout(() => {
        fromEl.classList.remove('active');
        fromEl.style.cssText = '';

        toEl.style.opacity = '0';
        toEl.style.transform = \`translateY(\${dir * 40}px)\`;
        toEl.classList.add('active');

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            toEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            toEl.style.opacity = '1';
            toEl.style.transform = '';
          });
        });

        setTimeout(() => { toEl.style.cssText = ''; }, 600);
        activeIdx = targetIdx;
        updateProgress();
        onChapterActive(CHAPTERS[targetIdx]);
      }, 350);
    }

    function advanceChapter() {
      playClickSound();
      transitionToChapter(activeIdx + 1);
    }

    function onChapterActive(chId) {
      getAudioContext();
      if (chId === 'ch-letter' && !letterTyped) startTypewriter();
      if (chId === 'ch-photos' && !photosRendered) renderPhotos();
      if (chId === 'ch-finale') startConfetti();
    }

    // ══════════════════════════════════════
    // Passcode Verification
    // ══════════════════════════════════════
    function verifyPasscode() {
      const input = document.getElementById('code-input');
      const errEl = document.getElementById('code-err');
      if (!input) return;

      const val = input.value.trim().toUpperCase();
      const exp = SECRET_CODE.trim().toUpperCase();
      if (!HAS_SECRET || val === exp) {
        playSuccessChime();
        transitionToChapter(CHAPTERS.indexOf('ch-intro'));
        setTimeout(autoPlayBgm, 500);
      } else {
        if (errEl) {
          errEl.textContent = 'Incorrect code, please try again';
          setTimeout(() => { errEl.textContent = ''; }, 2500);
        }
        input.value = '';
        input.style.borderColor = '#E74C3C';
        setTimeout(() => { input.style.borderColor = ''; }, 2500);
      }
    }

    const codeBtn = document.getElementById('code-submit');
    if (codeBtn) codeBtn.addEventListener('click', verifyPasscode);
    const codeInput = document.getElementById('code-input');
    if (codeInput) codeInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') verifyPasscode();
    });

    // ══════════════════════════════════════
    // Button Wirings
    // ══════════════════════════════════════
    const introNext = document.getElementById('intro-next-btn');
    const letterNext = document.getElementById('letter-next-btn');
    const photosNext = document.getElementById('photos-next-btn');
    const audioNext = document.getElementById('audio-next-btn');

    if (introNext) introNext.addEventListener('click', advanceChapter);
    if (letterNext) letterNext.addEventListener('click', advanceChapter);
    if (photosNext) photosNext.addEventListener('click', advanceChapter);
    if (audioNext) audioNext.addEventListener('click', advanceChapter);

    // ══════════════════════════════════════
    // Letter Typewriter
    // ══════════════════════════════════════
    function startTypewriter() {
      letterTyped = true;
      const el = document.getElementById('letter-content');
      const text = LETTER_BODY;
      el.innerHTML = '';
      let i = 0;

      const caret = document.createElement('span');
      caret.className = 'type-caret';
      el.appendChild(caret);

      const speed = text.length > 700 ? 12 : text.length > 350 ? 18 : 25;
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
        const wrap = el.closest('.card-body');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      }, speed);
    }

    // ══════════════════════════════════════
    // Photo Gallery & Modal
    // ══════════════════════════════════════
    function renderPhotos() {
      photosRendered = true;
      const grid = document.getElementById('yearbook-grid');
      if (!grid) return;
      if (!PHOTOS || PHOTOS.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-light);text-align:center;grid-column:1/-1;">No photos available</p>';
        return;
      }

      PHOTOS.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'yearbook-photo';
        card.style.animationDelay = \`\${idx * 0.1}s\`;
        card.innerHTML = \`
          <img src="\${photo.src}" alt="Memory \${idx + 1}" loading="lazy">
          \${photo.caption ? \`<p class="yearbook-caption">\${photo.caption}</p>\` : '<p class="yearbook-caption">🎓</p>'}
        \`;

        // Add click handler to open modal
        card.addEventListener('click', () => {
          openPhotoModal(photo.src, photo.caption || '🎓');
        });

        grid.appendChild(card);
      });
    }

    function openPhotoModal(src, caption) {
      const modal = document.getElementById('photo-modal');
      const modalImage = document.getElementById('modal-image');
      const modalCaption = document.getElementById('modal-caption');

      if (modal && modalImage && modalCaption) {
        modalImage.src = src;
        modalCaption.textContent = caption;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closePhotoModal() {
      const modal = document.getElementById('photo-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Modal event listeners
    const photoModal = document.getElementById('photo-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (photoModal) {
      // Close on overlay click
      photoModal.addEventListener('click', closePhotoModal);
    }

    if (modalCloseBtn) {
      // Close on close button click
      modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePhotoModal();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePhotoModal();
      }
    });

    // ══════════════════════════════════════
    // Audio Controls
    // ══════════════════════════════════════
    const bgAudio = document.getElementById('bg-audio');
    const bgmFab = document.getElementById('music-fab');
    const bgmInnerBtn = document.getElementById('bgm-inner-btn');
    const vnAudio = document.getElementById('vn-audio');
    const vnBtn = document.getElementById('vn-btn');
    const vnProgress = document.getElementById('vn-progress');
    const vnTime = document.getElementById('vn-time');

    function autoPlayBgm() {
      if (!bgAudio) return;
      bgAudio.play().then(() => {
        if (bgmFab) { bgmFab.classList.add('visible'); bgmFab.textContent = '🎵'; }
        if (bgmInnerBtn) bgmInnerBtn.textContent = '⏸';
      }).catch(() => {});
    }

    function toggleBgm() {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        bgAudio.play();
        if (bgmFab) bgmFab.textContent = '🎵';
        if (bgmInnerBtn) bgmInnerBtn.textContent = '⏸';
      } else {
        bgAudio.pause();
        if (bgmFab) bgmFab.textContent = '🔇';
        if (bgmInnerBtn) bgmInnerBtn.textContent = '▶';
      }
    }

    if (bgmFab) bgmFab.addEventListener('click', toggleBgm);
    if (bgmInnerBtn) bgmInnerBtn.addEventListener('click', toggleBgm);

    if (vnBtn && vnAudio) {
      vnBtn.addEventListener('click', () => {
        if (vnAudio.paused) {
          if (bgAudio && !bgAudio.paused) bgAudio.pause();
          vnAudio.play();
          vnBtn.textContent = '⏸';
        } else {
          vnAudio.pause();
          vnBtn.textContent = '▶';
        }
      });

      vnAudio.addEventListener('timeupdate', () => {
        if (vnProgress) {
          const pct = (vnAudio.currentTime / (vnAudio.duration || 1)) * 100;
          vnProgress.style.width = pct + '%';
        }
        if (vnTime) {
          const mins = Math.floor(vnAudio.currentTime / 60);
          const secs = Math.floor(vnAudio.currentTime % 60);
          vnTime.textContent = \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
        }
      });

      vnAudio.addEventListener('ended', () => {
        vnBtn.textContent = '▶';
        if (vnProgress) vnProgress.style.width = '0%';
        if (vnTime) vnTime.textContent = '0:00';
        if (bgAudio && bgAudio.paused) bgAudio.play().catch(() => {});
      });
    }

    // ══════════════════════════════════════
    // Confetti System - Premium Gold Particles
    // ══════════════════════════════════════
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');

    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PREMIUM_COLORS = [
      { main: '#D4AF37', glow: 'rgba(212, 175, 55, 0.6)' },      // Gold
      { main: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)' },       // Bright Gold
      { main: '#F4E5C2', glow: 'rgba(244, 229, 194, 0.5)' },     // Cream Gold
      { main: '#4A90E2', glow: 'rgba(74, 144, 226, 0.5)' },      // Accent Blue
      { main: '#1B2B4D', glow: 'rgba(27, 43, 77, 0.5)' },        // Navy
    ];

    class PremiumConfetti {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8 + Math.random() * 12;
        this.speedY = -10 - Math.random() * 12;
        this.speedX = -6 + Math.random() * 12;
        this.gravity = 0.35;
        this.friction = 0.99;
        this.drift = (Math.random() - 0.5) * 0.15;
        const colorObj = PREMIUM_COLORS[Math.floor(Math.random() * PREMIUM_COLORS.length)];
        this.color = colorObj.main;
        this.glowColor = colorObj.glow;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.25;
        this.opacity = 1;
        this.shimmer = Math.random() * Math.PI * 2;
        this.shimmerSpeed = 0.08 + Math.random() * 0.08;
        this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
      }

      update() {
        this.speedY += this.gravity;
        this.speedX += this.drift;
        this.speedX *= this.friction;
        this.speedY *= 0.995;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
        this.shimmer += this.shimmerSpeed;

        // Bounce off bottom
        if (this.y > confettiCanvas.height - 60) {
          this.speedY *= -0.5;
          this.y = confettiCanvas.height - 60;
          this.rotSpeed *= 0.8;
        }

        // Fade out when settled
        if (this.y > confettiCanvas.height - 80 && Math.abs(this.speedY) < 0.5) {
          this.opacity -= 0.015;
        }
      }

      draw() {
        confettiCtx.save();
        confettiCtx.globalAlpha = this.opacity;
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);

        // Shimmer glow effect
        const shimmerIntensity = 0.6 + Math.sin(this.shimmer) * 0.4;
        confettiCtx.shadowBlur = 15 * shimmerIntensity;
        confettiCtx.shadowColor = this.glowColor;

        confettiCtx.fillStyle = this.color;

        if (this.shape === 'circle') {
          confettiCtx.beginPath();
          confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          confettiCtx.fill();
        } else {
          confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.6);
        }

        confettiCtx.restore();
      }
    }

    // Gold sparkle particles for ambient background
    class GoldSparkle {
      constructor() {
        this.reset();
        this.y = Math.random() * confettiCanvas.height; // Start scattered
      }

      reset() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = 2 + Math.random() * 3;
        this.speedY = 0.3 + Math.random() * 0.6;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.3 + Math.random() * 0.4;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.03 + Math.random() * 0.05;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.twinkle += this.twinkleSpeed;

        if (this.y > confettiCanvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        const twinkleOpacity = this.opacity * (0.5 + Math.sin(this.twinkle) * 0.5);
        confettiCtx.save();
        confettiCtx.globalAlpha = twinkleOpacity;
        confettiCtx.fillStyle = '#FFD700';
        confettiCtx.shadowBlur = 8;
        confettiCtx.shadowColor = 'rgba(255, 215, 0, 0.6)';

        confettiCtx.beginPath();
        confettiCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        confettiCtx.fill();

        confettiCtx.restore();
      }
    }

    let confettiParticles = [];
    let goldSparkles = Array.from({ length: 30 }, () => new GoldSparkle());
    let confettiActive = false;

    function createConfettiBurst(x, y, count) {
      playClickSound();
      for (let i = 0; i < count; i++) {
        confettiParticles.push(new PremiumConfetti(x, y));
      }
    }

    function startConfetti() {
      if (confettiActive) return;
      confettiActive = true;

      // Grand entrance burst
      createConfettiBurst(confettiCanvas.width / 2, confettiCanvas.height / 2, 80);

      // Additional cascading bursts
      setTimeout(() => createConfettiBurst(confettiCanvas.width * 0.25, confettiCanvas.height * 0.35, 50), 250);
      setTimeout(() => createConfettiBurst(confettiCanvas.width * 0.75, confettiCanvas.height * 0.35, 50), 500);
      setTimeout(() => createConfettiBurst(confettiCanvas.width * 0.5, confettiCanvas.height * 0.25, 40), 750);
    }

    function renderConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      // Draw ambient gold sparkles
      goldSparkles.forEach(s => {
        s.update();
        s.draw();
      });

      // Draw premium confetti
      confettiParticles = confettiParticles.filter(p => p.opacity > 0);
      confettiParticles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderConfetti);
    }

    // Click to add confetti on finale
    window.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      const activeChId = CHAPTERS[activeIdx];
      if (activeChId === 'ch-finale') {
        createConfettiBurst(e.clientX, e.clientY, 30);
      }
    });

    // ══════════════════════════════════════
    // Initialize
    // ══════════════════════════════════════
    updateProgress();
    renderConfetti();
    if (!HAS_SECRET) setTimeout(autoPlayBgm, 1000);
  </script>
</body>
</html>`.replace('PLACEHOLDER_BODY', `
  ${hasSecretCode ? `
  <div class="chapter active" id="ch-passcode">
    <div class="gate-card">
      <div class="cap-icon">🎓</div>
      <h2 class="gate-title">Exclusive Celebration</h2>
      <p class="gate-subtitle">Enter your special access code</p>
      <input id="code-input" class="gate-input" type="text" maxlength="12" placeholder="CODE" autocomplete="off">
      <button id="code-submit" class="gate-btn">Unlock Celebration</button>
      <p id="code-err" class="gate-error"></p>
    </div>
  </div>` : ``}

  <div class="chapter${!hasSecretCode ? ` active` : ``}" id="ch-intro">
    <div class="diploma-container" id="diploma-wrap">
      <div class="diploma-scroll" id="diploma-scroll">
        <div class="diploma-seal">🎓</div>
      </div>
    </div>
    <h1 class="intro-title">${config.toName}</h1>
    <p class="intro-subtitle">You did it! Congratulations on your graduation.</p>
    <button class="action-btn-primary" id="intro-next-btn">Open Your Message</button>
  </div>

  <div class="chapter" id="ch-letter">
    <div class="letter-card">
      <div class="card-header">
        <div class="gold-accent-line"></div>
        <h2 class="card-title">${letterTitle}</h2>
        <p class="card-subtitle">For ${config.toName}</p>
        <div class="gold-accent-line"></div>
      </div>
      <div class="card-body">
        <p id="letter-content" class="letter-text"></p>
      </div>
      <div class="card-footer">
        <div class="signature-line"></div>
        <p class="signature-label">With pride and joy,</p>
        <p class="signature-name">${config.fromName}</p>
      </div>
      <button class="card-next-fab" id="letter-next-btn">&rarr;</button>
    </div>
  </div>

  ${photosChapterHtml}
  ${audioChapterHtml}

  <div class="chapter" id="ch-finale">
    <div class="finale-card">
      <div class="trophy-icon">🏆</div>
      <p class="finale-quote">&ldquo;${config.finalMessage || "The tassel was worth the hassle. Your future is bright!"}&rdquo;</p>
      <div class="finale-divider">
        <div class="divider-line"></div>
        <span class="finale-sender">${config.fromName}</span>
        <div class="divider-line"></div>
      </div>
      <p class="finale-hint">Click anywhere to celebrate! 🎉</p>
    </div>
  </div>
`);
}
