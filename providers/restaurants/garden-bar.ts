import type { Provider, DayMenu } from "../types.js";
import { scrapeFacebookPage } from "../lib/facebook.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "garden-bar",
    name: "Garden Bar",
    url: "https://www.facebook.com/126626397494420",
    phone: "+48 691 409 510",
  },

  async scrape(): Promise<DayMenu[]> {
    const result = await scrapeFacebookPage({ url: this.config.url });

    if (result.error) {
      console.log(`[garden-bar] Scrape error: ${result.error}`);
      return [];
    }

    if (!result.text) {
      console.log(`[garden-bar] No post text found`);
      return [];
    }

    console.log(`[garden-bar] Extracted ${result.text.length} chars of text`);
    return parseMenuText(result.text);
  },
};

export default provider;
