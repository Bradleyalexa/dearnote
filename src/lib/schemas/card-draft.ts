import { z } from "zod";

// Available templates in the application
export const TEMPLATES = [
  "classic_editorial",
  "polaroid_scrapbook",
  "nocturnal_journal",
] as const;

export const TemplateSchema = z.enum(TEMPLATES);
export type TemplateType = z.infer<typeof TemplateSchema>;

// Photo item schema for drafts (uses R2 storage keys)
export const DraftPhotoSchema = z.object({
  key: z.string().min(1),
  src: z.string().min(1),
  caption: z.string().max(120).optional(),
});

// Voice note schema for drafts (uses R2 storage key)
export const DraftVoiceNoteSchema = z.object({
  key: z.string().min(1),
  src: z.string().min(1),
  durationSeconds: z.number().max(60).optional(),
});

// Schema for card drafts created by the user (pre-payment)
export const CardDraftSchema = z.object({
  template: TemplateSchema,
  fromName: z.string().min(1).max(40),
  toName: z.string().min(1).max(40),
  secretCode: z.string().max(12).optional(), // Cosmetic code (optional)
  letterTitle: z.string().max(80).optional(),
  letterBody: z.string().min(1).max(3000),
  photos: z.array(DraftPhotoSchema).max(5),
  voiceNote: DraftVoiceNoteSchema.optional(),
  finalMessage: z.string().max(300).optional(),
});

export type CardDraft = z.infer<typeof CardDraftSchema>;

// Photo item schema for published cards (uses relative paths within the card folder)
export const PublishedPhotoSchema = z.object({
  src: z.string().min(1),
  caption: z.string().max(120).optional(),
});

// Voice note schema for published cards (uses relative paths within the card folder)
export const PublishedVoiceNoteSchema = z.object({
  src: z.string().min(1),
  durationSeconds: z.number().max(60).optional(),
});

// Schema for the config.json stored inside the published card folder on R2
export const PublishedConfigSchema = z.object({
  cardId: z.string().min(1),
  template: TemplateSchema,
  fromName: z.string().min(1).max(40),
  toName: z.string().min(1).max(40),
  secretCode: z.string().max(12).optional(),
  letterTitle: z.string().max(80).optional(),
  letterBody: z.string().min(1).max(3000),
  photos: z.array(PublishedPhotoSchema).max(5),
  voiceNote: PublishedVoiceNoteSchema.optional(),
  finalMessage: z.string().max(300).optional(),
  publishedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});

export type PublishedConfig = z.infer<typeof PublishedConfigSchema>;
