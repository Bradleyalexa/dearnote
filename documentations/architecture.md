# ARCHITECTURE.md — DearNote

## 1. System Overview

DearNote is a no-account paid static card generator.

The system has 4 main parts:

```txt
Next.js App on Vercel
↓
Next.js API Route Handlers
↓
DOKU Checkout + Webhook
↓
Cloudflare R2 Static Storage
```

Final cards are not server-rendered. Final cards are static files stored and served from Cloudflare R2.

## 2. Domains

Main app:

```txt
https://dearnote.asia
```

Public card storage:

```txt
https://pub.dearnote.asia
```

Webhook endpoint:

```txt
https://dearnote.asia/api/webhooks/doku
```

Example card URL:

```txt
https://pub.dearnote.asia/cards/card_8f2a9c12/index.html
```

## 3. Tech Stack

### Frontend + Backend

```txt
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Vercel
```

### API

```txt
Next.js Route Handlers
```

### Storage

```txt
Cloudflare R2
```

### Payment

```txt
DOKU Checkout
```

### Renderer

```txt
Static HTML
config.json
CSS animation
JavaScript animation
Lottie optional
```

### QR

```txt
qrcode package
```

### Database

```txt
None
```

### Auth

```txt
None
```

## 4. High-Level Flow

```txt
User creates card on dearnote.asia/create
↓
Frontend uploads assets to R2 pending area
↓
Frontend submits draft to /api/orders
↓
API creates DOKU checkout
↓
User pays via DOKU
↓
DOKU sends webhook to /api/webhooks/doku
↓
API verifies payment
↓
API publishes static card to R2
↓
User opens card from pub.dearnote.asia
```

## 5. Runtime Responsibilities

### Vercel / Next.js

Responsible for:

* Landing page
* Card builder UI
* Preview UI
* Create order API
* Upload URL API
* DOKU webhook API
* Order status API
* Static card publishing function

Not responsible for:

* Serving final card traffic
* Serving public card photos
* Serving public card voice notes

### Cloudflare R2

Responsible for:

* Temporary uploads
* Pending order drafts
* Published static cards
* Photos
* Voice notes
* QR files
* Order JSON
* Webhook event logs

### DOKU

Responsible for:

* Checkout page
* Payment collection
* Payment channel handling
* Payment webhook notification

## 6. R2 Bucket Structure

Bucket:

```txt
dearnote-prod
```

Recommended staging bucket:

```txt
dearnote-staging
```

Folder structure:

```txt
orders/
  order_{orderId}.json

pending/
  order_{orderId}/
    draft.json
    assets/
      photo-1.webp
      photo-2.webp
      photo-3.webp
      photo-4.webp
      photo-5.webp
      voice-note.mp3

cards/
  card_{cardId}/
    index.html
    config.json
    qr.svg
    qr.png
    status.json
    assets/
      photo-1.webp
      photo-2.webp
      photo-3.webp
      photo-4.webp
      photo-5.webp
      voice-note.mp3

events/
  doku/
    order_{orderId}/
      webhook_{timestamp}.json
```

## 7. Data Objects

### 7.1 Order JSON

Path:

```txt
orders/order_{orderId}.json
```

Example:

```json
{
  "orderId": "order_9Kx2aP",
  "cardId": "card_8f2a9c12",
  "amount": 3000,
  "currency": "IDR",
  "paymentGroup": "qris_ewallet",
  "status": "pending_payment",
  "paymentProvider": "doku",
  "paymentUrl": "https://checkout.doku.com/...",
  "createdAt": "2026-06-11T10:00:00.000Z",
  "updatedAt": "2026-06-11T10:00:00.000Z"
}
```

### 7.2 Draft JSON

Path:

```txt
pending/order_{orderId}/draft.json
```

Example:

```json
{
  "template": "flower_secret_letter",
  "fromName": "Ardi",
  "toName": "Nadya",
  "secretCode": "1402",
  "letterTitle": "For You",
  "letterBody": "Aku cuma mau bilang...",
  "photos": [
    {
      "key": "pending/order_9Kx2aP/assets/photo-1.webp",
      "caption": "Our first memory"
    }
  ],
  "voiceNote": {
    "key": "pending/order_9Kx2aP/assets/voice-note.mp3",
    "durationSeconds": 42
  },
  "finalMessage": "I love you."
}
```

### 7.3 Published Config JSON

Path:

```txt
cards/card_{cardId}/config.json
```

Example:

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
      "caption": "Our first memory"
    }
  ],
  "voiceNote": {
    "src": "./assets/voice-note.mp3",
    "durationSeconds": 42
  },
  "finalMessage": "I love you.",
  "publishedAt": "2026-06-11T10:05:00.000Z",
  "expiresAt": "2026-12-08T10:05:00.000Z"
}
```

### 7.4 Status JSON

Path:

```txt
cards/card_{cardId}/status.json
```

Example:

```json
{
  "cardId": "card_8f2a9c12",
  "orderId": "order_9Kx2aP",
  "status": "published",
  "url": "https://pub.dearnote.asia/cards/card_8f2a9c12/index.html",
  "publishedAt": "2026-06-11T10:05:00.000Z",
  "expiresAt": "2026-12-08T10:05:00.000Z"
}
```

## 8. API Routes

### 8.1 `POST /api/upload-url`

Purpose:

Create pre-signed upload URL for direct upload to R2.

Request:

```json
{
  "fileName": "photo-1.jpg",
  "contentType": "image/webp",
  "fileSize": 850000,
  "kind": "photo"
}
```

Response:

```json
{
  "uploadUrl": "https://...",
  "key": "pending_uploads/tmp_abc/photo-1.webp"
}
```

Validation:

* Allow only image/audio MIME types.
* Reject SVG.
* Enforce max file size.
* Enforce max photo count on order creation.
* Upload path must be generated server-side.

### 8.2 `POST /api/orders`

Purpose:

Create order and DOKU checkout.

Request:

```json
{
  "paymentGroup": "qris_ewallet",
  "draft": {
    "template": "flower_secret_letter",
    "fromName": "Ardi",
    "toName": "Nadya",
    "secretCode": "1402",
    "letterTitle": "For You",
    "letterBody": "Aku cuma mau bilang...",
    "photos": [],
    "voiceNote": null,
    "finalMessage": "I love you."
  }
}
```

Payment group rules:

```txt
qris_ewallet → Rp5.000
bank_card → Rp8.000
```

Response:

```json
{
  "orderId": "order_9Kx2aP",
  "cardId": "card_8f2a9c12",
  "amount": 3000,
  "currency": "IDR",
  "paymentUrl": "https://checkout.doku.com/..."
}
```

Route responsibilities:

* Validate draft.
* Validate payment group.
* Calculate amount server-side.
* Generate order ID.
* Generate card ID.
* Save draft to R2.
* Save order JSON to R2.
* Create DOKU checkout.
* Return payment URL.

### 8.3 `GET /api/orders/[orderId]`

Purpose:

Return order status for success page polling.

Response when pending:

```json
{
  "orderId": "order_9Kx2aP",
  "status": "pending_payment"
}
```

Response when published:

```json
{
  "orderId": "order_9Kx2aP",
  "status": "published",
  "cardUrl": "https://pub.dearnote.asia/cards/card_8f2a9c12/index.html",
  "qrPngUrl": "https://pub.dearnote.asia/cards/card_8f2a9c12/qr.png",
  "qrSvgUrl": "https://pub.dearnote.asia/cards/card_8f2a9c12/qr.svg"
}
```

### 8.4 `POST /api/webhooks/doku`

Purpose:

Receive DOKU payment notification.

Responsibilities:

* Read raw request body.
* Store raw webhook to R2.
* Verify DOKU signature.
* Extract order ID.
* Load order JSON from R2.
* Validate amount.
* Validate currency.
* Validate payment status.
* Check idempotency.
* Update order to paid.
* Publish card.
* Return HTTP 200.

Webhook idempotency:

```txt
If order is already published:
  return 200
  do not republish
```

## 9. Publisher Module

Publisher is an internal code module, not a separate server.

Path:

```txt
src/lib/publisher/publish-card.ts
```

Function:

```txt
publishCard(orderId)
```

Responsibilities:

```txt
1. Load order JSON from R2
2. Load pending draft from R2
3. Validate order is paid
4. Generate public card URL
5. Generate config.json
6. Generate index.html
7. Generate qr.svg
8. Generate qr.png
9. Copy assets from pending/ to cards/
10. Write status.json
11. Update order JSON to published
```

## 10. Static Renderer

A published card contains `index.html`.

The HTML can either:

1. Inline renderer JS/CSS directly.
2. Load shared renderer from R2.

Release recommendation:

```txt
Use inline/simple renderer first for reliability.
```

Minimum `index.html` behavior:

```txt
Load ./config.json
Render selected template
Show opening screen
Ask for cosmetic secret code
Play reveal animation
Render letter
Render photos
Render voice note player
Render final message
```

Audio rule:

```txt
Do not rely on autoplay.
Require user interaction first.
```

## 11. Templates

Template keys:

```txt
flower_secret_letter
polaroid_memory_note
moonlight_voice_letter
```

Renderer must switch based on `config.template`.

Example:

```ts
switch (config.template) {
  case "flower_secret_letter":
    renderFlowerSecretLetter(config)
    break
  case "polaroid_memory_note":
    renderPolaroidMemoryNote(config)
    break
  case "moonlight_voice_letter":
    renderMoonlightVoiceLetter(config)
    break
}
```

## 12. Environment Variables

Local:

```txt
.env.local
```

Vercel:

```txt
Project Settings → Environment Variables
```

Required:

```env
APP_URL=https://dearnote.asia
PUBLIC_CARD_BASE_URL=https://pub.dearnote.asia

R2_ACCOUNT_ID=
R2_BUCKET=dearnote-prod
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

DOKU_ENV=sandbox
DOKU_CLIENT_ID=
DOKU_SECRET_KEY=
DOKU_API_BASE_URL=

CARD_PRICE_QRIS_EWALLET_IDR=3000
CARD_PRICE_BANK_CARD_IDR=8000

ADMIN_SECRET=
```

Do not expose these to frontend:

```txt
R2_SECRET_ACCESS_KEY
DOKU_SECRET_KEY
ADMIN_SECRET
```

Allowed public env:

```env
NEXT_PUBLIC_APP_URL=https://dearnote.asia
NEXT_PUBLIC_PUBLIC_CARD_BASE_URL=https://pub.dearnote.asia
NEXT_PUBLIC_CARD_PRICE_QRIS_EWALLET_IDR=3000
NEXT_PUBLIC_CARD_PRICE_BANK_CARD_IDR=8000
```

## 13. Security Rules

### Payment

* Never trust frontend amount.
* Calculate price server-side.
* Verify DOKU webhook signature.
* Validate payment status.
* Validate order ID.
* Validate amount.
* Validate currency.
* Make webhook idempotent.
* Store raw webhook events.

### Uploads

* Reject unsupported file types.
* Reject SVG.
* Enforce file size limits.
* Enforce max 5 photos.
* Enforce voice note max size/duration.
* Prefer client-side image compression.
* Generate upload keys server-side.

### R2

* Use least-privilege R2 credentials.
* Do not expose R2 write credentials to frontend.
* Public bucket/subdomain should only expose final published cards.
* Pending folders should not be publicly listed.
* Use unguessable card IDs and order IDs.

### App

* Add rate limiting later if abused.
* Add Turnstile later if spam appears.
* Keep admin endpoints behind `ADMIN_SECRET`.

## 14. Expiry Handling

Each card expires 90 days after publish.

Publish module must calculate:

```txt
expiresAt = publishedAt + 90 days
```

Expiry can be handled by:

* Manual cleanup initially.
* Later scheduled cleanup.
* Expired card replacement page.

Minimum release requirement:

```txt
Write expiresAt to config.json and status.json.
```

## 15. Deployment

### Vercel

Hosts:

```txt
dearnote.asia
```

Routes:

```txt
/
/create
/success/[orderId]
/api/upload-url
/api/orders
/api/orders/[orderId]
/api/webhooks/doku
```

### Cloudflare R2

Hosts:

```txt
pub.dearnote.asia
```

Serves:

```txt
/cards/{cardId}/index.html
/cards/{cardId}/config.json
/cards/{cardId}/qr.png
/cards/{cardId}/qr.svg
/cards/{cardId}/assets/*
```

## 16. Repository Structure

```txt
dearnote/
  app/
    page.tsx
    create/
      page.tsx
    success/
      [orderId]/
        page.tsx
    api/
      upload-url/
        route.ts
      orders/
        route.ts
        [orderId]/
          route.ts
      webhooks/
        doku/
          route.ts

  src/
    components/
      builder/
        CardBuilder.tsx
        PhotoUploader.tsx
        VoiceNoteUploader.tsx
        PaymentGroupSelector.tsx
      preview/
        CardPreview.tsx
      ui/

    lib/
      doku/
        create-checkout.ts
        verify-webhook.ts
        check-status.ts
        types.ts

      r2/
        client.ts
        put-json.ts
        get-json.ts
        put-object.ts
        copy-object.ts
        signed-upload-url.ts

      publisher/
        publish-card.ts
        generate-index-html.ts
        generate-config.ts
        generate-qr.ts
        templates/
          flower-secret-letter.ts
          polaroid-memory-note.ts
          moonlight-voice-letter.ts

      schemas/
        card-draft.ts
        order.ts
        payment.ts

      utils/
        ids.ts
        dates.ts
        money.ts
        files.ts

  public/
    images/
    lottie/

  PRD.md
  ARCHITECTURE.md
  TODO.md
  .env.example
```

## 17. Build Strategy

Recommended order:

```txt
1. Build local static renderer
2. Build builder UI
3. Build R2 upload
4. Build publish test without payment
5. Build DOKU checkout
6. Build webhook publish
7. Build success page polling
8. Deploy production
```

Do not begin with payment first.

The first technical proof should be:

```txt
Draft data
↓
Generated static card
↓
Uploaded to R2
↓
Opened from pub.dearnote.asia
```
