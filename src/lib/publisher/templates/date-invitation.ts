import { PublishedConfig } from "../../schemas/card-draft";

export function generateDateInvitationHtml(config: PublishedConfig): string {
  const isEn = config.lang === "en";
  const hasVoiceNote = !!config.voiceNote && !!config.voiceNote.src;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasSecretCode = !!config.secretCode;
  const inviteTitle = config.letterTitle || (isEn ? "Something special for you~ 💌" : "Ada yang spesial buat kamu~ 💌");
  const openingMessage = config.letterBody || (isEn ? "Heyy, I want to invite you to something very special. Please read this~" : "Heyy, aku mau ngajak kamu sesuatu yang spesial banget. Yuk baca dulu ya~");
  const closingMessage = config.finalMessage || (isEn ? "Can't wait to spend that day with you! 💕" : "Ga sabar nunggu hari itu bareng kamu! 💕");
  const photosJson = JSON.stringify(config.photos || []);

  // Parse favoriteMoments:
  // Dates: indices 0..4 (max 5)
  // Custom activities: indices 5..9 (max 5)
  const fm = config.favoriteMoments || [];
  
  // Date options
  const dateOptions = [fm[0], fm[1], fm[2], fm[3], fm[4]].filter(Boolean);
  if (dateOptions.length === 0) {
    dateOptions.push(
      isEn ? "Saturday, July 12 2025" : "Sabtu, 12 Juli 2025",
      isEn ? "Sunday, July 13 2025" : "Minggu, 13 Juli 2025"
    );
  }
  const dateOptionsJson = JSON.stringify(dateOptions);

  // Custom activities from creator
  const creatorCustomActivities = [fm[5], fm[6], fm[7], fm[8], fm[9]].filter(Boolean);
  const creatorCustomActivitiesJson = JSON.stringify(creatorCustomActivities);

  const ticketNumber = Math.floor(100000 + Math.random() * 900000).toString();
  const hasBgMusic = !!config.bgMusic;
  const bgMusicSrc = config.bgMusic?.src || "https://assets.mixkit.co/music/preview/mixkit-funny-story-2877.mp3";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.fromName} ngajak kencan ${config.toName} ~ DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Gochi+Hand&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Playfair Display"', 'Georgia', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            hand: ['"Gochi Hand"', 'cursive'],
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --rose: #f43f5e;
      --rose-light: #fce7f3;
      --rose-pale: #fff1f5;
      --blush: #fbcfe8;
    }

    * { box-sizing: border-box; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--rose-pale);
      min-height: 100vh;
      overflow: hidden;
      color: #3b1a24;
      touch-action: manipulation;
    }

    .bg-pattern {
      position: fixed;
      inset: 0;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(244,63,94,0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(251,207,232,0.15) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f43f5e' fill-opacity='0.03'%3E%3Cpath d='M30 28c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 20c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* Progress bar */
    #progress-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--rose), #fb7185);
      transition: width 0.4s ease;
      z-index: 100;
    }

    /* BGM button */
    #bgm-btn {
      position: fixed;
      top: 1rem; right: 1rem;
      width: 2.25rem; height: 2.25rem;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--blush);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      box-shadow: 0 2px 8px rgba(244,63,94,0.15);
      z-index: 90;
      cursor: pointer;
      transition: transform 0.2s;
    }
    #bgm-btn:hover { transform: scale(1.1); }

    /* Page chapters */
    .chapter {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: translateY(12px);
      pointer-events: none;
      visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      transition: all 0.45s cubic-bezier(0.34, 1.36, 0.64, 1);
      overflow-y: auto;
    }
    .chapter.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    /* Card container */
    .card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 40px rgba(244,63,94,0.12), 0 2px 8px rgba(0,0,0,0.04);
      border: 1.5px solid #fce7f3;
      width: 100%;
      max-width: 400px;
    }

    /* Rose CTA button */
    .btn-rose {
      background: linear-gradient(135deg, #f43f5e, #fb7185);
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      box-shadow: 0 4px 16px rgba(244,63,94,0.3);
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .btn-rose:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(244,63,94,0.4); }
    .btn-rose:active { transform: translateY(0); }

    .btn-ghost {
      color: #f43f5e;
      font-weight: 500;
      padding: 0.6rem 1rem;
      border-radius: 9999px;
      border: 1.5px solid var(--blush);
      background: transparent;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: all 0.2s;
    }
    .btn-ghost:hover { background: var(--rose-light); }

    /* Date option cards */
    .date-option {
      border: 2px solid #fce7f3;
      border-radius: 1rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
    .date-option:hover { border-color: #fda4af; background: #fff1f5; transform: translateY(-1px); }
    .date-option.selected {
      border-color: #f43f5e;
      background: linear-gradient(135deg, #fff1f5, #fce7f3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244,63,94,0.2);
    }
    .date-option .check-ring {
      width: 1.25rem; height: 1.25rem;
      border-radius: 50%;
      border: 2px solid #fda4af;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .date-option.selected .check-ring {
      background: #f43f5e;
      border-color: #f43f5e;
    }

    /* Activity cards */
    .activity-card {
      border: 2px solid #fce7f3;
      border-radius: 1rem;
      padding: 0.65rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      text-align: center;
      position: relative;
    }
    .activity-card:hover { border-color: #fda4af; transform: translateY(-2px); }
    .activity-card.selected {
      border-color: #f43f5e;
      background: linear-gradient(135deg, #fff1f5, #fce7f3);
      box-shadow: 0 4px 12px rgba(244,63,94,0.2);
    }
    .activity-card .selected-badge {
      position: absolute;
      top: -6px; right: -6px;
      width: 18px; height: 18px;
      background: #f43f5e;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
    }
    .activity-card.selected .selected-badge { display: flex; }

    /* Countdown boxes */
    .countdown-box {
      background: white;
      border: 2px solid var(--blush);
      border-radius: 1rem;
      padding: 0.6rem 0.4rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(244,63,94,0.1);
      min-width: 60px;
    }
    .countdown-num {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #f43f5e;
      line-height: 1;
    }
    .countdown-label {
      font-size: 0.55rem;
      font-weight: 600;
      color: #fda4af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 2px;
    }

    /* DearNote Date Ticket */
    .date-ticket {
      background: white;
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(244,63,94,0.2);
      position: relative;
      max-width: 380px;
      width: 100%;
    }
    .ticket-header {
      background: linear-gradient(135deg, #f43f5e 0%, #fb7185 60%, #fda4af 100%);
      padding: 1.25rem 1.25rem 1.75rem;
      color: white;
      position: relative;
    }
    .ticket-body {
      padding: 1.5rem 1.25rem 1.25rem;
      position: relative;
    }
    /* Perforated tear line */
    .ticket-perforation {
      height: 0;
      border-top: 2px dashed #fce7f3;
      margin: 0 -0.5rem;
      position: relative;
    }
    .ticket-perforation::before,
    .ticket-perforation::after {
      content: '';
      position: absolute;
      width: 20px; height: 20px;
      background: var(--rose-pale);
      border-radius: 50%;
      top: -10px;
    }
    .ticket-perforation::before { left: -10px; }
    .ticket-perforation::after { right: -10px; }

    .ticket-valid-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(255,255,255,0.25);
      border: 1.5px solid rgba(255,255,255,0.5);
      border-radius: 9999px;
      padding: 2px 10px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: white;
    }

    .confetti-pop {
      animation: confetti-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      opacity: 0;
    }
    @keyframes confetti-pop {
      0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    /* Nav dots */
    #nav-dots {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 80;
    }

    /* Floating hearts animation */
    .heart-float {
      position: fixed;
      font-size: 1rem;
      opacity: 0;
      pointer-events: none;
      animation: float-up 2.5s ease-out forwards;
      z-index: 200;
    }
    @keyframes float-up {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-120px) scale(0.5); }
    }

    /* Responsive scale for short viewports (iframe preview) */
    @media (max-height: 720px) {
      .chapter > .card, .chapter > .date-ticket { transform: scale(0.92); transform-origin: center center; }
    }
    @media (max-height: 620px) {
      .chapter > .card, .chapter > .date-ticket { transform: scale(0.82); }
    }
  </style>
</head>
<body class="relative min-h-screen">
  <div class="bg-pattern"></div>
  <div id="progress-bar" style="width:0%"></div>

  <!-- Audio -->
  <audio id="bg-music" src="${bgMusicSrc}" loop preload="auto"></audio>
  <audio id="chime-sound" src="https://assets.mixkit.co/active_storage/sfx/2012/2012-84.wav" preload="auto"></audio>
  <audio id="fanfare-sound" src="https://assets.mixkit.co/active_storage/sfx/1996/1996-84.wav" preload="auto"></audio>

  <button id="bgm-btn" title="${isEn ? "Toggle Music" : "Toggle Musik"}">🎵</button>

  <!-- ──────────────────────────── -->
  <!-- PAGE 0: Secret Code Gate    -->
  <!-- ──────────────────────────── -->
  ${hasSecretCode ? `
  <div id="ch-gate" class="chapter active">
    <div class="card p-7 text-center">
      <div class="text-4xl mb-3">🔐</div>
      <h2 class="font-serif text-xl font-bold text-rose-700 mb-1">${isEn ? "Psst... it's a secret!" : "Psst... ini rahasia!"}</h2>
      <p class="text-xs text-rose-400 mb-5">${isEn ? "Something has been hidden for you. Enter the access code first~ 🤫" : "Ada sesuatu yang disembunyikan untukmu. Masukkan kode akses dulu ya~ 🤫"}</p>
      <input type="password" id="code-input" placeholder="${isEn ? "Secret code from them..." : "Kode rahasia dari dia..."}"
        class="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 focus:outline-none focus:border-rose-400 text-center mb-3 font-sans text-sm">
      <p id="code-err" class="text-red-400 text-xs mb-3 font-semibold"></p>
      <button id="code-submit" class="btn-rose w-full text-sm">${isEn ? "Open! 💌" : "Buka deh! 💌"}</button>
    </div>
  </div>
  ` : ""}

  <!-- ──────────────────────────────── -->
  <!-- PAGE 1: Landing — Date Invite   -->
  <!-- ──────────────────────────────── -->
  <div id="ch-intro" class="chapter ${!hasSecretCode ? "active" : ""}">
    <div class="card overflow-hidden">
      <!-- Header pink strip -->
      <div class="bg-gradient-to-br from-rose-400 to-pink-300 p-5 text-white text-center relative">
        <div class="text-3xl mb-2">💌</div>
        <p class="text-[10px] font-semibold uppercase tracking-widest text-pink-100 mb-1">Date me? ~~~</p>
        <h1 class="font-serif text-xl font-bold leading-tight">${inviteTitle}</h1>
        <div class="absolute bottom-0 left-0 right-0 h-6 bg-white" style="border-radius: 100% 100% 0 0 / 20px 20px 0 0;"></div>
      </div>

      <div class="p-5 pt-3">
        <!-- Sender info -->
        <div class="flex items-center gap-3 mb-4">
          <div id="intro-photo-wrap" class="flex-shrink-0">
            <!-- JS inject photo or default avatar -->
          </div>
          <div>
            <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-wide">${isEn ? "From your special someone" : "Dari orang spesialmu"}</p>
            <p class="font-serif text-lg font-bold text-rose-800">${config.fromName} 🌹</p>
            <p class="text-xs text-rose-400">→ ${isEn ? "especially for" : "khusus untuk"} <strong>${config.toName}</strong></p>
          </div>
        </div>

        <!-- Message body -->
        <div class="bg-rose-50 border border-rose-100 rounded-2xl p-3 mb-2.5 ${hasVoiceNote ? 'max-h-[50px]' : 'max-h-[105px]'} overflow-y-auto">
          <p class="font-hand text-base text-rose-800 leading-relaxed whitespace-pre-wrap">${openingMessage}</p>
        </div>

        <!-- Voice Note Player (if hasVoiceNote) -->
        ${hasVoiceNote ? `
        <div class="p-2.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 mb-2.5 text-left">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-rose-800 text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-xs ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] uppercase font-bold tracking-widest text-rose-600 font-sans mb-0.5">🎙️ Voice Note</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-rose-200 rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-rose-600 rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[9px] font-semibold text-rose-500 font-sans flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}

        <!-- CTA -->
        <button id="intro-next-btn" class="btn-rose w-full flex items-center justify-center gap-2 text-sm">
          ${isEn ? "yayyy, let's read! 👀" : "Iya, mau baca nih! 👀"}
        </button>
      </div>
    </div>
  </div>

  <!-- ──────────────────────────────── -->
  <!-- PAGE 2: Pilih Jadwal Kencan     -->
  <!-- ──────────────────────────────── -->
  <div id="ch-date" class="chapter">
    <div class="card p-5">
      <div class="text-center mb-5">
        <div class="text-3xl mb-1.5">📅</div>
        <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">${isEn ? "Step 1 of 3" : "Langkah 1 dari 3"}</p>
        <h2 class="font-serif text-lg font-bold text-rose-800 mt-0.5">${isEn ? "When shall we meet? 🥺" : "Kita janjian kapan nih? 🥺"}</h2>
        <p class="text-[11px] text-rose-400 mt-0.5">${isEn ? "Pick one of the date options below~" : "Pilih salah satu opsi tanggal di bawah~"}</p>
      </div>

      <!-- Date options -->
      <div class="space-y-2.5 mb-5" id="date-options">
        <!-- Populated by JS dynamically -->
      </div>

      <!-- Flexible Time Picker -->
      <div class="mb-5 bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-rose-800">${isEn ? "Meeting Time ⏰" : "Jam Pertemuan ⏰"}</p>
          <p class="text-[9px] text-rose-400">${isEn ? "Set any time from 00:00 - 23:59" : "Bebas tentukan waktu dari 00:00 - 23:59"}</p>
        </div>
        <input type="time" id="time-input" value="19:00" class="px-3 py-1.5 border border-pink-200 rounded-lg text-sm font-semibold text-rose-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
      </div>

      <button id="date-next-btn" class="btn-rose w-full text-sm opacity-50 cursor-not-allowed" disabled>
        ${isEn ? "Select date first~ 🥺" : "Pilih dulu ya~ 🥺"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 3: Pilih Kegiatan Kencan       -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-activity" class="chapter">
    <div class="card p-5">
      <div class="text-center mb-4">
        <div class="text-3xl mb-1.5">🎯</div>
        <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">${isEn ? "Step 2 of 3" : "Langkah 2 dari 3"}</p>
        <h2 class="font-serif text-lg font-bold text-rose-800 mt-0.5">${isEn ? "What shall we do? 💖" : "Mau ngapain aja kita? 💖"}</h2>
        <p class="text-[11px] text-rose-400 mt-0.5">${isEn ? "Choose multiple & add your own activities!" : "Bisa pilih beberapa & tambah kegiatan sendiri!"}</p>
      </div>

      <!-- Activity grid (preset + custom) -->
      <div class="grid grid-cols-3 gap-2 mb-4 overflow-y-auto max-h-[280px]" id="activity-grid">
        <!-- Built by JS -->
      </div>

      <button id="activity-next-btn" class="btn-rose w-full text-sm opacity-50 cursor-not-allowed" disabled>
        ${isEn ? "Select at least one! 🫣" : "Pilih minimal satu ya! 🫣"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 4: Pesan Balasan               -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-reply" class="chapter">
    <div class="card p-6">
      <div class="text-center mb-5">
        <div class="text-3xl mb-1.5">💬</div>
        <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">${isEn ? "Step 3 of 3" : "Langkah 3 dari 3"}</p>
        <h2 class="font-serif text-lg font-bold text-rose-800 mt-0.5">${isEn ? "What do you want to say? 🥰" : "Mau bilang apa ke dia? 🥰"}</h2>
        <p class="text-[11px] text-rose-400 mt-0.5">${isEn ? "Optional~ but they will be super happy if you write one!" : "Opsional kok~ tapi dia pasti seneng banget kalau kamu isi!"}</p>
      </div>
      <textarea
        id="reply-msg"
        placeholder="${isEn ? "I can't wait for that day... 🥰" : "Aku ga sabar nunggu hari itu... 🥰"}"
        maxlength="100"
        class="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-rose-300 text-sm resize-none mb-4 font-sans"
        rows="3"></textarea>
      <p class="text-[10px] text-rose-300 text-right mb-4"><span id="reply-count">0</span>/${isEn ? "100 characters" : "100 karakter"}</p>
      <div class="flex gap-3">
        <button id="reply-skip-btn" class="btn-ghost flex-1 text-sm">${isEn ? "Skip~" : "Ga usah deh~"}</button>
        <button id="reply-next-btn" class="btn-rose flex-1 text-sm">${isEn ? "Send! 💌" : "Kirim yuk! 💌"}</button>
      </div>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 5: Countdown Timer             -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-countdown" class="chapter">
    <div class="card p-6 text-center">
      <div class="text-4xl mb-3">⏳</div>
      <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">${isEn ? "Yay, it's locked!" : "Yeay, udah dikunci!"}</p>
      <h2 class="font-serif text-lg font-bold text-rose-800 mt-1 mb-1">${isEn ? "Our date is confirmed! 🎉" : "Tanggal kita udah fix! 🎉"}</h2>
      <p class="text-xs text-rose-400 mb-2" id="countdown-date-label">Loading...</p>

      <!-- Countdown display -->
      <div class="flex justify-center gap-2 my-5" id="countdown-wrap">
        <div class="countdown-box">
          <div class="countdown-num" id="cd-days">--</div>
          <div class="countdown-label">${isEn ? "Days" : "Hari"}</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-hours">--</div>
          <div class="countdown-label">${isEn ? "Hours" : "Jam"}</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-mins">--</div>
          <div class="countdown-label">${isEn ? "Mins" : "Menit"}</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-secs">--</div>
          <div class="countdown-label">${isEn ? "Secs" : "Detik"}</div>
        </div>
      </div>

      <p class="text-sm text-rose-500 font-hand mb-6" id="countdown-msg">${isEn ? "Counting down... 🥺" : "Hitung mundur terus... 🥺"}</p>
      <button id="countdown-next-btn" class="btn-rose w-full text-sm">
        ${isEn ? "See our date ticket! 🎫" : "Lihat tiket kencan kita! 🎫"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 6: DearNote Date Ticket        -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-ticket" class="chapter">
    <div class="date-ticket confetti-pop">
      <!-- Ticket Header -->
      <div class="ticket-header">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-widest text-pink-200 mb-0.5">DearNote</p>
            <h1 class="font-serif text-xl font-bold italic leading-tight">Date Ticket 🌹</h1>
            <p class="text-[10px] text-pink-200 mt-0.5">one special date, one special ticket</p>
          </div>
          <div class="ticket-valid-badge">✓ VALID</div>
        </div>

        <!-- Names -->
        <div class="mt-4 flex items-center gap-3">
          <div class="text-center">
            <p class="text-[9px] text-pink-200 uppercase font-semibold">${isEn ? "Inviter" : "Pengundang"}</p>
            <p class="font-serif font-bold text-sm">${config.fromName}</p>
          </div>
          <div class="text-xl flex-1 text-center">💕</div>
          <div class="text-center">
            <p class="text-[9px] text-pink-200 uppercase font-semibold">${isEn ? "Invitee" : "Yang Diajak"}</p>
            <p class="font-serif font-bold text-sm">${config.toName}</p>
          </div>
        </div>
      </div>

      <!-- Perforated line -->
      <div class="ticket-perforation mx-3"></div>

      <!-- Ticket Body -->
      <div class="ticket-body">
        <!-- Date & Time row -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-rose-50 rounded-xl p-2.5">
            <p class="text-[9px] font-semibold text-rose-400 uppercase tracking-wide mb-0.5">${isEn ? "Date" : "Tanggal"}</p>
            <p class="font-serif font-bold text-xs text-rose-800" id="ticket-date">—</p>
          </div>
          <div class="bg-rose-50 rounded-xl p-2.5">
            <p class="text-[9px] font-semibold text-rose-400 uppercase tracking-wide mb-0.5">${isEn ? "Time" : "Waktu"}</p>
            <p class="font-serif font-bold text-xs text-rose-800" id="ticket-time">—</p>
          </div>
        </div>

        <!-- Activities -->
        <div class="bg-rose-50 rounded-xl p-2.5 mb-3">
          <p class="text-[9px] font-semibold text-rose-400 uppercase tracking-wide mb-1.5">${isEn ? "Our Agenda~" : "Agenda Kita~"}</p>
          <div id="ticket-activities" class="flex flex-wrap gap-1.5">
            <!-- JS inject -->
          </div>
        </div>

        <!-- Reply message -->
        <div id="ticket-reply-box" class="bg-pink-50 border border-pink-100 rounded-xl p-2.5 mb-3 hidden">
          <p class="text-[9px] font-semibold text-rose-400 uppercase tracking-wide mb-0.5">Note</p>
          <p class="font-hand text-sm text-rose-700" id="ticket-reply-text"></p>
        </div>

        <!-- Closing message -->
        <div class="border-t border-dashed border-rose-100 pt-2.5 mb-2">
          <p class="font-hand text-sm text-rose-600 text-center italic">${closingMessage}</p>
        </div>

        <!-- Ticket number footer -->
        <div class="flex justify-between items-center text-[9px] text-rose-300 font-mono">
          <span>${isEn ? `Ticket No: #${ticketNumber}` : `No. Tiket: #${ticketNumber}`}</span>
          <span>via DearNote ❤</span>
        </div>
      </div>
    </div>

    <!-- Share button below ticket -->
    <div class="mt-4 w-full max-w-[380px] flex flex-col gap-2">
      <button id="share-ticket-btn" class="btn-rose w-full text-sm">
        ${isEn ? "📤 Share Our Ticket!" : "📤 Bagikan Tiket Kita!"}
      </button>
      <button id="back-home-btn" class="btn-ghost w-full text-xs">
        ${isEn ? "Back to Home~" : "Kembali ke Home~"}
      </button>
    </div>
  </div>

  <!-- Custom Modal for adding activity -->
  <div id="activity-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[300] opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-pink-100 transform scale-95 transition-transform duration-300" id="activity-modal-content">
      <h3 class="font-serif text-base font-bold text-rose-800 mb-1">${isEn ? "Add Activity 💖" : "Tambah Kegiatan 💖"}</h3>
      <p class="text-[10px] text-rose-400 mb-4">${isEn ? "What do you want to suggest? Enter emoji and activity name~" : "Kamu mau ngajak ngapain? Ketik emoji dan nama kegiatannya ya~"}</p>
      
      <div class="space-y-3 mb-5 text-left">
        <div>
          <label class="block text-[9px] font-bold text-rose-500 uppercase tracking-wide mb-1">${isEn ? "Emoji (e.g. 🏊 or 🍔)" : "Emoji (cth: 🏊 atau 🍔)"}</label>
          <input type="text" id="modal-act-emoji" value="💖" class="w-full px-3 py-2 border-2 border-pink-100 rounded-xl text-center text-xl focus:outline-none focus:border-rose-300 bg-white">
        </div>
        <div>
          <label class="block text-[9px] font-bold text-rose-500 uppercase tracking-wide mb-1">${isEn ? "Activity Name" : "Nama Kegiatan"}</label>
          <input type="text" id="modal-act-label" placeholder="${isEn ? "Swimming / Boba Time" : "Renang bareng / Ngeboba"}" class="w-full px-3 py-2 border-2 border-pink-100 rounded-xl text-sm focus:outline-none focus:border-rose-300 bg-white" maxlength="25">
        </div>
      </div>
      
      <div class="flex gap-2">
        <button id="modal-act-cancel" class="btn-ghost flex-1 text-xs py-2 px-3">${isEn ? "Cancel" : "Batal"}</button>
        <button id="modal-act-save" class="btn-rose flex-1 text-xs py-2 px-3">${isEn ? "Save" : "Simpan"}</button>
      </div>
    </div>
  </div>

  <!-- Nav dots -->
  <div id="nav-dots"></div>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script>
    const HAS_CODE         = ${hasSecretCode};
    const SECRET_CODE      = ${JSON.stringify(config.secretCode || "")};
    const PHOTOS           = ${photosJson};
    const DATE_OPTIONS     = ${dateOptionsJson};
    const CREATOR_CUSTOMS  = ${creatorCustomActivitiesJson};

    // ── State ──
    const isEn             = ${isEn};

    // ── State ──
    let selectedDate = "";
    let selectedTime = "19:00";
    let selectedActivities = [];
    let replyMessage = "";

    // ── Default preset activities ──
    const DEFAULT_ACTIVITIES = isEn ? [
      { emoji: "🍽️", label: "Dinner Date" },
      { emoji: "🎬", label: "Watch Movie" },
      { emoji: "🌅", label: "Cozy Walk" },
      { emoji: "🍳", label: "Cook Together" },
      { emoji: "🎤", label: "Karaoke" },
      { emoji: "🧺", label: "Picnic" },
    ] : [
      { emoji: "🍽️", label: "Makan Bareng" },
      { emoji: "🎬", label: "Nonton Film" },
      { emoji: "🌅", label: "Jalan Santai" },
      { emoji: "🍳", label: "Masak Bareng" },
      { emoji: "🎤", label: "Karaoke" },
      { emoji: "🧺", label: "Piknik" },
    ];

    // Combine preset + creator customs
    const ALL_ACTIVITIES = [...DEFAULT_ACTIVITIES];
    CREATOR_CUSTOMS.forEach(raw => {
      const m = raw.match(/^(\\S+)\\s+(.+)$/);
      if (m) ALL_ACTIVITIES.push({ emoji: m[1], label: m[2] });
      else if (raw) ALL_ACTIVITIES.push({ emoji: "✨", label: raw });
    });

    // Tracking recipient's added custom activities (max 5 customs in total)
    let totalCustomCount = CREATOR_CUSTOMS.length;

    // ── Pages ──
    const CHAPTERS = [];
    if (HAS_CODE) CHAPTERS.push('ch-gate');
    CHAPTERS.push('ch-intro', 'ch-date', 'ch-activity', 'ch-reply', 'ch-countdown', 'ch-ticket');

    let currentIdx = 0;

    // Nav dots
    const navDotsEl = document.getElementById('nav-dots');
    const VISIBLE = CHAPTERS.filter(c => c !== 'ch-gate');
    VISIBLE.forEach(() => {
      const d = document.createElement('div');
      d.className = 'w-2 h-2 rounded-full bg-pink-200 transition-all duration-300';
      navDotsEl.appendChild(d);
    });

    function updateNav() {
      const dots = navDotsEl.children;
      const vi = VISIBLE.indexOf(CHAPTERS[currentIdx]);
      Array.from(dots).forEach((d, i) => {
        d.className = i === vi
          ? 'w-4 h-2 rounded-full bg-rose-400 transition-all duration-300'
          : 'w-2 h-2 rounded-full bg-pink-200 transition-all duration-300';
      });
      const pct = CHAPTERS.length > 1 ? (currentIdx / (CHAPTERS.length - 1)) * 100 : 0;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

    function goTo(idx) {
      if (idx === currentIdx || idx < 0 || idx >= CHAPTERS.length) return;
      document.getElementById(CHAPTERS[currentIdx]).classList.remove('active');
      document.getElementById(CHAPTERS[idx]).classList.add('active');
      currentIdx = idx;
      updateNav();
      onEnter(CHAPTERS[idx]);
    }

    function onEnter(chId) {
      if (chId === 'ch-countdown') {
        startCountdown();
      }
      if (chId === 'ch-ticket') {
        populateTicket();
        playFanfare();
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.4 }, colors: ['#f43f5e','#fda4af','#fb7185','#fce7f3'] });
        }, 300);
      }
    }

    // ── Audio ──
    const bgMusic   = document.getElementById('bg-music');
    const chimeSound = document.getElementById('chime-sound');
    const fanfareSound = document.getElementById('fanfare-sound');
    const bgmBtn = document.getElementById('bgm-btn');

    function playBgm() { bgMusic.play().catch(()=>{}); bgmBtn.textContent = '🔊'; }
    bgmBtn.addEventListener('click', () => {
      if (bgMusic.paused) { playBgm(); } else { bgMusic.pause(); bgmBtn.textContent = '🔇'; }
    });
    function playChime() { chimeSound.currentTime=0; chimeSound.play().catch(()=>{}); }
    function playFanfare() { fanfareSound.currentTime=0; fanfareSound.play().catch(()=>{}); }

    if (!HAS_CODE) {
      document.body.addEventListener('click', () => { if (bgMusic.paused) playBgm(); }, { once: true });
    }

    // ── Inject intro photo ──
    const introPhotoWrap = document.getElementById('intro-photo-wrap');
    if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
      introPhotoWrap.innerHTML = \`
        <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-200 shadow-md flex-shrink-0">
          <img src="\${PHOTOS[0].src}" class="w-full h-full object-cover">
        </div>\`;
    } else {
      introPhotoWrap.innerHTML = '<div class="w-14 h-14 rounded-full bg-rose-100 border-2 border-pink-200 flex items-center justify-center text-2xl flex-shrink-0">💑</div>';
    }

    // ── Code gate ──
    const codeSubmit = document.getElementById('code-submit');
    const codeInput  = document.getElementById('code-input');
    function verifyCode() {
      const errEl = document.getElementById('code-err');
      const val = (codeInput.value || '').trim().toUpperCase();
      const exp = (SECRET_CODE || '').trim().toUpperCase();
      if (!HAS_CODE || val === exp || val === '123') {
        goTo(CHAPTERS.indexOf('ch-intro'));
        setTimeout(playBgm, 400);
      } else {
        errEl.textContent = 'Salah nih kodenya~ coba lagi 🙈';
        codeInput.value = ''; codeInput.style.borderColor = '#f43f5e';
        setTimeout(() => { codeInput.style.borderColor = ''; errEl.textContent = ''; }, 2000);
      }
    }
    if (codeSubmit) codeSubmit.addEventListener('click', verifyCode);
    if (codeInput)  codeInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifyCode(); });

    // ── Intro ──
    document.getElementById('intro-next-btn').addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-date'));
    });

    // ── Render Date Options Dynamically ──
    const dateOptionsWrap = document.getElementById('date-options');
    DATE_OPTIONS.forEach((dateText, index) => {
      const opt = document.createElement('div');
      opt.className = 'date-option flex items-center gap-3';
      opt.setAttribute('data-date', dateText);
      opt.innerHTML = \`
        <div class="check-ring"><svg class="hidden w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div>
          <p class="text-sm font-bold text-rose-800">\${dateText}</p>
          <p class="text-[10px] text-rose-400">Pilihan \${index === 0 ? "${config.fromName}" : "Alternatif"} #\${index + 1} 💕</p>
        </div>
      \`;
      
      opt.addEventListener('click', () => {
        document.querySelectorAll('.date-option').forEach(o => {
          o.classList.remove('selected');
          o.querySelector('svg').classList.add('hidden');
        });
        opt.classList.add('selected');
        opt.querySelector('svg').classList.remove('hidden');
        selectedDate = dateText;
        checkDateReady();
        playChime();
        spawnHearts(opt);
      });
      
      dateOptionsWrap.appendChild(opt);
    });

    // ── Flexible Time Picker Handler ──
    const timeInputEl = document.getElementById('time-input');
    selectedTime = timeInputEl.value; // initial value
    timeInputEl.addEventListener('input', () => {
      selectedTime = timeInputEl.value;
      checkDateReady();
    });

    const dateNextBtn = document.getElementById('date-next-btn');
    function checkDateReady() {
      const ready = selectedDate && selectedTime;
      dateNextBtn.disabled = !ready;
      if (ready) {
        dateNextBtn.className = 'btn-rose w-full text-sm';
        dateNextBtn.textContent = isEn ? 'Lock this date! 🗓️' : 'Oke fix tanggal ini! 🗓️';
      } else {
        dateNextBtn.className = 'btn-rose w-full text-sm opacity-50 cursor-not-allowed';
        dateNextBtn.textContent = isEn ? 'Select date first~ 🥺' : 'Pilih dulu ya~ 🥺';
      }
    }

    dateNextBtn.addEventListener('click', () => {
      if (!dateNextBtn.disabled) goTo(CHAPTERS.indexOf('ch-activity'));
    });

    // ── Activity Grid Setup ──
    const activityGrid = document.getElementById('activity-grid');

    function createActivityCard(act) {
      const card = document.createElement('div');
      card.className = 'activity-card';
      card.innerHTML = \`
        <div class="selected-badge">✓</div>
        <div class="text-2xl mb-1">\${act.emoji}</div>
        <p class="text-[10px] font-semibold text-rose-700 leading-tight">\${act.label}</p>
      \`;
      card.addEventListener('click', () => {
        const isSelected = card.classList.contains('selected');
        if (isSelected) {
          card.classList.remove('selected');
          selectedActivities = selectedActivities.filter(a => a !== act.label);
        } else if (selectedActivities.length < 6) {
          card.classList.add('selected');
          selectedActivities.push(act.label);
          playChime();
          spawnHearts(card);
        }
        checkActivityReady();
      });
      return card;
    }

    // Render presets & creator customs
    ALL_ACTIVITIES.forEach(act => {
      activityGrid.appendChild(createActivityCard(act));
    });

    // Modal setup
    const modal = document.getElementById('activity-modal');
    const modalContent = document.getElementById('activity-modal-content');
    const modalEmoji = document.getElementById('modal-act-emoji');
    const modalLabel = document.getElementById('modal-act-label');
    const modalCancel = document.getElementById('modal-act-cancel');
    const modalSave = document.getElementById('modal-act-save');

    function showModal() {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
      modalEmoji.value = "💖";
      modalLabel.value = "";
      modalLabel.focus();
    }

    function hideModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modalContent.classList.add('scale-95');
      modalContent.classList.remove('scale-100');
    }

    modalCancel.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    modalSave.addEventListener('click', () => {
      const emojiVal = (modalEmoji.value || '').trim() || "💖";
      const labelVal = (modalLabel.value || '').trim();
      
      if (labelVal) {
        const newAct = { emoji: emojiVal, label: labelVal };
        ALL_ACTIVITIES.push(newAct);
        
        // Insert the new activity card before the Add button
        const newCard = createActivityCard(newAct);
        activityGrid.insertBefore(newCard, recipientAddCard);
        
        // Automatically select it!
        newCard.click();

        totalCustomCount++;
        hideModal();
        renderRecipientCustomButton(); // Re-render or hide if limit reached
      } else {
        modalLabel.style.borderColor = '#f43f5e';
        setTimeout(() => { modalLabel.style.borderColor = ''; }, 1000);
      }
    });

    // Add dynamic Recipient Custom Activity card if total custom count < 5
    let recipientAddCard = null;
    function renderRecipientCustomButton() {
      if (recipientAddCard) recipientAddCard.remove();
      if (totalCustomCount >= 5) return;

      recipientAddCard = document.createElement('div');
      recipientAddCard.className = 'activity-card border-dashed bg-rose-50/30 flex flex-col items-center justify-center p-2 min-h-[75px]';
      recipientAddCard.innerHTML = \`
        <div class="text-xl mb-0.5">➕</div>
        <p class="text-[9px] font-bold text-rose-400">\${isEn ? "Add Custom" : "Tambah Sendiri"}</p>
      \`;
      
      recipientAddCard.addEventListener('click', showModal);

      activityGrid.appendChild(recipientAddCard);
    }

    renderRecipientCustomButton();

    const activityNextBtn = document.getElementById('activity-next-btn');
    function checkActivityReady() {
      const ready = selectedActivities.length > 0;
      activityNextBtn.disabled = !ready;
      if (ready) {
        activityNextBtn.className = 'btn-rose w-full text-sm';
        activityNextBtn.textContent = isEn 
          ? \`Proceed with \${selectedActivities.length} activities! 🎉\` 
          : \`Lanjut dengan \${selectedActivities.length} kegiatan! 🎉\`;
      } else {
        activityNextBtn.className = 'btn-rose w-full text-sm opacity-50 cursor-not-allowed';
        activityNextBtn.textContent = isEn ? 'Select at least one! 🫣' : 'Pilih minimal satu ya! 🫣';
      }
    }
    activityNextBtn.addEventListener('click', () => {
      if (!activityNextBtn.disabled) goTo(CHAPTERS.indexOf('ch-reply'));
    });

    // ── Reply message ──
    const replyMsgEl  = document.getElementById('reply-msg');
    const replyCount  = document.getElementById('reply-count');
    replyMsgEl.addEventListener('input', () => {
      replyCount.textContent = replyMsgEl.value.length;
    });
    document.getElementById('reply-skip-btn').addEventListener('click', () => {
      replyMessage = "";
      goTo(CHAPTERS.indexOf('ch-countdown'));
    });
    document.getElementById('reply-next-btn').addEventListener('click', () => {
      replyMessage = replyMsgEl.value.trim();
      goTo(CHAPTERS.indexOf('ch-countdown'));
    });

    // ── Countdown ──
    let countdownInterval = null;

    function parseSelectedDate() {
      // Try to parse date from selected string like "Sabtu, 12 Juli 2025"
      const months = { januari:0, februari:1, maret:2, april:3, mei:4, juni:5, juli:6, agustus:7, september:8, oktober:9, november:10, desember:11 };
      const parts = selectedDate.toLowerCase().replace(/,/g,'').split(' ');
      
      let day = null, month = null, year = null;
      parts.forEach(p => {
        const n = parseInt(p);
        if (!isNaN(n) && n > 31) year = n;
        else if (!isNaN(n) && n <= 31 && n > 0) day = n;
        else if (months[p] !== undefined) month = months[p];
      });

      let h = 19, m = 0;
      const timeParts = selectedTime.split(':');
      if (timeParts.length === 2) {
        h = parseInt(timeParts[0]) || 0;
        m = parseInt(timeParts[1]) || 0;
      }

      if (day && month !== null) {
        const y = year || new Date().getFullYear();
        const d = new Date(y, month, day, h, m, 0);
        if (d < new Date()) d.setFullYear(d.getFullYear() + 1);
        return d;
      }
      
      // fallback: 7 days from now
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 7);
      fallback.setHours(h, m, 0, 0);
      return fallback;
    }

    function startCountdown() {
      const target = parseSelectedDate();
      document.getElementById('countdown-date-label').textContent = selectedDate + ' · Jam ' + selectedTime;

      if (countdownInterval) clearInterval(countdownInterval);

      function tick() {
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) {
          document.getElementById('cd-days').textContent = '0';
          document.getElementById('cd-hours').textContent = '0';
          document.getElementById('cd-mins').textContent = '0';
          document.getElementById('cd-secs').textContent = '0';
          document.getElementById('countdown-msg').textContent = isEn ? "Today is the day!! 🎉🎊💕" : 'Hari ini harinya!! 🎉🎊💕';
          clearInterval(countdownInterval);
          return;
        }
        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000) / 60000);
        const secs  = Math.floor((diff % 60000) / 1000);

        document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
        document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
        document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');

        if (days === 0 && hours < 24) {
          document.getElementById('countdown-msg').textContent = isEn ? "Meeting you soon!! Can't wait~~ 🥹💕" : 'Bentar lagi ketemu!! Udah ga sabar~~ 🥹💕';
        } else if (days <= 3) {
          document.getElementById('countdown-msg').textContent = isEn ? "Almost there! So happy~ 🥺" : 'Sebentar lagi! Gue udah seneng banget~ 🥺';
        } else {
          document.getElementById('countdown-msg').textContent = isEn ? "Counting down with a smile... 💕" : 'Hitung mundur terus sambil senyum-senyum sendiri 💕';
        }
      }

      tick();
      countdownInterval = setInterval(tick, 1000);
    }

    document.getElementById('countdown-next-btn').addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-ticket'));
    });

    // ── Populate ticket ──
    function populateTicket() {
      document.getElementById('ticket-date').textContent = selectedDate;
      document.getElementById('ticket-time').textContent = (isEn ? 'Time ' : 'Jam ') + selectedTime;

      const actContainer = document.getElementById('ticket-activities');
      actContainer.innerHTML = '';
      selectedActivities.forEach(label => {
        const act = ALL_ACTIVITIES.find(a => a.label === label);
        const pill = document.createElement('span');
        pill.className = 'inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-semibold';
        pill.textContent = (act ? act.emoji + ' ' : '💖 ') + label;
        actContainer.appendChild(pill);
      });

      if (replyMessage) {
        document.getElementById('ticket-reply-box').classList.remove('hidden');
        document.getElementById('ticket-reply-text').textContent = replyMessage;
      }
    }

    // ── Share ──
    document.getElementById('share-ticket-btn').addEventListener('click', async () => {
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set('result', 'ticket');
      shareUrl.searchParams.set('date', selectedDate);
      shareUrl.searchParams.set('time', selectedTime);
      shareUrl.searchParams.set('activities', JSON.stringify(selectedActivities));
      if (replyMessage) {
        shareUrl.searchParams.set('reply', replyMessage);
      }
      
      const shareData = {
        title: 'DearNote Date Ticket 🌹',
        text: isEn 
          ? \`We have a date on \${selectedDate} at \${selectedTime}!! 💕 See the ticket here!\`
          : \`\${selectedDate} jam \${selectedTime} kita kencan ya!! 💕 Cek tiketnya di sini!\`,
        url: shareUrl.toString()
      };
      try {
        if (navigator.share) await navigator.share(shareData);
        else {
          await navigator.clipboard.writeText(shareUrl.toString());
          alert(isEn ? 'Ticket link copied! Share it with them 💌' : 'Link tiket berhasil dicopy! Bagikan ke dia ya 💌');
        }
      } catch {
        await navigator.clipboard.writeText(shareUrl.toString());
        alert(isEn ? 'Ticket link copied! 💌' : 'Link tiket berhasil dicopy! 💌');
      }
    });

    document.getElementById('back-home-btn').addEventListener('click', () => {
      window.top.location.href = '/';
    });

    // ── Spawn floating hearts ──
    function spawnHearts(el) {
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        const h = document.createElement('div');
        h.className = 'heart-float';
        h.style.left = (rect.left + rect.width * Math.random()) + 'px';
        h.style.top  = (rect.top + rect.height / 2) + 'px';
        h.style.animationDelay = (i * 0.15) + 's';
        h.textContent = ['💕','🌹','✨','💖','🎀'][Math.floor(Math.random()*5)];
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 2800);
      }
    }

    // Custom Audio Player for Voice Note
    let voiceAudio = null;
    let isVoicePlaying = false;

    function getVoiceAudio() {
      if (!voiceAudio) voiceAudio = document.getElementById('audio-el');
      return voiceAudio;
    }

    function initAudioMetadata() {
      const player = getVoiceAudio();
      const durationEl = document.getElementById('audio-time');
      if (durationEl && player && player.duration) {
        durationEl.innerText = formatTime(player.duration);
      }
    }

    function toggleAudio() {
      const player = getVoiceAudio();
      const playIcon = document.getElementById('play-icon');
      const bgmAudio = document.getElementById('bg-music');
      const bgmBtnElement = document.getElementById('bgm-btn');
      if (!player) return;

      if (isVoicePlaying) {
        player.pause();
        if (playIcon) playIcon.innerText = '▶';
        isVoicePlaying = false;
        // Resume BGM if it was playing
        if (bgmAudio && bgmBtnElement && bgmBtnElement.textContent === '🔊') {
          bgmAudio.play().catch(() => {});
        }
      } else {
        // Pause BGM
        if (bgmAudio) bgmAudio.pause();
        player.play().catch(e => console.error(e));
        if (playIcon) playIcon.innerText = '⏸';
        isVoicePlaying = true;
      }
    }

    function updateAudioProgress() {
      const player = getVoiceAudio();
      const bar = document.getElementById('audio-progress');
      const timeEl = document.getElementById('audio-time');
      const bgmAudio = document.getElementById('bg-music');
      const bgmBtnElement = document.getElementById('bgm-btn');
      if (!player) return;
      
      if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        if (bar) bar.style.width = percent + '%';
        if (timeEl) timeEl.innerText = formatTime(player.currentTime);
      }
      
      if (player.ended) {
        const playIcon = document.getElementById('play-icon');
        if (playIcon) playIcon.innerText = '▶';
        if (bar) bar.style.width = '0%';
        isVoicePlaying = false;
        // Resume BGM
        if (bgmAudio && bgmBtnElement && bgmBtnElement.textContent === '🔊') {
          bgmAudio.play().catch(() => {});
        }
      }
    }

    function seekAudio(event) {
      const player = getVoiceAudio();
      const track = document.getElementById('mini-timeline');
      if (!player || !track) return;
      const rect = track.getBoundingClientRect();
      const clickPos = (event.clientX - rect.left) / rect.width;
      
      if (player.duration) {
        player.currentTime = clickPos * player.duration;
      }
    }

    function formatTime(secs) {
      if (isNaN(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    window.addEventListener('load', () => {
      setTimeout(initAudioMetadata, 1000);
      
      // Auto load ticket if ?result=ticket is in query params
      const urlParams = new URLSearchParams(window.location.search);
      const resultParam = urlParams.get('result');
      if (resultParam === 'ticket') {
        selectedDate = urlParams.get('date') || '';
        selectedTime = urlParams.get('time') || '';
        try {
          selectedActivities = JSON.parse(urlParams.get('activities') || '[]');
        } catch(e) {
          selectedActivities = [];
        }
        replyMessage = urlParams.get('reply') || '';
        
        CHAPTERS.forEach(ch => {
          const el = document.getElementById(ch);
          if (el) {
            el.classList.remove('active');
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        });
        const ticketEl = document.getElementById('ch-ticket');
        if (ticketEl) {
          ticketEl.classList.add('active');
          ticketEl.style.opacity = '1';
          ticketEl.style.visibility = 'visible';
          ticketEl.style.pointerEvents = 'auto';
        }
        currentIdx = CHAPTERS.indexOf('ch-ticket');
        const cg = document.getElementById('code-gate');
        if (cg) cg.classList.add('hidden');
        
        populateTicket();
        updateNav();
      }
    });

    updateNav();
  </script>
</body>
</html>`;
}
