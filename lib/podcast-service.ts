import {
  podcastCategories,
  PodcastCategory,
  type PodcastEpisode,
} from "@/types/podcast";
import { getNextDayOfWeek } from "./utils";

// RSS feed constants
export const RSS_FEED_URL = "/api/tad.rss";
export const RSS_STORAGE_KEY = "star-trek-podcast-rss-xml";
export const RSS_STORAGE_TIMESTAMP = "star-trek-podcast-timestamp";
export const PODCAST_CATEGORIES_KEY = "star-trek-podcast-categories";

// XML namespaces
export const ITUNES_NAMESPACE = "http://www.itunes.com/dtds/podcast-1.0.dtd";

function parseRSSItemToImageUrl(
  item: Element,
  xmlDoc: XMLDocument,
): string | null {
  let imageUrl = getElementNSWithFallback(
    item,
    ITUNES_NAMESPACE,
    "itunes",
    "image",
  )?.getAttribute("href");

  // If no itunes:image in the item, try to get the channel image
  if (!imageUrl) {
    const channel = xmlDoc.querySelector("channel");
    if (channel) {
      // Try to get channel's itunes:image
      let imageUrl = getElementNSWithFallback(
        channel,
        ITUNES_NAMESPACE,
        "itunes",
        "image",
      )?.getAttribute("href");

      // If still no image, try the standard RSS image
      if (!imageUrl) {
        imageUrl = channel.querySelector("image > url")?.textContent ?? "";
      }
    }
  }

  return imageUrl ?? null;
}

function extractCategoryFromTitle(title: string): PodcastCategory {
  let category = podcastCategories[podcastCategories.length - 1];
  for (const categoryCandidate of podcastCategories) {
    if (title.includes(categoryCandidate.search)) {
      return categoryCandidate;
    }
  }

  return category;
}

function parseRSSItemToFormattedPubDate(
  item: Element,
  _xmlDoc: XMLDocument,
): string {
  const pubDate = item.querySelector("pubDate")?.textContent;
  const date = pubDate ? new Date(pubDate) : new Date();

  let formattedDate = "Unknown";
  try {
    formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {}
  return formattedDate;
}

function parseRSSItemToPodcastEpisode(
  item: Element,
  xmlDoc: Document,
): PodcastEpisode {
  const id = item.querySelector("guid")?.textContent || "";

  const title = item.querySelector("title")?.textContent || "Untitled Episode";

  const itunesTitle = getElementNSTextContentWithFallback(
    item,
    ITUNES_NAMESPACE,
    "itunes",
    "title",
  );

  const description =
    item.querySelector("description")?.textContent ||
    "No description available.";

  const date = parseRSSItemToFormattedPubDate(item, xmlDoc);

  const enclosure = item.querySelector("enclosure");
  const audioUrl = enclosure?.getAttribute("url") || "";

  const linkUrl = item.querySelector("link")?.textContent || "";

  let duration =
    getElementNSTextContentWithFallback(
      item,
      ITUNES_NAMESPACE,
      "itunes",
      "duration",
    ) || "00:00";

  let imageUrl = parseRSSItemToImageUrl(item, xmlDoc);

  let category = extractCategoryFromTitle(title);

  return {
    id,
    title,
    description: description.replace(/<[^>]*>?/gm, ""), // Strip HTML tags
    category,
    duration,
    date,
    imageUrl,
    audioUrl,
    itunesTitle,
    linkUrl,
  };
}

function parseRSSFeedToEpisodes(xmlText: string): PodcastEpisode[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const items = xmlDoc.querySelectorAll("item");

  const episodes: PodcastEpisode[] = [];
  items.forEach((item: Element) => {
    const episode = parseRSSItemToPodcastEpisode(item, xmlDoc);
    episodes.push(episode);
  });

  return episodes;
}

function isCacheExpired(timestamp: number): boolean {
  const now = new Date();
  const lastFetchDate = new Date(timestamp);

  // Get the next Tuesday and Friday at 12 noon
  const nextTuesday = getNextDayOfWeek(lastFetchDate, 2, 12); // 2 = Tuesday
  const nextFriday = getNextDayOfWeek(lastFetchDate, 5, 12); // 5 = Friday

  // Get the earlier of the two dates
  const nextReleaseDate = nextTuesday < nextFriday ? nextTuesday : nextFriday;

  // Cache is expired if we've passed the next release date
  return now >= nextReleaseDate;
}

export async function fetchPodcastEpisodes(forceRefresh = false): Promise<{
  episodes: PodcastEpisode[];
  error: string | null;
}> {
  try {
    //
    // Check if we have cached RSS and it's still valid (unless force refresh)
    //
    if (!forceRefresh) {
      const cachedTimestamp = localStorage.getItem(RSS_STORAGE_TIMESTAMP);
      const cachedRSS = localStorage.getItem(RSS_STORAGE_KEY);

      if (cachedTimestamp && cachedRSS) {
        const timestamp = Number.parseInt(cachedTimestamp, 10);

        if (!isCacheExpired(timestamp)) {
          // Parse the cached RSS
          const episodes = parseRSSFeedToEpisodes(cachedRSS);
          return {
            episodes: episodes,
            error: null,
          };
        }
      }
    }

    //
    // We do not have a cache or a refresh was forced:
    //

    // Use a CORS proxy to fetch the RSS feed
    const response = await fetch(RSS_FEED_URL);

    if (!response.ok) {
      throw new Error(`RSS feed responded with status: ${response.status}`);
    }

    const xmlText = await response.text();

    // Parse the RSS feed
    const episodes = parseRSSFeedToEpisodes(xmlText);

    // Save the entire RSS XML to localStorage
    localStorage.setItem(RSS_STORAGE_KEY, xmlText);
    localStorage.setItem(
      RSS_STORAGE_TIMESTAMP,
      new Date().getTime().toString(),
    );

    // If we got episodes, return them
    if (episodes.length > 0) {
      return {
        episodes: episodes,
        error: null,
      };
    } else {
      throw new Error("No episodes found in RSS feed");
    }
  } catch (err) {
    console.error("Error fetching podcast data:", err);
    return {
      episodes: [],
      error:
        typeof err == "object" && err && "message" in err
          ? (err.message as string)
          : "Error while loading podcast feed",
    };
  }
}

function getElementNSWithFallback(
  item: Element,
  namespace: string,
  fallbackPrefix: string,
  tag: string,
): Element | null {
  const elements = item.getElementsByTagNameNS(namespace, tag);
  // Try to get the itunes:title using namespace-aware method
  if (elements.length > 0) {
    return elements[0];
  }

  // Fallback: try with querySelector and various namespace patterns
  const selectors = [`${fallbackPrefix}\\:${tag}`, `*|${tag}`];

  for (const selector of selectors) {
    try {
      const el = item.querySelector(selector);
      if (el) {
        return el;
      }
    } catch (e) {
      // Ignore errors and try next selector
    }
  }

  return null;
}

function getElementNSTextContentWithFallback(
  item: Element,
  namespace: string,
  fallbackPrefix: string,
  tag: string,
): string {
  const element = getElementNSWithFallback(
    item,
    namespace,
    fallbackPrefix,
    tag,
  );
  if (element && element.textContent) {
    return element.textContent;
  }

  return "";
}

export function getCategoryCounts(
  episodes: PodcastEpisode[],
  categories: PodcastCategory[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  categories.forEach((cat) => {
    counts[cat.id] = episodes.filter((ep) => ep.category.id === cat.id).length;
  });

  return counts;
}
