import Link from "next/link";
import Image from "next/image";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export type CardListItem = {
  id: string;
  nameEn: string;
  nameId: string;
  mediaUrl?: string;
};

export function CardListPage({
  title,
  basePath,
  addLabel,
  emptyLabel,
  items,
  deleteAction,
  saved,
  deleted,
}: {
  title: string;
  basePath: string;
  addLabel: string;
  emptyLabel: string;
  items: CardListItem[];
  deleteAction: (formData: FormData) => Promise<void>;
  saved?: string;
  deleted?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/admin" className="text-sm text-brand-teal-600">
        ← Back
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-teal-900">{title}</h1>
        <Link
          href={`${basePath}/new`}
          className="rounded-full bg-brand-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700"
        >
          {addLabel}
        </Link>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-brand-lime-100 px-4 py-3 text-sm text-brand-teal-900">
          Saved successfully.
        </p>
      )}
      {deleted && (
        <p className="mt-4 rounded-lg bg-brand-lime-100 px-4 py-3 text-sm text-brand-teal-900">
          Deleted.
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-6 py-4">
            {item.mediaUrl ? (
              <Image
                src={item.mediaUrl}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-brand-teal-50" />
            )}
            <div className="flex-1">
              <p className="font-medium text-brand-teal-900">{item.nameEn}</p>
              <p className="text-sm text-zinc-500">{item.nameId}</p>
            </div>
            <Link
              href={`${basePath}/${item.id}`}
              className="text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-800"
            >
              Edit
            </Link>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={item.id} />
              <ConfirmSubmitButton
                confirmMessage={`Delete "${item.nameEn}"? This cannot be undone.`}
                className="text-sm font-semibold text-red-600 hover:text-red-800"
              >
                Delete
              </ConfirmSubmitButton>
            </form>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-zinc-500">
            {emptyLabel}
          </li>
        )}
      </ul>
    </div>
  );
}
