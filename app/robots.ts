import type { MetadataRoute } from "next";
import { PUBLIC_INDEXING_ENABLED, SITE_URL } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: PUBLIC_INDEXING_ENABLED
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
