import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "smakuj-zycie",
    name: "Smakuj Życie",
    url: "https://www.facebook.com/p/Smakuj-%C5%BCycie-61551705328071/",
    phone: "+48 730 370 453",
  },

  async scrape(): Promise<DayMenu[]> {
    console.log(`[smakuj-zycie] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
