import {chromium} from "playwright";
import type {Browser} from "playwright";

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

export interface FacebookScrapeOptions {
  url: string;
  headless?: boolean;
  hasPinnedPost?: boolean;
}

export interface FacebookScrapeResult {
  text: string | null;
  error: string | null;
}

/**
 * Convert a www.facebook.com URL to mbasic.facebook.com.
 * Handles /p/Name-ID/ URLs by extracting the numeric ID and
 * converting to profile.php?id=ID format.
 */
function toMbasicUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hostname = "mbasic.facebook.com";

  // /p/Name-123456/ → /profile.php?id=123456
  const pMatch = parsed.pathname.match(/^\/p\/.*?(\d+)\/?$/);
  if (pMatch) {
    parsed.pathname = "/profile.php";
    parsed.searchParams.set("id", pMatch[1]);
  }

  return parsed.toString();
}

export async function scrapeFacebookPage(
  options: FacebookScrapeOptions,
): Promise<FacebookScrapeResult> {
  const {url, headless = true, hasPinnedPost = false} = options;

  const email = process.env.FB_EMAIL;
  const password = process.env.FB_PASSWORD;
  if (!email || !password) {
    return {
      text: null,
      error: "FB_EMAIL and FB_PASSWORD env vars are required",
    };
  }

  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({headless});
    const context = await browser.newContext({userAgent: MOBILE_USER_AGENT});
    const page = await context.newPage();

    // Log in via mbasic login page
    await page.goto("https://mbasic.facebook.com/login/", {
      waitUntil: "domcontentloaded",
    });

    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="pass"]').fill(password);
    await page.locator('button[name="login"]').click();

    // Wait for login to complete — mbasic redirects to a page without the login form
    await page.waitForURL((u) => !u.pathname.includes("/login"), {
      timeout: 15000,
    });

    // Navigate to target page on mbasic
    const mbasicUrl = toMbasicUrl(url);
    await page.goto(mbasicUrl, {waitUntil: "domcontentloaded"});

    // Extract post text — mbasic renders posts as <article> elements
    const postIndex = hasPinnedPost ? 1 : 0;
    const targetPost = page.locator("article").nth(postIndex);
    await targetPost.waitFor({timeout: 10000});

    const text = await targetPost.innerText();

    console.log(text);

    await browser.close();

    return {text: text.trim() || null, error: null};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await browser?.close().catch(() => {});
    return {text: null, error: message};
  }
}
