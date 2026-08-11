import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticleBySlug } from "@/lib/content";
import { ImageSlot } from "@/components/image-slot";
import { siteUrl, siteName } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical: `/${locale}/news/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "long",
  }).format(date);
}

export default async function ArticleDetailPage({
  params,
}: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "news" });
  const article = await getArticleBySlug(locale, slug);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date.toISOString(),
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: siteName },
    image: article.imageUrl ? [article.imageUrl] : undefined,
    url: `${siteUrl}/${locale}/news/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-6 pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-brand-teal-600">
          <Link href="/news" className="hover:text-brand-teal-900">
            {t("breadcrumb")}
          </Link>
          <span className="mx-2 text-brand-teal-300">/</span>
          <span className="text-brand-teal-900">{article.title}</span>
        </nav>
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-6">
        <ImageSlot
          imageUrl={article.imageUrl}
          imageAlt={article.imageAlt}
          className="aspect-video w-full"
        />
      </div>

      <article className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-brand-teal-900 sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-brand-teal-600">
          {article.authorName} · {formatDate(article.date, locale)}
        </p>

        <div
          className="prose prose-teal mt-10 max-w-none prose-headings:text-brand-teal-900 prose-a:text-brand-teal-600"
          dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
        />
      </article>
    </>
  );
}
