import {test} from "@playwright/test";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

test("test", async ({page}) => {
  await page.goto("https://www.facebook.com/", {waitUntil: "domcontentloaded"});

  await page
    .locator('[aria-label="Allow all cookies"]')
    .first()
    .click({timeout: 15000});

  await page.getByTestId("royal-email").click();
  await page.getByTestId("royal-email").fill(process.env.FB_EMAIL);
  await page.locator("#passContainer").click();
  await page.getByTestId("royal-pass").fill(process.env.FB_PASSWORD);
  await page.getByTestId("royal-login-button").click();
  await page
    .getByRole("button", {name: "O czym myślisz, Przemysław?"})
    .waitFor();
  await page.goto("https://www.facebook.com/MagiaSmakuStolowka");
  await page.getByRole("button", {name: "Wyświetl więcej"}).nth(1).click();
  const text = await page
    .locator("[data-ad-preview='message']")
    .first()
    .innerText();
  fs.writeFileSync("facebook-output.txt", text, "utf-8");
});
