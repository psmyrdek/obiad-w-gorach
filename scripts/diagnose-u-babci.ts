import { chromium, type Page } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import "dotenv/config";

const url = "https://www.facebook.com/ubabcikuchniadomowa";

async function diagnose() {
  const email = process.env.FB_EMAIL;
  const password = process.env.FB_PASSWORD;

  if (!email || !password) {
    console.error("FB_EMAIL and FB_PASSWORD env vars are required");
    process.exit(1);
  }

  console.log(`=== U Babci Facebook Page Analyzer ===`);
  console.log(`URL: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // --- Step 1: Login ---
  console.log("[1] Navigating to Facebook...");
  await page.goto("https://www.facebook.com/", { waitUntil: "domcontentloaded" });

  try {
    const dialog = page.getByTestId("cookie-policy-manage-dialog");
    await dialog.waitFor({ timeout: 5000 });
    await dialog
      .locator('[role="button"][aria-label="Zezwól na wszystkie pliki cookie"]')
      .last()
      .click({ timeout: 5000 });
    console.log("  Cookie dialog dismissed");
  } catch {
    console.log("  No cookie dialog");
  }

  console.log("[2] Logging in...");
  await page.getByTestId("royal-email").click();
  await page.getByTestId("royal-email").fill(email);
  await page.locator("#passContainer").click();
  await page.getByTestId("royal-pass").fill(password);
  await page.getByTestId("royal-login-button").click();
  await page.locator('[role="navigation"]').first().waitFor({ timeout: 15000 });
  console.log("  Login successful");

  // --- Step 2: Navigate to page ---
  console.log(`[3] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  // --- Step 3: Save full HTML ---
  mkdirSync("tmp", { recursive: true });
  const html = await page.content();
  writeFileSync("tmp/u-babci-full.html", html, "utf-8");
  console.log(`  Full HTML saved: ${html.length} chars`);

  // --- Step 4: Analyze posts structure ---
  console.log("\n=== POST STRUCTURE ANALYSIS ===\n");

  // Check data-ad-preview='message' elements (current selector)
  const adPreviewMessages = await page.locator("[data-ad-preview='message']").all();
  console.log(`[data-ad-preview='message'] elements: ${adPreviewMessages.length}`);
  for (let i = 0; i < adPreviewMessages.length; i++) {
    const text = await adPreviewMessages[i].innerText().catch(() => "(error)");
    console.log(`  [${i}] (${text.length} chars): ${text.slice(0, 200).replace(/\n/g, " | ")}${text.length > 200 ? "..." : ""}`);
  }

  // Check role="article" elements
  console.log("");
  const articles = await page.locator('[role="article"]').all();
  console.log(`[role="article"] elements: ${articles.length}`);

  for (let i = 0; i < Math.min(articles.length, 8); i++) {
    const articleHtml = await articles[i].innerHTML().catch(() => "");
    const text = await articles[i].innerText().catch(() => "(error)");

    // Check if this article contains pinned post indicator
    const hasPinned =
      articleHtml.includes("Przypięty") ||
      articleHtml.includes("Pinned") ||
      articleHtml.includes("pinned_post");

    // Check for "Wyświetl więcej" buttons inside this article
    const showMoreCount = await articles[i].getByRole("button", { name: "Wyświetl więcej" }).count();

    console.log(`  [${i}] pinned=${hasPinned} showMore=${showMoreCount} text=(${text.length} chars)`);
    console.log(`       Preview: ${text.slice(0, 250).replace(/\n/g, " | ")}${text.length > 250 ? "..." : ""}`);
    console.log("");
  }

  // --- Step 5: Look for pinned post markers specifically ---
  console.log("\n=== PINNED POST DETECTION ===\n");

  const pinnedIndicators = [
    "Przypięty post",
    "Pinned post",
    "Przypięty",
    "Pinned",
  ];

  for (const indicator of pinnedIndicators) {
    const count = await page.getByText(indicator, { exact: false }).count();
    console.log(`Text "${indicator}": ${count} occurrences`);
  }

  // Search for pinned-related attributes in HTML
  const pinnedMatches = html.match(/pinned[^"]{0,50}/gi) || [];
  console.log(`\nHTML matches for "pinned*": ${pinnedMatches.length}`);
  for (const m of pinnedMatches.slice(0, 10)) {
    console.log(`  "${m}"`);
  }

  // --- Step 6: Analyze "Wyświetl więcej" buttons ---
  console.log("\n=== 'WYŚWIETL WIĘCEJ' BUTTONS ===\n");

  const showMoreButtons = await page.getByRole("button", { name: "Wyświetl więcej" }).all();
  console.log(`Total "Wyświetl więcej" buttons: ${showMoreButtons.length}`);

  for (let i = 0; i < showMoreButtons.length; i++) {
    const visible = await showMoreButtons[i].isVisible().catch(() => false);
    // Try to get surrounding context
    const parentText = await showMoreButtons[i].evaluate((el) => {
      let parent = el.parentElement;
      for (let j = 0; j < 5 && parent; j++) parent = parent.parentElement;
      return parent?.textContent?.slice(0, 150) || "(no parent context)";
    }).catch(() => "(error)");

    console.log(`  [${i}] visible=${visible}`);
    console.log(`       context: ${parentText.replace(/\n/g, " | ").slice(0, 150)}`);
  }

  // --- Step 7: Click "Wyświetl więcej" on each post and extract full text ---
  console.log("\n=== FULL POST TEXTS (after expanding) ===\n");

  // Click all show-more buttons first
  for (let i = 0; i < showMoreButtons.length; i++) {
    try {
      const visible = await showMoreButtons[i].isVisible();
      if (visible) {
        await showMoreButtons[i].click({ timeout: 3000 });
        console.log(`  Clicked "Wyświetl więcej" button [${i}]`);
        await page.waitForTimeout(500);
      }
    } catch {
      console.log(`  Failed to click button [${i}]`);
    }
  }

  // Re-read posts after expanding
  const expandedMessages = await page.locator("[data-ad-preview='message']").all();
  console.log(`\nExpanded [data-ad-preview='message'] elements: ${expandedMessages.length}`);
  for (let i = 0; i < expandedMessages.length; i++) {
    const text = await expandedMessages[i].innerText().catch(() => "(error)");
    console.log(`\n--- Post [${i}] (${text.length} chars) ---`);
    console.log(text.slice(0, 1000));
    if (text.length > 1000) console.log(`\n... (${text.length - 1000} more chars)`);
  }

  // --- Step 8: Save expanded HTML too ---
  const expandedHtml = await page.content();
  writeFileSync("tmp/u-babci-expanded.html", expandedHtml, "utf-8");
  console.log(`\nExpanded HTML saved: ${expandedHtml.length} chars`);

  // --- Step 9: Dump detailed DOM structure of posts area ---
  console.log("\n=== DOM STRUCTURE AROUND POSTS ===\n");

  const postsStructure = await page.evaluate(() => {
    const posts = document.querySelectorAll("[data-ad-preview='message']");
    const results: string[] = [];

    posts.forEach((post, i) => {
      let node: Element | null = post;
      const path: string[] = [];

      // Walk up to find article boundary
      for (let j = 0; j < 15 && node; j++) {
        const attrs = Array.from(node.attributes)
          .filter((a) => ["role", "data-ad-preview", "class", "aria-label", "data-testid"].includes(a.name))
          .map((a) => `${a.name}="${a.value.slice(0, 60)}"`)
          .join(" ");
        path.push(`<${node.tagName.toLowerCase()} ${attrs}>`);
        if (node.getAttribute("role") === "article") break;
        node = node.parentElement;
      }

      results.push(`Post [${i}] DOM path (child → parent):\n${path.map((p, j) => `  ${"  ".repeat(j)}${p}`).join("\n")}`);
    });

    return results.join("\n\n");
  });

  console.log(postsStructure);

  // --- Step 10: Check for date/time information near posts ---
  console.log("\n=== DATE/TIME INFO NEAR POSTS ===\n");

  const timeInfo = await page.evaluate(() => {
    const articles = document.querySelectorAll('[role="article"]');
    const results: string[] = [];

    articles.forEach((article, i) => {
      // Find all <a> tags with timestamps or dates
      const links = article.querySelectorAll("a[href*='/posts/'], a[aria-label], abbr[data-utime]");
      const times: string[] = [];
      links.forEach((link) => {
        const ariaLabel = link.getAttribute("aria-label") || "";
        const text = link.textContent || "";
        if (ariaLabel || text.length < 100) {
          times.push(`aria="${ariaLabel}" text="${text.slice(0, 80)}"`);
        }
      });

      if (times.length > 0 || i < 5) {
        results.push(`Article [${i}]: ${times.length} time links\n${times.map((t) => `  ${t}`).join("\n")}`);
      }
    });

    return results.join("\n");
  });

  console.log(timeInfo);

  await browser.close();
  console.log("\n=== DONE ===");
}

diagnose().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
