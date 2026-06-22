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
    default:
      html = generateClassicEditorialHtml(config);
  }
  return injectTailwindWarningSuppress(html);
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
