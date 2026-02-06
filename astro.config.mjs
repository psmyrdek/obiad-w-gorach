import {defineConfig} from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  server: {
    port: 3000,
  },
  integrations: [react(), tailwind()],
  devToolbar: {
    enabled: false,
  },
});
