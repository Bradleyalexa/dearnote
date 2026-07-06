import { PublishedConfig } from "../../schemas/card-draft";

export function generateDateTicketHtml(config: PublishedConfig): string {
  const isEn = config.lang === "en";
  const hasVoiceNote = !!config.voiceNote && !!config.voiceNote.src;
  const voiceNoteSrc = config.voiceNote?.src || "";
  const hasSecretCode = !!config.secretCode;
  const inviteTitle = config.letterTitle || "TIE THE KNOT TOUR 🎫";
  const openingMessage = config.letterBody || (isEn ? "I want to invite you to our exclusive date tour. Read the details first! 💕" : "Gue mau ngajak lo ke tur konser paling seru dan eksklusif. Baca kelengkapannya dulu yuk! 💕");
  const closingMessage = config.finalMessage || (isEn ? "Get ready and dress up nice! 🎸" : "Siap-siap dandan yang rapi ya! 🎸");
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

  // Accent color mapping based on config.themeColor
  let colorThemeHex = "#3b82f6"; // default blue
  let textThemeHex = "text-blue-600";
  let bgThemeLight = "bg-blue-50";
  let borderThemeHex = "border-blue-200";

  if (config.themeColor === "red") {
    colorThemeHex = "#ef4444";
    textThemeHex = "text-red-600";
    bgThemeLight = "bg-red-50";
    borderThemeHex = "border-red-200";
  } else if (config.themeColor === "green") {
    colorThemeHex = "#10b981";
    textThemeHex = "text-emerald-600";
    bgThemeLight = "bg-emerald-50";
    borderThemeHex = "border-emerald-200";
  } else if (config.themeColor === "purple") {
    colorThemeHex = "#8b5cf6";
    textThemeHex = "text-violet-600";
    bgThemeLight = "bg-violet-50";
    borderThemeHex = "border-violet-200";
  } else if (config.themeColor === "pink") {
    colorThemeHex = "#ec4899";
    textThemeHex = "text-pink-600";
    bgThemeLight = "bg-pink-50";
    borderThemeHex = "border-pink-200";
  } else if (config.themeColor === "yellow" || config.themeColor === "amber") {
    colorThemeHex = "#f59e0b";
    textThemeHex = "text-amber-600";
    bgThemeLight = "bg-amber-50";
    borderThemeHex = "border-amber-200";
  }

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.fromName} ngajak kencan ${config.toName} ~ DearNote</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Gochi+Hand&family=Courier+Prime:wght@700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            hand: ['"Gochi Hand"', 'cursive'],
            ticket: ['"Courier Prime"', 'Courier', 'monospace'],
            fredoka: ['"Fredoka"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      overflow: hidden;
      color: #1e293b;
      touch-action: manipulation;
    }

    .bg-pattern {
      position: fixed;
      inset: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(59,130,246,0.03) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139,92,246,0.04) 0%, transparent 40%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%2364748b' fill-opacity='0.02'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* Progress bar */
    #progress-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 3.5px;
      background: linear-gradient(90deg, ${colorThemeHex}, #64748b);
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
      border: 2px solid #cbd5e1;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
      box-shadow: 0 10px 30px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02);
      border: 1px solid #e2e8f0;
      width: 100%;
      max-width: 400px;
    }

    /* Action buttons */
    .btn-action {
      background: #1e293b;
      color: white;
      font-weight: 700;
      padding: 0.8rem 1.6rem;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(30,41,59,0.15);
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    .btn-action:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(30,41,59,0.25); }
    .btn-action:active { transform: translateY(0); }

    .btn-ghost {
      color: #475569;
      font-weight: 600;
      padding: 0.6rem 1rem;
      border-radius: 9999px;
      border: 1.5px solid #cbd5e1;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { background: #f1f5f9; }

    /* Date option cards */
    .date-option {
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 0.8rem 1rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
    .date-option:hover { border-color: #cbd5e1; background: #f8fafc; transform: translateY(-1px); }
    .date-option.selected {
      border-color: ${colorThemeHex};
      background: ${bgThemeLight};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59,130,246,0.1);
    }
    .date-option .check-ring {
      width: 1.25rem; height: 1.25rem;
      border-radius: 50%;
      border: 2px solid #cbd5e1;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .date-option.selected .check-ring {
      background: ${colorThemeHex};
      border-color: ${colorThemeHex};
    }

    /* Activity cards */
    .activity-card {
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 0.65rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      text-align: center;
      position: relative;
    }
    .activity-card:hover { border-color: #cbd5e1; transform: translateY(-2px); }
    .activity-card.selected {
      border-color: ${colorThemeHex};
      background: ${bgThemeLight};
      box-shadow: 0 4px 12px rgba(59,130,246,0.1);
    }
    .activity-card .selected-badge {
      position: absolute;
      top: -6px; right: -6px;
      width: 18px; height: 18px;
      background: ${colorThemeHex};
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
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 0.6rem 0.4rem;
      text-align: center;
      min-width: 60px;
    }
    .countdown-num {
      font-family: 'Courier Prime', monospace;
      font-size: 1.6rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    /* Concert Ticket Layout */
    .concert-ticket {
      display: flex;
      background: white;
      border: 1px solid #cbd5e1;
      box-shadow: 0 15px 45px rgba(0,0,0,0.15);
      max-width: 480px;
      width: 100%;
      min-height: 180px;
      position: relative;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Left Photo Area */
    .ticket-left {
      width: 35%;
      position: relative;
      overflow: hidden;
      border-right: 2px solid #ef4444; /* Separate line */
    }
    .ticket-left::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%);
      pointer-events: none;
    }

    /* Right Info Area */
    .ticket-right {
      width: 53%;
      padding: 0.8rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Barcode Area */
    .ticket-barcode-strip {
      width: 12%;
      border-left: 2px dashed #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.2rem;
      background: #ffffff;
      position: relative;
    }

    /* Vertical Colored Banner */
    .ticket-colored-banner {
      width: 1.5rem;
      height: 100%;
      background: ${colorThemeHex};
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .ticket-vertical-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: white;
      font-size: 0.55rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* Barcode element */
    .ticket-barcode-vertical {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 1.25rem;
      padding-right: 0.1rem;
    }

    /* Vertical barcode lines */
    .barcode-line-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 80%;
      transform: rotate(180deg);
    }

    .vertical-text-side {
      writing-mode: vertical-rl;
      font-size: 0.4rem;
      color: #94a3b8;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    /* Seat Row Section Grid */
    .ticket-grid {
      display: grid;
      grid-template-cols: repeat(3, 1fr);
      text-align: center;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      padding: 0.35rem 0;
      margin: 0.4rem 0;
    }
    .grid-label {
      font-size: 0.55rem;
      font-weight: 700;
      color: #ef4444; /* red seat row label style */
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid-val {
      font-family: 'Courier Prime', monospace;
      font-size: 1.35rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.1;
    }

    /* Perforated holes on ticket edges */
    .ticket-hole {
      position: absolute;
      width: 16px; height: 16px;
      background: radial-gradient(circle, #e2e8f0 0%, #cbd5e1 100%);
      border-radius: 50%;
      z-index: 10;
    }
    .hole-left-top { top: -8px; left: 35%; margin-left: -8px; }
    .hole-left-bottom { bottom: -8px; left: 35%; margin-left: -8px; }

    /* Custom Activity Modal */
    #activity-modal {
      transition: opacity 0.3s ease;
    }

    /* Floating hearts animation */
    .heart-float {
      position: fixed;
      font-size: 1.25rem;
      opacity: 0;
      pointer-events: none;
      animation: float-up 2.5s ease-out forwards;
      z-index: 200;
    }
    @keyframes float-up {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-130px) scale(0.4); }
    }

    /* Responsive scaling for small screen preview */
    @media (max-height: 720px) {
      .chapter > .card, .chapter > .concert-ticket { transform: scale(0.92); transform-origin: center center; }
    }
    @media (max-height: 620px) {
      .chapter > .card, .chapter > .concert-ticket { transform: scale(0.82); }
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
      <div class="text-4xl mb-3">🎫</div>
      <h2 class="font-fredoka text-xl font-bold text-slate-800 mb-1">${isEn ? "Locked Concert Ticket" : "Tiket Konser Terkunci"}</h2>
      <p class="text-xs text-slate-500 mb-5">${isEn ? "This VIP date document is password protected. Enter access code~ 🔑" : "Dokumen kencan VIP ini dilindungi sandi. Masukkan kode aksesnya ya~ 🔑"}</p>
      <input type="password" id="code-input" placeholder="${isEn ? "Special password" : "Sandi khusus"}"
        class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-slate-800 text-center mb-3 font-sans text-sm">
      <p id="code-err" class="text-red-500 text-xs mb-3 font-semibold"></p>
      <button id="code-submit" class="btn-action w-full text-sm">${isEn ? "Open Ticket! 🎟️" : "Buka Tiket! 🎟️"}</button>
    </div>
  </div>
  ` : ""}

  <!-- ──────────────────────────────── -->
  <!-- PAGE 1: Landing — Concert Promo -->
  <!-- ──────────────────────────────── -->
  <div id="ch-intro" class="chapter ${!hasSecretCode ? "active" : ""}">
    <div class="card overflow-hidden">
      <!-- Retro Tour Banner Header -->
      <div class="bg-slate-900 p-6 text-white text-center relative border-b-4 border-red-500">
        <p class="text-[9px] font-extrabold uppercase tracking-widest text-red-500 mb-1">★★★ VIP GUEST ACCESS ★ ★ ★</p>
        <h1 class="font-ticket text-xl font-bold uppercase tracking-wide text-slate-100">${inviteTitle}</h1>
        <p class="text-[10px] text-slate-400 mt-1 font-mono">No. Booking: DN-${ticketNumber}</p>
      </div>

      <div class="p-5 pt-4 text-center">
        <!-- Photo/Poster Frame -->
        <div id="intro-photo-wrap" class="mb-4 flex justify-center">
          <!-- JS inject couple photo -->
        </div>

        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">OFFICIAL INVITATION FROM</p>
        <p class="font-fredoka text-lg font-bold text-slate-800">${config.fromName} 🎤</p>
        <p class="text-xs text-rose-500 font-semibold mb-4">${isEn ? "especially for:" : "khusus untuk:"} <strong>${config.toName}</strong></p>

        <!-- Message body -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-2.5 text-left ${hasVoiceNote ? 'max-h-[50px]' : 'max-h-[105px]'} overflow-y-auto">
          <p class="font-hand text-base text-slate-700 leading-relaxed whitespace-pre-wrap">${openingMessage}</p>
        </div>

        <!-- Voice Note Player (if hasVoiceNote) -->
        ${hasVoiceNote ? `
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5 mb-2.5 text-left">
          <button id="play-btn" onclick="toggleAudio()" class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow transition-all focus:outline-none flex-shrink-0">
            <span id="play-icon" class="text-xs ml-0.5">▶</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] uppercase font-bold tracking-widest text-slate-550 font-sans mb-0.5">🎙️ Voice Note</p>
            <div id="mini-timeline" onclick="seekAudio(event)" class="w-full h-1 bg-slate-200 rounded-full cursor-pointer relative">
              <div id="audio-progress" class="absolute left-0 top-0 bottom-0 w-0 bg-slate-800 rounded-full transition-all duration-100 ease-linear"></div>
            </div>
          </div>
          <span id="audio-time" class="text-[9px] font-semibold text-slate-500 font-sans flex-shrink-0">0:00</span>
          <audio id="audio-el" src="${voiceNoteSrc}" ontimeupdate="updateAudioProgress()" onloadedmetadata="initAudioMetadata()"></audio>
        </div>
        ` : ""}

        <!-- CTA -->
        <button id="intro-next-btn" class="btn-action w-full flex items-center justify-center gap-2 text-sm">
          ${isEn ? "Book Date Ticket Now! 🎟️" : "Pesan Tiket Kencan Sekarang! 🎟️"}
        </button>
      </div>
    </div>
  </div>

  <!-- ──────────────────────────────── -->
  <!-- PAGE 2: Select Show Date       -->
  <!-- ──────────────────────────────── -->
  <div id="ch-date" class="chapter">
    <div class="card p-5">
      <div class="text-center mb-5">
        <div class="text-3xl mb-1.5">📅</div>
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">${isEn ? "Step 1: Choose Date" : "Tahap 1: Pilih Tanggal"}</p>
        <h2 class="font-fredoka text-lg font-bold text-slate-800 mt-0.5">${isEn ? "Choose Show Date 🎤" : "Pilih Tanggal Pertunjukan 🎤"}</h2>
        <p class="text-[11px] text-slate-500 mt-0.5">${isEn ? "When are you ready for our show date? Select one~" : "Kapan kamu siap jalan kencan bareng aku? Pilih salah satu ya~"}</p>
      </div>

      <!-- Date options -->
      <div class="space-y-2.5 mb-5" id="date-options">
        <!-- Populated by JS dynamically -->
      </div>

      <!-- Flexible Time Picker -->
      <div class="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-800">${isEn ? "Meeting Time (Flexible) ⏰" : "Jam Pertemuan (Flexible) ⏰"}</p>
          <p class="text-[9px] text-slate-400">${isEn ? "Set any time from 00:00 - 23:59" : "Bebas pilih dari jam 00:00 - 23:59"}</p>
        </div>
        <input type="time" id="time-input" value="19:00" class="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500">
      </div>

      <button id="date-next-btn" class="btn-action w-full text-sm opacity-50 cursor-not-allowed" disabled>
        ${isEn ? "Select Date First 🥺" : "Pilih Tanggal Terlebih Dahulu 🥺"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 3: Setlist Selector (Activities)-->
  <!-- ──────────────────────────────────── -->
  <div id="ch-activity" class="chapter">
    <div class="card p-5">
      <div class="text-center mb-4">
        <div class="text-3xl mb-1.5">🎸</div>
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">${isEn ? "Step 2: Define Setlist" : "Tahap 2: Tentukan Setlist"}</p>
        <h2 class="font-fredoka text-lg font-bold text-slate-800 mt-0.5">${isEn ? "Choose Our Activities Agenda 🎯" : "Pilih Agenda Kegiatan Kita 🎯"}</h2>
        <p class="text-[11px] text-slate-500 mt-0.5">${isEn ? "What fun activities do you want to do together? (Max 6)" : "Kegiatan seru apa aja yang pengen kamu lakukan bareng? (Maksimal 6)"}</p>
      </div>

      <!-- Activity grid -->
      <div class="grid grid-cols-3 gap-2 mb-4 overflow-y-auto max-h-[280px]" id="activity-grid">
        <!-- Built by JS -->
      </div>

      <button id="activity-next-btn" class="btn-action w-full text-sm opacity-50 cursor-not-allowed" disabled>
        ${isEn ? "Select at least 1 Activity 🎸" : "Pilih Minimal 1 Kegiatan 🎸"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 4: Guest Request (Reply)       -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-reply" class="chapter">
    <div class="card p-6">
      <div class="text-center mb-5">
        <div class="text-3xl mb-1.5">✍️</div>
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">${isEn ? "Step 3: Guest Request" : "Tahap 3: Catatan Pengunjung"}</p>
        <h2 class="font-fredoka text-lg font-bold text-slate-800 mt-0.5">${isEn ? "Any Special Requests? 💬" : "Ada Permintaan Khusus? 💬"}</h2>
        <p class="text-[11px] text-slate-500 mt-0.5">${isEn ? "Write down any additional requests (optional)~" : "Tulis catatan tambahan kamu (opsional)~"}</p>
      </div>
      <textarea
        id="reply-msg"
        placeholder="${isEn ? "Let's grab matcha ice cream later... 🍦" : "Mau makan ice cream rasa matcha ya nanti... 🍦"}"
        maxlength="100"
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-sm resize-none mb-4 font-sans"
        rows="3"></textarea>
      <p class="text-[10px] text-slate-400 text-right mb-4"><span id="reply-count">0</span>/${isEn ? "100 characters" : "100 karakter"}</p>
      <div class="flex gap-3">
        <button id="reply-skip-btn" class="btn-ghost flex-1 text-sm">${isEn ? "Skip" : "Lewati"}</button>
        <button id="reply-next-btn" class="btn-action flex-1 text-sm">${isEn ? "Print Ticket! 🎟️" : "Cetak Tiket! 🎟️"}</button>
      </div>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 5: Gig Countdown               -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-countdown" class="chapter">
    <div class="card p-6 text-center">
      <div class="text-4xl mb-3">⏳</div>
      <p class="text-[10px] font-semibold text-rose-500 uppercase tracking-widest">SHOW DATE IS LOCKED!</p>
      <h2 class="font-ticket text-lg font-bold text-slate-800 mt-1 mb-1">COUNTDOWN TO DATE DAY🎉</h2>
      <p class="text-xs text-slate-500 mb-3" id="countdown-date-label">Loading...</p>

      <!-- Countdown display -->
      <div class="flex justify-center gap-2 my-5" id="countdown-wrap">
        <div class="countdown-box">
          <div class="countdown-num" id="cd-days">--</div>
          <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">${isEn ? "Days" : "Hari"}</p>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-hours">--</div>
          <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">${isEn ? "Hours" : "Jam"}</p>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-mins">--</div>
          <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">${isEn ? "Mins" : "Menit"}</p>
        </div>
        <div class="countdown-box">
          <div class="countdown-num" id="cd-secs">--</div>
          <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">${isEn ? "Secs" : "Detik"}</p>
        </div>
      </div>

      <p class="text-sm text-rose-500 font-hand mb-6" id="countdown-msg">${isEn ? "Counting down to show... 🎸" : "Hitung mundur show... 🎸"}</p>
      <button id="countdown-next-btn" class="btn-action w-full text-sm">
        ${isEn ? "Show VIP Date Ticket! 🎫" : "Tampilkan Tiket Kencan VIP! 🎫"}
      </button>
    </div>
  </div>

  <!-- ──────────────────────────────────── -->
  <!-- PAGE 6: THE CONCERT TICKET REVEAL   -->
  <!-- ──────────────────────────────────── -->
  <div id="ch-ticket" class="chapter">
    <div class="concert-ticket rounded-2xl border border-slate-300 confetti-pop relative">
      <!-- Punch holes left/right separation -->
      <div class="ticket-hole hole-left-top"></div>
      <div class="ticket-hole hole-left-bottom"></div>

      <!-- Left Column: Couple Photo (35%) -->
      <div class="ticket-left h-full bg-slate-900 flex items-center justify-center">
        <!-- JS Inject Couple Image -->
        <div id="ticket-photo-container" class="w-full h-full"></div>
      </div>

      <!-- Right Column: Stub Details (53%) -->
      <div class="ticket-right">
        <div>
          <p class="text-[8px] font-extrabold uppercase tracking-widest text-red-500 mb-0.5">★ ★ ★ VIP GUEST TICKET ★ ★ ★</p>
          <!-- Names -->
          <h2 class="font-sans font-extrabold text-sm text-slate-800 leading-tight uppercase truncate" id="ticket-couple-names">
            ${config.fromName} + ${config.toName}
          </h2>
          <!-- Tour Title -->
          <p class="font-ticket text-[9px] font-bold text-slate-600 leading-tight mt-0.5 truncate uppercase">
            ${inviteTitle}
          </p>
        </div>

        <!-- Seat Row Section Grid (Day / Month / Year) -->
        <div class="grid grid-cols-3 text-center border-y border-slate-200 py-1.5 my-2.5">
          <div>
            <span class="text-[8px] font-extrabold text-red-500 uppercase tracking-widest block">Seat</span>
            <div class="font-ticket text-base font-extrabold text-blue-600 leading-tight" id="ticket-seat">—</div>
          </div>
          <div>
            <span class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Row</span>
            <div class="font-ticket text-base font-extrabold text-slate-800 leading-tight" id="ticket-row">—</div>
          </div>
          <div>
            <span class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Section</span>
            <div class="font-ticket text-base font-extrabold text-blue-600 leading-tight" id="ticket-section">—</div>
          </div>
        </div>

        <!-- Location & Website url (similar to reference) -->
        <div class="text-center my-1.5">
          <p class="font-extrabold text-xs text-slate-800 uppercase tracking-widest leading-none" id="ticket-location">PARIS, FRANCE</p>
          <p class="font-ticket text-[9px] text-slate-600 lowercase tracking-tighter mt-1" id="ticket-website"></p>
        </div>

        <!-- Location details/activities summary -->
        <div class="text-[7.5px] text-slate-500 space-y-0.5 border-t border-dashed border-slate-100 pt-1.5">
          <p class="truncate uppercase"><strong class="text-slate-700">WAKTU:</strong> <span id="ticket-time">—</span></p>
          <p class="truncate uppercase"><strong class="text-slate-700">AGENDA:</strong> <span id="ticket-agenda">—</span></p>
          <p class="truncate uppercase hidden" id="ticket-note-wrap"><strong class="text-slate-700">NOTE:</strong> <span id="ticket-note">—</span></p>
        </div>
      </div>

      <!-- Barcode Strip (12%) -->
      <div class="ticket-barcode-strip">
        <!-- Barcode Lines -->
        <div class="ticket-barcode-vertical">
          <div class="flex flex-col items-center justify-between h-[80%] py-1">
            <svg class="w-7 h-16 bg-white" viewBox="0 0 100 100" preserveAspectRatio="none">
              <!-- Crisp black vertical lines of various thicknesses on a white background -->
              <rect x="5" width="6" height="100" fill="black" />
              <rect x="15" width="2" height="100" fill="black" />
              <rect x="22" width="4" height="100" fill="black" />
              <rect x="30" width="8" height="100" fill="black" />
              <rect x="42" width="2" height="100" fill="black" />
              <rect x="48" width="6" height="100" fill="black" />
              <rect x="58" width="4" height="100" fill="black" />
              <rect x="66" width="2" height="100" fill="black" />
              <rect x="72" width="8" height="100" fill="black" />
              <rect x="84" width="2" height="100" fill="black" />
              <rect x="90" width="4" height="100" fill="black" />
            </svg>
            <span class="vertical-text-side">DN-${ticketNumber}</span>
          </div>
        </div>

        <!-- Vertical Stripe -->
        <div class="ticket-colored-banner">
          <span class="ticket-vertical-text">SAVE THE DATE</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-5 w-full max-w-[380px] flex flex-col gap-2">
      <button id="share-ticket-btn" class="btn-action w-full text-sm flex items-center justify-center gap-2">
        ${isEn ? "📤 Share VIP Date Ticket" : "📤 Bagikan Tiket Kencan VIP"}
      </button>
      <button id="back-home-btn" class="btn-ghost w-full text-xs py-2">
        ${isEn ? "Back to Home" : "Kembali ke Home"}
      </button>
    </div>
  </div>

  <!-- Custom Modal for adding activity -->
  <div id="activity-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[300] opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-slate-200 transform scale-95 transition-transform duration-300" id="activity-modal-content">
      <h3 class="font-fredoka text-base font-bold text-slate-800 mb-1">${isEn ? "Add Activity 🎸" : "Tambah Kegiatan 🎸"}</h3>
      <p class="text-[10px] text-slate-500 mb-4">${isEn ? "What else do you suggest? Enter emoji and activity name~" : "Kamu mau ngajak ngapain lagi? Ketik emoji dan nama kegiatannya ya~"}</p>
      
      <div class="space-y-3 mb-5 text-left">
        <div>
          <label class="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">${isEn ? "Emoji (e.g. 🏊 or 🍔)" : "Emoji (cth: 🏊 atau 🍔)"}</label>
          <input type="text" id="modal-act-emoji" value="💖" class="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-center text-xl focus:outline-none focus:border-slate-800 bg-white">
        </div>
        <div>
          <label class="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">${isEn ? "Activity Name" : "Nama Kegiatan"}</label>
          <input type="text" id="modal-act-label" placeholder="${isEn ? "Bowling / Sushi Dinner" : "Main Bowling / Makan Sushi"}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 bg-white" maxlength="25">
        </div>
      </div>
      
      <div class="flex gap-2">
        <button id="modal-act-cancel" class="btn-ghost flex-1 text-xs py-2 px-3">${isEn ? "Cancel" : "Batal"}</button>
        <button id="modal-act-save" class="btn-action flex-1 text-xs py-2 px-3">${isEn ? "Save" : "Simpan"}</button>
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
      d.className = 'w-2 h-2 rounded-full bg-slate-300 transition-all duration-300';
      navDotsEl.appendChild(d);
    });

    function updateNav() {
      const dots = navDotsEl.children;
      const vi = VISIBLE.indexOf(CHAPTERS[currentIdx]);
      Array.from(dots).forEach((d, i) => {
        d.className = i === vi
          ? 'w-4 h-2 rounded-full bg-slate-800 transition-all duration-300'
          : 'w-2 h-2 rounded-full bg-slate-300 transition-all duration-300';
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
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.4 }, colors: ['#3b82f6','#ef4444','#10b981','#8b5cf6'] });
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

    // ── Inject Couple Photo (Left / Intro) ──
    const introPhotoWrap = document.getElementById('intro-photo-wrap');
    const ticketPhotoWrap = document.getElementById('ticket-photo-container');

    // Photo 1 (Front/Intro)
    if (PHOTOS && PHOTOS.length > 0 && PHOTOS[0].src) {
      introPhotoWrap.innerHTML = \`
        <div class="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md">
          <img src="\${PHOTOS[0].src}" class="w-full h-full object-cover">
        </div>\`;
    } else {
      introPhotoWrap.innerHTML = \`
        <div class="w-36 h-36 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-4xl bg-slate-50">
          💑
        </div>\`;
    }

    // Photo 2 (Ticket) - fallback to Photo 1 if not present
    if (PHOTOS && PHOTOS.length > 0) {
      const ticketPhoto = (PHOTOS.length > 1 && PHOTOS[1].src) ? PHOTOS[1].src : PHOTOS[0].src;
      ticketPhotoWrap.innerHTML = \`<img src="\${ticketPhoto}" class="w-full h-full object-cover">\`;
    } else {
      ticketPhotoWrap.innerHTML = \`<div class="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
        <span class="text-3xl mb-1">💑</span>
        <span class="text-[8px] font-mono tracking-widest uppercase">VIP TICKET</span>
      </div>\`;
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
        errEl.textContent = 'Kode akses tidak cocok~ 🎟️';
        codeInput.value = ''; codeInput.style.borderColor = '#ef4444';
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
          <p class="text-sm font-bold text-slate-800">\${dateText}</p>
          <p class="text-[10px] text-slate-400">Opsi Kunjungan #\${index + 1} 🎤</p>
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
    selectedTime = timeInputEl.value;
    timeInputEl.addEventListener('input', () => {
      selectedTime = timeInputEl.value;
      checkDateReady();
    });

    const dateNextBtn = document.getElementById('date-next-btn');
    function checkDateReady() {
      const ready = selectedDate && selectedTime;
      dateNextBtn.disabled = !ready;
      if (ready) {
        dateNextBtn.className = 'btn-action w-full text-sm';
        dateNextBtn.textContent = isEn ? 'Confirm Visit Date 👍' : 'Konfirmasi Tanggal Kunjungan 👍';
      } else {
        dateNextBtn.className = 'btn-action w-full text-sm opacity-50 cursor-not-allowed';
        dateNextBtn.textContent = isEn ? 'Select Date First 🥺' : 'Pilih Tanggal Terlebih Dahulu 🥺';
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
        <p class="text-[10px] font-semibold text-slate-700 leading-tight">\${act.label}</p>
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

    // Render presets & customs
    ALL_ACTIVITIES.forEach(act => {
      activityGrid.appendChild(createActivityCard(act));
    });

    // Recipient dynamic custom activity modal setup
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
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

    modalSave.addEventListener('click', () => {
      const emojiVal = (modalEmoji.value || '').trim() || "💖";
      const labelVal = (modalLabel.value || '').trim();
      
      if (labelVal) {
        const newAct = { emoji: emojiVal, label: labelVal };
        ALL_ACTIVITIES.push(newAct);
        
        const newCard = createActivityCard(newAct);
        activityGrid.insertBefore(newCard, recipientAddCard);
        
        newCard.click();
        totalCustomCount++;
        hideModal();
        renderRecipientCustomButton();
      } else {
        modalLabel.style.borderColor = '#ef4444';
        setTimeout(() => { modalLabel.style.borderColor = ''; }, 1000);
      }
    });

    let recipientAddCard = null;
    function renderRecipientCustomButton() {
      if (recipientAddCard) recipientAddCard.remove();
      if (totalCustomCount >= 5) return;

      recipientAddCard = document.createElement('div');
      recipientAddCard.className = 'activity-card border-dashed bg-slate-50 flex flex-col items-center justify-center p-2 min-h-[75px]';
      recipientAddCard.innerHTML = \`
        <div class="text-xl mb-0.5">➕</div>
        <p class="text-[9px] font-bold text-slate-400">\${isEn ? "Add Custom" : "Tambah Sendiri"}</p>
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
        activityNextBtn.className = 'btn-action w-full text-sm';
        activityNextBtn.textContent = isEn 
          ? \`Proceed with \${selectedActivities.length} activities! 🎸\`
          : \`Lanjut dengan \${selectedActivities.length} setlist kegiatan! 🎸\`;
      } else {
        activityNextBtn.className = 'btn-action w-full text-sm opacity-50 cursor-not-allowed';
        activityNextBtn.textContent = isEn ? 'Select at least 1 Activity 🎸' : 'Pilih Minimal 1 Kegiatan 🎸';
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

    // Split date string into Month Number, Day, Year for concert stub
    function parseDateToStub(dateStr) {
      const months = {
        januari: 1, jan: 1, january: 1,
        februari: 2, feb: 2, february: 2,
        maret: 3, mar: 3, march: 3,
        april: 4, apr: 4,
        mei: 5, may: 5,
        juni: 6, jun: 6, june: 6,
        juli: 7, jul: 7, july: 7,
        agustus: 8, agu: 8, aug: 8, august: 8,
        september: 9, sep: 9,
        oktober: 10, okt: 10, oct: 10, october: 10,
        november: 11, nov: 11,
        desember: 12, des: 12, dec: 12, december: 12
      };
      
      const cleaned = dateStr.toLowerCase().replace(/,/g, '');
      const parts = cleaned.split(/\s+/);
      let day = "12";
      let month = "7";
      let year = new Date().getFullYear().toString();

      // Check DD-MM-YYYY or DD/MM/YYYY
      const dmyMatch = dateStr.match(/(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})/);
      if (dmyMatch) {
        return { month: parseInt(dmyMatch[2]).toString(), day: parseInt(dmyMatch[1]).toString(), year: dmyMatch[3] };
      }

      parts.forEach(p => {
        const val = parseInt(p);
        if (!isNaN(val)) {
          if (val > 31) year = val.toString();
          else if (val > 0) day = val.toString();
        } else if (months[p]) {
          month = months[p].toString();
        }
      });
      return { month, day, year };
    }

    function parseSelectedDate() {
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
      
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 7);
      fallback.setHours(h, m, 0, 0);
      return fallback;
    }

    function startCountdown() {
      const target = parseSelectedDate();
      document.getElementById('countdown-date-label').textContent = selectedDate + (isEn ? ' · Time ' : ' · Jam ') + selectedTime;

      if (countdownInterval) clearInterval(countdownInterval);

      function tick() {
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) {
          document.getElementById('cd-days').textContent = '00';
          document.getElementById('cd-hours').textContent = '00';
          document.getElementById('cd-mins').textContent = '00';
          document.getElementById('cd-secs').textContent = '00';
          document.getElementById('countdown-msg').textContent = isEn ? 'SHOW TIME!! 🎤🎸🎉' : 'SAATNYA SHOW!! 🎤🎸🎉';
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
          document.getElementById('countdown-msg').textContent = isEn ? 'Concert starts soon! Ready? 🎸' : 'Bentar lagi konser dimulai! Udah siap? 🎸';
        } else if (days <= 3) {
          document.getElementById('countdown-msg').textContent = isEn ? 'Show date is near! So hyped! 💥' : 'Show date sudah dekat! Hype-nya dapet banget! 💥';
        } else {
          document.getElementById('countdown-msg').textContent = isEn ? 'Counting down... dress up nice! 💕' : 'Hitung mundur terus... jangan lupa dandan rapi! 💕';
        }
      }

      tick();
      countdownInterval = setInterval(tick, 1000);
    }

    document.getElementById('countdown-next-btn').addEventListener('click', () => {
      goTo(CHAPTERS.indexOf('ch-ticket'));
    });

    // ── Populate Concert Ticket ──
    function populateTicket() {
      // 1. Date stub (Seat = Day, Row = Month, Section = Year)
      const stub = parseDateToStub(selectedDate);
      document.getElementById('ticket-seat').textContent = stub.day;
      document.getElementById('ticket-row').textContent = stub.month;
      document.getElementById('ticket-section').textContent = stub.year;

      // 2. Time & Agenda info
      document.getElementById('ticket-time').textContent = (isEn ? 'TIME ' : 'JAM ') + selectedTime;
      document.getElementById('ticket-agenda').textContent = selectedActivities.join(', ');

      // 3. User Note / Reply
      if (replyMessage) {
        document.getElementById('ticket-note-wrap').classList.remove('hidden');
        document.getElementById('ticket-note').textContent = replyMessage;
      } else {
        document.getElementById('ticket-note-wrap').classList.add('hidden');
      }

      // 4. Location and Website URL (reference style)
      const rawLocation = ${JSON.stringify(config.favoriteMoments?.[9] || "")};
      document.getElementById('ticket-location').textContent = (rawLocation || "PARIS, FRANCE").toUpperCase();
      
      const fromClean = ${JSON.stringify(config.fromName)}.toLowerCase().replace(/[^a-z0-9]/g, '');
      const toClean = ${JSON.stringify(config.toName)}.toLowerCase().replace(/[^a-z0-9]/g, '');
      document.getElementById('ticket-website').textContent = fromClean + toClean + '.dearnote.com';
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
        title: isEn ? 'VIP Date Ticket 🎫' : 'Tiket Kencan VIP 🎫',
        text: isEn 
          ? \`Our VIP concert date ticket is ready! Date: \${selectedDate} at \${selectedTime} 💕 Check here!\`
          : \`Tiket konser kencan VIP kita sudah terbit! Tanggal: \${selectedDate} jam \${selectedTime} 💕 Cek di sini!\`,
        url: shareUrl.toString()
      };
      try {
        if (navigator.share) await navigator.share(shareData);
        else {
          await navigator.clipboard.writeText(shareUrl.toString());
          alert(isEn ? 'Ticket link copied! Send it to them 🎫' : 'Link tiket berhasil disalin! Kirim ke dia ya 🎫');
        }
      } catch {
        await navigator.clipboard.writeText(shareUrl.toString());
        alert(isEn ? 'Ticket link copied! 🎫' : 'Link tiket berhasil disalin! 🎫');
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
        h.textContent = ['💕','🎫','✨','💖','🎸'][Math.floor(Math.random()*5)];
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
