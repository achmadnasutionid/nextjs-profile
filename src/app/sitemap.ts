import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { prisma } from "@/lib/prisma";

const PATHS = [
  { path: "", priority: { default: 1, other: 0.9 } },
  { path: "/profile", priority: { default: 0.8, other: 0.7 } },
  { path: "/contact", priority: { default: 0.7, other: 0.6 } },
  { path: "/news", priority: { default: 0.7, other: 0.6 } },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = PATHS.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === routing.defaultLocale ? priority.default : priority.other,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  );

  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const articleEntries = posts.flatMap((post) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}/news/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? 0.6 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}/news/${post.slug}`]),
        ),
      },
    })),
  );

  return [...staticEntries, ...articleEntries];
}
