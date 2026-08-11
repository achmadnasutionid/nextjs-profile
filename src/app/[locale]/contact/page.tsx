import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSections } from "@/lib/content";
import { PhoneIcon, MapPinIcon } from "@/components/contact-icons";
import { submitContactForm } from "./actions";

function whatsappHref(number: string) {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Contact",
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const { sent, error } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const sections = await getSections(locale);
  const cta = sections.cta;

  const action = submitContactForm.bind(null, locale);

  const errorMessage =
    error === "not-configured"
      ? t("errorNotConfigured")
      : error === "send-failed"
        ? t("errorSendFailed")
        : error === "invalid"
          ? t("errorInvalid")
          : null;

  return (
    <>
      {/* Icon cards */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 sm:grid-cols-2">
          {cta?.whatsappNumber && (
            <a
              href={whatsappHref(cta.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal-600 to-brand-teal-900 transition-transform group-hover:scale-105">
                <PhoneIcon className="h-16 w-16 text-brand-lime-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-brand-teal-900">
                {t("callCard")}
              </p>
            </a>
          )}
          {cta?.googleMapsUrl && (
            <a
              href={cta.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal-600 to-brand-teal-900 transition-transform group-hover:scale-105">
                <MapPinIcon className="h-16 w-16 text-brand-lime-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-brand-teal-900">
                {t("mapCard")}
              </p>
            </a>
          )}
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-brand-teal-50">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-teal-900">
            {t("formTitle")}
          </h2>

          {sent && (
            <p className="mt-6 rounded-lg bg-white px-4 py-3 text-center text-sm text-brand-teal-900">
              {t("sentSuccess")}
            </p>
          )}
          {errorMessage && (
            <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <form action={action} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-brand-teal-900">
                {t("firstName")}
                <input
                  name="firstName"
                  required
                  className="mt-1 w-full rounded-lg border border-brand-teal-200 bg-white px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-brand-teal-900">
                {t("lastName")}
                <input
                  name="lastName"
                  required
                  className="mt-1 w-full rounded-lg border border-brand-teal-200 bg-white px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-brand-teal-900">
              {t("email")}
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded-lg border border-brand-teal-200 bg-white px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-brand-teal-900">
              {t("message")}
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-brand-teal-200 bg-white px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700 sm:w-auto"
            >
              {t("submit")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
