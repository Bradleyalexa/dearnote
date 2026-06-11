# TODO.md — DearNote Release Checklist

## 0. Product Decisions

* [x] Domain: `dearnote.asia`
* [x] Public card domain: `pub.dearnote.asia`
* [x] No account
* [x] No auth
* [x] No database
* [x] Storage: Cloudflare R2
* [x] Hosting: Vercel
* [x] API: Next.js Route Handlers
* [x] Payment: DOKU Checkout
* [x] QRIS/e-wallet price: Rp3.000
* [x] Bank/card price: Rp8.000
* [x] Max photos: 5
* [x] Voice note: allowed
* [x] Secret code: cosmetic only
* [x] Edit after publish: no
* [x] Card expiry: 180 days
* [x] Watermark: no
* [x] Public URL format: `https://pub.dearnote.asia/cards/{cardId}/index.html`
* [x] Templates: 3

---

## 1. Repository Setup

* [x] Create Next.js app.
* [x] Enable TypeScript.
* [x] Install Tailwind CSS.
* [x] Install shadcn/ui.
* [x] Set up project linting.
* [x] Set up formatting.
* [x] Create `PRD.md`.
* [x] Create `ARCHITECTURE.md`.
* [x] Create `TODO.md`.
* [x] Create `.env.example`.
* [ ] Push repo to GitHub.
* [ ] Connect repo to Vercel.

Suggested packages:

```bash
npm install zod zustand react-hook-form @hookform/resolvers qrcode nanoid
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install framer-motion lottie-react browser-image-compression
```

Optional later:

```bash
npm install sharp
npm install satori
npm install @resvg/resvg-js
```

---

## 2. Environment Setup

### Local Env

* [x] Create `.env.local`.
* [x] Fill app URLs.
* [/] Fill R2 credentials. (Partially completed with Account ID and Endpoint)
* [ ] Fill DOKU sandbox credentials.
* [x] Fill card pricing.
* [ ] Fill admin secret.

Required env:

```env
APP_URL=http://localhost:3000
PUBLIC_CARD_BASE_URL=https://pub.dearnote.asia

R2_ACCOUNT_ID=
R2_BUCKET=dearnote-staging
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=

DOKU_ENV=sandbox
DOKU_CLIENT_ID=
DOKU_SECRET_KEY=
DOKU_API_BASE_URL=

CARD_PRICE_QRIS_EWALLET_IDR=3000
CARD_PRICE_BANK_CARD_IDR=8000

ADMIN_SECRET=
```

### Vercel Env

* [ ] Add staging env variables.
* [ ] Add production env variables.
* [ ] Confirm secrets are not prefixed with `NEXT_PUBLIC_`.
* [ ] Add public env variables only when safe.

---

## 3. Domain Setup

### Vercel Domain

* [ ] Point `dearnote.asia` to Vercel.
* [ ] Verify SSL.
* [ ] Confirm `https://dearnote.asia` works.
* [ ] Confirm `/create` route works.

### R2 Public Domain

* [x] Create R2 bucket `dearnote`. (Verified existing)
* [x] Enable managed domain `pub-*.r2.dev` for public object access.
* [/] Connect custom `pub.dearnote.asia` domain (optional for later)
* [x] Verify public object access and set CORS policy.
* [x] Verify connection using test-connection.txt upload and download.
* [x] Decide whether object listing is disabled (disabled by default on public domains for security).

---

## 4. R2 Client Setup

* [ ] Create `src/lib/r2/client.ts`.
* [ ] Create `putObject()` helper.
* [ ] Create `getObject()` helper.
* [ ] Create `putJson()` helper.
* [ ] Create `getJson()` helper.
* [ ] Create `copyObject()` helper.
* [ ] Create `createSignedUploadUrl()` helper.
* [ ] Test local upload to R2.
* [ ] Test local read from R2.
* [ ] Test public URL access.

R2 helper files:

```txt
src/lib/r2/client.ts
src/lib/r2/put-json.ts
src/lib/r2/get-json.ts
src/lib/r2/put-object.ts
src/lib/r2/copy-object.ts
src/lib/r2/signed-upload-url.ts
```

---

## 5. Data Schemas

* [ ] Create `CardDraftSchema`.
* [ ] Create `PhotoSchema`.
* [ ] Create `VoiceNoteSchema`.
* [ ] Create `PaymentGroupSchema`.
* [ ] Create `OrderSchema`.
* [ ] Create `OrderStatusSchema`.
* [ ] Create `PublishedConfigSchema`.

File:

```txt
src/lib/schemas/card-draft.ts
src/lib/schemas/order.ts
src/lib/schemas/payment.ts
```

Card draft requirements:

* [ ] Template must be one of 3 supported templates.
* [ ] From name max 40 chars.
* [ ] To name max 40 chars.
* [ ] Secret code max 12 chars.
* [ ] Letter title max 80 chars.
* [ ] Letter body max 3000 chars.
* [ ] Photos max 5.
* [ ] Photo caption max 120 chars.
* [ ] Voice note optional.
* [ ] Final message max 300 chars.

---

## 6. Static Renderer Proof

Goal:

```txt
Generate local card folder and open index.html in browser.
```

Tasks:

* [ ] Create `generateConfig()`.
* [ ] Create `generateIndexHtml()`.
* [ ] Create basic CSS animation.
* [ ] Create JS logic to load `config.json`.
* [ ] Create cosmetic secret code screen.
* [ ] Create letter reveal.
* [ ] Create photo gallery.
* [ ] Create voice note player.
* [ ] Create final message section.

Local test output:

```txt
.tmp/cards/demo/
  index.html
  config.json
  assets/
```

Acceptance:

* [ ] `index.html` opens locally.
* [ ] Template renders.
* [ ] Secret code screen appears.
* [ ] Reveal animation works.
* [ ] Photos render.
* [ ] Voice note player appears.
* [ ] Mobile viewport looks good.

---

## 7. Templates

### Template 1 — Flower Secret Letter

* [ ] Create template config key: `flower_secret_letter`.
* [ ] Add opening petals animation.
* [ ] Add From / To cover.
* [ ] Add secret code view.
* [ ] Add flower bloom reveal.
* [ ] Add envelope/letter section.
* [ ] Add gallery section.
* [ ] Add voice note section.
* [ ] Add final message.

### Template 2 — Polaroid Memory Note

* [ ] Create template config key: `polaroid_memory_note`.
* [ ] Add scrapbook/paper background.
* [ ] Add polaroid photo layout.
* [ ] Add floating card animation.
* [ ] Add letter section.
* [ ] Add voice note section.
* [ ] Add final message.

### Template 3 — Moonlight Voice Letter

* [ ] Create template config key: `moonlight_voice_letter`.
* [ ] Add night sky background.
* [ ] Add moon/stars animation.
* [ ] Add calm reveal flow.
* [ ] Add letter section.
* [ ] Add photo fade-in.
* [ ] Add voice note highlight.
* [ ] Add final message.

---

## 8. Builder UI

Page:

```txt
/create
```

Tasks:

* [ ] Build template selector.
* [ ] Build From / To form.
* [ ] Build secret code input.
* [ ] Build letter title input.
* [ ] Build letter body input.
* [ ] Build final message input.
* [ ] Build photo uploader.
* [ ] Build photo caption input.
* [ ] Build voice note uploader.
* [ ] Build payment group selector.
* [ ] Build preview area.
* [ ] Build validation messages.
* [ ] Build mobile layout.
* [ ] Build loading states.
* [ ] Build error states.

Payment group selector:

* [ ] QRIS / e-wallets — Rp3.000
* [ ] Banks / cards — Rp8.000

Copy requirement:

```txt
After payment and publish, this card cannot be edited.
```

---

## 9. Upload Flow

Preferred flow:

```txt
Frontend requests signed upload URL
↓
Frontend uploads file directly to R2
↓
Frontend stores returned key in draft
```

Tasks:

* [ ] Build `POST /api/upload-url`.
* [ ] Validate file type.
* [ ] Reject SVG.
* [ ] Validate file size.
* [ ] Generate server-side object key.
* [ ] Return signed upload URL.
* [ ] Upload photo directly to R2.
* [ ] Upload voice note directly to R2.
* [ ] Store uploaded asset keys in local builder state.
* [ ] Preview uploaded assets.

Limits:

* [ ] Max photos: 5.
* [ ] Max compressed photo size: 1 MB.
* [ ] Max voice note size: 5 MB.
* [ ] Max voice note duration: 60 seconds.

---

## 10. Order Creation

Route:

```txt
POST /api/orders
```

Tasks:

* [ ] Validate request body.
* [ ] Validate draft.
* [ ] Validate payment group.
* [ ] Calculate amount server-side.
* [ ] Generate `orderId`.
* [ ] Generate `cardId`.
* [ ] Save `pending/order_{orderId}/draft.json`.
* [ ] Save `orders/order_{orderId}.json`.
* [ ] Create DOKU Checkout.
* [ ] Update order with payment URL/reference.
* [ ] Return payment URL.

Payment amount logic:

```txt
qris_ewallet → 3000
bank_card → 8000
```

Acceptance:

* [ ] Frontend cannot override amount.
* [ ] Invalid payment group rejected.
* [ ] Invalid draft rejected.
* [ ] Order JSON saved to R2.
* [ ] DOKU payment URL returned.

---

## 11. DOKU Integration

* [ ] Create DOKU sandbox account.
* [ ] Get Client ID.
* [ ] Get Secret Key.
* [ ] Configure DOKU Checkout.
* [ ] Configure webhook/notification URL.
* [ ] Create `createDokuCheckout()`.
* [ ] Create `verifyDokuWebhook()`.
* [ ] Create `parseDokuPaymentStatus()`.
* [ ] Create optional `checkDokuStatus()` fallback.
* [ ] Test sandbox payment.
* [ ] Test failed payment.
* [ ] Test expired payment.
* [ ] Test duplicate webhook.

Files:

```txt
src/lib/doku/create-checkout.ts
src/lib/doku/verify-webhook.ts
src/lib/doku/check-status.ts
src/lib/doku/types.ts
```

---

## 12. Webhook Handling

Route:

```txt
POST /api/webhooks/doku
```

Tasks:

* [ ] Read raw request.
* [ ] Store raw event to R2.
* [ ] Verify signature.
* [ ] Extract order ID.
* [ ] Load order JSON.
* [ ] Validate amount.
* [ ] Validate currency.
* [ ] Validate status.
* [ ] If unpaid, update order and return 200.
* [ ] If already published, return 200.
* [ ] If paid, set status to `paid`.
* [ ] Call `publishCard(orderId)`.
* [ ] Return 200.

Idempotency:

* [ ] Same webhook can be received multiple times.
* [ ] Published order must not publish again.
* [ ] Failed publish must be retryable.

---

## 13. Publisher

File:

```txt
src/lib/publisher/publish-card.ts
```

Tasks:

* [ ] Load order.
* [ ] Load draft.
* [ ] Validate paid status.
* [ ] Set status `publishing`.
* [ ] Calculate `publishedAt`.
* [ ] Calculate `expiresAt = publishedAt + 180 days`.
* [ ] Generate `config.json`.
* [ ] Generate `index.html`.
* [ ] Generate `qr.svg`.
* [ ] Generate `qr.png`.
* [ ] Copy assets from pending folder to card folder.
* [ ] Write files to R2.
* [ ] Write `status.json`.
* [ ] Update order status to `published`.
* [ ] Return card URL.

Generated output:

```txt
cards/card_{cardId}/
  index.html
  config.json
  qr.svg
  qr.png
  status.json
  assets/
```

Acceptance:

* [ ] Published card opens from R2 public URL.
* [ ] Photos load.
* [ ] Voice note loads.
* [ ] QR opens card URL.
* [ ] Expiry metadata exists.
* [ ] No watermark appears.

---

## 14. QR Generation

* [ ] Add `qrcode` package.
* [ ] Create `generateQrSvg(url)`.
* [ ] Create `generateQrPng(url)`.
* [ ] Store QR files in card folder.
* [ ] Show QR links on success page.
* [ ] Add download QR PNG button.
* [ ] Add download QR SVG button.

QR target:

```txt
https://pub.dearnote.asia/cards/{cardId}/index.html
```

---

## 15. Success Page

Page:

```txt
/success/[orderId]
```

Tasks:

* [ ] Poll `GET /api/orders/[orderId]`.
* [ ] Show payment pending state.
* [ ] Show publishing state.
* [ ] Show published state.
* [ ] Show failed state.
* [ ] Show card URL.
* [ ] Add copy link button.
* [ ] Add open card button.
* [ ] Add download QR PNG.
* [ ] Add download QR SVG.
* [ ] Remind user to save the link.

Copy:

```txt
Your DearNote is ready. Save this link because there is no account recovery.
```

---

## 16. Landing Page

Page:

```txt
/
```

Sections:

* [ ] Hero.
* [ ] Product demo preview.
* [ ] 3 template cards.
* [ ] How it works.
* [ ] Pricing.
* [ ] FAQ.
* [ ] CTA to create.

Pricing display:

```txt
QRIS & e-wallets: Rp3.000
Banks & cards: Rp8.000
```

FAQ items:

* [ ] Do I need an account?
* [ ] Can I edit after publish?
* [ ] How long is my card active?
* [ ] Is the secret code private?
* [ ] Can I add voice note?
* [ ] How many photos can I upload?

---

## 17. Legal Pages

Minimum:

```txt
/terms
/privacy
```

Terms must mention:

* No account.
* No edit after publish.
* Card active for 180 days.
* Anyone with link can view.
* Secret code is cosmetic.
* User is responsible for uploaded content.
* No illegal/abusive content.

Privacy must mention:

* Uploaded content is stored to create/share the card.
* Payment handled by DOKU.
* No account profile.
* Data may be deleted after expiry.
* Contact method for deletion request.

---

## 18. Admin / Debug

No admin UI needed for release, but add protected debug routes.

Routes:

```txt
GET /api/admin/orders/[orderId]?secret={ADMIN_SECRET}
POST /api/admin/orders/[orderId]/republish?secret={ADMIN_SECRET}
POST /api/admin/orders/[orderId]/check-payment?secret={ADMIN_SECRET}
```

Tasks:

* [ ] Protect with `ADMIN_SECRET`.
* [ ] Fetch order JSON.
* [ ] Fetch draft JSON.
* [ ] Fetch card status.
* [ ] Trigger republish.
* [ ] Trigger payment status check.

---

## 19. Error Handling

Builder errors:

* [ ] Missing required field.
* [ ] Too many photos.
* [ ] Photo too large.
* [ ] Unsupported file type.
* [ ] Voice note too long.
* [ ] Upload failed.

Payment errors:

* [ ] Checkout creation failed.
* [ ] Payment failed.
* [ ] Payment expired.
* [ ] Webhook delayed.
* [ ] Amount mismatch.
* [ ] Signature invalid.

Publish errors:

* [ ] Draft missing.
* [ ] Asset missing.
* [ ] R2 upload failed.
* [ ] QR generation failed.
* [ ] Config generation failed.

Public card errors:

* [ ] Card not found.
* [ ] Config failed to load.
* [ ] Card expired.
* [ ] Audio cannot autoplay.

---

## 20. Security Checklist

* [ ] DOKU secret only server-side.
* [ ] R2 secret only server-side.
* [ ] Admin secret only server-side.
* [ ] Verify DOKU webhook signature.
* [ ] Validate amount server-side.
* [ ] Validate payment group server-side.
* [ ] Validate currency is IDR.
* [ ] Store raw webhook events.
* [ ] Make webhook idempotent.
* [ ] Reject SVG upload.
* [ ] Enforce max file size.
* [ ] Enforce max photo count.
* [ ] Generate random order IDs.
* [ ] Generate random card IDs.
* [ ] Do not expose pending draft URLs publicly.
* [ ] Add `noindex` meta to card HTML.
* [ ] Do not claim real password security.

---

## 21. Testing Checklist

### Local

* [ ] Create card without payment using test publish.
* [ ] Upload photo.
* [ ] Upload voice note.
* [ ] Generate static card.
* [ ] Open static card locally.
* [ ] Open static card from R2.
* [ ] QR opens card URL.

### DOKU Sandbox

* [ ] Create checkout for QRIS/e-wallet group.
* [ ] Amount is Rp3.000.
* [ ] Create checkout for bank/card group.
* [ ] Amount is Rp8.000.
* [ ] Successful payment triggers webhook.
* [ ] Failed payment does not publish.
* [ ] Duplicate webhook does not duplicate publish.
* [ ] Payment mismatch does not publish.

### Mobile

* [ ] Builder works on mobile.
* [ ] Preview works on mobile.
* [ ] Card opens on mobile.
* [ ] Audio play works after tap.
* [ ] QR download works.

### Production Smoke Test

* [ ] `https://dearnote.asia` loads.
* [ ] `https://dearnote.asia/create` loads.
* [ ] DOKU production checkout works.
* [ ] Webhook production URL receives event.
* [ ] R2 public card URL works.
* [ ] QR opens production card.

---

## 22. Launch Checklist

* [ ] Domain connected to Vercel.
* [ ] `pub.dearnote.asia` connected to R2.
* [ ] R2 production bucket created.
* [ ] DOKU production credentials configured.
* [ ] DOKU webhook configured.
* [ ] Env vars added to Vercel production.
* [ ] Legal pages published.
* [ ] Error logging added.
* [ ] Manual support contact available.
* [ ] Test transaction completed.
* [ ] Test card opened from WhatsApp/Instagram.
* [ ] Test on iPhone Safari.
* [ ] Test on Android Chrome.
* [ ] Test QR scan.

---

## 23. Build Order

Recommended order:

```txt
1. Repo + Vercel deploy
2. R2 bucket + pub.dearnote.asia
3. Static renderer local
4. Builder UI
5. Upload to R2
6. Publish test without payment
7. DOKU checkout
8. DOKU webhook
9. Success page
10. Production smoke test
```

Do not start from DOKU first.

First proof target:

```txt
User draft
↓
generate index.html + config.json
↓
upload to R2
↓
open public card URL
```

After that, add payment gate.
