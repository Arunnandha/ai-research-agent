import type { NormalizedSourceItem } from "./types";

export interface ProductHuntProduct {
  name: string;
  tagline: string;
  description: string;
  url: string;
}

type ProductHuntResponse = {
  data?: {
    posts?: {
      edges?: Array<{
        node?: ProductHuntProduct;
      }>;
    };
  };
};

const PRODUCT_HUNT_TOP_PRODUCTS_QUERY = `
  query TopProducts {
    posts(first: 10, order: VOTES_COUNT) {
      edges {
        node {
          name
          tagline
          description
          url
        }
      }
    }
  }
`;

export const fetchTopProductHuntProducts = async (): Promise<ProductHuntProduct[]> => {
  const token = process.env.PRODUCT_HUNT_ACCESS_TOKEN;
  const apiUrl = process.env.PRODUCT_HUNT_API_URL;

  if (!token) {
    throw new Error("Missing PRODUCT_HUNT_ACCESS_TOKEN environment variable.");
  }
  if (!apiUrl) {
    throw new Error("Missing PRODUCT_HUNT_API_URL environment variable.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: PRODUCT_HUNT_TOP_PRODUCTS_QUERY }),
  });

  if (!response.ok) {
    throw new Error(`Product Hunt API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ProductHuntResponse;
  const edges = json.data?.posts?.edges ?? [];

  return edges
    .map((edge) => edge.node)
    .filter((node): node is ProductHuntProduct => Boolean(node));
};

export const fetchProductHuntItems = async (): Promise<NormalizedSourceItem[]> => {
  const products = await fetchTopProductHuntProducts();

  return products.map((product) => ({
    title: product.name,
    description: `${product.tagline} ${product.description} (${product.url})`.trim(),
    source: "producthunt",
  }));
};
