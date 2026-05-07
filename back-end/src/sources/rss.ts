import Parser from "rss-parser";

import type { NormalizedSourceItem } from "./types.js";

export interface RssNewsItem {
  title: string;
  summary: string;
  link: string;
}

const DEFAULT_AI_RSS_FEEDS = process.env.RSS_FEED_URLS
  ? process.env.RSS_FEED_URLS.split(",").map((url) => url.trim())
  : [];

const parser = new Parser();

export const fetchAiNewsFromRss = async (
  feeds: string[] = DEFAULT_AI_RSS_FEEDS,
  maxItemsPerFeed = 10,
): Promise<RssNewsItem[]> => {
  const results = await Promise.all(
    feeds.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);

        return (feed.items ?? []).slice(0, maxItemsPerFeed).map((item) => ({
          title: item.title ?? "Untitled",
          summary: item.contentSnippet ?? item.content ?? item.summary ?? "",
          link: item.link ?? "",
        }));
      } catch {
        return [];
      }
    }),
  );

  return results.flat();
};

export const fetchRssItems = async (): Promise<NormalizedSourceItem[]> => {
  const items = await fetchAiNewsFromRss();

  return items.map((item) => ({
    title: item.title,
    description: `${item.summary} (${item.link})`.trim(),
    source: "rss",
  }));
};
