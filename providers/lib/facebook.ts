import { chromium, type BrowserContext } from "playwright";

export interface FacebookScrapeOptions {
  url: string;
  headless?: boolean;
}

export interface FacebookScrapeResult {
  text: string | null;
  error: string | null;
}

export async function scrapeFacebookPage(
  options: FacebookScrapeOptions
): Promise<FacebookScrapeResult> {
  const { url, headless = true } = options;

  const email = process.env.FB_EMAIL;
  const password = process.env.FB_PASSWORD;
  if (!email || !password) {
    return { text: null, error: "FB_EMAIL and FB_PASSWORD env vars are required" };
  }

  let context: BrowserContext | undefined;

  try {
    const browser = await chromium.launch({ headless });

    context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      locale: "pl-PL",
      viewport: { width: 1280, height: 900 },
    });

    const page = await context.newPage();

    // Log in to Facebook
    await login(page, email, password);

    // Navigate to target page
    await page.goto(url, { waitUntil: "networkidle" });

    // Extract latest post text
    const text = await extractLatestPostText(page);

    await context.close();

    return { text, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await context?.close().catch(() => {});
    return { text: null, error: message };
  }
}

async function login(page: import("playwright").Page, email: string, password: string) {
  await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle" });

  // Accept cookies dialog if present
  for (const label of ["Allow all cookies", "Zezwól na wszystkie ciasteczka", "Accept all"]) {
    try {
      const btn = page.getByRole("button", { name: label });
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(500);
      break;
    } catch {
      // Not found, try next
    }
  }

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="pass"]', password);
  await page.click('button[name="login"]');

  // Wait for navigation after login
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });
  await page.waitForTimeout(1000);
}

async function expandTruncatedPosts(page: import("playwright").Page) {
  for (const label of ["Wyświetl więcej", "See more"]) {
    try {
      const link = page.locator('[role="article"]').first().getByText(label, { exact: true });
      if (await link.count() > 0) {
        await link.first().click({ timeout: 3000 });
        await page.waitForTimeout(1000);
        return;
      }
    } catch {
      // Not found or click failed, try next
    }
  }
}

async function extractLatestPostText(
  page: import("playwright").Page
): Promise<string | null> {
  // Expand truncated posts first
  await expandTruncatedPosts(page);

  // Strategy 1: role="article" elements (standard FB post containers)
  try {
    const articles = page.locator('[role="article"]');
    const count = await articles.count();
    if (count > 0) {
      const text = await articles.first().innerText({ timeout: 5000 });
      if (text.trim()) return text.trim();
    }
  } catch {
    // Fall through to next strategy
  }

  // Strategy 2: data-ad-preview="message" (alternative post selector)
  try {
    const messages = page.locator('[data-ad-preview="message"]');
    const count = await messages.count();
    if (count > 0) {
      const text = await messages.first().innerText({ timeout: 5000 });
      if (text.trim()) return text.trim();
    }
  } catch {
    // Fall through
  }

  return null;
}
