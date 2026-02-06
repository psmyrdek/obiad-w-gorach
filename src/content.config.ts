import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const menus = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/menus" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    phone: z.string(),
    scrapedAt: z.string(),
    menus: z.array(
      z.object({
        date: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number().nullable(),
          })
        ),
      })
    ),
  }),
});

export const collections = { menus };
