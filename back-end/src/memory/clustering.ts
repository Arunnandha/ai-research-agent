import { OpenAIEmbeddings } from "@langchain/openai";

export interface ClusterableItem {
  title: string;
  description: string;
  category: string;
  problem: string;
}

export interface SimilarityCluster {
  size: number;
  theme: string;
  memberTitles: string[];
}

const cosineSimilarity = (a: number[], b: number[]): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const valueA = a[i];
    const valueB = b[i];

    if (valueA === undefined || valueB === undefined) {
      continue;
    }

    dot += valueA * valueB;
    normA += valueA * valueA;
    normB += valueB * valueB;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const buildItemText = (item: ClusterableItem): string => {
  return [
    `Title: ${item.title}`,
    `Category: ${item.category}`,
    `Problem: ${item.problem}`,
    `Description: ${item.description}`,
  ].join("\n");
};

const summarizeClusterTheme = (items: ClusterableItem[]): string => {
  const categories = new Map<string, number>();
  for (const item of items) {
    categories.set(item.category, (categories.get(item.category) ?? 0) + 1);
  }

  const dominantCategory =
    [...categories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "mixed category";
  return `${dominantCategory} pattern`;
};

export const clusterItemsByEmbeddingSimilarity = async (
  items: ClusterableItem[],
  similarityThreshold = 0.78,
): Promise<SimilarityCluster[]> => {
  if (items.length < 2) {
    return [];
  }

  try {
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });
    const vectors = await embeddings.embedDocuments(items.map(buildItemText));
    const visited = new Set<number>();
    const clusters: SimilarityCluster[] = [];

    for (let i = 0; i < vectors.length; i += 1) {
      if (visited.has(i)) {
        continue;
      }

      const queue = [i];
      const component: number[] = [];
      visited.add(i);

      while (queue.length > 0) {
        const current = queue.shift();
        if (current === undefined) {
          continue;
        }

        component.push(current);

        for (let j = 0; j < vectors.length; j += 1) {
          if (visited.has(j) || current === j) {
            continue;
          }

          const currentVector = vectors[current];
          const candidateVector = vectors[j];
          if (currentVector === undefined || candidateVector === undefined) {
            continue;
          }

          const score = cosineSimilarity(currentVector, candidateVector);
          if (score >= similarityThreshold) {
            visited.add(j);
            queue.push(j);
          }
        }
      }

      if (component.length >= 2) {
        const componentItems = component
          .map((index) => items[index])
          .filter((item): item is ClusterableItem => item !== undefined);

        if (componentItems.length < 2) {
          continue;
        }

        clusters.push({
          size: componentItems.length,
          theme: summarizeClusterTheme(componentItems),
          memberTitles: componentItems.map((item) => item.title),
        });
      }
    }

    return clusters.sort((a, b) => b.size - a.size);
  } catch {
    return [];
  }
};
