import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: new URL(path, `${SITE_URL}/`).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/data-") || path === "/privacy" || path === "/terms" || path === "/cookies" || path === "/google-data" || path === "/support" ? 0.5 : 0.8,
  }));
}
