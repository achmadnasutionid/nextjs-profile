import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost, deletePost } from "../actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { coverMedia: true },
  });
  if (!post) notFound();

  const action = updatePost.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/admin/blog" className="text-sm text-brand-teal-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-teal-900">
        Edit article
      </h1>

      <form action={action} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Title (English)
            <input
              name="titleEn"
              defaultValue={post.titleEn}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Title (Indonesian)
            <input
              name="titleId"
              defaultValue={post.titleId}
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
              defaultValue={post.excerptEn}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Excerpt (Indonesian)
            <textarea
              name="excerptId"
              defaultValue={post.excerptId}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Content (English)
          </p>
          <RichTextEditor name="bodyEn" defaultValue={post.bodyEn} />
        </div>
        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Content (Indonesian)
          </p>
          <RichTextEditor name="bodyId" defaultValue={post.bodyId} />
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          {post.coverMedia && (
            <Image
              src={post.coverMedia.url}
              alt=""
              width={200}
              height={140}
              className="mb-3 h-32 w-auto rounded-lg object-cover"
            />
          )}
          <label className="block text-sm font-medium text-zinc-700">
            {post.coverMedia ? "Replace cover image" : "Cover image"}
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
                defaultValue={post.coverMedia?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image alt text (Indonesian)
              <input
                name="altTextId"
                defaultValue={post.coverMedia?.altTextId}
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
              defaultValue={post.authorName}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Status
            <select
              name="status"
              defaultValue={post.status}
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
          Save changes
        </button>
      </form>

      <form action={deletePost} className="mt-4">
        <input type="hidden" name="id" value={post.id} />
        <ConfirmSubmitButton
          confirmMessage={`Delete "${post.titleEn}"? This cannot be undone.`}
          className="text-sm font-semibold text-red-600 hover:text-red-800"
        >
          Delete this article
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
