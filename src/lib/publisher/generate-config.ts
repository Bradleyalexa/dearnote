import { CardDraft, PublishedConfig } from "../schemas/card-draft";

/**
 * Transforms a user's CardDraft into a PublishedConfig with active metadata.
 * Remaps R2 object keys to local relative asset paths for S3 delivery.
 */
export function generateConfig(cardId: string, draft: CardDraft): PublishedConfig {
  const publishedAt = new Date();
  
  // Set card expiry to exactly 90 days in the future
  const expiresAt = new Date();
  expiresAt.setDate(publishedAt.getDate() + 90);

  return {
    cardId,
    template: draft.template,
    fromName: draft.fromName,
    toName: draft.toName,
    secretCode: draft.secretCode || undefined, // Keep undefined if blank
    letterTitle: draft.letterTitle || undefined,
    letterBody: draft.letterBody,
    // Convert R2 keys to relative paths inside the card's assets folder
    photos: draft.photos.map((photo, index) => ({
      src: `./assets/photo-${index + 1}.webp`, // Hardcoded relative mapping
      caption: photo.caption,
    })),
    voiceNote: draft.voiceNote
      ? {
          src: `./assets/voice-note.mp3`, // Hardcoded relative mapping
          durationSeconds: draft.voiceNote.durationSeconds,
        }
      : undefined,
    bgMusic: draft.bgMusic
      ? {
          src: `./assets/bg-music.mp3`, // Hardcoded relative mapping
          durationSeconds: draft.bgMusic.durationSeconds,
        }
      : undefined,
    finalMessage: draft.finalMessage || undefined,
    themeColor: draft.themeColor || undefined,
    publishedAt: publishedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}
