import { prisma } from "./prisma";

export type SectionKey =
  | "hero"
  | "about"
  | "products"
  | "team"
  | "cta"
  | "profileSummary"
  | "visi"
  | "misi"
  | "corporateCulture"
  | "halal"
  | "bpom";

export function toListItems(body: string): string[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export type Section = {
  title: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  whatsappNumber?: string;
  googleMapsUrl?: string;
  contactEmail?: string;
  fileUrl?: string;
  fileName?: string;
};

export async function getSections(
  locale: string,
): Promise<Record<SectionKey, Section | null>> {
  const rows = await prisma.pageSection.findMany({ include: { media: true } });
  const byKey = new Map(rows.map((row) => [row.key as SectionKey, row]));
  const isId = locale === "id";

  const toSection = (key: SectionKey): Section | null => {
    const row = byKey.get(key);
    if (!row) return null;
    return {
      title: (isId ? row.titleId : row.titleEn) || row.titleEn,
      body: (isId ? row.bodyId : row.bodyEn) || row.bodyEn,
      imageUrl: row.media?.url,
      imageAlt: row.media
        ? (isId ? row.media.altTextId : row.media.altTextEn) || undefined
        : undefined,
      whatsappNumber: row.whatsappNumber ?? undefined,
      googleMapsUrl: row.googleMapsUrl ?? undefined,
      contactEmail: row.contactEmail ?? undefined,
      fileUrl: row.fileUrl ?? undefined,
      fileName: row.fileName ?? undefined,
    };
  };

  return {
    hero: toSection("hero"),
    about: toSection("about"),
    products: toSection("products"),
    team: toSection("team"),
    cta: toSection("cta"),
    profileSummary: toSection("profileSummary"),
    visi: toSection("visi"),
    misi: toSection("misi"),
    corporateCulture: toSection("corporateCulture"),
    halal: toSection("halal"),
    bpom: toSection("bpom"),
  };
}

export type CardItem = {
  id: string;
  name: string;
  detail: string;
  imageUrl?: string;
  imageAlt?: string;
};

type CardRow = {
  id: string;
  nameEn: string;
  nameId: string;
  detailEn: string;
  detailId: string;
  media: { url: string; altTextEn: string; altTextId: string } | null;
};

function toCardItem(row: CardRow, isId: boolean): CardItem {
  return {
    id: row.id,
    name: (isId ? row.nameId : row.nameEn) || row.nameEn,
    detail: (isId ? row.detailId : row.detailEn) || row.detailEn,
    imageUrl: row.media?.url,
    imageAlt: row.media
      ? (isId ? row.media.altTextId : row.media.altTextEn) || undefined
      : undefined,
  };
}

export async function getProducts(locale: string): Promise<CardItem[]> {
  const rows = await prisma.product.findMany({
    include: { media: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const isId = locale === "id";
  return rows.map((row) => toCardItem(row, isId));
}

export async function getTeamMembers(locale: string): Promise<CardItem[]> {
  const rows = await prisma.teamMember.findMany({
    include: { media: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const isId = locale === "id";
  return rows.map((row) => toCardItem(row, isId));
}

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  date: Date;
  imageUrl?: string;
  imageAlt?: string;
};

export const ARTICLES_PER_PAGE = 10;

export async function getArticles(
  locale: string,
  page: number,
): Promise<{ articles: ArticleSummary[]; totalPages: number }> {
  const isId = locale === "id";
  const where = { status: "PUBLISHED" as const };

  const [rows, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { coverMedia: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    articles: rows.map((row) => ({
      slug: row.slug,
      title: (isId ? row.titleId : row.titleEn) || row.titleEn,
      excerpt: (isId ? row.excerptId : row.excerptEn) || row.excerptEn,
      authorName: row.authorName,
      date: row.publishedAt ?? row.updatedAt,
      imageUrl: row.coverMedia?.url,
      imageAlt: row.coverMedia
        ? (isId ? row.coverMedia.altTextId : row.coverMedia.altTextEn) || undefined
        : undefined,
    })),
    totalPages: Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE)),
  };
}

export type ArticleDetail = ArticleSummary & { bodyHtml: string };

export async function getArticleBySlug(
  locale: string,
  slug: string,
): Promise<ArticleDetail | null> {
  const row = await prisma.blogPost.findUnique({
    where: { slug },
    include: { coverMedia: true },
  });
  if (!row || row.status !== "PUBLISHED") return null;

  const isId = locale === "id";
  return {
    slug: row.slug,
    title: (isId ? row.titleId : row.titleEn) || row.titleEn,
    excerpt: (isId ? row.excerptId : row.excerptEn) || row.excerptEn,
    authorName: row.authorName,
    date: row.publishedAt ?? row.updatedAt,
    bodyHtml: (isId ? row.bodyId : row.bodyEn) || row.bodyEn,
    imageUrl: row.coverMedia?.url,
    imageAlt: row.coverMedia
      ? (isId ? row.coverMedia.altTextId : row.coverMedia.altTextEn) || undefined
      : undefined,
  };
}
