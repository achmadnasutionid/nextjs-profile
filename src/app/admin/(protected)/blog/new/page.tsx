import Link from "next/link";
import { auth } from "@/auth";
import { createPost } from "../actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default async function NewArticlePage() {
  const session = await auth();
  const defaultAuthor = session?.user?.name || session?.user?.email || "Bona Nauli Perkasa";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/admin/blog" className="text-sm text-brand-teal-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-teal-900">
        Add article
      </h1>

      <form action={createPost} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Title (English)
            <input
              name="titleEn"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Title (Indonesian)
            <input
              name="titleId"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Excerpt (English)
            <textarea
              name="excerptEn"
              rows={2}
              placeholder="Short summary shown in the article list"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Excerpt (Indonesian)
            <textarea
              name="excerptId"
              rows={2}
              placeholder="Ringkasan singkat yang tampil di daftar artikel"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Content (English)
          </p>
          <RichTextEditor name="bodyEn" />
        </div>
        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Content (Indonesian)
          </p>
          <RichTextEditor name="bodyId" />
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          <label className="block text-sm font-medium text-zinc-700">
            Cover image
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
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image alt text (Indonesian)
              <input
                name="altTextId"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Author name
            <input
              name="authorName"
              defaultValue={defaultAuthor}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Status
            <select
              name="status"
              defaultValue="DRAFT"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            >
              <option value="DRAFT">Draft (not visible on the site)</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700"
        >
          Add article
        </button>
      </form>
    </div>
  );
}
