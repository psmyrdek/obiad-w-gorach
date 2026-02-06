import {createOpenRouter} from "@openrouter/ai-sdk-provider";
import {generateText, Output} from "ai";
import {z} from "zod";
import type {DayMenu} from "../types.js";
import {buildParsingPrompt, buildImageParsingPrompt} from "./parsing-prompt.js";

const MODEL_NAME = "google/gemini-3-flash-preview";

const flatMenuItemSchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  name: z.string().describe("Dish name"),
  price: z
    .number()
    .nullable()
    .describe("Price in PLN, or null if included in set price"),
});

function groupByDate(
  items: z.infer<typeof flatMenuItemSchema>[],
): DayMenu[] {
  const map = new Map<string, DayMenu>();
  for (const item of items) {
    let day = map.get(item.date);
    if (!day) {
      day = {date: item.date, items: []};
      map.set(item.date, day);
    }
    day.items.push({name: item.name, price: item.price});
  }
  return Array.from(map.values());
}

function getWeekContext() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekDates = Array.from({length: 5}, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  }) as [string, string, string, string, string];
  return {today: today.toISOString().split("T")[0], weekDates};
}

function getOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }
  return createOpenRouter({apiKey});
}

export async function parseMenuText(text: string): Promise<DayMenu[]> {
  const openrouter = getOpenRouter();
  if (!openrouter) {
    console.log("[parse-menu] OPENROUTER_API_KEY not set, skipping AI parsing");
    return [];
  }

  const {today, weekDates} = getWeekContext();

  const {output} = await generateText({
    model: openrouter(MODEL_NAME),
    output: Output.array({element: flatMenuItemSchema}),
    prompt: buildParsingPrompt({weekDates, today, menuText: text}),
  });

  return groupByDate((output ?? []) as z.infer<typeof flatMenuItemSchema>[]);
}

export async function parseMenuImages(images: Uint8Array[]): Promise<DayMenu[]> {
  const openrouter = getOpenRouter();
  if (!openrouter) {
    console.log("[parse-menu] OPENROUTER_API_KEY not set, skipping AI parsing");
    return [];
  }

  const weekContext = getWeekContext();

  const {output} = await generateText({
    model: openrouter(MODEL_NAME),
    output: Output.array({element: flatMenuItemSchema}),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildImageParsingPrompt(weekContext),
          },
          ...images.map(
            (data) =>
              ({
                type: "image" as const,
                image: data,
              }),
          ),
        ],
      },
    ],
  });

  return groupByDate((output ?? []) as z.infer<typeof flatMenuItemSchema>[]);
}
