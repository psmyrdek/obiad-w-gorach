import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  use: {
    headless: false,
    trace: "on",
    screenshot: "on",
    video: "on",
  },
  outputDir: "./test-results",
});
