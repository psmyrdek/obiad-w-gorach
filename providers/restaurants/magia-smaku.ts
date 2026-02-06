import type {Provider, DayMenu} from "../types.js";
import {scrapeFacebookPage} from "../lib/facebook.js";

const provider: Provider = {
  config: {
    id: "magia-smaku",
    name: "Magia Smaku",
    url: "https://www.facebook.com/MagiaSmakuStolowka",
    phone: "+48 33 497 08 05",
  },

  async scrape(): Promise<DayMenu[]> {
    const result = await scrapeFacebookPage({ url: this.config.url });

    if (result.error) {
      console.log(`[magia-smaku] Scrape error: ${result.error}`);
      return [];
    }

    if (result.text) {
      console.log(`[magia-smaku] Extracted ${result.text.length} chars of text`);
    } else {
      console.log(`[magia-smaku] No post text found`);
    }

    // TODO: parse menu text into DayMenu[]
    return [];
  },
};

export default provider;
