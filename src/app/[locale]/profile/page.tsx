import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSections, toListItems } from "@/lib/content";
import { ImageSlot } from "@/components/image-slot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile.summary" });

  return {
    title: "Company Profile",
    description: t("bodyFallback"),
    alternates: { canonical: `/${locale}/profile` },
  };
}

export default async function ProfilePage({
  params,
}: PageProps<"/[locale]/profile">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tSummary, tVisi, tMisi, tCulture, tHalal, tBpom] = await Promise.all([
    getTranslations({ locale, namespace: "profile.summary" }),
    getTranslations({ locale, namespace: "profile.visi" }),
    getTranslations({ locale, namespace: "profile.misi" }),
    getTranslations({ locale, namespace: "profile.culture" }),
    getTranslations({ locale, namespace: "profile.halal" }),
    getTranslations({ locale, namespace: "profile.bpom" }),
  ]);

  const sections = await getSections(locale);

  const summary = sections.profileSummary ?? {
    title: tSummary("titleFallback"),
    body: tSummary("bodyFallback"),
  };
  const visi = sections.visi ?? {
    title: tVisi("titleFallback"),
    body: tVisi("bodyFallback"),
  };
  const misi = sections.misi ?? {
    title: tMisi("titleFallback"),
    body: tMisi("bodyFallback"),
  };
  const culture = sections.corporateCulture ?? {
    title: tCulture("titleFallback"),
    body: tCulture("bodyFallback"),
  };
  const halal = sections.halal ?? { title: tHalal("titleFallback"), body: "" };
  const bpom = sections.bpom ?? { title: tBpom("titleFallback"), body: "" };

  const misiItems = toListItems(misi.body);
  const cultureItems = toListItems(culture.body);

  return (
    <>
      {/* Logo + Summary */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <ImageSlot
            imageUrl={summary.imageUrl}
            imageAlt={summary.imageAlt}
            className="mx-auto h-16 w-16"
            rounded="full"
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-brand-teal-900 sm:text-4xl">
            {summary.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-brand-teal-700/90">
            {summary.body}
          </p>
          {summary.fileUrl && (
            <a
              href={summary.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-lime-400 px-6 py-3 text-sm font-semibold text-brand-teal-900 transition-colors hover:bg-brand-lime-300"
            >
              {summary.fileName || "Download COMPRO"}
            </a>
          )}
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-brand-teal-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:py-20 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-teal-100 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-lime-600">
              {visi.title}
            </p>
            <p className="mt-4 text-lg leading-8 text-brand-teal-700/90">
              {visi.body}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-teal-100 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-lime-600">
              {misi.title}
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-lg leading-8 text-brand-teal-700/90">
              {misiItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Corporate Culture */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ImageSlot
            imageUrl={culture.imageUrl}
            imageAlt={culture.imageAlt}
            className="aspect-4/3 w-full"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-teal-900">
              {culture.title}
            </h2>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-lg leading-8 text-brand-teal-700/90">
              {cultureItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Halal & BPOM */}
      <section className="bg-brand-teal-50">
        <div className="mx-auto grid max-w-4xl gap-6 px-6 py-16 sm:py-20 sm:grid-cols-2">
          {[halal, bpom].map((cert) => (
            <div
              key={cert.title}
              className="overflow-hidden rounded-2xl border border-brand-teal-100 bg-white"
            >
              <ImageSlot
                imageUrl={cert.imageUrl}
                imageAlt={cert.imageAlt}
                className="aspect-square w-full"
                rounded="none"
              />
              <p className="p-6 text-center text-lg font-semibold text-brand-teal-900">
                {cert.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
