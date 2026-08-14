import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { updateSiteConfig } from "../actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 1 },
    include: { headerLogo: true, footerLogo: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/admin" className="text-sm text-brand-teal-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-teal-900">
        Site Settings
      </h1>

      {saved && (
        <p className="mt-4 rounded-lg bg-brand-lime-100 px-4 py-3 text-sm text-brand-teal-900">
          Logo saved successfully.
        </p>
      )}

      <form action={updateSiteConfig} className="mt-6 space-y-6">
        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          <p className="text-sm font-semibold text-brand-teal-900">
            Header logo
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Shown on a white background — use a dark or colored version of
            the logo so it stays visible.
          </p>
          {siteConfig?.headerLogo && (
            <div className="mt-3 mb-3 inline-block rounded-lg bg-white p-3">
              <Image
                src={siteConfig.headerLogo.url}
                alt=""
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <label className="block text-sm font-medium text-zinc-700">
            {siteConfig?.headerLogo ? "Replace header logo" : "Upload header logo"}
            <input
              type="file"
              name="headerImage"
              accept="image/*"
              className="mt-1 block text-sm"
            />
          </label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (English)
              <input
                name="headerAltTextEn"
                defaultValue={siteConfig?.headerLogo?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (Indonesian)
              <input
                name="headerAltTextId"
                defaultValue={siteConfig?.headerLogo?.altTextId}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          <p className="text-sm font-semibold text-brand-teal-900">
            Footer logo
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Shown on the dark teal footer — use a white or light version of
            the logo so it stays visible.
          </p>
          {siteConfig?.footerLogo && (
            <div className="mt-3 mb-3 inline-block rounded-lg bg-brand-teal-900 p-3">
              <Image
                src={siteConfig.footerLogo.url}
                alt=""
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <label className="block text-sm font-medium text-zinc-700">
            {siteConfig?.footerLogo ? "Replace footer logo" : "Upload footer logo"}
            <input
              type="file"
              name="footerImage"
              accept="image/*"
              className="mt-1 block text-sm"
            />
          </label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (English)
              <input
                name="footerAltTextEn"
                defaultValue={siteConfig?.footerLogo?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (Indonesian)
              <input
                name="footerAltTextId"
                defaultValue={siteConfig?.footerLogo?.altTextId}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
