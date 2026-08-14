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
    include: { logo: true },
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
            Header &amp; footer logo
          </p>
          {siteConfig?.logo && (
            <Image
              src={siteConfig.logo.url}
              alt=""
              width={72}
              height={72}
              className="mt-3 mb-3 h-16 w-16 rounded-full object-cover"
            />
          )}
          <label className="block text-sm font-medium text-zinc-700">
            {siteConfig?.logo ? "Replace logo" : "Upload logo"}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="mt-1 block text-sm"
            />
          </label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (English)
              <input
                name="altTextEn"
                defaultValue={siteConfig?.logo?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Alt text (Indonesian)
              <input
                name="altTextId"
                defaultValue={siteConfig?.logo?.altTextId}
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
