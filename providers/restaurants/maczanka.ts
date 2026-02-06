import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "maczanka",
    name: "Maczanka Krakowska",
    url: "https://facebook.com/maczankakrakowska",
    phone: "+48 12 634 98 21",
  },

  async scrape(): Promise<DayMenu[]> {
    // TODO: implement actual scraping from Facebook/website
    console.log(`[maczanka] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
