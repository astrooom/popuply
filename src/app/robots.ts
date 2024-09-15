import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/"],
      },
    ],
    sitemap: "https://popuply.net/sitemap.xml",
  }
}
