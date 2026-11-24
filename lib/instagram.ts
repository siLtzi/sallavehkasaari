import type { InstagramFeedSettings, InstagramPost } from "./content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function httpsUrl(value: unknown, instagramOnly = false): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      (!instagramOnly || url.hostname === "instagram.com" || url.hostname.endsWith(".instagram.com"));
  } catch {
    return false;
  }
}

export async function getInstagramPosts(settings?: InstagramFeedSettings | null): Promise<InstagramPost[]> {
  if (!settings?.enabled) return [];
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token || !settings.accountId || !/^\d+$/.test(settings.accountId)) {
    console.error("Instagram-kuvavirta on käytössä, mutta palvelimen tunnus tai tilin tunnistenumero puuttuu tai on virheellinen.");
    return [];
  }
  const limit = settings.limit ?? 6;
  if (!Number.isInteger(limit) || limit < 1 || limit > 12) {
    console.error("Instagram-kuvavirran julkaisumäärän on oltava kokonaisluku 1–12.");
    return [];
  }

  const url = new URL(`https://graph.facebook.com/v27.0/${settings.accountId}/media`);
  url.searchParams.set("fields", "id,media_type,media_url,thumbnail_url,permalink,alt_text");
  url.searchParams.set("limit", String(limit));

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    console.error("Instagram-kuvavirran haku epäonnistui: yhteyttä Metaan ei saatu.");
    return [];
  }
  if (!response.ok) {
    console.error(`Instagram-kuvavirran haku epäonnistui (HTTP ${response.status}). Tarkista Metan käyttöoikeudet ja tunnus.`);
    return [];
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    console.error("Instagram-kuvavirran vastaus ei ollut kelvollista JSON-muotoa.");
    return [];
  }
  if (!isObject(result) || !Array.isArray(result.data)) {
    console.error("Instagram-kuvavirran vastauksesta puuttuu julkaisulista.");
    return [];
  }

  const posts: InstagramPost[] = [];
  for (const item of result.data) {
    if (!isObject(item) || typeof item.id !== "string" || !httpsUrl(item.permalink, true)) {
      console.warn("Instagram-kuvavirrasta ohitettiin julkaisu, jonka tiedot olivat puutteelliset.");
      continue;
    }
    const imageUrl = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
    if (!httpsUrl(imageUrl)) {
      console.warn("Instagram-kuvavirrasta ohitettiin julkaisu, jolla ei ollut kelvollista esikatselukuvaa.");
      continue;
    }
    const alt = typeof item.alt_text === "string" ? item.alt_text.trim() : "";
    posts.push({ id: item.id, imageUrl, permalink: item.permalink, alt });
  }
  return posts;
}
