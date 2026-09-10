import type { MetadataRoute } from "next";
import { products } from "@/data/content";

const baseUrl = "https://www.gholzad.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    ...products.map((product) => ({
      url: `${baseUrl}/work/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
