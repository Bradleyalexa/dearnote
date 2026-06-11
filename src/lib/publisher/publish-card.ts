import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { getJson, putJson, putObject, copyObject } from "../r2/client";
import { generateConfig } from "./generate-config";
import { generateIndexHtml } from "./generate-index-html";
import { PublishedConfig } from "../schemas/card-draft";

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
      console.log(`[Publisher] Order ${orderId} is already published.`);
      return `${process.env.PUBLIC_CARD_BASE_URL}/cards/${order.cardId}/notes.html`;
    }

    // 2. Load draft data from R2
    console.log(`[Publisher] Loading draft for order ${orderId}...`);
    const draft = await getJson<any>(draftKey);
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
      const trackId = draft.bgMusic.key;
      const destKey = `cards/${cardId}/assets/bg-music.mp3`;
      console.log(`[Publisher] Loading background music track ${trackId} from local disk...`);
      
      // Resolve actual file: prefer src path (e.g. /audio/track2.mp3), fallback to key as filename
      const srcPath = draft.bgMusic.src; // e.g. "/audio/track2.mp3"
      const srcBasename = srcPath ? path.basename(srcPath) : `${trackId}.mp3`;
      const localPath = path.join(process.cwd(), "public", "audio", srcBasename);
      
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        console.log(`[Publisher] Uploading background music: ${localPath} -> R2:${destKey}`);
        await putObject(destKey, fileBuffer, "audio/mpeg");
      } else {
        // Fallback: try using key as filename (legacy)
        const legacyPath = path.join(process.cwd(), "public", "audio", `${trackId}.mp3`);
        if (fs.existsSync(legacyPath)) {
          const fileBuffer = fs.readFileSync(legacyPath);
          console.log(`[Publisher] Uploading background music (legacy key): ${legacyPath} -> R2:${destKey}`);
          await putObject(destKey, fileBuffer, "audio/mpeg");
        } else {
          console.error(`[Publisher] Background music file not found locally: ${localPath}`);
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
