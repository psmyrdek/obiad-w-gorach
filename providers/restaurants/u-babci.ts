import type { Provider, DayMenu } from "../types.js";
import { fetchRssFeed, loadCachedFeed, saveFeed, RSS_FEEDS } from "../lib/rss.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "u-babci",
    name: "U Babci",
    url: "https://www.facebook.com/ubabcikuchniadomowa",
    phone: "+48 574 428 628",
  },

  async scrape(): Promise<DayMenu[] | null> {
    const text = await fetchRssFeed(RSS_FEEDS.U_BABCI);
    console.log(`[u-babci] Fetched ${text.length} chars from RSS`);

    const cached = loadCachedFeed("u-babci");
    if (cached === text) {
      console.log(`[u-babci] RSS unchanged, skipping AI parsing`);
      return null;
    }

    saveFeed("u-babci", text);
    return parseMenuText(text);
  },
};

export default provider;
