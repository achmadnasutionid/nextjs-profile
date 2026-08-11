import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-20 border-b border-brand-teal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-teal-700 sm:flex">
          <Link href="/" className="hover:text-brand-teal-900">
            {t("home")}
          </Link>
          <Link href="/profile" className="hover:text-brand-teal-900">
            {t("profile")}
          </Link>
          <Link href="/news" className="hover:text-brand-teal-900">
            {t("blog")}
          </Link>
          <Link href="/contact" className="hover:text-brand-teal-900">
            {t("contact")}
          </Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
