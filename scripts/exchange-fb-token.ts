import "dotenv/config";

const FB_API_VERSION = "v21.0";
const FB_GRAPH_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

async function exchangeForLongLivedToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string,
): Promise<string> {
  const url = `${FB_GRAPH_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to exchange token: ${JSON.stringify(json.error ?? json)}`);
  }

  console.log(`Long-lived user token (expires in ${json.expires_in}s / ~${Math.round(json.expires_in / 86400)} days):`);
  console.log(json.access_token);
  console.log();

  return json.access_token;
}

async function main() {
  const shortLivedToken = process.argv[2];
  if (!shortLivedToken) {
    console.error("Usage: npx tsx scripts/exchange-fb-token.ts <SHORT_LIVED_TOKEN>");
    process.exit(1);
  }

  const appId = process.env.FB_APP_ID;
  const appSecret = process.env.FB_APP_SECRET;
  if (!appId || !appSecret) {
    console.error("Missing FB_APP_ID or FB_APP_SECRET in .env");
    process.exit(1);
  }

  const longLivedToken = await exchangeForLongLivedToken(shortLivedToken, appId, appSecret);

  console.log("Fetching page tokens (these never expire)...\n");

  const res = await fetch(`${FB_GRAPH_URL}/me/accounts?access_token=${longLivedToken}`);
  const json = await res.json();

  if (!res.ok) {
    console.error(`Failed to fetch pages: ${JSON.stringify(json.error ?? json)}`);
    console.log("The long-lived user token above is still valid — use it directly.");
    return;
  }

  if (json.data?.length > 0) {
    console.log("Page tokens:");
    for (const page of json.data) {
      console.log(`  ${page.name} (${page.id}):`);
      console.log(`  ${page.access_token}\n`);
    }
  } else {
    console.log("No pages found. Use the long-lived user token above as FB_ACCESS_TOKEN.");
  }
}

main();
