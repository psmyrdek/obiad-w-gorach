import { scrapeFacebookPage } from "../providers/lib/facebook.js";
import { mkdirSync, writeFileSync } from "fs";

const url = "https://www.facebook.com/MagiaSmakuStolowka";

console.log(`Scraping Facebook page: ${url}`);

const result = await scrapeFacebookPage({ url });

if (result.error) {
  console.error(`Error: ${result.error}`);
  process.exitCode = 1;
} else if (!result.text) {
  console.warn("No post text found on the page.");
} else {
  const text = result.text;
  console.log(`\nExtracted text (${text.length} chars):`);
  console.log("---");
  console.log(text.slice(0, 500));
  if (text.length > 500) {
    console.log(`\n... (${text.length - 500} more chars)`);
  }
  console.log("---");

  mkdirSync("tmp", { recursive: true });
  writeFileSync("tmp/facebook-test-output.txt", text, "utf-8");
  console.log("\nFull text written to tmp/facebook-test-output.txt");
}
