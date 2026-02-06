import type { Provider, DayMenu } from "../types.js";
import { fetchRssFeed, loadCachedFeed, saveFeed, RSS_FEEDS } from "../lib/rss.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "magia-smaku",
    name: "Magia Smaku",
    url: "https://www.facebook.com/MagiaSmakuStolowka",
    phone: "+48 33 497 08 05",
  },

  async scrape(): Promise<DayMenu[] | null> {
    const text = await fetchRssFeed(RSS_FEEDS.MAGIA_SMAKU);
    console.log(`[magia-smaku] Fetched ${text.length} chars from RSS`);

    const cached = loadCachedFeed("magia-smaku");
    if (cached === text) {
      console.log(`[magia-smaku] RSS unchanged, skipping AI parsing`);
      return null;
    }

    saveFeed("magia-smaku", text);
    return parseMenuText(text);
  },
};

export default provider;
