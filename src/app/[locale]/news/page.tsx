import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content";
import { ImageSlot } from "@/components/image-slot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "News",
    alternates: { canonical: `/${locale}/news` },
  };
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "long",
  }).format(date);
}

export default async function NewsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "news" });
  const page = Math.max(1, Number(pageParam) || 1);
  const { articles, totalPages } = await getArticles(locale, page);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-brand-teal-900 sm:text-4xl">
        {t("pageTitle")}
      </h1>

      {articles.length === 0 ? (
        <p className="mt-8 text-brand-teal-700/90">{t("empty")}</p>
      ) : (
        <ul className="mt-10 divide-y divide-brand-teal-100">
          {articles.map((article) => (
            <li key={article.slug} className="py-8 first:pt-0">
              <Link
                href={`/news/${article.slug}`}
                className="group flex flex-col gap-6 sm:flex-row"
              >
                <ImageSlot
                  imageUrl={article.imageUrl}
                  imageAlt={article.imageAlt}
                  className="aspect-4/3 w-full shrink-0 sm:w-56"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-brand-teal-900 group-hover:text-brand-teal-600">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-sm text-brand-teal-600">
                    {article.authorName} · {formatDate(article.date, locale)}
                  </p>
                  {article.excerpt && (
                    <p className="mt-3 text-brand-teal-700/90">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between border-t border-brand-teal-100 pt-6">
          {page > 1 ? (
            <Link
              href={{ pathname: "/news", query: { page: page - 1 } }}
              className="rounded-full border border-brand-teal-200 px-4 py-2 text-sm font-medium text-brand-teal-700 hover:bg-brand-teal-50"
            >
              ← {t("previous")}
            </Link>
          ) : (
            <span />
          )}
          <p className="text-sm text-brand-teal-600">
            {t("pageIndicator", { page, total: totalPages })}
          </p>
          {page < totalPages ? (
            <Link
              href={{ pathname: "/news", query: { page: page + 1 } }}
              className="rounded-full border border-brand-teal-200 px-4 py-2 text-sm font-medium text-brand-teal-700 hover:bg-brand-teal-50"
            >
              {t("next")} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </section>
  );
}
