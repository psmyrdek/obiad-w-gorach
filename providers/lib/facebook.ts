import {chromium, type Browser} from "playwright";

export interface FacebookScrapeOptions {
  url: string;
  headless?: boolean;
}

export interface FacebookScrapeResult {
  text: string | null;
  error: string | null;
}

export async function scrapeFacebookPage(
  options: FacebookScrapeOptions,
): Promise<FacebookScrapeResult> {
  const {url, headless = true} = options;

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
    const page = await browser.newPage();

    // Go to Facebook and dismiss cookie dialog if present
    await page.goto("https://www.facebook.com/", {
      waitUntil: "domcontentloaded",
    });
    try {
      const dialog = page.getByTestId("cookie-policy-manage-dialog");
      await dialog.waitFor({timeout: 5000});
      await dialog
        .locator(
          '[role="button"][aria-label="Zezwól na wszystkie pliki cookie"]',
        )
        .last()
        .click({timeout: 5000});
    } catch {
      // Cookie dialog not present or already dismissed, continue
    }

    // Log in
    await page.getByTestId("royal-email").click();
    await page.getByTestId("royal-email").fill(email);
    await page.locator("#passContainer").click();
    await page.getByTestId("royal-pass").fill(password);
    await page.getByTestId("royal-login-button").click();

    // Wait for feed to confirm login succeeded
    await page.locator('[role="navigation"]').first().waitFor({timeout: 15000});

    // Navigate to target page
    await page.goto(url, {waitUntil: "domcontentloaded"});

    // Expand truncated post
    await page.getByRole("button", {name: "Wyświetl więcej"}).nth(1).click();

    // Extract post text
    const text = await page
      .locator("[data-ad-preview='message']")
      .first()
      .innerText();

    console.log(text);

    await browser.close();

    return {text: text.trim() || null, error: null};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await browser?.close().catch(() => {});
    return {text: null, error: message};
  }
}
