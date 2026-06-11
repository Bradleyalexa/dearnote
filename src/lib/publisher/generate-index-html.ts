import { PublishedConfig } from "../schemas/card-draft";
import { generateClassicEditorialHtml } from "./templates/classic-editorial";
import { generatePolaroidScrapbookHtml } from "./templates/polaroid-scrapbook";
import { generateNocturnalJournalHtml } from "./templates/nocturnal-journal";

/**
 * Main coordinator that returns the HTML page content based on the selected template.
 */
export function generateIndexHtml(config: PublishedConfig): string {
  switch (config.template) {
    case "classic_editorial":
      return generateClassicEditorialHtml(config);
    case "polaroid_scrapbook":
      return generatePolaroidScrapbookHtml(config);
    case "nocturnal_journal":
      return generateNocturnalJournalHtml(config);
    default:
      // Fallback
      return generateClassicEditorialHtml(config);
  }
}
