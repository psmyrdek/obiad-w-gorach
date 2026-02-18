import "dotenv/config";

const FB_API_VERSION = "v21.0";
const FB_GRAPH_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

interface FacebookPage {
  id: string;
  name: string;
}

const PAGES: FacebookPage[] = [
  { id: "126626397494420", name: "Garden Bar" },
  { id: "ubabcikuchniadomowa", name: "U Babci" },
  { id: "MagiaSmakuStolowka", name: "Magia Smaku" },
  { id: "61551705328071", name: "Smakuj Życie" },
  { id: "CubusBeskidy", name: "Cubus Beskidy" },
];

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
}

interface FacebookResponse {
  data: FacebookPost[];
  error?: { message: string; type: string; code: number };
}

function getTodaySinceTimestamp(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor(today.getTime() / 1000);
}

async function fetchTodaysPosts(
  pageId: string,
  accessToken: string
): Promise<FacebookResponse> {
  const since = getTodaySinceTimestamp();
  const fields = "id,message,created_time,full_picture,permalink_url";
  const url = `${FB_GRAPH_URL}/${pageId}/posts?since=${since}&fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      `Facebook API error for ${pageId}: ${JSON.stringify(json.error ?? json)}`
    );
  }

  return json as FacebookResponse;
}

async function main() {
  const accessToken = process.env.FB_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Missing FB_ACCESS_TOKEN environment variable.");
    process.exit(1);
  }

  console.log(
    `Fetching today's posts (since ${new Date(getTodaySinceTimestamp() * 1000).toISOString()})...\n`
  );

  for (const page of PAGES) {
    console.log(`=== ${page.name} (${page.id}) ===`);

    try {
      const result = await fetchTodaysPosts(page.id, accessToken);

      if (result.data.length === 0) {
        console.log("No posts today.\n");
        continue;
      }

      for (const post of result.data) {
        console.log(`[${post.created_time}] ${post.permalink_url ?? ""}`);
        if (post.message) {
          console.log(post.message);
        }
        if (post.full_picture) {
          console.log(`Image: ${post.full_picture}`);
        }
        console.log();
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : error}\n`
      );
    }
  }
}

main();
