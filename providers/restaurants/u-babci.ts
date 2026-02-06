import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "u-babci",
    name: "U Babci",
    url: "https://www.facebook.com/ubabcikuchniadomowa",
    phone: "+48 574 428 628",
  },

  async scrape(): Promise<DayMenu[]> {
    console.log(`[u-babci] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
