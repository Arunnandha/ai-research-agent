import { fetchProductHuntItems } from "./producthunt";
import { fetchRssItems } from "./rss";
import type { NormalizedSourceItem } from "./types";

export const aggregateIngestionData = async (): Promise<NormalizedSourceItem[]> => {
  const [productHuntItems, rssItems] = await Promise.allSettled([
    fetchProductHuntItems(),
    fetchRssItems(),
  ]);

  const normalized: NormalizedSourceItem[] = [];

  if (productHuntItems.status === "fulfilled") {
    normalized.push(...productHuntItems.value);
  }

  if (rssItems.status === "fulfilled") {
    normalized.push(...rssItems.value);
  }

  return normalized;
};
