import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/terms"].map((path) => ({
    url: `${appUrl()}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.3 : 1,
  }));
}
