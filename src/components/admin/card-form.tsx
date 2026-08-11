import Link from "next/link";
import Image from "next/image";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export type CardFormInitial = {
  nameEn: string;
  nameId: string;
  detailEn: string;
  detailId: string;
  mediaUrl?: string;
  altTextEn?: string;
  altTextId?: string;
};

export function CardForm({
  title,
  backHref,
  nameLabel = "Name",
  detailLabel = "Detail",
  action,
  submitLabel,
  initial,
  deleteAction,
  deleteId,
  deleteConfirmMessage,
}: {
  title: string;
  backHref: string;
  nameLabel?: string;
  detailLabel?: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  initial?: CardFormInitial;
  deleteAction?: (formData: FormData) => Promise<void>;
  deleteId?: string;
  deleteConfirmMessage?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href={backHref} className="text-sm text-brand-teal-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-teal-900">{title}</h1>

      <form action={action} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            {nameLabel} (English)
            <input
              name="nameEn"
              defaultValue={initial?.nameEn}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            {nameLabel} (Indonesian)
            <input
              name="nameId"
              defaultValue={initial?.nameId}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            {detailLabel} (English)
            <textarea
              name="detailEn"
              defaultValue={initial?.detailEn}
              rows={4}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            {detailLabel} (Indonesian)
            <textarea
              name="detailId"
              defaultValue={initial?.detailId}
              rows={4}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          {initial?.mediaUrl && (
            <Image
              src={initial.mediaUrl}
              alt=""
              width={200}
              height={140}
              className="mb-3 h-32 w-auto rounded-lg object-cover"
            />
          )}
          <label className="block text-sm font-medium text-zinc-700">
            {initial?.mediaUrl ? "Replace image" : "Image"}
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
                defaultValue={initial?.altTextEn}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image alt text (Indonesian)
              <input
                name="altTextId"
                defaultValue={initial?.altTextId}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700"
        >
          {submitLabel}
        </button>
      </form>

      {deleteAction && deleteId && (
        <form action={deleteAction} className="mt-4">
          <input type="hidden" name="id" value={deleteId} />
          <ConfirmSubmitButton
            confirmMessage={deleteConfirmMessage ?? "Delete this item? This cannot be undone."}
            className="text-sm font-semibold text-red-600 hover:text-red-800"
          >
            Delete
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
