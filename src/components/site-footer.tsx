import { useTranslations } from "next-intl";
import { Logo } from "./logo";

export function SiteFooter({ logoUrl }: { logoUrl?: string | null }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-teal-100 bg-brand-teal-900 text-brand-teal-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="[&_span]:text-white" logoUrl={logoUrl} />
        <p className="text-sm">
          &copy; {year} Bona Nauli Perkasa. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
