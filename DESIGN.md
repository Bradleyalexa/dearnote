---
name: DearNote Keepsake System
colors:
  surface: '#f9f9ff'
  primary: '#725b38'
  secondary: '#615e58'
  background: '#f9f9ff'
  ink: '#111827'
  paper-base: '#FDFCF8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
rounded:
  DEFAULT: 0.25rem
  xl: 0.75rem
spacing:
  gutter: 24px
  unit: 8px
---

# DearNote Custom Letter Creator: Unified Design System & UX Flows

DearNote templates prioritize emotional unboxing pacing: unlock codes, wax-sealed envelope breaks, typewriter reveals, and interactive character/audio elements.

## 1. Standard Page Sequence (Struktur Halaman/Tampilan)

Every keepsake card design follows a strict sequence of views (pages) to build anticipation (pacing):

### View 1: Secret Code Gate (Halaman Kunci Kode Akses)
- **Purpose**: Privacy and anticipation.
- **Layout**: Centered card overlay with a lock icon, descriptive text, text input for passkey, and an unlock button.
- **Transition**: Entering correct code triggers a circular wipe mask (clip-path circle) that dissolves the gate and reveals View 2.

### View 2: Envelope / Cover Reveal (Halaman Amplop / Pembuka)
- **Purpose**: Physical unboxing metaphor.
- **Layout**: Centered physical envelope container (340x220px) with recipient's name. A 3D wax seal sits at the center.
- **Transition**: Clicking the envelope/seal breaks the wax seal (halves slide apart and rotate) and opens the flap. The letter then slides out and rises into View 3.

### View 3: Main Keepsake Letter (Halaman Surat Utama)
- **Purpose**: The emotional core of the keepsake.
- **Layout**: Large editorial paper sheet with title, sender/recipient headers, and body text.
- **Behavior**: The body text types out character-by-character (~25ms). Only after typing completes do the media elements (View 4) fade in.

### View 4: Media Gallery & Closing (Galeri Media & Penutup)
- **Purpose**: Curated stories and final notes.
- **Layout**: Photo collage/grid and a custom voice note cassette or waveform player.
- **Behavior**: Polaroid photos tilt slightly. Clicking a photo opens a medium-sized modal with backdrop blur. Ends with a large italicized final message.

---

## 2. Interactive UX Flows by Archetype

### A. Sealed Letter Flow (e.g., classic_editorial, apology_letter)
1. User sees Code Gate -> Enters passkey.
2. Code Gate dissolves -> Envelope is displayed with a 3D Wax Seal.
3. User taps Wax Seal -> Seal splits in half, rotates, and fades out. Envelope flap rotates open.
4. Keepsake card slides upwards out of the envelope and expands to fill the reading container.
5. Text types out character-by-character.
6. Photo grid, voice note player, and signature card fade in sequentially.

### B. Playful Character Flow (e.g., playful_dog, playful_pooh)
1. User sees Code Gate -> Enters passkey.
2. Screen opens to show an interactive character canvas (e.g., Shiba Dog or Winnie the Pooh sleeping).
3. Speech bubble says: "Zzz... Tap to wake me up!"
4. User taps character -> character wakes up (wags tail, barks, or yawns).
5. Interactive control panel fades in: [Pet Head], [Give Bone/Honey], [Throw Ball/Bee].
6. Tapping toys plays animations (e.g., dog eats bone, wiggles tail fast) and updates speech bubbles.
7. An animated "Read Letter" CTA button bounces into view.
8. Tapping the button slides up a bottom-sheet (82vh height) containing the letter, handwritten text, audio capsule, and photo gallery.

### C. Open When Cards Flow (e.g., open_when_cards)
1. User opens page -> Sees a grid of closed envelopes, each labeled with a specific mood or moment (e.g., "Open when you miss me").
2. User clicks an envelope -> The envelope flips 180 degrees using CSS 3D transforms to reveal its inner content card.
3. The content card contains a unique text message, photo collage, or audio note.
4. User can close the card to return to the envelope deck.

### D. Gift Box Reveal Flow (e.g., gift_box_reveal, playful_gift)
1. User opens page -> Sees a 3D gift box wrapped in ribbon.
2. User drags or clicks the ribbon -> The ribbon pulls away and unties.
3. Gift box lid pops off and rises, followed by a burst of colorful confetti.
4. The box sides drop open to reveal the letter card inside.
5. The letter card rises and expands for reading.

---

## 3. Template Catalog (15 Core Templates)
1. eternal_love: Cinematic couples journal, heart particles, firework finale. [Romantic]
2. classic_editorial: Elegant stationery, cream linen paper, gold leaf double borders. [Minimalist]
3. nocturnal_journal: Dark starry sky, quiet slate tones, typing cursor. [Minimalist]
4. apology_letter: Envelope with gold wax seal, handwritten text on ivory paper. [Minimalist]
5. scrapbook: Brown leather binder, draggable polaroids, washi tape. [Romantic]
6. pink_book_folds: Spiral notebook, 3D page flip, spinning cassette. [Romantic]
7. open_when_cards: Grid of envelopes flipping open on click. [Interactive]
8. gift_box_reveal: 3D gift box with ribbon drag, popping lid, confetti. [Interactive]
9. playful_gift: Pastel pink box, helium balloons, rising bubbles. [Playful]
10. playful_dog: Interactive sleeping Shiba Inu; feed bone, throw ball, pet head. [Playful]
11. playful_pooh: Sleepy Pooh bear waking to eat honey and chase bees. [Playful]
12. birthday_magic: Balloon pops, birthday cake (click to blow candle), fireworks. [Playful]
13. blooming_note: Sprouting vines and procedurally blooming wildflowers. [Playful]
14. graduation_note: Navy/gold, diploma scroll opening on ribbon drag, caps throw. [Interactive]
15. graduation_memory_lane: Single-page gold/cream, memory grid, P.S. paper stack card. [Interactive]
