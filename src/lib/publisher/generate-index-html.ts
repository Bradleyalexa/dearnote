import { PublishedConfig } from "../schemas/card-draft";
import { generateClassicEditorialHtml } from "./templates/classic-editorial";
import { generateScrapbookHtml } from "./templates/scrapbook";
import { generatePinkBookFoldsHtml } from "./templates/pink-book-folds";
import { generateApologyLetterHtml } from "./templates/apology-letter";
import { generateOpenWhenCardsHtml } from "./templates/open-when-cards";
import { generateNocturnalJournalHtml } from "./templates/nocturnal-journal";
import { generateGiftBoxRevealHtml } from "./templates/gift-box-reveal";
import { generatePlayfulGiftHtml } from "./templates/playful-gift";
import { generatePlayfulDogHtml } from "./templates/playful-dog";
import { generatePlayfulPoohHtml } from "./templates/playful-pooh";
import { generateEternalLoveHtml } from "./templates/eternal-love";
import { generateBirthdayMagicHtml } from "./templates/birthday-magic";
import { generateBloomingNoteHtml } from "./templates/blooming-note";
import { generateGraduationNoteHtml } from "./templates/graduation-note";
import { generateGraduationMemoryLaneHtml } from "./templates/graduation-memory-lane";
import { generateSweetCradleHtml } from "./templates/sweet-cradle";
import { generateTenderWelcomeHtml } from "./templates/tender-welcome";
import { generateChristmasMagicHtml } from "./templates/christmas-magic";
import { generateRamadhanBlessingsHtml } from "./templates/ramadhan-blessings";
import { generateMothersDayHtml } from "./templates/mothers-day";
import { generateHerbariumBookHtml } from "./templates/herbarium-book";
import { generateTeachersDayHtml } from "./templates/teachers-day";
import { generateFathersDayHtml } from "./templates/fathers-day";
import { generateCuteApologyHtml } from "./templates/cute-apology";
import { generateFarewellKeepsakeHtml } from "./templates/farewell-keepsake";
import { generateEvasiveConfessionHtml } from "./templates/evasive-confession";
import { generatePlayfulCatHtml } from "./templates/playful-cat";
import { generateAnniversaryScrapbookHtml } from "./templates/anniversary-scrapbook";
import { generateBoyfriendPermitHtml } from "./templates/boyfriend-permit";
import { generateDateInvitationHtml } from "./templates/date-invitation";
import { generateDateTicketHtml } from "./templates/date-ticket";
import { generateSelfieDetectorHtml } from "./templates/selfie-detector";
import { generateSelfieRequestHtml } from "./templates/selfie-request";

/**
 * Main coordinator that returns the HTML page content based on the selected template.
 *
 * Template ID mapping:
 *  classic_editorial   → Classic Editorial (serif, cream paper, dust particles)
 *  polaroid_scrapbook  → Scrapbook – brown leather binder (alias kept for backward compat)
 *  scrapbook           → Scrapbook – brown leather binder, drag-and-drop polaroids, washi tape
 *  pink_book_folds     → Pink Book Folds – cute 3D pastel binder, per-click page-flip
 *  apology_letter      → Apology Letter – sealed envelope, wax seal, sincere minimal serif
 *  open_when_cards     → Open When Cards – flip card grid, one card per letter/photo/quote
 *  nocturnal_journal   → Nocturnal Journal (dark starry night, minimal)
 *  gift_box_reveal     → Gift Box Reveal (3D unwrapping, confetti)
 *  playful_gift        → Playful Cute Gift (pastel gift box, balloons, bounce effect)
 *  playful_dog         → Playful Dog (CSS Shiba animated dog, interactive toys)
 *  playful_pooh        → Playful Pooh (CSS Winnie the Pooh, honey pot eating, bees)
 *  eternal_love        → Eternal Love (romantic rose garden, elegant serif)
 *  birthday_magic      → Birthday Magic (colorful celebration, cake and balloons)
 *  blooming_note       → Blooming Note (floral garden, sprouting flowers, nature theme)
 *  graduation_note     → Graduation Note (premium navy & gold, diploma scroll, confetti celebration)
 *  evasive_confession  → Evasive Confession (pink retro Windows 95 confession dialog, 4 mini-games)
 */
export function generateIndexHtml(config: PublishedConfig): string {
  let html = "";
  switch (config.template) {
    case "classic_editorial":
      html = generateClassicEditorialHtml(config);
      break;
    case "polaroid_scrapbook":
    // "polaroid_scrapbook" key kept for backward-compat, maps to scrapbook design
    case "scrapbook":
      html = generateScrapbookHtml(config);
      break;
    case "pink_book_folds":
      html = generatePinkBookFoldsHtml(config);
      break;
    case "apology_letter":
      html = generateApologyLetterHtml(config);
      break;
    case "open_when_cards":
      html = generateOpenWhenCardsHtml(config);
      break;
    case "nocturnal_journal":
      html = generateNocturnalJournalHtml(config);
      break;
    case "gift_box_reveal":
      html = generateGiftBoxRevealHtml(config);
      break;
    case "playful_gift":
      html = generatePlayfulGiftHtml(config);
      break;
    case "playful_dog":
      html = generatePlayfulDogHtml(config);
      break;
    case "playful_pooh":
      html = generatePlayfulPoohHtml(config);
      break;
    case "eternal_love":
      html = generateEternalLoveHtml(config);
      break;
    case "anniversary_scrapbook":
      html = generateAnniversaryScrapbookHtml(config);
      break;
    case "boyfriend_permit":
      html = generateBoyfriendPermitHtml(config);
      break;
    case "date_invitation":
      html = generateDateInvitationHtml(config);
      break;
    case "date_ticket":
      html = generateDateTicketHtml(config);
      break;
    case "selfie_detector":
      html = generateSelfieDetectorHtml(config);
      break;
    case "selfie_request":
      html = generateSelfieRequestHtml(config);
      break;
    case "birthday_magic":
      html = generateBirthdayMagicHtml(config);
      break;
    case "blooming_note":
      html = generateBloomingNoteHtml(config);
      break;
    case "graduation_note":
      html = generateGraduationNoteHtml(config);
      break;
    case "graduation_memory_lane":
      html = generateGraduationMemoryLaneHtml(config);
      break;
    case "sweet_cradle":
      html = generateSweetCradleHtml(config);
      break;
    case "tender_welcome":
      html = generateTenderWelcomeHtml(config);
      break;
    case "christmas_magic":
      html = generateChristmasMagicHtml(config);
      break;
    case "ramadhan_blessings":
      html = generateRamadhanBlessingsHtml(config);
      break;
    case "mothers_day":
      html = generateMothersDayHtml(config);
      break;
    case "herbarium_book":
      html = generateHerbariumBookHtml(config);
      break;
    case "teachers_day":
      html = generateTeachersDayHtml(config);
      break;
    case "fathers_day":
      html = generateFathersDayHtml(config);
      break;
    case "cute_apology":
      html = generateCuteApologyHtml(config);
      break;
    case "farewell_keepsake":
      html = generateFarewellKeepsakeHtml(config);
      break;
    case "evasive_confession":
      html = generateEvasiveConfessionHtml(config);
      break;
    case "playful_cat":
      html = generatePlayfulCatHtml(config);
      break;
    default:
      html = generateClassicEditorialHtml(config);
  }
  html = injectTailwindWarningSuppress(html);
  if (config.lang === "en") {
    html = injectEnglishTranslationScript(html);
  }
  return html;
}

export function injectTailwindWarningSuppress(html: string): string {
  if (!html) return html;
  const suppressScript = `
  <!-- Suppress Tailwind Play CDN production warning -->
  <script>
    (function() {
      const origWarn = console.warn;
      console.warn = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return;
        if (typeof origWarn === 'function') origWarn.apply(console, args);
      };
      const origLog = console.log;
      console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return;
        if (typeof origLog === 'function') origLog.apply(console, args);
      };
    })();
  </script>
  <!-- Enforce no horizontal scrolling, wrap long text, and enlarge photo captions globally -->
  <style>
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw;
    }
    /* Wrap long words / force wrapping on all letter body, note, journal, and paragraph text containers */
    p, span, div, h1, h2, h3, h4, h5, h6, 
    .letter-body, .lined-journal-area, .notebook-journal-text, 
    #letter-body, #letter-body-content, #typewriter-text {
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      word-break: break-word !important;
    }
    /* Make photo captions larger and ensure they wrap instead of truncating */
    .polaroid-caption, .editorial-caption, .yearbook-caption, 
    .corkboard-polaroid p, .polaroid-card p, .polaroid-frame p {
      font-size: 13px !important;
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: clip !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      line-height: 1.4 !important;
    }
    /* Adjust handwriting/script font sizes specifically */
    .font-handwriting, .font-script {
      font-size: 14px !important;
    }
  </style>\n`;
  if (html.includes("<head>")) {
    return html.replace("<head>", "<head>" + suppressScript);
  }
  return suppressScript + html;
}

function injectEnglishTranslationScript(html: string): string {
  const translationScript = `
  <!-- Runtime English Translation Script for ID/EN -->
  <script>
    (function() {
      const dict = {
        // Keepsakes and Journals
        "keepsake jurnal guru dari": "Teacher's Keepsake Journal from",
        "keepsake jurnal ayah dari": "Father's Keepsake Journal from",
        "buka jurnal": "Open Journal",
        "tekuk kancing kuningan untuk membuka": "Bend the brass button to open",
        
        // Ramadhan blessings
        "buka ketupat": "Open Ketupat",
        "buka galeri": "Open Gallery",
        "ketupat terbuka! menemukan kenangan...": "Ketupat opened! Finding memories...",
        "tepak bedug": "Beat the Bedug",
        "tabuh bedug 3 kali untuk menyuarakan takbir": "Beat the bedug drum 3 times to sound the takbir",
        "bedug ditabuh! selamat hari raya!": "Bedug beaten! Happy Eid!",
        "ketuk ketupat 3 kali untuk mengurai janurnya": "Tap the ketupat 3 times to unwrap the leaves",
        "syahdu melodies": "Serene Melodies",
        "nikmati musik latar yang telah disiapkan": "Enjoy the background music prepared for you",
        
        // Playful cat
        "ada paket misterius untukmu! 📦 ketuk untuk membukanya...": "There is a mysterious package for you! 📦 Tap to open it...",
        "buka paket": "Open Package",
        "kena kau! hahaha cakaranku cepat kan? 😼✨": "Gotcha! Hahaha my scratch is fast, right? 😼✨",
        "ayam? daging? bukan, ini biskuit ikan kesukaanku! 🐟✨": "Chicken? Beef? No, this is my favorite fish cookie! 🐟✨",
        "nyam nyam crunch... enak sekali! meow~ purr~ 🍽️🥰": "Yum yum crunch... So delicious! Meow~ Purr~ 🍽️🥰",
        "purrr... nyaman sekali... usap lagi kepala ku... 🥰": "Purrr... So cozy... Rub my head again... 🥰",
        "wah, aku sayang kamu! ini pesan rahasia terindah... 🧶🎉": "Aww, I love you! Here is the most beautiful secret message... 🧶🎉",
        "meter kasih sayang:": "Affection Meter:",
        "main laser": "Play Laser",
        "beri ikan": "Feed Fish",
        "manjakan": "Pet Kitty",
        "nyaaa~ halo! aku manis sekali kan? ayo bermain denganku! 🐾": "Nyaaa~ Hello! Aren't I cute? Come play with me! 🐾",
        "nyaaa~ halo! aku manis sekali kan? ayo bermain denganku!": "Nyaaa~ Hello! Aren't I cute? Come play with me!",
        "wah, ada bintik merah! tangkap dia! 🔴🐾": "Oh, a red dot! Catch it! 🔴🐾",
        "wah, ada bintik merah! tangkap dia!": "Oh, a red dot! Catch it!",
        "usap kepala ku pelan-pelan ya... meow~ 🥰": "Rub my head gently... Meow~ 🥰",
        "ayo main denganku lagi! meow~ 🐾": "Come play with me again! Meow~ 🐾",
        "ayo main denganku lagi!": "Come play with me again!",
        
        // Mother's Day & Herbarium Book
        "ketuk untuk membuka": "Tap to Open",
        "untuk ibu": "For Mom",
        "tercinta": "Dearest",
        "dear mama": "Dear Mom",
        "voice note untuk mama": "Voice Note for Mom",
        "galeri cinta mama": "Mom's Love Gallery",
        "mama adalah taman bunga terindah kami": "Mom is our most beautiful flower garden",
        "kantong surat mama": "Mom's Letter Pocket",
        "p.s. untuk mama...": "P.S. For Mom...",
        "terima kasih sudah mencintaiku tanpa syarat dan merawatku dengan penuh kesabaran, ma. selamat hari ibu! ❤️": "Thank you for loving me unconditionally and raising me with absolute patience, Mom. Happy Mother's Day! ❤️",
        "galeri kenangan kita": "Our Memories Gallery",
        "pesan terakhir": "Final Message",
        "kantong pesan rahasia": "Secret Message Pocket",
        "ketuk amplop": "Tap the Envelope",
        "— dari yang selalu mengingatmu": "— From the one who always remembers you",
        "— dari buah hati tercinta": "— From your beloved child",
        "ketuk kantong surat di atas untuk membaca pesan rahasia...": "Tap the letter pocket above to read the secret message...",
        "ketuk kantong surat di atas": "Tap the letter pocket above",
        "untuk membaca pesan rahasia": "to read the secret message",
        
        // Farewell Keepsake & Evasive Confession
        "buka pesan": "Open Message",
        "ketuk segel untuk membuka": "Tap seal to open",
        
        // Cute Apology
        "buka surat": "Open Letter",
        "ketuk plester luka untuk membuka": "Tap Band-Aid to Open",
        "maaf terkumpul! silakan buka halaman selanjutnya 💕": "Apology gathered! Please open the next page 💕",
        "maafin aku ya,": "please forgive me,",
        "maafin aku ya": "please forgive me",
        "sayang?": "my love?",
        "sayang": "my love",
        "sesajen maaf untukmu": "Forgiveness Offerings for You",
        "sesajen maaf": "Forgiveness Offerings",
        "ketuk sesajen boba/pelukan di bawah untuk menaikkan indikator hati!": "Tap the boba/hug offerings below to increase the heart meter!",
        "boba milk tea": "Boba Milk Tea",
        "pereda amarah instan.": "Instant anger reliever.",
        "diterima": "ACCEPTED",
        "cokelat manis": "Sweet Chocolate",
        "peningkat hormon bahagia.": "Happy hormone booster.",
        "pelukan erat": "Tight Hug",
        "pelukan hangat penenang.": "Warm comforting hug.",
        "bunga cantik": "Beautiful Flowers",
        "simbol ketulusan hatiku.": "Symbol of my heart's sincerity.",
        "indikator maaf:": "Forgiveness Meter:",
        "surat maafku": "My Apology Letter",
        "galeri sorryyy": "Apologies Gallery",
        "jangan marah lama-lama ya...": "Don't stay mad for too long...",
        "penyembuh hati": "Heart Healer",
        "ketuk teddy bear": "Tap the Teddy Bear",
        "ketuk boneka beruang": "Tap the Teddy Bear",
        "aku minta maaf...": "I am sorry...",
        "aku tahu aku salah. tolong maafkan aku ya? aku janji bakal dengerin kamu lebih baik lagi ke depannya. love you so much! ❤️": "I know I was wrong. Please forgive me? I promise to listen to you better in the future. Love you so much! ❤️",
        "— dari kekasihmu yang menyesal": "— From your regretful partner",
        
        // Navigation / Pagination
        "foto selanjutnya": "Next Photo",
        "halaman selanjutnya": "Next Page",
        "halaman sebelumnya": "Previous Page",
        "selanjutnya": "Next",
        "sebelumnya": "Previous",
        
        // Special Messages & Gating
        "pesan spesial untukmu": "special message for you",
        "pesan spesial": "special message",
        "untukmu": "for you",
        "selesaikan game pembuka untuk membuka surat": "complete the opening game to open the letter",
        "selesaikan game pembuka untuk membuka catatan": "complete the opening game to open the note",
        "selesaikan game pembuka untuk membuka kado": "complete the opening game to open the gift",
        "selesaikan game pembuka": "complete the opening game",
        "selesaikan game": "complete the game",
        "game pembuka": "opening game",
        "pembuka": "opening",
        "membuka surat": "open the letter",
        "membuka catatan": "open the note",
        "membuka jurnal": "open the journal",
        "membuka amplop": "open the envelope",
        "membuka kado": "open the gift",
        "membukanya": "opening it",
        "membuka": "open",
        "masukkan kode akses": "enter access code",
        "masukkan kode": "enter code",
        "terkunci. masukkan kode akses": "is locked. enter access code",
        "buka amplop": "open envelope",
        "buka kado": "open gift",
        "buka catatan": "open note",
        "buka": "open",
        
        // Music & Voice Notes
        "mulai musik": "play music",
        "putar musik": "play music",
        "hentikan musik": "pause music",
        "putar pesan suara": "play voice note",
        "pesan suara dari": "voice note from",
        "pesan suara": "voice note",
        "suara": "voice",
        "dari:": "from:",
        "untuk:": "to:",
        "untuk": "to",
        "kembali": "back",
        "tutup": "close",
        "klik untuk membuka": "click to open",
        "klik untuk buka": "click to open",
        "silakan masukkan kode akses": "please enter the access code",
        "salah": "incorrect",
        "akses ditolak": "access denied",
        "kode akses salah": "incorrect access code",
        
        // Games (Evasive Confession)
        "cakar kucing": "cat paw",
        "capit boneka": "claw machine",
        "kupas selotip": "peel tape",
        "tangkap hati": "catch hearts",
        "towel cakar kucing imut": "poke cute cat paws",
        "capit boneka cinta": "catch love dolls",
        "kupas selotip washi tape": "peel off washi tape",
        "tangkap hati jatuh": "catch falling hearts",
        "maafin aku ya": "please forgive me",
        "selamat ulang tahun": "happy birthday",
        "selamat hari raya": "happy EId",
        "selamat wisuda": "happy graduation",
        "hari jadi": "anniversary",
        "hari ayah": "father's day",
        "hari ibu": "mother's day",
        "hari guru": "teacher's day",
        "p.s.": "p.s.",
        
        // Claw Machine Specifics
        "bantu aku capit bonekanya!": "help me catch the toy!",
        "percobaan:": "attempt:",
        "percobaan": "attempt",
        "mesin bergerak...": "machine moving...",
        "sekali lagi pasti bisa!": "one more try!",
        "kalau ga kecapit auto gagal": "if it slips, it's game over",
        "gagal: licin banget bonekanya!": "failed: the toy is so slippery!",
        "gagal lagi: lepas lagi pas di atas...": "failed again: dropped at the top...",
        "yeeaaayyy! bonekanya berhasil ketangkap!": "YEEAAAYYY! Caught the toy!",
        "licin!": "slippery!",
        "aduhh!": "ouch!",
        "hampirrr!": "almost!",
        "lepas!": "dropped!",
        "kena mental!": "so close!",
        "kok licin?!": "why is it so slippery?!",
        "dapet!": "got it!",
        "horee!": "hooray!",
        "yeeaay!": "yey!",
        "capit lagi! 🕹️": "GRAB AGAIN! 🕹️",
        "capit lagi! 😤": "GRAB AGAIN! 😤",
        "capit lagi!": "GRAB AGAIN!",
        "percobaan terakhir! 🕹️": "LAST ATTEMPT! 🕹️",
        "percobaan terakhir!": "LAST ATTEMPT!",
        "sekali lagi!! 😭": "ONE MORE TRY!! 😭",
        "sekali lagi!!": "ONE MORE TRY!!",
        "sekali lagi": "one more try",
        "mencapit...": "GRABBING...",
        "mencapit": "grabbing",
        "😱 hampir kena!! tapi... lepas??": "😱 Almost got it!! But... it escaped??",
        "😭 kecapit tapi jatuh lagi huhu": "😭 Grabbed but dropped again huhu",
        "🎉 yesss!! bonekanya berhasil dicapit!!": "🎉 YESSS!! Successfully grabbed the toy!!",
        "⚙️ mesin bergerak...": "⚙️ Machine moving...",
        "⚙️ sekali lagi pasti bisa!": "⚙️ One more try!",
        "⚙️ kalau ga kecapit auto gagal": "⚙️ If it slips, it's game over",
        "capit!": "GRAB!",
        
        // Cat Paw Specifics
        "towel:": "tap:",
        "towel": "tap",
        "game towel cakar kucing": "Cat Paw Tapping Game",
        "towel cakar kucing di bawah 5 kali!": "Tap the cat paw below 5 times!",
        
        // Washi Tape Specifics
        "strip selotip 1": "Tape Strip 1",
        "strip selotip 2": "Tape Strip 2",
        "strip selotip 3": "Tape Strip 3",
        "strip selotip": "tape strip",
        "kupas 3 pita selotip di atas!": "Peel off the 3 tape strips above!",
        "ketuk hati untuk buka surat!": "Tap heart to open the letter!",
        
        // Catch Hearts Specifics
        "tangkap hati:": "CATCH HEARTS:",
        "seret basket ke kiri/kanan": "Drag Basket Left/Right",
        
        // Confession Modal Specifics
        "surat catatan cinta": "Love Letter Diary",
        "pesan penting dari": "Important Message From",
        "ada pesan penting dari": "There is an important message from",
        "kamu mau gak jadi pacarku?": "would you like to be my partner?",
        "terma kasih sudah memilihku untuk menjadi kebahagiaanmu. i love you!": "thank you for choosing me to be your happiness. i love you!",
        "gak 🙈": "no 🙈",
        "mau! 💕": "yes! 💕",
        
        // Father's Day Specifics
        "jurnal spesial": "Special Journal",
        "selamat hari ayah!": "Happy Father's Day!",
        "papan penghargaan ayah": "Dad's Appreciation Board",
        "dad's stamp collection": "Dad's Stamp Collection",
        "ketuk lencana di bawah untuk menyematkan stempel penghargaan emas!": "Tap the badges below to stamp a golden award!",
        "bisa memperbaiki segala hal.": "Can fix anything.",
        "pecinta seduhan kopi sejati.": "True coffee lover.",
        "raja tebak-tebakan garing.": "King of corny dad jokes.",
        "pelindung terhebat kami.": "Our greatest protector.",
        "surat untuk ayah": "Letter to Dad",
        "pesan suara untuk ayah": "Voice Note for Dad",
        "meja kenangan": "Desk of Memories",
        "galeri foto bersama ayah": "Photo Gallery with Dad",
        "setiap kenangan adalah harta berharga": "Every memory is a priceless treasure",
        "waktu bersama ayah": "Time with Dad",
        "jam saku kenangan": "Memory Pocket Watch",
        "ketuk jam saku": "Tap the Pocket Watch",
        "terima kasih, ayah...": "Thank You, Dad...",
        "terima kasih atas segala cinta, perlindungan, dan nasihat bijak yang selalu menuntun hidupku. jasa dan pengorbananmu tidak akan pernah terlupakan! ❤️": "Thank you for all the love, protection, and wise advice that always guides my life. Your sacrifices will never be forgotten! ❤️",
        "— dari anakmu yang menyayangimu": "— From your loving child",
        
        // Teacher's Day Specifics
        "papan tulis guru": "Teacher's Chalkboard",
        "terima kasih, guruku!": "Thank You, My Teacher!",
        "terima kasih,": "Thank you,",
        "terima kasih": "Thank you",
        "guruku!": "my teacher!",
        "guruku": "my teacher",
        "sapu papan tulis dengan penghapus": "Swipe chalkboard with eraser",
        "sapu papan tulis dengan penghapus ↵": "Swipe chalkboard with eraser ↵",
        "sapu papan tulis dengan penghapus \darr;": "Swipe chalkboard with eraser \darr;",
        "sapu papan tulis dengan penghapus &darr;": "Swipe chalkboard with eraser &darr;",
        "rapor guru terhebat": "Best Teacher Report Card",
        "teacher appreciation card": "Teacher Appreciation Card",
        "ketuk kolom penilaian untuk membubuhkan stempel penghargaan a+ emas!": "Tap evaluation columns to stamp a golden A+!",
        "aspek evaluasi": "Evaluation Aspect",
        "predikat": "Grade",
        "1. kesabaran (patience)": "1. Patience",
        "selalu tenang mendengarkan.": "Always listening calmly.",
        "2. penjelasan (clarity)": "2. Clarity",
        "materi sulit jadi mudah dimengerti.": "Making difficult things easy to understand.",
        "3. inspirasi (inspiration)": "3. Inspiration",
        "memotivasi kami meraih impian.": "Motivating us to achieve our dreams.",
        "4. kepedulian (kindness)": "4. Kindness",
        "selalu tersenyum & mendukung kami.": "Always smiling and supporting us.",
        "jurnal terima kasih": "Thank You Journal",
        "pesan suara khusus": "Special Voice Greeting",
        "mading kelas": "Class Corkboard",
        "dokumentasi kenangan kita": "Our Memories Gallery",
        "setiap bimbingan adalah bekal masa depan": "Every guidance is a gift for the future",
        "hadiah kelulusan": "Graduation Gift",
        "sebuah apel untuk guru": "An Apple for Teacher",
        "ketuk apel merah": "Tap the Red Apple",
        "terima kasih, guru...": "Thank You, Teacher...",
        "terima kasih telah menuntun langkahku, mendidikku dengan sabar, dan membukakan jendela dunia bagi masa depanku. jasa bimbinganmu abadi dalam hatiku! 🌟": "Thank you for guiding my steps, teaching me with patience, and opening the window to the world for my future. Your guidance is eternal in my heart! 🌟",
        "— muridmu yang selalu menghormatimu": "— From your ever-respectful student",
        "bukan": "no"
      };

      const sortedKeys = Object.keys(dict).sort(function(a, b) {
        return b.length - a.length;
      });

      function translateNode(node) {
        if (node.nodeType === 3) { // TEXT_NODE
          let text = node.textContent;
          let lower = text.trim().toLowerCase();
          let modified = false;
          for (var i = 0; i < sortedKeys.length; i++) {
            var idText = sortedKeys[i];
            var enText = dict[idText];
            if (lower.includes(idText)) {
              var escapedKey = '';
              for (var j = 0; j < idText.length; j++) {
                var char = idText.charAt(j);
                if ('-[]/{}()*+?.\\\\^$|'.indexOf(char) !== -1) {
                  escapedKey += '\\\\' + char;
                } else {
                  escapedKey += char;
                }
              }
              var regex = new RegExp('(?<![a-zA-Z0-9])' + escapedKey + '(?![a-zA-Z0-9])', 'gi');
              text = text.replace(regex, function(match) {
                if (match === match.toUpperCase()) return enText.toUpperCase();
                if (match[0] === match[0].toUpperCase()) return enText.charAt(0).toUpperCase() + enText.slice(1);
                return enText;
              });
              modified = true;
            }
          }
          if (modified) {
            node.textContent = text;
          }
        } else if (node.nodeType === 1) { // ELEMENT_NODE
          if (node.tagName === 'INPUT' && node.placeholder) {
            let placeholder = node.placeholder;
            let lower = placeholder.trim().toLowerCase();
            let modified = false;
            for (var i = 0; i < sortedKeys.length; i++) {
              var idText = sortedKeys[i];
              var enText = dict[idText];
              if (lower.includes(idText)) {
                var escapedKey = '';
                for (var j = 0; j < idText.length; j++) {
                  var char = idText.charAt(j);
                  if ('-[]/{}()*+?.\\\\^$|'.indexOf(char) !== -1) {
                    escapedKey += '\\\\' + char;
                  } else {
                    escapedKey += char;
                  }
                }
                var regex = new RegExp('(?<![a-zA-Z0-9])' + escapedKey + '(?![a-zA-Z0-9])', 'gi');
                placeholder = placeholder.replace(regex, function(match) {
                  if (match === match.toUpperCase()) return enText.toUpperCase();
                  if (match[0] === match[0].toUpperCase()) return enText.charAt(0).toUpperCase() + enText.slice(1);
                  return enText;
                });
                modified = true;
              }
            }
            if (modified) {
              node.placeholder = placeholder;
            }
          }
          for (let i = 0; i < node.childNodes.length; i++) {
            translateNode(node.childNodes[i]);
          }
        }
      }

      if (document.body) {
        translateNode(document.body);
      } else {
        document.addEventListener("DOMContentLoaded", function() {
          translateNode(document.body);
        });
      }

      const observer = new MutationObserver(function(mutations) {
        observer.disconnect();
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            translateNode(node);
          });
          if (mutation.type === 'characterData') {
            translateNode(mutation.target);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      });

      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      } else {
        document.addEventListener("DOMContentLoaded", function() {
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        });
      }
    })();
  </script>
  `;
  if (html.includes("</body>")) {
    return html.replace("</body>", translationScript + "</body>");
  }
  return html + translationScript;
}
