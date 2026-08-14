"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

const links = [
  { href: "/", key: "home" },
  { href: "/profile", key: "profile" },
  { href: "/news", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader({ logoUrl }: { logoUrl?: string | null }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-brand-teal-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo logoUrl={logoUrl} />
        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-teal-700 sm:flex">
          {links.map(({ href, key }) => (
            <Link key={href} href={href} className="hover:text-brand-teal-900">
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("menu")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-teal-100 text-brand-teal-700 sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-teal-100 bg-white px-6 py-3 text-sm font-medium text-brand-teal-700 sm:hidden">
          {links.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2.5 hover:bg-brand-teal-50 hover:text-brand-teal-900"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
