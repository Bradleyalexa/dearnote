import { PublishedConfig } from "../schemas/card-draft";
import { generateFlowerSecretLetterHtml } from "./templates/flower-secret-letter";
import { generatePolaroidMemoryNoteHtml } from "./templates/polaroid-memory-note";
import { generateMoonlightVoiceLetterHtml } from "./templates/moonlight-voice-letter";

/**
 * Main coordinator that returns the HTML page content based on the selected template.
 */
export function generateIndexHtml(config: PublishedConfig): string {
  switch (config.template) {
    case "flower_secret_letter":
      return generateFlowerSecretLetterHtml(config);
    case "polaroid_memory_note":
      return generatePolaroidMemoryNoteHtml(config);
    case "moonlight_voice_letter":
      return generateMoonlightVoiceLetterHtml(config);
    default:
      // Fallback in case of type bypass
      return generateFlowerSecretLetterHtml(config);
  }
}
