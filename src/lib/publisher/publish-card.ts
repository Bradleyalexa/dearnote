import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import {
  copyObject,
  deleteObject,
  getJson,
  isObjectNotFoundError,
  objectExists,
  putJson,
  putObject,
} from "../r2/client";
import { generateConfig } from "./generate-config";
import { generateIndexHtml } from "./generate-index-html";
import type { CardDraft } from "../schemas/card-draft";

interface OrderInfo {
  orderId: string;
  cardId: string;
  amount: number;
  currency: string;
  paymentGroup: string;
  status: string;
  paymentProvider: string;
  paymentUrl: string;
  createdAt: string;
  updatedAt: string;
}

const PENDING_ASSET_KEY_PATTERN = /^pending\/order_[A-Za-z0-9_-]+\/assets\/[A-Za-z0-9._-]+$/;

function isSafePendingAssetKey(key: string): boolean {
  // The exact segment regex prevents traversal because the filename cannot
  // contain a slash. Consecutive dots inside a filename are therefore safe.
  return PENDING_ASSET_KEY_PATTERN.test(key);
}

function collectPendingAssetKeys(draft: CardDraft): {
  keys: string[];
  hasUnsafeReferences: boolean;
} {
  const keys = new Set<string>();
  let hasUnsafeReferences = false;

  const addRequiredPendingKey = (key: string) => {
    if (isSafePendingAssetKey(key)) {
      keys.add(key);
    } else {
      hasUnsafeReferences = true;
      console.warn(`[Publisher] Refusing to delete unsafe pending key: ${key}`);
    }
  };

  for (const photo of draft.photos) addRequiredPendingKey(photo.key);
  if (draft.voiceNote) addRequiredPendingKey(draft.voiceNote.key);

  // Presets use short catalogue IDs. A key containing a slash is treated as
  // a custom R2 upload by the existing publisher and must be a pending key.
  if (draft.bgMusic?.key.includes("/")) {
    addRequiredPendingKey(draft.bgMusic.key);
  }

  return { keys: [...keys], hasUnsafeReferences };
}

function getExpectedPublishedKeys(cardId: string, draft: CardDraft): string[] {
  const cardPrefix = `cards/${cardId}`;
  const keys = [
    `${cardPrefix}/notes.html`,
    `${cardPrefix}/config.json`,
    `${cardPrefix}/qr.svg`,
    `${cardPrefix}/qr.png`,
    `${cardPrefix}/status.json`,
    ...draft.photos.map((_, index) => `${cardPrefix}/assets/photo-${index + 1}.webp`),
  ];

  if (draft.voiceNote) keys.push(`${cardPrefix}/assets/voice-note.mp3`);
  if (draft.bgMusic) keys.push(`${cardPrefix}/assets/bg-music.mp3`);
  return keys;
}

async function cleanupPublishedPending(
  orderId: string,
  cardId: string,
  draftKey: string
): Promise<void> {
  if (!(await objectExists(draftKey))) {
    console.log(`[Publisher] No pending draft remains for published order ${orderId}.`);
    return;
  }

  let draft: CardDraft;
  try {
    draft = await getJson<CardDraft>(draftKey);
  } catch (error) {
    // Another concurrent webhook may have deleted the draft between HEAD and
    // GET. Treat that race as an already-completed idempotent cleanup.
    if (isObjectNotFoundError(error)) {
      console.log(`[Publisher] Pending draft was already cleaned for ${orderId}.`);
      return;
    }
    throw error;
  }
  const expectedPublishedKeys = getExpectedPublishedKeys(cardId, draft);
  const publishedChecks = await Promise.all(
    expectedPublishedKeys.map(async (key) => ({ key, exists: await objectExists(key) }))
  );
  const missingPublishedKeys = publishedChecks
    .filter((result) => !result.exists)
    .map((result) => result.key);

  if (missingPublishedKeys.length > 0) {
    throw new Error(
      `Pending cleanup blocked for ${orderId}; published objects are missing: ${missingPublishedKeys.join(", ")}`
    );
  }

  const { keys: pendingAssetKeys, hasUnsafeReferences } = collectPendingAssetKeys(draft);
  const deletionResults = await Promise.allSettled(
    pendingAssetKeys.map((key) => deleteObject(key))
  );
  const failedAssetKeys = pendingAssetKeys.filter(
    (_, index) => deletionResults[index].status === "rejected"
  );

  if (hasUnsafeReferences || failedAssetKeys.length > 0) {
    throw new Error(
      `Pending draft retained for ${orderId}; ` +
      `${failedAssetKeys.length} asset deletion(s) failed and unsafe references=${hasUnsafeReferences}.`
    );
  }

  // Delete the draft last. If an asset deletion fails above, retaining the
  // draft preserves the list of keys so a later webhook can retry cleanup.
  await deleteObject(draftKey);
  console.log(
    `[Publisher] Cleaned ${pendingAssetKeys.length} pending asset(s) and draft for published order ${orderId}.`
  );
}

async function cleanupPublishedPendingBestEffort(
  orderId: string,
  cardId: string,
  draftKey: string
): Promise<void> {
  try {
    await cleanupPublishedPending(orderId, cardId, draftKey);
  } catch (error) {
    // Publication must stay successful if cleanup is temporarily unavailable.
    // A later invocation can retry this idempotently.
    console.warn(`[Publisher] Pending cleanup failed for ${orderId}; it will be retried.`, error);
  }
}

/**
 * Publishes a card to the public directory on Cloudflare R2 bucket.
 * Executed after a successful payment webhook or test simulation.
 */
export async function publishCard(orderId: string): Promise<string> {
  const orderKey = `orders/${orderId}.json`;
  const draftKey = `pending/${orderId}/draft.json`;

  try {
    // 1. Load order data from R2
    console.log(`[Publisher] Loading order ${orderId} from R2...`);
    const order = await getJson<OrderInfo>(orderKey);
    if (!order) {
      throw new Error(`Order ${orderId} not found in storage.`);
    }

    // Check if already published to prevent double-publish
    if (order.status === "published") {
      console.log(`[Publisher] Order ${orderId} is already published. Reconciling pending cleanup...`);
      await cleanupPublishedPending(orderId, order.cardId, draftKey);
      return `${process.env.PUBLIC_CARD_BASE_URL}/cards/${order.cardId}/notes.html`;
    }

    // 2. Load draft data from R2
    console.log(`[Publisher] Loading draft for order ${orderId}...`);
    const draft = await getJson<CardDraft>(draftKey);
    if (!draft) {
      throw new Error(`Draft for order ${orderId} not found in storage.`);
    }

    const cardId = order.cardId;
    const publicCardBaseUrl = process.env.PUBLIC_CARD_BASE_URL;
    if (!publicCardBaseUrl) {
      throw new Error(
        "[Publisher] FATAL: PUBLIC_CARD_BASE_URL environment variable is not set. " +
        "Please set it to 'https://pub.dearnote.asia' in your Vercel environment variables."
      );
    }
    const cleanBaseUrl = publicCardBaseUrl.endsWith("/")
      ? publicCardBaseUrl.slice(0, -1)
      : publicCardBaseUrl;
    
    // Final published card URL: https://pub.dearnote.asia/cards/{cardId}/notes.html
    const cardUrl = `${cleanBaseUrl}/cards/${cardId}/notes.html`;

    // 3. Generate final PublishedConfig (config.json)
    console.log(`[Publisher] Assembling published config for card ${cardId}...`);
    const publishedConfig = generateConfig(cardId, draft);

    // 4. Generate QR Codes (SVG and PNG)
    console.log(`[Publisher] Generating QR codes for card URL: ${cardUrl}...`);
    const qrSvgString = await QRCode.toString(cardUrl, {
      type: "svg",
      margin: 1,
      width: 400,
    });
    const qrPngBuffer = await QRCode.toBuffer(cardUrl, {
      type: "png",
      margin: 1,
      width: 400,
    });

    // 5. Copy photos and voice note from pending/ to cards/ in R2
    console.log(`[Publisher] Moving assets to card directory...`);
    
    // Copy Photos
    for (let i = 0; i < draft.photos.length; i++) {
      const photo = draft.photos[i];
      const sourceKey = photo.key;
      const destKey = `cards/${cardId}/assets/photo-${i + 1}.webp`;
      
      console.log(`[Publisher] Copying photo ${i + 1}: ${sourceKey} -> ${destKey}`);
      await copyObject(sourceKey, destKey);
    }

    // Copy Voice Note
    if (draft.voiceNote) {
      const sourceKey = draft.voiceNote.key;
      const destKey = `cards/${cardId}/assets/voice-note.mp3`;
      console.log(`[Publisher] Copying custom voice note: ${sourceKey} -> ${destKey}`);
      await copyObject(sourceKey, destKey);
    }

    // Copy Background Music
    if (draft.bgMusic) {
      const destKey = `cards/${cardId}/assets/bg-music.mp3`;
      const srcKey  = draft.bgMusic.key;
      const srcPath = draft.bgMusic.src;

      // Custom user-uploaded file: key is a full R2 path (e.g. "pending/order_xxx/assets/…")
      if (srcKey && srcKey.includes("/")) {
        console.log(`[Publisher] Copying custom uploaded BGM from R2: ${srcKey} -> ${destKey}`);
        await copyObject(srcKey, destKey);
      } else {
        // Predefined track: resolve from local public/audio/ directory
        const srcBasename = srcPath ? path.basename(srcPath) : `${srcKey}.mp3`;
        const localPath = path.join(process.cwd(), "public", "audio", srcBasename);

        if (fs.existsSync(localPath)) {
          const fileBuffer = fs.readFileSync(localPath);
          console.log(`[Publisher] Uploading background music: ${localPath} -> R2:${destKey}`);
          await putObject(destKey, fileBuffer, "audio/mpeg");
        } else {
          // Fallback: try using key as filename (legacy)
          const legacyPath = path.join(process.cwd(), "public", "audio", `${srcKey}.mp3`);
          if (fs.existsSync(legacyPath)) {
            const fileBuffer = fs.readFileSync(legacyPath);
            console.log(`[Publisher] Uploading background music (legacy key): ${legacyPath} -> R2:${destKey}`);
            await putObject(destKey, fileBuffer, "audio/mpeg");
          } else {
            console.error(`[Publisher] Background music file not found locally: ${localPath}`);
          }
        }
      }
    }

    // 6. Generate static notes.html content
    console.log(`[Publisher] Rendering notes.html for card ${cardId}...`);
    const htmlContent = generateIndexHtml(publishedConfig);

    // 7. Write notes.html, config.json, qr.svg, qr.png to cards/{cardId}/ in R2
    console.log(`[Publisher] Writing static assets to R2 bucket...`);
    const cardFolderPrefix = `cards/${cardId}`;

    await putObject(`${cardFolderPrefix}/notes.html`, htmlContent, "text/html");
    await putJson(`${cardFolderPrefix}/config.json`, publishedConfig);
    await putObject(`${cardFolderPrefix}/qr.svg`, qrSvgString, "image/svg+xml");
    await putObject(`${cardFolderPrefix}/qr.png`, qrPngBuffer, "image/png");

    // Write status.json
    const statusData = {
      cardId,
      orderId,
      status: "published",
      url: cardUrl,
      publishedAt: publishedConfig.publishedAt,
      expiresAt: publishedConfig.expiresAt,
    };
    await putJson(`${cardFolderPrefix}/status.json`, statusData);

    // 8. Update Order JSON status to published
    console.log(`[Publisher] Updating order status to published...`);
    const updatedOrder = {
      ...order,
      status: "published",
      updatedAt: new Date().toISOString(),
    };
    await putJson(orderKey, updatedOrder);

    // The order and all published card objects now exist. Remove only the
    // corresponding pending uploads; cleanup failures do not unpublish card.
    await cleanupPublishedPendingBestEffort(orderId, cardId, draftKey);

    console.log(`[Publisher] SUCCESS: Card ${cardId} published!`);
    return cardUrl;
  } catch (error) {
    console.error(`[Publisher] ERROR publishing card for order ${orderId}:`, error);
    
    // Update order status to failed in case of failure
    try {
      const order = await getJson<OrderInfo>(orderKey);
      if (order && order.status !== "published") {
        const failedOrder = {
          ...order,
          status: "publish_failed",
          updatedAt: new Date().toISOString(),
        };
        await putJson(orderKey, failedOrder);
      }
    } catch (dbErr) {
      console.error("[Publisher] Failed to record publish failure status:", dbErr);
    }

    throw error;
  }
}
