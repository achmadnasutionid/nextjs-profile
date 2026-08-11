"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = { en: "EN", id: "ID" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-full border border-brand-teal-100 bg-white p-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            loc === locale
              ? "bg-brand-teal-600 text-white"
              : "text-brand-teal-700 hover:bg-brand-teal-50"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
