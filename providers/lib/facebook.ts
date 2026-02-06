import {chromium, type Browser} from "playwright";

export interface FacebookScrapeOptions {
  url: string;
  headless?: boolean;
  hasPinnedPost?: boolean;
}

export interface FacebookScrapeResult {
  text: string | null;
  error: string | null;
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

    // Find the target post (skip pinned post if present)
    const postIndex = hasPinnedPost ? 1 : 0;
    const targetPost = page.locator("[data-ad-preview='message']").nth(postIndex);
    await targetPost.waitFor({timeout: 10000});

    // Expand truncated post by finding "Wyświetl więcej" relative to the target post.
    // We walk up the DOM from the post element to find the nearest ancestor that
    // contains the expand button, avoiding accidental clicks on unrelated buttons.
    try {
      const expandBtn = targetPost
        .locator("xpath=ancestor::div[.//div[@role='button'][contains(., 'Wyświetl więcej')]][1]")
        .getByRole("button", {name: "Wyświetl więcej"});
      await expandBtn.click({timeout: 5000});
    } catch {
      // Post might not be truncated, continue
    }

    // Extract expanded post text
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
