import type { Provider, DayMenu } from "../types.js";
import { fetchRssFeed, extractImageUrls, fetchImage, loadCachedFeed, saveFeed, RSS_FEEDS } from "../lib/rss.js";
import { parseMenuImages } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "cubus-beskidy",
    name: "Cubus Beskidy",
    url: "https://www.facebook.com/CubusBeskidy",
    phone: "+48 33 863 13 05",
  },

  async scrape(): Promise<DayMenu[] | null> {
    const rssXml = await fetchRssFeed(RSS_FEEDS.CUBUS_BESKIDY);

    const cached = loadCachedFeed("cubus-beskidy");
    if (cached === rssXml) {
      console.log(`[cubus-beskidy] RSS unchanged, skipping AI parsing`);
      return null;
    }

    const imageUrls = extractImageUrls(rssXml);

    if (imageUrls.length === 0) {
      console.log(`[cubus-beskidy] No images found in RSS feed`);
      saveFeed("cubus-beskidy", rssXml);
      return [];
    }

    console.log(`[cubus-beskidy] Downloading ${imageUrls.length} images from RSS feed`);
    const validImages: Uint8Array[] = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        validImages.push(await fetchImage(imageUrls[i]));
      } catch (e) {
        console.log(`[cubus-beskidy] Failed to fetch image ${i + 1}: ${e}`);
      }
    }

    if (validImages.length === 0) {
      console.log(`[cubus-beskidy] No images could be downloaded`);
      saveFeed("cubus-beskidy", rssXml);
      return [];
    }

    console.log(`[cubus-beskidy] Parsing ${validImages.length} images with AI`);
    saveFeed("cubus-beskidy", rssXml);
    return parseMenuImages(validImages);
  },
};

export default provider;
