import type { Provider, DayMenu } from "../types.js";
import { scrapeFacebookPage } from "../lib/facebook.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "smakuj-zycie",
    name: "Smakuj Życie",
    url: "https://www.facebook.com/p/Smakuj-%C5%BCycie-61551705328071/",
    phone: "+48 730 370 453",
  },

  async scrape(): Promise<DayMenu[]> {
    const result = await scrapeFacebookPage({ url: this.config.url });

    if (result.error) {
      console.log(`[smakuj-zycie] Scrape error: ${result.error}`);
      return [];
    }

    if (!result.text) {
      console.log(`[smakuj-zycie] No post text found`);
      return [];
    }

    console.log(`[smakuj-zycie] Extracted ${result.text.length} chars of text`);
    return parseMenuText(result.text);
  },
};

export default provider;
