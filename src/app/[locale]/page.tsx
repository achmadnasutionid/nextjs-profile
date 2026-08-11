import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSections, getProducts, getTeamMembers, type CardItem } from "@/lib/content";
import { ImageSlot } from "@/components/image-slot";
import { siteUrl, siteName } from "@/lib/site";

function CardGrid({
  items,
  shape = "square",
}: {
  items: CardItem[];
  shape?: "square" | "circle";
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {items.map((item, index) => {
        const isLastOdd = index === items.length - 1 && items.length % 2 === 1;
        const centering = isLastOdd
          ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)]"
          : "";

        if (shape === "circle") {
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center text-center ${centering}`}
            >
              <ImageSlot
                imageUrl={item.imageUrl}
                imageAlt={item.imageAlt}
                className="aspect-square w-40"
                rounded="full"
              />
              <h3 className="mt-4 text-xl font-semibold text-brand-teal-900">
                {item.name}
              </h3>
              <p className="mt-2 text-brand-teal-700/90">{item.detail}</p>
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-2xl border border-brand-teal-100 bg-white ${centering}`}
          >
            <ImageSlot
              imageUrl={item.imageUrl}
              imageAlt={item.imageAlt}
              className="aspect-4/3 w-full"
              rounded="none"
            />
            <div className="p-8">
              <h3 className="text-xl font-semibold text-brand-teal-900">
                {item.name}
              </h3>
              <p className="mt-2 text-brand-teal-700/90">{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function whatsappHref(number: string) {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tAbout, tTeam, tProducts, tCta] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "team" }),
    getTranslations({ locale, namespace: "products" }),
    getTranslations({ locale, namespace: "cta" }),
  ]);

  const [sections, products, teamMembers] = await Promise.all([
    getSections(locale),
    getProducts(locale),
    getTeamMembers(locale),
  ]);

  const hero = sections.hero ?? {
    title: t("titleFallback"),
    body: t("bodyFallback"),
  };
  const about = sections.about ?? {
    title: tAbout("titleFallback"),
    body: tAbout("bodyFallback"),
  };
  const teamSection = sections.team ?? {
    title: tTeam("titleFallback"),
    body: tTeam("bodyFallback"),
  };
  const productsSection = sections.products ?? {
    title: tProducts("titleFallback"),
    body: tProducts("bodyFallback"),
  };
  const cta = sections.cta ?? {
    title: tCta("titleFallback"),
    body: tCta("bodyFallback"),
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: hero.body,
    industry: "Agriculture",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {hero.imageUrl ? (
          <>
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt ?? ""}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-teal-900/85 via-brand-teal-900/70 to-brand-teal-900/90" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-700 to-brand-teal-900" />
        )}
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-lime-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
            {hero.body}
          </p>
          <Link
            href="/profile"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-lime-400 px-6 py-3 text-sm font-semibold text-brand-teal-900 transition-colors hover:bg-brand-lime-300"
          >
            {t("cta")}
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="bg-brand-teal-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <ImageSlot
            imageUrl={about.imageUrl}
            imageAlt={about.imageAlt}
            className="aspect-4/3 w-full lg:order-1"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-teal-900">
              {about.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-brand-teal-700/90">
              {about.body}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-teal-900">
            {productsSection.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-brand-teal-700/90">
            {productsSection.body}
          </p>
        </div>
        <CardGrid items={products} shape="square" />
      </section>

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-teal-900">
              {teamSection.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-brand-teal-700/90">
              {teamSection.body}
            </p>
          </div>
          <CardGrid items={teamMembers} shape="circle" />
        </section>
      )}

      {/* CTA / Contact */}
      <section
        id="contact"
        className="bg-gradient-to-br from-brand-teal-700 to-brand-teal-900"
      >
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-teal-100">
            {cta.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {cta.whatsappNumber && (
              <a
                href={whatsappHref(cta.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand-lime-400 px-6 py-3 text-sm font-semibold text-brand-teal-900 transition-colors hover:bg-brand-lime-300"
              >
                {tCta("button")}
              </a>
            )}
            {cta.googleMapsUrl && (
              <a
                href={cta.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {tCta("findUs")}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
