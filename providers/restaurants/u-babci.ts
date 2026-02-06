import type { Provider, DayMenu } from "../types.js";
import { scrapeFacebookPage } from "../lib/facebook.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "u-babci",
    name: "U Babci",
    url: "https://www.facebook.com/ubabcikuchniadomowa",
    phone: "+48 574 428 628",
  },

  async scrape(): Promise<DayMenu[]> {
    const result = await scrapeFacebookPage({ url: this.config.url });

    if (result.error) {
      console.log(`[u-babci] Scrape error: ${result.error}`);
      return [];
    }

    if (!result.text) {
      console.log(`[u-babci] No post text found`);
      return [];
    }

    console.log(`[u-babci] Extracted ${result.text.length} chars of text`);
    return parseMenuText(result.text);
  },
};

export default provider;
