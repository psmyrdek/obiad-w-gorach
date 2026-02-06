import {createOpenRouter} from "@openrouter/ai-sdk-provider";
import {generateText, Output} from "ai";
import {z} from "zod";
import type {DayMenu} from "../types.js";
import {buildParsingPrompt} from "./parsing-prompt.js";

const MODEL_NAME = "google/gemini-3-flash-preview";

const dayMenuItemSchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  items: z.array(
    z.object({
      name: z.string().describe("Dish name"),
      price: z
        .number()
        .nullable()
        .describe("Price in PLN, or null if included in set price"),
    }),
  ),
});

export async function parseMenuText(text: string): Promise<DayMenu[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log("[parse-menu] OPENROUTER_API_KEY not set, skipping AI parsing");
    return [];
  }

  const openrouter = createOpenRouter({apiKey});

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekDates = Array.from({length: 5}, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  }) as [string, string, string, string, string];

  const {output} = await generateText({
    model: openrouter(MODEL_NAME),
    output: Output.array({element: dayMenuItemSchema}),
    prompt: buildParsingPrompt({weekDates, menuText: text}),
  });

  return (output ?? []) as DayMenu[];
}
