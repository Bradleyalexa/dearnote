import { z } from "zod";

// Available templates in the application
export const TEMPLATES = [
  "classic_editorial",
  "polaroid_scrapbook",
  "scrapbook",
  "pink_book_folds",
  "apology_letter",
  "open_when_cards",
  "nocturnal_journal",
  "gift_box_reveal",
  "playful_gift",
  "playful_dog",
  "playful_pooh",
  "eternal_love",
  "birthday_magic",
  "blooming_note",
  "graduation_note",
  "graduation_memory_lane",
  "sweet_cradle",
  "tender_welcome",
  "christmas_magic",
  "ramadhan_blessings",
  "mothers_day",
  "herbarium_book",
  "teachers_day",
] as const;

export const TemplateSchema = z.enum(TEMPLATES);
export type TemplateType = z.infer<typeof TemplateSchema>;

// Photo item schema for drafts (uses R2 storage keys)
export const DraftPhotoSchema = z.object({
  key: z.string().min(1, { message: "Berkas foto tidak valid" }),
  src: z.string().min(1, { message: "Tautan foto tidak valid" }),
  caption: z.string().max(120, { message: "Teks foto maksimal 120 karakter" }).optional(),
});

// Voice note schema for drafts (uses R2 storage key)
export const DraftVoiceNoteSchema = z.object({
  key: z.string().min(1, { message: "Pesan suara tidak valid" }),
  src: z.string().min(1, { message: "Tautan pesan suara tidak valid" }),
  durationSeconds: z.number().max(60, { message: "Durasi pesan suara maksimal 60 detik" }).optional(),
});

// Background music schema for drafts (preset choices)
export const DraftBgMusicSchema = z.object({
  key: z.string().min(1, { message: "Musik latar tidak valid" }),
  src: z.string().min(1, { message: "Tautan musik latar tidak valid" }),
  durationSeconds: z.number().optional(),
});

// Schema for card drafts created by the user (pre-payment)
export const CardDraftSchema = z.object({
  template: TemplateSchema,
  fromName: z.string().min(1, { message: "Nama pengirim wajib diisi" }).max(40, { message: "Nama pengirim maksimal 40 karakter" }),
  toName: z.string().min(1, { message: "Nama penerima wajib diisi" }).max(40, { message: "Nama penerima maksimal 40 karakter" }),
  secretCode: z.string().max(12, { message: "Kode akses maksimal 12 karakter" }).optional(), // Cosmetic code (optional)
  letterTitle: z.string().max(80, { message: "Judul catatan maksimal 80 karakter" }).optional(),
  letterBody: z.string().min(1, { message: "Isi catatan wajib diisi" }).max(3000, { message: "Isi catatan maksimal 3000 karakter" }),
  photos: z.array(DraftPhotoSchema).max(5, { message: "Maksimal hanya boleh 5 foto" }),
  voiceNote: DraftVoiceNoteSchema.optional(),
  bgMusic: DraftBgMusicSchema.optional(),
  finalMessage: z.string().max(300, { message: "Pesan penutup maksimal 300 karakter" }).optional(),
  themeColor: z.string().max(30).optional(),
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

// Background music schema for published cards (uses relative paths within the card folder)
export const PublishedBgMusicSchema = z.object({
  src: z.string().min(1),
  durationSeconds: z.number().optional(),
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
  bgMusic: PublishedBgMusicSchema.optional(),
  finalMessage: z.string().max(300).optional(),
  themeColor: z.string().max(30).optional(),
  publishedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});

export type PublishedConfig = z.infer<typeof PublishedConfigSchema>;
