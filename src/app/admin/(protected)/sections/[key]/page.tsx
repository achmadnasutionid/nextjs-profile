import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSection } from "../../actions";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const section = await prisma.pageSection.findUnique({
    where: { key },
    include: { media: true },
  });
  if (!section) notFound();

  const action = updateSection.bind(null, key);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/admin" className="text-sm text-brand-teal-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-teal-900">
        Edit: {key}
      </h1>

      <form action={action} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Title (English)
            <input
              name="titleEn"
              defaultValue={section.titleEn}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Title (Indonesian)
            <input
              name="titleId"
              defaultValue={section.titleId}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Body (English)
            <textarea
              name="bodyEn"
              defaultValue={section.bodyEn}
              rows={5}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Body (Indonesian)
            <textarea
              name="bodyId"
              defaultValue={section.bodyId}
              rows={5}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          {section.media && (
            <Image
              src={section.media.url}
              alt=""
              width={200}
              height={140}
              className="mb-3 h-32 w-auto rounded-lg object-cover"
            />
          )}
          <label className="block text-sm font-medium text-zinc-700">
            Replace image
            <input
              type="file"
              name="image"
              accept="image/*"
              className="mt-1 block text-sm"
            />
          </label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700">
              Image alt text (English)
              <input
                name="altTextEn"
                defaultValue={section.media?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image alt text (Indonesian)
              <input
                name="altTextId"
                defaultValue={section.media?.altTextId}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {key === "profileSummary" && (
          <div className="rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-semibold text-brand-teal-900">
              COMPRO document
            </p>
            {section.fileUrl && (
              <a
                href={section.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand-teal-600 underline"
              >
                View current file →
              </a>
            )}
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-zinc-700">
                {section.fileUrl ? "Replace PDF" : "Upload PDF"}
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  className="mt-1 block text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Button label
                <input
                  name="fileName"
                  defaultValue={section.fileName ?? "Download COMPRO"}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        )}

        {key === "cta" && (
          <div className="rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-semibold text-brand-teal-900">
              Contact buttons
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-zinc-700">
                WhatsApp number
                <input
                  name="whatsappNumber"
                  defaultValue={section.whatsappNumber ?? ""}
                  placeholder="6281234567890"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-zinc-500">
                  International format, digits only (no + or spaces). Leave blank to hide the WhatsApp button.
                </span>
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Google Maps link
                <input
                  name="googleMapsUrl"
                  defaultValue={section.googleMapsUrl ?? ""}
                  placeholder="https://maps.app.goo.gl/..."
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-zinc-500">
                  Paste the share link from Google Maps for your location. Leave blank to hide the Find Us button.
                </span>
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Contact form recipient email
              <input
                name="contactEmail"
                type="email"
                defaultValue={section.contactEmail ?? ""}
                placeholder="hello@bonanauliperkasa.com"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
              <span className="mt-1 block text-xs text-zinc-500">
                Messages submitted on the Contact page are emailed here. Leave blank and the form will show an error until this is set.
              </span>
            </label>
          </div>
        )}

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
