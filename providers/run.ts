import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { RestaurantMenu } from "./types.js";
import { providers } from "./restaurants/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../src/data/menus");

export async function runAllProviders(): Promise<void> {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const provider of providers) {
    const { config } = provider;
    console.log(`Scraping: ${config.name} (${config.id})...`);

    try {
      const menus = await provider.scrape();
      const result: RestaurantMenu = {
        id: config.id,
        name: config.name,
        url: config.url,
        phone: config.phone,
        scrapedAt: new Date().toISOString(),
        menus,
      };

      const outPath = resolve(OUTPUT_DIR, `${config.id}.json`);
      writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
      console.log(`  -> Written ${outPath} (${menus.length} days)`);
    } catch (err) {
      console.error(`  -> Error scraping ${config.id}:`, err);
    }
  }

  console.log("Done.");
}
