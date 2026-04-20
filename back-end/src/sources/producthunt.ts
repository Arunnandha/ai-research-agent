import axios from "axios";

import type { NormalizedSourceItem } from "./types.js";

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

  if (!token) {
    throw new Error("Missing PRODUCT_HUNT_ACCESS_TOKEN environment variable.");
  }

  const response = await axios.post<ProductHuntResponse>(
    "https://api.producthunt.com/v2/api/graphql",
    {
      query: PRODUCT_HUNT_TOP_PRODUCTS_QUERY,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const edges = response.data.data?.posts?.edges ?? [];

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
