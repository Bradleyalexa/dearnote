# PRD.md — DearNote

## 1. Product Overview

**DearNote** adalah no-account romantic digital card builder untuk membuat kartu/surat digital interaktif yang bisa dibuka lewat link. User membuat kartu, upload foto/voice note, membayar, lalu sistem mem-publish kartu sebagai static HTML yang bisa diakses publik selama 180 hari.

Domain utama:

```txt
dearnote.asia
```

Public card domain:

```txt
pub.dearnote.asia
```

Contoh public card URL:

```txt
https://pub.dearnote.asia/cards/card_8f2a9c/index.html
```

## 2. Product Positioning

DearNote bukan Canva clone. DearNote adalah:

> Fast romantic note builder for couples — create a beautiful animated digital note, pay once, and share instantly.

User tidak perlu login, tidak perlu membuat akun, dan tidak perlu dashboard.

## 3. Target Users

Primary users:

* Pasangan yang ingin mengirim surprise digital.
* Orang yang ingin membuat hadiah ulang tahun/anniversary sederhana.
* User impulsif yang ingin membuat kartu romantis cepat dari HP.
* User yang ingin mengirim link lewat WhatsApp, Instagram DM, atau QR.

Primary recipient:

* Pasangan, crush, teman dekat, atau orang spesial yang menerima link kartu.

## 4. Core Value Proposition

DearNote memungkinkan user membuat kartu romantis interaktif dalam beberapa menit:

```txt
Create note
Upload memories
Add voice note
Pay
Share link
```

Produk harus terasa:

* Cepat
* Romantis
* Mobile-first
* Personal
* Mudah dibuat
* Mudah dibagikan
* Tidak ribet login

## 5. Release Scope

Release pertama langsung mencakup fitur utama berikut:

### Included

* No account creation.
* No login.
* No database.
* No Supabase.
* Static card output.
* Payment gateway via DOKU.
* Storage via Cloudflare R2.
* 3 card templates.
* Max 5 photos per card.
* Voice note allowed.
* Cosmetic secret code.
* No edit after publish.
* Card expiry 180 days.
* No watermark.
* Public static URL.
* QR code generation.
* Mobile-first builder.
* Mobile-first recipient experience.

### Excluded

* User account.
* Login.
* Dashboard.
* Edit after publish.
* Real password privacy.
* Real private link protection.
* Template marketplace.
* AI writing assistant.
* Video upload.
* Custom domain per card.
* Refund automation.
* Admin UI.
* Searchable order dashboard.
* Database-backed analytics.
* Card comments/replies.

## 6. Pricing

DearNote uses two pricing groups based on payment method.

### QRIS & E-wallets

```txt
Price: Rp3.000 per card
```

Allowed payment methods:

* QRIS
* E-wallets supported by DOKU

### Banks / Cards

```txt
Price: Rp8.000 per card
```

Allowed payment methods:

* Bank transfer / virtual account
* Credit/debit card
* Other bank/card-based methods supported by DOKU

### Pricing Rule

User must choose payment method group before checkout:

```txt
QRIS / E-wallets → Rp3.000
Banks / Cards → Rp8.000
```

The backend must generate the payment amount based on selected payment group.

Frontend must not be trusted for price calculation.

## 7. User Flow

### 7.1 Main Creation Flow

```txt
User opens dearnote.asia
↓
User clicks Create Note
↓
User selects template
↓
User fills From / To
↓
User writes message
↓
User sets cosmetic secret code
↓
User uploads up to 5 photos
↓
User optionally uploads voice note
↓
User previews card
↓
User selects payment group
↓
User clicks Pay & Publish
↓
Backend creates DOKU payment
↓
User completes payment
↓
DOKU sends webhook
↓
Backend verifies payment
↓
Backend publishes static card to R2
↓
User receives public card URL
```

### 7.2 Recipient Flow

```txt
Recipient opens public card URL
↓
Card loads static HTML
↓
Card loads config.json
↓
Recipient sees opening screen
↓
Recipient enters cosmetic secret code
↓
Card reveal animation starts
↓
Recipient reads letter
↓
Recipient views photos
↓
Recipient plays voice note
```

## 8. Public URL Format

Final public URL:

```txt
https://pub.dearnote.asia/cards/{cardId}/index.html
```

Example:

```txt
https://pub.dearnote.asia/cards/card_8f2a9c12/index.html
```

URL requirements:

* `cardId` must be random and unguessable enough.
* URL does not need pretty slug in release.
* URL can include `/index.html`.
* Anyone with the URL can access the card.
* Cards should not be indexed by search engines.

## 9. Card Expiry

Each published card expires after:

```txt
180 days
```

Expiry behavior:

* The card remains accessible for 180 days after publish.
* After 180 days, the card may show an expired page or be deleted from R2.
* The system should store `expiresAt` in `status.json`.
* Automated cleanup can be manual initially, but data must include expiry metadata.

Example status:

```json
{
  "cardId": "card_8f2a9c12",
  "status": "published",
  "publishedAt": "2026-06-11T10:00:00.000Z",
  "expiresAt": "2026-12-08T10:00:00.000Z"
}
```

## 10. Templates

Release must include 3 templates.

### Template 1 — Flower Secret Letter

Theme:

* Soft pink
* Flowers
* Bloom animation
* Secret code opening
* Envelope reveal
* Typewriter letter
* Photo memory section
* Voice note section

Use case:

* Anniversary
* Valentine
* Romantic confession
* Birthday for partner

Flow:

```txt
Opening petals
↓
From / To card
↓
Secret code
↓
Flower bloom
↓
Envelope opens
↓
Letter appears
↓
Photos appear
↓
Voice note
↓
Final message
```

### Template 2 — Polaroid Memory Note

Theme:

* Polaroid photos
* Warm paper texture
* Scrapbook style
* Floating cards
* Casual handwritten feel

Use case:

* Memory recap
* Friendship note
* Couple timeline
* Birthday note

Flow:

```txt
Cover note
↓
Secret code
↓
Polaroids scatter in
↓
Letter section
↓
Photo captions
↓
Voice note
↓
Final note
```

### Template 3 — Moonlight Voice Letter

Theme:

* Night sky
* Moonlight
* Stars
* Calm romantic vibe
* Voice note as emotional highlight

Use case:

* Long distance relationship
* Apology note
* Deep love letter
* Missing someone

Flow:

```txt
Night sky opening
↓
From / To
↓
Secret code
↓
Stars reveal
↓
Letter appears
↓
Photos fade in
↓
Voice note player
↓
Moonlight ending
```

## 11. Builder Requirements

### Required Fields

* Template
* From name
* To name
* Letter body
* Payment group

### Optional Fields

* Secret code
* Letter title
* Photos
* Photo captions
* Voice note
* Final message

### Field Limits

```txt
From name: max 40 chars
To name: max 40 chars
Secret code: max 12 chars
Letter title: max 80 chars
Letter body: max 3000 chars
Final message: max 300 chars
Photos: max 5
Photo caption: max 120 chars each
Voice note: max 60 seconds
Voice note file size: max 5 MB
```

### Upload Limits

Photos:

```txt
Max photos: 5
Allowed: jpg, jpeg, png, webp
Recommended output: webp
Max compressed size per photo: 1 MB
```

Voice note:

```txt
Allowed: mp3, m4a, webm, wav
Max duration: 60 seconds
Max file size: 5 MB
```

SVG uploads must not be allowed.

## 12. Secret Code

Secret code is cosmetic only.

This means:

* The code is used for emotional reveal UX.
* The code does not provide real security.
* Card content may exist in `config.json`.
* Anyone technical with the link may inspect the content.

Frontend copy should avoid promising strong privacy.

Acceptable text:

```txt
Enter the secret code to open this note.
```

Avoid:

```txt
This card is securely encrypted.
```

## 13. Payment Requirements

Payment provider:

```txt
DOKU
```

Payment integration style:

```txt
DOKU Checkout
```

Backend responsibilities:

* Create DOKU checkout/payment.
* Set amount based on selected payment group.
* Verify DOKU webhook.
* Check payment status.
* Check payment amount.
* Publish card only after payment success.

### Payment Groups

```txt
qris_ewallet → Rp3.000
bank_card → Rp8.000
```

### Payment Statuses

Internal statuses:

```txt
draft_created
pending_payment
paid
publishing
published
payment_failed
payment_expired
publish_failed
```

### Payment Validation Rules

On webhook:

* Verify webhook signature.
* Validate order exists.
* Validate amount matches order amount.
* Validate currency is IDR.
* Validate status is paid/success/settled.
* Ensure idempotency.
* Do not publish duplicate cards for same order.

## 14. Static Card Requirements

A published card must include:

```txt
index.html
config.json
qr.svg
qr.png
status.json
assets/
  photo-1.webp
  photo-2.webp
  voice-note.mp3
```

Minimum `config.json`:

```json
{
  "cardId": "card_8f2a9c12",
  "template": "flower_secret_letter",
  "fromName": "Ardi",
  "toName": "Nadya",
  "secretCode": "1402",
  "letterTitle": "For You",
  "letterBody": "Aku cuma mau bilang...",
  "photos": [
    {
      "src": "./assets/photo-1.webp",
      "caption": "Our first photo"
    }
  ],
  "voiceNote": {
    "src": "./assets/voice-note.mp3"
  },
  "finalMessage": "I love you.",
  "publishedAt": "2026-06-11T10:00:00.000Z",
  "expiresAt": "2026-12-08T10:00:00.000Z"
}
```

## 15. QR Code Requirements

Each published card must generate:

```txt
qr.svg
qr.png
```

QR should encode the final card URL:

```txt
https://pub.dearnote.asia/cards/{cardId}/index.html
```

User should see:

* Copy link button
* Download QR PNG
* Download QR SVG

## 16. No Watermark

Since all cards are paid, there must be:

```txt
No watermark
```

Do not show:

* Powered by watermark on card content
* Branding overlay on photos
* Locked sections

Small footer branding is allowed only if subtle and not watermark-like.

Example acceptable footer:

```txt
Made with DearNote
```

This should not obstruct content.

## 17. No Edit After Publish

Published cards cannot be edited.

Reason:

* No account.
* No dashboard.
* No database.
* Simpler payment/publish model.
* Lower support burden.

If user wants changes, they must create and pay for a new card.

Frontend must communicate:

```txt
After payment and publish, this card cannot be edited.
```

## 18. Data Storage

There is no database.

Cloudflare R2 is used as:

* Temporary draft storage
* Temporary asset storage
* Published static card storage
* Order JSON storage
* Payment event storage

R2 is the source of truth.

## 19. Operational Requirements

### Required Pages

```txt
/
 /create
 /success/[orderId]
```

Optional:

```txt
/terms
/privacy
/contact
```

### Required API Routes

```txt
POST /api/upload-url
POST /api/orders
GET  /api/orders/[orderId]
POST /api/webhooks/doku
```

Optional admin/debug routes:

```txt
GET  /api/admin/orders/[orderId]
POST /api/admin/orders/[orderId]/republish
POST /api/admin/orders/[orderId]/check-payment
```

Admin routes must require `ADMIN_SECRET`.

## 20. Error States

The product must handle:

* Payment pending
* Payment failed
* Payment expired
* Webhook delayed
* Publish failed
* Upload failed
* File too large
* Unsupported file type
* Card expired
* Card not found

## 21. Acceptance Criteria

A release is complete when:

* User can create card without login.
* User can select 1 of 3 templates.
* User can upload up to 5 photos.
* User can upload a voice note.
* User can preview card on mobile.
* User can choose QRIS/e-wallet payment for Rp3.000.
* User can choose bank/card payment for Rp8.000.
* DOKU checkout is created successfully.
* Payment success webhook is verified.
* Payment success publishes static card to R2.
* Published card opens from public URL.
* Published card loads photos and voice note.
* QR code opens same card URL.
* Card status includes 180-day expiry.
* No watermark appears on paid card.
* No account/auth/database is required.

## 22. Success Metrics

Core metrics:

```txt
Create page visits
Started card creation
Completed preview
Started payment
Payment success
Published card
Opened published card
Voice note played
QR downloaded
```

Business metrics:

```txt
Payment conversion rate
Revenue per payment group
Publish failure rate
Average creation time
Card open rate
```

## 23. Risks

### Payment verification risk

Mitigation:

* Verify webhook signature.
* Validate amount.
* Store raw webhook events.
* Make publish idempotent.

### No database risk

Mitigation:

* Store order/status JSON in R2.
* Use predictable folder structure.
* Add admin debug endpoints.
* Upgrade to database only when needed.

### No account risk

Mitigation:

* Tell user to save link.
* Show link and QR clearly after publish.
* No edit after publish.

### File size risk

Mitigation:

* Compress photos before upload.
* Enforce max file size.
* Limit to 5 photos.
* Limit voice note duration.

### Browser audio autoplay risk

Mitigation:

* Use “Tap to open” before playing audio.
* Do not rely on autoplay.

## 24. Release Decision

DearNote release is approved for build with:

```txt
Domain: dearnote.asia
Frontend/backend: Next.js on Vercel
API: Next.js Route Handlers
Storage: Cloudflare R2
Payment: DOKU Checkout
Database: none
Auth: none
Card output: static HTML
Price: Rp3.000 / Rp8.000 based on payment group
Expiry: 180 days
Templates: 3
```
