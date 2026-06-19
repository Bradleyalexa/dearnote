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
  switch (config.template) {
    case "classic_editorial":
      return generateClassicEditorialHtml(config);
    case "polaroid_scrapbook":
    // "polaroid_scrapbook" key kept for backward-compat, maps to scrapbook design
    case "scrapbook":
      return generateScrapbookHtml(config);
    case "pink_book_folds":
      return generatePinkBookFoldsHtml(config);
    case "apology_letter":
      return generateApologyLetterHtml(config);
    case "open_when_cards":
      return generateOpenWhenCardsHtml(config);
    case "nocturnal_journal":
      return generateNocturnalJournalHtml(config);
    case "gift_box_reveal":
      return generateGiftBoxRevealHtml(config);
    case "playful_gift":
      return generatePlayfulGiftHtml(config);
    case "playful_dog":
      return generatePlayfulDogHtml(config);
    case "playful_pooh":
      return generatePlayfulPoohHtml(config);
    case "eternal_love":
      return generateEternalLoveHtml(config);
    case "birthday_magic":
      return generateBirthdayMagicHtml(config);
    case "blooming_note":
      return generateBloomingNoteHtml(config);
    case "graduation_note":
      return generateGraduationNoteHtml(config);
    case "graduation_memory_lane":
      return generateGraduationMemoryLaneHtml(config);
    default:
      return generateClassicEditorialHtml(config);
  }
}
