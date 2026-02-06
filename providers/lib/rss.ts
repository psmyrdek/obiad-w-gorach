import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(__dirname, "../data/rss");

export function loadCachedFeed(id: string): string | null {
  try {
    return readFileSync(resolve(CACHE_DIR, `${id}.xml`), "utf-8");
  } catch {
    return null;
  }
}

export function saveFeed(id: string, content: string): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(resolve(CACHE_DIR, `${id}.xml`), content);
}

export const RSS_FEEDS = {
  GARDEN_BAR: "https://fetchrss.com/feed/1voTvo3Tr4UF1voTyJ9xJ8IN.rss",
  CUBUS_BESKIDY: "https://fetchrss.com/feed/1voTvo3Tr4UF1voTwwDnpEKY.rss",
  U_BABCI: "https://fetchrss.com/feed/1voTvo3Tr4UF1voTwFBGAFNb.rss",
  MAGIA_SMAKU: "https://fetchrss.com/feed/1voTvo3Tr4UF1voTqMCRiBrG.rss",
};

export async function fetchRssFeed(feedUrl: string): Promise<string> {
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export function extractImageUrls(rssXml: string): string[] {
  const urls: string[] = [];
  const mediaRegex = /<media:content\s+url="([^"]+)"/g;
  let match;
  while ((match = mediaRegex.exec(rssXml)) !== null) {
    urls.push(match[1].replaceAll("&amp;", "&"));
  }
  return urls;
}

export async function fetchImage(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: "https://www.facebook.com/",
    },
  });
  if (!response.ok) {
    throw new Error(`Image fetch failed (${response.status}): ${url}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
