import type {Provider, DayMenu} from "../types.js";
import {scrapeFacebookPage} from "../lib/facebook.js";
import {parseMenuText} from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "cubus-beskidy",
    name: "Cubus Beskidy",
    url: "https://www.facebook.com/CubusBeskidy",
    phone: "+48 33 863 13 05",
  },

  async scrape(): Promise<DayMenu[]> {
    const result = await scrapeFacebookPage({url: this.config.url});

    if (result.error) {
      console.log(`[cubus-beskidy] Scrape error: ${result.error}`);
      return [];
    }

    if (!result.text) {
      console.log(`[cubus-beskidy] No post text found`);
      return [];
    }

    console.log(`[cubus-beskidy] Extracted ${result.text.length} chars of text`);
    return parseMenuText(result.text);
  },
};

export default provider;
